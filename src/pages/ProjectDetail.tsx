import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { projectsApi } from '../services/api';
import type { Project } from '../types';
import UsersTab from '../components/tabs/UsersTab';
import PagesTab from '../components/tabs/PagesTab';
import WorkflowsTab from '../components/tabs/WorkflowsTab';
import './ProjectDetail.css';

type TabType = 'users' | 'pages' | 'workflows';

const ProjectDetail = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('users');

    useEffect(() => {
        if (projectId) {
            loadProject();
        }
    }, [projectId]);

    const loadProject = async () => {
        try {
            const response = await projectsApi.getById(parseInt(projectId!));
            setProject(response.data);
        } catch (error) {
            console.error('Error loading project:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="empty-state">
                <h2>Project not found</h2>
            </div>
        );
    }

    return (
        <div className="project-detail-page">
            <div className="project-header">
                <div>
                    <h1 className="project-title">{project.name}</h1>
                    {project.description && (
                        <p className="project-description">{project.description}</p>
                    )}
                </div>
            </div>

            <div className="tabs-container">
                <div className="tabs-header">
                    <button
                        className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        <span className="tab-icon">👥</span>
                        Users
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'pages' ? 'active' : ''}`}
                        onClick={() => setActiveTab('pages')}
                    >
                        <span className="tab-icon">📄</span>
                        Pages
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'workflows' ? 'active' : ''}`}
                        onClick={() => setActiveTab('workflows')}
                    >
                        <span className="tab-icon">🔄</span>
                        Workflows
                    </button>
                </div>

                <div className="tabs-content">
                    {activeTab === 'users' && <UsersTab projectId={parseInt(projectId!)} />}
                    {activeTab === 'pages' && <PagesTab projectId={parseInt(projectId!)} />}
                    {activeTab === 'workflows' && <WorkflowsTab projectId={parseInt(projectId!)} />}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;
