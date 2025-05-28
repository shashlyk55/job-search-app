import { useEffect } from "react";
import './VacanciesList.css'
import useVacanciesStore from "../../../store/useVacanciesStore";
import useAuthStore from "../../../store/useAuthStore";
import Vacancy from "../Vacancy/Vacancy";

const VacancyList = () => {
    const {token} = useAuthStore()
    const { vacancies, fetchVacancies } = useVacanciesStore();

    useEffect(() => {
        fetchVacancies(token);
    }, [token, fetchVacancies]);

    return (
        <div className="vacancy-list">
            {vacancies.length > 0 ? (
                vacancies.map((vacancy) => (
                    <Vacancy key={vacancy._id} vacancy={vacancy} />
                ))
            ) : (
                <p className="no-vacancies">Вакансий не найдено</p>
            )}
        </div>
    );
};

export default VacancyList
