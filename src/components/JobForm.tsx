import { useState } from 'react';
import { JobApplication, JobStatus } from '../types/job';

interface JobFormProps {
  job?: JobApplication;
  onSubmit: (job: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function JobForm({ job, onSubmit, onCancel }: JobFormProps) {
  const [formData, setFormData] = useState({
    company: job?.company || '',
    position: job?.position || '',
    location: job?.location || '',
    salary: job?.salary || '',
    description: job?.description || '',
    applicationDate: job?.applicationDate || '',
    contactPerson: job?.contactPerson || '',
    contactEmail: job?.contactEmail || '',
    status: job?.status || 'interesting' as JobStatus,
    notes: job?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {job ? 'Redigera ansökan' : 'Ny ansökan'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-1">Företag *</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="w-full border p-2"
              />
            </div>

            <div>
              <label className="block mb-1">Tjänst *</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                className="w-full border p-2"
              />
            </div>

            <div>
              <label className="block mb-1">Plats</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border p-2"
              />
            </div>

            <div>
              <label className="block mb-1">Lön</label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className="w-full border p-2"
              />
            </div>

            <div>
              <label className="block mb-1">Ansökningsdatum</label>
              <input
                type="date"
                name="applicationDate"
                value={formData.applicationDate}
                onChange={handleChange}
                className="w-full border p-2"
              />
            </div>

            <div>
              <label className="block mb-1">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full border p-2"
              >
                <option value="interesting">Intressant</option>
                <option value="applied">Sökt</option>
                <option value="interview">Intervju</option>
                <option value="offer">Erbjudande</option>
                <option value="rejected">Nekad</option>
              </select>
            </div>

            <div>
              <label className="block mb-1">Kontaktperson</label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                className="w-full border p-2"
              />
            </div>

            <div>
              <label className="block mb-1">Kontakt e-post</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full border p-2"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-1">Beskrivning</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full border p-2"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Anteckningar</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full border p-2"
            />
          </div>

          <div className="flex gap-3">
            <button type="submit" className="border p-2 flex-1">
              {job ? 'Spara' : 'Lägg till'}
            </button>
            <button type="button" onClick={onCancel} className="border p-2 flex-1">
              Avbryt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
