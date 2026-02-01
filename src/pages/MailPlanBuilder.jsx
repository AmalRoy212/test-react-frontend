import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { mailPlans } from '../api/client';
import TriggerNode from '../components/nodes/TriggerNode';
import EmailNode from '../components/nodes/EmailNode';

const nodeTypes = { trigger: TriggerNode, email: EmailNode };

const initialNodes = [
  { id: 'trigger-1', type: 'trigger', position: { x: 100, y: 100 }, data: { delayMinutes: '1' } },
  { id: 'email-1', type: 'email', position: { x: 350, y: 100 }, data: {} },
];
const initialEdges = [
  { id: 'e1', source: 'trigger-1', target: 'email-1', markerEnd: { type: MarkerType.ArrowClosed } },
];

export default function MailPlanBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const [name, setName] = useState('Untitled Plan');
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Sync node data changes from custom nodes back to state
  const handleNodeDataChange = useCallback((nodeId, field, value) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, [field]: value } } : n
      )
    );
  }, [setNodes]);

  const nodesWithHandlers = nodes.map((n) => ({
    ...n,
    data: { ...n.data, onChange: handleNodeDataChange },
  }));

  useEffect(() => {
    if (isNew) return;
    (async () => {
      try {
        const plan = await mailPlans.get(id);
        setName(plan.name);
        if (plan.flow?.nodes?.length) {
          const withHandlers = plan.flow.nodes.map((n) => ({
            ...n,
            data: { ...n.data, onChange: handleNodeDataChange },
          }));
          setNodes(withHandlers);
        }
        if (plan.flow?.edges?.length) setEdges(plan.flow.edges);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isNew]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, markerEnd: { type: MarkerType.ArrowClosed } }, eds)),
    [setEdges]
  );

  async function handleSave() {
    setError('');
    setSaving(true);
    try {
      const flow = { nodes, edges };
      if (isNew) {
        const plan = await mailPlans.create({ name, flow });
        navigate(`/plans/${plan._id}`, { replace: true });
      } else {
        await mailPlans.update(id, { name, flow });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function addTriggerNode() {
    const newId = `trigger-${Date.now()}`;
    setNodes((nds) => [
      ...nds,
      {
        id: newId,
        type: 'trigger',
        position: { x: 100, y: 100 + nds.length * 80 },
        data: { delayMinutes: '1', onChange: handleNodeDataChange },
      },
    ]);
  }

  function addEmailNode() {
    const newId = `email-${Date.now()}`;
    setNodes((nds) => [
      ...nds,
      {
        id: newId,
        type: 'email',
        position: { x: 350, y: 100 + nds.length * 80 },
        data: { onChange: handleNodeDataChange },
      },
    ]);
  }

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center gap-4 p-2 border-b bg-white">
        <button onClick={() => navigate('/')} className="text-gray-600">
          ← Back
        </button>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded px-3 py-1"
          placeholder="Plan name"
        />
        <div className="flex gap-2">
          <button
            onClick={addTriggerNode}
            className="bg-amber-500 text-white px-3 py-1 rounded text-sm"
          >
            + Trigger
          </button>
          <button
            onClick={addEmailNode}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
          >
            + Email
          </button>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-green-600 text-white px-4 py-1 rounded ml-auto"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
      {error && <p className="text-red-500 px-2 py-1">{error}</p>}
      <div className="flex-1">
        <ReactFlow
          nodes={nodesWithHandlers}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
          <Panel position="top-right" className="text-sm text-gray-500">
            Connect trigger → email. Save to store flow.
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}
