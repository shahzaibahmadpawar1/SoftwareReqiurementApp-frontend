import { useState, useEffect } from 'react';
import { pagesApi, functionalitiesApi } from '../../services/api';
import type { Page, Functionality } from '../../types';
import AddPageModal from '../modals/AddPageModal';
import AddFunctionalityModal from '../modals/AddFunctionalityModal';
import './Tabs.css';

interface PagesTabProps {
    projectId: number;
}

const PagesTab = ({ projectId }: PagesTabProps) => {
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddPageModal, setShowAddPageModal] = useState(false);
    const [showAddFuncModal, setShowAddFuncModal] = useState(false);
    const [selectedPageId, setSelectedPageId] = useState<number | null>(null);
    const [expandedPages, setExpandedPages] = useState<Set<number>>(new Set());

    useEffect(() => {
        loadPages();
    }, [projectId]);

    const loadPages = async () => {
        try {
            const response = await pagesApi.getByProject(projectId);
            const pagesData = response.data;

            // Load functionalities for each page
            const pagesWithFuncs = await Promise.all(
                pagesData.map(async (page: Page) => {
                    const funcRes = await functionalitiesApi.getByPage(page.id);
                    return { ...page, functionalities: funcRes.data };
                })
            );

            setPages(pagesWithFuncs);
        } catch (error) {
            console.error('Error loading pages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageCreated = (page: Page) => {
        setPages([...pages, { ...page, functionalities: [] }]);
        setShowAddPageModal(false);
    };

    const handleFunctionalityCreated = (functionality: Functionality) => {
        setPages(pages.map(page =>
            page.id === functionality.pageId
                ? { ...page, functionalities: [...(page.functionalities || []), functionality] }
                : page
        ));
        setShowAddFuncModal(false);
        setSelectedPageId(null);
    };

    const handleDeletePage = async (pageId: number) => {
        if (!confirm('Are you sure you want to delete this page and all its functionalities?')) return;

        try {
            await pagesApi.delete(pageId);
            setPages(pages.filter(p => p.id !== pageId));
        } catch (error) {
            console.error('Error deleting page:', error);
            alert('Failed to delete page');
        }
    };

    const handleDeleteFunctionality = async (funcId: number, pageId: number) => {
        if (!confirm('Are you sure you want to delete this functionality?')) return;

        try {
            await functionalitiesApi.delete(funcId);
            setPages(pages.map(page =>
                page.id === pageId
                    ? { ...page, functionalities: page.functionalities?.filter(f => f.id !== funcId) }
                    : page
            ));
        } catch (error) {
            console.error('Error deleting functionality:', error);
            alert('Failed to delete functionality');
        }
    };

    const togglePageExpanded = (pageId: number) => {
        const newExpanded = new Set(expandedPages);
        if (newExpanded.has(pageId)) {
            newExpanded.delete(pageId);
        } else {
            newExpanded.add(pageId);
        }
        setExpandedPages(newExpanded);
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
                    <h2 className="tab-title">Pages & Functionalities</h2>
                    <p className="tab-description">
                        Define pages and their functionalities (buttons, forms, tables)
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAddPageModal(true)}>
                    <span>+</span>
                    Add Page
                </button>
            </div>

            {pages.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📄</div>
                    <h3 className="empty-state-title">No Pages Defined</h3>
                    <p className="empty-state-description">
                        Create pages and add functionalities to define your application structure
                    </p>
                    <button className="btn btn-primary mt-lg" onClick={() => setShowAddPageModal(true)}>
                        <span>+</span>
                        Add First Page
                    </button>
                </div>
            ) : (
                <div className="pages-list">
                    {pages.map((page) => (
                        <div key={page.id} className="page-item card">
                            <div className="page-item-header" onClick={() => togglePageExpanded(page.id)}>
                                <div className="flex items-center gap-md">
                                    <span className="expand-icon">
                                        {expandedPages.has(page.id) ? '▼' : '▶'}
                                    </span>
                                    <div>
                                        <h3 className="page-item-title">{page.name}</h3>
                                        {page.description && (
                                            <p className="page-item-description">{page.description}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-sm">
                                    <span className="badge badge-primary">
                                        {page.functionalities?.length || 0} functionalities
                                    </span>
                                    <button
                                        className="btn btn-sm btn-secondary"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedPageId(page.id);
                                            setShowAddFuncModal(true);
                                        }}
                                    >
                                        + Add Functionality
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeletePage(page.id);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            {expandedPages.has(page.id) && page.functionalities && page.functionalities.length > 0 && (
                                <div className="functionalities-list">
                                    {page.functionalities.map((func) => (
                                        <div key={func.id} className="functionality-item">
                                            <div className="functionality-header">
                                                <div>
                                                    <h4 className="functionality-title">{func.name}</h4>
                                                    {func.description && (
                                                        <p className="functionality-description">{func.description}</p>
                                                    )}
                                                </div>
                                                <div className="flex gap-sm items-center">
                                                    <span className={`badge ${func.type === 'button' ? 'badge-primary' :
                                                        func.type === 'form' ? 'badge-success' :
                                                            'badge-warning'
                                                        }`}>
                                                        {func.type}
                                                    </span>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDeleteFunctionality(func.id, page.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>

                                            {func.dataToDisplay && (
                                                <div className="functionality-detail">
                                                    <strong>Data to Display:</strong> {func.dataToDisplay}
                                                </div>
                                            )}

                                            {func.fields && Array.isArray(func.fields) && func.fields.length > 0 && (
                                                <div className="functionality-detail">
                                                    <strong>Fields:</strong>
                                                    <div className="fields-list">
                                                        {func.fields.map((field, idx) => (
                                                            <div key={idx} className="field-item">
                                                                <span className="field-name">{field.name}</span>
                                                                <span className="field-type badge badge-primary">{field.type}</span>
                                                                {field.required && <span className="badge badge-danger">Required</span>}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {showAddPageModal && (
                <AddPageModal
                    projectId={projectId}
                    onClose={() => setShowAddPageModal(false)}
                    onPageCreated={handlePageCreated}
                />
            )}

            {showAddFuncModal && selectedPageId && (
                <AddFunctionalityModal
                    pageId={selectedPageId}
                    onClose={() => {
                        setShowAddFuncModal(false);
                        setSelectedPageId(null);
                    }}
                    onFunctionalityCreated={handleFunctionalityCreated}
                />
            )}
        </div>
    );
};

export default PagesTab;
