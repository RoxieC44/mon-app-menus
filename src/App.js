import React, { useState } from 'react';

const App = () => {
  const [activeTab, setActiveTab] = useState('Menu'); // 'Menu' ou 'Gâteaux'
  const [activeSubTab, setActiveSubTab] = useState('Choix'); // 'Choix' ou 'Catalogue'

  const getSaison = () => {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return 'Printemps';
    if (month >= 6 && month <= 8) return 'Été';
    if (month >= 9 && month <= 11) return 'Automne';
    return 'Hiver';
  };
  const saison = getSaison();

  return (
    <div style={styles.container}>
      {/* Styles intégrés pour corriger l'affichage immédiatement */}
      <style>{`
        button { cursor: pointer; transition: all 0.2s; }
        .active-tab { background-color: #3b82f6 !important; color: white !important; border-color: #3b82f6 !important; }
        .active-subtab { border-bottom: 3px solid #3b82f6 !important; font-weight: bold; color: #3b82f6; }
      `}</style>

      <h1 style={styles.title}>Planificateur de Menus</h1>
      <p style={styles.subtitle}>Saison actuelle détectée : <strong>{saison}</strong></p>

      {/* Navigation principale (Onglets Menu / Gâteaux) */}
      <div style={styles.mainNav}>
        <button 
          onClick={() => { setActiveTab('Menu'); setActiveSubTab('Choix'); }}
          className={activeTab === 'Menu' ? 'active-tab' : ''}
          style={styles.mainButton}
        >
          Menu
        </button>
        <button 
          onClick={() => { setActiveTab('Gâteaux'); setActiveSubTab('Choix'); }}
          className={activeTab === 'Gâteaux' ? 'active-tab' : ''}
          style={styles.mainButton}
        >
          Gâteaux
        </button>
      </div>

      {/* Sous-navigation (Choix de la semaine / Catalogue) */}
      <div style={styles.subNav}>
        <button 
          onClick={() => setActiveSubTab('Choix')}
          className={activeSubTab === 'Choix' ? 'active-subtab' : ''}
          style={styles.subButton}
        >
          Choix de la semaine
        </button>
        <button 
          onClick={() => setActiveSubTab('Catalogue')}
          className={activeSubTab === 'Catalogue' ? 'active-subtab' : ''}
          style={styles.subButton}
        >
          Catalogue
        </button>
      </div>

      {/* Contenu dynamique */}
      <div style={styles.content}>
        <h2>{activeTab} - {activeSubTab === 'Choix' ? 'Choix de la semaine' : 'Catalogue'}</h2>
        
        {activeTab === 'Gâteaux' && activeSubTab === 'Choix' && (
          <button style={styles.generateBtn}>Générer 2 gâteaux</button>
        )}
      </div>
    </div>
  );
};

// Styles CSS en objets JS pour un rendu propre sans fichier externe requis
const styles = {
  container: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '5px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#4b5563',
    marginBottom: '20px',
  },
  mainNav: {
    display: 'flex',
    gap: '10px',
    marginBottom: '15px',
  },
  mainButton: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    backgroundColor: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151',
  },
  subNav: {
    display: 'flex',
    gap: '20px',
    borderBottom: '2px solid #e5e7eb',
    marginBottom: '20px',
    paddingBottom: '5px',
  },
  subButton: {
    background: 'none',
    border: 'none',
    padding: '8px 4px',
    fontSize: '15px',
    color: '#4b5563',
  },
  content: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  },
  generateBtn: {
    marginTop: '15px',
    padding: '8px 16px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
  },
};

export default App;
