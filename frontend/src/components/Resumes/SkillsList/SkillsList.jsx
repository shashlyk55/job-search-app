import "./SkillsList.css";

const SkillsList = ({ skills, onRemoveSkill, onAddSkill, onChangeSkill, isEditing, register, errors }) => {
    return (
        <div className="skills-list">
            <h3>Навыки</h3>
            <div className="skills-container">
                {skills.map((skill, index) => (
                    <div key={index} className="skill-item">
                        {isEditing ? (
                            <>
                                <input
                                {...register(`skills.${index}`)} // ✅ Добавляем валидацию для конкретного навыка
                                    type="text"
                                    value={skill}
                                    onChange={(e) => onChangeSkill(index, e.target.value)}
                                    className="resume-input"
                                />
                                {errors.skills?.[index] && <p className="err-text">{errors.skills[index].message}</p>}
                            </>
                        ) : (
                            <span>{skill}</span>
                        )}
                        {isEditing && <button className="remove-button" onClick={() => onRemoveSkill(index)}>✖</button>}
                    </div>
                ))}
                {isEditing && <button className="add-button" onClick={onAddSkill}>➕ Добавить навык</button>}
            </div>
        </div>
    );
};

export default SkillsList;
