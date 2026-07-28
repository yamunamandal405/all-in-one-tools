import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Wrench, Plus, Trash2, Play, Sparkles, CheckCircle2, 
  HelpCircle, Sliders, Calculator, Code 
} from 'lucide-react';

export const ToolDesigner = () => {
  const { customTools, addCustomTool, deleteCustomTool, showToast } = useApp();
  
  const [toolName, setToolName] = useState('');
  const [toolDesc, setToolDesc] = useState('');
  const [toolCategory, setToolCategory] = useState('Finance & Math');
  
  // Fields state
  const [fields, setFields] = useState([
    { id: 'val1', label: 'Amount (Principal)', type: 'number', defaultValue: '1000' },
    { id: 'val2', label: 'Rate / Percentage (%)', type: 'number', defaultValue: '18' }
  ]);

  // Formula state
  const [formula, setFormula] = useState('(val1 * val2) / 100');
  const [outputLabel, setOutputLabel] = useState('Calculated Tax Amount');

  // Test execution state
  const [testValues, setTestValues] = useState({ val1: '1000', val2: '18' });
  const [testResult, setTestResult] = useState(null);

  const addField = () => {
    const fieldId = 'val' + (fields.length + 1);
    setFields(prev => [
      ...prev,
      { id: fieldId, label: `Custom Parameter ${fields.length + 1}`, type: 'number', defaultValue: '10' }
    ]);
    setTestValues(prev => ({ ...prev, [fieldId]: '10' }));
  };

  const removeField = (index) => {
    setFields(prev => prev.filter((_, i) => i !== index));
  };

  const executeFormula = (inputs) => {
    try {
      // Safely evaluate formula with input variables
      const paramKeys = Object.keys(inputs);
      const paramVals = Object.values(inputs).map(v => parseFloat(v) || 0);

      const func = new Function(...paramKeys, `return ${formula};`);
      const result = func(...paramVals);
      return result;
    } catch (err) {
      return 'Error: Invalid math formula syntax';
    }
  };

  const handleTestRun = () => {
    const res = executeFormula(testValues);
    setTestResult(res);
  };

  const handleSaveTool = (e) => {
    e.preventDefault();
    if (!toolName.trim()) {
      showToast('Please enter a tool title', 'warning');
      return;
    }

    const newTool = {
      id: 'tool_' + Date.now(),
      name: toolName,
      description: toolDesc || 'Custom user created utility calculator',
      category: toolCategory,
      fields: fields,
      formula: formula,
      outputLabel: outputLabel,
      createdAt: new Date().toISOString()
    };

    addCustomTool(newTool);
    setToolName('');
    setToolDesc('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Wrench className="w-7 h-7 text-purple-400" />
            No-Code Custom Tool Designer
          </h1>
          <p className="text-xs text-gray-300 mt-1">
            Build custom formula calculators, business utility widgets, or string processors without coding.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Creator Studio Form */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-white/10 shadow-xl space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Design New Custom Utility Tool
          </h3>

          <form onSubmit={handleSaveTool} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-300 mb-1 font-medium">Tool Title</label>
                <input
                  type="text"
                  placeholder="e.g. GST & Tax Calculator"
                  value={toolName}
                  onChange={(e) => setToolName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl glass-input"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-300 mb-1 font-medium">Category</label>
                <select
                  value={toolCategory}
                  onChange={(e) => setToolCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl glass-input text-purple-300"
                >
                  <option value="Finance & Math" className="bg-slate-900">Finance & Math</option>
                  <option value="Text & Code" className="bg-slate-900">Text & Code</option>
                  <option value="Health & Fitness" className="bg-slate-900">Health & Fitness</option>
                  <option value="Engineering" className="bg-slate-900">Engineering</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-300 mb-1 font-medium">Short Description</label>
              <input
                type="text"
                placeholder="Calculates total tax and grand total instantly"
                value={toolDesc}
                onChange={(e) => setToolDesc(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl glass-input"
              />
            </div>

            {/* Input Fields Designer */}
            <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-200">Form Input Fields</span>
                <button
                  type="button"
                  onClick={addField}
                  className="px-2.5 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/30 text-purple-300 text-[10px] font-bold flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add Input Variable
                </button>
              </div>

              {fields.map((field, idx) => (
                <div key={field.id} className="flex items-center gap-2 p-2 glass-card rounded-xl">
                  <span className="font-mono text-purple-400 font-bold text-xs w-12">{field.id}</span>
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => {
                      const updated = [...fields];
                      updated[idx].label = e.target.value;
                      setFields(updated);
                    }}
                    className="flex-1 px-2.5 py-1 text-xs rounded-lg glass-input"
                    placeholder="Field Label"
                  />
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeField(idx)}
                      className="p-1 text-rose-400 hover:bg-rose-500/20 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Math Formula Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-200 flex items-center justify-between">
                <span>Execution Formula (JavaScript Expression)</span>
                <span className="text-[10px] text-gray-400 font-mono">Use variables: val1, val2...</span>
              </label>
              <input
                type="text"
                value={formula}
                onChange={(e) => setFormula(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl glass-input font-mono text-emerald-400 font-bold"
                placeholder="(val1 * val2) / 100"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-300 mb-1 font-medium">Output Result Label</label>
              <input
                type="text"
                value={outputLabel}
                onChange={(e) => setOutputLabel(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl glass-input"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 font-bold text-xs text-white shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Save Tool to Dashboard
            </button>
          </form>
        </div>

        {/* Live Test & Custom Tools Dashboard */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Live Tester */}
          <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Play className="w-4 h-4 text-emerald-400" />
              Live Interactive Tester
            </h3>

            <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-white/5">
              {fields.map(f => (
                <div key={f.id}>
                  <label className="block text-[11px] text-gray-300 mb-1">{f.label} ({f.id})</label>
                  <input
                    type="number"
                    value={testValues[f.id] || ''}
                    onChange={(e) => setTestValues({ ...testValues, [f.id]: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl glass-input font-mono"
                  />
                </div>
              ))}

              <button
                onClick={handleTestRun}
                className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white"
              >
                Calculate Output
              </button>
            </div>

            {testResult !== null && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/50 text-center">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{outputLabel}</span>
                <div className="text-2xl font-black text-emerald-400 mt-1">
                  {typeof testResult === 'number' ? testResult.toLocaleString(undefined, { maximumFractionDigits: 4 }) : testResult}
                </div>
              </div>
            )}
          </div>

          {/* User's Saved Custom Tools List */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white">My Personal Utility Tools ({customTools.length})</h3>

            {customTools.length > 0 ? (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {customTools.map((t) => (
                  <div key={t.id} className="glass-card p-3.5 rounded-2xl border border-purple-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-purple-300">{t.name}</h4>
                      <button
                        onClick={() => deleteCustomTool(t.id)}
                        className="text-rose-400 hover:bg-rose-500/20 p-1 rounded text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400">{t.description}</p>
                    <div className="text-[10px] font-mono text-emerald-400">Formula: {t.formula}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 text-center py-4">No custom tools created yet. Design your first one above!</p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
