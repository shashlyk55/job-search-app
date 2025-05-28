import AdminVacancyItem from "../AdminVacancy/AdminVacancyItem"
import './AdminVacanciesList.css'

const AdminVacanciesList = ({vacancies}) => {

    return (<div className="vacancies-list">
        {vacancies.map((vacancy) => (
            <AdminVacancyItem key={vacancy._id} vacancy={vacancy}/>
        ))}
    </div>)
}

export default AdminVacanciesList