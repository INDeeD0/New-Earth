// tables-init.js
// Initialize DataTables and provide API for rows/columns operations.

const Tables = (function(Helpers){
    const costsCols = [
        { title: "Key", visible: false },
        {
        title: "<button id='removeAllCosts' style='padding:2px 6px;'>&#x1F501</button>", orderable: false, width: "50px",
            render: function(data, type, row, meta) {
            const keyVal = Helpers.stripHtml(row && row[0] !== undefined ? row[0] : "");
            const levelVal = (row && row[2] !== undefined) ? String(row[2]) : String(meta.row);
            const uid = `${keyVal}|${levelVal}`;
            const checked = !!Totals.getCheckedMap()[uid];
            if (type === 'display') {
                return `<input type=\"checkbox\" class=\"row-checkbox\" data-uid=\"${uid}\" ${checked ? 'checked' : ''}>`;
            }
            return checked;
            }
        },
        { title: "LVL" },             
    ];
    const missionsCols =[
        { title: "Key", visible: false },
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
        { title: "LVL" },
    ]
    const statsCols = [
        { title: "Key", visible: false },
        { title: "<button id='removeAllStats' style='padding:2px 6px;'>&#x1F501</button>", orderable:false, width:"50px",
            render: function(data, type, row, meta) {
            const keyVal = Helpers.stripHtml(row && row[0] !== undefined ? row[0] : "");
            const levelVal = (row && row[2] !== undefined) ? String(row[2]) : String(meta.row);
            const uid = `${keyVal}|${levelVal}`;
            const checked = !!Totals.getStatsCheckedMap()[uid];
            if (type === 'display') {
                return `<input type=\"checkbox\" class=\"row-checkbox\" data-uid=\"${uid}\" ${checked ? 'checked' : ''}>`;
            }
            return checked;
            }
        },
        { title: "LVL" },
        { title: 'Leather', dataKey: "crafting_leather@quantity!whole" },//3
        { title: 'Durable Fabric', dataKey: "crafting_durable_fabric@quantity@whole" },
        { title: 'Plastic', dataKey: "crafting_plastic@quantity!whole" },
        { title: 'Rubber', dataKey: "crafting_rubber@quantity!whole" },
        { title: 'Gunmetal', dataKey: "crafting_gunmetal@quantity!whole" },
        { title: 'Gunpowder', dataKey: "crafting_gunpowder@quantity!whole" },
        { title: 'Ballistic Plates', dataKey: "crafting_ballistic_plates@quantity!whole" },
        { title: 'Ceramics', dataKey: "crafting_ceramics@quantity!whole" },//10
        { title: 'Synthetic Fiber', dataKey: "crafting_synthetic_fiber@quantity!whole" },
        { title: 'Magazine', dataKey: "crafting_magazine@quantity!whole" },
        { title: 'Grip', dataKey: "crafting_grip@quantity!whole" },
        { title: 'Alien Fiber', dataKey: "crafting_alien_fiber@quantity!whole" },
        { title: 'Carbon Fiber', dataKey: "crafting_carbon_fiber@quantity!whole" },
        { title: 'Steel', dataKey: "crafting_steel@quantity!whole" },
        { title: 'Chrome Alloy', dataKey: "crafting_chrome_alloy@quantity!whole" },
        { title: 'Alien Bulwark', dataKey: "crafting_alien_bulwark@quantity!whole" },
        { title: 'Kevlar Fiber', dataKey: "crafting_kevlar_fiber@quantity!whole" },
        { title: 'Doron Plate', dataKey: "crafting_doron_plate@quantity!whole" },//20
        { title: 'Shells', dataKey: "crafting_shells@quantity!whole" },
        { title: 'Bio-Mesh', dataKey: "crafting_biomesh@quantity!whole" },
        { title: 'Reflectium', dataKey: "crafting_reflectium@quantity!whole" },
        { title: 'Titanium', dataKey: "crafting_titanium@quantity!whole" },
        { title: 'Silencer', dataKey: "crafting_silencer@quantity!whole" },
        { title: 'Scope', dataKey: "crafting_scope@quantity!whole" },
        { title: 'Power Cell', dataKey: "crafting_power_cell@quantity!whole" },
        { title: 'Alien Alloy', dataKey: "crafting_alien_alloy@quantity!whole" },
        { title: 'Xenosaur Hide', dataKey: "crafting_xenosaur_hide@quantity!whole" },
        { title: 'Xenosaur Venom', dataKey: "crafting_xenosaur_venom@quantity!whole" },//30
        { title: 'Xenosaur Fang', dataKey: "crafting_xenosaur_fang@quantity!whole" },
        { title: 'Strider Emitter', dataKey: "strider_alien_emitter@quantity!whole" },
    
    ];
    const costsColumnMap = {
        '*': [1,2],       
    };
    const missionsColumnMap = {
        '*': [1,2],     
    };
    const statsColumnMap = {
        '*': [1,2],
        gear_core_helmet:[3,4,5],
        gear_core_chest:[3,4,5],
        gear_core_boots:[3,4,6],
        gear_core_gun:[7,8],
        gear_uncommon_helmet:[3,4,9,10],
        gear_uncommon_chest:[3,4,10,11],
        gear_uncommon_boots:[3,6,10,11],
        gear_uncommon_gun:[7,8,13],        
        gear_rare_helmet:[5,11,15,16,29],  
        gear_rare_chest:[3,4,10,11,15,29],  
        gear_rare_boots:[3,6,11,16,29],  
        gear_rare_gun:[7,12,13,17,30],  
        gear_epic_helmet:[10,11,15,16,20,29],  
        gear_epic_chest:[10,11,15,19,29],  
        gear_epic_boots:[10,11,15,20,29],  
        gear_epic_gun:[12,13,16,17,21,30],  
        gear_augmented_helmet:[16,19,20,24,29],  
        gear_augmented_chest:[15,19,20,24,29],  
        gear_augmented_boots:[15,19,20,24,29],  
        gear_augmented_gun:[16,21,25,26,30],  
        gear_augmented_gun_2:[16,17,21,26,30],  
        gear_augmented_gun_3:[16,17,21,25,30],
        gear_prototype_helmet:[11,14,18,23,29],
        gear_prototype_chest:[10,14,18,23,29],
        gear_prototype_boots:[11,14,18,23,29],
        gear_storm_helm_set:[22,23,27,28,29],
        gear_storm_chest_set:[18,24,27,28,29],
        gear_storm_boots_set:[22,24,27,28,29],
        gear_storm_gun_set:[21,26,27,28,30],
        gear_prototype_helm_neural:[23,27,28,29,31],
        gear_prototype_chest_neural:[22,24,27,28,29,30,31],
        gear_prototype_boots_neural:[22,23,24,28,29,30,31],
        gear_prototype_gun_neural:[26,27,28,30,31],
        gear_vanguard_helm:[23,27,28,29,31,32],
        gear_vanguard_chest:[18,22,24,27,28,32],
        gear_vanguard_boots:[14,23,24,28,29,32],
        gear_vanguard_gun:[26,27,28,30,31,32],              
    };

    // expose some indexes for other modules
    const KEY_COL = 0;
    const CHECKBOX_COL = 1;
    const LEVEL_COL = 2;
    const TIME_COL = 3;

    // DataTables instances (initialized later)
    const VISIBLE_ROWS = 4;

    function initDefaults(){
        $.extend(true, $.fn.dataTable.defaults, {
            autoWidth: false,
            scrollX: false
        });
    }
    function createAllCostsTables(structures,){
        const tables = {};
        const $masterContainer = $('#costsMasterContainer');

        Object.keys(structures).forEach(key => {
            const safeKey = key.toLowerCase().replace(/[\s_]/g, '');
            const wrapperId = `costsWrapper-${safeKey}`;
            const tableId   = `costsTable-${safeKey}`;

            // 🧹 if table already exists, reuse existing DataTable
            if ( $.fn.DataTable.isDataTable(`#${tableId}`) ) {
                tables[safeKey] = $(`#${tableId}`).DataTable();
                return; // skip reinit
            }

            // otherwise create fresh wrapper/table
            const $wrapper = $(`
            <div class="costsWrapper table-wrapper" id="${wrapperId}" style="display:none">
                <table id="${tableId}" class="display_compact_stripe" style="width:100%"></table>
                </div>
            `);
            $masterContainer.append($wrapper);

            const dt = $(`#${tableId}`).DataTable({
                scrollCollapse: true,
                paging: false,
                dom: 'ti',
                info: false,
                fixedHeader: false,
                ordering: false,
                autoWidth: false,
                columns: costsCols,
                scrollY: '0px',
            });

            tables[safeKey] = dt;
        });

        console.log(`✅ Created ${Object.keys(tables).length} cost tables`);
        return tables;
    }
    function createAllMissionsTables(structures,) {
        const tables = {};
        const $masterContainer = $('#missionsMasterContainer'); // create this div in HTML

        Object.keys(structures).forEach(key => {
            const safeKey = key.toLowerCase().replace(/[\s_]/g, '');
            const wrapperId = `rewardsWrapper-${safeKey}`;
            const tableId = `rewardsTable-${safeKey}`;

            if ($.fn.DataTable.isDataTable(`#${tableId}`)) {
                tables[safeKey] = $(`#${tableId}`).DataTable();
                return;
            }

            const $wrapper = $(`
                <div class="rewardsWrapper table-wrapper" id="${wrapperId}" style="display:none">
                    <table id="${tableId}" class="display_compact_stripe" style="width:100%"></table>
                </div>
            `);
            $masterContainer.append($wrapper);

            const dt = $(`#${tableId}`).DataTable({
                scrollCollapse: true,
                paging: false,
                dom: 'ti',
                info: false,
                fixedHeader: false,
                ordering: false,
                autoWidth: false,
                columns: missionsCols,
                scrollY: '0px',
            });

            tables[safeKey] = dt;
        });

        console.log(`✅ Created ${Object.keys(tables).length} mission tables`);
        return tables;
    }
    function createAllStatsTables(structures) {
        const tables = {};
        const $masterContainer = $('#statsMasterContainer');

        Object.keys(structures).forEach(key => {
            const safeKey = key.toLowerCase().replace(/[\s_]/g, '');
            const wrapperId = `statsWrapper-${safeKey}`;
            const tableId = `statsTable-${safeKey}`;

            if ($.fn.DataTable.isDataTable(`#${tableId}`)) {
                tables[safeKey] = $(`#${tableId}`).DataTable();
                return;
            }

            const $wrapper = $(`
                <div class="statsWrapper table-wrapper" id="${wrapperId}" style="display:none">
                    <table id="${tableId}" class="display_compact_stripe" style="width:100%"></table>
                </div>
            `);
            $masterContainer.append($wrapper);

            const dt = $(`#${tableId}`).DataTable({
                scrollCollapse: true,
                paging: false,
                dom: 'ti',
                info: false,
                fixedHeader: false,
                ordering: false,
                autoWidth: false,
                columns: statsCols,
                scrollY: '0px',
            });

            tables[safeKey] = dt;
        });

        console.log(`✅ Created ${Object.keys(tables).length} stats tables`);
        return tables;
    }
    function populateAllCostsTables(structures, checkedMapRef) {
        for (const [rawKey, structure] of Object.entries(structures)) {
            const key = rawKey.toLowerCase().replace(/[\s_]/g, '');
            const dt = Tables.allCostsTables[key];
            if (!dt) continue;

            dt.clear();
            applyColumnVisibility(dt, costsColumnMap, rawKey);

            if (!structure || !Array.isArray(structure.levels)) continue;

            structure.levels.forEach((lvl, lvlIdx) => {
                if (!lvl || lvlIdx === 0) return;

                const uid = `${rawKey}|${lvlIdx}`;
                const checked = !!checkedMapRef?.[uid];

                // base row (must match column count)
                const row = Array(costsCols.length).fill('-');
                row[0] = rawKey;
                row[1] = checked;
                row[2] = lvlIdx;

                for (let col = 3; col < costsCols.length; col++) {
                    const colDef = costsCols[col];
                    const fullKey = (colDef.dataKey || '').toLowerCase();
                    if (!fullKey) continue;

                    let val = null;
                    try {
                        val = Helpers.lookup.lookupValue(lvl, fullKey);
                    } catch (e) {
                        val = null;
                    }

                    row[col] = Helpers.formatValue(val, fullKey, lvl);
                }

                try { dt.row.add(row); }
                catch (e) { console.warn('costs dt.row.add failed', e); }
            });

            dt.draw(false);
            Tables.setScrollRows(dt);
            try { dt.columns.adjust(); } catch(e){}
        }

        console.log("✅ Populated all costs tables");
    }
    function populateAllMissionsTables(structures, missionsCheckedMapRef = {}) {
        for (const [rawKey, structure] of Object.entries(structures)) {
            const key = rawKey.toLowerCase().replace(/[\s_]/g, '');
            const dt = Tables.allMissionsTables[key];
            if (!dt) continue;

            dt.clear();
            applyColumnVisibility(dt, missionsColumnMap, rawKey);

            if (!structure || !Array.isArray(structure.levels)) continue;

            structure.levels.forEach((lvl, lvlIdx) => {
                if (!lvl || lvlIdx === 0) return;

                const uid = `${rawKey}|${lvlIdx}`;
                const checked = !!missionsCheckedMapRef?.[uid];

                const row = Array(missionsCols.length).fill('-');
                row[0] = rawKey;
                row[1] = checked;
                row[2] = lvlIdx;

                for (let col = 3; col < missionsCols.length; col++) {
                    const colDef = missionsCols[col];
                    const fullKey = (colDef.dataKey || '').toLowerCase();
                    if (!fullKey) continue;

                    let val = null;
                    try {
                        val = Helpers.lookup.lookupValue(lvl, fullKey);
                    } catch (e) {
                        val = null;
                    }

                    row[col] = Helpers.formatValue(val, fullKey, lvl);
                }

                try { dt.row.add(row); }
                catch (e) { console.warn('missions dt.row.add failed', e); }
            });

            dt.draw(false);
            Tables.setScrollRows(dt);
            try { dt.columns.adjust(); } catch(e){}
        }

        console.log("✅ Populated all missions tables");
    }
    function populateAllStatsTables(structures, statsCheckedMapRef = {}) {
        for (const [rawKey, structure] of Object.entries(structures)) {
            const key = rawKey.toLowerCase().replace(/[\s_]/g, '');
            const dt = Tables.allStatsTables[key];
            if (!dt) continue;

            dt.clear();
            applyColumnVisibility(dt, statsColumnMap, rawKey);

            if (!structure || !Array.isArray(structure.levels)) continue;

            structure.levels.forEach((lvl, lvlIdx) => {
                if (!lvl || lvlIdx === 0) return;

                const uid = `${rawKey}|${lvlIdx}`;
                const checked = !!statsCheckedMapRef?.[uid];

                const row = Array(statsCols.length).fill('-');
                row[0] = rawKey; 
                row[1] = checked;   
                row[2] = lvlIdx;   

                for (let col = 3; col < statsCols.length; col++) {
                    const colDef = statsCols[col];
                    const fullKey = (colDef.dataKey || '').toLowerCase();
                    if (!fullKey) continue;

                    let val = null;
                    try {
                        val = Helpers.lookup.lookupValue(lvl, fullKey);
                    } catch (e) {
                        val = null;
                    }

                    row[col] = Helpers.formatValue(val, fullKey, lvl);
                }

                try {
                    dt.row.add(row);
                } catch (e) {
                    console.warn('stats dt.row.add failed', e);
                }
            });

            dt.draw(false);
            Tables.setScrollRows(dt);
            try { dt.columns.adjust(); } catch (e) {}
        }

        console.log("✅ Populated all stats tables");
    }
    function applyColumnVisibility(dt, map, rawKey) {
        if (!dt || !map) return;

        const normalized = rawKey.toLowerCase().replace(/[\s_]/g, '');

        // 👇 wildcard columns (apply to all)
        const baseCols = map['*'] || [];

        // 👇 exact or normalized match
        let specificCols = map[normalized];
        if (!specificCols) {
            const matchKey = Object.keys(map).find(
                k => k !== '*' && k.replace(/[\s_]/g, '') === normalized
            );
            specificCols = matchKey ? map[matchKey] : [];
        }

        // 👇 final visible columns = ONLY what's listed
        const visibleCols = [...new Set([...baseCols, ...specificCols])];

        const colCount = dt.columns().count();

        // 🔒 hide EVERYTHING first
        for (let i = 0; i < colCount; i++) {
            try { dt.column(i).visible(false, false); } catch(e){}
        }

        // 👀 show only listed columns
        visibleCols.forEach(i => {
            if (Number.isInteger(i) && i >= 0 && i < colCount) {
                try { dt.column(i).visible(true, false); } catch(e){}
            }
        });

        try { dt.columns.adjust(false); } catch(e){}
    }
    function setScrollRows(dt, rows = VISIBLE_ROWS){
        if (!dt || typeof dt.settings !== "function" || !dt.settings().length) {
            console.debug('setScrollRows: DataTable not ready'); 
            return;
        }
        // measure and cache row height per DataTable instance
        if (dt._rowHeight == null || dt._rowHeight < 10) {
            const $firstCell = $(dt.table().body()).find('tr:visible:first td:visible:first');
            const measured = $firstCell.length ? $firstCell.outerHeight() : 0;
            if (measured && measured >= 10) dt._rowHeight = measured;
        }
        const baseRow = (dt._rowHeight && dt._rowHeight >= 10) ? dt._rowHeight : 32; // safe fallback
        const height = Math.ceil(baseRow * rows);
        const $scrollBody = $(dt.table().container()).find('div.dataTables_scrollBody');
        if ($scrollBody.length) $scrollBody.css({ height: height + 'px', 'max-height': height + 'px' });
        const settings = dt.settings()[0];
        if (settings && settings.oScroll) settings.oScroll.sY = height + 'px';
        try { dt.columns.adjust(); } catch(e){/* ignore */ }
    }
    function applyScaleForTable(dt, scale) {
        if (!dt) return;
        dt.rows().every(function() {
            const d = this.data();
            if (!d || !d._rawTime) return;
            const rawVal = d._rawTime[Tables.TIME_COL];
            if (rawVal !== undefined) {
                const scaled = rawVal > 0
                    ? Helpers.formatTime(Math.floor(rawVal / (1 + scale / 100)))
                    : "-";
                d[Tables.TIME_COL] = scaled;
                this.data(d, false);
            }
        });
        dt.draw(false);
        if (typeof Totals.updateCostsTotals === "function") {
            Totals.updateCostsTotals(scale);
        }
    }
    function applyScale(scale) {
        if (!Tables.allCostsTables) return;

        // Find the active (visible) building and map to data key
        const activeSection = $('.section.active').text().trim();
        if (!activeSection) return;

        const keyMap = window.loadedKeyMap || window.keyMap || {};
        let mapped = keyMap[activeSection] || activeSection;
        let safeKey = mapped.toLowerCase().replace(/[\s_]/g, '');
        // Fuzzy match if direct match not present
        if (!Tables.allCostsTables[safeKey]) {
            const keys = Object.keys(Tables.allCostsTables);
            const exact = keys.find(k => k === safeKey);
            const contains = exact || keys.find(k => k.includes(safeKey));
            const containedBy = contains || keys.find(k => safeKey.includes(k));
            if (containedBy) safeKey = containedBy;
        }
        const dt = Tables.allCostsTables?.[safeKey];
        if (!dt) return;

        applyScaleForTable(dt, scale);
    }

    // Expose selected API
    return {
        initDefaults,
        createAllCostsTables,
        createAllMissionsTables,
        createAllStatsTables,    
        populateAllCostsTables,
        populateAllMissionsTables,
        populateAllStatsTables,    
        setScrollRows,
        applyScale,
        applyScaleForTable,
        applyColumnVisibility,        
        KEY_COL, CHECKBOX_COL, LEVEL_COL, TIME_COL,
    };
})(Helpers);
