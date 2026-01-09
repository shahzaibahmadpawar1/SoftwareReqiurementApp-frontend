import { useState } from 'react';
import { pagesApi } from '../../services/api';
import type { Page } from '../../types';

interface AddPageModalProps {
    projectId: number;
    onClose: () => void;
    onPageCreated: (page: Page) => void;
}

const AddPageModal = ({ projectId, onClose, onPageCreated }: AddPageModalProps) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            setError('Page name is required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await pagesApi.create({
                projectId,
                name: name.trim(),
                description: description.trim() || undefined,
            });
            onPageCreated(response.data);
        } catch (err) {
            setError('Failed to create page. Please try again.');
            console.error('Error creating page:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Add New Page</h2>
                    <button className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="page-name">
                            Page Name *
                        </label>
                        <input
                            id="page-name"
                            type="text"
                            className="form-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Dashboard, User Profile, Settings"
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="page-description">
                            Description
                        </label>
                        <textarea
                            id="page-description"
                            className="form-textarea"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe what this page does and what it displays"
                            rows={4}
                        />
                    </div>

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
                            {loading ? 'Creating...' : 'Create Page'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPageModal;
