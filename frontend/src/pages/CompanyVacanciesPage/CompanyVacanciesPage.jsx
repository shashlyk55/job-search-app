import "./CompanyVacanciesPage.css";
import useEmployerStore from "../../store/useEmployerStore";
import CompanyVacanciesList from "../../components/Vacancies/CompanyVacanciesList/CompanyVacanciesList";
import { useEffect } from "react";

const CompanyVacanciesPage = () => {    
    const { fetchEmployerProfile } = useEmployerStore()
    const employer = useEmployerStore((state) => state.employer);

    useEffect(() => {
        fetchEmployerProfile();
    }, [fetchEmployerProfile])

    return (
        <div className="company-vacancies-container">
            {employer && employer.company ? 
                <CompanyVacanciesList/>
                :
                <h3>Вы не состоите в компании</h3>    
            }
            
        </div>
    );
};

export default CompanyVacanciesPage;
