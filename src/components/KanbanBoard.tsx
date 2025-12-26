import { useState } from 'react';
import { JobApplication, Column, JobStatus } from '../types/job';
import { JobCard } from './JobCard';
import { useAppSelector } from '../store/hooks';

const COLUMNS: Column[] = [
  { id: 'interesting', title: 'Intressant', color: '' },
  { id: 'applied', title: 'Sökt', color: '' },
  { id: 'interview', title: 'Intervju', color: '' },
  { id: 'offer', title: 'Erbjudande', color: '' },
  { id: 'rejected', title: 'Nekad', color: '' },
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

  const getJobsByStatus = (status: JobStatus) => {
    return jobs.filter(job => job.status === status);
  };

  return (
    <div className="flex gap-4 overflow-x-auto">
      {COLUMNS.map((column) => {
        const columnJobs = getJobsByStatus(column.id);

        return (
          <div
            key={column.id}
            className={`w-64 border p-3 ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-50'}`}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
          >
            <h2 className="font-bold mb-3">
              {column.title} ({columnJobs.length})
            </h2>

            <div>
              {columnJobs.map((job) => (
                <div
                  key={job.id}
                  draggable
                  onDragStart={() => handleDragStart(job.id)}
                >
                  <JobCard
                    job={job}
                    onEdit={onJobEdit}
                    onDelete={onJobDelete}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
