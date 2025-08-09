import { Navigate } from 'react-router-dom';

export default function AuthorizationGuard({ children, allowedRoles = ['admin', 'journalist', 'viewer'] }) {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/" />;
    }

    try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        // console.log("Decoded token:", decoded);

        const userRole = decoded?.role || decoded?.user?.role;

        if (!allowedRoles.includes(userRole)) {
            return <Navigate to="/HomePage" />;
        }
        return children;
    } catch (err) {
        console.error("Token decode error:", err);
        localStorage.removeItem("token");
        return <Navigate to="/" />;
    }
}
