import React, { useState, useEffect } from 'react';
import { Plus, List, Calendar, Trash2, Utensils, Info, Tag, Sun, Settings, Link as LinkIcon, Pencil, Camera, RefreshCw, AlertTriangle, Eye, X, Image as ImageIcon, ShoppingBag, Package, Check, Copy, Sparkles, Filter, Cake } from 'lucide-react';
import { supabase } from './supabaseClient';

const DEFAULT_RECIPES = [];

const INITIAL_EQUIPMENTS = ['Thermomix', 'Cookeo', 'Ninja Double Stack', 'Poêle', 'Four', 'Casserole', 'Airfryer', 'Gaufrier - Croque-Monsieur - Panini', 'Crêpière - Mini woks - Grill', 'Raclette - Pierrade - Fondue', 'Plancha', 'Barbecue', 'Sans Cuisson'];
const INITIAL_CARBS = ['Pâtes', 'Pommes de terre', 'Semoule', 'Riz', 'Blé', 'Plaisir'];
const SEASONS_LIST = ['Printemps', 'Été', 'Automne', 'Hiver'];
const STORAGE_ZONES = ['Placard', 'Frigo', 'Congélateur'];

const getCurrentSeason = () => {
  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();

  if ((month === 2 && day >= 20) || (month > 2 && month < 5) || (month === 5 && day <= 20)) return 'Printemps';
  if ((month === 5 && day >= 21) || (month > 5 && month < 8) || (month === 8 && day <= 21)) return 'Été';
  if ((month === 8 && day >= 22) || (month > 8 && month < 11) || (month === 11 && day <= 20)) return 'Automne';
  return 'Hiver';
};

const recipeMatchesSeason = (seasonValue, targetSeason) => {
  if (targetSeason === 'Tous') return true;
  if (!seasonValue || seasonValue === 'Toutes') return true;
  if (typeof seasonValue !== 'string') return true;
  const seasonsArr = seasonValue.split(',').map(s => s.trim());
  return seasonsArr.includes('Toutes') || seasonsArr.includes(targetSeason);
};

