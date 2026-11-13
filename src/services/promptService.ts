import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  writeBatch
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { PromptItem, MasterPromptGuide } from '../types';
import { INITIAL_PROMPTS, INITIAL_MASTER_PROMPTS } from '../data/initialData';

const PROMPTS_COLLECTION = 'prompts';
const MASTER_PROMPTS_COLLECTION = 'master_prompts';

export const fetchAllPrompts = async (): Promise<PromptItem[]> => {
  try {
    const q = query(collection(db, PROMPTS_COLLECTION));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      if (typeof window !== 'undefined' && localStorage.getItem('ai_prompt_hub_cleared_defaults') === 'true') {
        return [];
      }
      // If collection is empty and not explicitly cleared, return initial prompts so app works out of the box
      return INITIAL_PROMPTS;
    }

    const items: PromptItem[] = [];
    snapshot.forEach((docSnap) => {
      items.push({
        id: docSnap.id,
        ...(docSnap.data() as Omit<PromptItem, 'id'>)
      });
    });

    return items;
  } catch (error) {
    console.warn('Failed to load prompts from Firestore, falling back to initial data:', error);
    return INITIAL_PROMPTS;
  }
};

export const fetchAllMasterPrompts = async (): Promise<MasterPromptGuide[]> => {
  try {
    const q = query(collection(db, MASTER_PROMPTS_COLLECTION));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return INITIAL_MASTER_PROMPTS;
    }

    const items: MasterPromptGuide[] = [];
    snapshot.forEach((docSnap) => {
      items.push({
        id: docSnap.id,
        ...(docSnap.data() as Omit<MasterPromptGuide, 'id'>)
      });
    });

    return items;
  } catch (error) {
    console.warn('Failed to load master prompts from Firestore, using initial data:', error);
    return INITIAL_MASTER_PROMPTS;
  }
};

const stripUndefined = <T extends Record<string, unknown>>(obj: T): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== '')
  ) as Partial<T>;
};

export const createPromptInFirestore = async (promptData: Omit<PromptItem, 'id'>): Promise<string> => {
  const id = 'prompt-' + Date.now();
  try {
    const cleanData = stripUndefined({
      ...promptData,
      created_at: new Date().toISOString()
    });
    await setDoc(doc(db, PROMPTS_COLLECTION, id), cleanData);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${PROMPTS_COLLECTION}/${id}`);
  }
};

export const updatePromptInFirestore = async (id: string, promptData: Partial<PromptItem>): Promise<void> => {
  try {
    await updateDoc(doc(db, PROMPTS_COLLECTION, id), stripUndefined(promptData));
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${PROMPTS_COLLECTION}/${id}`);
  }
};

export const deletePromptFromFirestore = async (id: string): Promise<void> => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ai_prompt_hub_cleared_defaults', 'true');
    }
    await deleteDoc(doc(db, PROMPTS_COLLECTION, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${PROMPTS_COLLECTION}/${id}`);
  }
};

export const deleteAllPromptsExcept = async (keepId: string): Promise<number> => {
  let deletedCount = 0;
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ai_prompt_hub_cleared_defaults', 'true');
    }
    const snapshot = await getDocs(collection(db, PROMPTS_COLLECTION));
    const batch = writeBatch(db);
    snapshot.forEach((docSnap) => {
      if (docSnap.id !== keepId) {
        batch.delete(docSnap.ref);
        deletedCount++;
      }
    });
    if (deletedCount > 0) {
      await batch.commit();
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, PROMPTS_COLLECTION);
  }
  return deletedCount;
};

export const seedDatabaseIfEmpty = async (): Promise<number> => {
  let seededCount = 0;
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ai_prompt_hub_cleared_defaults');
    }
    const snapshot = await getDocs(collection(db, PROMPTS_COLLECTION));
    if (snapshot.empty) {
      for (const item of INITIAL_PROMPTS) {
        const { id, ...data } = item;
        await setDoc(doc(db, PROMPTS_COLLECTION, id), stripUndefined(data));
        seededCount++;
      }
    }

    const masterSnapshot = await getDocs(collection(db, MASTER_PROMPTS_COLLECTION));
    if (masterSnapshot.empty) {
      for (const item of INITIAL_MASTER_PROMPTS) {
        const { id, ...data } = item;
        await setDoc(doc(db, MASTER_PROMPTS_COLLECTION, id), stripUndefined(data));
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, PROMPTS_COLLECTION);
  }
  return seededCount;
};