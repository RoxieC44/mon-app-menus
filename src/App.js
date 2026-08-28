import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // Ajuste le chemin de ton client supabase si besoin
import { 
  Calendar, List, Package, ShoppingBag, Plus, Sparkles, 
  Trash2, Edit3, Eye, Check, X, ChevronRight, Sun, Info 
} from 'lucide-react';

// Fonction utilitaire pour déterminer la saison actuelle
const getCurrentSeason = () => {
  const month = new Date().getMonth() + 1; // 1 à 12
  if (month >= 3 && month <= 5) return 'Printemps';
  if (month >= 6 && month <= 8) return 'Été';
  if (month >= 9 && month <= 11) return 'Automne';
  return 'Hiver';
};

const DEFAULT_RECIPES = [];

export default function App() {
  const currentSeason = getCurrentSeason();
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState(DEFAULT_RECIPES);
  const [menu, setMenu] = useState({
    mondayDinner: '', tuesdayDinner: '', wednesdayDinner: '', thursdayDinner: '', fridayDinner: '', saturdayDinner: '', sundayDinner: '',
    mondayLunch: 'restes', tuesdayLunch: 'restes', wednesdayLunch: '', thursdayLunch: 'restes', fridayLunch: 'restes', saturdayLunch: 'restes', sundayLunch: 'restes'
  });
  const [inventory, setInventory] = useState([
    { name: 'Sel', status: 'Plein' },
    { name: 'Poivre', status: 'Plein' },
    { name: 'Huile d\'olive', status: 'Plein' },
    { name: 'Beurre', status: 'Entamé' },
    { name: 'Pâtes', status: 'Entamé' },
    { name: 'Riz', status: 'Presque vide' },
    { name: 'Oignons', status: 'Plein' },
    { name: 'Ail', status: 'Plein' }
  ]);
  const [bakingItems, setBakingItems] = useState(['', '']);
  const [shoppingChecks, setShoppingChecks] = useState({});

  const [activeTab, setActiveTab] = useState('menu');
  const [viewingRecipe, setViewingRecipe] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null);

  // Charger les données depuis Supabase au démarrage
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const { data } = await supabase
        .from('stockage_donnees')
        .select('data')
        .eq('user_key', 'ma_famille')
        .maybeSingle();

      if (data && data.data) {
        if (data.data.recipes) setRecipes(data.data.recipes);
        if (data.data.menu) setMenu(data.data.menu);
        if (data.data.inventory) setInventory(data.data.inventory);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  // Sauvegarder les données dans Supabase
  const saveData = async (newRecipes, newMenu, newInventory) => {
    setRecipes(newRecipes);
    setMenu(newMenu);
    setInventory(newInventory);

    await supabase
      .from('stockage_donnees')
      .upsert({
        user_key: 'ma_famille',
        data: { recipes: newRecipes, menu: newMenu, inventory: newInventory }
      }, { onConflict: 'user_key' });
  };

  const updateMenu = (dayKey, value) => {
    const newMenu = { ...menu, [dayKey]: value };
    saveData(recipes, newMenu, inventory);
  };

  const addRecipe = (recipeData) => {
    const newRecipe = { ...recipeData, id: Date.now().toString() };
    const newRecipes = [...recipes, newRecipe];
    saveData(newRecipes, menu, inventory);
    setActiveTab('menu');
  };

  const updateRecipe = (recipeData) => {
    const newRecipes = recipes.map(r => r.id === recipeData.id ? recipeData : r);
    saveData(newRecipes, menu, inventory);
    setEditingRecipe(null);
    setActiveTab('menu');
  };

  const deleteRecipe = (id) => {
    const newRecipes = recipes.filter(r => r.id !== id);
    saveData(newRecipes, menu, inventory);
  };

  const mealRecipes = recipes.filter(r => !r.isBaking);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-24">
      <header className="bg-indigo-600 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-lg font-bold flex items-center gap-2">
          <span>🍽️ Mes Menus de Famille</span>
        </h1>
        <div className="flex items-center gap-3">
          <div className="text-xs bg-indigo-700 py-1.5 px-3 rounded-full flex items-center gap-1">
            <Sun className="w-3.5 h-3.5" />
            <span>Saison : {currentSeason}</span>
          </div>
          <div className="text-xs bg-indigo-700 py-1.5 px-3 rounded-full hidden md:flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            <span>{recipes.length} recettes</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 mt-2">
        {activeTab === 'menu' && (
          <MenuContainer
            menu={menu}
            updateMenu={updateMenu}
            recipes={recipes}
            mealRecipes={mealRecipes}
            setMenu={setMenu}
            deleteRecipe={deleteRecipe}
            setViewingRecipe={setViewingRecipe}
            setEditingRecipe={setEditingRecipe}
            setActiveTab={setActiveTab}
            currentSeason={currentSeason}
          />
        )}
        {activeTab === 'baking' && (
          <BakingPlanner
            menu={menu}
            bakingItems={bakingItems}
            setBakingItems={setBakingItems}
          />
        )}
        {activeTab === 'add' && (
          <AddRecipeForm
            addRecipe={addRecipe}
            editingRecipe={editingRecipe}
            updateRecipe={updateRecipe}
            setEditingRecipe={setEditingRecipe}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === 'inventory' && (
          <InventoryManager inventory={inventory} setInventory={setInventory} />
        )}
        {activeTab === 'shopping' && (
          <ShoppingListView
            menu={menu}
            recipes={recipes}
            inventory={inventory}
            bakingItems={bakingItems}
            shoppingChecks={shoppingChecks}
            setShoppingChecks={setShoppingChecks}
          />
        )}
      </main>

      {viewingRecipe && (
        <RecipeModal recipe={viewingRecipe} onClose={() => setViewingRecipe(null)} />
      )}

      {/* NAVIGATION FIXÉE EN BAS */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 px-4 py-2 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
        <div className="max-w-md mx-auto flex justify-between items-center relative">
          <NavButton active={activeTab === 'menu'} onClick={() => setActiveTab('menu')} icon={<Calendar />} label="Menus" />
          <NavButton active={activeTab === 'baking'} onClick={() => setActiveTab('baking')} icon={<Sparkles />} label="Gâteaux" />
          
          {/* GROS BOUTON "+" DU MILIEU */}
          <button
            onClick={() => { setEditingRecipe(null); setActiveTab('add'); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transform -translate-y-4 transition-transform hover:scale-105"
          >
            <Plus size={26} />
          </button>

          <NavButton active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} icon={<Package />} label="Placard" />
          <NavButton active={activeTab === 'shopping'} onClick={() => setActiveTab('shopping')} icon={<ShoppingBag />} label="Courses" />
        </div>
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-2 min-w-[70px] flex-shrink-0 md:w-auto md:flex-row md:px-5 md:py-3 md:rounded-xl md:shadow-sm transition-all ${
        active ? 'text-indigo-600 md:bg-indigo-600 md:text-white scale-105 md:scale-100 font-semibold' : 'text-slate-400 hover:text-slate-600 md:bg-white'
      }`}
    >
      <div className="w-5 h-5 flex items-center justify-center">{icon}</div>
      <span className="text-[10px] md:text-sm font-medium">{label}</span>
    </button>
  );
}

function MenuContainer({ menu, updateMenu, recipes, mealRecipes, setMenu, deleteRecipe, setEditingRecipe, setViewingRecipe, setActiveTab, currentSeason }) {
  const [subTab, setSubTab] = useState('planning');

  return (
    <div className="space-y-6">
      <div className="flex bg-slate-200/70 p-1 rounded-xl max-w-md mx-auto">
        <button
          onClick={() => setSubTab('planning')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            subTab === 'planning' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" /> Choix de la semaine
        </button>
        <button
          onClick={() => setSubTab('catalog')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            subTab === 'catalog' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <List className="w-4 h-4" /> Catalogue Repas ({mealRecipes.length})
        </button>
      </div>

      {subTab === 'planning' ? (
        <MenuPlanner
          menu={menu}
          updateMenu={updateMenu}
          recipes={recipes}
          setMenu={setMenu}
          setViewingRecipe={setViewingRecipe}
          setEditingRecipe={setEditingRecipe}
          setActiveTab={setActiveTab}
          currentSeason={currentSeason}
        />
      ) : (
        <RecipeList
          recipes={mealRecipes}
          menu={menu}
          deleteRecipe={deleteRecipe}
          setViewingRecipe={setViewingRecipe}
          setEditingRecipe={setEditingRecipe}
          setActiveTab={setActiveTab}
          title="Toutes les recettes de repas"
        />
      )}
    </div>
  );
}

function MenuPlanner({ menu, updateMenu, recipes, setMenu, setViewingRecipe, setEditingRecipe, setActiveTab, currentSeason }) {
  const daysConfig = [
    { key: 'monday', label: 'Lundi', reqCarb: 'Blé' },
    { key: 'tuesday', label: 'Mardi', reqCarb: 'Semoule' },
    { key: 'wednesday', label: 'Mercredi', reqCarb: '' },
    { key: 'thursday', label: 'Jeudi', reqCarb: 'Riz' },
    { key: 'friday', label: 'Vendredi', reqCarb: 'Pommes de terre' },
    { key: 'saturday', label: 'Samedi', reqCarb: 'Plaisir' },
    { key: 'sunday', label: 'Dimanche', reqCarb: 'Pâtes' },
  ];

  const getEligibleRecipes = (reqCarb) => {
    return recipes.filter(r => {
      const matchCarb = reqCarb ? r.carb === reqCarb : true;
      if (!matchCarb) return false;
      
      const recipeSeasons = Array.isArray(r.season) ? r.season : (r.season ? [r.season] : []);
      if (recipeSeasons.length === 0) return true; // Par défaut si non renseigné
      
      return recipeSeasons.includes('Toutes') || recipeSeasons.includes(currentSeason);
    });
  };

  const generateSmartMenu = () => {
    let newMenu = { ...menu };
    daysConfig.forEach(day => {
      if (day.key === 'wednesday') return;
      const dinnerKey = `${day.key}Dinner`;
      let possibleRecipes = getEligibleRecipes(day.reqCarb);
      if (possibleRecipes.length === 0) {
        possibleRecipes = recipes.filter(r => r.carb === day.reqCarb);
      }
      if (possibleRecipes.length > 0) {
        const picked = possibleRecipes[Math.floor(Math.random() * possibleRecipes.length)];
        newMenu[dinnerKey] = picked.id;
      }
    });
    setMenu(newMenu);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" /> Générateur Intelligent
            </h2>
            <p className="text-xs text-slate-500">Remplissage automatique basé sur la saison actuelle et les féculents.</p>
          </div>
          <button
            onClick={generateSmartMenu}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Générer la semaine
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {daysConfig.map((day) => {
          const dinnerKey = `${day.key}Dinner`;
          const lunchKey = `${day.key}Lunch`;
          const currentDinnerId = menu[dinnerKey];
          const selectedRecipe = recipes.find(r => r.id === currentDinnerId);
          const eligible = getEligibleRecipes(day.reqCarb);

          return (
            <div key={day.key} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-indigo-900 bg-indigo-50 px-3 py-1 rounded-lg">
                  {day.label} {day.reqCarb && <span className="text-xs font-normal text-indigo-600">({day.reqCarb})</span>}
                </span>
                <select
                  value={menu[lunchKey]}
                  onChange={(e) => updateMenu(lunchKey, e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-600"
                >
                  <MidiOptions />
                </select>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={currentDinnerId}
                  onChange={(e) => updateMenu(dinnerKey, e.target.value)}
                  className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">-- Choisir un repas du soir --</option>
                  {eligible.map(r => (
                    <option key={r.id} value={r.id}>{r.title} ({r.appliance || 'Classique'})</label>
                  ))}
                </select>

                {selectedRecipe && (
                  <button
                    onClick={() => setViewingRecipe(selectedRecipe)}
                    className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                    title="Voir la recette"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MidiOptions() {
  return (
    <>
      <option value="restes">Midi : Restes</option>
      <option value="rapide">Midi : Rapide / Sur le pouce</option>
      <option value="exterieur">Midi : Extérieur</option>
      <option value="">Midi : Rien de défini</option>
    </>
  );
}

function RecipeList({ recipes, deleteRecipe, setViewingRecipe, setEditingRecipe, setActiveTab, title }) {
  const [search, setSearch] = useState('');

  const filtered = recipes.filter(r => r.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-slate-800">{title}</h2>
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map(r => (
          <div key={r.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex justify-between items-start">
            <div>
              <h3 className="font-bold text-sm text-slate-800">{r.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">Féculent : {r.carb || 'Aucun'} | Appareil : {r.appliance || 'Aucun'}</p>
              <div className="flex gap-1 mt-2 flex-wrap">
                {Array.isArray(r.season) ? r.season.map(s => (
                  <span key={s} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{s}</span>
                )) : (
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{r.season}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setViewingRecipe(r)} className="p-1.5 text-slate-400 hover:text-indigo-600 rounded"><Eye className="w-4 h-4" /></button>
              <button onClick={() => { setEditingRecipe(r); setActiveTab('add'); }} className="p-1.5 text-slate-400 hover:text-amber-600 rounded"><Edit3 className="w-4 h-4" /></button>
              <button onClick={() => deleteRecipe(r.id)} className="p-1.5 text-slate-400 hover:text-rose-600 rounded"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddRecipeForm({ addRecipe, editingRecipe, updateRecipe, setEditingRecipe, setActiveTab }) {
  const [formData, setFormData] = useState(editingRecipe || {
    title: '',
    carb: 'Blé',
    appliance: 'Thermomix',
    season: ['Printemps'],
    ingredients: '',
    steps: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingRecipe) {
      updateRecipe(formData);
    } else {
      addRecipe(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4 max-w-lg mx-auto">
      <h2 className="font-bold text-slate-800 text-base">{editingRecipe ? 'Modifier la recette' : 'Ajouter une recette'}</h2>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Titre de la recette</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="ex: Gratin de courgettes"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Féculent</label>
          <select
            value={formData.carb}
            onChange={(e) => setFormData({ ...formData, carb: e.target.value })}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none"
          >
            <option value="Blé">Blé</option>
            <option value="Semoule">Semoule</option>
            <option value="Riz">Riz</option>
            <option value="Pommes de terre">Pommes de terre</option>
            <option value="Pâtes">Pâtes</option>
            <option value="Plaisir">Plaisir</option>
            <option value="">Aucun / Autre</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Appareil</label>
          <select
            value={formData.appliance}
            onChange={(e) => setFormData({ ...formData, appliance: e.target.value })}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none"
          >
            <option value="Thermomix">Thermomix</option>
            <option value="Cookeo">Cookeo</option>
            <option value="Ninja Air Fryer">Ninja Air Fryer</option>
            <option value="Guy Demarle">Guy Demarle</option>
            <option value="Classique">Classique / Four</option>
          </select>
        </div>
      </div>

      {/* SÉLECTION DES SAISONS EN BOUTONS MULTIPLES */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Saison(s)</label>
        <div className="flex flex-wrap gap-2">
          {['Printemps', 'Été', 'Automne', 'Hiver', 'Toutes'].map((s) => {
            const recipeSeasons = Array.isArray(formData.season) ? formData.season : (formData.season ? [formData.season] : []);
            const isSelected = recipeSeasons.includes(s);

            return (
              <button
                key={s}
                type="button"
                onClick={() => {
                  let updatedSeasons = [...recipeSeasons];
                  if (isSelected) {
                    updatedSeasons = updatedSeasons.filter(item => item !== s);
                  } else {
                    updatedSeasons.push(s);
                  }
                  setFormData({ ...formData, season: updatedSeasons });
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  isSelected 
                    ? 'bg-indigo-600 text-white border-indigo-600' 
                    : 'bg-slate-50 text-slate-600 border-slate-300 hover:bg-slate-100'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Ingrédients</label>
        <textarea
          rows={3}
          value={formData.ingredients}
          onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none"
          placeholder="Liste des ingrédients..."
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Étapes de préparation</label>
        <textarea
          rows={3}
          value={formData.steps}
          onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none"
          placeholder="Étapes..."
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors"
        >
          {editingRecipe ? 'Enregistrer les modifications' : 'Ajouter la recette'}
        </button>
        <button
          type="button"
          onClick={() => { setEditingRecipe(null); setActiveTab('menu'); }}
          className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold py-2.5 rounded-xl transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

function RecipeModal({ recipe, onClose }) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-base text-slate-800">{recipe.title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{recipe.appliance || 'Classique'} • {recipe.carb || 'Sans féculent'}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <div>
          <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">Ingrédients</h4>
          <p className="text-xs text-slate-700 whitespace-pre-line bg-slate-50 p-3 rounded-xl border border-slate-100">{recipe.ingredients || 'Aucun ingrédient renseigné.'}</p>
        </div>

        <div>
          <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">Préparation</h4>
          <p className="text-xs text-slate-700 whitespace-pre-line bg-slate-50 p-3 rounded-xl border border-slate-100">{recipe.steps || 'Aucune étape renseignée.'}</p>
        </div>

        <button onClick={onClose} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 rounded-xl transition-colors">
          Fermer
        </button>
      </div>
    </div>
  );
}

function BakingPlanner({ menu, bakingItems, setBakingItems }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4 max-w-lg mx-auto">
      <h2 className="font-bold text-slate-800 text-base flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-indigo-600" /> Planificateur de Gâteaux & Pâtisseries
      </h2>
      <p className="text-xs text-slate-500">Prépare tes idées de douceurs pour la semaine.</p>
      
      <div className="space-y-2">
        {bakingItems.map((item, idx) => (
          <input
            key={idx}
            type="text"
            value={item}
            onChange={(e) => {
              const newItems = [...bakingItems];
              newItems[idx] = e.target.value;
              setBakingItems(newItems);
            }}
            placeholder={`Idée pâtisserie ${idx + 1}`}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        ))}
      </div>
      <button
        onClick={() => setBakingItems([...bakingItems, ''])}
        className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold text-xs py-2.5 rounded-xl transition-colors"
      >
        + Ajouter une ligne
      </button>
    </div>
  );
}

function InventoryManager({ inventory, setInventory }) {
  const [newItem, setNewItem] = useState('');

  const addInventoryItem = (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    setInventory([...inventory, { name: newItem, status: 'Plein' }]);
    setNewItem('');
  };

  const updateStatus = (index, status) => {
    const updated = [...inventory];
    updated[index].status = status;
    setInventory(updated);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4 max-w-lg mx-auto">
      <h2 className="font-bold text-slate-800 text-base">Gestion du Placard</h2>
      
      <form onSubmit={addInventoryItem} className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Ajouter un article..."
          className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none"
        />
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-semibold">Ajouter</button>
      </form>

      <div className="space-y-2">
        {inventory.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-xs font-medium text-slate-800">{item.name}</span>
            <select
              value={item.status}
              onChange={(e) => updateStatus(idx, e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-600"
            >
              <option value="Plein">Plein</option>
              <option value="Entamé">Entamé</option>
              <option value="Presque vide">Presque vide</option>
              <option value="Vide">Vide</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShoppingListView({ menu, recipes, inventory, bakingItems, shoppingChecks, setShoppingChecks }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4 max-w-lg mx-auto">
      <h2 className="font-bold text-slate-800 text-base">Liste de Courses</h2>
      <p className="text-xs text-slate-500">Aperçu rapide basé sur vos placards et vos menus.</p>
      
      <div className="space-y-2">
        {inventory.filter(i => i.status === 'Vide' || i.status === 'Presque vide').map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 text-xs bg-rose-50 text-rose-800 p-3 rounded-xl border border-rose-100">
            <span className="font-bold">⚠️ À racheter :</span> {item.name} ({item.status})
          </div>
        ))}
        {inventory.filter(i => i.status === 'Vide' || i.status === 'Presque vide').length === 0 && (
          <p className="text-xs text-slate-400 italic">Aucun article critique dans le placard.</p>
        )}
      </div>
    </div>
  );
}

  const rawList = Object.keys(ingredientMap);

  const getStockStatus = (ingName) => {
    const found = inventory.find(i => ingName.toLowerCase().includes(i.name.toLowerCase()));
    if (!found) return { status: 'A acheter', color: 'text-indigo-600 bg-indigo-50 border-indigo-200' };
    if (found.status === 'Plein') return { status: 'En stock (Plein)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (found.status === 'Entamé') return { status: 'En stock (Entamé - Attention quantité)', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { status: 'Presque vide (A racheter)', color: 'text-red-700 bg-red-50 border-red-200' };
  };

  const toggleCheck = (ing) => {
    setShoppingChecks({ ...shoppingChecks, [ing]: !shoppingChecks[ing] });
  };

  const copyListText = () => {
    const text = rawList.map(i => `- [ ] ${i} (${getStockStatus(i).status})`).join('\n');
    navigator.clipboard.writeText(`Liste de courses :\n${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 max-w-2xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-600" /> Liste de Courses Intelligente
          </h2>
          <p className="text-xs text-slate-500">Basée sur les menus et les gâteaux de la semaine.</p>
        </div>
        {rawList.length > 0 && (
          <button 
            onClick={copyListText}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copié !' : 'Copier la liste'}
          </button>
        )}
      </div>

      {rawList.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <p className="text-slate-500 text-sm mb-2">Aucun menu ou gâteau planifié pour l'instant.</p>
          <button 
            onClick={() => setActiveTab('menu')}
            className="text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors"
          >
            Aller planifier le menu
          </button>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
          {rawList.map((ing, idx) => {
            const stock = getStockStatus(ing);
            const isChecked = !!shoppingChecks[ing];

            return (
              <div 
                key={idx} 
                onClick={() => toggleCheck(ing)}
                className={`flex items-center justify-between p-3.5 cursor-pointer transition-colors
                  ${isChecked ? 'bg-slate-50 opacity-60 line-through' : 'bg-white hover:bg-slate-50'}
                `}
              >
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={isChecked} 
                    onChange={() => {}} 
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <span className="font-medium text-slate-800 text-sm capitalize">{ing}</span>
                </div>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border ${stock.color}`}>
                  {stock.status}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RecipeModal({ recipe, onClose }) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 p-2 rounded-full text-slate-600 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md border border-indigo-100">
              {recipe.category === 'gateau' ? '🍰 Gâteau' : recipe.carb}
            </span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-medium">
              {recipe.equipment}
            </span>
            <span className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md font-medium">
              {recipe.season}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">{recipe.name}</h2>
        </div>

        {recipe.image && (
          <div className="w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center">
            <img src={recipe.image} alt={recipe.name} className="w-full h-auto max-h-[350px] object-contain" />
          </div>
        )}

        {recipe.url && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-indigo-900 text-sm">Recette sur le web</h4>
              <p className="text-xs text-indigo-700 truncate max-w-[250px]">{recipe.url}</p>
            </div>
            <a 
              href={recipe.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <LinkIcon className="w-3.5 h-3.5" /> Ouvrir le lien
            </a>
          </div>
        )}

        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Ingrédients</h3>
            <ul className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-1.5">
              {recipe.ingredients.map((ing, idx) => (
                <li key={idx} className="text-sm text-slate-800 flex items-center gap-2 list-none">
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full inline-block mr-2"></span>
                  {ing}
                </li>
              ))}
            </ul>
          </div>
        )}

        {recipe.instructions && (
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Préparation</h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-200 whitespace-pre-line">
              {recipe.instructions}
            </p>
          </div>
        )}

        <button 
          onClick={onClose}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 rounded-xl transition-colors text-sm"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}





