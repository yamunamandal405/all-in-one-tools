import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, User, Briefcase, GraduationCap, Code, 
  Palette, Download, Save, Sparkles, Plus, Trash2, CheckCircle2 
} from 'lucide-react';

const INITIAL_RESUME_DATA = {
  personal: {
    fullName: 'Alexander Wright',
    jobTitle: 'Senior Full Stack Engineer & UI Architect',
    email: 'alexander.w@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    website: 'https://alexwright.dev',
    summary: 'Driven Senior Full Stack Engineer with 7+ years of experience architecting high-scalability web applications, cloud infrastructure, and micro-frontend systems. Passionate about modern UI aesthetics and developer tooling.'
  },
  experience: [
    {
      id: 'e1',
      title: 'Lead Frontend Architect',
      company: 'Apex Cloud Solutions',
      period: '2023 - Present',
      description: 'Architected enterprise React micro-frontend platforms handling over 10M active monthly users. Reduced page load metrics by 45%.'
    },
    {
      id: 'e2',
      title: 'Senior Software Engineer',
      company: 'Nexus Innovations Tech',
      period: '2020 - 2023',
      description: 'Developed real-time financial dashboards with React, Node.js, and WebSocket APIs. Led a cross-functional team of 8 engineers.'
    }
  ],
  education: [
    {
      id: 'ed1',
      degree: 'B.S. in Computer Science',
      school: 'Stanford University',
      period: '2016 - 2020'
    }
  ],
  skills: ['React', 'Node.js', 'TypeScript', 'TailwindCSS', 'GraphQL', 'Docker', 'AWS', 'Python', 'System Architecture']
};

