import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { JobApplication, JobStatus } from '../types/job';
import { KanbanBoard } from './KanbanBoard';
import { JobForm } from './JobForm';
import { addJob, updateJob, deleteJob as deleteJobFromDB, updateJobStatus, subscribeToUserJobs } from '../services/jobService';

export function Dashboard() {
  const { currentUser, logout } = useAuth();
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobApplication | undefined>();

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = subscribeToUserJobs(currentUser.uid, (updatedJobs) => {
      setJobs(updatedJobs);
    });

    return () => unsubscribe();
  }, [currentUser]);

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  }

  const handleAddJob = async (jobData: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!currentUser) return;

    try {
      await addJob(currentUser.uid, jobData);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to add job:', error);
    }
  };

  const handleEditJob = async (jobData: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingJob) return;

    try {
      await updateJob(editingJob.id, jobData);
      setEditingJob(undefined);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to update job:', error);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Är du säker på att du vill ta bort denna ansökan?')) return;

    try {
      await deleteJobFromDB(jobId);
    } catch (error) {
      console.error('Failed to delete job:', error);
    }
  };

  const handleJobMove = async (jobId: string, newStatus: JobStatus) => {
    try {
      await updateJobStatus(jobId, newStatus);
    } catch (error) {
      console.error('Failed to update job status:', error);
    }
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
