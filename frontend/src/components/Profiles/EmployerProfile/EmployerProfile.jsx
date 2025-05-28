// import { useEffect, useState } from "react"
// import "./EmployerProfile.css";
// import useAuthStore from "../../../store/useAuthStore"

// const EmployerProfile = () => {
//     const { user: employer, updateEmployer, sendJoinCompanyRequest, cancelJoinCompanyRequest, getEmployerProfile } = useAuthStore(); 
//     const [isEditing, setIsEditing] = useState(false);
//     // ✅ Объединяем `company_regnum` и `pinned_message` в `companyJoinData`
//     const [companyJoinData, setCompanyJoinData] = useState({
//         company_regnum: "",
//         pinned_message: "",
//     });
//     const [isRequestSent, setIsRequestSent] = useState(false); // ✅ Отслеживаем, отправлен ли запрос
    
//     const [editedData, setEditedData] = useState({        
//         contacts: {
//             phone: employer.user.contacts.phone || "",
//             email: employer.user.contacts.email || "",
//         },
//         name: employer.user.name || "",
//     });

//     const [company, setCompany] = useState({
//         company_regnum: '',
//         description: '',
//         name: ''
//     })

//     const fetchCompany = async () => {
//         const profile = await getEmployerProfile()
//         console.log(profile);
        
//         if(profile.company.company_regnum){
//             const response = await fetch(`https://egr.gov.by/api/v2/egr/getShortInfoByRegNum/${profile.company.company_regnum}`,
//                 {
//                     method: 'GET',
//                 }
//             )
//             const result = await response.json()
//             console.log(result[0]);
//             const company = {
//                 company_regnum: result[0].ngrn,
//                 //description: result[0].nsi00114,
//                 name: result[0].vfn
//             }
//             setCompany(company)
//         }else{
//             setIsRequestSent(!!profile.requested_company)
//             const company = {
//                 requested_company: profile.requested_company
//             }
//             setCompany(company)
            
//         }
//     }

//     useEffect(() => {                
//         fetchCompany()
//     }, [])
    
//     if (!employer || employer.role !== "employer") {
//         return <p>Вы не являетесь работодателем</p>;
//     }

//     const handleChange = (e) => {
//         const { name, value } = e.target;

//         setEditedData((prevData) => {
//             const updatedData = { ...prevData };
    
//             if (name.startsWith("contacts.")) {
//                 updatedData.contacts = {
//                     ...prevData.contacts,
//                     [name.replace("contacts.", "")]: value
//                 };
//             } else {
//                 updatedData[name] = value;
//             }
    
//             return updatedData;
//         });
//     };

//     const handleSave = () => {
//         updateEmployer(editedData);
//         setIsEditing(false);
//     };

//     const handleCancel = () => {
//         setEditedData({
//             contacts: {
//                 phone: employer.user.contacts.phone || "",
//                 email: employer.user.contacts.email || "",
//             },
//             name: employer.user.name || "",
//         }); 
//         setIsEditing(false); 
//     };
    
//     const handleJoinChange = (e) => {
//         setCompanyJoinData({ ...companyJoinData, [e.target.name]: e.target.value });
//         //setCompany(companyJoinData)
//     };

//     const handleJoinCompany = async () => {
//         const success = await sendJoinCompanyRequest(companyJoinData); // ✅ Отправляем оба поля
//         console.log(success);
        
//         if(success){
//             setIsRequestSent(true); // ✅ Устанавливаем `true`, чтобы заблокировать поля

//         } 
//     };

//     const handleCancelRequest = () => {
//         cancelJoinCompanyRequest(companyJoinData.company_regnum);
//         setCompanyJoinData({ company_regnum: "", pinned_message: "" }); // ✅ Очищаем поля
//         setIsRequestSent(false); // ✅ Возвращаем форму в исходное состояние
//     };

//     return (
//         <div className="profile-container">
//             <div className="profile-data">
//                 <div className="profile-section">
//                     <h2>Личные данные</h2>
//                     {isEditing ? (
//                         <input type="text" name="name" value={editedData.name} onChange={handleChange} />
//                     ) : (
//                         <p><strong>Имя:</strong> {employer.user.name}</p>
//                     )}
//                     <p><strong>Дата регистрации:</strong> {new Date(employer.user.createdAt).toLocaleDateString()}</p>
//                 </div>

