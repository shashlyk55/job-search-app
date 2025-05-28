import "./CompanyVacancyItem.css";
import { Link } from "react-router-dom";

const CompanyVacancyItem = ({ vacancy, onEdit, onDelete }) => {
    return (
        <div className="company-vacancy-card">
            <div className="vacancy-info">
                <h3>
                    <Link to={`/vacancies/${vacancy._id}/responses`}>{vacancy.name}</Link>
                </h3>
                <p><strong>Зарплата:</strong> {vacancy.salary_amount} {vacancy.currency}</p>
                <p><strong>Создана:</strong> {new Date(vacancy.createdAt).toLocaleDateString()}</p>
                {/* <p><strong>Откликов:</strong> {vacancy.responses.length}</p> */}
            </div>
            <div className="action-buttons">
                <button className="edit-button" onClick={onEdit}>Редактировать</button>
                <button className="delete-button" onClick={onDelete}>Удалить</button>
            </div>
        </div>
    );
};

export default CompanyVacancyItem;
