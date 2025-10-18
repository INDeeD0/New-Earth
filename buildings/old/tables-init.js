// tables-init.js
// Initialize DataTables and provide API for rows/columns operations.

const buildingColumnMap = {
  headquarters: ["deployment limit", "deployment capacity"],
  bunker: ["unit capacity"],
  "black market": ["tech generation", "tech storage"],
  "geoponic farm": ["food generation", "food storage"],
  oilrig: ["oil generation", "oil storage"],
  "alloy refinery": ["alloy generation", "alloy storage"],
  "supply depot": ["resource storage", "resource protection"],
  "situation room": ["rally capacity", "instant deploy", "rally speed"],
  engineering: ["neutronium production bonus", "increased station unit capacity", "outpost combat bonus"],
  barracks: ["training capacity", "infantry defence bonus"],
  "research lab": ["research speed"],
  wall: ["defence capacity", "wall defence bonus"],
  "global network": ["resource trade limit", "resource trade tax"],
  "experimentation chamber": ["production capacity", "prototype defence bonus"],
  factory: ["production capacity", "vehicle defence bonus"],
  turret: ["turret attack", "facility combat bonus"],
  "medical bay": ["medical capacity", "unit health bonus"],
  "command post": ["hero protected xp", "hero bonus xp"],
  "hostile containment": ["execution reward"],
  "shard reactor": ["shard bonus"],
  airstrip: ["deployment limit", "deployment capacity", "deployment speed"],
  "satellite uplink": ["radar level", "scanning range"],
  "robotics bay": ["production capacity", "mech defence bonus"],
  "hero armoury": ["schematic rarity"],
  "alien genetics labs": ["production capacity", "alien defence bonus"]
};
const Tables = (function(Helpers){
    // constants used by other modules
    const colsDef = [
        { title: "Key", visible: false }, // 0
        { title: "<button id='removeAll' style='padding:2px 6px;'>&#x1F501</button>", orderable:false, width:"50px",
            render: function(data, type, row, meta) {
                const keyVal = Helpers.stripHtml(row && row[0] !== undefined ? row[0] : "");
                const levelVal = (row && row[2] !== undefined) ? String(row[2]) : String(meta.row);
                const uid = `${keyVal}|${levelVal}`;
                const checked = !!Totals.getCheckedMap()[uid];
                if (type === 'display') {
                    return `<input type="checkbox" class="row-checkbox" data-uid="${uid}" ${checked ? 'checked' : ''}>`;
                }
                return checked;
            }
        }, // 1 (checkbox)
        { title: "LVL" },    // 2
        { title: 'Time <input type="number" class="time-scale" style="width:40px;" step="1" min="0"> %<span class="info-icon" data-tip="Building boost">❓</span>',className: "dt-head-center"}, // 3
        { title: "Power" },    // 4
        { title: "Tech" },     // 5
        { title: "Food" },     // 6
        { title: "Oil" },      // 7
        { title: "Alloy" },    // 8
        { title: "Neutronium" }, // 9
        { title: "Alliance Credits" }, // 10
        { title: "Neutronium Crystal" }, // 11
        { title: "Classified Docs" }, // 12
        { title: "Data Disk" }, // 13
        { title: "Alien Power Core" }, // 14
        { title: "Alien Tech" }, // 15
        { title: "Alien Armor" }, // 16
        { title: "Armory Blueprints" }, // 17
        { title: "_raw", visible: false } // 18 (raw seconds)
    ];

    // expose some indexes for other modules
    const KEY_COL = 0;
    const CHECKBOX_COL = 1;
    const LEVEL_COL = 2;
    const TIME_COL = 3;
    const RAW_COL = colsDef.length - 1; // 18

    // DataTables instances (initialized later)
    let costsTable, rewardsTable, statsTable;
    const VISIBLE_ROWS = 15;

    function initDefaults(){
        $.extend(true, $.fn.dataTable.defaults, {
            autoWidth: false,
            scrollX: false
        });
    }

    function createCostsTable(checkedMapRef){
        // costsTable uses colsDef
        costsTable = $('#costsTable').DataTable({
            scrollY: "750px",
            scrollCollapse: true,
            paging: false,
            dom: 'ti',
            info: false,
            fixedHeader: true,
            ordering: false,
            autoWidth: true,
            columns: colsDef
        });

        // keep time-scale persistence when header gets cloned
        costsTable.on('draw.dt', function(){ $('.time-scale').val(currentScale); });
        return costsTable;
    }

    function createRewardsTable(missionsCheckedMapRef){
        rewardsTable = $('#rewardsTable').DataTable({
            scrollY: "800px", scrollCollapse: true, paging: false, dom: 'ti', info: false, fixedHeader: true, ordering:false,
            columns:[
                { title:"Key", visible:false },
                { title: "<button id='removeAllRewards' style='padding:2px 6px;'>&#x1F501</button>", orderable:false, width:"50px",
                  render: function(data, type, row, meta) {
                    const keyVal = Helpers.stripHtml(row && row[0] !== undefined ? row[0] : "");
                    const levelVal = (row && row[2] !== undefined) ? String(row[2]) : String(meta.row);
                    const uid = `${keyVal}|${levelVal}`;
                    const checked = !!Totals.getMissionsCheckedMap()[uid];
                    if (type === 'display') {
                        return `<input type=\"checkbox\" class=\"row-checkbox\" data-uid=\"${uid}\" ${checked ? 'checked' : ''}>`;
                    }
                    return checked;
                  }
                },
                { title:"Level" },
                { title:"Hero XP" },
                { title:"Power" },
                { title:"Tech" },
                { title:"Food" },
                { title:"Oil" },
                { title:"Alloy" },
                { title:"Neutronium" }
            ]
        });
        return rewardsTable;
    }

    function createStatsTable(){
        statsTable = $('#statsTable').DataTable({
            scrollY: "800px", scrollCollapse: true, paging: false, dom: 'ti', info: false, fixedHeader: true, ordering:false,
            columns:[
                { title:"Key", visible:false },
                { title:"Level" }
            ]
        });
        return statsTable;
    }

    function setScrollRows(dt, rows = VISIBLE_ROWS){
        try {
            if (!dt || !dt.table) { console.warn('setScrollRows: invalid DataTable'); return; }
            const $container = $(dt.table().container());
            if (!$container.length) { console.warn('setScrollRows: no container'); return; }

            const $firstCell = $container.find('tbody tr:visible:first td:visible:first');
            let rowH = $firstCell.length ? $firstCell.outerHeight() : 30;
            const height = Math.ceil(rowH * rows);

            const $scrollBody = $container.find('div.dataTables_scrollBody');
            if ($scrollBody.length) {
                $scrollBody.css({ height: height + 'px', 'max-height': height + 'px' });
            } else {
                // if there's no scroll body (no scrollY configured), nothing to set
                console.debug('setScrollRows: no dataTables scroll container found (scrollY not enabled)');
            }

            const settings = dt.settings && dt.settings()[0];
            if (settings && settings.oScroll) {
                settings.oScroll.sY = height + 'px';
            } else {
                // graceful fallback when oScroll is not present
                console.debug('setScrollRows: oScroll not present on DataTable (skip setting sY)');
            }
            try { dt.columns.adjust(); } catch(e){ /* ignore column adjust errors */ }
        } catch(e) {
            console.warn('setScrollRows: unexpected error', e);
        
    }


    const $firstCell = $(dt.table().body()).find('tr:visible:first td:visible:first');
    const rowH = $firstCell.length ? $firstCell.outerHeight() : 30;
    const height = Math.ceil(rowH * rows);
    const $scrollBody = $(dt.table().container()).find('div.dataTables_scrollBody');
    $scrollBody.css({ height: height + 'px', 'max-height': height + 'px' });

    const settings = dt.settings()[0];
    if (settings && settings.oScroll) settings.oScroll.sY = height + 'px';

    dt.columns.adjust();
    }

    // Apply the time scaling to display column only (raw kept)
    function applyScale(scale){
        costsTable.rows().every(function(){
            const d = this.data();
            const raw = Number(d[RAW_COL]) || 0;
            d[TIME_COL] = raw > 0 ? Helpers.formatTime(Math.floor(raw / (1 + scale/100))) : "-";
            this.data(d, false);
        });
        costsTable.draw(false);
        // totals depend on scale -> external totals update called by caller (Totals.updateTotals())
    }

    // Rebuild the stats table dynamically for a given building key (copied logic from original)
    // Rebuild stats table for either (buildingName, data) or (jsonKeyRaw) like original
    function rebuildStatsTableFor(buildingNameOrKey, data) {
        const bkey = (buildingNameOrKey || '').toString().toLowerCase();
        const building = data || (window.structuresSubtypes && window.structuresSubtypes[bkey]);
        if (!building) return;

        const levels = building.levels || [];
        if (!levels.length) return;

        // --- utility normalizers ---
        const cleanName = s => String(s || '')
            .toLowerCase()
            .replace(/_modifier\b|modifier\b/g, '')
            .replace(/__/g, '_')
            .replace(/^_+|_+$/g, '')
            .replace(/_/g, ' ')
            .replace(/\s{2,}/g, ' ')
            .trim();

        const pretty = s => s.replace(/\b\w/g, c => c.toUpperCase());

        // --- merge-map for subtypes → shared columns ---
        const subtypeMergeMap = {
            // Infantry
            'light infantry defense': 'Infantry Defence Bonus',
            'heavy infantry defense': 'Infantry Defence Bonus',
            'infantry defense': 'Infantry Defence Bonus',

            // Vehicle
            'light vehicle defense': 'Vehicle Defence Bonus',
            'heavy vehicle defense': 'Vehicle Defence Bonus',
            'vehicle defense': 'Vehicle Defence Bonus',

            // Mech
            'light mech defense': 'Mech Defence Bonus',
            'heavy mech defense': 'Mech Defence Bonus',
            'mech defense': 'Mech Defence Bonus',

            // Prototype
            'light prototype defense': 'Prototype Defence Bonus',
            'heavy prototype defense': 'Prototype Defence Bonus',
            'prototype defense': 'Prototype Defence Bonus',

            // Alien
            'light alien defense': 'Alien Defence Bonus',
            'heavy alien defense': 'Alien Defence Bonus',
            'alien defense': 'Alien Defence Bonus',

            // Resource buildings
            'food generation': 'Food Generation',
            'food storage': 'Food Storage',
            'oil generation': 'Oil Generation',
            'oil storage': 'Oil Storage',
            'alloy generation': 'Alloy Generation',
            'alloy storage': 'Alloy Storage'
        };

        // --- collect all subtypes ---
        const statSet = new Set();
        const attrSet = new Set();
        for (const lvl of levels) {
            if (!lvl) continue;
            (lvl.stats || []).forEach(s => s?.subtype && statSet.add(cleanName(s.subtype)));
            (lvl.attributes || []).forEach(a => a?.subtype && attrSet.add(cleanName(a.subtype)));
        }

        // --- combine and merge similar ---
        const mergedKeys = new Map();
        const allSubs = [...statSet, ...attrSet];
        allSubs.forEach(name => {
            const merged = subtypeMergeMap[name] || pretty(name);
            mergedKeys.set(name, merged);
        });

        // --- columns start with Key + Level ---
        let columns = [{ title: "Key", visible: false }, { title: "Level" }];

        // --- building-specific columns (capacity, etc.) ---
        const capacityExists = levels.some(l => typeof l.unit_capacity === 'number');
        const trainExists = levels.some(l => typeof l.production_capacity === 'number');
        if (capacityExists) columns.push({ title: "Unit Capacity" });
        if (trainExists) columns.push({ title: "Training Capacity" });

        // --- add merged subtype columns ---
        const uniqueTitles = [...new Set(mergedKeys.values())];
        uniqueTitles.forEach(t => columns.push({ title: t }));

        // --- apply buildingColumnMap filter ---
        const allowedColsList = (buildingColumnMap[bkey] || []).map(c => c.toLowerCase());
        if (allowedColsList.length > 0) {
            const allowedTitles = new Set(["key", "level", ...allowedColsList]);
            const filtered = columns.filter(c => allowedTitles.has(c.title.toLowerCase()));
            if (filtered.length > 2) columns = filtered;
        }

        // --- destroy and rebuild table ---
        if ($.fn.DataTable.isDataTable('#statsTable')) {
            const old = $('#statsTable').DataTable();
            old.clear();
            old.destroy(true);
        }
        // ensure the table element itself still exists
        if (!document.getElementById('statsTable')) {
            $('#statsContainer').append('<table id="statsTable" class="display compact" style="width:100%"></table>');
        }


        const statsTable = $('#statsTable').DataTable({
            data: [],
            columns,
            paging: false,
            searching: false,
            info: false,
            scrollY: "700px",
            scrollCollapse: true,
            dom: 'ti'
        });

        // --- helper to format a number/modifier nicely ---
        const formatVal = v => {
            if (v == null || v === 0) return '-';
            if (Math.abs(v) < 1) return (v * 100).toFixed(2).replace(/\.00$/, '') + '%';
            return Helpers.formatShort(v);
        };

        // --- populate rows ---
        levels.forEach((lvl, i) => {
            const row = [bkey, i];
            if (capacityExists) row.push(formatVal(lvl.unit_capacity));
            if (trainExists) row.push(formatVal(lvl.production_capacity));

            uniqueTitles.forEach(title => {
                // find all subtypes mapped to this title
                const matchingSubs = [...mergedKeys.entries()]
                    .filter(([_, colName]) => colName === title)
                    .map(([key]) => key);

                // search in stats + attributes
                const entries = (lvl.stats || []).concat(lvl.attributes || []);
                const found = entries.find(e => matchingSubs.includes(cleanName(e.subtype)));
                row.push(found ? formatVal(found.value ?? found.modifier) : '-');
            });

            statsTable.row.add(row);
        });

        statsTable.draw(false);
        Tables.setScrollRows(statsTable);
    }



    // Expose selected API
    return {
        initDefaults,
        createCostsTable,
        createRewardsTable,
        createStatsTable,
        setScrollRows,
        applyScale,
        rebuildStatsTableFor,
        KEY_COL, CHECKBOX_COL, LEVEL_COL, TIME_COL, RAW_COL
    };
})(Helpers);
