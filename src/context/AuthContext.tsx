import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteField
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType, testFirestoreConnection } from '../lib/firebase';
import { submitManualPaymentRequest } from '../services/paymentService';
import { UserSubscription, UserRole, SubscriptionStatus, PaymentMethod } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserSubscription | null;
  userRole: UserRole;
  subscriptionStatus: SubscriptionStatus;
  isAdmin: boolean;
  isPremium: boolean;
  loading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  loginWithGoogle: () => Promise<void>;
  loginAsAdmin: () => Promise<boolean>;
  loginAsMember: () => Promise<UserRole>;
  logout: () => Promise<void>;
  submitPaymentProof: (trxId: string, screenshotUrl: string, paymentMethod?: PaymentMethod) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  cancelSubscription: () => Promise<void>;
  toggleSavePrompt: (promptId: string) => Promise<void>;
  isPromptSaved: (promptId: string) => boolean;
}

const BOOTSTRAPPED_ADMIN_EMAILS = [
  'shayanawan64@gmail.com',
  'decorio360@gmail.com'
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const checkAdminStatus = async (user: FirebaseUser, profile?: UserSubscription | null): Promise<boolean> => {
  if (profile?.role === 'admin') {
    return true;
  }
  if (user.email && BOOTSTRAPPED_ADMIN_EMAILS.includes(user.email.toLowerCase())) {
    return true;
  }
  try {
    const adminSnap = await getDoc(doc(db, 'admins', user.uid));
    return adminSnap.exists();
  } catch {
    return false;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserSubscription | null>(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const loadOrCreateUserProfile = async (user: FirebaseUser): Promise<UserSubscription> => {
    const userDocRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userDocRef);

    if (snap.exists()) {
      const data = snap.data() as Partial<UserSubscription>;
      const derivedStatus: SubscriptionStatus =
        data.subscriptionStatus === 'active' ||
        data.subscriptionStatus === 'inactive' ||
        data.subscriptionStatus === 'pending'
          ? data.subscriptionStatus
          : data.is_premium
          ? 'active'
          : 'inactive';

      if (!data.subscriptionStatus) {
        await updateDoc(userDocRef, { subscriptionStatus: derivedStatus });
      }

      return {
        uid: user.uid,
        email: data.email || user.email || '',
        display_name: data.display_name || user.displayName || 'Creator',
        photo_url: data.photo_url || user.photoURL || '',
        subscriptionStatus: derivedStatus,
        is_premium: derivedStatus === 'active' || Boolean(data.is_premium),
        role: data.role || 'user',
        saved_prompt_ids: data.saved_prompt_ids || [],
        ...(data.plan ? { plan: data.plan } : {}),
        ...(data.premium_until ? { premium_until: data.premium_until } : {}),
        ...(data.stripe_customer_id ? { stripe_customer_id: data.stripe_customer_id } : {})
      };
    }

    const newProfile: UserSubscription = {
      uid: user.uid,
      email: user.email || '',
      display_name: user.displayName || 'Creator',
      photo_url: user.photoURL || '',
      subscriptionStatus: 'inactive',
      is_premium: false,
      role: 'user',
      saved_prompt_ids: []
    };

    await setDoc(userDocRef, {
      ...newProfile,
      created_at: new Date().toISOString()
    });
    return newProfile;
  };

  useEffect(() => {
    testFirestoreConnection();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const profile = await loadOrCreateUserProfile(user);
          const adminStatus = await checkAdminStatus(user, profile);
          setUserProfile(profile);
          setIsAdminUser(adminStatus);
        } catch (err) {
          console.error('Error fetching/creating user profile:', err);
          const fallbackAdmin = Boolean(
            user.email && BOOTSTRAPPED_ADMIN_EMAILS.includes(user.email.toLowerCase())
          );
          setIsAdminUser(fallbackAdmin);
          setUserProfile({
            uid: user.uid,
            email: user.email || '',
            display_name: user.displayName || 'Creator',
            photo_url: user.photoURL || '',
            subscriptionStatus: 'inactive',
            is_premium: false,
            role: 'user',
            saved_prompt_ids: []
          });
        }
      } else {
        setUserProfile(null);
        setIsAdminUser(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshUserProfile = async () => {
    if (!currentUser) return;
    try {
      const profile = await loadOrCreateUserProfile(currentUser);
      const adminStatus = await checkAdminStatus(currentUser, profile);
      setUserProfile(profile);
      setIsAdminUser(adminStatus);
    } catch (err) {
      console.error('Failed to refresh user profile:', err);
    }
  };

  const loginWithGoogle = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Failed to sign in with Google:', err);
      throw err;
    }
  };

  const loginAsAdmin = async (): Promise<boolean> => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const profile = await loadOrCreateUserProfile(user);
      const adminStatus = await checkAdminStatus(user, profile);

      if (!adminStatus) {
        await firebaseSignOut(auth);
        setUserProfile(null);
        setIsAdminUser(false);
        setAuthError(
          `Access Denied: ${user.email || 'This account'} does not have administrator privileges.`
        );
        return false;
      }

      setUserProfile(profile);
      setIsAdminUser(true);
      return true;
    } catch (err) {
      console.error('Admin sign in error:', err);
      setAuthError('Admin sign-in was cancelled or failed. Please try again.');
      return false;
    }
  };

  const loginAsMember = async (): Promise<UserRole> => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const profile = await loadOrCreateUserProfile(user);
      const adminStatus = await checkAdminStatus(user, profile);
      setUserProfile(profile);
      setIsAdminUser(adminStatus);

      if (adminStatus) return 'admin';
      return profile.subscriptionStatus === 'active' || profile.is_premium ? 'subscriber' : 'free';
    } catch (err) {
      console.error('Member sign in error:', err);
      return 'guest';
    }
  };

  const logout = async () => {
    setAuthError(null);
    try {
      await firebaseSignOut(auth);
      setUserProfile(null);
      setIsAdminUser(false);
    } catch (err) {
      console.error('Failed to sign out:', err);
    }
  };

  const submitPaymentProof = async (
    trxId: string,
    screenshotUrl: string,
    paymentMethod?: PaymentMethod
  ) => {
    if (!currentUser) {
      throw new Error('Please sign in before submitting a payment request.');
    }

    await submitManualPaymentRequest({
      userId: currentUser.uid,
      userEmail: currentUser.email || userProfile?.email || '',
      trxId,
      screenshotUrl,
      paymentMethod
    });

    setUserProfile((prev) =>
      prev
        ? { ...prev, subscriptionStatus: 'pending', is_premium: false }
        : {
            uid: currentUser.uid,
            email: currentUser.email || '',
            display_name: currentUser.displayName || 'Creator',
            photo_url: currentUser.photoURL || '',
            subscriptionStatus: 'pending',
            is_premium: false,
            role: 'user',
            saved_prompt_ids: []
          }
    );
  };

  const cancelSubscription = async () => {
    if (!currentUser) return;
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        subscriptionStatus: 'inactive',
        is_premium: false,
        plan: deleteField()
      });
      setUserProfile((prev) =>
        prev
          ? { ...prev, subscriptionStatus: 'inactive', is_premium: false, plan: undefined }
          : null
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}`);
    }
  };

  const toggleSavePrompt = async (promptId: string) => {
    if (!currentUser || !userProfile) {
      await loginAsMember();
      return;
    }

    const currentSaved = userProfile.saved_prompt_ids || [];
    const isSaved = currentSaved.includes(promptId);
    const newSaved = isSaved
      ? currentSaved.filter((id) => id !== promptId)
      : [...currentSaved, promptId];

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, { saved_prompt_ids: newSaved });
      setUserProfile({ ...userProfile, saved_prompt_ids: newSaved });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}`);
    }
  };

  const isPromptSaved = (promptId: string) => {
    return !!userProfile?.saved_prompt_ids?.includes(promptId);
  };

  const subscriptionStatus: SubscriptionStatus =
    userProfile?.subscriptionStatus || (userProfile?.is_premium ? 'active' : 'inactive');

  const isAdmin = isAdminUser;
  const isPremium = Boolean(subscriptionStatus === 'active' || isAdmin);

  const userRole: UserRole = !currentUser
    ? 'guest'
    : isAdmin
    ? 'admin'
    : subscriptionStatus === 'active'
    ? 'subscriber'
    : 'free';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        userRole,
        subscriptionStatus,
        isAdmin,
        isPremium,
        loading,
        authError,
        clearAuthError: () => setAuthError(null),
        loginWithGoogle,
        loginAsAdmin,
        loginAsMember,
        logout,
        submitPaymentProof,
        refreshUserProfile,
        cancelSubscription,
        toggleSavePrompt,
        isPromptSaved
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};