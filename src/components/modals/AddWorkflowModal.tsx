import { useState } from 'react';
import { workflowsApi } from '../../services/api';
import type { Workflow } from '../../types';

interface AddWorkflowModalProps {
    projectId: number;
    onClose: () => void;
    onWorkflowCreated: (workflow: Workflow) => void;
}

const AddWorkflowModal = ({ projectId, onClose, onWorkflowCreated }: AddWorkflowModalProps) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            setError('Workflow name is required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Create workflow with empty flowchart data
            const response = await workflowsApi.create({
                projectId,
                name: name.trim(),
                description: description.trim() || undefined,
                flowchartData: { nodes: [], edges: [] },
            });
            onWorkflowCreated(response.data);
        } catch (err) {
            setError('Failed to create workflow. Please try again.');
            console.error('Error creating workflow:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Create New Workflow</h2>
                    <button className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="workflow-name">
                            Workflow Name *
                        </label>
                        <input
                            id="workflow-name"
                            type="text"
                            className="form-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., User Login Flow, Order Processing"
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="workflow-description">
                            Description
                        </label>
                        <textarea
                            id="workflow-description"
                            className="form-textarea"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe how users interact with the system in this workflow"
                            rows={4}
                        />
                    </div>

                    <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                        <p className="text-sm text-secondary">
                            💡 <strong>Note:</strong> You can edit the workflow diagram after creation using the visual editor.
                        </p>
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
                            {loading ? 'Creating...' : 'Create Workflow'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddWorkflowModal;
