import { useState } from 'react';
import { JobApplication, JobStatus } from '../types/job';
import { useAppSelector } from '../store/hooks';

interface JobFormProps {
  job?: JobApplication;
  onSubmit: (job: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
}

export function JobForm({ job, onSubmit, onCancel }: JobFormProps) {
  const darkMode = useAppSelector((state) => state.theme.darkMode);
  const [formData, setFormData] = useState({
    company: job?.company || '',
    position: job?.position || '',
    location: job?.location || '',
    description: job?.description || '',
    applicationDate: job?.applicationDate || '',
    contactPerson: job?.contactPerson || '',
    contactEmail: job?.contactEmail || '',
    status: job?.status || 'interesting' as JobStatus,
    notes: job?.notes || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`rounded-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto shadow-xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <h2 className="text-2xl font-bold mb-6">
          {job ? 'Redigera ansökan' : 'Ny ansökan'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className={`block mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>Företag *</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className={`w-full border rounded p-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
              />
            </div>

            <div>
              <label className={`block mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>Tjänst *</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                className={`w-full border rounded p-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
              />
            </div>

            <div>
              <label className={`block mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>Plats</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full border rounded p-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
              />
            </div>

            <div>
              <label className={`block mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>Ansökningsdatum</label>
              <input
                type="date"
                name="applicationDate"
                value={formData.applicationDate}
                onChange={handleChange}
                className={`w-full border rounded p-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
              />
            </div>

            <div>
              <label className={`block mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className={`w-full border rounded p-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
              >
                <option value="interesting">Intressant</option>
                <option value="applied">Sökt</option>
                <option value="interview">Intervju</option>
                <option value="offer">Erbjudande</option>
                <option value="rejected">Nekad</option>
              </select>
            </div>

            <div>
              <label className={`block mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>Kontaktperson</label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                className={`w-full border rounded p-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
              />
            </div>

            <div>
              <label className={`block mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>Kontakt e-post</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className={`w-full border rounded p-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className={`block mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>Beskrivning</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={`w-full border p-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
            />
          </div>

          <div className="mb-4">
            <label className={`block mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>Anteckningar</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className={`w-full border p-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 px-5 py-2.5 rounded bg-blue-600 text-white hover:bg-blue-700 font-medium"
            >
              {job ? 'Spara' : 'Lägg till'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className={`flex-1 px-5 py-2.5 rounded border font-medium ${
                darkMode
                  ? 'border-gray-600 hover:bg-gray-700'
                  : 'border-gray-300 hover:bg-gray-100'
              }`}
            >
              Avbryt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
