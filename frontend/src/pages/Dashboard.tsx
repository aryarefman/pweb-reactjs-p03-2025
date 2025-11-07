import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome, {user?.username}! 👋</h2>
          <p>Email: {user?.email}</p>
          <p>User ID: {user?.id}</p>
        </div>

        <div className="info-card">
          <h3>Account Information</h3>
          <p>You are successfully logged in.</p>
          <p>This is your protected dashboard page.</p>
        </div>
      </div>
    </div>
  );
}