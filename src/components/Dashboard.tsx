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
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      {/* Header */}
      <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="max-w-[1232px] mx-auto px-4 lg:px-6 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 flex items-center justify-center rounded-[14px] bg-gradient-to-b from-purple-600 to-purple-700 shadow-md">
                  <span className="text-2xl">💼</span>
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold">Jobbigt</h1>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span className="hidden lg:inline">{currentUser?.email || 'Gästanvändare'}</span>
                    <span className="lg:hidden">Organisera din jobbjaktsprocess</span>
                  </p>
                </div>
              </div>
              {/* Mobile menu button */}
              <button
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded"
                onClick={handleLogout}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Desktop buttons */}
            <div className="hidden lg:flex gap-2">
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                <span>+</span>
                <span>Ny ansökan</span>
              </button>
              <button
                onClick={() => dispatch(toggleDarkMode())}
                className={`w-10 h-10 flex items-center justify-center rounded border ${
                  darkMode
                    ? 'border-gray-600 hover:bg-gray-800'
                    : 'border-gray-300 hover:bg-gray-100'
                }`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <button
                onClick={handleLogout}
                className={`w-10 h-10 flex items-center justify-center rounded border ${
                  darkMode
                    ? 'border-gray-600 hover:bg-gray-800'
                    : 'border-gray-300 hover:bg-gray-100'
                }`}
              >
                🚪
              </button>
            </div>

            {/* Mobile new application button */}
            <button
              onClick={() => setShowForm(true)}
              className="lg:hidden w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-[10px] bg-purple-600 text-white shadow-md hover:bg-purple-700"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-medium">Ny ansökan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 max-w-[1232px] w-full mx-auto px-5 lg:px-4 py-6 lg:py-8">
        <KanbanBoard
          jobs={jobs}
          onJobMove={handleJobMove}
          onJobEdit={openEditForm}
          onJobDelete={handleDeleteJob}
        />
      </div>

      {/* Footer */}
      <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="max-w-[1232px] mx-auto px-6 lg:px-4 py-6">
          <div className="flex flex-col lg:flex-row items-center gap-3 lg:gap-4">
            <span className="text-2xl">💼</span>
            <div className="text-center lg:text-left">
              <h3 className="font-bold">Jobbigt</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span className="hidden lg:inline">Håll koll på dina ansökningar</span>
                <span className="lg:hidden">Copyright 2026</span>
              </p>
            </div>
          </div>
        </div>
      </div>

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
