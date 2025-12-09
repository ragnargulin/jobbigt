import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { JobApplication, JobStatus } from '../types/job';
import { KanbanBoard } from './KanbanBoard';
import { JobForm } from './JobForm';

export function Dashboard() {
  const { currentUser, logout } = useAuth();
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobApplication | undefined>();

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  }

  const handleAddJob = (jobData: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newJob: JobApplication = {
      ...jobData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setJobs(prev => [...prev, newJob]);
    setShowForm(false);
  };

  const handleEditJob = (jobData: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingJob) {
      setJobs(prev => prev.map(job =>
        job.id === editingJob.id
          ? { ...jobData, id: job.id, createdAt: job.createdAt, updatedAt: new Date() }
          : job
      ));
      setEditingJob(undefined);
      setShowForm(false);
    }
  };

  const handleDeleteJob = (jobId: string) => {
    if (confirm('Är du säker på att du vill ta bort denna ansökan?')) {
      setJobs(prev => prev.filter(job => job.id !== jobId));
    }
  };

  const handleJobMove = (jobId: string, newStatus: JobStatus) => {
    setJobs(prev => prev.map(job =>
      job.id === jobId
        ? { ...job, status: newStatus, updatedAt: new Date() }
        : job
    ));
  };

  const openEditForm = (job: JobApplication) => {
    setEditingJob(job);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingJob(undefined);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">Mina jobbansökningar</h2>
          <p>{currentUser?.email || 'Gästanvändare'}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowForm(true)} className="border p-2">
            Ny ansökan
          </button>
          <button onClick={handleLogout} className="border p-2">
            Logga ut
          </button>
        </div>
      </div>

      <KanbanBoard
        jobs={jobs}
        onJobMove={handleJobMove}
        onJobEdit={openEditForm}
        onJobDelete={handleDeleteJob}
      />

      {showForm && (
        <JobForm
          job={editingJob}
          onSubmit={editingJob ? handleEditJob : handleAddJob}
          onCancel={closeForm}
        />
      )}
    </div>
  );
}
