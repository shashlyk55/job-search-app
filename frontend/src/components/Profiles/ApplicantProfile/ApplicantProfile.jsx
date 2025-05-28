import { useEffect, useState } from "react";
import "./ApplicantProfile.css";
import ResumeManager from "../../Resumes/ResumeManager/ResumeManager";
import useApplicantStore from "../../../store/useApplicantStore";
import useAuthStore from "../../../store/useAuthStore";
import EditProfileModal from "../EditProfileModal/EditProfileModal";

const ProfilePage = () => {
    const { token } = useAuthStore()
    //const { applicant, fetchApplicantProfile } = useApplicantStore()

    const applicant = useApplicantStore((state) => state.applicant);
    const fetchApplicantProfile = useApplicantStore((state) => state.fetchApplicantProfile);
    
    const [isModalOpen, setIsModalOpen] = useState(false); // ✅ Состояние модального окна
    
    useEffect(() => {
        if(token){
            fetchApplicantProfile()                
        }
    }, [token, fetchApplicantProfile])

    // useEffect(() => {
    //     console.log("applicant обновился:", applicant);
    // }, [applicant]);
    
    const handleOpenModal = () => {
        setIsModalOpen(true)
    }

    return (
        <div className="applicant-profile-container">
            <h2>Профиль пользователя</h2>
            <div className="profile-info">
                {applicant?.name ? (
                    <>
                        <div className="container">
                            <div>
                                <p><strong>Имя:</strong> {applicant.name}</p>
                                <p><strong>Создан:{new Date(applicant.createdAt).toLocaleDateString()}</strong></p>
                            </div>
                            <div className="contacts">
                                <p><strong>Email:</strong> {applicant.contacts?.email}</p>
                                <p><strong>Телефон:</strong> {applicant.contacts?.phone || "Не указан"}</p>
                            </div>
                        </div>
                        {/* Кнопка редактирования */}
                        <div className="profile-actions">
                            <button className="edit-button" onClick={handleOpenModal}>Редактировать</button>
                        </div>
                    </>
                ) : (
                    <p>Загрузка профиля...</p> // ✅ Показываем индикатор загрузки, пока данные загружаются
                )}
            </div>


            {/* Вставляем модальное окно */}
            <EditProfileModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                //profileData={applicant}
                />
            
            <ResumeManager />

        </div>
    );
};

export default ProfilePage;
