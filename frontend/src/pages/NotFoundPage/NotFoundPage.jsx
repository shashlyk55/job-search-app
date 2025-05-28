import { Link, useNavigate } from "react-router-dom";
import "./NotFoundPage.css";
import { useEffect } from "react";

const NotFoundPage = () => {

    const navigate = useNavigate();

    useEffect(() => {
        if (!window.location.pathname.includes("/404")) {
            navigate("/404", { replace: true }); // ✅ Автоматически заменяет URI на `/404`
        }
    }, [navigate]);

    return (
        <div className="not-found-container">
            <h1>404</h1>
            <p>Страница не найдена</p>
            <Link to="/" className="home-link">Вернуться на главную</Link>
        </div>
    );
};

export default NotFoundPage;
