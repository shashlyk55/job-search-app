import { useState, useEffect } from "react"
import { Link } from "react-router-dom";
import "./Vacancy.css";
import ResponseModal from "../../ResponseModal/ResponseModal";
import useResponsesStore from "../../../store/useResponsesStore"

const Vacancy = ({ vacancy }) => {
    const [isRespond, setIsRespond] = useState(false);
    const { responses, fetchRespondVacancies } = useResponsesStore();
    const [hasResponded, setHasResponded] = useState(false);
    
    
    useEffect(() => {                
        setHasResponded(responses.some((res) => res.vacancy_id?._id === vacancy._id)); // ✅ Проверяем, откликался ли пользователь
    }, [responses, vacancy]);
    
    useEffect(() => {
        fetchRespondVacancies(); // ✅ Загружаем отклики пользователя при загрузке вакансий
    }, [fetchRespondVacancies]);

    const handleApplySuccess = async () => {
        await fetchRespondVacancies(); // ✅ Обновляем список откликов
        setHasResponded(true); // ✅ Делаем кнопку неактивной
    };

    return (
        <div className={`vacancy-card ${hasResponded ? "responded" : ""}`}> 
            <div className="vacancy-content">
                <span>
                    <h3 className="vacancy-name">
                        <Link to={`/vacancy/${vacancy._id}`}>{vacancy.name}</Link> {/* ✅ Теперь заголовок — это ссылка */}
                    </h3>
                    <p className="vacancy-company">{vacancy.company.name}</p>
                </span>

                <span>
                    <p className="vacancy-experience">{vacancy.required_experience ? `Опыт: ${vacancy.required_experience} лет` : "Без опыта"}</p>
                    <p>Создана: {new Date(vacancy.createdAt).toLocaleDateString()}</p>
                </span>
            </div>

            <div className="vacancy-action">
                <div className="vacancy-salary">
                    {vacancy.salary_amount ? `${vacancy.salary_amount} ${vacancy.currency}` : "Зарплата не указана"}
                </div>
                {/* <button className="vacancy-button" onClick={() => setIsRespond(true)}>Откликнуться</button> */}
                <button 
                    className="vacancy-button" 
                    onClick={() => !hasResponded && setIsRespond(true)} // ✅ Запрещаем открытие окна, если `hasResponded = true`
                    disabled={hasResponded}
                >
                    {hasResponded ? "Отклик отправлен" : "Откликнуться"}
                </button>
            </div>
            {isRespond && <ResponseModal vacancyId={vacancy._id} onClose={() => setIsRespond(false)} onApplySuccess={handleApplySuccess} />}
        </div>
    );
};

export default Vacancy;
