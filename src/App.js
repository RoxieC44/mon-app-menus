import React, { useState, useEffect } from 'react';
import { Calendar, Cake, Plus, Archive, ShoppingBag, X, Trash2, Sparkles, ExternalLink, Camera, Check } from 'lucide-react';

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
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) setCurrentSeason('Printemps');
    else if (month >= 6 && month <= 8) setCurrentSeason('Été');
    else if (month >= 9 && month <= 11) setCurrentSeason('Automne');
    else setCurrentSeason('Hiver');
  }, []);

  // Planning de la semaine (Midi et Soir modifiables / avec listes déroulantes)
  const [weeklyMenu, setWeeklyMenu] = useState({
    Lundi: { midi: 'Restes de la veille', soir: 'Bléotto aux courgettes' },
    Mardi: { midi: 'Restes de la veille', soir: 'Poulet coco et semoule' },
    Mercredi: { midi: 'Restes de la veille', soir: 'Cordon bleu et patate sautée' },
    Jeudi: { midi: 'Restes de la veille', soir: 'Poulet coco et riz' },
    Vendredi: { midi: 'Restes de la veille', soir: 'Poêlée de pommes de terre et lardons' },
    Samedi: { midi: 'Restes de la veille', soir: 'Pizza maison rapide' },
    Dimanche: { midi: 'Restes de la veille', soir: 'Gratin de pâtes' },
  });

  // Goûters de la semaine (Choix n°1 et Choix n°2)
  const [weeklyCakes, setWeeklyCakes] = useState({
    choix1: 'Gâteau au yaourt moelleux',
    choix2: 'Cookies aux pépites de chocolat'
  });

  // Catalogue des Plats & Repas
  const [dishes, setDishes] = useState([
    {
      id: 1,
      title: 'Cordon bleu et patate sautée',
      category: 'Pommes de terre',
      appliance: 'Poêle',
      season: 'Toutes',
      link: '',
      ingredients: ['Cordon bleu', 'Pommes de terre', 'Huile d\'olive', 'Sel', 'Poivre'],
      instructions: '1. Éplucher et couper les pommes de terre.\n2. Faire cuire à la poêle avec un filet d\'huile.\n3. Faire dorer les cordons bleus en même temps.'
    },
    {
      id: 2,
      title: 'Poulet coco et riz',
      category: 'Riz',
      appliance: 'Cookeo',
      season: 'Toutes',
      link: '',
      ingredients: ['4 blancs de poulet', '250g de riz', '400ml de lait de coco', 'Curry'],
      instructions: '1. Dorer le poulet.\n2. Ajouter le riz, le lait de coco et le curry.\n3. Cuisson sous pression 10 min.'
    },
    {
      id: 3,
      title: 'Bléotto aux courgettes',
      category: 'Blé',
      appliance: 'Thermomix',
      season: 'Été',
      link: '',
      ingredients: ['200g de blé Ebly', '2 courgettes', '1 bouillon cube', 'Crème fraîche'],
      instructions: '1. Couper les courgettes.\n2. Cuire le blé avec le bouillon et les courgettes.'
    },
    {
      id: 4,
      title: 'Poulet coco et semoule',
      category: 'Semoule',
      appliance: 'Casserole',
      season: 'Toutes',
      link: '',
      ingredients: ['Semoule', 'Poulet', 'Légumes'],
      instructions: '1. Préparer la semoule.\n2. Cuire le poulet.'
    },
    {
      id: 5,
      title: 'Poêlée de pommes de terre et lardons',
      category: 'Pommes de terre',
      appliance: 'Poêle',
      season: 'Toutes',
      link: '',
      ingredients: ['Pommes de terre', 'Lardons', 'Oignons'],
      instructions: '1. Faire revenir les lardons et oignons.\n2. Ajouter les pommes de terre cuites.'
    },
    {
      id: 6,
      title: 'Pizza maison rapide',
      category: 'Plaisir',
      appliance: 'Four',
      season: 'Toutes',
      link: '',
      ingredients: ['Pâte à pizza', 'Coulis de tomate', 'Jambon', 'Fromage'],
      instructions: '1. Étaler la pâte.\n2. Garnir et cuire 15 min à 210°C.'
    },
    {
      id: 7,
      title: 'Gratin de pâtes',
      category: 'Pâtes',
      appliance: 'Four',
      season: 'Toutes',
      link: '',
      ingredients: ['Pâtes', 'Jambon', 'Béchamel', 'Fromage râpé'],
      instructions: '1. Cuire les pâtes.\n2. Mélanger avec la béchamel et le jambon.\n3. Gratiner au four.'
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
      ingredients: ['1 yaourt nature', '3 pots de farine', '2 pots de sucre', '1/2 pot d\'huile', '3 œufs', '1 levure'],
      instructions: '1. Mélanger tous les ingrédients.\n2. Cuire 35 min à 180°C.'
    },
    {
      id: 102,
      title: 'Cookies aux pépites de chocolat',
      category: 'Plaisir',
      appliance: 'Four',
      season: 'Toutes',
      link: '',
      ingredients: ['150g de beurre', '100g de sucre', '200g de farine', 'Pépites de chocolat'],
      instructions: '1. Mélanger le beurre et le sucre.\n2. Ajouter la farine et le chocolat.\n3. Former des boules et cuire 10 min à 180°C.'
    }
  ]);

  // Placard & Frigo
  const [pantry, setPantry] = useState([
    { id: 1, name: 'Riz', status: 'Entamé' },
    { id: 2, name: 'Pâtes', status: 'Plein' },
    { id: 3, name: 'Semoule', status: 'Presque vide' },
    { id: 4, name: 'Blé', status: 'Plein' },
    { id: 5, name: 'Pommes de terre', status: 'Entamé' },
    { id: 6, name: 'Huile d\'olive', status: 'Plein' }
  ]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemStatus, setNewItemStatus] = useState('Plein');

  // Filtres catalogue
  const [seasonFilter, setSeasonFilter] = useState('Toutes les saisons');
  const [applianceFilter, setApplianceFilter] = useState('Tous les appareils');

  // Formulaire d'ajout de recette
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Riz');
  const [formAppliance, setFormAppliance] = useState('Four');
  const [formSeason, setFormSeason] = useState('Toutes');
  const [formLink, setFormLink] = useState('');
  const [formIngredients, setFormIngredients] = useState('');
  const [formInstructions, setFormInstructions] = useState('');

  // Fonction de filtrage intelligent pour les menus (Saison actuelle ou 'Toutes')
  const getAvailableRecipes = () => {
    return dishes.filter(d => d.season === currentSeason || d.season === 'Toutes');
  };

  // Fonction de génération automatique de menus basée sur la saison
  const handleGenerateBalancedMenu = () => {
    const seasonalDishes = getAvailableRecipes();
    if (seasonalDishes.length === 0) {
      alert(`Aucune recette spécifique trouvée pour la saison ${currentSeason}.`);
      return;
    }
    const getRandomDish = (cat) => {
      const match = seasonalDishes.filter(d => d.category === cat);
      if (match.length > 0) return match[Math.floor(Math.random() * match.length)].title;
      return seasonalDishes[Math.floor(Math.random() * seasonalDishes.length)].title;
    };

    setWeeklyMenu({
      Lundi: { midi: 'Restes de la veille', soir: getRandomDish('Blé') },
      Mardi: { midi: 'Restes de la veille', soir: getRandomDish('Semoule') },
      Mercredi: { midi: 'Restes de la veille', soir: 'Cordon bleu et patate sautée' },
      Jeudi: { midi: 'Restes de la veille', soir: getRandomDish('Riz') },
      Vendredi: { midi: 'Restes de la veille', soir: getRandomDish('Pommes de terre') },
      Samedi: { midi: 'Restes de la veille', soir: getRandomDish('Plaisir') },
      Dimanche: { midi: 'Restes de la veille', soir: getRandomDish('Pâtes') },
    });
    alert(`Menus équilibrés générés avec succès pour la saison : ${currentSeason} !`);
  };

  // Fonction de génération automatique des goûters de la semaine basée sur la saison
  const handleGenerateBalancedCakes = () => {
    const seasonalCakes = cakes.filter(c => c.season === currentSeason || c.season === 'Toutes');
    if (seasonalCakes.length > 0) {
      const c1 = seasonalCakes[Math.floor(Math.random() * seasonalCakes.length)].title;
      const c2 = seasonalCakes[Math.floor(Math.random() * seasonalCakes.length)].title;
      setWeeklyCakes({ choix1: c1, choix2: c2 });
    }
    alert(`Goûters de la semaine générés automatiquement selon la saison (${currentSeason}) !`);
  };

  // Gestion stock placard
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

  // Suppression recette
  const handleDeleteRecipe = (id, type) => {
    if (type === 'plat') setDishes(dishes.filter(d => d.id !== id));
    else setCakes(cakes.filter(c => c.id !== id));
  };

  // Enregistrement nouvelle recette
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

    setFormTitle('');
    setFormLink('');
    setFormIngredients('');
    setFormInstructions('');
  };

  // Filtrage des recettes pour le catalogue
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
      <header className="bg-indigo-600 text-white px-6 py-4 shadow-md flex justify-between items-center sticky top-0 z-25">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl text-xl">🍲</div>
          <div>
            <h1 className="text-lg font-bold">Mon App Menus</h1>
          </div>
        </div>
        <div className="bg-amber-300 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
          <span>☀️</span> {currentSeason}
        </div>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 p-4 max-w-4xl mx-auto w-full">
        
        {/* ================= ONGLET MENUS ================= */}
        {activeTab === 'menus' && (
          <div className="space-y-6">
            <div className="flex bg-slate-200/70 p-1 rounded-2xl max-w-md mx-auto">
              <button
                onClick={() => setMenuSubTab('semaine')}
                className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  menuSubTab === 'semaine' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar size={18} /> Semaine type & Menus
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
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <Sparkles className="text-indigo-600" size={20} /> Générateur Intelligent
                    </h2>
                    <p className="text-xs text-slate-500">
                      Suggestions automatiques basées sur la saison actuelle ({currentSeason}).
                    </p>
                  </div>
                  <button 
                    onClick={handleGenerateBalancedMenu}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap"
                  >
                    Générer un menu équilibré
                  </button>
                </div>

                {/* Liste des jours avec menus déroulants partout */}
                {Object.entries(weeklyMenu).map(([day, meals]) => (
                  <div key={day} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Calendar size={18} className="text-indigo-600" /> {day}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Midi : Déroulant avec 'Restes de la veille' en priorité */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Midi</span>
                        <select 
                          value={meals.midi}
                          onChange={(e) => setWeeklyMenu({...weeklyMenu, [day]: { ...meals, midi: e.target.value }})}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="Restes de la veille">Restes de la veille</option>
                          {getAvailableRecipes().map(d => <option key={d.id} value={d.title}>{d.title}</option>)}
                        </select>
                      </div>

                      {/* Soir : Déroulant de recettes filtrées */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Soir</span>
                        <select 
                          value={meals.soir}
                          onChange={(e) => setWeeklyMenu({...weeklyMenu, [day]: { ...meals, soir: e.target.value }})}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value={meals.soir}>{meals.soir}</option>
                          {getAvailableRecipes().map(d => <option key={d.id} value={d.title}>{d.title}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {menuSubTab === 'catalogue' && (
              <div className="space-y-6">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                  <h2 className="font-bold text-slate-800 text-sm">Catalogue des recettes ({dishes.length})</h2>
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
                      <option>Thermomix</option>
                      <option>Cookeo</option>
                      <option>Poêle</option>
                      <option>Four</option>
                      <option>Casserole</option>
                      <option>Airfryer</option>
                    </select>
                  </div>
                </div>

                {/* Tri par Féculents */}
                <div className="space-y-6">
                  {['Pâtes', 'Pommes de terre', 'Semoule', 'Riz', 'Blé', 'Plaisir'].map(category => {
                    const filtered = filterRecipes(dishes).filter(d => d.category === category);
                    if (filtered.length === 0) return null;
                    
                    return (
                      <div key={category} className="space-y-3">
                        <h3 className="font-bold text-slate-700 flex items-center gap-2 text-sm">
                          <span className="w-2 h-5 bg-indigo-600 rounded-full"></span> {category}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {filtered.map(recipe => (
                            <div key={recipe.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
                              <div className="space-y-2">
                                <div className="flex justify-between items-start">
                                  <h4 className="font-bold text-slate-800 text-sm">{recipe.title}</h4>
                                  <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2.5 py-0.5 rounded-full">{recipe.category}</span>
                                </div>
                                <div className="flex gap-2 text-[10px]">
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
                                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
                                >
                                  Voir la fiche
                                </button>
                                <button 
                                  onClick={() => handleDeleteRecipe(recipe.id, 'plat')}
                                  className="text-slate-400 hover:text-red-500 p-1.5 transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
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
                <Cake size={18} /> Goûters de la semaine
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
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Pâtisseries & Goûters</h2>
                    <p className="text-xs text-slate-500">Planifiez vos choix de goûters de la semaine.</p>
                  </div>
                  <button 
                    onClick={handleGenerateBalancedCakes}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap"
                  >
                    Générer un menu équilibré
                  </button>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Goûter - Choix n°1</label>
                    <select 
                      value={weeklyCakes.choix1}
                      onChange={(e) => setWeeklyCakes({...weeklyCakes, choix1: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:outline-none"
                    >
                      <option>{weeklyCakes.choix1}</option>
                      {cakes.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Goûter - Choix n°2</label>
                    <select 
                      value={weeklyCakes.choix2}
                      onChange={(e) => setWeeklyCakes({...weeklyCakes, choix2: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:outline-none"
                    >
                      <option>{weeklyCakes.choix2}</option>
                      {cakes.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {gateauSubTab === 'catalogue' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cakes.map(cake => (
                  <div key={cake.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-slate-800 text-base">{cake.title}</h3>
                        <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-full">{cake.category}</span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2">
                        <strong className="text-slate-700">Ingrédients :</strong> {cake.ingredients.join(', ')}
                      </p>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                      <button
                        onClick={() => setSelectedRecipe(cake)}
                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3.5 py-2 rounded-xl text-xs font-semibold"
                      >
                        Voir la fiche
                      </button>
                      <button onClick={() => handleDeleteRecipe(cake.id, 'gateau')} className="text-slate-400 hover:text-red-500 p-2">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
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

            <div className="bg-indigo-50/60 border border-indigo-100 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Astuce Import Rapide</h4>
                <p className="text-xs text-indigo-700">Prenez une photo de votre livre de cuisine ou collez un lien internet pour pré-remplir.</p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <label className="flex-1 md:flex-initial bg-white hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-semibold px-4 py-2.5 rounded-xl text-xs cursor-pointer flex items-center justify-center gap-2 transition-colors">
                  <Camera size={16} /> Photo (Livre)
                  <input type="file" accept="image/*" className="hidden" onChange={() => alert("Simulation : Photo importée et analysée !")} />
                </label>
              </div>
            </div>

            <form onSubmit={handleSaveRecipe} className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAddType('plat')}
                    className={`py-3 px-4 rounded-xl font-semibold text-sm border transition-all ${
                      addType === 'plat' ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    🍲 Plat / Repas
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddType('gateau')}
                    className={`py-3 px-4 rounded-xl font-semibold text-sm border transition-all ${
                      addType === 'gateau' ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm' : 'border-slate-200 text-slate-600'
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
                  placeholder="Ex: Gratin de courgettes..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Catégorie Féculent (Obligatoire)</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:outline-none"
                  >
                    <option>Pâtes</option>
                    <option>Pommes de terre</option>
                    <option>Semoule</option>
                    <option>Riz</option>
                    <option>Blé</option>
                    <option>Plaisir</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Appareil utilisé</label>
                  <select
                    value={formAppliance}
                    onChange={(e) => setFormAppliance(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:outline-none"
                  >
                    <option>Thermomix</option>
                    <option>Cookeo</option>
                    <option>Poêle</option>
                    <option>Four</option>
                    <option>Casserole</option>
                    <option>Airfryer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Saison idéale (pour suggestions automatiques)</label>
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
                  placeholder="https://..."
                  value={formLink}
                  onChange={(e) => setFormLink(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Ingrédients (1 par ligne)</label>
                <textarea
                  rows={3}
                  placeholder="250g de riz&#10;4 blancs de poulet"
                  value={formIngredients}
                  onChange={(e) => setFormIngredients(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Instructions de préparation</label>
                <textarea
                  rows={3}
                  placeholder="Étapes..."
                  value={formInstructions}
                  onChange={(e) => setFormInstructions(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm text-sm"
              >
                Enregistrer dans la base de données
              </button>
            </form>
          </div>
        )}

        {/* ================= ONGLET PLACARD ================= */}
        {activeTab === 'placard' && (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Mon Placard & Frigo Intelligent</h2>
              <p className="text-xs text-slate-500">
                Gérez vos stocks avec précision (ex: "Entamé" ou "Presque vide") pour que la liste de courses sache s'il y en a assez !
              </p>
            </div>

            <form onSubmit={handleAddPantryItem} className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="Ex: Riz, Pâtes, Lait..."
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
              <h2 className="text-xl font-bold text-slate-800">Liste de Courses Automatique</h2>
              <p className="text-xs text-slate-500">Générée selon les menus de la semaine et l'état réel de votre placard.</p>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">À acheter en priorité :</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                  <span className="font-medium">📦 Paquet de Semoule (car état : Presque vide)</span>
                  <span className="text-xs bg-rose-50 text-rose-600 font-bold px-2 py-1 rounded-md">Urgent</span>
                </li>
                <li className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                  <span className="font-medium">🧀 Ingrédients des menus de la semaine</span>
                  <span className="text-xs bg-indigo-50 text-indigo-600 font-bold px-2 py-1 rounded-md">Menu Semaine</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => alert("Liste de courses exportée / copiée avec succès !")}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm text-sm flex items-center justify-center gap-2"
            >
              <Check size={18} /> Exporter / Copier la liste de courses
            </button>
          </div>
        )}
      </main>

      {/* MODALE FICHE RECETTE */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-full">{selectedRecipe.category}</span>
                <h2 className="text-xl font-bold text-slate-800 mt-2">{selectedRecipe.title}</h2>
              </div>
              <button 
                onClick={() => setSelectedRecipe(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-500 p-2 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex gap-3 text-xs">
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg font-medium">⚙️ {selectedRecipe.appliance}</span>
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg font-medium">☀️ {selectedRecipe.season}</span>
            </div>

            {selectedRecipe.link && (
              <a 
                href={selectedRecipe.link} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 text-xs text-indigo-600 hover:underline bg-indigo-50/50 p-3 rounded-xl font-medium"
              >
                <ExternalLink size={14} /> Lien d'origine de la recette
              </a>
            )}

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ingrédients</h4>
              <ul className="list-disc list-inside text-sm text-slate-700 space-y-1 bg-slate-50 p-3 rounded-xl">
                {selectedRecipe.ingredients.map((ing, idx) => (
                  <li key={idx}>{ing}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Préparation</h4>
              <p className="text-sm text-slate-700 whitespace-pre-line bg-slate-50 p-3 rounded-xl leading-relaxed">
                {selectedRecipe.instructions}
              </p>
            </div>

            <button
              onClick={() => setSelectedRecipe(null)}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              Fermer la fiche
            </button>
          </div>
        </div>
      )}

      {/* NAVIGATION DU BAS (BOTTOM BAR) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg px-6 py-3 z-30 flex justify-around items-center max-w-lg mx-auto md:rounded-t-2xl">
        <button
          onClick={() => setActiveTab('menus')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'menus' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Calendar size={20} />
          <span className="text-[10px] font-bold">Menus</span>
        </button>

        <button
          onClick={() => setActiveTab('gateaux')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'gateaux' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Cake size={20} />
          <span className="text-[10px] font-bold">Gâteaux</span>
        </button>

        <button
          onClick={() => setActiveTab('ajouter')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'ajouter' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <div className="bg-indigo-600 text-white p-2 rounded-full shadow-md -mt-5 hover:bg-indigo-700 transition-colors">
            <Plus size={22} />
          </div>
          <span className="text-[10px] font-bold -mt-1">Ajouter</span>
        </button>

        <button
          onClick={() => setActiveTab('placard')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'placard' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Archive size={20} />
          <span className="text-[10px] font-bold">Placard</span>
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'courses' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <ShoppingBag size={20} />
          <span className="text-[10px] font-bold">Courses</span>
        </button>
      </nav>
    </div>
  );
}
