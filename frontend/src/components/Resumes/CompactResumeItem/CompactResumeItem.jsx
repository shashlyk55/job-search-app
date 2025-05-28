import { useState } from "react";
import "./CompactResumeItem.css";
import ResumeSidebar from "../ResumeSidebar/ResumeSidebar";

const CompactResumeItem = ({ resume }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <>
            <div className="compact-resume" onClick={() => setIsSidebarOpen(true)}>
                <h3 className="resume-name">{resume.name}</h3>
                <p className="resume-biography">
                    {resume.biography ? `${resume.biography.slice(0, 50)}...` : "Нет биографии"}
                </p>
                <div className="resume-skills">
                    {resume.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="resume-skill">{skill}</span>
                    ))}
                </div>
            </div>

            {isSidebarOpen && <ResumeSidebar resume={resume} onClose={() => setIsSidebarOpen(false)} />}
        </>
    );
};

export default CompactResumeItem;
