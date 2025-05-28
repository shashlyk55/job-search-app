import "./ExperienceList.css";

const ExperienceList = ({ experience, onRemoveExperience, onAddExperience, isEditing, onChangeExperience }) => {
    return (
        <div className="experience-list">
            <h3>Опыт работы</h3>
            <div className="experience-container">
                {experience.map((exp, index) => (
                    <div key={index} className="experience-item">
                        {isEditing ? (
                            <>
                                <input 
                                    type="text" 
                                    value={exp.company} 
                                    onChange={(e) => onChangeExperience(index, "company", e.target.value)} 
                                    className="resume-input"
                                />
                                <input 
                                    type="text" 
                                    value={exp.position} 
                                    onChange={(e) => onChangeExperience(index, "position", e.target.value)} 
                                    className="resume-input"
                                />
                                <input 
                                    type="number" 
                                    value={exp.years_of_work} 
                                    onChange={(e) => onChangeExperience(index, "years_of_work", e.target.value)} 
                                    className="resume-input"
                                />
                                <button className="remove-button" onClick={() => onRemoveExperience(index)}>✖</button>
                            </>
                        ) : (
                            <p><strong>{exp.company}</strong> - {exp.position} ({exp.years_of_work || "?"} лет)</p>
                        )}
                    </div>
                ))}
                {isEditing && <button className="add-button" onClick={onAddExperience}>➕ Добавить место работы</button>}
            </div>
        </div>
    );
};

export default ExperienceList;
