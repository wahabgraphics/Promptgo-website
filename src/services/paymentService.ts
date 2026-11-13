import {
  collection,
  doc,
  getDocs,
  query,
  where,
  writeBatch
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { PaymentMethod, PaymentRequest } from '../types';

const PAYMENT_REQUESTS_COLLECTION = 'payment_requests';
const USERS_COLLECTION = 'users';

export interface SubmitPaymentInput {
  userId: string;
  userEmail: string;
  trxId: string;
  screenshotUrl: string;
  paymentMethod?: PaymentMethod;
}

export const submitManualPaymentRequest = async (
  input: SubmitPaymentInput
): Promise<string> => {
  const requestId = `pay_${Date.now()}_${input.userId.slice(0, 6)}`;
  const createdAt = new Date().toISOString();

  try {
    const batch = writeBatch(db);

    const requestRef = doc(db, PAYMENT_REQUESTS_COLLECTION, requestId);
    batch.set(requestRef, {
      userId: input.userId,
      userEmail: input.userEmail,
      trxId: input.trxId.trim(),
      screenshotUrl: input.screenshotUrl,
      ...(input.paymentMethod ? { paymentMethod: input.paymentMethod } : {}),
      status: 'pending',
      createdAt
    });

    const userRef = doc(db, USERS_COLLECTION, input.userId);
    batch.update(userRef, {
      subscriptionStatus: 'pending',
      is_premium: false
    });

    await batch.commit();
    return requestId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${PAYMENT_REQUESTS_COLLECTION}/${requestId}`);
  }
};

export const fetchPaymentRequests = async (
  onlyPending = true
): Promise<PaymentRequest[]> => {
  try {
    const colRef = collection(db, PAYMENT_REQUESTS_COLLECTION);
    const q = onlyPending ? query(colRef, where('status', '==', 'pending')) : query(colRef);
    const snapshot = await getDocs(q);

    const results: PaymentRequest[] = [];
    snapshot.forEach((docSnap) => {
      results.push({
        id: docSnap.id,
        ...(docSnap.data() as Omit<PaymentRequest, 'id'>)
      });
    });

    results.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, PAYMENT_REQUESTS_COLLECTION);
  }
};

export const approvePaymentRequest = async (
  requestId: string,
  userId: string,
  adminEmail?: string | null
): Promise<void> => {
  try {
    const batch = writeBatch(db);
    const reviewedAt = new Date().toISOString();
    const premiumUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const requestRef = doc(db, PAYMENT_REQUESTS_COLLECTION, requestId);
    batch.update(requestRef, {
      status: 'approved',
      reviewedAt,
      ...(adminEmail ? { reviewedBy: adminEmail } : {})
    });

    const userRef = doc(db, USERS_COLLECTION, userId);
    batch.update(userRef, {
      subscriptionStatus: 'active',
      is_premium: true,
      plan: 'monthly',
      premium_until: premiumUntil
    });

    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${PAYMENT_REQUESTS_COLLECTION}/${requestId}`);
  }
};

export const rejectPaymentRequest = async (
  requestId: string,
  userId: string,
  adminEmail?: string | null
): Promise<void> => {
  try {
    const batch = writeBatch(db);
    const reviewedAt = new Date().toISOString();

    const requestRef = doc(db, PAYMENT_REQUESTS_COLLECTION, requestId);
    batch.update(requestRef, {
      status: 'rejected',
      reviewedAt,
      ...(adminEmail ? { reviewedBy: adminEmail } : {})
    });

    const userRef = doc(db, USERS_COLLECTION, userId);
    batch.update(userRef, {
      subscriptionStatus: 'inactive',
      is_premium: false
    });

    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${PAYMENT_REQUESTS_COLLECTION}/${requestId}`);
  }
};