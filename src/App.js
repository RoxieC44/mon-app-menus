import React, { useState } from 'react';
import { Calendar, BookOpen, Utensils, Archive, X } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('Catalogue');
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Exemple de structure de donnée avec les ingrédients et instructions
  const [catalog] = useState([
    { 
      id: 1, 
      title: 'Quiche lorraine', 
      ingredients: ['Pâte brisée', '200g lardons', '3 œufs', '20cl crème'], 
      instructions: 'Préchauffer le four à 180°C. Étaler la pâte, ajouter les lardons, verser le mélange œufs/crème. Cuire 30 min.' 
    }
  ]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Mon Menu Organisé</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {catalog.map((recipe) => (
          <div key={recipe.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="font-semibold text-slate-800">{recipe.title}</h2>
            <button 
              onClick={() => setSelectedRecipe(recipe)}
              className="mt-2 text-indigo-600 text-sm font-medium hover:underline"
            >
              Voir la recette
            </button>
          </div>
        ))}
      </div>

      {/* La modale que tu m'as envoyée */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-800">{selectedRecipe.title}</h2>
              <button onClick={() => setSelectedRecipe(null)}><X size={20} /></button>
            </div>

            {selectedRecipe.ingredients && selectedRecipe.ingredients.length > 0 && (
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Ingrédients</h3>
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
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Préparation</h3>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-200 whitespace-pre-line">
                  {selectedRecipe.instructions}
                </p>
              </div>
            )}

            <button 
              onClick={() => setSelectedRecipe(null)}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 rounded-xl transition-colors text-sm"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
