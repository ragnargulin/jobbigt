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
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h2>Welcome!</h2>

      <div style={{
        padding: '1rem',
        marginBottom: '1rem',
        backgroundColor: '#e8f5e9',
        borderRadius: '4px'
      }}>
        <p><strong>Email:</strong> {currentUser?.email || 'Anonymous User'}</p>
        <p><strong>User ID:</strong> {currentUser?.uid}</p>
        <p><strong>Account Type:</strong> {currentUser?.isAnonymous ? 'Guest' : 'Registered'}</p>
      </div>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
