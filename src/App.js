import React, { useState } from 'react';
import { Calendar, BookOpen, Utensils, Archive, ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('Menus');
  const [currentWeek, setCurrentWeek] = useState('Semaine du 17 au 23 août 2026');

  // Exemple de structure pour les menus de la semaine
  const [menus, setMenus] = useState({
    Lundi: { midi: 'Salade composée', soir: 'Quiche lorraine' },
    Mardi: { midi: 'Restes', soir: 'Poulet rôti et légumes' },
    Mercredi: { midi: 'Croque-monsieur', soir: 'Soupe de légumes et omelette' },
    Jeudi: { midi: 'Pâtes bolognaise', soir: 'Poêlée de légumes et riz' },
    Vendredi: { midi: 'Salade de thon', soir: 'Pizza maison' },
    Samedi: { midi: 'Gratin dauphinois', soir: 'Barbecue / Plancha' },
    Dimanche: { midi: 'Rôti de bœuf', soir: 'Velouté et tartines' },
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <header className="mb-6 flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">Mon Menu Organisé</h1>
        <div className="flex items-center space-x-3 text-gray-600 font-medium">
          <button className="p-2 hover:bg-gray-100 rounded-lg"><ChevronLeft size={20} /></button>
          <span>{currentWeek}</span>
          <button className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRight size={20} /></button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {[
          { id: 'Menus', label: 'Menus', icon: Calendar },
          { id: 'Catalogue', label: 'Catalogue', icon: BookOpen },
          { id: 'Courses', label: 'Courses', icon: Utensils },
          { id: 'Placard', label: 'Placard', icon: Archive },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Main Content */}
      <main>
        {activeTab === 'Menus' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(menus).map(([day, meals]) => (
              <div key={day} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg text-blue-600 mb-3 border-b pb-2">{day}</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Midi</span>
                    <div className="text-gray-800 font-medium bg-gray-50 p-2 rounded-lg mt-1">{meals.midi}</div>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Soir</span>
                    <div className="text-gray-800 font-medium bg-gray-50 p-2 rounded-lg mt-1">{meals.soir}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab !== 'Menus' && (
          <div className="bg-white p-6 rounded-xl shadow-sm text-center py-12">
            <h2 className="text-xl font-semibold mb-2 text-gray-700">{activeTab}</h2>
            <p className="text-gray-500">Section en cours de configuration...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
