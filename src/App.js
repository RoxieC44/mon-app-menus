// Remplacer le bloc du "Générateur Intelligent" dans l'onglet 'menus' / 'semaine' par celui-ci :

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

// Et voici comment modifier le rendu des jours pour que TOUS les menus soient des déroulants :

{Object.entries(weeklyMenu).map(([day, meals]) => (
  <div key={day} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
      <h3 className="font-bold text-slate-800 flex items-center gap-2">
        <Calendar size={18} className="text-indigo-600" /> {day}
      </h3>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Midi : Désormais un menu déroulant pour tous les jours */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Midi</span>
        <select 
          value={meals.midi}
          onChange={(e) => setWeeklyMenu({...weeklyMenu, [day]: { ...meals, midi: e.target.value }})}
          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="Restes de la veille">Restes de la veille</option>
          {dishes.map(d => <option key={d.id} value={d.title}>{d.title}</option>)}
        </select>
      </div>

      {/* Soir : Menu déroulant pour tous les jours */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Soir</span>
        <select 
          value={meals.soir}
          onChange={(e) => setWeeklyMenu({...weeklyMenu, [day]: { ...meals, soir: e.target.value }})}
          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {dishes.map(d => <option key={d.id} value={d.title}>{d.title}</option>)}
        </select>
      </div>
    </div>
  </div>
))}
