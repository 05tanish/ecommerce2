import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
    const { user, token } = useAuth();

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(user.role)) {
        // Redirect based on role
        if (user.role === 'admin') return <Navigate to="/admin" replace />;
        if (user.role === 'staff') return <Navigate to="/staff" replace />;
        return <Navigate to="/" replace />;
    }

    return children;
}
