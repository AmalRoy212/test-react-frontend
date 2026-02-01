import { Handle, Position } from '@xyflow/react';

export default function EmailNode({ data, id }) {
  return (
    <div className="bg-blue-50 border border-blue-300 rounded px-4 py-3 min-w-[220px]">
      <Handle type="target" position={Position.Left} />
      <div className="font-medium text-blue-800 mb-2">Email</div>
      <input
        placeholder="Subject"
        value={data.subject ?? ''}
        onChange={(e) => data.onChange?.(id, 'subject', e.target.value)}
        className="w-full border rounded px-2 py-1 text-sm mb-2"
      />
      <textarea
        placeholder="Body"
        value={data.body ?? ''}
        onChange={(e) => data.onChange?.(id, 'body', e.target.value)}
        className="w-full border rounded px-2 py-1 text-sm mb-2 resize-none"
        rows={2}
      />
      <input
        placeholder="Recipients (comma separated)"
        value={data.recipients ?? ''}
        onChange={(e) => data.onChange?.(id, 'recipients', e.target.value)}
        className="w-full border rounded px-2 py-1 text-sm"
      />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
