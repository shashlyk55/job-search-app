import { useState } from "react";
import "./ResponseItem.css";
import useResponsesStore from "../../store/useResponsesStore";

const ResponseItem = ({ response }) => {
    const { deleteResponse } = useResponsesStore();
    const [isExpanded, setIsExpanded] = useState(false);

    const handleDelete = () => {
        if (confirm("Вы уверены, что хотите отменить отклик?")) {
            deleteResponse(response._id);
        }
    };

    return (
        <li className="response-item">
            <div className="response-header">
                <div className="response-summary">
                    <h3 className="vacancy-name">{response?.vacancy_id?.name || "Название не указано"}</h3>
                    <p className="resume-name"><strong>Резюме:</strong> {response?.resume_id?.name || "Не указано"}</p>
                    <p className="response-status">
                        <strong>Статус: </strong> 
                        <span className={response.is_approved ? "approved" : "rejected"}>
                            {response.is_approved === true ? "Принято" : response.is_approved === false ? "Отказ" : "На рассмотрении"}
                        </span>
                    </p>
                    
                </div>

                <div className="response-actions">
                    <button className="delete-response-button" onClick={handleDelete}>Отменить</button>
                    <button className="expand-button" onClick={() => setIsExpanded(!isExpanded)}>
                        {isExpanded ? "▲" : "▼"}
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="response-details">
                    <p><strong>Компания:</strong> {response?.vacancy_id?.company?.name || "Не указана"}</p>
                    <p><strong>Зарплата:</strong> {response?.vacancy_id?.salary_amount ? `${response.vacancy_id.salary_amount} ${response.vacancy_id.currency}` : "Не указана"}</p>
                    <p><strong>Требуемый опыт:</strong> {response?.vacancy_id?.required_experience ? `${response.vacancy_id.required_experience} лет` : "Без опыта"}</p>
                    
                    <p><strong>Описание резюме:</strong> {response?.resume_id?.biography || "Нет биографии"}</p>
                    
                </div>
            )}

            <div className="applicant-message-div">
                <p className="applicant-message"><strong>Ваше сообщение:</strong> {response?.applicant_pinned_message || "-"}</p>
            </div>

            {response.is_approved == null ? 
                null
                :
                <div className="employer-message-div">
                    <p className="employer-message"><strong>Ответ работодателя:</strong> {response?.employer_pinned_message || "-"}</p>
                </div>
            }
        </li>
    );
};

export default ResponseItem;
