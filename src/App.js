import React, { useState } from 'react';
import { Calendar, BookOpen, Utensils, Archive, ChevronLeft, ChevronRight, Plus, Trash2, Check, RefreshCw } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('Menus');
  const [currentWeek, setCurrentWeek] = useState('Semaine du 17 au 23 août 2026');

  const [menus, setMenus] = useState({
    Lundi: { midi: 'Salade composée', soir: 'Quiche lorraine' },
    Mardi: { midi: 'Restes', soir: 'Poulet rôti et légumes' },
    Mercredi: { midi: 'Croque-monsieur', soir: 'Soupe de légumes et omelette' },
    Jeudi: { midi: 'Pâtes bolognaise', soir: 'Poêlée de légumes et riz' },
    Vendredi: { midi: 'Salade de thon', soir: 'Pizza maison' },
    Samedi: { midi: 'Gratin dauphinois', soir: 'Barbecue / Plancha' },
    Dimanche: { midi: 'Rôti de bœuf', soir: 'Velouté et tartines' },
  });

  const [catalog, setCatalog] = useState([
    { id: 1, title: 'Quiche lorraine', category: 'Plat', time: '45 min' },
    { id: 2, title: 'Poulet rôti et légumes', category: 'Plat', time: '1h15' },
    { id: 3, title: 'Pâtes bolognaise', category: 'Plat', time: '30 min' },
    { id: 4, title: 'Gratin dauphinois', category: 'Accompagnement', time: '1h' },
    { id: 5, title: 'Salade composée', category: 'Entrée', time: '15 min' },
  ]);

  const [shoppingList, setShoppingList] = useState([
    { id: 1, name: 'Lait', category: 'Produits frais', checked: false },
    { id: 2, name: 'Œufs', category: 'Produits frais', checked: false },
    { id: 3, name: 'Pâtes', category: 'Épicerie', checked: true },
    { id: 4, name: 'Tomates concassées', category: 'Épicerie', checked: false },
  ]);

  const [pantry, setPantry] = useState([
    { id: 1, name: 'Riz basmati', quantity: '2 paquets' },
    { id: 2, name: 'Huile d’olive', quantity: '1 bouteille' },
    { id: 3, name: 'Farine', quantity: '1 kg' },
  ]);

  const handleMenuChange = (day, mealType, value) => {
    setMenus(prev => ({
      ...prev,
      [day]: { ...prev[day], [mealType]: value }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 max-w-5xl mx-auto pb-16">
      <header className="mb-6 flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">Mon Menu Organisé</h1>
        {activeTab === 'Menus' && (
          <div className="flex items-center space-x-3 text-gray-600 font-medium">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ChevronLeft size={20} /></button>
            <span>{currentWeek}</span>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ChevronRight size={20} /></button>
          </div>
        )}
      </header>

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
              className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors shrink-0 ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'
              }`}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <main>
        {activeTab === 'Menus' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(menus).map(([day, meals]) => (
              <div key={day} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg text-blue-600 mb-3 border-b pb-2">{day}</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Midi</span>
                    <input
                      type="text"
                      value={meals.midi}
                      onChange={(e) => handleMenuChange(day, 'midi', e.target.value)}
                      className="w-full text-gray-800 font-medium bg-gray-50 p-2 rounded-lg mt-1 border border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Soir</span>
                    <input
                      type="text"
                      value={meals.soir}
                      onChange={(e) => handleMenuChange(day, 'soir', e.target.value)}
                      className="w-full text-gray-800 font-medium bg-gray-50 p-2 rounded-lg mt-1 border border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Catalogue' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Catalogue de Recettes</h2>
            <div className="space-y-3">
              {catalog.map((recipe) => (
                <div key={recipe.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <h4 className="font-semibold text-gray-800">{recipe.title}</h4>
                    <span className="text-xs text-gray-500">{recipe.category} • {recipe.time}</span>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">Favori</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Courses' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Liste de Courses</h2>
            <div className="space-y-2">
              {shoppingList.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" defaultChecked={item.checked} className="w-4 h-4 text-blue-600 rounded" />
                    <span className={`font-medium ${item.checked ? 'line-through text-gray-400' : 'text-gray-800'}`}>{item.name}</span>
                  </div>
                  <span className="text-xs text-gray-400">{item.category}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Placard' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Gestion du Placard</h2>
            <div className="space-y-2">
              {pantry.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-800">{item.name}</span>
                  <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-md">{item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
