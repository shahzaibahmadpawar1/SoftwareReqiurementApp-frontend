import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
    Node,
    Edge,
    addEdge,
    Connection,
    useNodesState,
    useEdgesState,
    Controls,
    Background,
    MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Workflow, RequirementUser, Page, Functionality } from '../types';
import { usersApi, pagesApi, functionalitiesApi, workflowsApi } from '../services/api';
import './WorkflowViewer.css';

interface WorkflowViewerProps {
    workflow: Workflow;
    projectId: number;
}

const WorkflowViewer = ({ workflow, projectId }: WorkflowViewerProps) => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [users, setUsers] = useState<RequirementUser[]>([]);
    const [pages, setPages] = useState<Page[]>([]);
    const [functionalities, setFunctionalities] = useState<Functionality[]>([]);
    const [showAddNode, setShowAddNode] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadEntities();
    }, [projectId]);

    useEffect(() => {
        if (workflow.flowchartData) {
            setNodes(workflow.flowchartData.nodes || []);
            setEdges(workflow.flowchartData.edges || []);
        }
    }, [workflow]);

    const loadEntities = async () => {
        try {
            const [usersRes, pagesRes] = await Promise.all([
                usersApi.getByProject(projectId),
                pagesApi.getByProject(projectId),
            ]);

            setUsers(usersRes.data);
            setPages(pagesRes.data);

            const allFuncs: Functionality[] = [];
            for (const page of pagesRes.data) {
                const funcRes = await functionalitiesApi.getByPage(page.id);
                allFuncs.push(...funcRes.data);
            }
            setFunctionalities(allFuncs);
        } catch (error) {
            console.error('Error loading entities:', error);
        }
    };

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const addNode = (entityType: 'user' | 'page' | 'functionality', entityId: number, label: string) => {
        const newNode: Node = {
            id: `${entityType}-${entityId}-${Date.now()}`,
            type: 'default',
            position: { x: Math.random() * 400, y: Math.random() * 400 },
            data: {
                label,
                entityType,
                entityId,
            },
            style: {
                background: entityType === 'user' ? '#0ea5e9' : entityType === 'page' ? '#10b981' : '#a855f7',
                color: 'white',
                border: '2px solid #fff',
                borderRadius: '8px',
                padding: '10px',
                fontSize: '14px',
                fontWeight: 600,
            },
        };
        setNodes((nds) => [...nds, newNode]);
        setShowAddNode(false);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await workflowsApi.update(workflow.id, {
                flowchartData: { nodes, edges },
            });
            alert('Workflow saved successfully!');
        } catch (error) {
            console.error('Error saving workflow:', error);
            alert('Failed to save workflow');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="workflow-viewer">
            <div className="workflow-toolbar">
                <button className="btn btn-sm btn-secondary" onClick={() => setShowAddNode(!showAddNode)}>
                    + Add Node
                </button>
                <button className="btn btn-sm btn-primary" onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Workflow'}
                </button>
            </div>

            {showAddNode && (
                <div className="add-node-panel">
                    <h4 className="add-node-title">Add Entity to Workflow</h4>

                    {users.length > 0 && (
                        <div className="add-node-section">
                            <h5 className="add-node-section-title">Users</h5>
                            {users.map(user => (
                                <button
                                    key={user.id}
                                    className="add-node-item"
                                    onClick={() => addNode('user', user.id, user.name)}
                                >
                                    👤 {user.name}
                                </button>
                            ))}
                        </div>
                    )}

                    {pages.length > 0 && (
                        <div className="add-node-section">
                            <h5 className="add-node-section-title">Pages</h5>
                            {pages.map(page => (
                                <button
                                    key={page.id}
                                    className="add-node-item"
                                    onClick={() => addNode('page', page.id, page.name)}
                                >
                                    📄 {page.name}
                                </button>
                            ))}
                        </div>
                    )}

                    {functionalities.length > 0 && (
                        <div className="add-node-section">
                            <h5 className="add-node-section-title">Functionalities</h5>
                            {functionalities.map(func => (
                                <button
                                    key={func.id}
                                    className="add-node-item"
                                    onClick={() => addNode('functionality', func.id, func.name)}
                                >
                                    ⚡ {func.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="reactflow-wrapper">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                >
                    <Controls />
                    <MiniMap />
                    <Background gap={12} size={1} />
                </ReactFlow>
            </div>
        </div>
    );
};

export default WorkflowViewer;
