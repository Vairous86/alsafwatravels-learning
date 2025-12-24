import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Login component implements the device-linked username login flow described in the docs.
// Behavior summary:
//  - Client generates/persists a `device_id` in localStorage.
//  - On login, component calls the RPC `login_or_register(username, device_id)`.
//  - The RPC returns a message: `created`, `serial_assigned`, `ok`, or `device_mismatch`.
//  - On success the assigned `serial` is shown and the logged-in user is persisted in localStorage under `user`.
export default function Login() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [serial, setSerial] = useState('');
  const { user, signIn } = useAuth();
  const navigate = useNavigate();

  // Load any persisted logged-in user
  useEffect(() => {
    // If auth provider has a user, show its serial and username in the form
    if (user) {
      setUsername(user.username);
      setSerial(user.serial);
    }
  }, [user]);

  const generateDeviceId = () => {
    if (typeof window === 'undefined') return '';
    let id = localStorage.getItem('device_id');
    if (!id) {
      // Use native crypto when available; otherwise fall back to a simple random string
      id = (typeof crypto !== 'undefined' && typeof (crypto as any).randomUUID === 'function') ? (crypto as any).randomUUID() : Math.random().toString(36).slice(2);
      try { localStorage.setItem('device_id', id); } catch (e) { /* ignore */ }
    }
    return id;
  };

  const handleLogout = () => {
    setSerial('');
    setError('');
    try {
      localStorage.removeItem('user');
    } catch (e) {}
  };

  const handleLogin = async () => {
    try {
      // Ensure the browser keeps the device identifier persistent across reloads.
      const deviceId = generateDeviceId();
      localStorage.setItem('device_id', deviceId);

      // Call the server-side RPC which safely implements login/register logic
      // The RPC returns a row with a `message` field telling us what happened.
      // Use the auth provider's signIn to centralize login and routing
      const res = await signIn(username);
      if (!res.success) {
        setSerial('');
        setError(res.error || 'Login failed');
      } else {
        setError('');
        // navigate to home now that provider set the user
        navigate('/');
      }
    } catch (err) {
      setError(err.message || String(err));
    }
  };

  return (
    <div>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <button onClick={handleLogin} disabled={!username.trim()} aria-disabled={!username.trim()}>Login</button>
      {error && <div className="error" role="alert">{error}</div>}
      {serial ? (
        <div>
          <p><strong>Logged in as:</strong> {username}</p>
          <p><strong>Your device serial:</strong> {serial}</p>
          <p>Save this serial for future logins!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : null}
    </div>
  );
}