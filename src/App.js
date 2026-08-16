import React, { useState, useEffect } from 'react';
import { Calendar, Cake, Plus, Archive, ShoppingBag, X, Trash2, Sparkles, ExternalLink } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('menus');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  
  // Sous-onglets
  const [menuSubTab, setMenuSubTab] = useState('semaine'); // 'semaine' | 'catalogue'
  const [gateauSubTab, setGateauSubTab] = useState('semaine'); // 'semaine' | 'catalogue'
  const [addType, setAddType] = useState('plat'); // 'plat' | 'gateau'

  // Saison automatique selon le mois actuel
  const [currentSeason, setCurrentSeason] = useState('Été');
  useEffect(() => {
    const month = new Date().getMonth() + 1; // 1 à 12
    // Mars (3) à Mai (5) = Printemps, Juin (6) à Août (8) = Été, Septembre (9) à Novembre (11) = Automne, Décembre (12) à Février (2) = Hiver
    if (month >= 3 && month <= 5) setCurrentSeason('Printemps');
    else if (month >= 6 && month <= 8) setCurrentSeason('Été');
    else if (month >= 9 && month <= 11) setCurrentSeason('Automne');
    else setCurrentSeason('Hiver');
  }, []);

  // Catalogue des Plats & Repas
  const [dishes, setDishes] = useState([
    {
      id: 1,
      title: 'Poulet coco et riz',
      category: 'Riz',
      appliance: 'Cookeo',
      season: 'Toutes',
      link: '',
      ingredients: ['4 blancs de poulet', '250g de riz', '400ml de lait de coco', 'Curry en poudre'],
      instructions: '1. Couper le poulet.\n2. Lancer le mode dorer avec un peu d\'huile.\n3. Ajouter le riz, le lait de coco et le curry.\n4. Cuisson sous pression 10 min.'
    },
    {
      id: 2,
      title: 'Gratin de potiron / chou-fleur',
      category: 'Pommes de terre',
      appliance: 'Four',
      season: 'Hiver',
      link: '',
      ingredients: ['1 chou-fleur ou potiron', '50cl de crème liquide', 'Gruyère râpé', 'Muscade'],
      instructions: '1. Cuire les légumes à la vapeur.\n2. Disposer dans un plat à gratin.\n3. Verser la crème, ajouter le gruyère et la muscade.\n4. Enfourner 25 min à 180°C.'
    },
    {
      id: 3,
      title: 'Tian de courgettes et tomates',
      category: 'Plaisir',
      appliance: 'Four',
      season: 'Été',
      link: '',
      ingredients: ['3 courgettes', '4 tomates', 'Huile d\'olive', 'Herbes de Provence', 'Ail'],
      instructions: '1. Couper les courgettes et tomates en rondelles.\n2. Les disposer en alternance dans un plat.\n3. Arroser d\'huile d\'olive, parsemer d\'herbes et d\'ail.\n4. Cuire 45 min à 190°C.'
    }
  ]);

  // Catalogue des Gâteaux
  const [cakes, setCakes] = useState([
    {
      id: 101,
      title: 'Gâteau au yaourt moelleux',
      category: 'Plaisir',
      appliance: 'Four',
      season: 'Toutes',
      link: '',
      ingredients: ['1 yaourt nature', '3 pots de farine', '2 pots de sucre', '1/2 pot d\'huile', '3 œufs', '1 sachet de levure'],
      instructions: '1. Mélanger le yaourt avec les sucres et les œufs.\n2. Ajouter la farine, la levure et l\'huile.\n3. Cuire 35 min à 180°C.'
    },
    {
      id: 102,
      title: 'Cookies pépites de chocolat',
      category: 'Plaisir',
      appliance: 'Four',
      season: 'Toutes',
      link: '',
      ingredients: ['150g de beurre', '100g de sucre', '1 œuf', '220g de farine', '100g de pépites de chocolat'],
      instructions: '1. Mélanger le beurre mou et le sucre.\n2. Ajouter l\'œuf, puis la farine et les pépites.\n3. Former des boules et cuire 12 min à 180°C.'
    }
  ]);

  // Placard & Frigo
  const [pantry, setPantry] = useState([
    { id: 1, name: 'Sel', status: 'Plein' },
    { id: 2, name: 'Poivre', status: 'Plein' },
    { id: 3, name: 'Huile d\'olive', status: 'Plein' },
    { id: 4, name: 'Beurre', status: 'Entamé' },
    { id: 5, name: 'Pâtes', status: 'Entamé' },
    { id: 6, name: 'Riz', status: 'Presque vide' },
    { id: 7, name: 'Oignons', status: 'Plein' },
    { id: 8, name: 'Ail', status: 'Plein' }
  ]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemStatus, setNewItemStatus] = useState('Plein');

  // Filtres catalogue
  const [seasonFilter, setSeasonFilter] = useState('Toutes les saisons');
  const [applianceFilter, setApplianceFilter] = useState('Tous les appareils');

  // Formulaire d'ajout de recette
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Plaisir');
  const [formAppliance, setFormAppliance] = useState('Four');
  const [formSeason, setFormSeason] = useState('Toutes');
  const [formLink, setFormLink] = useState('');
  const [formIngredients, setFormIngredients] = useState('');
  const [formInstructions, setFormInstructions] = useState('');

  // Gestion du stock placard
  const handleAddPantryItem = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    setPantry([...pantry, { id: Date.now(), name: newItemName.trim(), status: newItemStatus }]);
    setNewItemName('');
  };

  const handleDeletePantryItem = (id) => {
    setPantry(pantry.filter(item => item.id !== id));
  };

  const handleUpdatePantryStatus = (id, newStatus) => {
    setPantry(pantry.map(item => item.id === id ? { ...item, status: newStatus } : item));
  };

  // Suppression d'une recette
  const handleDeleteRecipe = (id, type) => {
    if (type === 'plat') {
      setDishes(dishes.filter(d => d.id !== id));
    } else {
      setCakes(cakes.filter(c => c.id !== id));
    }
  };

  // Enregistrement d'une nouvelle recette
  const handleSaveRecipe = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newRecipe = {
      id: Date.now(),
      title: formTitle,
      category: formCategory,
      appliance: formAppliance,
      season: formSeason,
      link: formLink,
      ingredients: formIngredients.split('\n').filter(i => i.trim() !== ''),
      instructions: formInstructions
    };

    if (addType === 'plat') {
      setDishes([newRecipe, ...dishes]);
      setActiveTab('menus');
      setMenuSubTab('catalogue');
    } else {
      setCakes([newRecipe, ...cakes]);
      setActiveTab('gateaux');
      setGateauSubTab('catalogue');
    }

    // Reset form
    setFormTitle('');
    setFormLink('');
    setFormIngredients('');
    setFormInstructions('');
  };

  // Filtrage des listes
  const filterRecipes = (list) => {
    return list.filter(item => {
      const matchSeason = seasonFilter === 'Toutes les saisons' || item.season === seasonFilter || item.season === 'Toutes';
      const matchAppliance = applianceFilter === 'Tous les appareils' || item.appliance === applianceFilter;
      return matchSeason && matchAppliance;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-24">
      
      {/* HEADER */}
      <header className="bg-indigo-600 text-white px-6 py-4 shadow-md flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl">
            <span className="text-xl">🍽️</span>
          </div>
          <h1 className="text-xl font-bold">Mon Menu Organisé</h1>
        </div>
        <div className="bg-amber-300 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
          <span>☀️</span> Saison actuelle : {currentSeason}
        </div>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 p-4 max-w-4xl mx-auto w-full">
        
        {/* ================= ONGLET MENUS ================= */}
        {activeTab === 'menus' && (
          <div className="space-y-6">
            {/* Sous-onglets Menus */}
            <div className="flex bg-slate-200/70 p-1 rounded-2xl max-w-md mx-auto">
              <button
                onClick={() => setMenuSubTab('semaine')}
                className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  menuSubTab === 'semaine' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar size={18} /> Choix de la semaine
              </button>
              <button
                onClick={() => setMenuSubTab('catalogue')}
                className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  menuSubTab === 'catalogue' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Catalogue Repas ({dishes.length})
              </button>
            </div>

            {menuSubTab === 'semaine' && (
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Sparkles className="text-indigo-600" size={20} /> Générateur Intelligent
                      </h2>
                      <p className="text-xs text-slate-500">Suggestions automatiques basées sur la saison actuelle ({currentSeason}).</p>
                    </div>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm flex items-center gap-2">
                      Générer un menu équilibré
                    </button>
                  </div>
                </div>

                {/* Liste des jours */}
                {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map((day) => (
                  <div key={day} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Calendar size={18} className="text-indigo-600" /> {day}
                      </h3>
                      <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full">
                        Plat / Repas
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Midi</span>
                        <select className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                          <option>-- Choisir le midi --</option>
                          {dishes.map(d => <option key={d.id} value={d.title}>{d.title}</option>)}
                        </select>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Soir</span>
                        <select className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                          <option>-- Choisir le soir --</option>
                          {dishes.map(d => <option key={d.id} value={d.title}>{d.title}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {menuSubTab === 'catalogue' && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                  <h2 className="font-bold text-slate-800">Toutes les recettes de repas ({dishes.length})</h2>
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <select 
                      value={seasonFilter} 
                      onChange={(e) => setSeasonFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-700 focus:outline-none"
                    >
                      <option>Toutes les saisons</option>
                      <option>Été</option>
                      <option>Hiver</option>
                      <option>Printemps</option>
                      <option>Automne</option>
                      <option>Toutes</option>
                    </select>
                    <select 
                      value={applianceFilter} 
                      onChange={(e) => setApplianceFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-700 focus:outline-none"
                    >
                      <option>Tous les appareils</option>
                      <option>Four</option>
                      <option>Cookeo</option>
                      <option>Thermomix</option>
                      <option>Airfryer</option>
                      <option>Poêle</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filterRecipes(dishes).map(recipe => (
                    <div key={recipe.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-slate-800 text-base">{recipe.title}</h3>
                          <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-full">{recipe.category}</span>
                        </div>
                        <div className="flex gap-2 text-xs">
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">⚙️ {recipe.appliance}</span>
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">☀️ {recipe.season}</span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2">
                          <strong className="text-slate-700">Ingrédients :</strong> {recipe.ingredients.join(', ')}
                        </p>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                        <button
                          onClick={() => setSelectedRecipe(recipe)}
                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                        >
                          Voir la fiche
                        </button>
                        <button 
                          onClick={() => handleDeleteRecipe(recipe.id, 'plat')}
                          className="text-slate-400 hover:text-red-500 p-2 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= ONGLET GÂTEAUX ================= */}
        {activeTab === 'gateaux' && (
          <div className="space-y-6">
            <div className="flex bg-slate-200/70 p-1 rounded-2xl max-w-md mx-auto">
              <button
                onClick={() => setGateauSubTab('semaine')}
                className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  gateauSubTab === 'semaine' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Cake size={18} /> Choix de la semaine
              </button>
              <button
                onClick={() => setGateauSubTab('catalogue')}
                className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  gateauSubTab === 'catalogue' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Catalogue Gâteaux ({cakes.length})
              </button>
            </div>

            {gateauSubTab === 'semaine' && (
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Gâteaux & Goûters de la semaine</h2>
                    <p className="text-xs text-slate-500">Sélectionnez vos pâtisseries pour les goûters.</p>
                  </div>
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm">
                    Générer les gâteaux
                  </button>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <h3 className="font-bold text-slate-800 text-sm">CHOIX N°1</h3>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:outline-none">
                    <option>-- Choisir une recette de gâteau --</option>
                    {cakes.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                  </select>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <h3 className="font-bold text-slate-800 text-sm">CHOIX N°2</h3>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:outline-none">
                    <option>-- Choisir une recette de gâteau --</option>
                    {cakes.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                  </select>
                </div>
              </div>
            )}

            {gateauSubTab === 'catalogue' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cakes.map(cake => (
                    <div key={cake.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-slate-800 text-base">{cake.title}</h3>
                          <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-full">{cake.category}</span>
                        </div>
                        <div className="flex gap-2 text-xs">
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">⚙️ {cake.appliance}</span>
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">☀️ {cake.season}</span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2">
                          <strong className="text-slate-700">Ingrédients :</strong> {cake.ingredients.join(', ')}
                        </p>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                        <button
                          onClick={() => setSelectedRecipe(cake)}
                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors"
                        >
                          Voir la fiche
                        </button>
                        <button 
                          onClick={() => handleDeleteRecipe(cake.id, 'gateau')}
                          className="text-slate-400 hover:text-red-500 p-2 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= ONGLET AJOUTER ================= */}
        {activeTab === 'ajouter' && (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Plus className="text-indigo-600" size={24} /> Ajouter une nouvelle recette
            </h2>

            <form onSubmit={handleSaveRecipe} className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Type de recette</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAddType('plat')}
                    className={`py-3 px-4 rounded-xl font-semibold text-sm border transition-all flex items-center justify-center gap-2 ${
                      addType === 'plat' ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    🍲 Plat / Repas
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddType('gateau')}
                    className={`py-3 px-4 rounded-xl font-semibold text-sm border transition-all flex items-center justify-center gap-2 ${
                      addType === 'gateau' ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    🍰 Gâteau / Goûter
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Nom de la recette</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Gratin de courgettes au chèvre..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Féculent / Catégorie</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:outline-none"
                  >
                    <option>Plaisir</option>
                    <option>Pâtes</option>
                    <option>Riz</option>
                    <option>Pommes de terre</option>
                    <option>Blé</option>
                    <option>Semoule</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Appareil utilisé</label>
                  <select
                    value={formAppliance}
                    onChange={(e) => setFormAppliance(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:outline-none"
                  >
                    <option>Four</option>
                    <option>Cookeo</option>
                    <option>Thermomix</option>
                    <option>Airfryer</option>
                    <option>Poêle</option>
                    <option>Casserole</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Saison idéale</label>
                <select
                  value={formSeason}
                  onChange={(e) => setFormSeason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:outline-none"
                >
                  <option>Toutes</option>
                  <option>Été</option>
                  <option>Hiver</option>
                  <option>Printemps</option>
                  <option>Automne</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Lien internet optionnel</label>
                <input
                  type="url"
                  placeholder="https://www.marmiton.org/..."
                  value={formLink}
                  onChange={(e) => setFormLink(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Ingrédients (1 par ligne)</label>
                <textarea
                  rows={4}
                  placeholder="250g de farine&#10;1 sachet de levure&#10;100g de sucre"
                  value={formIngredients}
                  onChange={(e) => setFormIngredients(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Instructions de préparation</label>
                <textarea
                  rows={4}
                  placeholder="Mélanger tous les ingrédients..."
                  value={formInstructions}
                  onChange={(e) => setFormInstructions(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm text-sm"
              >
                Enregistrer la recette
              </button>
            </form>
          </div>
        )}

        {/* ================= ONGLET PLACARD ================= */}
        {activeTab === 'placard' && (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Mon Placard & Frigo</h2>
              <p className="text-xs text-slate-500">Listez vos provisions et leur état actuel pour affiner la liste de courses.</p>
            </div>

            <form onSubmit={handleAddPantryItem} className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="Ex: Riz, Farine, Lait..."
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:outline-none"
              />
              <select
                value={newItemStatus}
                onChange={(e) => setNewItemStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:outline-none"
              >
                <option>Plein</option>
                <option>Entamé</option>
                <option>Presque vide</option>
              </select>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm shadow-sm"
              >
                Ajouter
              </button>
            </form>

            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
              {pantry.map(item => (
                <div key={item.id} className="flex justify-between items-center p-4 hover:bg-slate-50/50 transition-colors">
                  <span className="font-medium text-slate-700">{item.name}</span>
                  <div className="flex items-center gap-3">
                    <select
                      value={item.status}
                      onChange={(e) => handleUpdatePantryStatus(item.id, e.target.value)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none ${
                        item.status === 'Plein' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        item.status === 'Entamé' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      <option>Plein</option>
                      <option>Entamé</option>
                      <option>Presque vide</option>
                    </select>
                    <button 
                      onClick={() => handleDeletePantryItem(item.id)}
                      className="text-slate-400 hover:text-red-500 p-1.5 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= ONGLET COURSES ================= */}
        {activeTab === 'courses' && (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Liste de Courses Intelligente</h2>
              <p className="text-xs text-slate-500">Basée sur les menus et les gâteaux de la semaine.</p>
            </div>

            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center space-y-3">
              <p className="text-sm text-slate-500">Aucun menu or gâteau planifié pour l'instant.</p>
              <button
                onClick={() => setActiveTab('menus')}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold px-4 py-2.5 rounded-xl text-xs transition-colors"
              >
                Aller planifier le menu
              </button>
            </div>
          </div>
        )}
      </main>

      {/* MODALE FICHE RECETTE */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-slate-800">{selectedRecipe.title}</h2>
                <div className="flex gap-2 text-xs mt-1">
                  <span className="bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-md">{selectedRecipe.category}</span>
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">⚙️ {selectedRecipe.appliance}</span>
                </div>
              </div>
              <button onClick={() => setSelectedRecipe(null)} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors">
                <X size={18} />
              </button>
            </div>

            {selectedRecipe.link && (
              <a 
                href={selectedRecipe.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-medium"
              >
                <ExternalLink size={14} /> Voir le lien externe de la recette
              </a>
            )}

            {selectedRecipe.ingredients && selectedRecipe.ingredients.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Ingrédients</h3>
                <ul className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-1.5">
                  {selectedRecipe.ingredients.map((ing, idx) => (
                    <li key={idx} className="text-sm text-slate-800 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full inline-block"></span>
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedRecipe.instructions && (
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Préparation</h3>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-200 whitespace-pre-line">
                  {selectedRecipe.instructions}
                </p>
              </div>
            )}

            <button
              onClick={() => setSelectedRecipe(null)}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 rounded-xl transition-colors text-sm"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* BARRE DE NAVIGATION INFÉRIEURE */}
      <nav className="bg-white border-t border-slate-200 fixed bottom-0 w-full z-10 shadow-lg">
        <div className="flex justify-around items-center h-16 max-w-4xl mx-auto px-2">
          {[
            { id: 'menus', icon: Calendar, label: 'Menus' },
            { id: 'gateaux', icon: Cake, label: 'Gâteaux' },
            { id: 'ajouter', icon: Plus, label: 'Ajouter' },
            { id: 'placard', icon: Archive, label: 'Placard' },
            { id: 'courses', icon: ShoppingBag, label: 'Courses' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                activeTab === item.id ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <item.icon size={22} className={activeTab === item.id ? 'stroke-[2.5px]' : 'stroke-2'} />
              <span className="text-[11px]">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

    </div>
  );
}
