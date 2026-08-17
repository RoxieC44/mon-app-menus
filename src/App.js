import React, { useState, useEffect } from 'react';
import { Calendar, Cake, Plus, Archive, ShoppingBag, X, Trash2, Sparkles, Utensils, Menu } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('courses');
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

  // Planning de la semaine initialement avec des menus pour tester la liste de courses
  const [weeklyMenu, setWeeklyMenu] = useState({
    Lundi: { midi: '', soir: 'Poulet coco et riz' },
    Mardi: { midi: '', soir: 'Bléotto aux courgettes' },
    Mercredi: { midi: '', soir: 'Cordon bleu et Pomme de terre' },
    Jeudi: { midi: '', soir: '' },
    Vendredi: { midi: '', soir: '' },
    Samedi: { midi: '', soir: '' },
    Dimanche: { midi: '', soir: '' },
  });

  const [weeklyCakes, setWeeklyCakes] = useState({
    choix1: 'Gâteau au yaourt moelleux',
    choix2: ''
  });

  // Catalogue des Plats & Repas
  const [dishes, setDishes] = useState([
    {
      id: 1,
      title: 'Cordon bleu et Pomme de terre',
      category: 'Pommes de terre',
      appliance: 'Poêle',
      season: 'Toutes',
      ingredients: ['Cordon bleu', '800g De Pommes De Terre', 'Huile d\'olive', 'Sel', 'Poivre'],
      instructions: '1. Éplucher et couper les pommes de terre.\n2. Faire cuire à la poêle avec un filet d\'huile.\n3. Faire dorer les cordons bleus en même temps.'
    },
    {
      id: 2,
      title: 'Poulet coco et riz',
      category: 'Riz',
      appliance: 'Cookeo',
      season: 'Toutes',
      ingredients: ['4 blancs de poulet', '400ml De Lait De Coco', 'Curry', '400g De Pâtes'],
      instructions: '1. Dorer le poulet.\n2. Ajouter le riz, le lait de coco et le curry.\n3. Cuisson sous pression 10 min.'
    },
    {
      id: 3,
      title: 'Bléotto aux courgettes',
      category: 'Blé',
      appliance: 'Thermomix',
      season: 'Été',
      ingredients: ['3 Courgettes', '4 Tomates', 'Ail', '1 Pot De Pesto', '250g De Tomates Cerises'],
      instructions: '1. Couper les courgettes.\n2. Cuire le blé avec le bouillon et les courgettes.'
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
      ingredients: ['1 yaourt nature', 'Herbes De Provence', 'Huile d\'olive'],
      instructions: '1. Mélanger tous les ingrédients.\n2. Cuire 35 min à 180°C.'
    }
  ]);

  // Placard & Frigo
  const [pantry, setPantry] = useState([
    { id: 1, name: 'Huile d\'olive', status: 'Plein' },
    { id: 2, name: 'Ail', status: 'Plein' },
    { id: 3, name: '400g De Pâtes', status: 'Entamé' }
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

  // Génération dynamique de la liste de courses basée sur les menus/gâteaux et le placard
  const getSmartShoppingList = () => {
    const itemsMap = new Map();

    // Récupérer tous les ingrédients nécessaires des plats planifiés
    Object.values(weeklyMenu).forEach(meals => {
      [meals.midi, meals.soir].forEach(mealTitle => {
        if (!mealTitle || mealTitle === 'Restes de la veille') return;
        const foundDish = dishes.find(d => d.title === mealTitle);
        if (foundDish) {
          foundDish.ingredients.forEach(ing => {
            const key = ing.trim().toLowerCase();
            itemsMap.set(key, { name: ing.trim() });
          });
        }
      });
    });

    // Récupérer les ingrédients des gâteaux planifiés
    [weeklyCakes.choix1, weeklyCakes.choix2].forEach(cakeTitle => {
      if (!cakeTitle) return;
      const foundCake = cakes.find(c => c.title === cakeTitle);
      if (foundCake) {
        foundCake.ingredients.forEach(ing => {
          const key = ing.trim().toLowerCase();
          itemsMap.set(key, { name: ing.trim() });
        });
      }
    });

    // Convertir en tableau et associer le statut du placard si présent
    const list = [];
    itemsMap.forEach((val, key) => {
      // Chercher correspondance dans le placard
      const pantryMatch = pantry.find(p => p.name.trim().toLowerCase() === key);
      let status = 'A acheter';
      if (pantryMatch) {
        if (pantryMatch.status === 'Plein') status = 'En stock (Plein)';
        else if (pantryMatch.status === 'Entamé') status = 'En stock (Entamé - Attention quantité)';
        else if (pantryMatch.status === 'Presque vide') status = 'A acheter';
      }
      list.push({ id: key, name: val.name, status });
    });

    return list;
  };

  const shoppingList = getSmartShoppingList();
  const hasPlannedItems = shoppingList.length > 0;

  const getAvailableRecipes = () => {
    return dishes.filter(d => d.season === currentSeason || d.season === 'Toutes');
  };

  const getRecipesByCategory = (targetCategory) => {
    const seasonal = getAvailableRecipes();
    let match = seasonal.filter(d => d.category.toLowerCase().includes(targetCategory.toLowerCase()));
    if (match.length === 0) {
      match = dishes.filter(d => d.category.toLowerCase().includes(targetCategory.toLowerCase()));
    }
    return match;
  };

  const handleGenerateBalancedMenu = () => {
    const getRand = (cat) => {
      const list = getRecipesByCategory(cat);
      if (list.length > 0) return list[Math.floor(Math.random() * list.length)].title;
      return '';
    };

    setWeeklyMenu({
      Lundi: { midi: 'Restes de la veille', soir: getRand('Blé') },
      Mardi: { midi: 'Restes de la veille', soir: getRand('Semoule') },
      Mercredi: { midi: 'Restes de la veille', soir: 'Cordon bleu et Pomme de terre' },
      Jeudi: { midi: 'Restes de la veille', soir: getRand('Riz') },
      Vendredi: { midi: 'Restes de la veille', soir: getRand('Pommes de terre') },
      Samedi: { midi: 'Restes de la veille', soir: getRand('Plaisir') },
      Dimanche: { midi: 'Restes de la veille', soir: '' },
    });
  };

  const handleGenerateBalancedCakes = () => {
    const seasonalCakes = cakes.filter(c => c.season === currentSeason || c.season === 'Toutes');
    const pool = seasonalCakes.length > 0 ? seasonalCakes : cakes;
    if (pool.length > 0) {
      const c1 = pool[Math.floor(Math.random() * pool.length)].title;
      const c2 = pool[Math.floor(Math.random() * pool.length)].title;
      setWeeklyCakes({ choix1: c1, choix2: c2 });
    }
  };

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

  const handleDeleteRecipe = (id, type) => {
    if (type === 'plat') setDishes(dishes.filter(d => d.id !== id));
    else setCakes(cakes.filter(c => c.id !== id));
  };

  const handleSaveRecipe = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newRecipe = {
      id: Date.now(),
      title: formTitle,
      category: formCategory,
      appliance: formAppliance,
      season: formSeason,
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

  const filterRecipes = (list) => {
    return list.filter(item => {
      const matchSeason = seasonFilter === 'Toutes les saisons' || item.season === seasonFilter || item.season === 'Toutes';
      const matchAppliance = applianceFilter === 'Tous les appareils' || item.appliance === applianceFilter;
      return matchSeason && matchAppliance;
    });
  };

  const dayBadges = {
    Lundi: 'Blé',
    Mardi: 'Semoule',
    Mercredi: null,
    Jeudi: 'Riz',
    Vendredi: 'Pomme de terre',
    Samedi: 'Plaisir',
    Dimanche: null
  };

  const getDayCategoryFilter = (day) => {
    switch (day) {
      case 'Lundi': return 'Blé';
      case 'Mardi': return 'Semoule';
      case 'Jeudi': return 'Riz';
      case 'Vendredi': return 'Pommes de terre';
      case 'Samedi': return 'Plaisir';
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-24">
      
      {/* HEADER */}
      <header className="bg-indigo-600 text-white px-6 py-4 shadow-md flex justify-between items-center sticky top-0 z-25">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl text-xl flex items-center justify-center">
            <Utensils size={22} />
          </div>
          <div>
            <h1 className="text-lg font-bold">Mon Menu Organisé</h1>
          </div>
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
                <Menu size={18} /> Catalogue repas ({dishes.length})
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
                      Remplit automatiquement chaque jour selon les contraintes strictes ({currentSeason}).
                    </p>
                  </div>
                  <button 
                    onClick={handleGenerateBalancedMenu}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap"
                  >
                    Générer un menu équilibré
                  </button>
                </div>

                {Object.entries(weeklyMenu).map(([day, meals]) => {
                  const isWednesday = day === 'Mercredi';
                  const badgeText = dayBadges[day];
                  const strictCat = getDayCategoryFilter(day);
                  const eveningRecipes = strictCat ? getRecipesByCategory(strictCat) : getAvailableRecipes();

                  return (
                    <div key={day} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 relative">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                          <Calendar size={18} className="text-indigo-600" /> {day}
                        </h3>
                        {badgeText && (
                          <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-md">
                            {badgeText}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Midi</span>
                          <select 
                            value={meals.midi}
                            onChange={(e) => setWeeklyMenu({...weeklyMenu, [day]: { ...meals, midi: e.target.value }})}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="">-- Choisir ou laisser vide --</option>
                            <option value="Restes de la veille">Restes de la veille</option>
                            {getAvailableRecipes().map(d => <option key={d.id} value={d.title}>{d.title}</option>)}
                          </select>
                        </div>

                        <div className={`p-3 rounded-xl border ${isWednesday ? 'bg-slate-100 border-slate-200' : 'bg-slate-50 border-slate-100'}`}>
                          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                            Soir
                          </span>
                          {isWednesday ? (
                            <input 
                              type="text" 
                              disabled 
                              value={meals.soir} 
                              className="w-full bg-slate-200 text-slate-500 border border-slate-300 rounded-lg p-2 text-sm cursor-not-allowed font-medium"
                            />
                          ) : (
                            <select 
                              value={meals.soir}
                              onChange={(e) => setWeeklyMenu({...weeklyMenu, [day]: { ...meals, soir: e.target.value }})}
                              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="">-- Choisir ou laisser vide --</option>
                              {eveningRecipes.map(d => <option key={d.id} value={d.title}>{d.title}</option>)}
                            </select>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {menuSubTab === 'catalogue' && (
              <div className="space-y-6">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                  <h2 className="font-bold text-slate-800 text-sm">Catalogue repas ({dishes.length})</h2>
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
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Pâtisseries</h2>
                    <p className="text-xs text-slate-500">Planifiez vos choix de la semaine.</p>
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
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">choix n° 1</label>
                    <select 
                      value={weeklyCakes.choix1}
                      onChange={(e) => setWeeklyCakes({...weeklyCakes, choix1: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:outline-none"
                    >
                      <option value="">-- Choisir ou laisser vide --</option>
                      {cakes.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">choix n° 2</label>
                    <select 
                      value={weeklyCakes.choix2}
                      onChange={(e) => setWeeklyCakes({...weeklyCakes, choix2: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:outline-none"
                    >
                      <option value="">-- Choisir ou laisser vide --</option>
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
                    🍰 Gâteau
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
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Catégorie Féculent</label>
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
                Listez vos provisions et leur état actuel pour affiner la liste de courses.
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

        {/* ================= ONGLET COURSES (STYLE IDENTIQUE À VOTRE PHOTO) ================= */}
        {activeTab === 'courses' && (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <div className="text-indigo-600">
                <ShoppingBag size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Liste de Courses Intelligente</h2>
                <p className="text-xs text-slate-500">
                  Basée sur les menus et les gâteaux de la semaine.
                </p>
              </div>
            </div>

            {!hasPlannedItems ? (
              <div className="border-2 border-dashed border-indigo-200 bg-indigo-50/30 rounded-2xl p-10 text-center space-y-4">
                <p className="text-sm font-medium text-slate-600">
                  Aucun menu ou gâteau planifié pour l'instant.
                </p>
                <button
                  onClick={() => { setActiveTab('menus'); setMenuSubTab('semaine'); }}
                  className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-sm inline-flex items-center gap-2"
                >
                  Aller planifier le menu
                </button>
              </div>
            ) : (
              <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
                {shoppingList.map((item) => {
                  const isAcheter = item.status === 'A acheter';
                  const isPlein = item.status === 'En stock (Plein)';
                  const isEntame = item.status.includes('Entamé');

                  return (
                    <div key={item.id} className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" 
                        />
                        <span className="font-medium text-slate-800 text-sm">{item.name}</span>
                      </div>
                      <div>
                        {isAcheter && (
                          <span className="bg-blue-50 text-blue-600 border border-blue-200 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm">
                            A acheter
                          </span>
                        )}
                        {isPlein && (
                          <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm">
                            En stock (Plein)
                          </span>
                        )}
                        {isEntame && (
                          <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm">
                            En stock (Entamé - Attention quantité)
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODALE FICHE RECETTE */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
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

      {/* NAVIGATION DU BAS */}
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
