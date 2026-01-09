export interface Project {
    id: number;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface RequirementUser {
    id: number;
    projectId: number;
    name: string;
    description: string | null;
    privileges: string[] | null;
    createdAt: string;
    updatedAt: string;
    pageAccess?: UserPageAccess[];
    functionalityAccess?: UserFunctionalityAccess[];
}

export interface Page {
    id: number;
    projectId: number;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    functionalities?: Functionality[];
}

export interface Functionality {
    id: number;
    pageId: number;
    name: string;
    description: string | null;
    type: 'button' | 'form' | 'table';
    fields: FieldDefinition[] | null;
    dataToDisplay: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface FieldDefinition {
    name: string;
    type: string;
    required: boolean;
    validation?: string;
    defaultValue?: any;
}

export interface Workflow {
    id: number;
    projectId: number;
    name: string;
    description: string | null;
    flowchartData: FlowchartData | null;
    createdAt: string;
    updatedAt: string;
}

export interface FlowchartData {
    nodes: FlowNode[];
    edges: FlowEdge[];
}

export interface FlowNode {
    id: string;
    type: string;
    position: { x: number; y: number };
    data: {
        label: string;
        entityType?: 'user' | 'page' | 'functionality';
        entityId?: number;
        [key: string]: any;
    };
}

export interface FlowEdge {
    id: string;
    source: string;
    target: string;
    label?: string;
}

export interface UserPageAccess {
    id: number;
    userId: number;
    pageId: number;
    canAccess: boolean;
    createdAt: string;
}

export interface UserFunctionalityAccess {
    id: number;
    userId: number;
    functionalityId: number;
    canAccess: boolean;
    createdAt: string;
}
