import { useState } from "react";
import "./HomePage.css";
import useVacanciesStore from "../../store/useVacanciesStore";
import useAuthStore from "../../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";

const HomePage = () => {
    const [vacancy_name, setVacancyName] = useState('')
    const { fetchVacancies, setFilters } = useVacanciesStore()
    const { user } = useAuthStore();
    const navigate = useNavigate();
 

    const handleChange = (e) => {        
        setVacancyName(e.target.value)
    }

    const handleSearch = () => {        
        setFilters({vacancy: vacancy_name})
        fetchVacancies()
        navigate('/vacancies')
    }

    return (
        <div className="home-container">
            <h1 className="home-title">Работа мечты</h1>

            {user?.role == 'admin' ?
                <h3 className="home-title">Вы зашли от имени администратора</h3>
                :
                user?.role == 'applicant' ?
                (
                    <div className="search-box">
                        <input 
                            type="text" 
                            placeholder="Введите вакансию..." 
                            value={vacancy_name}
                            onChange={handleChange}
                            />
                        <button onClick={handleSearch}>🔍 Найти</button>
                    </div>
                ) :
                ''
            }

            <div className="quick-links">
                {user?.role == 'applicant' ?
                    <button onClick={() => navigate("/vacancies", { replace: true })}>💼 Каталог вакансий</button>
                    : (
                        user?.role == 'employer' ?
                        <button onClick={() => navigate("/company/vacancies", { replace: true })}>💼 Вакансии компании</button>
                        : (
                            <>
                                <button onClick={() => navigate("/admin/vacancies", { replace: true })}>💼 Вакансии</button>
                                <button onClick={() => navigate("/admin/users", { replace: true })}>Пользователи</button>
                                <button onClick={() => navigate("/admin/industries", { replace: true })}>Отрасли</button>
                                <button onClick={() => navigate("/admin/joincompanyrequests", { replace: true })}>Запросы на присоединение к компании</button>
                            </>
                        )
                    )
                }
            </div>
        </div>
    );
};

export default HomePage;
