import { useEffect } from "react";
import useAdminStore from "../../../store/useAdminStore";
import JoinCompanyRequestItem from "../JoinCompanyRequestItem/JoinCompanyRequestItem"; // ✅ Подключаем новый компонент
import "./JoinCompanyRequestsPage.css";

const JoinCompanyRequestsPage = () => {
    const { joinRequests, fetchJoinRequests} = useAdminStore();

    useEffect(() => {
        fetchJoinRequests();
    }, [fetchJoinRequests]);

    return (
        <div className="join-requests-container">
            <h2>Запросы на присоединение к компании</h2>

            {joinRequests.length === 0 ? (
                <p>Нет запросов на присоединение</p>
            ) : (
                <div className="requests-list">
                    {joinRequests.map((request) => (
                        <JoinCompanyRequestItem 
                            key={request._id} 
                            request={request}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default JoinCompanyRequestsPage;
