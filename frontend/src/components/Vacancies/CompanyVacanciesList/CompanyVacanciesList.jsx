import { useEffect, useState } from "react";
import useAuthStore from "../../../store/useAuthStore";
import useVacanciesStore from "../../../store/useVacanciesStore";
import useEmployerStore from "../../../store/useEmployerStore";
import CompanyVacancyItem from "../CompanyVacancyItem/CompanyVacancyItem"; 
import AddVacancyForm from "../CompanyVacancyForm/CompanyVacancyForm"
import "./CompanyVacanciesList.css";


const CompanyVacanciesList = () => {
    const { token } = useAuthStore(); // ✅ Получаем данные работодателя
    const { vacancies, fetchCompanyVacancies, deleteVacancy, addVacancy, updateVacancy } = useVacanciesStore(); // ✅ Исправляем вызов хука
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false); // ✅ Состояние модального окна
    const [selectedVacancy, setSelectedVacancy] = useState(null); // ✅ Состояние редактируемой вакансии
    const { employer } = useEmployerStore()

    useEffect(() => {        
        fetchCompanyVacancies(token);            
    }, [fetchCompanyVacancies, token]);

    const handleEdit = (vacancy) => {        
        setSelectedVacancy(vacancy); // ✅ Запоминаем, какую вакансию редактируем
        setIsModalOpen(true);
    };

    const handleSubmit = (vacancyData) => {
        if (selectedVacancy) {
            updateVacancy(vacancyData, selectedVacancy._id); // ✅ Обновляем существующую вакансию
        } else {
            addVacancy(vacancyData); // ✅ Добавляем новую вакансию
        }
        setIsModalOpen(false);
        setSelectedVacancy(null);
    };

    const filteredVacancies = vacancies.filter((vacancy) =>
        vacancy.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <h1>Вакансии компании {employer?.company?.name}</h1>
            <div className="search-div">
                <input
                    className="search-input"
                    type="text"
                    placeholder="Поиск вакансии..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    />
            </div>

            <div className="vacancies-list">
                {filteredVacancies.map((vacancy) => (
                    
                    <CompanyVacancyItem
                        key={vacancy._id}
                        vacancy={vacancy}
                        onEdit={() => handleEdit(vacancy)}
                        onDelete={() => deleteVacancy(vacancy._id)}
                    />
                ))}
            </div>

            <button className="add-vacancy-button" onClick={() => setIsModalOpen(true)}>
                + Добавить вакансию
            </button>
            {isModalOpen && (
                <AddVacancyForm 
                    onClose={() => { setIsModalOpen(false); setSelectedVacancy(null); }}
                    onSubmit={handleSubmit}
                    vacancy={selectedVacancy} // ✅ Передаем данные вакансии для заполнения формы
                />
            )}
        </>
    )
}

export default CompanyVacanciesList