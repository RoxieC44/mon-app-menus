import React, { useState } from 'react';
import { Calendar, BookOpen, Utensils, Archive, ChevronLeft, ChevronRight } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('Menus');

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Mon Menu Organisé</h1>
      </header>

      {/* Navigation */}
      <nav className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {['Menus', 'Catalogue', 'Courses', 'Placard'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 ${
              activeTab === tab 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab === 'Menus' && <Calendar size={18} />}
            {tab === 'Catalogue' && <BookOpen size={18} />}
            {tab === 'Courses' && <Utensils size={18} />}
            {tab === 'Placard' && <Archive size={18} />}
            <span>{tab}</span>
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">{activeTab}</h2>
        <div className="text-gray-500">
          Bienvenue dans la section {activeTab}. Le contenu est prêt à être personnalisé !
        </div>
      </main>
    </div>
  );
};

export default App;
