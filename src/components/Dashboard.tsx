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
  const [showProfileMenu, setShowProfileMenu] = useState(false);

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
      <div className={`shadow-sm ${darkMode ? 'bg-gray-900 border-b border-gray-700' : 'bg-white border-b border-gray-200'}`}>
        <div className="max-w-[1232px] mx-auto px-4 lg:px-6 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 flex items-center justify-center rounded-[14px] bg-gradient-to-b from-[#4f39f6] to-[#7c3aed] shadow-md">
                  <span className="text-2xl">😪</span>
                </div>
                <div>
                  <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Jobbigt</h1>
                  <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Organisera din jobbjaktsprocess
                  </p>
                </div>
              </div>
              {/* Mobile profile button */}
              <div className="lg:hidden relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className={`w-10 h-10 flex items-center justify-center rounded-[10px] ${
                    darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>

                {/* Mobile Profile dropdown */}
                {showProfileMenu && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowProfileMenu(false)}
                    />
                    {/* Menu */}
                    <div className={`absolute right-0 top-12 w-64 rounded-lg shadow-lg z-50 overflow-hidden ${
                      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                    }`}>
                      <div className="p-2">
                        <div className={`px-4 py-3 border-b ${
                          darkMode ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                          <p className={`text-sm font-medium ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>Inloggad som</p>
                          <p className={`text-sm truncate ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>{currentUser?.email || 'Gäst'}</p>
                        </div>
                        <button
                          onClick={() => {
                            dispatch(toggleDarkMode());
                            setShowProfileMenu(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mt-1 ${
                            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                          }`}
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {darkMode ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            )}
                          </svg>
                          <span className="font-medium">{darkMode ? 'Ljust läge' : 'Mörkt läge'}</span>
                        </button>
                        <button
                          onClick={() => {
                            handleLogout();
                            setShowProfileMenu(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                          }`}
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span className="font-medium">Logga ut</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>


            {/* Desktop buttons */}
            <div className="hidden lg:flex gap-4 items-center">
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-[#4f39f6] text-white shadow-md hover:bg-[#4532d4] font-medium"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>Ny ansökan</span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className={`w-10 h-10 flex items-center justify-center rounded-[10px] ${
                    darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>

                {/* Profile dropdown */}
                {showProfileMenu && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowProfileMenu(false)}
                    />
                    {/* Menu */}
                    <div className={`absolute right-0 top-12 w-64 rounded-lg shadow-lg z-50 overflow-hidden ${
                      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                    }`}>
                      <div className="p-2">
                        <div className={`px-4 py-3 border-b ${
                          darkMode ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                          <p className={`text-sm font-medium ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>Inloggad som</p>
                          <p className={`text-sm truncate ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>{currentUser?.email || 'Gäst'}</p>
                        </div>
                        <button
                          onClick={() => {
                            dispatch(toggleDarkMode());
                            setShowProfileMenu(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mt-1 ${
                            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                          }`}
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {darkMode ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            )}
                          </svg>
                          <span className="font-medium">{darkMode ? 'Ljust läge' : 'Mörkt läge'}</span>
                        </button>
                        <button
                          onClick={() => {
                            handleLogout();
                            setShowProfileMenu(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                          }`}
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span className="font-medium">Logga ut</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Mobile new application button */}
            <button
              onClick={() => setShowForm(true)}
              className="lg:hidden w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-[10px] bg-[#4f39f6] text-white shadow-md hover:bg-[#4532d4] font-medium"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>Ny ansökan</span>
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
      <div className={`border-t ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-[1232px] mx-auto px-6 lg:px-4 pt-6 pb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">😪</span>
            <div>
              <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>Jobbigt</h3>
              <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Copyright {new Date().getFullYear()}
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
