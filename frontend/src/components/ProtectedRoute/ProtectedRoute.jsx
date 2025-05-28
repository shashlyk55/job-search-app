import { Navigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ProtectedRoute = ({ element, adminOnly = false }) => {
    const { user, token } = useAuthStore();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!token) return navigate('/login', { replace: true })


        // добавить запрос на проверку автрозации


        //if (adminOnly && user?.role && user?.role !== "admin") return <Navigate to="/" replace />;
    }, [adminOnly, navigate, token, user?.role])

    //if (!user) return <Navigate to="/login" replace />;
    //if (!token) return navigate('/login', { replace: true })
    //if (adminOnly && user?.role && user?.role !== "admin") return <Navigate to="/" replace />;
  
    return element;
};

export default ProtectedRoute;
