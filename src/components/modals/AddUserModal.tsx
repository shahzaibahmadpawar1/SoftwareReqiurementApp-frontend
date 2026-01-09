import { useState } from 'react';
import { usersApi } from '../../services/api';
import type { RequirementUser, Page, Functionality } from '../../types';

interface AddUserModalProps {
    projectId: number;
    pages: Page[];
    functionalities: Functionality[];
    onClose: () => void;
    onUserCreated: (user: RequirementUser) => void;
}

const AddUserModal = ({ projectId, pages, functionalities, onClose, onUserCreated }: AddUserModalProps) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [privilegesText, setPrivilegesText] = useState('');
    const [selectedPages, setSelectedPages] = useState<number[]>([]);
    const [selectedFunctionalities, setSelectedFunctionalities] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            setError('User name is required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const privileges = privilegesText
                .split(',')
                .map(p => p.trim())
                .filter(p => p.length > 0);

            const response = await usersApi.create({
                projectId,
                name: name.trim(),
                description: description.trim() || undefined,
                privileges: privileges.length > 0 ? privileges : undefined,
                pageAccess: selectedPages.length > 0 ? selectedPages : undefined,
                functionalityAccess: selectedFunctionalities.length > 0 ? selectedFunctionalities : undefined,
            });

            onUserCreated(response.data);
        } catch (err) {
            setError('Failed to create user. Please try again.');
            console.error('Error creating user:', err);
        } finally {
            setLoading(false);
        }
    };

    const togglePage = (pageId: number) => {
        setSelectedPages(prev =>
            prev.includes(pageId)
                ? prev.filter(id => id !== pageId)
                : [...prev, pageId]
        );
    };

    const toggleFunctionality = (funcId: number) => {
        setSelectedFunctionalities(prev =>
            prev.includes(funcId)
                ? prev.filter(id => id !== funcId)
                : [...prev, funcId]
        );
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
                <div className="modal-header">
                    <h2 className="modal-title">Add Requirement User</h2>
                    <button className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="user-name">
                            User Name *
                        </label>
                        <input
                            id="user-name"
                            type="text"
                            className="form-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Admin, Customer, Manager"
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="user-description">
                            Description
                        </label>
                        <textarea
                            id="user-description"
                            className="form-textarea"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the user's role and responsibilities"
                            rows={3}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="user-privileges">
                            Privileges / Access (comma-separated)
                        </label>
                        <input
                            id="user-privileges"
                            type="text"
                            className="form-input"
                            value={privilegesText}
                            onChange={(e) => setPrivilegesText(e.target.value)}
                            placeholder="e.g., Create, Read, Update, Delete"
                        />
                    </div>

                    {pages.length > 0 && (
                        <div className="form-group">
                            <label className="form-label">Page Access</label>
                            <div style={{ maxHeight: '150px', overflowY: 'auto', padding: '0.5rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                                {pages.map(page => (
                                    <label key={page.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedPages.includes(page.id)}
                                            onChange={() => togglePage(page.id)}
                                        />
                                        <span>{page.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {functionalities.length > 0 && (
                        <div className="form-group">
                            <label className="form-label">Functionality Access</label>
                            <div style={{ maxHeight: '150px', overflowY: 'auto', padding: '0.5rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                                {functionalities.map(func => (
                                    <label key={func.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedFunctionalities.includes(func.id)}
                                            onChange={() => toggleFunctionality(func.id)}
                                        />
                                        <span>{func.name} <span className="badge badge-primary" style={{ marginLeft: '0.5rem' }}>{func.type}</span></span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="form-error">{error}</div>
                    )}

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserModal;
