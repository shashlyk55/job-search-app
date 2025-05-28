import { Link, useNavigate, useLocation } from "react-router-dom";
import "./NavBar.css"
import useAuthStore from "../../store/useAuthStore"; 

const Navbar = () => {
    const { user, logout, role } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    if (location.pathname === "/login" || location.pathname === "/register") {
        return null;
    }

    switch(role){
        case ('admin'): {
            return <nav className="navbar">
                        <div className="nav-links">
                            <Link to="/">Главная</Link>
                            <Link to="/admin/vacancies">Вакансии</Link>
                            <Link to="/admin/users">Пользователи</Link>
                            <Link to="/admin/industries">Отрасли</Link>
                            <Link to="/admin/joincompanyrequests">Запросы на присоединение к компании</Link>
                            {/* <Link to="/admin">Админ панель</Link> */}
                        </div>
                        <div className="nav-actions">
                            {user ? (
                                <button onClick={handleLogout}>Выход</button>
                            ) : (
                                <Link to="/login">Вход</Link>
                            )}
                        </div>
                    </nav>
        }
        case ('applicant'): {
            return <nav className="navbar">
                        <div className="nav-links">
                            <Link to="/">Главная</Link>
                            <Link to="/vacancies">Вакансии</Link>
                            <Link to="/responsedvacancies">Отклики</Link>
                            {user && <Link to="/profile">Профиль</Link>}
                        </div>
                        <div className="nav-actions">
                            {user ? (
                                <button onClick={handleLogout}>Выход</button>
                            ) : (
                                <Link to="/login">Вход</Link>
                            )}
                        </div>
                    </nav>
        }
        case ('employer'): {
            return <nav className="navbar">
                        <div className="nav-links">
                            <Link to="/">Главная</Link>
                            <Link to="/company/vacancies">Вакансии компании</Link>
                            {user && <Link to="/profile">Профиль</Link>}
                        </div>
                        <div className="nav-actions">
                            {user ? (
                                <button onClick={handleLogout}>Выход</button>
                            ) : (
                                <Link to="/login">Вход</Link>
                            )}
                        </div>
                    </nav>
        }
        default:{
            //return <div>Не авторизован</div>
            
        }
    }
};

export default Navbar;
