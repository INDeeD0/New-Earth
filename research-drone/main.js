// main.js
// top-level orchestrator: initializes everything in correct order

$(document).ready(async function(){
    // === Shared globals ===
    window.currentScale = 0;

    // === Initialize DataTables defaults ===
    Tables.initDefaults();

    try {
        // === Load JSON data ===
        const data = await DataLoader.loadAll();
        window.keyMap = data.keyMap;
        window.reverseKeyMap = data.reverseKeyMap;  
        const subtypes = data.subtypes;
        const keyMap = data.keyMap;

        // expose globally for other modules
        window.structuresSubtypes = {};
        for (const [k,v] of Object.entries(subtypes)) {
            window.structuresSubtypes[k.toLowerCase()] = v;
        }
        window.loadedKeyMap = keyMap;

        // === Default building (root node) ===
        const defaultBuilding = 'Headquarters';
        const mapped = keyMap[defaultBuilding] || defaultBuilding;
        const structureData = subtypes[mapped.toLowerCase()] || subtypes[defaultBuilding.toLowerCase()];

        // === Sync time scale inputs ===
        $('.time-scale').val(window.currentScale);

        // === Bootstrap UI (tree clicks, toggles, handlers) ===
        UI.bootstrap(data);

        // === Default visibility setup ===
        $('#costsWrapper').css({ height: 'auto', overflow: 'visible' });
        $('#rewardsWrapper, #statsWrapper').css({ height: 0, overflow: 'hidden' });
        $('#costsTotals').show();
        $('#missionsTotals').hide();
        $('#statsTotals').hide();

        // === Draw initial tree lines ===
        setTimeout(() => UI.drawLines(), 50);

        // === Initialize Level Storage (after UI exists) ===
        LevelStorage.loadFromLocal();

        // === Hook into top Save/Load buttons ===
        $('#saveLevelsBtn').on('click', LevelStorage.exportToFile);
        $('#loadLevelsBtn').on('click', () => $('#loadLevelsFile').click());
        $('#loadLevelsFile').on('change', e => {
            const file = e.target.files[0];
            if (file) LevelStorage.importFromFile(file);
        });
        // === Reset all building levels, checkboxes, and saved data ===
        $('#resetLevelsBtn').on('click', function() {
            if (!confirm('⚠️ Reset all building levels, checkboxes, and clear saved data?')) return;

            // Clear all number inputs (make blank)
            document.querySelectorAll('.section input[type="number"]').forEach(inp => inp.value = '');

            // Uncheck all cost and mission checkboxes
            $('.row-checkbox').prop('checked', false);

            // Clear Totals maps
            const checkedMap = Totals.getCheckedMap();
            const missionsCheckedMap = Totals.getMissionsCheckedMap();
            const statsCheckedMap = Totals.getStatsCheckedMap();
            Object.keys(checkedMap).forEach(k => delete checkedMap[k]);
            Object.keys(missionsCheckedMap).forEach(k => delete missionsCheckedMap[k]);
            Object.keys(statsCheckedMap).forEach(k => delete statsCheckedMap[k]);

            // 🧹 Clear ALL localStorage data related to this system
            localStorage.removeItem('buildingLevels_v1');  // <== correct key!
            localStorage.removeItem('autoLinkEnabled');
            localStorage.removeItem('savedTimestamp');

            // Optional: ensure UI re-syncs after clearing
            Totals.updateCostsTotals(window.currentScale);
            Totals.updateMissionsTotals();
            Totals.updateStatsTotals();

            console.info('🧹 All levels, checkboxes, and localStorage cleared.');
        });

        // === Auto-save on input change ===
        $(document).on('input', '.section input[type="number"]', debounce(LevelStorage.saveToLocal, 800));

        console.log("✅ Initialization complete.");

    } catch(err) {
        console.error('Failed to load structures/objectives json', err);
    }
});

// --- Page navigation ---
$(document).on('click', '#topNav .nav-btn', function(e){

    const page = this.dataset.page;
    const map  = this.dataset.map;

    // --- PAGE NAV ---
    if (page){
        window.location.href = page;
        return;
    }

    // --- MAP SWITCH ---
    if (map){
        const target = map;

        document.querySelectorAll(".container[id^='map']").forEach(m=>{
            m.style.display="none";
        });

        const selected = document.getElementById(target);
        if (!selected) return;

        selected.style.display="grid";

        requestAnimationFrame(()=>{
            selectRootOfMap(selected);
            const index = target.replace("map","");
            const svgId = "lines"+index;
            drawLinesForMap(target, svgId, mapLines[target]);
        });
    }

});


// === LevelStorage Module ===
const LevelStorage = (function(){
    const STORAGE_KEY = 'buildingLevels_v1';

    function saveToLocal(){
        const data = {};
        document.querySelectorAll('.section input[type="number"]').forEach(inp => {
            const name = inp.closest('.section')?.innerText?.trim();
            if (!name) return;
            const val = parseInt(inp.value, 10) || 0;
            data[name] = val;
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        console.log(`💾 Saved ${Object.keys(data).length} levels to localStorage`);
    }

    function loadFromLocal(){
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const data = JSON.parse(raw);
        document.querySelectorAll('.section input[type="number"]').forEach(inp => {
            const name = inp.closest('.section')?.innerText?.trim();
            if (!name || !(name in data)) return;
            inp.value = data[name];
        });
        console.log(`📂 Loaded ${Object.keys(data).length} levels from localStorage`);
    }

    function exportToFile(){
        const data = {};
        document.querySelectorAll('.section input[type="number"]').forEach(inp => {
            const name = inp.closest('.section')?.innerText?.trim();
            if (!name) return;
            const val = parseInt(inp.value, 10) || 0;
            data[name] = val;
        });
        const text = Object.entries(data).map(([k,v]) => `${k}:${v}`).join('\n');
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'building_levels_backup.txt';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        console.log(`📤 Exported ${Object.keys(data).length} levels to file`);
    }

    function importFromFile(file){
        const reader = new FileReader();
        reader.onload = () => {
            const lines = reader.result.split('\n');
            const data = {};
            lines.forEach(line => {
                const [name, val] = line.split(':');
                if (name && !isNaN(parseInt(val))) data[name.trim()] = parseInt(val);
            });
            document.querySelectorAll('.section input[type="number"]').forEach(inp => {
                const name = inp.closest('.section')?.innerText?.trim();
                if (!name || !(name in data)) return;
                inp.value = data[name];
            });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            console.log(`📥 Imported ${Object.keys(data).length} levels from file`);
        };
        reader.readAsText(file);
    }

    return { saveToLocal, loadFromLocal, exportToFile, importFromFile };
})();


// === Simple debounce helper (if not already present) ===
function debounce(fn, delay){
    let timer = null;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}
function showPopup(html) {
    // Create or reuse popup container
    let popup = document.getElementById('autoTickPopup');
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'autoTickPopup';
        document.body.appendChild(popup);

        // Click to close
        popup.addEventListener('click', () => {
            popup.style.opacity = '0';
            setTimeout(() => popup.style.display = 'none', 300);
        });
    }

    popup.innerHTML = html;
    popup.style.display = 'block';
    popup.style.opacity = '1';

    // Center-right positioning
    popup.style.top = '50%';
    popup.style.right = '20px';
    popup.style.transform = 'translateY(-50%)';
}


