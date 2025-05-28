import { useEffect } from "react";
import "./UserResponsesPage.css";
import useResponsesStore from "../../store/useResponsesStore";
import ResponseItem from "../../components/ResponseItem/ResponseItem"; // ✅ Подключаем новый компонент

const UserResponsesPage = () => {
    const { responses = [], fetchRespondVacancies } = useResponsesStore();

    useEffect(() => {
        fetchRespondVacancies();
    }, [fetchRespondVacancies]);

    return (
        <div className="applications-container">
            <h2>Мои отклики</h2>

            {responses.length === 0 ? (
                <p>Вы ещё не откликнулись ни на одну вакансию.</p>
            ) : (
                <ul className="application-list">
                    {responses.map((res) => (
                        <ResponseItem key={res._id} response={res} /> // ✅ Теперь используем компонент
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserResponsesPage;
