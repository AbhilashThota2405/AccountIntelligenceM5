import React from 'react';
import { FileText, X } from 'lucide-react';

export default function NoteEditorModal({
  isOpen,
  onClose,
  companyName,
  noteText,
  onNoteChange,
  onSave
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" style={{ zIndex: 999 }}>
      <div className="modal-card" style={{ maxWidth: '500px', width: '90%' }}>
        <div className="modal-header">
          <h3 className="modal-title flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 600 }}>
            <FileText size={18} className="text-purple-600 animate-pulse" />
            <span>Edit Manager Notes</span>
          </h3>
          <button 
            className="icon-btn" 
            style={{ padding: '4px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>
        <div className="modal-body" style={{ padding: '16px 0' }}>
          <div className="text-xs text-gray-500 mb-3 uppercase tracking-wider font-semibold" style={{ fontSize: '10px', color: 'var(--gong-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Company: <span className="text-slate-800 normal-case font-bold" style={{ color: 'var(--gong-text-dark)', textTransform: 'none' }}>{companyName}</span>
          </div>
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label className="form-label">Strategic Notes</label>
            <textarea 
              className="notes-textarea w-full"
              style={{ minHeight: '180px', fontSize: '13px', lineHeight: '1.6', borderRadius: '6px', border: '1px solid var(--gong-border)', padding: '12px', resize: 'vertical' }}
              value={noteText}
              onChange={(e) => onNoteChange(e.target.value)}
              placeholder="Type high-level executive notes, feedback, and action steps here..."
            />
          </div>
        </div>
        <div className="modal-footer" style={{ borderTop: '1px solid var(--gong-border)', paddingTop: '12px', display: 'flex', justifyContent: 'end', gap: '8px' }}>
          <button className="btn" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={onClose}>
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: 'var(--gong-purple-accent)', borderColor: 'var(--gong-purple-accent)' }}
            onClick={onSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
