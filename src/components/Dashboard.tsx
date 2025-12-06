import { useAuth } from '../contexts/AuthContext';

export function Dashboard() {
  const { currentUser, logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6">Welcome!</h2>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-6 space-y-3">
          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">Email: </span>
            <span className="text-gray-900 dark:text-gray-100">
              {currentUser?.email || 'Anonymous User'}
            </span>
          </div>
          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">User ID: </span>
            <span className="text-gray-900 dark:text-gray-100 font-mono text-sm">
              {currentUser?.uid}
            </span>
          </div>
          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">Account Type: </span>
            <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${
              currentUser?.isAnonymous
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                : 'bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-200'
            }`}>
              {currentUser?.isAnonymous ? 'Guest' : 'Registered'}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