export const ResumeDesignerHub = () => {
  const { showToast } = useApp();
  const [resume, setResume] = useState(INITIAL_RESUME_DATA);
  const [selectedTemplate, setSelectedTemplate] = useState('executive'); // 'executive', 'minimal', 'vibrant'
  const [accentColor, setAccentColor] = useState('purple'); // 'purple', 'cyan', 'emerald', 'rose', 'amber'
  const [activeFormTab, setActiveFormTab] = useState('personal'); // 'personal', 'exp', 'edu', 'skills'

  // Input change helpers
  const handlePersonalChange = (field, value) => {
    setResume(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
  };

  const addExperience = () => {
    const newExp = {
      id: 'e_' + Date.now(),
      title: 'New Position Title',
      company: 'Company Name',
      period: '2024 - Present',
      description: 'Key accomplishments and responsibilities...'
    };
    setResume(prev => ({ ...prev, experience: [...prev.experience, newExp] }));
  };

  const removeExperience = (id) => {
    setResume(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== id) }));
  };

  const updateExperience = (id, field, val) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map(item => item.id === id ? { ...item, [field]: val } : item)
    }));
  };

  const addSkill = (skillText) => {
    if (!skillText.trim()) return;
    setResume(prev => ({
      ...prev,
      skills: [...prev.skills, skillText.trim()]
    }));
  };

  const removeSkill = (index) => {
    setResume(prev => ({
      ...prev,
      skills: prev.skills.filter((_, idx) => idx !== index)
    }));
  };

  // Save to Express API / Local
  const handleSaveCloud = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/resume/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData: resume })
      });
      if (res.ok) {
        showToast('Resume saved to OmniSuite Cloud storage!', 'success');
      } else {
        throw new Error();
      }
    } catch {
      showToast('Saved locally in browser state', 'success');
    }
  };

  // Trigger Print to PDF
  const triggerPdfPrint = () => {
    window.print();
  };

  const getAccentColorClasses = () => {
    switch (accentColor) {
      case 'cyan': return { text: 'text-cyan-400', bg: 'bg-cyan-600', border: 'border-cyan-500/40', badge: 'bg-cyan-500/20 text-cyan-300' };
      case 'emerald': return { text: 'text-emerald-400', bg: 'bg-emerald-600', border: 'border-emerald-500/40', badge: 'bg-emerald-500/20 text-emerald-300' };
      case 'rose': return { text: 'text-rose-400', bg: 'bg-rose-600', border: 'border-rose-500/40', badge: 'bg-rose-500/20 text-rose-300' };
      case 'amber': return { text: 'text-amber-400', bg: 'bg-amber-600', border: 'border-amber-500/40', badge: 'bg-amber-500/20 text-amber-300' };
      default: return { text: 'text-purple-400', bg: 'bg-purple-600', border: 'border-purple-500/40', badge: 'bg-purple-500/20 text-purple-300' };
    }
  };

  const colorClasses = getAccentColorClasses();

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn pb-12 print:p-0">
      {/* Header Controls (Hidden during print) */}
      <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-purple-400" />
            Resume Designer Studio
          </h1>
          <p className="text-xs text-gray-300 mt-1">
            Build modern interactive resumes with custom theme color palettes, live canvas preview, and PDF export.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSaveCloud}
            className="px-4 py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-purple-400" />
            Save Cloud
          </button>
          <button
            onClick={triggerPdfPrint}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-extrabold text-white shadow-xl flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Printable PDF
          </button>
        </div>
      </div>

      {/* Main Grid: Left Form Controls (5 Cols), Right Live Preview (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Controls (5 Cols - Hidden on print) */}
        <div className="lg:col-span-5 space-y-6 print:hidden">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-xl space-y-6">
            {/* Theme & Palette Selector */}
            <div className="space-y-3 border-b border-white/10 pb-4">
              <h3 className="text-xs font-extrabold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Template & Theme Styling
              </h3>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSelectedTemplate('executive')}
                  className={`py-2 rounded-xl text-xs font-bold border transition ${
                    selectedTemplate === 'executive' ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-900 border-white/10 text-gray-300'
                  }`}
                >
                  Executive
                </button>
                <button
                  onClick={() => setSelectedTemplate('minimal')}
                  className={`py-2 rounded-xl text-xs font-bold border transition ${
                    selectedTemplate === 'minimal' ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-900 border-white/10 text-gray-300'
                  }`}
                >
                  Minimal Tech
                </button>
                <button
                  onClick={() => setSelectedTemplate('vibrant')}
                  className={`py-2 rounded-xl text-xs font-bold border transition ${
                    selectedTemplate === 'vibrant' ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-900 border-white/10 text-gray-300'
                  }`}
                >
                  Creative
                </button>
              </div>

              {/* Accent Color Circles */}
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs text-gray-400 font-bold">Accent Color:</span>
                {['purple', 'cyan', 'emerald', 'rose', 'amber'].map(color => (
                  <button
                    key={color}
                    onClick={() => setAccentColor(color)}
                    className={`w-6 h-6 rounded-full border-2 transition ${
                      accentColor === color ? 'border-white scale-110 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    } ${
                      color === 'purple' ? 'bg-purple-500' :
                      color === 'cyan' ? 'bg-cyan-500' :
                      color === 'emerald' ? 'bg-emerald-500' :
                      color === 'rose' ? 'bg-rose-500' : 'bg-amber-500'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Section Tabs */}
            <div className="flex gap-1 p-1 bg-slate-950 rounded-2xl border border-white/10">
              <button
                onClick={() => setActiveFormTab('personal')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                  activeFormTab === 'personal' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Personal
              </button>
              <button
                onClick={() => setActiveFormTab('exp')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                  activeFormTab === 'exp' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                Experience
              </button>
              <button
                onClick={() => setActiveFormTab('skills')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                  activeFormTab === 'skills' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                Skills
              </button>
            </div>

            {/* Tab Form Inputs */}
            {activeFormTab === 'personal' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-300 font-bold block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={resume.personal.fullName}
                    onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-300 font-bold block mb-1">Target Job Title</label>
                  <input
                    type="text"
                    value={resume.personal.jobTitle}
                    onChange={(e) => handlePersonalChange('jobTitle', e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-300 font-bold block mb-1">Email</label>
                    <input
                      type="email"
                      value={resume.personal.email}
                      onChange={(e) => handlePersonalChange('email', e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-300 font-bold block mb-1">Phone</label>
                    <input
                      type="text"
                      value={resume.personal.phone}
                      onChange={(e) => handlePersonalChange('phone', e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-300 font-bold block mb-1">Location & Portfolio</label>
                  <input
                    type="text"
                    value={resume.personal.location}
                    onChange={(e) => handlePersonalChange('location', e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 mb-2"
                  />
                  <input
                    type="text"
                    value={resume.personal.website}
                    onChange={(e) => handlePersonalChange('website', e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-300 font-bold block mb-1">Executive Summary</label>
                  <textarea
                    value={resume.personal.summary}
                    onChange={(e) => handlePersonalChange('summary', e.target.value)}
                    rows={4}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500 leading-relaxed resize-none"
                  />
                </div>
              </div>
            )}

            {activeFormTab === 'exp' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-300">Work Experience Items</span>
                  <button
                    onClick={addExperience}
                    className="px-2.5 py-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Job
                  </button>
                </div>
                {resume.experience.map(exp => (
                  <div key={exp.id} className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                    <div className="flex justify-between items-center">
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                        className="font-bold text-xs bg-transparent border-b border-purple-500/40 text-white focus:outline-none w-2/3"
                      />
                      <button onClick={() => removeExperience(exp.id)} className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        placeholder="Company"
                        className="bg-slate-900 border border-white/10 rounded-lg p-2 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={exp.period}
                        onChange={(e) => updateExperience(exp.id, 'period', e.target.value)}
                        placeholder="Period"
                        className="bg-slate-900 border border-white/10 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                      rows={2}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-xs text-gray-300"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeFormTab === 'skills' && (
              <div className="space-y-4">
                <span className="text-xs font-bold text-gray-300 block">Skills & Tech Stack</span>
                <div className="flex gap-2">
                  <input
                    id="newSkillInput"
                    type="text"
                    placeholder="Add skill (e.g. Docker, TypeScript)..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addSkill(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {resume.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-purple-950/60 border border-purple-500/30 text-xs font-bold text-purple-200 flex items-center gap-2"
                    >
                      {skill}
                      <button onClick={() => removeSkill(idx)} className="hover:text-red-400">×</button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Visual Canvas Preview (7 Cols / Printable area) */}
        <div className="lg:col-span-7 print:col-span-12">
          <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl bg-slate-950 text-white space-y-6 min-h-[700px] relative">
            {/* Executive Header */}
            <div className={`border-b ${colorClasses.border} pb-6`}>
              <h1 className="text-3xl font-black tracking-tight text-white">{resume.personal.fullName}</h1>
              <p className={`text-sm font-bold ${colorClasses.text} mt-1`}>{resume.personal.jobTitle}</p>

              <div className="flex flex-wrap gap-4 text-xs text-gray-400 mt-3 font-medium">
                <span>📧 {resume.personal.email}</span>
                <span>📞 {resume.personal.phone}</span>
                <span>📍 {resume.personal.location}</span>
                <span>🌐 {resume.personal.website}</span>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="space-y-2">
              <h4 className={`text-xs font-black uppercase tracking-wider ${colorClasses.text}`}>
                Executive Summary
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed font-normal">
                {resume.personal.summary}
              </p>
            </div>

            {/* Experience Section */}
            <div className="space-y-4">
              <h4 className={`text-xs font-black uppercase tracking-wider ${colorClasses.text}`}>
                Professional Experience
              </h4>

              {resume.experience.map(exp => (
                <div key={exp.id} className="space-y-1.5 border-l-2 border-white/10 pl-4 py-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-bold text-white">{exp.title}</span>
                    <span className="text-xs font-bold text-gray-400">{exp.period}</span>
                  </div>
                  <div className={`text-xs font-semibold ${colorClasses.text}`}>{exp.company}</div>
                  <p className="text-xs text-gray-300 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>

            {/* Education Section */}
            <div className="space-y-3">
              <h4 className={`text-xs font-black uppercase tracking-wider ${colorClasses.text}`}>
                Education & Qualifications
              </h4>
              {resume.education.map(edu => (
                <div key={edu.id} className="flex justify-between items-baseline text-xs">
                  <div>
                    <span className="font-bold text-white block">{edu.degree}</span>
                    <span className="text-gray-400">{edu.school}</span>
                  </div>
                  <span className="text-gray-400 font-bold">{edu.period}</span>
                </div>
              ))}
            </div>

            {/* Skills & Competencies */}
            <div className="space-y-3">
              <h4 className={`text-xs font-black uppercase tracking-wider ${colorClasses.text}`}>
                Skills & Tech Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill, idx) => (
                  <span key={idx} className={`px-3 py-1 rounded-lg text-xs font-extrabold ${colorClasses.badge}`}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