export default function App() {
  const [activeTab, setActiveTab] = useState('menu');
  const [menuSubTab, setMenuSubTab] = useState('planning');
  const [bakingSubTab, setBakingSubTab] = useState('planning');
  const [viewingRecipe, setViewingRecipe] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const currentSeason = getCurrentSeason();

  const [loading, setLoading] = useState(true);

  const [recipes, setRecipes] = useState(DEFAULT_RECIPES);
  const [equipments, setEquipments] = useState(INITIAL_EQUIPMENTS);
  const [carbsList, setCarbsList] = useState(INITIAL_CARBS);
  const [menu, setMenu] = useState({
    mondayDinner: '', tuesdayDinner: '', wednesdayDinner: '', thursdayDinner: '', fridayDinner: '', saturdayDinner: '', sundayDinner: '',
    mondayLunch: 'restes', tuesdayLunch: 'restes', wednesdayLunch: '', thursdayLunch: 'restes', fridayLunch: 'restes', saturdayLunch: '', sundayLunch: ''
  });
  const [inventory, setInventory] = useState([
    { name: 'Sel', status: 'Plein', zone: 'Placard' },
    { name: 'Poivre', status: 'Plein', zone: 'Placard' },
    { name: "Huile d'olive", status: 'Plein', zone: 'Placard' },
    { name: 'Beurre', status: 'Entamé', zone: 'Frigo' },
    { name: 'Pâtes', status: 'Entamé', zone: 'Placard' },
    { name: 'Riz', status: 'Presque vide', zone: 'Placard' },
    { name: 'Oignons', status: 'Plein', zone: 'Placard' },
    { name: 'Ail', status: 'Plein', zone: 'Placard' }
  ]);
  const [bakingItems, setBakingItems] = useState(['', '']);
  const [shoppingChecks, setShoppingChecks] = useState({});

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const { data } = await supabase
        .from('stockage_donnees')
        .select('data')
        .eq('user_key', 'ma_famille')
        .maybeSingle();

      if (data && data.data) {
        const saved = data.data;
        if (saved.recipes) setRecipes(saved.recipes);
        if (saved.equipments && Array.isArray(saved.equipments)) setEquipments(saved.equipments);
        if (saved.carbsList && Array.isArray(saved.carbsList)) setCarbsList(saved.carbsList);
        if (saved.menu) setMenu(saved.menu);
        if (saved.inventory) {
          const migrated = saved.inventory.map(item => ({
            ...item,
            zone: item.zone || 'Placard'
          }));
          setInventory(migrated);
        }
        if (saved.bakingItems) setBakingItems(saved.bakingItems);
        if (saved.shoppingChecks) setShoppingChecks(saved.shoppingChecks);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    if (loading) return;

    async function saveData() {
      const payload = {
        user_key: 'ma_famille',
        data: { recipes, equipments, carbsList, menu, inventory, bakingItems, shoppingChecks }
      };

      const { data: existing } = await supabase
        .from('stockage_donnees')
        .select('id')
        .eq('user_key', 'ma_famille')
        .maybeSingle();

      if (existing) {
        await supabase
          .from('stockage_donnees')
          .update(payload)
          .eq('user_key', 'ma_famille');
      } else {
        await supabase
          .from('stockage_donnees')
          .insert([payload]);
      }
    }

    const timer = setTimeout(saveData, 1000);
    return () => clearTimeout(timer);
  }, [recipes, equipments, carbsList, menu, inventory, bakingItems, shoppingChecks]);

  const addRecipe = (newRecipe) => {
    setRecipes(prev => {
      const exists = prev.some(r => r.id === newRecipe.id);
      if (exists) {
        return prev.map(r => r.id === newRecipe.id ? newRecipe : r);
      }
      return [...prev, { ...newRecipe, id: Date.now().toString() }];
    });
    if (newRecipe.category === 'gateau') {
      setBakingSubTab('list');
      setActiveTab('baking');
    } else {
      setMenuSubTab('catalog');
      setActiveTab('menu');
    }
  };

  const deleteRecipe = (id) => {
    setRecipes(recipes.filter(r => r.id !== id));
    const newMenu = { ...menu };
    Object.keys(newMenu).forEach(day => {
      if (newMenu[day] === id) newMenu[day] = '';
    });
    setMenu(newMenu);
  };

  const updateMenu = (key, value) => {
    setMenu({ ...menu, [key]: value });
  };

  const mealRecipes = recipes.filter(r => r.category !== 'gateau');
  const bakingRecipes = recipes.filter(r => r.category === 'gateau');
  
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-28 relative">
      <header className="bg-indigo-600 text-white p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Utensils className="w-6 h-6" />
            Mon Menu Organisé
          </h1>
          
          <div className="flex items-center gap-2">
            <div className="text-xs bg-amber-400 text-slate-900 font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
              <Sun className="w-3.5 h-3.5" />
              Saison actuelle : {currentSeason}
            </div>
            <div className="text-xs bg-indigo-700 py-1.5 px-3 rounded-full opacity-90 hidden md:flex items-center gap-1">
               <Info className="w-3.5 h-3.5" /> {recipes.length} recettes
            </div>
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
            equipments={equipments}
            setEquipments={setEquipments}
            carbsList={carbsList}
            subTab={menuSubTab}
            setSubTab={setMenuSubTab}
          />
        )}
        {activeTab === 'baking' && (
          <BakingPlanner 
            menu={menu} 
            bakingItems={bakingItems} 
            setBakingItems={setBakingItems} 
            bakingRecipes={bakingRecipes} 
            recipes={recipes}
            deleteRecipe={deleteRecipe}
            setViewingRecipe={setViewingRecipe} 
            setEditingRecipe={setEditingRecipe}
            setActiveTab={setActiveTab}
            currentSeason={currentSeason}
            equipments={equipments}
            setEquipments={setEquipments}
            carbsList={carbsList}
            subTab={bakingSubTab}
            setSubTab={setBakingSubTab}
          />
        )}
        {activeTab === 'add' && <AddRecipeForm addRecipe={addRecipe} editingRecipe={editingRecipe} setEditingRecipe={setEditingRecipe} setActiveTab={setActiveTab} setSelectedImage={setSelectedImage} equipments={equipments} setEquipments={setEquipments} carbsList={carbsList} setCarbsList={setCarbsList} />}
        {activeTab === 'inventory' && <InventoryManager inventory={inventory} setInventory={setInventory} equipments={equipments} setEquipments={setEquipments} carbsList={carbsList} setCarbsList={setCarbsList} />}
        {activeTab === 'shopping' && <ShoppingListView menu={menu} recipes={recipes} inventory={inventory} bakingItems={bakingItems} shoppingChecks={shoppingChecks} setShoppingChecks={setShoppingChecks} setActiveTab={setActiveTab} />}
      </main>

      {viewingRecipe && (
        <RecipeModal recipe={viewingRecipe} onClose={() => setViewingRecipe(null)} setSelectedImage={setSelectedImage} />
      )}

      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)} 
          className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <img 
              src={selectedImage} 
              alt="Agrandissement" 
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
            />
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-75 font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 px-4 py-2 shadow-[0_-10px_25px_-3px_rgb(0,0,0,0.1)]">
        <div className="max-w-md mx-auto flex justify-between items-center relative">
          <NavButton active={activeTab === 'menu'} onClick={() => setActiveTab('menu')} icon={<Calendar />} label="Menus" />
          <NavButton active={activeTab === 'baking'} onClick={() => setActiveTab('baking')} icon={<Cake />} label="Gâteaux" />
          
          <button
            onClick={() => { setEditingRecipe(null); setActiveTab('add'); }}
            className={`bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transform -translate-y-4 transition-transform hover:scale-105 border-4 border-white flex items-center justify-center flex-shrink-0 ${activeTab === 'add' ? 'ring-2 ring-indigo-400 scale-105' : ''}`}
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
      className={`flex flex-col items-center gap-1 p-2 min-w-[70px] flex-shrink-0 transition-all
        ${active ? 'text-indigo-600 scale-105 font-semibold' : 'text-slate-400 hover:text-indigo-500'}`}
    >
      <div className="w-5 h-5 flex items-center justify-center">{icon}</div>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

function MenuContainer({ menu, updateMenu, recipes, mealRecipes, setMenu, deleteRecipe, setEditingRecipe, setActiveTab, setViewingRecipe, currentSeason, equipments, setEquipments, carbsList, subTab, setSubTab }) {
  return (
    <div className="space-y-6">
      <div className="flex bg-slate-200/70 p-1 rounded-xl max-w-md mx-auto">
        <button 
          onClick={() => setSubTab('planning')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2
            ${subTab === 'planning' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}
          `}
        >
          <Calendar className="w-4 h-4" /> Choix de la semaine
        </button>
        <button 
          onClick={() => setSubTab('catalog')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2
            ${subTab === 'catalog' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}
          `}
        >
          <List className="w-4 h-4" /> Catalogue Repas ({mealRecipes.length})
        </button>
      </div>

      {subTab === 'planning' ? (
        <MenuPlanner 
          menu={menu} 
          updateMenu={updateMenu} 
          recipes={mealRecipes} 
          setMenu={setMenu} 
          setEditingRecipe={setEditingRecipe}
          setActiveTab={setActiveTab}
          setViewingRecipe={setViewingRecipe} 
          currentSeason={currentSeason} 
          equipments={equipments}
        />
      ) : (
        <RecipeList 
          recipes={mealRecipes} 
          menu={menu} 
          deleteRecipe={deleteRecipe} 
          setViewingRecipe={setViewingRecipe} 
          setEditingRecipe={setEditingRecipe}
          setActiveTab={setActiveTab}
          currentSeason={currentSeason}
          title="Toutes les recettes de repas"
          equipments={equipments}
          carbsList={carbsList}
        />
      )}
    </div>
  );
}

