
import './Vacancies.css'
import VacancyFilters from '../../components/Vacancies/FilterVacancies/FilterVacancies';
import VacanciesList from '../../components/Vacancies/VacanciesList/VacanciesList';


const Vacancies = () => {
    return (
        <div className="vacancies-container">
            <VacanciesList />
            <VacancyFilters />
        </div>
    );
};

export default Vacancies;