//                 {/* 🔹 Контактные данные */}
//                 <div className="profile-section">
//                     <h2>Контактные данные</h2>
//                     {isEditing ? (
//                         <>
//                             <input type="text" name="contacts.email" value={editedData.contacts.email} onChange={handleChange} />
//                             <input type="text" name="contacts.phone" value={editedData.contacts.phone} onChange={handleChange} />
//                         </>
//                     ) : (
//                         <>
//                             <p><strong>Email:</strong> {employer.user.contacts.email}</p>
//                             <p><strong>Телефон:</strong> {employer.user.contacts.phone || "Не указан"}</p>
//                         </>
//                     )}
//                 </div>
//             </div>
//                 {/* 🔹 Блок с информацией о компании */}
//                 <div className="profile-company">
//                     <h2>Компания</h2>
//                     {company.company_regnum ? (
//                         <>
//                             <p><strong>Регистрационный номер:</strong> {company.company_regnum || "Не указан"}</p>
//                             <p><strong>Название:</strong> {company.name}</p>
//                             <p><strong>Описание:</strong> {company.description || "Нет информации"}</p>
//                         </>
//                     ) : isRequestSent ? (
//                         <div className="company-join">
//                             <p>Вы отправили запрос на присоединение к компании с УНП {companyJoinData.company_regnum}</p>
//                             <button className="cancel-button" onClick={handleCancelRequest}>Отменить запрос</button>
//                         </div>
//                         ) : (
//                         <div className="company-join">
//                             <p>Вы не привязаны к компании. Введите регистрационный номер и сообщение:</p>
//                             <input 
//                                 type="text" 
//                                 name="company_regnum" 
//                                 placeholder="Регистрационный номер компании" 
//                                 value={companyJoinData.company_regnum} 
//                                 onChange={handleJoinChange} 
//                             />
//                             <textarea 
//                                 name="pinned_message"
//                                 placeholder="Добавьте сообщение к запросу..." 
//                                 value={companyJoinData.pinned_message} 
//                                 onChange={handleJoinChange} 
//                             ></textarea>
//                             <button className="join-button" onClick={handleJoinCompany}>Присоединиться</button>
//                             {/* {isRequestSent ? 
//                                 ( <button className="cancel-button" onClick={handleCancelRequest}>Отменить запрос</button> ) 
//                                 : 
//                                 ( <button className="join-button" onClick={handleJoinCompany}>Присоединиться</button> )
//                             } */}
//                         </div>
//                     )}
//                 </div>
            
//             {/* 🔹 Кнопки */}
//             <div className="profile-actions">
//                 {isEditing ? (
//                     <>
//                         <button className="save-button" onClick={handleSave}>Сохранить изменения</button>
//                         <button className="cancel-button" onClick={handleCancel}>Отменить изменения</button>
//                     </>
//                 ) : (
//                     <button className="edit-button" onClick={() => setIsEditing(true)}>Редактировать профиль</button>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default EmployerProfile;
import { useEffect, useState } from "react";
import "./EmployerProfile.css";
import useEmployerStore from "../../../store/useEmployerStore";
import useAuthStore from "../../../store/useAuthStore";
import EditProfileModal from "../EditProfileModal/EditProfileModal";

