import { Handle, Position } from '@xyflow/react';

export default function TriggerNode({ data, id }) {
  return (
    <div className="bg-amber-100 border border-amber-400 rounded px-4 py-3 min-w-[180px]">
      <Handle type="target" position={Position.Left} />
      <div className="font-medium text-amber-800 mb-2">Trigger</div>
      <select
        value={data.delayMinutes ?? '1'}
        onChange={(e) => data.onChange?.(id, 'delayMinutes', e.target.value)}
        className="w-full border rounded px-2 py-1 text-sm"
      >
        <option value="1">After 1 minute</option>
        <option value="5">After 5 minutes</option>
        <option value="60">After 1 hour</option>
      </select>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
