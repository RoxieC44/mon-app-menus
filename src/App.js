import React, { useState, useEffect } from 'react';
import { Calendar, Cake, Plus, Archive, ShoppingBag, X, Trash2, Sparkles, ExternalLink, Camera, Check, Utensils, Menu } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('menus');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [menuSubTab, setMenuSubTab] = useState('semaine');
  const [gateauSubTab, setGateauSubTab] = useState('semaine');
  const [addType, setAddType] = useState('plat');
  const [currentSeason, setCurrentSeason] = useState('Été');

  // Initialisation saison
  useEffect(() => {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) setCurrentSeason('Printemps');
    else if (month >= 6 && month <= 8) setCurrentSeason('Été');
    else if (month >= 9 && month <= 11) setCurrentSeason('Automne');
    else setCurrentSeason('Hiver');
  }, []);

  // Données initiales
  const [weeklyMenu, setWeeklyMenu] = useState({
    Lundi: { midi: '', soir: '' },
    Mardi: { midi: '', soir: '' },
    Mercredi: { midi: '', soir: 'Cordon bleu et Pomme de terre' },
    Jeudi: { midi: '', soir: '' },
    Vendredi: { midi: '', soir: '' },
    Samedi: { midi: '', soir: '' },
    Dimanche: { midi: '', soir: '' },
  });

  const [weeklyCakes, setWeeklyCakes] = useState({ choix1: '', choix2: '' });
  const [dishes, setDishes] = useState([
    { id: 1, title: 'Cordon bleu et Pomme de terre', category: 'Pommes de terre', appliance: 'Poêle', season: 'Toutes', ingredients: ['Cordon bleu', 'Pommes de terre'], instructions: '1. Éplucher les pommes de terre. 2. Faire dorer.' },
    { id: 2, title: 'Poulet coco et riz', category: 'Riz', appliance: 'Cookeo', season: 'Toutes', ingredients: ['Poulet', 'Riz', 'Coco'], instructions: '1. Cuisson 10 min.' }
  ]);
  const [cakes, setCakes] = useState([{ id: 101, title: 'Gâteau au yaourt', category: 'Plaisir', appliance: 'Four', season: 'Toutes', ingredients: ['Yaourt', 'Farine'], instructions: '1. Mélanger. 2. Cuire.' }]);
  const [pantry, setPantry] = useState([{ id: 1, name: 'Riz', status: 'Entamé' }]);

  const handleDeleteRecipe = (id, type) => {
    if (type === 'plat') setDishes(dishes.filter(d => d.id !== id));
    else setCakes(cakes.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-24">
      <header className="bg-indigo-600 text-white px-6 py-4 shadow-md flex justify-between items-center sticky top-0 z-25">
        <h1 className="text-lg font-bold">Mon Menu Organisé</h1>
        <div className="bg-amber-300 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full">Saison : {currentSeason}</div>
      </header>

      <main className="flex-1 p-4 max-w-4xl mx-auto w-full">
        {/* ONGLET MENUS */}
        {activeTab === 'menus' && (
          <div className="space-y-6">
            <div className="flex bg-slate-200/70 p-1 rounded-2xl max-w-md mx-auto">
              <button onClick={() => setMenuSubTab('semaine')} className={`flex-1 py-2.5 rounded-xl font-semibold text-sm ${menuSubTab === 'semaine' ? 'bg-white text-indigo-600 shadow-sm' : ''}`}>Choix de la semaine</button>
              <button onClick={() => setMenuSubTab('catalogue')} className={`flex-1 py-2.5 rounded-xl font-semibold text-sm ${menuSubTab === 'catalogue' ? 'bg-white text-indigo-600 shadow-sm' : ''}`}>Catalogue repas</button>
            </div>
            {menuSubTab === 'semaine' && Object.entries(weeklyMenu).map(([day, meals]) => (
              <div key={day} className="bg-white p-5 rounded-2xl border shadow-sm space-y-3">
                <h3 className="font-bold text-slate-800">{day}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><span className="text-xs text-slate-400 block uppercase font-bold">Midi</span><input className="w-full border rounded-lg p-2" value={meals.midi} onChange={(e) => setWeeklyMenu({...weeklyMenu, [day]: {...meals, midi: e.target.value}})} /></div>
                  <div><span className="text-xs text-slate-400 block uppercase font-bold">Soir</span><input className="w-full border rounded-lg p-2" value={meals.soir} onChange={(e) => setWeeklyMenu({...weeklyMenu, [day]: {...meals, soir: e.target.value}})} /></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ONGLET GÂTEAUX */}
        {activeTab === 'gateaux' && (
          <div className="space-y-6">
            <div className="flex bg-slate-200/70 p-1 rounded-2xl max-w-md mx-auto">
              <button onClick={() => setGateauSubTab('semaine')} className={`flex-1 py-2.5 rounded-xl font-semibold text-sm ${gateauSubTab === 'semaine' ? 'bg-white text-indigo-600 shadow-sm' : ''}`}>Choix de la semaine</button>
              <button onClick={() => setGateauSubTab('catalogue')} className={`flex-1 py-2.5 rounded-xl font-semibold text-sm ${gateauSubTab === 'catalogue' ? 'bg-white text-indigo-600 shadow-sm' : ''}`}>Catalogue Gâteaux</button>
            </div>
            {gateauSubTab === 'semaine' && (
              <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
                <div><label className="text-xs font-bold text-slate-400 uppercase">choix n° 1</label><select className="w-full border rounded-xl p-3" value={weeklyCakes.choix1} onChange={(e) => setWeeklyCakes({...weeklyCakes, choix1: e.target.value})}><option value="">Choisir...</option>{cakes.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}</select></div>
                <div><label className="text-xs font-bold text-slate-400 uppercase">choix n° 2</label><select className="w-full border rounded-xl p-3" value={weeklyCakes.choix2} onChange={(e) => setWeeklyCakes({...weeklyCakes, choix2: e.target.value})}><option value="">Choisir...</option>{cakes.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}</select></div>
              </div>
            )}
          </div>
        )}

        {/* ONGLET PLACARD */}
        {activeTab === 'placard' && (
          <div className="bg-white p-8 rounded-2xl border shadow-sm space-y-6">
            <h2 className="text-xl font-bold">Mon Placard & Frigo</h2>
            <p className="text-sm text-slate-500">Listez vos provisions et leur état actuel pour affiner la liste de courses.</p>
          </div>
        )}

        {/* ONGLET COURSES */}
        {activeTab === 'courses' && (
          <div className="bg-white p-8 rounded-2xl border shadow-sm space-y-6">
            <h2 className="text-xl font-bold">Liste de Courses Intelligente</h2>
            <p className="text-sm text-slate-500">Basée sur les menus et les gâteaux de la semaine.</p>
            <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm text-sm">Exporter la liste</button>
          </div>
        )}
      </main>

      {/* NAVIGATION DU BAS */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-around z-30 shadow-lg">
        <button onClick={() => setActiveTab('menus')} className="text-xs font-bold text-slate-600">Menus</button>
        <button onClick={() => setActiveTab('gateaux')} className="text-xs font-bold text-slate-600">Gâteaux</button>
        <button onClick={() => setActiveTab('ajouter')} className="text-xs font-bold text-indigo-600">Ajouter</button>
        <button onClick={() => setActiveTab('placard')} className="text-xs font-bold text-slate-600">Placard</button>
        <button onClick={() => setActiveTab('courses')} className="text-xs font-bold text-slate-600">Courses</button>
      </nav>
    </div>
  );
}
