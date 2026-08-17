// --- ÉTATS DE NAVIGATION ET MODALS ---
  const [activeTab, setActiveTab] = useState('menus');
  const [menuSubTab, setMenuSubTab] = useState('semaine');
  const [gateauSubTab, setGateauSubTab] = useState('semaine');
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // --- ÉTATS DES DONNÉES (RECETTES, PLACARD, COURSES) ---
  const [meals, setMeals] = useState([
    {
      id: 1,
      title: 'Gratin de courgettes au Thermomix',
      category: 'Pommes de terre',
      appliance: 'Thermomix',
      season: 'Été',
      ingredients: ['3 courgettes', '500g de pommes de terre', '200ml de crème fraîche', '100g de gruyère râpé', 'Sel', 'Poivre'],
      instructions: '1. Éplucher et couper les pommes de terre et courgettes en rondelles.\n2. Disposer dans le varoma ou directement dans le bol avec le lait et la crème.\n3. Cuire 30 min / 100°C / vitesse inverse 1.\n4. Gratiner au four avec le fromage.'
    },
    {
      id: 2,
      title: 'Poulet basquaise au Cookeo',
      category: 'Riz',
      appliance: 'Cookeo',
      season: 'Toutes',
      ingredients: ['4 blancs de poulet', '3 poivrons', '4 tomates', '1 oignon', '200g de riz', 'Huile d\'olive'],
      instructions: '1. Faire dorer le poulet et l\'oignon en mode dorer.\n2. Ajouter les poivrons émincés et les tomates.\n3. Cuire sous pression 10 min.\n4. Servir avec le riz cuit à part.'
    }
  ]);

  const [cakes, setCakes] = useState([
    {
      id: 101,
      title: 'Gâteau au yaourt moelleux',
      category: 'Plaisir',
      appliance: 'Four',
      season: 'Toutes',
      ingredients: ['1 yaourt nature', '2 pots de sucre', '3 pots de farine', '1/2 pot d\'huile', '3 œufs', '1 sachet de levure chimique'],
      instructions: '1. Mélanger le yaourt et le sucre.\n2. Ajouter les œufs, la farine, la levure et l\'huile.\n3. Verser dans un moule OHRA.\n4. Cuire 30 min à 180°C.'
    }
  ]);

  const [weeklyMenus, setWeeklyMenus] = useState({
    lundi: { midi: '', soir: '' },
    mardi: { midi: '', soir: '' },
    mercredi: { midi: '', soir: '' },
    jeudi: { midi: '', soir: '' },
    vendredi: { midi: '', soir: '' },
    samedi: { midi: '', soir: '' },
    dimanche: { midi: '', soir: '' }
  });

  const [weeklyCakes, setWeeklyCakes] = useState({
    choix1: '',
    choix2: ''
  });

  const [pantry, setPantry] = useState([
    { id: 1, name: 'Sel', status: 'Plein' },
    { id: 2, name: 'Huile d\'olive', status: 'Entamé' },
    { id: 3, name: 'Poivre', status: 'Presque vide' }
  ]);

  const [newItemName, setNewItemName] = useState('');
  const [newItemStatus, setNewItemStatus] = useState('Plein');
  const [checkedItems, setCheckedItems] = useState({});

  // --- ÉTATS DU FORMULAIRE D'AJOUT DE RECETTE ---
  const [addType, setAddType] = useState('plat');
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Pâtes');
  const [formAppliance, setFormAppliance] = useState('Thermomix');
  const [formSeason, setFormSeason] = useState('Toutes');
  const [formIngredients, setFormIngredients] = useState('');
  const [formInstructions, setFormInstructions] = useState('');

  // --- FONCTIONS DE GESTION ---

  const handleSaveRecipe = (e) => {
    e.preventDefault();
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
      setMeals([...meals, newRecipe]);
    } else {
      setCakes([...cakes, newRecipe]);
    }

    // Réinitialisation du formulaire
    setFormTitle('');
    setFormIngredients('');
    setFormInstructions('');
    setActiveTab(addType === 'plat' ? 'menus' : 'gateaux');
  };

  const handleDeleteRecipe = (id, type) => {
    if (type === 'plat') {
      setMeals(meals.filter(m => m.id !== id));
    } else {
      setCakes(cakes.filter(c => c.id !== id));
    }
  };

  const handleAddPantryItem = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    setPantry([...pantry, { id: Date.now(), name: newItemName.trim(), status: newItemStatus }]);
    setNewItemName('');
  };

  const handleUpdatePantryStatus = (id, status) => {
    setPantry(pantry.map(item => item.id === id ? { ...item, status } : item));
  };

  const handleDeletePantryItem = (id) => {
    setPantry(pantry.filter(item => item.id !== id));
  };

  const toggleCheckItem = (id) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleGenerateBalancedMenus = () => {
    if (meals.length === 0) return;
    const days = Object.keys(weeklyMenus);
    const newMenus = { ...weeklyMenus };
    days.forEach(day => {
      const randomMidi = meals[Math.floor(Math.random() * meals.length)].title;
      const randomSoir = meals[Math.floor(Math.random() * meals.length)].title;
      newMenus[day] = { midi: randomMidi, soir: randomSoir };
    });
    setWeeklyMenus(newMenus);
  };

  const handleGenerateBalancedCakes = () => {
    if (cakes.length === 0) return;
    const c1 = cakes[Math.floor(Math.random() * cakes.length)].title;
    const c2 = cakes[Math.floor(Math.random() * cakes.length)].title;
    setWeeklyCakes({ choix1: c1, choix2: c2 });
  };

  // --- GÉNÉRATION AUTOMATIQUE DE LA LISTE DE COURSES ---
  const getShoppingList = () => {
    const ingredientMap = new Map();

    // Collecter les ingrédients des menus de la semaine
    const activeMealTitles = new Set();
    Object.values(weeklyMenus).forEach(day => {
      if (day.midi) activeMealTitles.add(day.midi);
      if (day.soir) activeMealTitles.add(day.soir);
    });

    const activeCakeTitles = new Set();
    if (weeklyCakes.choix1) activeCakeTitles.add(weeklyCakes.choix1);
    if (weeklyCakes.choix2) activeCakeTitles.add(weeklyCakes.choix2);

    // Ajouter les ingrédients des plats
    meals.forEach(meal => {
      if (activeMealTitles.has(meal.title)) {
        meal.ingredients.forEach(ing => {
          const cleanIng = ing.trim();
          ingredientMap.set(cleanIng, (ingredientMap.get(cleanIng) || 0) + 1);
        });
      }
    });

    // Ajouter les ingrédients des gâteaux
    cakes.forEach(cake => {
      if (activeCakeTitles.has(cake.title)) {
        cake.ingredients.forEach(ing => {
          const cleanIng = ing.trim();
          ingredientMap.set(cleanIng, (ingredientMap.get(cleanIng) || 0) + 1);
        });
      }
    });

    // Croiser avec le placard
    const list = [];
    let idCounter = 1;
    ingredientMap.forEach((count, ingName) => {
      // Recherche simple d'une correspondance dans le placard
      const pantryItem = pantry.find(p => p.name.toLowerCase() === ingName.toLowerCase() || ingName.toLowerCase().includes(p.name.toLowerCase()));
      
      let status = 'A acheter';
      if (pantryItem) {
        if (pantryItem.status === 'Plein') status en stock = 'En stock (Plein)';
        else if (pantryItem.status === 'Entamé') status = 'En stock (Entamé)';
        else status = 'Presque vide -> A acheter';
      }

      list.push({
        id: idCounter++,
        name: ingName,
        status: status
      });
    });

    return list;
  };

  const shoppingList = getShoppingList();
  const hasPlannedItems = shoppingList.length > 0;
