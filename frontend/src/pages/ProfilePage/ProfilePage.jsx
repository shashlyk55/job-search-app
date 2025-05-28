import ApplicantProfile from "../../components/Profiles/ApplicantProfile/ApplicantProfile";
import EmployerProfile from "../../components/Profiles/EmployerProfile/EmployerProfile";
import useAuthStore from "../../store/useAuthStore";
import './ProfilePage.css'


const ProfilePage = () => {
    const { role } = useAuthStore();
    
    // if (isLoading) {
    //   return <p>Загрузка...</p>; // ✅ Показываем индикатор загрузки, пока `checkAuth()` выполняется
    // }

    switch(role){
      case('applicant'):{
        return <div className="applicant-profile">
                  <ApplicantProfile />
              </div>
      }
      case('employer'):{
        return <div className="employer-profile">
                  {/* <EmployerProfile employer={user} /> */}
                  <EmployerProfile />
              </div>
      }
      default:{
        return <div>Не авторизован</div>
      }
    }
};

export default ProfilePage;