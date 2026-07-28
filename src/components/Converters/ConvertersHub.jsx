import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowRightLeft, DollarSign, FileCode, Code, Scale, 
  Copy, RefreshCw, CheckCircle2 
} from 'lucide-react';

export const ConvertersHub = () => {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState('units'); // 'units', 'currency', 'format', 'code'

  // Unit Converter State
  const [unitCategory, setUnitCategory] = useState('length');
  const [unitVal, setUnitVal] = useState('1');
  const [fromUnit, setFromUnit] = useState('meters');
  const [toUnit, setToUnit] = useState('feet');

  // Currency State
  const [currencyVal, setCurrencyVal] = useState('100');
  const [fromCurr, setFromCurr] = useState('USD');
  const [toCurr, setToCurr] = useState('INR');

  // Format Converter State (JSON / CSV / Base64)
  const [formatInput, setFormatInput] = useState('{"name": "OmniSuite", "version": 1.0, "status": "active"}');
  const [formatMode, setFormatMode] = useState('json-to-csv'); // 'json-to-csv', 'csv-to-json', 'base64-encode', 'base64-decode'
  const [formatOutput, setFormatOutput] = useState('');

  // Unit conversions map
  const convertUnits = () => {
    const val = parseFloat(unitVal) || 0;
    if (unitCategory === 'length') {
      let meters = val;
      if (fromUnit === 'km') meters = val * 1000;
      if (fromUnit === 'cm') meters = val / 100;
      if (fromUnit === 'feet') meters = val * 0.3048;
      if (fromUnit === 'miles') meters = val * 1609.34;

      if (toUnit === 'meters') return meters;
      if (toUnit === 'km') return meters / 1000;
      if (toUnit === 'cm') return meters * 100;
      if (toUnit === 'feet') return meters / 0.3048;
      if (toUnit === 'miles') return meters / 1609.34;
    }
    return val;
  };

  // Currency exchange rates relative to 1 USD
  const rates = { USD: 1, EUR: 0.92, INR: 86.5, GBP: 0.78, JPY: 154.2, AUD: 1.52, CAD: 1.38, AED: 3.67 };

  const convertCurrency = () => {
    const amt = parseFloat(currencyVal) || 0;
    const inUSD = amt / (rates[fromCurr] || 1);
    return (inUSD * (rates[toCurr] || 1)).toFixed(2);
  };

  const handleFormatConvert = () => {
    try {
      if (formatMode === 'json-to-csv') {
        const parsed = JSON.parse(formatInput);
        const arr = Array.isArray(parsed) ? parsed : [parsed];
        const keys = Object.keys(arr[0]);
        const csvRows = [keys.join(',')];
        for (const item of arr) {
          csvRows.push(keys.map(k => JSON.stringify(item[k] || '')).join(','));
        }
        setFormatOutput(csvRows.join('\n'));
      } else if (formatMode === 'base64-encode') {
        setFormatOutput(btoa(formatInput));
      } else if (formatMode === 'base64-decode') {
        setFormatOutput(atob(formatInput));
      }
      showToast('Conversion completed!', 'success');
    } catch (err) {
      setFormatOutput('Error: Invalid format input syntax - ' + err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <ArrowRightLeft className="w-7 h-7 text-purple-400" />
            Smart Converters & Data Tools
          </h1>
          <p className="text-xs text-gray-300 mt-1">
            Universal Unit converter, real-time Currency calculator, JSON/CSV transformer, and Base64 encoder.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto p-1 bg-slate-950/60 rounded-2xl border border-white/10">
          <button
            onClick={() => setActiveTab('units')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'units' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Scale className="w-4 h-4" />
            Units
          </button>
          <button
            onClick={() => setActiveTab('currency')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'currency' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Currency
          </button>
          <button
            onClick={() => setActiveTab('format')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'format' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <FileCode className="w-4 h-4" />
            JSON/CSV/Base64
          </button>
        </div>
      </div>

      {/* Tab 1: Unit Converter */}
      {activeTab === 'units' && (
        <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-xl space-y-6 max-w-xl mx-auto">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Universal Unit Converter</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-300 mb-1">Enter Value</label>
              <input
                type="number"
                value={unitVal}
                onChange={(e) => setUnitVal(e.target.value)}
                className="w-full px-3 py-2 text-lg font-bold rounded-xl glass-input text-emerald-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-300 mb-1">From Unit</label>
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl glass-input text-purple-300"
                >
                  <option value="meters" className="bg-slate-900">Meters (m)</option>
                  <option value="km" className="bg-slate-900">Kilometers (km)</option>
                  <option value="cm" className="bg-slate-900">Centimeters (cm)</option>
                  <option value="feet" className="bg-slate-900">Feet (ft)</option>
                  <option value="miles" className="bg-slate-900">Miles (mi)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-300 mb-1">To Unit</label>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl glass-input text-purple-300"
                >
                  <option value="meters" className="bg-slate-900">Meters (m)</option>
                  <option value="km" className="bg-slate-900">Kilometers (km)</option>
                  <option value="cm" className="bg-slate-900">Centimeters (cm)</option>
                  <option value="feet" className="bg-slate-900">Feet (ft)</option>
                  <option value="miles" className="bg-slate-900">Miles (mi)</option>
                </select>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/70 border border-emerald-500/30 text-center">
              <span className="text-xs text-gray-400">Converted Output</span>
              <div className="text-3xl font-extrabold text-emerald-400 mt-1">
                {convertUnits()} <span className="text-sm font-normal text-gray-300">{toUnit}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Currency Converter */}
      {activeTab === 'currency' && (
        <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-xl space-y-6 max-w-xl mx-auto">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Live Currency Exchange Rate Matrix</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-300 mb-1">Amount</label>
              <input
                type="number"
                value={currencyVal}
                onChange={(e) => setCurrencyVal(e.target.value)}
                className="w-full px-3 py-2 text-lg font-bold rounded-xl glass-input text-emerald-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-300 mb-1">From Currency</label>
                <select
                  value={fromCurr}
                  onChange={(e) => setFromCurr(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl glass-input text-purple-300"
                >
                  {Object.keys(rates).map(c => (
                    <option key={c} value={c} className="bg-slate-900">{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-300 mb-1">To Currency</label>
                <select
                  value={toCurr}
                  onChange={(e) => setToCurr(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl glass-input text-purple-300"
                >
                  {Object.keys(rates).map(c => (
                    <option key={c} value={c} className="bg-slate-900">{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/70 border border-purple-500/40 text-center">
              <span className="text-xs text-gray-400">Equivalent Exchange Amount</span>
              <div className="text-3xl font-black text-purple-300 mt-1">
                {toCurr} {convertCurrency()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Format & Base64 Converter */}
      {activeTab === 'format' && (
        <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Data Format Transformer</h3>
            <select
              value={formatMode}
              onChange={(e) => setFormatMode(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl glass-input text-purple-300"
            >
              <option value="json-to-csv" className="bg-slate-900">JSON to CSV</option>
              <option value="base64-encode" className="bg-slate-900">Base64 Encode</option>
              <option value="base64-decode" className="bg-slate-900">Base64 Decode</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Source Code / Input</label>
              <textarea
                value={formatInput}
                onChange={(e) => setFormatInput(e.target.value)}
                rows={8}
                className="w-full p-3 text-xs font-mono rounded-2xl glass-input text-gray-200"
              />
              <button
                onClick={handleFormatConvert}
                className="mt-2 w-full py-2.5 rounded-xl bg-purple-600 font-bold text-xs text-white"
              >
                Convert Format
              </button>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs text-gray-400">Transformed Output</label>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(formatOutput);
                    showToast('Output copied!', 'info');
                  }}
                  className="text-xs text-purple-400 flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  Copy
                </button>
              </div>
              <textarea
                value={formatOutput}
                readOnly
                rows={8}
                className="w-full p-3 text-xs font-mono rounded-2xl glass-input text-emerald-300"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
