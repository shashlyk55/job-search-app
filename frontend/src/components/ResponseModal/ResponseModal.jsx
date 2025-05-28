import { useState, useEffect } from "react";
import "./ResponseModal.css";
import useResumeStore from "../../store/useResumeStore";
import useResponsesStore from "../../store/useResponsesStore";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import responseValidationSchema from "../../validate/responseValidationSchema";

const ResponseModal = ({ vacancyId, onClose, onApplySuccess }) => {
    const { resumes, fetchResumes  } = useResumeStore();
    const { responseToVacancy } = useResponsesStore();
    const [selectedResume, setSelectedResume] = useState(resumes.length > 0 ? resumes[0]._id : "");
    const [message, setMessage] = useState("");

    const { register, handleSubmit, formState: { errors }, clearErrors } = useForm({
        resolver: yupResolver(responseValidationSchema),
    });

    useEffect(() => {
        fetchResumes(); // ✅ Загружаем резюме при открытии модального окна
    }, [fetchResumes]);

    useEffect(() => {
        if (resumes.length > 0) {
            setSelectedResume(resumes[0]._id); // ✅ Выбираем первое резюме по умолчанию
        }
    }, [resumes]);

    const handleResponse = async () => {
        if (!selectedResume) return alert("Выберите резюме для отклика!");
        clearErrors()
        const success = await responseToVacancy({ vacancy_id: vacancyId, resume_id: selectedResume, applicant_pinned_message: message });
        if (success) {
            onApplySuccess();
            onClose(); // ✅ Закрываем окно после успешного отклика
        }
    };

    return (
        <div className="apply-modal-overlay" onClick={onClose}>
            <div className="apply-modal" onClick={(e) => e.stopPropagation()}>
                <h3>Отклик на вакансию</h3>

                <label>Выберите резюме</label>
                <select value={selectedResume} onChange={(e) => setSelectedResume(e.target.value)}>
                    {resumes.map((resume) => (
                        <option key={resume._id} value={resume._id}>{resume.name}</option>
                    ))}
                </select>

                <label>Сообщение</label>
                <textarea 
                {...register("pinned_message")}
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} placeholder="Напишите сопроводительное письмо...">
                </textarea>
                {errors.pinned_message && <p className="err-text">{errors.pinned_message.message}</p>}            

                <div className="modal-actions">
                    <button className="cancel-button" onClick={onClose}>Отмена</button>
                    <button className="apply-button" onClick={handleSubmit(handleResponse)}>Отправить</button>
                </div>
            </div>
        </div>
    );
};

export default ResponseModal;
