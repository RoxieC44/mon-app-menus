import React, { useState } from 'react';
import { 
  BookOpen, 
  Package, 
  ShoppingCart, 
  Plus, 
  Trash2, 
  Clock, 
  Users, 
  Check, 
  X, 
  Search, 
  ArrowRight,
  ChevronRight
} from 'lucide-react';

export default function App() {
  // --- ÉTATS ---
  const [activeTab, setActiveTab] = useState('gateaux');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal de détail de recette
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // État des gâteaux / recettes
  const [recipes, setRecipes] = useState([
    {
      id: 1,
      title: 'Moelleux au Chocolat Fondant',
      category: 'Chocolat',
      prepTime: '20 min',
      bakingTime: '25 min',
      servings: 6,
      difficulty: 'Facile',
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60',
      ingredients: [
        { name: 'Chocolat noir', qty: '200g' },
        { name: 'Beurre', qty: '150g' },
        { name: 'Œufs', qty: '4' },
        { name: 'Sucre', qty: '100g' },
        { name: 'Farine', qty: '50g' }
      ],
      steps: [
        'Préchauffer le four à 180°C.',
        'Faire fondre le chocolat et le beurre ensemble.',
        'Battre les œufs et le sucre jusqu\'à blanchiment.',
        'Incorporer le mélange chocolat/beurre, puis la farine.',
        'Verser dans un moule beurré et enfourner 25 minutes.'
      ]
    },
    {
      id: 2,
      title: 'Tarte Citron Meringuée',
      category: 'Fruits',
      prepTime: '45 min',
      bakingTime: '30 min',
      servings: 8,
      difficulty: 'Intermédiaire',
      image: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=500&auto=format&fit=crop&q=60',
      ingredients: [
        { name: 'Pâte sablée', qty: '1 rouleau' },
        { name: 'Citrons (jus et zeste)', qty: '3' },
        { name: 'Œufs', qty: '4' },
        { name: 'Sucre en poudre', qty: '150g' },
        { name: 'Beurre', qty: '100g' }
      ],
      steps: [
        'Étaler la pâte dans un moule et la cuire à blanc 15 min à 180°C.',
        'Préparer la crème au citron en chauffant le jus, les zests, le sucre, les œufs et le beurre.',
        'Verser la crème sur le fond de tarte cuit.',
        'Monter les blancs en neige avec du sucre pour la meringue, décorer et passer au chalumeau.'
      ]
    }
  ]);

  // Modal d'ajout de recette
  const [isAddRecipeOpen, setIsAddRecipeOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Chocolat');
  const [newPrepTime, setNewPrepTime] = useState('20 min');
  const [newBakingTime, setNewBakingTime] = useState('30 min');
  const [newServings, setNewServings] = useState(6);
  const [newIngredients, setNewIngredients] = useState([{ name: '', qty: '' }]);
  const [newSteps, setNewSteps] = useState(['']);

  // État du placard
  const [pantryItems, setPantryItems] = useState([
    { id: 1, name: 'Farine de blé', category: 'Secs', quantity: '1.5 kg', alert: false },
    { id: 2, name: 'Chocolat noir', category: 'Chocolat & Sucre', quantity: '4 tablettes', alert: true },
    { id: 3, name: 'Beurre doux', category: 'Frais', quantity: '2 plaquettes', alert: false },
    { id: 4, name: 'Œufs', category: 'Frais', quantity: '6 pièces', alert: false },
    { id: 5, name: 'Sucre en poudre', category: 'Chocolat & Sucre', quantity: '1 kg', alert: false }
  ]);
  const [newPantryName, setNewPantryName] = useState('');
  const [newPantryCategory, setNewPantryCategory] = useState('Secs');
  const [newPantryQty, setNewPantryQty] = useState('');

  // État de la liste de courses
  const [shoppingList, setShoppingList] = useState([
    { id: 1, name: 'Levure chimique', qty: '1 sachet', checked: false },
    { id: 2, name: 'Crème fraîche', qty: '20 cl', checked: true },
    { id: 3, name: 'Pistoles de chocolat blanc', qty: '200g', checked: false }
  ]);
  const [newShoppingItem, setNewShoppingItem] = useState('');
  const [newShoppingQty, setNewShoppingQty] = useState('');

  // --- FONCTIONS GÎTE / GÂTEAUX ---
  const handleAddIngredientField = () => {
    setNewIngredients([...newIngredients, { name: '', qty: '' }]);
  };

  const handleAddStepField = () => {
    setNewSteps([...newSteps, '']);
  };

  const handleSaveRecipe = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newRecipeObj = {
      id: Date.now(),
      title: newTitle,
      category: newCategory,
      prepTime: newPrepTime,
      bakingTime: newBakingTime,
      servings: Number(newServings),
      difficulty: 'Facile',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60',
      ingredients: newIngredients.filter(i => i.name.trim() !== ''),
      steps: newSteps.filter(s => s.trim() !== '')
    };

    setRecipes([newRecipeObj, ...recipes]);
    setIsAddRecipeOpen(false);
    // Reset form
    setNewTitle('');
    setNewIngredients([{ name: '', qty: '' }]);
    setNewSteps(['']);
  };

  // --- FONCTIONS PLACARD ---
  const handleAddPantryItem = (e) => {
    e.preventDefault();
    if (!newPantryName.trim()) return;
    const newItem = {
      id: Date.now(),
      name: newPantryName,
      category: newPantryCategory,
      quantity: newPantryQty || '1',
      alert: false
    };
    setPantryItems([newItem, ...pantryItems]);
    setNewPantryName('');
    setNewPantryQty('');
  };

  const handleDeletePantryItem = (id) => {
    setPantryItems(pantryItems.filter(item => item.id !== id));
  };

  // --- FONCTIONS COURSES ---
  const handleAddShoppingItem = (e) => {
    e.preventDefault();
    if (!newShoppingItem.trim()) return;
    const newItem = {
      id: Date.now(),
      name: newShoppingItem,
      qty: newShoppingQty || '1',
      checked: false
    };
    setShoppingList([newItem, ...shoppingList]);
    setNewShoppingItem('');
    setNewShoppingQty('');
  };

  const toggleShoppingItem = (id) => {
    setShoppingList(shoppingList.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleDeleteShoppingItem = (id) => {
    setShoppingList(shoppingList.filter(item => item.id !== id));
  };

  // Filtrer les recettes
  const filteredRecipes = recipes.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-24 font-sans">
      
      {/* HEADER PRINCIPAL */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-amber-500 text-white p-2 rounded-xl shadow-sm">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Mes Douceurs</h1>
              <p className="text-xs text-slate-500">Recettes, Placard & Courses</p>
            </div>
          </div>
          {activeTab === 'gateaux' && (
            <button 
              onClick={() => setIsAddRecipeOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-3.5 py-2 rounded-xl shadow-xs flex items-center space-x-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nouvelle recette</span>
            </button>
          )}
        </div>
      </header>

      {/* CONTENU PRINCIPAL SELON L'ONGLET */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        
        {/* ================= ONGLET 1 : GÂTEAUX ================= */}
        {activeTab === 'gateaux' && (
          <div className="space-y-6">
            {/* Barre de recherche */}
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Rechercher un gâteau, un ingrédient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-xs"
              />
            </div>

            {/* Grille des recettes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredRecipes.map((recipe) => (
                <div 
                  key={recipe.id}
                  onClick={() => setSelectedRecipe(recipe)}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col"
                >
                  <div className="h-40 overflow-hidden relative bg-slate-100">
                    <img 
                      src={recipe.image} 
                      alt={recipe.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-xs">
                      {recipe.category}
                    </span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-amber-600 transition-colors text-base line-clamp-1">
                        {recipe.title}
                      </h3>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span>{recipe.prepTime}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Users className="w-3.5 h-3.5 text-amber-500" />
                          <span>{recipe.servings} pers.</span>
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-amber-600">
                      <span>Voir la recette</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= ONGLET 2 : PLACARD ================= */}
        {activeTab === 'placard' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h2 className="text-base font-semibold text-slate-900 mb-4">Ajouter un produit au placard</h2>
              <form onSubmit={handleAddPantryItem} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input 
                  type="text" 
                  placeholder="Nom du produit..." 
                  value={newPantryName}
                  onChange={(e) => setNewPantryName(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
                <select 
                  value={newPantryCategory}
                  onChange={(e) => setNewPantryCategory(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                >
                  <option value="Secs">Secs</option>
                  <option value="Chocolat & Sucre">Chocolat & Sucre</option>
                  <option value="Frais">Frais</option>
                  <option value="Ustensiles">Ustensiles</option>
                </select>
                <div className="flex space-x-2">
                  <input 
                    type="text" 
                    placeholder="Qté (ex: 2kg)" 
                    value={newPantryQty}
                    onChange={(e) => setNewPantryQty(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                  <button 
                    type="submit" 
                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shrink-0"
                  >
                    Ajouter
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-semibold text-slate-900">Mon Inventaire</h2>
                <span className="text-xs bg-amber-50 text-amber-700 font-medium px-2.5 py-1 rounded-full">
                  {pantryItems.length} articles
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {pantryItems.map((item) => (
                  <div key={item.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{item.name}</p>
                        <span className="text-xs text-slate-500">{item.category} • Quantité : <strong className="text-slate-700">{item.quantity}</strong></span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => handleDeletePantryItem(item.id)}
                        className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= ONGLET 3 : COURSES ================= */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h2 className="text-base font-semibold text-slate-900 mb-4">Ajouter un article à acheter</h2>
              <form onSubmit={handleAddShoppingItem} className="flex gap-3">
                <input 
                  type="text" 
                  placeholder="Article..." 
                  value={newShoppingItem}
                  onChange={(e) => setNewShoppingItem(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
                <input 
                  type="text" 
                  placeholder="Qté" 
                  value={newShoppingQty}
                  onChange={(e) => setNewShoppingQty(e.target.value)}
                  className="w-24 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
                <button 
                  type="submit" 
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shrink-0"
                >
                  Ajouter
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-semibold text-slate-900">Liste de courses</h2>
                <span className="text-xs text-slate-500">
                  {shoppingList.filter(i => i.checked).length} / {shoppingList.length} achetés
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {shoppingList.map((item) => (
                  <div key={item.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center space-x-3 cursor-pointer" onClick={() => toggleShoppingItem(item.id)}>
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${item.checked ? 'bg-amber-500 border-amber-500 text-white' : 'border-slate-300 bg-white'}`}>
                        {item.checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className={`text-sm font-medium ${item.checked ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {item.name} <span className="text-xs text-slate-500 font-normal">({item.qty})</span>
                      </span>
                    </div>
                    <button 
                      onClick={() => handleDeleteShoppingItem(item.id)}
                      className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ================= MODAL : DÉTAIL D'UNE RECETTE ================= */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="relative h-56 bg-slate-100">
              <img src={selectedRecipe.image} alt={selectedRecipe.title} className="w-full h-full object-cover" />
              <button 
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white text-slate-700 p-2 rounded-full shadow-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">
                  {selectedRecipe.category}
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">{selectedRecipe.title}</h2>
                
                <div className="flex items-center space-x-6 mt-4 text-sm text-slate-600">
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span>Prépa : {selectedRecipe.prepTime}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Users className="w-4 h-4 text-amber-500" />
                    <span>{selectedRecipe.servings} personnes</span>
                  </div>
                </div>
              </div>

              {/* Ingrédients */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Ingrédients</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedRecipe.ingredients.map((ing, index) => (
                    <div key={index} className="flex justify-between items-center bg-slate-50 px-3.5 py-2 rounded-xl text-sm border border-slate-100">
                      <span className="text-slate-700">{ing.name}</span>
                      <span className="font-semibold text-amber-600">{ing.qty}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Étapes */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Préparation</h3>
                <div className="space-y-3">
                  {selectedRecipe.steps.map((step, index) => (
                    <div key={index} className="flex space-x-3 text-sm">
                      <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-semibold flex items-center justify-center shrink-0 text-xs">
                        {index + 1}
                      </span>
                      <p className="text-slate-600 pt-0.5">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => setSelectedRecipe(null)}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL : AJOUT DE RECETTE ================= */}
      {isAddRecipeOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-xl rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="font-bold text-lg text-slate-900">Nouvelle Recette</h2>
              <button onClick={() => setIsAddRecipeOpen(false)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveRecipe} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Titre de la recette</label>
                <input 
                  type="text" 
                  placeholder="Ex: Fondant au chocolat..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Catégorie</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    <option value="Chocolat">Chocolat</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Biscuits">Biscuits</option>
                    <option value="Entremets">Entremets</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Portions</label>
                  <input 
                    type="number" 
                    value={newServings}
                    onChange={(e) => setNewServings(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Ingrédients dynamiques */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Ingrédients</label>
                <div className="space-y-2">
                  {newIngredients.map((ing, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Nom (ex: Farine)" 
                        value={ing.name}
                        onChange={(e) => {
                          const updated = [...newIngredients];
                          updated[idx].name = e.target.value;
                          setNewIngredients(updated);
                        }}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm"
                      />
                      <input 
                        type="text" 
                        placeholder="Qté (ex: 150g)" 
                        value={ing.qty}
                        onChange={(e) => {
                          const updated = [...newIngredients];
                          updated[idx].qty = e.target.value;
                          setNewIngredients(updated);
                        }}
                        className="w-28 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm"
                      />
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={handleAddIngredientField}
                    className="text-xs font-medium text-amber-600 hover:text-amber-700 mt-1"
                  >
                    + Ajouter un ingrédient
                  </button>
                </div>
              </div>

              {/* Étapes dynamiques */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Étapes de préparation</label>
                <div className="space-y-2">
                  {newSteps.map((step, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder={`Étape ${idx + 1}...`} 
                        value={step}
                        onChange={(e) => {
                          const updated = [...newSteps];
                          updated[idx] = e.target.value;
                          setNewSteps(updated);
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm"
                      />
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={handleAddStepField}
                    className="text-xs font-medium text-amber-600 hover:text-amber-700 mt-1"
                  >
                    + Ajouter une étape
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
                <button 
                  type="button"
                  onClick={() => setIsAddRecipeOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-xs"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= BARRE DE NAVIGATION FIXE (BOTTOM) ================= */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 z-40 py-2">
        <div className="max-w-md mx-auto px-6 flex justify-around">
          <button 
            onClick={() => setActiveTab('gateaux')}
            className={`flex flex-col items-center space-y-1 transition-colors ${activeTab === 'gateaux' ? 'text-amber-600 font-semibold' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[11px]">Gâteaux</span>
          </button>

          <button 
            onClick={() => setActiveTab('placard')}
            className={`flex flex-col items-center space-y-1 transition-colors ${activeTab === 'placard' ? 'text-amber-600 font-semibold' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Package className="w-5 h-5" />
            <span className="text-[11px]">Placard</span>
          </button>

          <button 
            onClick={() => setActiveTab('courses')}
            className={`flex flex-col items-center space-y-1 transition-colors ${activeTab === 'courses' ? 'text-amber-600 font-semibold' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="text-[11px]">Courses</span>
          </button>
        </div>
      </nav>

    </div>
  );
}
