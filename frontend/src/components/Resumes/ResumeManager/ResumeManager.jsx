import { useState, useEffect } from "react";
import "./ResumeManager.css";
import useResumeStore from "../../../store/useResumeStore";
import ResumeSidebar from "../ResumeSidebar/ResumeSidebar";
import CompactResumeItem from "../CompactResumeItem/CompactResumeItem";

const ResumeManager = () => {
    const { resumes, fetchResumes } = useResumeStore();
    const [selectedResume, setSelectedResume] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchResumes(); // ✅ Загружаем резюме при монтировании компонента
    }, [fetchResumes]);

    const handleCreateResume = () => {
        setSelectedResume({ name: "", biography: "", skills: [], work_experience: [] }); // ✅ Создаём пустое резюме
        setIsCreating(true); // ✅ Включаем режим редактирования
    };

    return (
        <div className="resume-container">
            <ul className="resume-list">
                {resumes.length > 0 ? (
                    resumes.map((resume) => (
                        <CompactResumeItem key={resume._id} resume={resume} onClick={() => {
                            setSelectedResume(resume);
                            setIsCreating(false); // ✅ Открываем существующее резюме без редактирования
                        }} />
                    ))
                ) : (
                    <p>У вас пока нет резюме</p>
                )}
            </ul>
            <button className="create-button" onClick={handleCreateResume}>➕ Создать резюме</button>

            {selectedResume && <ResumeSidebar resume={selectedResume} onClose={() => setSelectedResume(null)} isCreating={isCreating} />}
        </div>
    );
};

export default ResumeManager;
