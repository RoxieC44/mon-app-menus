import React, { useState, useEffect } from 'react';

const App = () => {
  const [activeTab, setActiveTab] = useState('Menu'); 
  const [activeSubTab, setActiveSubTab] = useState('Choix');
  const [recipes, setRecipes] = useState([]); // Votre base de recettes

  // 1. Détection automatique de la saison
  const getSaison = () => {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return 'Printemps';
    if (month >= 6 && month <= 8) return 'Été';
    if (month >= 9 && month <= 11) return 'Automne';
    return 'Hiver';
  };

  // --- Fonctions de gestion (logique métier) ---
  const handleGenerateCakes = () => {
    // Logique pour sélectionner 2 gâteaux aléatoires
    alert("Génération de 2 gâteaux aléatoires pour la semaine !");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Planificateur de Menus</h1>
        <p className="text-gray-600">Saison actuelle : <strong>{getSaison()}</strong></p>
      </header>

      {/* Navigation principale */}
      <div className="flex gap-4 mb-6 border-b pb-4">
        <button 
          onClick={() => { setActiveTab('Menu'); setActiveSubTab('Choix'); }}
          className={`px-4 py-2 rounded ${activeTab === 'Menu' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Menu
        </button>
        <button 
          onClick={() => { setActiveTab('Gâteaux'); setActiveSubTab('Choix'); }}
          className={`px-4 py-2 rounded ${activeTab === 'Gâteaux' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Gâteaux
        </button>
      </div>

      {/* Sous-navigation */}
      <div className="flex gap-6 mb-6 font-medium">
        <button 
          onClick={() => setActiveSubTab('Choix')}
          className={activeSubTab === 'Choix' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}
        >
          Choix de la semaine
        </button>
        <button 
          onClick={() => setActiveSubTab('Catalogue')}
          className={activeSubTab === 'Catalogue' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}
        >
          Catalogue
        </button>
      </div>

      {/* Contenu principal */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        {activeTab === 'Gâteaux' && activeSubTab === 'Choix' && (
          <button 
            onClick={handleGenerateCakes}
            className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Générer 2 gâteaux
          </button>
        )}
        
        {/* Ici s'affichent vos composants de listes de recettes ou formulaires */}
        <p>Affichage de : {activeTab} - {activeSubTab}</p>
      </div>
    </div>
  );
};

export default App;
