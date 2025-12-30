import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { JobApplication, JobStatus } from '../types/job';
import { KanbanBoard } from './KanbanBoard';
import { JobForm } from './JobForm';
import { addJob, updateJob, deleteJob as deleteJobFromDB, updateJobStatus, subscribeToUserJobs } from '../services/jobService';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleDarkMode } from '../store/themeSlice';

export function Dashboard() {
  const { currentUser, logout } = useAuth();
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector((state) => state.theme.darkMode);
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
    } catch {
    }
  }

  const handleAddJob = async (jobData: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!currentUser) return;

    try {
      await addJob(currentUser.uid, jobData);
      setShowForm(false);
      toast.success('Jobb tillagt!');
    } catch (error) {
      toast.error(`Kunde inte lägga till jobb: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEditJob = async (jobData: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingJob) return;

    try {
      await updateJob(editingJob.id, jobData);
      setEditingJob(undefined);
      setShowForm(false);
      toast.success('Jobb uppdaterat!');
    } catch {
      toast.error('Kunde inte uppdatera jobb');
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Är du säker på att du vill ta bort denna ansökan?')) return;

    try {
      await deleteJobFromDB(jobId);
      toast.success('Jobb borttaget!');
    } catch {
      toast.error('Kunde inte ta bort jobb');
    }
  };

  const handleJobMove = async (jobId: string, newStatus: JobStatus) => {
    try {
      await updateJobStatus(jobId, newStatus);
    } catch {
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
    <div className={`min-h-screen p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className="flex justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">Mina jobbansökningar</h2>
          <p>{currentUser?.email || 'Gästanvändare'}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => dispatch(toggleDarkMode())}
            className={`border p-2 ${darkMode ? 'border-gray-600 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-100'}`}
          >
            {darkMode ? '☀️ Ljus' : '🌙 Mörk'}
          </button>
          <button
            onClick={() => setShowForm(true)}
            className={`border p-2 ${darkMode ? 'border-gray-600 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-100'}`}
          >
            Ny ansökan
          </button>
          <button
            onClick={handleLogout}
            className={`border p-2 ${darkMode ? 'border-gray-600 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-100'}`}
          >
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
