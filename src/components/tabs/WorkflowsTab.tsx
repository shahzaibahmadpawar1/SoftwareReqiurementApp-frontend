import { useState, useEffect } from 'react';
import { workflowsApi } from '../../services/api';
import type { Workflow } from '../../types';
import AddWorkflowModal from '../modals/AddWorkflowModal';
import WorkflowViewer from '../WorkflowViewer';
import './Tabs.css';

interface WorkflowsTabProps {
    projectId: number;
}

const WorkflowsTab = ({ projectId }: WorkflowsTabProps) => {
    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);

    useEffect(() => {
        loadWorkflows();
    }, [projectId]);

    const loadWorkflows = async () => {
        try {
            const response = await workflowsApi.getByProject(projectId);
            setWorkflows(response.data);
        } catch (error) {
            console.error('Error loading workflows:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleWorkflowCreated = (workflow: Workflow) => {
        setWorkflows([...workflows, workflow]);
        setShowAddModal(false);
    };

    const handleDeleteWorkflow = async (workflowId: number) => {
        if (!confirm('Are you sure you want to delete this workflow?')) return;

        try {
            await workflowsApi.delete(workflowId);
            setWorkflows(workflows.filter(w => w.id !== workflowId));
            if (selectedWorkflow?.id === workflowId) {
                setSelectedWorkflow(null);
            }
        } catch (error) {
            console.error('Error deleting workflow:', error);
            alert('Failed to delete workflow');
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
                    <h2 className="tab-title">Workflows</h2>
                    <p className="tab-description">
                        Define visual workflows showing how users interact with the system
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                    <span>+</span>
                    Add Workflow
                </button>
            </div>

            {workflows.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">🔄</div>
                    <h3 className="empty-state-title">No Workflows Defined</h3>
                    <p className="empty-state-description">
                        Create workflows to visualize user interactions with pages and functionalities
                    </p>
                    <button className="btn btn-primary mt-lg" onClick={() => setShowAddModal(true)}>
                        <span>+</span>
                        Add First Workflow
                    </button>
                </div>
            ) : (
                <div className="workflows-container">
                    <div className="workflows-sidebar">
                        {workflows.map((workflow) => (
                            <div
                                key={workflow.id}
                                className={`workflow-item ${selectedWorkflow?.id === workflow.id ? 'active' : ''}`}
                                onClick={() => setSelectedWorkflow(workflow)}
                            >
                                <div className="workflow-item-header">
                                    <h4 className="workflow-item-title">{workflow.name}</h4>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteWorkflow(workflow.id);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                                {workflow.description && (
                                    <p className="workflow-item-description">{workflow.description}</p>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="workflows-viewer">
                        {selectedWorkflow ? (
                            <WorkflowViewer workflow={selectedWorkflow} projectId={projectId} />
                        ) : (
                            <div className="empty-state">
                                <p className="text-tertiary">Select a workflow to view</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showAddModal && (
                <AddWorkflowModal
                    projectId={projectId}
                    onClose={() => setShowAddModal(false)}
                    onWorkflowCreated={handleWorkflowCreated}
                />
            )}
        </div>
    );
};

export default WorkflowsTab;
