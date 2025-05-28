import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./VacancyPage.css";
import ResponseModal from "../../components/ResponseModal/ResponseModal";
import useResponsesStore from "../../store/useResponsesStore";
import useAuthStore from "../../store/useAuthStore";
import useAdminStore from "../../store/useAdminStore";
import CompanyVacancyForm from "../../components/Vacancies/CompanyVacancyForm/CompanyVacancyForm";


const VacancyPage = () => {
    const navigate = useNavigate();
    const { token, role } = useAuthStore()
    const { id } = useParams(); // ✅ Получаем ID вакансии из URL
    const [vacancy, setVacancy] = useState(null);
    const [isResponded, setIsResponded] = useState(false);
    const { responses, fetchRespondVacancies } = useResponsesStore();
    const [hasResponded, setHasResponded] = useState(false);


    const { deleteVacancy, updateVacancy } = useAdminStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVacancy, setSelectedVacancy] = useState(null);


    const fetchVacancyDetails = async (vacancyId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/applicant/vacancy/${vacancyId}`,{
                method: 'GET',
                headers: { Authorization: token }
            }
            );
            const result = await response.json();
            if (result.success) {
                setVacancy(result.data);
            }
        } catch {
            console.error("Ошибка загрузки вакансии");
        }
    };

    useEffect(() => {
        fetchVacancyDetails(id);
        fetchRespondVacancies(); // ✅ Загружаем отклики пользователя
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, fetchRespondVacancies, token]);

    useEffect(() => {
        if (responses.length > 0 && vacancy) {            
            setHasResponded(responses.some((res) => res.vacancy_id._id == vacancy._id)); // ✅ Проверяем массив откликов
        }
    }, [vacancy, responses]);

    const handleApplySuccess = async () => {
        await fetchRespondVacancies(); // ✅ Обновляем список откликов
        setHasResponded(true); // ✅ Делаем кнопку неактивной
    };

    if (!vacancy) return <p>Вакансия не найдена</p>;


    const handleEdit = () => {        
        setSelectedVacancy(vacancy); // ✅ Запоминаем вакансию для редактирования
        setIsModalOpen(true);
    };

    const handleSubmit = (vacancyData) => {
        updateVacancy(vacancyData, selectedVacancy._id); // ✅ Обновляем вакансию
        setIsModalOpen(false);
        setSelectedVacancy(null);
    };

    const handleDelete = (vacancyId) => {
        deleteVacancy(vacancyId)
        navigate('/admin/vacancies', { replace: true });
    }


    return (
        <div className="vacancy-page">
            <div className="vacancy-container">

                <div className="company-info-box">
                    <div className="company-details">
                        <h3>{vacancy.company.name}</h3>
                        <p><strong>Описание:</strong> {vacancy.company.activity || "Нет описания"}</p>
                    </div>
                </div>
                
                <h1 className="vacancy-title">{vacancy.name}</h1>

                <div className="vacancy-details">
                    <p><strong>Опыт:</strong> {vacancy.required_experience ? `${vacancy.required_experience} лет` : "Без опыта"}</p>
                    <p><strong>Зарплата:</strong> {vacancy.salary_amount ? `${vacancy.salary_amount} ${vacancy.currency}` : "Не указана"}</p>
                    <p><strong>Отрасль:</strong> {vacancy.industry_id?.industry_type || "Не указана"}</p>
                    <p><strong>Дата создания:</strong> {new Date(vacancy.createdAt).toLocaleDateString()}</p>
                    <p><strong>Описание:</strong> {vacancy.describe}</p>
                </div>

                {role === 'admin' ? 
                    <>
                        <button 
                            className="edit-button" 
                            onClick={handleEdit}>
                            Изменить
                        </button>
                        <button 
                            className="delete-button" 
                            onClick={() => handleDelete(vacancy._id)}>
                            Удалить
                        </button>
                    </>
                :
                    <button 
                        className="apply-button" 
                        onClick={() => !hasResponded && setIsResponded(true)} 
                        disabled={hasResponded}
                    >
                        {hasResponded ? "Отклик уже отправлен" : "Откликнуться"}
                    </button>
                }

                {isResponded && <ResponseModal vacancyId={vacancy._id} onClose={() => setIsResponded(false)} onApplySuccess={handleApplySuccess}/>}
                {isModalOpen && (
                    <CompanyVacancyForm
                        vacancy={selectedVacancy}
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={handleSubmit}
                    />
                )}
            </div>
        </div>
    );
};

export default VacancyPage;
