import { JobApplication } from '../types/job';
import { useAppSelector } from '../store/hooks';

interface JobCardProps {
  job: JobApplication;
  onEdit?: (job: JobApplication) => void;
  onDelete?: (jobId: string) => void;
}

export function JobCard({ job, onEdit, onDelete }: JobCardProps) {
  const darkMode = useAppSelector((state) => state.theme.darkMode);

  return (
    <div className={`border p-3 mb-2 cursor-move ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'}`}>
      <div className="flex justify-between">
        <div>
          <h3 className="font-bold">{job.position}</h3>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{job.company}</p>
          {job.location && <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{job.location}</p>}
          {job.salary && <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{job.salary}</p>}
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(job); }}
              className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(job.id); }}
              className={`text-sm ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'}`}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
