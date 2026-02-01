import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../api/client';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const fn = isRegister ? auth.register : auth.login;
      const { token } = await fn(email, password);
      localStorage.setItem('token', token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h1 className="text-xl font-semibold mb-4">Auto Mail Plan</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>
        <button
          type="button"
          onClick={() => setIsRegister(!isRegister)}
          className="mt-3 text-sm text-gray-600"
        >
          {isRegister ? 'Already have account? Login' : 'No account? Register'}
        </button>
      </div>
    </div>
  );
}
