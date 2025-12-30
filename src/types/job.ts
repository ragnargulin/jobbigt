export type JobStatus = 'interesting' | 'applied' | 'interview' | 'offer' | 'rejected';

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  location?: string;
  description?: string;
  applicationDate?: string;
  contactPerson?: string;
  contactEmail?: string;
  status: JobStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Column {
  id: JobStatus;
  title: string;
  color: string;
}
