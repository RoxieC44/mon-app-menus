import React, { useState, useEffect } from 'react';

// --- Composant principal de l'application ---
const App = () => {
  // État pour gérer la navigation par onglets
  const [activeTab, setActiveTab] = useState('Menu'); // 'Menu' ou 'Gâteaux'
  const [activeSubTab, setActiveSubTab] = useState('Choix'); // 'Choix' ou 'Catalogue'

  // --- Logique de gestion de la saison ---
  const getSaison = () => {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return 'Printemps';
    if (month >= 6 && month <= 8) return 'Été';
    if (month >= 9 && month <= 11) return 'Automne';
    return 'Hiver';
  };
  const saison = getSaison();

  return (
    <div className="app-container">
      <h1>Planificateur de Menus</h1>
      <p>Saison actuelle détectée : <strong>{saison}</strong></p>

      {/* Navigation principale */}
      <nav className="main-nav">
        <button onClick={() => { setActiveTab('Menu'); setActiveSubTab('Choix'); }}>Menu</button>
        <button onClick={() => { setActiveTab('Gâteaux'); setActiveSubTab('Choix'); }}>Gâteaux</button>
      </nav>

      {/* Sous-navigation */}
      <nav className="sub-nav">
        <button onClick={() => setActiveSubTab('Choix')}>Choix de la semaine</button>
        <button onClick={() => setActiveSubTab('Catalogue')}>Catalogue</button>
      </nav>

      <div className="content">
        {/* Ici viendrait la logique d'affichage conditionnel de vos composants 
            (MenuPlanner, CakePlanner, RecipeCatalog, etc.) */}
        <h2>{activeTab} - {activeSubTab === 'Choix' ? 'Choix de la semaine' : 'Catalogue'}</h2>
        
        {/* Exemple d'intégration du bouton spécifique aux gâteaux */}
        {activeTab === 'Gâteaux' && activeSubTab === 'Choix' && (
          <button className="generate-btn">Générer 2 gâteaux</button>
        )}
      </div>
    </div>
  );
};

export default App;
