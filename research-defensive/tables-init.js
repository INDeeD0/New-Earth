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
        { title:"LVL" },// 2
        {title: `
            <div class="headflex">
                <img src="pictures/Time.png" class="col-icon">
                <input type="number" class="time-scale" style="width:40px;" step="1" min="0"> %
                <span class="info-icon" data-tip="Building boost">❓</span>
            </div>
        `,
        className: "dt-head-center",
        dataKey: "upgrade_cost!time"},
        { title:'<img src="pictures/Power.png" class="col-icon">', dataKey: "power!power" },// 4
        { title:'<img src="pictures/Tech.png" class="col-icon">', dataKey: "currency3@quantity!whole2" },// 5
        { title:'<img src="pictures/Food.png" class="col-icon">', dataKey: "currency4@quantity!whole2" },// 6
        { title:'<img src="pictures/Oil.png" class="col-icon">', dataKey: "currency5@quantity!whole2" },// 7
        { title:'<img src="pictures/Alloy.png" class="col-icon">', dataKey: "currency6@quantity!whole2" },// 8
        { title:'<img src="pictures/Neut.png" class="col-icon">', dataKey: "currency7@quantity!whole2" }, // 9
        { title:'<img src="pictures/Alien Augment.png" class="col-icon">', dataKey: "megaship_alien_augment@quantity!whole2" }, // 10
        { title:'<img src="pictures/Dark Matter.png" class="col-icon">', dataKey: "core_dark_matter@quantity!whole2"}, // 11
        { title:'<img src="pictures/Specialized Circuitry.png" class="col-icon">', dataKey: "core_neutron_circuitry@quantity!whole2" }, // 12
        { title:"Data Disk", dataKey: "core_data_disk@quantity"}, // 13
        { title:"Alien Power Core", dataKey: "core_alien_power_core@quantity"}, // 14
        { title:"Alien Tech", dataKey: "core_alien_component@quantity"}, // 15 used
        { title:"Alien Armor", dataKey: "core_alien_armor@quantity"}, // 16
        { title:"Armory Blueprints", dataKey: "armory_blueprints@quantity"}, // 17
        { title:"Buildings", dataKey: "requirements!requirements"}, // 18        
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
        { title: "Stationed Units Limit", dataKey: "march_stationed_units_limit@value!whole" },//3
        { title: "Troop Research", dataKey: "unlocked@modifier" },        
        { title: "Turret Attack", dataKey: "structure_attack_modifier@modifier!percent2" },
        { title: "Defense Salvage (Tier 1)", dataKey: "static_tier1_unit_save_modifier@modifier!percent2" },
        { title: 'Defense Strategist <span class="info-icon" data-tip="Basic,Advanced,Air,Experimental Attack">❓</span>', dataKey: "basic_defense_attack_modifier@modifier!percent2" },
        { title: 'Reinforced Fortifications <span class="info-icon" data-tip="Basic,Advanced,Air,Experimental Defense">❓</span>', dataKey: "basic_defense_defense_modifier@modifier!percent2" },
        { title: "Defense Salvage (Tier 2)", dataKey: "static_tier2_unit_save_modifier@modifier!percent2" },
        { title: "Defense Salvage (Tier 3)", dataKey: "static_tier3_unit_save_modifier@modifier!percent2" },
        { title: "Defense Salvage (Tier 4)", dataKey: "static_tier4_unit_save_modifier@modifier!percent2" },
        { title: "Defense Salvage (Tier 5)", dataKey: "static_tier5_unit_save_modifier@modifier!percent2" },
        { title: "Defense Salvage (Tier 6)", dataKey: "static_tier6_unit_save_modifier@modifier!percent2" },
    ];
    const costsColumnMap = {
        '*': [1,2,32],
        defensivefortifieddefenses:[1,2,3,4,5,6,7,8,9,18],
        defensiveturretattack:[1,2,3,4,5,6,7,8,9,18],
        defensiveunlockbuckshot:[1,2,3,4,5,6,7,8,9,18],
        defensiveheavyammunition:[1,2,3,4,5,6,7,8,9,18],
        defensivearmorpiercingammunition:[1,2,3,4,5,6,7,8,9,18],
        defensivehighexplosiveammunition:[1,2,3,4,5,6,7,8,9,18],
        defensivedefensesalvaging_1:[1,2,3,4,5,6,7,8,9,18],
        defensiveunlockbiogrenades:[1,2,3,4,5,6,7,8,9,18],
        defensiveunlockfraggrenades:[1,2,3,4,5,6,7,8,9,18],
        defensiveunlockcaltrops:[1,2,3,4,5,6,7,8,9,18],
        defensiveunlockflaklaunchers:[1,2,3,4,5,6,7,8,9,18],
        defensivedefensestrategist:[1,2,3,4,5,6,7,8,9,18],
        defensivereinforcedfortifications:[1,2,3,4,5,6,7,8,9,18],
        defensivedefensesalvaging_2:[1,2,3,4,5,6,7,8,9,18],
        defensiverazorwire:[1,2,3,4,5,6,7,8,9,18],
        defensiveairburstrounds:[1,2,3,4,5,6,7,8,9,18],
        defensiveantivehiclemines:[1,2,3,4,5,6,7,8,9,18],
        defensivecombatdrone:[1,2,3,4,5,6,7,8,9,18],
        defensivedefensesalvaging_3:[1,2,3,4,5,6,7,8,9,18],
        defensivephosporusammunition:[1,2,3,4,5,6,7,8,9,18],
        defensivelaserammunition:[1,2,3,4,5,6,7,8,9,18],
        defensivehighvelocityammunition:[1,2,3,4,5,6,7,8,9,18],
        defensiveelectromagneticpulseammunition:[1,2,3,4,5,6,7,8,9,18],
        defensivedefensesalvaging_4:[1,2,3,4,5,6,7,8,9,18],
        defensiveflamethrowers:[1,2,3,4,5,6,7,8,9,18],
        defensivemortarrounds:[1,2,3,4,5,6,7,8,9,18],
        defensiverocketpropelledgrenades:[1,2,3,4,5,6,7,8,9,18],
        defensivesurfacetoairmissiles:[1,2,3,4,5,6,7,8,9,18],
        defensivedefensesalvaging_5:[1,2,3,4,5,6,7,8,9,18],
        defensivedefensesalvaging_6:[1,2,3,4,5,6,7,8,9,18],
        defensivethermitegrenades:[1,2,3,4,5,6,7,8,9,11,18],
        defensiveclaymoremines:[1,2,3,4,5,6,7,8,9,11,18],
        defensiveelectricfence:[1,2,3,4,5,6,7,8,9,11,18],
        defensivemissilebattery:[1,2,3,4,5,6,7,8,9,11,18],
        defensivedefensestrategist2:[1,2,3,4,5,6,7,8,9,18],              
    };
    const missionsColumnMap = {
        '*': [1,2,32],     
    };
    const statsColumnMap = {
        '*': [2],
        defensivefortifieddefenses:[3],//defensive start
        defensiveturretattack:[5],
        defensiveunlockbuckshot:[4],
        defensiveheavyammunition:[4],
        defensivearmorpiercingammunition:[4],
        defensivehighexplosiveammunition:[4],
        defensivedefensesalvaging_1:[6],
        defensiveunlockbiogrenades:[4],
        defensiveunlockfraggrenades:[4],
        defensiveunlockcaltrops:[4],
        defensiveunlockflaklaunchers:[4],
        defensivedefensestrategist:[7],
        defensivereinforcedfortifications:[8],
        defensivedefensesalvaging_2:[9],
        defensiverazorwire:[4],
        defensiveairburstrounds:[4],
        defensiveantivehiclemines:[4],
        defensivecombatdrone:[4],
        defensivedefensesalvaging_3:[10],
        defensivephosporusammunition:[4],
        defensivelaserammunition:[4],
        defensivehighvelocityammunition:[4],
        defensiveelectromagneticpulseammunition:[4],
        defensivedefensesalvaging_4:[11],
        defensiveflamethrowers:[4],
        defensivemortarrounds:[4],
        defensiverocketpropelledgrenades:[4],
        defensivesurfacetoairmissiles:[4],
        defensivedefensesalvaging_5:[12],
        defensivedefensesalvaging_6:[13],
        defensivethermitegrenades:[4],
        defensiveclaymoremines:[4],
        defensiveelectricfence:[4],
        defensivemissilebattery:[4],
        defensivedefensestrategist2:[7],                          
    };

    // expose some indexes for other modules
    const KEY_COL = 0;
    const CHECKBOX_COL = 1;
    const LEVEL_COL = 2;
    const TIME_COL = 3;

    // DataTables instances (initialized later)
    const VISIBLE_ROWS = 12;

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
                    } catch (e) { val = null; }

                    // ✅ store raw time for the TIME_COL
                    if (col === Tables.TIME_COL) {
                        if (!row._rawTime) row._rawTime = {};
                        row._rawTime[col] = Number(val) || 0;
                        val = row._rawTime[col] > 0
                            ? Helpers.formatTime(Math.floor(row._rawTime[col] / (1 + window.currentScale / 100)))
                            : "-";
                    }
                    const prevLvl = structure.levels[lvlIdx - 1] || null;
                    row[col] = Helpers.formatValue(val, fullKey, lvl, { prevLvl });
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
    
    function storeRawTimeForTable(dt, colIndex) {
        dt.rows().every(function() {
            const row = this.data();
            if (!row) return;

            if (!row._rawTime) row._rawTime = {};
            const val = Number(row[colIndex]) || 0;
            row._rawTime[colIndex] = val;
        });
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
            const row = this.data();
            if (!row || !row._rawTime) return;

            const rawVal = row._rawTime[Tables.TIME_COL];
            if (rawVal !== undefined) {
                row[Tables.TIME_COL] = rawVal > 0
                    ? Helpers.formatTime(Math.floor(rawVal / (1 + scale / 100)))
                    : "-";

                this.data(row, false); // update row but don’t redraw yet
            }
        });

        dt.draw(false); // redraw table once
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
