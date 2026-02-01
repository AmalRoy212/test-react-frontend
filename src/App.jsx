import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import MailPlanList from './pages/MailPlanList';
import MailPlanBuilder from './pages/MailPlanBuilder';

function Protected({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Protected><MailPlanList /></Protected>} />
        <Route path="/plans/new" element={<Protected><MailPlanBuilder /></Protected>} />
        <Route path="/plans/:id" element={<Protected><MailPlanBuilder /></Protected>} />
      </Routes>
    </BrowserRouter>
  );
}
