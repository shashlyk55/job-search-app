import { useState } from "react";
import { Link } from "react-router-dom";
import './AdminVacancyItem.css'
import useAdminStore from "../../../store/useAdminStore"
import CompanyVacancyForm from "../CompanyVacancyForm/CompanyVacancyForm";

const AdminVacancyItem = ({vacancy}) => {    
    const { deleteVacancy, updateVacancy } = useAdminStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVacancy, setSelectedVacancy] = useState(null);

    const handleEdit = () => {        
        setSelectedVacancy(vacancy); // ✅ Запоминаем вакансию для редактирования
        setIsModalOpen(true);
    };

    const handleSubmit = (vacancyData) => {
        updateVacancy(vacancyData, selectedVacancy._id); // ✅ Обновляем вакансию
        setIsModalOpen(false);
        setSelectedVacancy(null);
    };

    const handleDelete = () => {
        deleteVacancy(vacancy._id)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
    }

    return (
        <div className="admin-vacancy-card">
            <div className="vacancy-info">
                <h3>
                    <Link to={`/vacancy/${vacancy._id}`}>{vacancy.name}</Link>
                </h3>
                <p><strong>Компания:</strong> {vacancy.company.name}</p>
                <p><strong>Зарплата:</strong> {vacancy.salary_amount} {vacancy.currency}</p>
                <p><strong>Создана:</strong> {new Date(vacancy.createdAt).toLocaleDateString()}</p>
                {/* <p><strong>Откликов:</strong> {vacancy.responses.length}</p> */}
            </div>
            <div className="action-buttons">
                <button className="edit-button" onClick={handleEdit}>Изменить</button>
                <button className="delete-button" onClick={handleDelete}>Удалить</button>
            </div>

            {isModalOpen && (
                <CompanyVacancyForm
                    vacancy={selectedVacancy}
                    onClose={handleCloseModal}
                    onSubmit={handleSubmit}
                />
            )}
        </div>
    );
}

export default AdminVacancyItem