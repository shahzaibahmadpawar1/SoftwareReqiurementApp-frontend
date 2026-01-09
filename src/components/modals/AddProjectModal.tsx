import { useState } from 'react';
import { projectsApi } from '../../services/api';
import { Project } from '../../types';

interface AddProjectModalProps {
    onClose: () => void;
    onProjectCreated: (project: Project) => void;
}

const AddProjectModal = ({ onClose, onProjectCreated }: AddProjectModalProps) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            setError('Project name is required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await projectsApi.create({
                name: name.trim(),
                description: description.trim() || undefined,
            });
            onProjectCreated(response.data);
        } catch (err) {
            setError('Failed to create project. Please try again.');
            console.error('Error creating project:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Create New Project</h2>
                    <button className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="project-name">
                            Project Name *
                        </label>
                        <input
                            id="project-name"
                            type="text"
                            className="form-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter project name"
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="project-description">
                            Description
                        </label>
                        <textarea
                            id="project-description"
                            className="form-textarea"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Provide an overall idea about the project"
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
                            {loading ? 'Creating...' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProjectModal;
