import { useEffect } from "react";
import "./ResumeSidebar.css";
import FullResumeItem from "../FullResumeItem/FullResumeItem";
import useResumeStore from "../../../store/useResumeStore";

const ResumeSidebar = ({ resume, onClose, isCreating }) => {
    const { addResume, editResume, deleteResume } = useResumeStore();

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = "auto"; };
    }, []);

    const handleSave = (newData) => {
        if (isCreating) {
            addResume(newData);
        } else {
            editResume(newData, resume._id);
        }
        onClose();
    };

    const handleDelete = (resumeId) => {
        if (confirm("Вы уверены, что хотите удалить это резюме?")) {
            deleteResume(resumeId);
            onClose();
        }
    };

    return (
        <div className="resume-sidebar-overlay" onClick={onClose}>
            <div className="resume-sidebar" onClick={(e) => e.stopPropagation()}>
                <FullResumeItem resume={resume} onSave={handleSave} onCancel={onClose} onDelete={handleDelete} isEditing={isCreating} isCreating={isCreating} /> {/* ✅ Добавляем `onCancel={onClose}` */}
            </div>
        </div>
    );
};

export default ResumeSidebar;
