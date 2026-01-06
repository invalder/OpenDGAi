import { Dataset, ScanResult } from '../types';
import { db, functions } from '../config/firebase';
import {
    collection,
    getDocs,
    doc,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    Timestamp
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

const DATASETS_COLLECTION = 'datasets';
const SCANS_COLLECTION = 'scans';

export const createDataset = async (dataset: Omit<Dataset, 'id' | 'createdAt' | 'updatedAt'>): Promise<Dataset> => {
    return DatasetService.create(dataset);
};

export const DatasetService = {
  // Fetch all datasets
  getAll: async (): Promise<Dataset[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, DATASETS_COLLECTION));
        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                // Handle timestamps correctly
                createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            } as Dataset;
        });
    } catch (error) {
        console.error("Error getting datasets: ", error);
        return [];
    }
  },

  // Fetch a single dataset
  getById: async (id: string): Promise<Dataset | undefined> => {
    try {
        const docRef = doc(db, DATASETS_COLLECTION, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                id: docSnap.id,
                ...data,
                createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            } as Dataset;
        } else {
            return undefined;
        }
    } catch (error) {
        console.error("Error getting dataset: ", error);
        return undefined;
    }
  },

  // Create a dataset
  create: async (dataset: Omit<Dataset, 'id' | 'createdAt' | 'updatedAt'>): Promise<Dataset> => {
     try {
        const newDataset = {
            ...dataset,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        };
        const docRef = await addDoc(collection(db, DATASETS_COLLECTION), newDataset);
        return {
            id: docRef.id,
            ...dataset,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        } as Dataset;
     } catch (error) {
        console.error("Error adding dataset: ", error);
        throw error;
     }
  },

  // Update a dataset
  update: async (id: string, updates: Partial<Dataset>): Promise<Dataset | null> => {
    try {
        const docRef = doc(db, DATASETS_COLLECTION, id);
        await updateDoc(docRef, {
            ...updates,
            updatedAt: Timestamp.now()
        });

        // Return updated object (fetching again or merging)
        return await DatasetService.getById(id) || null;
    } catch (error) {
        console.error("Error updating dataset: ", error);
        return null;
    }
  },

  // Delete a dataset
  delete: async (id: string): Promise<boolean> => {
    try {
        await deleteDoc(doc(db, DATASETS_COLLECTION, id));
        return true;
    } catch (error) {
        console.error("Error deleting dataset: ", error);
        return false;
    }
  },

  // Save scan results (Manual Save - usually handled by backend, but kept for compatibility)
  saveScanResult: async (result: ScanResult): Promise<void> => {
    try {
         await addDoc(collection(db, SCANS_COLLECTION), {
             ...result,
             timestamp: Timestamp.now()
         });
    } catch (error) {
        console.error("Error saving scan result: ", error);
    }
  },

  // Trigger Cloud Function Scan
  scanDataset: async (datasetId: string, data: any[]): Promise<ScanResult> => {
      try {
          const scanFunction = httpsCallable(functions, 'scanDataset');
          const response = await scanFunction({ datasetId, data });
          return response.data as ScanResult;
      } catch (error) {
          console.error("Error calling scan function: ", error);
          throw error;
      }
  },

  // Get scan results
  getScanResult: async (datasetId: string): Promise<ScanResult | undefined> => {
    try {
        const q = query(collection(db, SCANS_COLLECTION), where("datasetId", "==", datasetId));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
             const data = querySnapshot.docs[0].data();
             return data as ScanResult; // simplified, might need mapping
        }
        return undefined;
    } catch (error) {
        console.error("Error getting scan result: ", error);
        return undefined;
    }
  }
};
