import { useEffect } from "react";
import useAdminStore from "../../../store/useAdminStore";
import UserItem from "../../../components/UserItem/UserItem";
import "./AdminUsersPage.css";

const AdminUsersPage = () => {
    const { users, fetchUsers } = useAdminStore()

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers], users);

    return (
        <div className="admin-users">
            <h2>Пользователи</h2>
            <div className="users-list">
                {users.map((user) => (
                    <UserItem key={user._id} user={user}/>
                ))}
            </div>
        </div>
    );
};

export default AdminUsersPage;
