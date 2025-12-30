import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { JobApplication, JobStatus } from '../types/job';

const JOBS_COLLECTION = 'jobs';

export interface JobData {
  userId: string;
  company: string;
  position: string;
  location?: string;
  description?: string;
  applicationDate?: string;
  contactPerson?: string;
  contactEmail?: string;
  status: JobStatus;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const addJob = async (
  userId: string,
  jobData: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const docRef = await addDoc(collection(db, JOBS_COLLECTION), {
    ...jobData,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateJob = async (
  jobId: string,
  jobData: Partial<Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> => {
  const jobRef = doc(db, JOBS_COLLECTION, jobId);
  await updateDoc(jobRef, {
    ...jobData,
    updatedAt: serverTimestamp(),
  });
};

export const deleteJob = async (jobId: string): Promise<void> => {
  const jobRef = doc(db, JOBS_COLLECTION, jobId);
  await deleteDoc(jobRef);
};

export const updateJobStatus = async (
  jobId: string,
  status: JobStatus
): Promise<void> => {
  const jobRef = doc(db, JOBS_COLLECTION, jobId);
  await updateDoc(jobRef, {
    status,
    updatedAt: serverTimestamp(),
  });
};

export const subscribeToUserJobs = (
  userId: string,
  callback: (jobs: JobApplication[]) => void
): (() => void) => {
  const q = query(
    collection(db, JOBS_COLLECTION),
    where('userId', '==', userId)
  );

  return onSnapshot(q, (snapshot) => {
    const jobs: JobApplication[] = snapshot.docs.map((doc) => {
      const data = doc.data() as JobData;
      return {
        id: doc.id,
        company: data.company,
        position: data.position,
        location: data.location,
        description: data.description,
        applicationDate: data.applicationDate,
        contactPerson: data.contactPerson,
        contactEmail: data.contactEmail,
        status: data.status,
        notes: data.notes,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    });
    callback(jobs);
  });
};