function MenuPlanner({ menu, updateMenu, recipes, setMenu, setViewingRecipe, setEditingRecipe, setActiveTab, currentSeason, equipments }) {
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
      return recipeMatchesSeason(r.season, currentSeason);
    });
  };

  const equipmentCounts = {};
  Object.values(menu).forEach(val => {
    if (!val || val === 'restes') return;
    const r = recipes.find(x => x.id === val);
    if (r) {
      if (r.equipment) {
        equipmentCounts[r.equipment] = (equipmentCounts[r.equipment] || 0) + 1;
      }
      if (r.additionalEquipment) {
        equipmentCounts[r.additionalEquipment] = (equipmentCounts[r.additionalEquipment] || 0) + 1;
      }
    }
  });

  const generateSmartMenu = () => {
    let newMenu = { ...menu };
    let tempEquipCounts = {};
    
    const eveningDays = [
      { key: 'mondayDinner', reqCarb: 'Blé' },
      { key: 'tuesdayDinner', reqCarb: 'Semoule' },
      { key: 'wednesdayDinner', reqCarb: '' },
      { key: 'thursdayDinner', reqCarb: 'Riz' },
      { key: 'fridayDinner', reqCarb: 'Pommes de terre' },
      { key: 'saturdayDinner', reqCarb: 'Plaisir' },
      { key: 'sundayDinner', reqCarb: 'Pâtes' },
    ];

    eveningDays.forEach(day => {
      if (day.key === 'wednesdayDinner') return;
      let possibleRecipes = getEligibleRecipes(day.reqCarb);
      if (possibleRecipes.length === 0) {
        possibleRecipes = recipes.filter(r => r.carb === day.reqCarb);
      }
      if (possibleRecipes.length === 0) return;

      possibleRecipes.sort((a, b) => {
        const countA = (tempEquipCounts[a.equipment] || 0) + (tempEquipCounts[a.additionalEquipment] || 0);
        const countB = (tempEquipCounts[b.equipment] || 0) + (tempEquipCounts[b.additionalEquipment] || 0);
        return countA - countB;
      });

      const getRecipeCount = (r) => (tempEquipCounts[r.equipment] || 0) + (r.additionalEquipment ? (tempEquipCounts[r.additionalEquipment] || 0) : 0);
      const minUsage = getRecipeCount(possibleRecipes[0]);
      const bestCandidates = possibleRecipes.filter(r => getRecipeCount(r) === minUsage);
      const picked = bestCandidates[Math.floor(Math.random() * bestCandidates.length)];
      
      newMenu[day.key] = picked.id;
      if (picked.equipment) {
        tempEquipCounts[picked.equipment] = (tempEquipCounts[picked.equipment] || 0) + 1;
      }
      if (picked.additionalEquipment) {
        tempEquipCounts[picked.additionalEquipment] = (tempEquipCounts[picked.additionalEquipment] || 0) + 1;
      }
    });

    setMenu(newMenu);
  };

  const hasImbalance = Object.values(equipmentCounts).some(count => count > 2);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Générateur Intelligent
            </h2>
            <p className="text-xs text-slate-500">
              Suggestions automatiques basées sur la saison actuelle ({currentSeason}).
            </p>
          </div>
          <button 
            onClick={generateSmartMenu}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors text-sm shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Générer un menu équilibré
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          {Object.entries(equipmentCounts).length === 0 && <span className="text-sm text-slate-500">Menu vide pour l'instant.</span>}
          {Object.entries(equipmentCounts).map(([equip, count]) => (
            <span key={equip} className={`text-xs px-2.5 py-1 rounded-md font-medium border flex items-center gap-1.5
              ${count > 2 ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-slate-100 border-slate-200 text-slate-700'}
            `}>
              <Settings className="w-3.5 h-3.5" />
              {equip} : {count}x
            </span>
          ))}
        </div>
        {hasImbalance && (
          <p className="text-xs text-orange-600 mt-2 flex items-center gap-1 font-medium">
            <AlertTriangle className="w-4 h-4" /> Attention, vous utilisez le même appareil plus de 2 fois dans la semaine !
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {daysConfig.map(day => (
          <FullDayCard 
            key={day.key}
            day={day}
            menu={menu}
            updateMenu={updateMenu}
            recipes={recipes}
            currentSeason={currentSeason}
            setEditingRecipe={setEditingRecipe}
            setActiveTab={setActiveTab}
            setViewingRecipe={setViewingRecipe}
          />
        ))}
      </div>
    </div>
  );
}

function FullDayCard({ day, menu, updateMenu, recipes, setEditingRecipe, setActiveTab, currentSeason, setViewingRecipe }) {
  const lunchKey = `${day.key}Lunch`;
  const dinnerKey = `${day.key}Dinner`;

  const getAvailableRecipes = (reqCarb) => {
    return recipes.filter(r => {
      const matchCarb = reqCarb ? r.carb === reqCarb : true;
      if (!matchCarb) return false;
      return recipeMatchesSeason(r.season, currentSeason);
    });
  };

  const dinnerRecipes = getAvailableRecipes(day.reqCarb);
  const anyRecipes = recipes.filter(r => recipeMatchesSeason(r.season, currentSeason));

  const lunchVal = menu[lunchKey] || '';
  const dinnerVal = menu[dinnerKey] || '';

  const lunchRecipe = recipes.find(r => r.id === lunchVal);
  const dinnerRecipe = recipes.find(r => r.id === dinnerVal);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            {day.label}
          </h3>
          {day.reqCarb && (
            <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-md font-semibold border border-slate-200">
               {day.reqCarb}
            </span>
          )}
        </div>
        
        <div className="space-y-3">
          <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-200/60 space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500 uppercase">
              <span>Midi</span>
            </div>
            <select
              value={lunchVal}
              onChange={(e) => updateMenu(lunchKey, e.target.value)}
              className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-lg focus:ring-indigo-500 p-2"
            >
              <option value="">-- Choisir le midi --</option>
              <option value="restes">🔁 Restes de la veille</option>
              {anyRecipes.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>

            {lunchRecipe && (
              <div className="flex justify-between items-center pt-1">
                <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                  <Settings className="w-3 h-3 text-slate-400" /> {lunchRecipe.equipment}{lunchRecipe.additionalEquipment ? ` + ${lunchRecipe.additionalEquipment}` : ''}
                </span>
                <button 
                  onClick={() => setViewingRecipe(lunchRecipe)}
                  className="text-[11px] font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded transition-colors flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" /> Voir
                </button>
              </div>
            )}
          </div>

          <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-200/60 space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500 uppercase">
              <span>Soir</span>
            </div>
            {day.key === 'wednesday' ? (
              <div className="w-full bg-slate-100 border border-slate-300 text-slate-800 text-xs rounded-lg p-2 font-medium flex items-center justify-between">
                <span>Gnocchis, saucisses, cordons bleus et pommes de terre</span>
                <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-600">Fixe</span>
              </div>
            ) : dinnerRecipes.length === 0 ? (
              <div className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                Aucune recette de {currentSeason} pour ce féculent.
              </div>
            ) : (
              <select
                value={dinnerVal}
                onChange={(e) => updateMenu(dinnerKey, e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-lg focus:ring-indigo-500 p-2"
              >
                <option value="">-- Choisir le soir --</option>
                {dinnerRecipes.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            )}

            {dinnerRecipe && (
              <div className="flex justify-between items-center pt-1">
                <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                  <Settings className="w-3 h-3 text-slate-400" /> {dinnerRecipe.equipment}{dinnerRecipe.additionalEquipment ? ` + ${dinnerRecipe.additionalEquipment}` : ''}
                </span>
                <button 
                  onClick={() => setViewingRecipe(dinnerRecipe)}
                  className="text-[11px] font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded transition-colors flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" /> Voir
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RecipeList({ recipes, deleteRecipe, setViewingRecipe, setEditingRecipe, setActiveTab, currentSeason, title, equipments, carbsList }) {
  const [filterSeason, setFilterSeason] = useState('Tous');
  const [filterEquip, setFilterEquip] = useState('Tous');
  const [filterCarb, setFilterCarb] = useState('Tous');

  const filteredRecipes = recipes.filter(r => {
    if (filterSeason !== 'Tous' && !recipeMatchesSeason(r.season, filterSeason)) return false;
    if (filterEquip !== 'Tous' && r.equipment !== filterEquip && r.additionalEquipment !== filterEquip) return false;
    if (filterCarb !== 'Tous' && r.carb !== filterCarb) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {title && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
          <h2 className="font-bold text-slate-800 text-base flex items-center gap-2">
            <List className="w-5 h-5 text-indigo-600" /> {title}
          </h2>
          <span className="text-xs text-slate-500 font-medium">{filteredRecipes.length} recette(s)</span>
        </div>
      )}

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center text-xs">
          <span className="font-semibold text-slate-600 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filtres :
          </span>

          <select 
            value={filterSeason} 
            onChange={(e) => setFilterSeason(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
          >
            <option value="Tous">Toutes les saisons</option>
            {SEASONS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select 
            value={filterCarb} 
            onChange={(e) => setFilterCarb(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
          >
            <option value="Tous">Toutes les catégories</option>
            {carbsList.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select 
            value={filterEquip} 
            onChange={(e) => setFilterEquip(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
          >
            <option value="Tous">Tous les appareils</option>
            {equipments.map(eq => <option key={eq} value={eq}>{eq}</option>)}
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          {filteredRecipes.length} affichée(s)
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {filteredRecipes.map(recipe => (
          <div key={recipe.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex justify-between items-start gap-2 mb-2">
                <h3 className="font-bold text-slate-800 text-sm leading-tight">{recipe.name}</h3>
                <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded flex-shrink-0 border border-indigo-100">
                  {recipe.carb}
                </span>
              </div>
              
              {recipe.image && (
                <div className="mb-2 h-32 w-full overflow-hidden rounded-lg border border-slate-200">
                  <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex flex-wrap gap-1.5 mb-3">
                <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded flex items-center gap-1 font-medium">
                  <Settings className="w-3 h-3 text-slate-400" /> {recipe.equipment}{recipe.additionalEquipment ? ` + ${recipe.additionalEquipment}` : ''}
                </span>
                <span className={`text-[11px] px-2 py-0.5 rounded font-medium flex items-center gap-1
                  ${recipe.season === currentSeason ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-600'}
                `}>
                  <Sun className="w-3 h-3" /> {recipe.season}
                </span>
              </div>

              {recipe.ingredients && recipe.ingredients.length > 0 && (
                <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                  <span className="font-medium text-slate-700">Ingrédients : </span>
                  {recipe.ingredients.join(', ')}
                </p>
              )}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100 mt-2">
              <button 
                onClick={() => setViewingRecipe(recipe)}
                className="text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" /> Voir la fiche
              </button>

              <div className="flex items-center gap-1">
                <button 
                  onClick={() => {
                    setEditingRecipe(recipe);
                    setActiveTab('add');
                  }}
                  className="text-slate-400 hover:text-indigo-600 p-1.5 rounded transition-colors"
                  title="Modifier la recette"
                >
                  <Pencil className="w-4 h-4" />
                </button>

                <button 
                  onClick={() => { if (window.confirm("Supprimer cette recette ?")) deleteRecipe(recipe.id); }}
                  className="text-slate-400 hover:text-red-600 p-1.5 rounded transition-colors"
                  title="Supprimer la recette"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredRecipes.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 text-sm bg-white rounded-xl border border-slate-200">
            Aucune recette ne correspond à ces filtres.
          </div>
        )}
      </div>
    </div>
  );
}

function BakingPlanner({ menu, bakingItems, setBakingItems, setEditingRecipe, setActiveTab, bakingRecipes, recipes, deleteRecipe, setViewingRecipe, currentSeason, equipments, carbsList, subTab, setSubTab }) {
  const updateBakingItem = (index, recipeId) => {
    const updated = [...bakingItems];
    updated[index] = recipeId;
    setBakingItems(updated);
  };

  const generateSmartBaking = () => {
    if (bakingRecipes.length === 0) return;
    
    const shuffled = [...bakingRecipes].sort(() => 0.5 - Math.random());
    const first = shuffled[0] ? shuffled[0].id : '';
    const second = shuffled[1] ? shuffled[1].id : first;
    
    setBakingItems([first, second]);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex bg-slate-200/70 p-1 rounded-xl">
        <button 
          onClick={() => setSubTab('planning')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2
            ${subTab === 'planning' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}
          `}
        >
          <Calendar className="w-4 h-4" /> Choix de la semaine ({bakingItems.filter(Boolean).length}/2)
        </button>
        <button 
          onClick={() => setSubTab('list')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2
            ${subTab === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}
          `}
        >
          <Cake className="w-4 h-4" /> Catalogue Gâteaux ({bakingRecipes.length})
        </button>
      </div>

      {subTab === 'planning' ? (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" /> Gâteaux & Goûters de la semaine
              </h2>
              <p className="text-xs text-slate-500">Sélectionnez ou générez vos pâtisseries de la semaine.</p>
            </div>
            <button 
              onClick={generateSmartBaking}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors text-sm shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Générer les gâteaux
            </button>
          </div>

          <div className="space-y-4">
            {bakingItems.map((selectedId, idx) => {
              const selectedRecipe = recipes.find(r => r.id === selectedId);

              return (
                <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700 uppercase">Choix n°{idx + 1}</span>
                  </div>
                  <select
                    value={selectedId}
                    onChange={(e) => updateBakingItem(idx, e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg p-2.5"
                  >
                    <option value="">-- Choisir une recette de gâteau --</option>
                    {bakingRecipes.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>

                  {selectedRecipe && (
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                      <span className="text-xs text-slate-600 font-medium">Appareil : {selectedRecipe.equipment}{selectedRecipe.additionalEquipment ? ` + ${selectedRecipe.additionalEquipment}` : ''}</span>
                      <button 
                        onClick={() => setViewingRecipe(selectedRecipe)}
                        className="text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Voir la recette
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <RecipeList 
          recipes={bakingRecipes} 
          deleteRecipe={deleteRecipe} 
          setViewingRecipe={setViewingRecipe} 
          setEditingRecipe={setEditingRecipe}
          setActiveTab={setActiveTab}
          currentSeason={currentSeason}
          equipments={equipments}
          carbsList={carbsList}
        />
      )}
    </div>
  );
}

function AddRecipeForm({ addRecipe, editingRecipe, setEditingRecipe, setActiveTab, setSelectedImage, equipments, setEquipments, carbsList, setCarbsList }) {
  const [name, setName] = useState('');
  const [carb, setCarb] = useState(carbsList[0] || 'Plaisir');
  const [showNewCarbInput, setShowNewCarbInput] = useState(false);
  const [newCarbName, setNewCarbName] = useState('');
  const [equipment, setEquipment] = useState(equipments[0] || 'Four');
  const [showNewEquipInput, setShowNewEquipInput] = useState(false);
  const [newEquipName, setNewEquipName] = useState('');
  const [showNewEquipSelect, setShowNewEquipSelect] = useState(false);
  const [additionalEquipment, setAdditionalEquipment] = useState('');
  const [selectedSeasons, setSelectedSeasons] = useState(['Toutes']);
  const [category, setCategory] = useState('repas');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState('');
  const [instructions, setInstructions] = useState('');
  const [ingredientsText, setIngredientsText] = useState('');
  
  useEffect(() => {
    if (editingRecipe) {
      setName(editingRecipe.name || '');
      if (carbsList.includes(editingRecipe.carb)) {
        setCarb(editingRecipe.carb);
      } else if (editingRecipe.carb) {
        setCarb(carbsList[0] || 'Plaisir');
      }
      if (equipments.includes(editingRecipe.equipment)) {
        setEquipment(editingRecipe.equipment);
      } else if (editingRecipe.equipment) {
        setEquipment(equipments[0] || 'Four');
      }
      if (editingRecipe.additionalEquipment) {
        setShowNewEquipSelect(true);
        setAdditionalEquipment(editingRecipe.additionalEquipment);
      } else {
        setShowNewEquipSelect(false);
        setAdditionalEquipment('');
      }
      setCategory(editingRecipe.category || 'repas');
      setUrl(editingRecipe.url || '');
      setImage(editingRecipe.image || '');
      setInstructions(editingRecipe.instructions || '');
      setIngredientsText(editingRecipe.ingredients ? editingRecipe.ingredients.join('\n') : '');
      
      if (editingRecipe.season) {
        if (typeof editingRecipe.season === 'string') {
          if (editingRecipe.season === 'Toutes') {
            setSelectedSeasons(['Toutes']);
          } else {
            setSelectedSeasons(editingRecipe.season.split(',').map(s => s.trim()));
          }
        } else {
          setSelectedSeasons(['Toutes']);
        }
      } else {
        setSelectedSeasons(['Toutes']);
      }
    }
  }, [editingRecipe, equipments, carbsList]);

  const handleAddNewCarbQuick = (e) => {
    e.preventDefault();
    const trimmed = newCarbName.trim();
    if (!trimmed) return;
    if (!carbsList.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      setCarbsList([...carbsList, trimmed]);
    }
    setCarb(trimmed);
    setNewCarbName('');
    setShowNewCarbInput(false);
  };

  const handleAddNewEquipmentQuick = (e) => {
    e.preventDefault();
    const trimmed = newEquipName.trim();
    if (!trimmed) return;
    if (!equipments.some(eq => eq.toLowerCase() === trimmed.toLowerCase())) {
      setEquipments([...equipments, trimmed]);
    }
    setEquipment(trimmed);
    setNewEquipName('');
    setShowNewEquipInput(false);
  };

  const handleSeasonCheckboxChange = (seasonOption) => {
    if (seasonOption === 'Toutes') {
      setSelectedSeasons(['Toutes']);
      return;
    }

    let current = selectedSeasons.filter(s => s !== 'Toutes');
    if (current.includes(seasonOption)) {
      current = current.filter(s => s !== seasonOption);
    } else {
      current.push(seasonOption);
    }

    if (current.length === 0 || current.length === SEASONS_LIST.length) {
      setSelectedSeasons(['Toutes']);
    } else {
      setSelectedSeasons(current);
    }
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    let finalAdditionalEquipment = '';
    if (showNewEquipSelect && additionalEquipment) {
      finalAdditionalEquipment = additionalEquipment;
    }

    const ingredients = ingredientsText
      .split('\n')
      .map(i => i.trim().replace(/^[-*•]\s*/, ''))
      .filter(i => i.length > 0);

    const finalSeason = selectedSeasons.includes('Toutes') ? 'Toutes' : selectedSeasons.join(', ');

    const recipeData = {
      name,
      carb,
      equipment: equipment || 'Autre',
      additionalEquipment: finalAdditionalEquipment,
      season: finalSeason,
      category,
      url,
      image,
      instructions,
      ingredients
    };

    if (editingRecipe) {
      addRecipe({ ...recipeData, id: editingRecipe.id });
      setEditingRecipe(null);
    } else {
      addRecipe(recipeData);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 max-w-2xl mx-auto relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
          <Plus className="w-5 h-5 text-indigo-600" /> {editingRecipe ? 'Modifier la recette' : 'Ajouter une nouvelle recette'}
        </h2>
        {editingRecipe && (
          <button 
            type="button"
            onClick={() => { setEditingRecipe(null); setActiveTab('menu'); }}
            className="text-xs text-slate-500 hover:text-slate-800 underline"
          >
            Annuler l'édition
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Type de recette</label>
          <div className="flex gap-4 text-xs font-semibold">
            <label className={`flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-all
              ${category === 'repas' ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-slate-50 border-slate-300 text-slate-700'}`}
            >
              <input type="radio" name="recipeCat" checked={category === 'repas'} onChange={() => { setCategory('repas'); setCarb('Pâtes'); }} className="hidden" />
              🍽️ Plat / Repas
            </label>
            <label className={`flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-all
              ${category === 'gateau' ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-slate-50 border-slate-300 text-slate-700'}`}
            >
              <input type="radio" name="recipeCat" checked={category === 'gateau'} onChange={() => { setCategory('gateau'); setCarb('Plaisir'); }} className="hidden" />
              🍰 Gâteau / Goûter
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Nom de la recette</label>
          <input 
            type="text" 
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={category === 'gateau' ? "Ex: Gâteau au chocolat moelleux..." : "Ex: Gratin de courgettes au chèvre..."}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {category === 'repas' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-700 uppercase">Féculent / Catégorie</label>
                {!showNewCarbInput && (
                  <button
                    type="button"
                    onClick={() => setShowNewCarbInput(true)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    + Nouvelle catégorie
                  </button>
                )}
              </div>

              {showNewCarbInput ? (
                <div className="flex gap-2">
                  <input 
                    type="text"
                    placeholder="Nom de la catégorie..."
                    value={newCarbName}
                    onChange={(e) => setNewCarbName(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={handleAddNewCarbQuick}
                    className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                  >
                    Ajouter
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewCarbInput(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs px-1"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <select 
                  value={carb}
                  onChange={(e) => setCarb(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 focus:ring-indigo-500"
                >
                  {carbsList.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              )}
            </div>
          )}

          <div className={category === 'gateau' ? 'col-span-full space-y-2' : 'space-y-2'}>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase">Appareil utilisé</label>
              {!showNewEquipInput && (
                <button
                  type="button"
                  onClick={() => setShowNewEquipInput(true)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  + Nouvel appareil
                </button>
              )}
            </div>

            {showNewEquipInput ? (
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="Nom du nouvel appareil..."
                  value={newEquipName}
                  onChange={(e) => setNewEquipName(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                />
                <button
                  type="button"
                  onClick={handleAddNewEquipmentQuick}
                  className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                >
                  Ajouter
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewEquipInput(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs px-1"
                >
                  ✕
                </button>
              </div>
            ) : (
              <select 
                value={equipment}
                onChange={(e) => {
                  setEquipment(e.target.value);
                  if (additionalEquipment === e.target.value) {
                    setAdditionalEquipment('');
                  }
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 focus:ring-indigo-500"
              >
                {equipments.map(eq => <option key={eq} value={eq}>{eq}</option>)}
              </select>
            )}

            {!showNewEquipSelect ? (
              <button
                type="button"
                onClick={() => setShowNewEquipSelect(true)}
                className="flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 mt-1 transition-colors"
              >
                <div className="w-5 h-5 rounded-full border border-indigo-600 flex items-center justify-center">
                  <Plus className="w-3.5 h-3.5" />
                </div>
                Ajouter un autre appareil utilisé (facultatif)
              </button>
            ) : (
              <div className="space-y-2 mt-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-700">Second appareil :</span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewEquipSelect(false);
                      setAdditionalEquipment('');
                    }}
                    className="text-slate-400 hover:text-slate-700 text-xs"
                  >
                    ✕ Retirer
                  </button>
                </div>
                <select 
                  value={additionalEquipment}
                  onChange={(e) => setAdditionalEquipment(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:ring-indigo-500"
                >
                  <option value="">-- Choisir un autre appareil --</option>
                  {equipments
                    .filter(eq => eq !== equipment)
                    .map(eq => <option key={eq} value={eq}>{eq}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Saison(s) idéale(s)</label>
          <div className="flex flex-wrap gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
              <input 
                type="checkbox" 
                checked={selectedSeasons.includes('Toutes')}
                onChange={() => handleSeasonCheckboxChange('Toutes')}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Toutes
            </label>
            {SEASONS_LIST.map(s => (
              <label key={s} className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={!selectedSeasons.includes('Toutes') && selectedSeasons.includes(s)}
                  onChange={() => handleSeasonCheckboxChange(s)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                {s}
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Lien internet optionnel</label>
            <input 
              type="url" 
              placeholder="https://www.marmiton.org/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Photo optionnelle</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-xs text-slate-500 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
        </div>

        {image && (
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-slate-200">
            <img src={image} alt="Aperçu" onClick={() => setSelectedImage(image)} className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition" />
            <button 
              type="button" 
              onClick={() => setImage('')}
              className="absolute top-1 right-1 bg-slate-900/70 text-white rounded-full p-1 text-xs"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Ingrédients (1 par ligne)</label>
          <textarea 
            rows={3}
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
            placeholder="250g de farine&#10;1 sachet de levure&#10;100g de sucre"
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Instructions de préparation</label>
          <textarea 
            rows={3}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Mélanger tous les ingrédients..."
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 focus:ring-indigo-500"
          />
        </div>

          <button 
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-colors shadow-sm text-sm"
        >
          {editingRecipe ? 'Mettre à jour la recette' : 'Enregistrer la recette'}
        </button>
      </form>
    </div>
  );
}

function InventoryManager({ inventory, setInventory, equipments, setEquipments, carbsList, setCarbsList }) {
  const [subTab, setSubTab] = useState('inventory');
  const [newItemName, setNewItemName] = useState('');
  const [newItemStatus, setNewItemStatus] = useState('Plein');
  const [newItemZone, setNewItemZone] = useState('Placard');
  const [filterZone, setFilterZone] = useState('Tous');
  const [newEquipName, setNewEquipName] = useState('');
  const [newCarbName, setNewCarbName] = useState('');

  const addItem = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    setInventory([...inventory, { name: newItemName.trim(), status: newItemStatus, zone: newItemZone }]);
    setNewItemName('');
  };

  const updateStatus = (index, status) => {
    const updated = [...inventory];
    updated[index].status = status;
    setInventory(updated);
  };

  const updateZone = (index, zone) => {
    const updated = [...inventory];
    updated[index].zone = zone;
    setInventory(updated);
  };

  const removeItem = (index) => {
    setInventory(inventory.filter((_, i) => i !== index));
  };

  const addEquipment = (e) => {
    e.preventDefault();
    const trimmed = newEquipName.trim();
    if (!trimmed) return;
    if (equipments.some(eq => eq.toLowerCase() === trimmed.toLowerCase())) {
      alert("Cet appareil existe déjà !");
      return;
    }
    setEquipments([...equipments, trimmed]);
    setNewEquipName('');
  };

  const removeEquipment = (eqToDelete) => {
    if (equipments.length <= 1) {
      alert("Vous devez garder au moins un appareil.");
      return;
    }
    if (window.confirm(`Supprimer l'appareil "${eqToDelete}" ?`)) {
      setEquipments(equipments.filter(eq => eq !== eqToDelete));
    }
  };

  const addCarb = (e) => {
    e.preventDefault();
    const trimmed = newCarbName.trim();
    if (!trimmed) return;
    if (carbsList.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      alert("Cette catégorie existe déjà !");
      return;
    }
    setCarbsList([...carbsList, trimmed]);
    setNewCarbName('');
  };

  const removeCarb = (carbToDelete) => {
    if (carbsList.length <= 1) {
      alert("Vous devez garder au moins une catégorie.");
      return;
    }
    if (window.confirm(`Supprimer la catégorie "${carbToDelete}" ?`)) {
      setCarbsList(carbsList.filter(c => c !== carbToDelete));
    }
  };

  const filteredInventory = inventory.filter(item => {
    if (filterZone === 'Tous') return true;
    return item.zone === filterZone;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 max-w-2xl mx-auto space-y-6">
      <div className="flex bg-slate-200/70 p-1 rounded-xl">
        <button 
          onClick={() => setSubTab('inventory')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2
            ${subTab === 'inventory' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}
          `}
        >
          <Package className="w-4 h-4" /> Provisions ({inventory.length})
        </button>
        <button 
          onClick={() => setSubTab('equipments')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2
            ${subTab === 'equipments' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}
          `}
        >
          <Settings className="w-4 h-4" /> Appareils ({equipments.length})
        </button>
        <button 
          onClick={() => setSubTab('carbs')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2
            ${subTab === 'carbs' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}
          `}
        >
          <Tag className="w-4 h-4" /> Féculents ({carbsList.length})
        </button>
      </div>

      {subTab === 'inventory' ? (
        <div className="space-y-6">
          <div>
            <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2 mb-1">
              <Package className="w-5 h-5 text-indigo-600" /> Gestion des Provisions
            </h2>
            <p className="text-xs text-slate-500">
              Rangez vos provisions par zone (Placard, Frigo, Congélateur) pour suivre vos stocks.
            </p>
          </div>

          <form onSubmit={addItem} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase">Ajouter un article</h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="text" 
                placeholder="Nom (ex: Lait, Farine, Steaks...)" 
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm"
              />
              <select 
                value={newItemZone}
                onChange={(e) => setNewItemZone(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700"
              >
                {STORAGE_ZONES.map(z => <option key={z} value={z}>{z}</option>)}
              </select>
              <select 
                value={newItemStatus}
                onChange={(e) => setNewItemStatus(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700"
              >
                <option value="Plein">Plein</option>
                <option value="Entamé">Entamé</option>
                <option value="Presque vide">Presque vide</option>
              </select>
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Ajouter
              </button>
            </div>
          </form>

          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setFilterZone('Tous')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all
                ${filterZone === 'Tous' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'}
              `}
            >
              Tout ({inventory.length})
            </button>
            {STORAGE_ZONES.map(z => (
              <button 
                key={z}
                onClick={() => setFilterZone(z)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all
                  ${filterZone === z ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'}
                `}
              >
                {z} ({inventory.filter(i => i.zone === z).length})
              </button>
            ))}
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {filteredInventory.map((item, index) => {
              const originalIndex = inventory.findIndex(i => i === item);

              return (
                <div key={originalIndex} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white hover:bg-slate-50 transition-colors gap-2">
                  <span className="font-medium text-slate-800 text-sm">{item.name}</span>
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    <select 
                      value={item.zone || 'Placard'} 
                      onChange={(e) => updateZone(originalIndex, e.target.value)}
                      className="text-xs font-semibold rounded-md px-2 py-1 border bg-slate-50 text-slate-700 border-slate-200"
                    >
                      {STORAGE_ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                    </select>

                    <select 
                      value={item.status} 
                      onChange={(e) => updateStatus(originalIndex, e.target.value)}
                      className={`text-xs font-semibold rounded-md px-2 py-1 border
                        ${item.status === 'Plein' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
                        ${item.status === 'Entamé' ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
                        ${item.status === 'Presque vide' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                      `}
                    >
                      <option value="Plein">Plein</option>
                      <option value="Entamé">Entamé</option>
                      <option value="Presque vide">Presque vide</option>
                    </select>

                    <button 
                      onClick={() => {
                        if (window.confirm("Supprimer cet élément ?")) {
                          removeItem(originalIndex);
                        }
                      }}
                      className="text-slate-400 hover:text-red-600 p-1"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
            {filteredInventory.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-sm">Aucun élément dans cette catégorie.</div>
            )}
          </div>
        </div>
      ) : subTab === 'equipments' ? (
        <div className="space-y-6">
          <div>
            <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2 mb-1">
              <Settings className="w-5 h-5 text-indigo-600" /> Gestion des Appareils de Cuisson
            </h2>
            <p className="text-xs text-slate-500">
              Ajoutez ou supprimez les appareils disponibles pour vos recettes (Thermomix, Cookeo, Airfryer...).
            </p>
          </div>

          <form onSubmit={addEquipment} className="flex gap-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <input 
              type="text" 
              placeholder="Nouvel appareil (ex: Machine à pain)..." 
              value={newEquipName}
              onChange={(e) => setNewEquipName(e.target.value)}
              className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Ajouter
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {equipments.map(eq => (
              <div key={eq} className="bg-white border border-slate-200 text-slate-800 text-xs p-3 rounded-xl flex items-center justify-between shadow-sm font-medium">
                <span className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-indigo-600" />
                  {eq}
                </span>
                <button 
                  type="button" 
                  onClick={() => removeEquipment(eq)}
                  className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2 mb-1">
              <Tag className="w-5 h-5 text-indigo-600" /> Gestion des Féculents / Catégories
            </h2>
            <p className="text-xs text-slate-500">
              Ajoutez ou supprimez les catégories de féculents disponibles pour vos recettes.
            </p>
          </div>

          <form onSubmit={addCarb} className="flex gap-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <input 
              type="text" 
              placeholder="Nouvelle catégorie (ex: Polenta, Quinoa)..." 
              value={newCarbName}
              onChange={(e) => setNewCarbName(e.target.value)}
              className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Ajouter
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {carbsList.map(c => (
              <div key={c} className="bg-white border border-slate-200 text-slate-800 text-xs p-3 rounded-xl flex items-center justify-between shadow-sm font-medium">
                <span className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-indigo-600" />
                  {c}
                </span>
                <button 
                  type="button" 
                  onClick={() => removeCarb(c)}
                  className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ShoppingListView({ menu, recipes, inventory, bakingItems, shoppingChecks, setShoppingChecks, setActiveTab }) {
  const [copied, setCopied] = useState(false);

  const activeRecipeIds = [
    ...Object.values(menu).filter(val => val && val !== 'restes'),
    ...bakingItems.filter(Boolean)
  ];
  
  const ingredientMap = {};

  activeRecipeIds.forEach(id => {
    const r = recipes.find(x => x.id === id);
    if (r && r.ingredients) {
      r.ingredients.forEach(ing => {
        const cleanIng = ing.toLowerCase();
        ingredientMap[cleanIng] = (ingredientMap[cleanIng] || 0) + 1;
      });
    }
  });

  const rawList = Object.keys(ingredientMap);

  const getStockStatus = (ingName) => {
    const found = inventory.find(i => ingName.toLowerCase().includes(i.name.toLowerCase()));
    if (!found) return { status: 'A acheter', color: 'text-indigo-600 bg-indigo-50 border-indigo-200' };
    if (found.status === 'Plein') return { status: `En stock (${found.zone} - Plein)`, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (found.status === 'Entamé') return { status: `En stock (${found.zone} - Entamé)`, color: 'text-amber-700 bg-amber-700 border-amber-200' };
    return { status: `Presque vide (${found.zone})`, color: 'text-red-700 bg-red-50 border-red-200' };
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
          <p className="text-xs text-slate-500">Basée sur les menus, gâteaux et l'état de vos provisions.</p>
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

function RecipeModal({ recipe, onClose, setSelectedImage }) {
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
              {recipe.equipment}{recipe.additionalEquipment ? ` + ${recipe.additionalEquipment}` : ''}
            </span>
            <span className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md font-medium">
              {recipe.season}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">{recipe.name}</h2>
        </div>

        {recipe.image && (
          <div className="w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center">
            <img 
              src={recipe.image} 
              alt={recipe.name} 
              onClick={() => setSelectedImage(recipe.image)}
              className="w-full h-auto max-h-[350px] object-contain cursor-pointer hover:opacity-95 transition" 
            />
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
