import { useState, useEffect } from 'react';
import { usersApi, pagesApi, functionalitiesApi } from '../../services/api';
import { RequirementUser, Page, Functionality } from '../../types';
import AddUserModal from '../modals/AddUserModal';
import './Tabs.css';

interface UsersTabProps {
    projectId: number;
}

const UsersTab = ({ projectId }: UsersTabProps) => {
    const [users, setUsers] = useState<RequirementUser[]>([]);
    const [pages, setPages] = useState<Page[]>([]);
    const [functionalities, setFunctionalities] = useState<Functionality[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        loadData();
    }, [projectId]);

    const loadData = async () => {
        try {
            const [usersRes, pagesRes] = await Promise.all([
                usersApi.getByProject(projectId),
                pagesApi.getByProject(projectId),
            ]);

            setUsers(usersRes.data);
            setPages(pagesRes.data);

            // Load all functionalities for all pages
            const allFunctionalities: Functionality[] = [];
            for (const page of pagesRes.data) {
                const funcRes = await functionalitiesApi.getByPage(page.id);
                allFunctionalities.push(...funcRes.data);
            }
            setFunctionalities(allFunctionalities);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserCreated = (user: RequirementUser) => {
        setUsers([...users, user]);
        setShowAddModal(false);
    };

    const handleDeleteUser = async (userId: number) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            await usersApi.delete(userId);
            setUsers(users.filter(u => u.id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="tab-content">
            <div className="tab-header">
                <div>
                    <h2 className="tab-title">Requirement Users</h2>
                    <p className="tab-description">
                        Define users with their roles, privileges, and access permissions
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                    <span>+</span>
                    Add User
                </button>
            </div>

            {users.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">👥</div>
                    <h3 className="empty-state-title">No Users Defined</h3>
                    <p className="empty-state-description">
                        Start by adding users who will interact with your system
                    </p>
                    <button className="btn btn-primary mt-lg" onClick={() => setShowAddModal(true)}>
                        <span>+</span>
                        Add First User
                    </button>
                </div>
            ) : (
                <div className="items-grid">
                    {users.map((user) => (
                        <div key={user.id} className="item-card card">
                            <div className="item-card-header">
                                <h3 className="item-card-title">{user.name}</h3>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDeleteUser(user.id)}
                                >
                                    Delete
                                </button>
                            </div>

                            {user.description && (
                                <p className="item-card-description">{user.description}</p>
                            )}

                            {user.privileges && Array.isArray(user.privileges) && user.privileges.length > 0 && (
                                <div className="item-card-section">
                                    <h4 className="item-card-section-title">Privileges</h4>
                                    <div className="badges-list">
                                        {user.privileges.map((privilege, idx) => (
                                            <span key={idx} className="badge badge-primary">
                                                {privilege}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {showAddModal && (
                <AddUserModal
                    projectId={projectId}
                    pages={pages}
                    functionalities={functionalities}
                    onClose={() => setShowAddModal(false)}
                    onUserCreated={handleUserCreated}
                />
            )}
        </div>
    );
};

export default UsersTab;
