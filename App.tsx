import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ComparisonView from './components/ComparisonView';
import CodeEditor from './components/CodeEditor';
import VisualBuilder from './components/VisualBuilder';
import PythonRoadmap from './components/PythonRoadmap';
import { ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard />;
      case ViewState.COMPARISON:
        return <ComparisonView />;
      case ViewState.VISUAL_BUILDER:
        return <VisualBuilder />;
      case ViewState.EDITOR:
        return <CodeEditor />;
      case ViewState.PYTHON_ROADMAP:
        return <PythonRoadmap />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      <main className="flex-1 ml-64 overflow-y-auto max-h-screen">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;