const EmployerProfile = () => {
    const { sendJoinCompanyRequest, cancelJoinCompanyRequest, leaveCompany } = useEmployerStore()
    const { token } = useAuthStore();

    const employer = useEmployerStore((state) => state.employer);
    const fetchEmployerProfile = useEmployerStore((state) => state.fetchEmployerProfile);

    useEffect(() => {
        if(token){
            fetchEmployerProfile()                
        }
    }, [token, fetchEmployerProfile])

    useEffect(() => {
        console.log("employer обновился:", employer);
    }, [employer]);

    const [companyJoinData, setCompanyJoinData] = useState({
        company_regnum: "",
        pinned_message: "",
    });
    const [isRequestSent, setIsRequestSent] = useState(false);
    const [requestedCompany, setRequestedCompany] = useState(""); 
    const [isModalOpen, setIsModalOpen] = useState(false); // ✅ Состояние модального окна

    const handleOpenModal = () => {
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        fetchEmployerProfile()        
        setIsModalOpen(false)
    }

    const handleJoinChange = (e) => {
        setCompanyJoinData({ ...companyJoinData, [e.target.name]: e.target.value });
    };

    const handleJoinCompany = async () => {
        const success = await sendJoinCompanyRequest(companyJoinData);

        if (success) {
            setIsRequestSent(true);
            setRequestedCompany(companyJoinData.company_regnum); // ✅ Сохраняем УНП компании, к которой отправлен запрос
        }
    };

    const handleCancelRequest = async () => {        
        if(await cancelJoinCompanyRequest()){
            setCompanyJoinData({ company_regnum: "", pinned_message: "" });
            setIsRequestSent(false);
            setRequestedCompany(""); // ✅ Очищаем после отмены запроса
        }
    };

    const handleLeaveCompany = () => {
        leaveCompany()
    }


    return (
        <div className="employer-profile-container">
            <h2>Профиль пользователя</h2>
            <div className="profile-info">
                {employer?.user?.name ? (
                    <>
                        <div className="container">
                            <div>
                                <p><strong>Имя:</strong> {employer.user.name}</p>
                                <p><strong>Создан:{new Date(employer.user.createdAt).toLocaleDateString()}</strong></p>
                            </div>
                            <div>
                                <p><strong>Email:</strong> {employer.user.contacts?.email}</p>
                                <p><strong>Телефон:</strong> {employer.user.contacts?.phone || "Не указан"}</p>
                            </div>
                        </div>
                        {/* Кнопка редактирования */}
                        <div className="profile-actions">
                            <button className="edit-button" onClick={handleOpenModal}
                            >Редактировать</button>
                        </div>
                    </>
                ) : (
                    <p>Загрузка профиля...</p> // ✅ Показываем индикатор загрузки, пока данные загружаются
                )}
            </div>


            {/* Вставляем модальное окно */}
            <EditProfileModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                //profileData={applicant}
                />

            <h2>Компания</h2>
            {employer.company ? (
                <div className="company-info">
                    <p><strong>Регистрационный номер:</strong> {employer.company.company_regnum}</p>
                    <p><strong>Название:</strong> {employer.company.name}</p>
                    <p><strong>Деятельность:</strong> {employer.company.activity}</p>
                    <h3>Контактные данные владельца</h3>
                    <p><strong>Email:</strong> {employer.company.boss_contacts.email || "Не указан"}</p>
                    <p><strong>Телефон:</strong> {employer.company.boss_contacts.phone || "Не указан"}</p>
                    <button className="leave-button" onClick={handleLeaveCompany}>Уйти из компании</button>
                </div>
            ) : (
                employer.requested_company ? (
                    <div className="company-join">
                        <p>Запрос отправлен на присоединение к компании с УНП {employer.requested_company}</p>
                        <button className="cancel-button" onClick={handleCancelRequest}>Отменить запрос</button>
                    </div>
                ) : (
                    <div className="company-join">
                        {isRequestSent ? (
                            <>
                                <p>Запрос отправлен на присоединение к компании с УНП {requestedCompany}</p>
                                <button className="cancel-button" onClick={handleCancelRequest}>Отменить запрос</button>
                            </>
                        ) : (
                            <>
                                <p>Вы не привязаны к компании. Введите регистрационный номер и сообщение:</p>
                                <input 
                                    type="text" 
                                    name="company_regnum" 
                                    placeholder="Регистрационный номер компании" 
                                    value={companyJoinData.company_regnum} 
                                    onChange={handleJoinChange} 
                                    disabled={isRequestSent} 
                                />
                                <textarea 
                                    name="pinned_message"
                                    placeholder="Добавьте сообщение к запросу..." 
                                    value={companyJoinData.pinned_message} 
                                    onChange={handleJoinChange} 
                                    disabled={isRequestSent} 
                                ></textarea>
                                <button className="join-button" onClick={handleJoinCompany}>Присоединиться</button>
                            </>
                        )}
                    </div>
                )
            )}
        </div>
    );
};

export default EmployerProfile;
