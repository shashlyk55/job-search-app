import { useState } from "react";
import "./FullResumeItem.css";
import SkillsList from "../SkillsList/SkillsList";
import ExperienceList from "../ExperienceList/ExperienceList";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import resumeValidationSchema from "../../../validate/resumeValidationSchema";

const FullResumeItem = ({ resume, onSave, onDelete, isEditing: initialEditing, onCancel, isCreating }) => {
    const [isEditing, setIsEditing] = useState(initialEditing);
    const [editedResume, setEditedResume] = useState({ ...resume });
    const [originalResume, setOriginalResume] = useState({ ...resume });

    const [error, setError] = useState(null)

    const { register, handleSubmit, formState: { errors }, clearErrors } = useForm({
        resolver: yupResolver(resumeValidationSchema),
    });

    const handleSave = () => {  
        setError("")
        if(editedResume.skills.includes('')){
            setError("Поля не должны быть пустыми")
            return
        }  
        const hasEmptyFieldsInCollection = editedResume.work_experience.some(item => 
            !item.company || !item.position || !item.years_of_work
        );
        if (hasEmptyFieldsInCollection) {
            setError("Поля не должны быть пустыми")
            return;
        }            
        clearErrors()
        onSave(editedResume);
        setIsEditing(false);
        setOriginalResume({ ...editedResume });
    };

    const handleCancel = () => {
        clearErrors()
        if (isCreating) {
            onCancel(); // ✅ Если создаём резюме, просто закрываем сайдбар
        } else {
            setEditedResume({ ...originalResume }); // 🔹 Иначе сбрасываем изменения
            setIsEditing(false);
        }
    };

    const handleChangeSkills = (index, value) => {
        const updatedSkills = [...editedResume.skills];
        updatedSkills[index] = value;
        setEditedResume({ ...editedResume, skills: updatedSkills });
    }

    const handleAddSkill = () => {
        if(editedResume.skills.includes('')){
            return
        }
        setEditedResume({ ...editedResume, skills: [...editedResume.skills, ""] })
    }

    const handleRemoveSkill = (index) => {
        setEditedResume({ ...editedResume, skills: editedResume.skills.filter((_, i) => i !== index) })
    }

    const handleAddExperience = () => {
        const hasEmptyFieldsInCollection = editedResume.work_experience.some(item => 
            !item.company || !item.position || !item.years_of_work
        );
        if (hasEmptyFieldsInCollection) {
            return;
        }
        setEditedResume({
            ...editedResume,
            work_experience: [...editedResume.work_experience, { company: "", position: "", years_of_work: "" }]
        })
    }

    const handleRemoveExperience = (index) => {
        setEditedResume({ ...editedResume, work_experience: editedResume.work_experience.filter((_, i) => i !== index) })
    }

    const handleChangeExperience = (index, field, value) => {
        const updatedExperience = [...editedResume.work_experience];
        updatedExperience[index][field] = value;
        setEditedResume({ ...editedResume, work_experience: updatedExperience });
    }

    return (
        <div className="full-resume">
            {isEditing ? (
                <>
                    <input 
                    {...register("name")}
                        type="text" 
                        value={editedResume.name} 
                        onChange={(e) => setEditedResume({ ...editedResume, name: e.target.value })} 
                        className="resume-input"
                    />
                    {errors.name && <p className="err-text">{errors.name.message}</p>}            

                    <textarea 
                    {...register("biography")}
                        value={editedResume.biography} 
                        onChange={(e) => setEditedResume({ ...editedResume, biography: e.target.value })} 
                        className="resume-input"
                    />
                    {errors.biography && <p className="err-text">{errors.biography.message}</p>}            

                    <SkillsList 
                        skills={editedResume.skills} 
                        onRemoveSkill={handleRemoveSkill} 
                        onAddSkill={handleAddSkill}
                        onChangeSkill={handleChangeSkills}
                        isEditing={isEditing} 
                        register={register}
                        errors={errors}
                    />

                    <ExperienceList 
                        experience={editedResume.work_experience} 
                        onRemoveExperience={handleRemoveExperience} 
                        onAddExperience={handleAddExperience}
                        onChangeExperience={handleChangeExperience}
                        isEditing={isEditing} 
                    />

                    {error ? <p className="err-text">{error}</p> : ''}
                    <button className="save-button" onClick={handleSubmit(handleSave)}>Сохранить</button>
                    <button className="cancel-button" onClick={handleCancel}>Отмена</button>
                </>
            ) : (
                <>
                    <h2 className="resume-title">{resume.name}</h2>
                    <p><strong>Биография:</strong> {resume.biography || "Нет информации"}</p>

                    <SkillsList skills={resume.skills} isEditing={isEditing} />
                    <ExperienceList experience={resume.work_experience} isEditing={isEditing} />

                    <button className="edit-button" onClick={() => {
                        setIsEditing(true);
                        setOriginalResume({ ...resume });
                    }}>Редактировать</button>
                    <button className="delete-button" onClick={() => onDelete(resume._id)}>❌ Удалить</button>
                </>
            )}
        </div>
    );
};


export default FullResumeItem;
