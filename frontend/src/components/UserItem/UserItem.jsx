import './UserItem.css'
import useAdminStore from "../../store/useAdminStore"
import useErrorsStore from "../../store/useErrorsStore"

const UserItem = ({user}) => {
    const { deleteUser } = useAdminStore()
    const { clearError } = useErrorsStore()
    const handleDeleteUser = (userId) => {
        clearError()
        deleteUser(userId)
    }

    return (<div key={user._id} className="user-card">
                <div className='user-info'>
                    <h3>{user.name}</h3>
                    <p><strong>Email:</strong> {user.contacts.email}</p>
                    <p><strong>Телефон:</strong> {user.contacts.phone || "-"}</p>
                    <p><strong>Роль:</strong> {user.role}</p>
                </div>
                <div className='action-buttons'>
                    <button className="delete-button" onClick={() => handleDeleteUser(user._id)}>Удалить</button>
                </div>
            </div>)
}


export default UserItem