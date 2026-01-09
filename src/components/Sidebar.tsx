import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { projectsApi } from '../services/api';
import type { Project } from '../types';
import './Layout.css';

const Sidebar = () => {
    const { projectId } = useParams();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <Link to="/" className="sidebar-logo">
                    <div className="sidebar-logo-icon">R</div>
                    <div className="sidebar-logo-text">
                        <h1>Requirements</h1>
                        <p>Gathering App</p>
                    </div>
                </Link>
            </div>

            <div className="sidebar-content">
                <div className="sidebar-section">
                    <h3 className="sidebar-section-title">Projects</h3>
                    {loading ? (
                        <div className="sidebar-empty">Loading...</div>
                    ) : projects.length === 0 ? (
                        <div className="sidebar-empty">No projects yet</div>
                    ) : (
                        <div className="sidebar-projects">
                            {projects.map((project) => (
                                <Link
                                    key={project.id}
                                    to={`/projects/${project.id}`}
                                    className={`sidebar-project-item ${projectId === String(project.id) ? 'active' : ''
                                        }`}
                                >
                                    <div className="sidebar-project-name">{project.name}</div>
                                    {project.description && (
                                        <div className="sidebar-project-description">
                                            {project.description}
                                        </div>
                                    )}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
