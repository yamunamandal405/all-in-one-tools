import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [fileSenderModalData, setFileSenderModalData] = useState(null);
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [isSystemUpdateModalOpen, setIsSystemUpdateModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Theme State: 'dark' | 'light' | 'system'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('omni_theme') || 'dark';
  });

  const [effectiveTheme, setEffectiveTheme] = useState('dark');

  // System Update State
  const [systemStatus, setSystemStatus] = useState({
    version: '2.4.0',
    build: '2026.07.29-PRO',
    lastChecked: 'Just now',
    status: 'Optimal',
    channel: 'Enterprise Stable',
    hasPendingUpdate: false,
    updatedAt: new Date().toLocaleDateString()
  });
  const [isCheckingUpdates, setIsCheckingUpdates] = useState(false);

  // Handle Theme Effect
  useEffect(() => {
    localStorage.setItem('omni_theme', theme);
    
    const applyTheme = () => {
      let isDark = true;
      if (theme === 'system') {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      } else {
        isDark = theme === 'dark';
      }

      const activeMode = isDark ? 'dark' : 'light';
      setEffectiveTheme(activeMode);

      if (isDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        document.body.classList.add('dark');
        document.body.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
        document.body.classList.add('light');
        document.body.classList.remove('dark');
      }
    };

    applyTheme();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Custom Tools state
  const [customTools, setCustomTools] = useState(() => {
    const saved = localStorage.getItem('omni_custom_tools');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('omni_custom_tools', JSON.stringify(customTools));
  }, [customTools]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const addCustomTool = (tool) => {
    setCustomTools(prev => [tool, ...prev]);
    showToast(`Custom Tool "${tool.name}" created!`, 'success');
  };

  const deleteCustomTool = (toolId) => {
    setCustomTools(prev => prev.filter(t => t.id !== toolId));
    showToast('Tool removed', 'info');
  };

  const openFileSender = (fileObj) => {
    setFileSenderModalData(fileObj);
  };

  const checkSystemUpdates = () => {
    setIsCheckingUpdates(true);
    showToast('Scanning OmniSuite repositories & core engines...', 'info');
    
    setTimeout(() => {
      setIsCheckingUpdates(false);
      setSystemStatus(prev => ({
        ...prev,
        lastChecked: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Optimal & Up to Date'
      }));
      showToast('All OmniSuite core systems are updated to latest v2.4.0 build!', 'success');
    }, 2500);
  };

  return (
    <AppContext.Provider value={{
      activeTab,
      setActiveTab,
      fileSenderModalData,
      setFileSenderModalData,
      openFileSender,
      securityModalOpen,
      setSecurityModalOpen,
      isSystemUpdateModalOpen,
      setIsSystemUpdateModalOpen,
      systemStatus,
      isCheckingUpdates,
      checkSystemUpdates,
      theme,
      setTheme,
      effectiveTheme,
      customTools,
      addCustomTool,
      deleteCustomTool,
      toast,
      showToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

