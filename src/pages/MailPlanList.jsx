import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mailPlans } from '../api/client';

export default function MailPlanList() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await mailPlans.list();
      setPlans(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleActivate(id) {
    try {
      await mailPlans.activate(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this plan?')) return;
    try {
      await mailPlans.delete(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  if (loading) return <div className="p-4">Loading...</div>;
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Mail Plans</h1>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/plans/new')}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              New Plan
            </button>
            <button onClick={handleLogout} className="border px-4 py-2 rounded">
              Logout
            </button>
          </div>
        </div>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Created</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.length === 0 ? (
                <tr><td colSpan={4} className="p-4 text-gray-500">No plans yet. Create one.</td></tr>
              ) : (
                plans.map((p) => (
                  <tr key={p._id} className="border-t">
                    <td className="p-3">{p.name}</td>
                    <td className="p-3">
                      <span className={p.status === 'active' ? 'text-green-600' : 'text-gray-600'}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => navigate(`/plans/${p._id}`)}
                        className="text-blue-600"
                      >
                        Edit
                      </button>
                      {p.status === 'draft' && (
                        <button
                          onClick={() => handleActivate(p._id)}
                          className="text-green-600"
                        >
                          Activate
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="text-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
