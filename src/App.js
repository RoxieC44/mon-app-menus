<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mon Menu Organisé</title>
    <style>
        /* Styles de base */
        :root { --primary: #e67e22; --secondary: #27ae60; --bg: #fdfbf7; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: var(--bg); margin: 0; padding: 20px; color: #333; }
        .container { max-width: 900px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.1); }
        h1, h2, h3 { color: var(--primary); }
        
        /* Boutons et navigation */
        .btn { background: var(--secondary); color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold; transition: 0.3s; display: inline-flex; align-items: center; gap: 8px; margin-bottom: 10px; }
        .btn:hover { background: #2ecc71; }
        .tabs { display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 2px solid #eee; padding-bottom: 10px; flex-wrap: wrap; }
        .tab { padding: 10px 20px; cursor: pointer; border-radius: 8px; font-weight: bold; background: #eee; }
        .tab.active { background: var(--primary); color: white; }
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        
        /* Grilles et cartes */
        .week-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-top: 20px; }
        .day-card { background: #fff; border: 2px solid #eee; border-radius: 8px; padding: 15px; }
        .day-card h3 { margin-top: 0; color: #555; border-bottom: 2px solid var(--secondary); padding-bottom: 5px; }
        
        /* Formulaires */
        .form-group { margin-bottom: 15px; }
        label { display: block; font-weight: bold; margin-bottom: 5px; }
        input[type="text"], input[type="url"], select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; }
        .checkbox-group { display: flex; gap: 15px; flex-wrap: wrap; margin-top: 5px; }
        .checkbox-group label { font-weight: normal; display: flex; align-items: center; gap: 5px; }
        
        /* Alertes et astuces */
        .healthy-tip { background: #e8f8f5; border-left: 4px solid #1abc9c; padding: 15px; margin: 15px 0; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🍽️ Mon Menu Organisé</h1>
        
        <!-- Navigation -->
        <div class="tabs">
            <div class="tab active" onclick="switchTab('menus')">📅 Menus de la Semaine</div>
            <div class="tab" onclick="switchTab('desserts')">🧁 Gâteaux & Goûters</div>
            <div class="tab" onclick="switchTab('add')">➕ Ajouter une recette</div>
        </div>

        <!-- ONGLET 1 : MENUS -->
        <div id="menus" class="tab-content active">
            <h2>Planning des Menus</h2>
            
            <button class="btn" onclick="generateMenu()">🔄 Générer un menu équilibré</button>
            <p><small><i>Le planning prend en compte l'équilibre sur la semaine et la répartition entre le Thermomix, le Cookeo, le Ninja et le four.</i></small></p>
            
            <div class="week-grid" id="menu-grid">
                <!-- Rempli par JavaScript -->
            </div>
        </div>

        <!-- ONGLET 2 : GATEAUX & GOUTERS -->
        <div id="desserts" class="tab-content">
            <h2>Gâteaux & Goûters de la semaine</h2>
            <p>Sélectionnez ou générez vos pâtisseries de la semaine.</p>
            
            <button class="btn" onclick="generateDesserts()">🔄 générer les recettes</button>
            
            <div class="healthy-tip">
                💡 <strong>Idées de recettes saines :</strong> 
                <ul>
                    <li>Muffins aux flocons d'avoine et myrtilles (Idéal au Ninja)</li>
                    <li>Compote sans sucre ajouté pommes-poires (Thermomix)</li>
                    <li>Cookies à la banane et pépites de chocolat noir</li>
                </ul>
            </div>
            
            <div class="week-grid" id="dessert-grid">
                <!-- Rempli par JavaScript -->
            </div>
        </div>

        <!-- ONGLET 3 : AJOUTER UNE RECETTE -->
        <div id="add" class="tab-content">
            <h2>Ajouter une nouvelle recette</h2>
            <form id="recipe-form">
                <div class="form-group">
                    <label>Nom de la recette :</label>
                    <input type="text" placeholder="Ex: Gratin de courgettes" required>
                </div>
                
                <div class="form-group">
                    <label>Lien site internet :</label>
                    <input type="url" placeholder="https://...">
                </div>

                <div class="form-group">
                    <label>Ajouter des photos :</label>
                    <input type="file" accept="image/*" multiple>
                </div>

                <div class="form-group">
                    <label>Type de recette :</label>
                    <select id="recipe-type" onchange="updateCategories()">
                        <option value="plat">Plat principal</option>
                        <option value="dessert">Gâteau / Goûter</option>
                    </select>
                </div>

                <div class="form-group" id="category-group">
                    <label>Catégorie :</label>
                    <select id="recipe-category">
                        <option value="legumes">Légumes</option>
                        <option value="feculent" id="opt-feculent">Féculent</option>
                        <option value="viande">Viande / Poisson</option>
                        <option value="sain">Alternative saine</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Appareil(s) utilisé(s) :</label>
                    <div class="checkbox-group">
                        <label><input type="checkbox" value="thermomix"> Thermomix</label>
                        <label><input type="checkbox" value="cookeo"> Cookeo</label>
                        <label><input type="checkbox" value="ninja"> Ninja Air Fryer</label>
                        <label><input type="checkbox" value="four"> Four traditionnel</label>
                    </div>
                </div>

                <button type="button" class="btn">Enregistrer la recette</button>
            </form>
        </div>
    </div>

    <script>
        // Gestion de la navigation entre les onglets
        function switchTab(tabId) {
            document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
            event.target.classList.add('active');
        }

        // Retirer dynamiquement la catégorie "féculent" si on est dans les goûters
        function updateCategories() {
            const type = document.getElementById('recipe-type').value;
            const feculentOpt = document.getElementById('opt-feculent');
            if (type === 'dessert') {
                feculentOpt.style.display = 'none'; 
                if(document.getElementById('recipe-category').value === 'feculent') {
                    document.getElementById('recipe-category').value = 'sain';
                }
            } else {
                feculentOpt.style.display = 'block';
            }
        }

        // Génération du menu avec équilibrage des appareils
        function generateMenu() {
            const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
            const appliances = ['Thermomix', 'Cookeo', 'Ninja', 'Four'];
            let html = '';
            
            days.forEach((day, index) => {
                let meal = '';
                // Simuler la logique : un jour sur deux on mange les restes
                if (index % 2 !== 0) {
                    meal = `🔄 restes de la veille`;
                } else {
                    // Simuler la répartition des appareils
                    let appliance = appliances[Math.floor(Math.random() * appliances.length)];
                    meal = `Nouvelle recette au ${appliance}`;
                }
                
                html += `
                <div class="day-card">
                    <h3>${day}</h3>
                    <p><strong>Midi :</strong> 🔄 restes de la veille</p>
                    <p><strong>Soir :</strong> ${meal}</p>
                </div>`;
            });
            document.getElementById('menu-grid').innerHTML = html;
        }

        // Génération des goûters de la semaine
        function generateDesserts() {
            document.getElementById('dessert-grid').innerHTML = `
                <div class="day-card">
                    <h3>Gâteau 1</h3>
                    <p>Banana bread (Sain) au Four</p>
                </div>
                <div class="day-card">
                    <h3>Goûter 2</h3>
                    <p>Pancakes aux flocons d'avoine</p>
                </div>
            `;
        }

        // Initialiser l'affichage
        generateMenu();
    </script>
</body>
</html>
