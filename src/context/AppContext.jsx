import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [fileSenderModalData, setFileSenderModalData] = useState(null);
  const [toast, setToast] = useState(null);

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

  return (
    <AppContext.Provider value={{
      activeTab,
      setActiveTab,
      fileSenderModalData,
      setFileSenderModalData,
      openFileSender,
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
