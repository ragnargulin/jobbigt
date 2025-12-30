import { JobApplication } from '../types/job';
import { useAppSelector } from '../store/hooks';

interface JobCardProps {
  job: JobApplication;
  onEdit?: (job: JobApplication) => void;
  onDelete?: (jobId: string) => void;
}

export function JobCard({ job, onEdit, onDelete: _onDelete }: JobCardProps) {
  const darkMode = useAppSelector((state) => state.theme.darkMode);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' });
  };

  return (
    <div className={`border rounded-[10px] p-[17px] cursor-move transition-shadow ${
      darkMode ? 'border-gray-600 bg-gray-700 shadow-sm' : 'border-gray-200 bg-white shadow-sm hover:shadow-md'
    }`}>
      {/* Header with Company and Menu */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className={`font-medium text-base mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {job.company}
          </h3>
          <div className="flex items-center gap-1.5">
            <svg className={`w-3.5 h-3.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className={`text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {job.position}
            </p>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(job); }}
              className={`w-7 h-7 flex items-center justify-center rounded ${
                darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
              }`}
              title="Redigera"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2">
        {job.location && (
          <div className="flex items-center gap-1.5">
            <svg className={`w-3.5 h-3.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {job.location}
            </p>
          </div>
        )}
        {job.applicationDate && (
          <div className="flex items-center gap-1.5">
            <svg className={`w-3.5 h-3.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {formatDate(job.applicationDate)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
