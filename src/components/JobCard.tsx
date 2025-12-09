import { JobApplication } from '../types/job';

interface JobCardProps {
  job: JobApplication;
  onEdit?: (job: JobApplication) => void;
  onDelete?: (jobId: string) => void;
}

export function JobCard({ job, onEdit, onDelete }: JobCardProps) {
  return (
    <div className="border p-3 mb-2 bg-white cursor-move">
      <div className="flex justify-between">
        <div>
          <h3 className="font-bold">{job.position}</h3>
          <p>{job.company}</p>
          {job.location && <p>{job.location}</p>}
          {job.salary && <p>{job.salary}</p>}
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <button onClick={(e) => { e.stopPropagation(); onEdit(job); }}>
              Edit
            </button>
          )}
          {onDelete && (
            <button onClick={(e) => { e.stopPropagation(); onDelete(job.id); }}>
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
