import React from 'react';
import { X, ChevronDown } from 'lucide-react';

export default function AddColumnModal({
  isOpen,
  onClose,
  columnName,
  setColumnName,
  columnType,
  setColumnType,
  columnOptions,
  setColumnOptions,
  onCreate,
  triggerToast
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h3 className="modal-title">Create Custom Column</h3>
          <button 
            className="icon-btn" 
            style={{ padding: '4px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Column Name</label>
            <input 
              type="text" 
              className="crm-input w-full" 
              value={columnName} 
              onChange={(e) => setColumnName(e.target.value)} 
              placeholder="e.g. Competitor Focus"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Data Type</label>
            <div className="select-wrapper" style={{ margin: 0, width: '100%' }}>
              <select 
                className="gong-select w-full" 
                style={{ width: '100%', paddingRight: '24px', borderRadius: '4px' }}
                value={columnType} 
                onChange={(e) => setColumnType(e.target.value)}
              >
                <option value="text">Text / Notes</option>
                <option value="number">Number</option>
                <option value="checkbox">Checkbox (Yes / No)</option>
                <option value="select">Dropdown Select List</option>
              </select>
              <ChevronDown size={12} className="dropdown-arrow" style={{ right: '8px' }} />
            </div>
          </div>

          {columnType === 'select' && (
            <div className="form-group">
              <label className="form-label">Select Options (Comma-separated)</label>
              <input 
                type="text" 
                className="crm-input w-full" 
                value={columnOptions} 
                onChange={(e) => setColumnOptions(e.target.value)} 
                placeholder="e.g. High, Medium, Low"
              />
              <small style={{ fontSize: '10px', color: 'var(--gong-text-muted)', marginTop: '4px', display: 'block', textTransform: 'none', letterSpacing: 0 }}>
                Separate dropdown options with commas.
              </small>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={onClose}>
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            style={{ padding: '6px 12px', fontSize: '12px' }}
            onClick={() => {
              if (!columnName.trim()) {
                triggerToast("Please enter a column name!");
                return;
              }
              onCreate(columnName, columnType, columnOptions);
              setColumnName("");
              setColumnType("text");
              setColumnOptions("");
              onClose();
            }}
          >
            Create Column
          </button>
        </div>
      </div>
    </div>
  );
}
