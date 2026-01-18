import { useCallback } from 'react';
import ReactFlow, {
    type Node,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    MarkerType,
    Handle,
    Position,
    ConnectionLineType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { cn } from "../../utils/cn";
import { generateSkillTreeData } from "../../utils/mockData";

// Custom Node Component
const SkillNode = ({ data, isConnectable }: any) => {
    const statusColors = {
        mastered: "bg-yellow-400 border-yellow-600 shadow-[0_0_15px_rgba(250,204,21,0.5)]",
        learning: "bg-blue-400 border-blue-600 shadow-[0_0_10px_rgba(96,165,250,0.5)]",
        locked: "bg-slate-600 border-slate-700 opacity-80",
        current: "bg-green-500 border-green-700 animate-pulse shadow-[0_0_15px_rgba(74,222,128,0.5)]"
    };

    return (
        <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300 transform hover:scale-110 cursor-pointer overflow-hidden",
            statusColors[data.status as keyof typeof statusColors]
        )}>
            <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="opacity-0" />
            <div className="text-[10px] font-bold text-center leading-tight text-white px-1 pointer-events-none select-none">
                {data.label}
            </div>
            <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="opacity-0" />
        </div>
    );
};

const nodeTypes = {
    skill: SkillNode,
};

interface SkillTreeVisualizationProps {
    onSelectSkill: (skillId: string) => void;
}

export const SkillTreeVisualization: React.FC<SkillTreeVisualizationProps> = ({ onSelectSkill }) => {
    const { nodes: initialNodes, edges: initialEdges } = generateSkillTreeData();

    // layout logic (simplified for demo)
    const layoutNodes = initialNodes.map((node, index) => {
        // Basic Layout Strategy: Root on top, categories branching out
        let x = 0;
        let y = 0;

        if (node.id === "root") {
            x = 400;
            y = 50;
        } else if (node.category === "frontend") {
            x = 100 + (index % 3) * 150;
            y = 200 + Math.floor(index / 3) * 150;
        } else if (node.category === "backend") {
            x = 450 + (index % 3) * 150;
            y = 200 + Math.floor(index / 3) * 150;
        } else {
            x = 250 + (index % 4) * 150;
            y = 500;
        }

        return {
            id: node.id,
            type: 'skill',
            data: { ...node },
            position: { x, y },
        };
    });

    const layoutEdges = initialEdges.map(edge => ({
        id: `e-${edge.from}-${edge.to}`,
        source: edge.from,
        target: edge.to,
        type: ConnectionLineType.SmoothStep,
        animated: true,
        style: { stroke: '#64748b', strokeWidth: 2 },
        markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#64748b',
        },
    }));

    const [nodes, , onNodesChange] = useNodesState(layoutNodes);
    const [edges, , onEdgesChange] = useEdgesState(layoutEdges);

    const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
        onSelectSkill(node.id);
    }, [onSelectSkill]);

    return (
        <div className="h-[600px] w-full bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                fitView
                attributionPosition="bottom-right"
                minZoom={0.5}
                maxZoom={1.5}
            >
                <Background gap={20} size={1} color="#334155" />
                <Controls className="bg-slate-800 border-slate-700 text-white fill-white" />
            </ReactFlow>
        </div>
    );
};
