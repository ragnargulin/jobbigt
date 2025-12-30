import { useState } from 'react';
import { JobApplication, Column, JobStatus } from '../types/job';
import { JobCard } from './JobCard';
import { useAppSelector } from '../store/hooks';

const COLUMNS: Column[] = [
  { id: 'interesting', title: 'Intressant', color: '#2b7fff' },
  { id: 'applied', title: 'Sökt', color: '#10b981' },
  { id: 'interview', title: 'Intervju', color: '#f59e0b' },
  { id: 'offer', title: 'Erbjudande', color: '#8b5cf6' },
  { id: 'rejected', title: 'Nekad', color: '#ef4444' },
];

interface KanbanBoardProps {
  jobs: JobApplication[];
  onJobMove: (jobId: string, newStatus: JobStatus) => void;
  onJobEdit: (job: JobApplication) => void;
  onJobDelete: (jobId: string) => void;
}

export function KanbanBoard({ jobs, onJobMove, onJobEdit, onJobDelete }: KanbanBoardProps) {
  const darkMode = useAppSelector((state) => state.theme.darkMode);
  const [draggedJob, setDraggedJob] = useState<string | null>(null);
  const [collapsedColumns, setCollapsedColumns] = useState<Set<JobStatus>>(new Set());

  const handleDragStart = (jobId: string) => {
    setDraggedJob(jobId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: JobStatus) => {
    if (draggedJob) {
      onJobMove(draggedJob, status);
      setDraggedJob(null);
    }
  };

  const toggleColumn = (columnId: JobStatus) => {
    setCollapsedColumns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(columnId)) {
        newSet.delete(columnId);
      } else {
        newSet.add(columnId);
      }
      return newSet;
    });
  };

  const isColumnExpanded = (columnId: JobStatus) => {
    return !collapsedColumns.has(columnId);
  };

  const getJobsByStatus = (status: JobStatus) => {
    return jobs.filter(job => job.status === status);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 pb-4 lg:items-start">
      {COLUMNS.map((column) => {
        const columnJobs = getJobsByStatus(column.id);

        return (
          <div
            key={column.id}
            className={`w-full lg:flex-1 lg:min-w-0 border-2 rounded-[14px] p-0.5 shadow-md ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'
            }`}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
          >
            {/* Column Header */}
            <div className="pt-4 lg:pt-4 pb-1 px-4">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: column.color }}
                  />
                  <h2 className={`font-medium text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {column.title}
                  </h2>
                </div>
                <button
                  onClick={() => toggleColumn(column.id)}
                  className={`w-8 h-8 flex items-center justify-center rounded transition-transform ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                  } ${isColumnExpanded(column.id) ? '' : 'rotate-180'}`}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
              </div>
              <p className={`text-base mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {columnJobs.length} {columnJobs.length === 1 ? 'ansökan' : 'ansökningar'}
              </p>
            </div>

            {/* Column Content */}
            {isColumnExpanded(column.id) && (
              <div className="px-4 pb-2.5 pt-5">
                {columnJobs.map((job) => (
                  <div
                    key={job.id}
                    draggable
                    onDragStart={() => handleDragStart(job.id)}
                    className="mb-3 last:mb-0"
                  >
                    <JobCard
                      job={job}
                      onEdit={onJobEdit}
                      onDelete={onJobDelete}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
