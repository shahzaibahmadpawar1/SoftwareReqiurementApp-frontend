import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsApi } from '../services/api';
import type { Project } from '../types';
import AddProjectModal from '../components/modals/AddProjectModal';
import './ProjectList.css';

const ProjectList = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const response = await projectsApi.getAll();
            setProjects(response.data);
        } catch (error) {
            console.error('Error loading projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProjectCreated = (project: Project) => {
        setProjects([...projects, project]);
        setShowAddModal(false);
        navigate(`/projects/${project.id}`);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="project-list-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Software Requirements</h1>
                    <p className="page-description">
                        Manage your software requirement gathering projects
                    </p>
                </div>
                <button className="btn btn-primary btn-lg" onClick={() => setShowAddModal(true)}>
                    <span>+</span>
                    Add New Project
                </button>
            </div>

            {projects.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📋</div>
                    <h2 className="empty-state-title">No Projects Yet</h2>
                    <p className="empty-state-description">
                        Get started by creating your first software requirement project
                    </p>
                    <button className="btn btn-primary btn-lg mt-lg" onClick={() => setShowAddModal(true)}>
                        <span>+</span>
                        Create Your First Project
                    </button>
                </div>
            ) : (
                <div className="projects-grid">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="project-card card"
                            onClick={() => navigate(`/projects/${project.id}`)}
                        >
                            <div className="project-card-header">
                                <h3 className="project-card-title">{project.name}</h3>
                                <span className="badge badge-primary">Active</span>
                            </div>
                            {project.description && (
                                <p className="project-card-description">{project.description}</p>
                            )}
                            <div className="project-card-footer">
                                <span className="text-xs text-tertiary">
                                    Created {new Date(project.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showAddModal && (
                <AddProjectModal
                    onClose={() => setShowAddModal(false)}
                    onProjectCreated={handleProjectCreated}
                />
            )}
        </div>
    );
};

export default ProjectList;
