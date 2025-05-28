import { useEffect } from "react";
import useAdminStore from "../../../store/useAdminStore";
import "./AdminVacanciesPage.css";
import AdminVacanciesList from "../../../components/Vacancies/AdminVacanciesList/AdminvacanciesList";

const AdminVacanciesPage = () => {
    const { vacancies, fetchVacancies } = useAdminStore();

    useEffect(() => {
        fetchVacancies();        
    }, [fetchVacancies]);

    return (
        <div className="admin-vacancies">
            <h2>Вакансии</h2>
            <AdminVacanciesList vacancies={vacancies}/>
        </div>
    );
};

export default AdminVacanciesPage;
