import { useState } from "react";
import "./JoinCompanyRequestItem.css";
import useAdminStore from "../../../store/useAdminStore";

const JoinCompanyRequestItem = ({ request }) => {
    const {approveJoinRequest, rejectJoinRequest } = useAdminStore();
    const [isExpanded, setIsExpanded] = useState(false);

    const handleApproveJoinRequest = () => {
        approveJoinRequest(request._id)
    }

    const handleRejectJoinRequest = () => {
        rejectJoinRequest(request._id)
    }

    return (
        <div className="request-card">
            <div>
                <div className="request-info">
                    <h3>{request.employer.user.name}</h3>
                    <p><strong>Эл. почта:</strong> {request.employer.user.contacts.email}</p>
                    <p><strong>Телефон:</strong> {request.employer.user.contacts.phone || "не указан"}</p>
                    <p><strong>Сообщение:</strong> {request.pinned_message || "-"}</p>
                </div>
                
                <div className="request-actions">
                    <button className="approve-button" onClick={handleApproveJoinRequest}>Принять</button>
                    <button className="reject-button" onClick={handleRejectJoinRequest}>Отклонить</button>
                    {request.company && (
                        <button className="expand-button" onClick={() => setIsExpanded(!isExpanded)}>
                            {isExpanded ? "▲" : "▼"}
                        </button>
                    )}
                </div>
            </div>

            {isExpanded && request.company && (
                <div className="company-details">
                    <p><strong>Название:</strong> {request.company.name}</p>
                    <p><strong>Регистрационный номер:</strong> {request.company.company_regnum}</p>
                    <p><strong>Деятельность:</strong> {request.company.activity || "Нет информации"}</p>
                    <h3>Контакты владельца</h3>
                    <p><strong>Email:</strong> {request.company.boss_contacts?.email || "Не указан"}</p>
                    <p><strong>Телефон:</strong> {request.company.boss_contacts?.phone.join(", ") || "Не указан"}</p>
                </div>
            )}

            
        </div>
    );
};

export default JoinCompanyRequestItem;
