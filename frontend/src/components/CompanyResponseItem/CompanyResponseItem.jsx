import { useState } from "react";
import useResponsesStore from "../../store/useResponsesStore";
import "./CompanyResponseItem.css";

const CompanyResponseItem = ({ response }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [message, setMessage] = useState(""); // ✅ Состояние для сообщения
    const {approveResponse, rejectResponse} = useResponsesStore()
    
    return (
        <div className="response-card">
            <div className="response-header">
                <div className="applicant-info">
                    <h3>{response.applicant_id.user.name}</h3>
                    <p><strong>Email:</strong> {response.applicant_id.user.contacts.email}</p>
                    <p><strong>Телефон:</strong> {response.applicant_id.user.contacts.phone || "-"}</p>
                    <button className="expand-button" onClick={() => setIsExpanded(!isExpanded)}>
                        {isExpanded ? "Скрыть" : "Подробнее"}
                    </button>
                </div>
                <div className="response-info">
                    <h3>Вакансия: {response.vacancy_id.name}</h3>
                    <p><strong>Вакансия опубликована:</strong> {new Date(response.vacancy_id.createdAt).toLocaleDateString()}</p>
                    <p><strong>Отклик сделан:</strong> {new Date(response.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            {isExpanded && (
                <div className="response-details">
                    <h3>Резюме: {response.resume_id.name}</h3>
                    <p><strong>Биография:</strong> {response.resume_id.biography}</p>
                    <p><strong>Опыт работы:</strong></p>
                    <ul>
                        {response.resume_id.work_experience.map((exp) => (
                            <li key={exp._id}>
                                <strong>{exp.company}</strong> — {exp.position} ({exp.years_of_work || "Срок не указан"})
                            </li>
                        ))}
                    </ul>
                    <p><strong>Навыки:</strong> {response.resume_id.skills.join(", ")}</p>
                </div>
            )}

            <div className="response-actions">
                {response.is_approved === null ? (
                    <>
                    {/* 🔹 Ввод сообщения */}
                        <textarea 
                            placeholder="Добавьте комментарий к отклику..." 
                            value={message} 
                            onChange={(e) => setMessage(e.target.value)} 
                        ></textarea>
                        <div>
                            <button className="approve-button" onClick={() => approveResponse(response._id, message)}>Одобрить</button>
                            <button className="reject-button" onClick={() => rejectResponse(response._id, message)}>Отклонить</button>
                        </div>
                    </>
                ) : (
                    <button className="sent-button" disabled>Ответ отправлен</button>
                )}
            </div>

            {/* 🔹 Отображаем сообщение, если оно есть */}
            {response.applicant_pinned_message && (
                <div className="pinned-message">
                    <strong>Сообщение соискателя:</strong> {response.applicant_pinned_message}
                </div>
            )}
            {response.employer_pinned_message && (
                <div className="pinned-message">
                    <strong>Сообщение работодателя:</strong> {response.employer_pinned_message}
                </div>
            )}
        </div>
    );
};

export default CompanyResponseItem;
