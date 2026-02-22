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
        { title: "Infantry Productoin Speed", dataKey: "light_infantry_produce_speed_modifier@modifier!percent2" },//2
        { title: 'Food Production Bonus', dataKey: "currency4_generate_modifier@modifier!percent2" },//3
        { title: 'Construction Speed', dataKey: "structure_speed_modifier@modifier!percent2" },
        { title: 'Research Speed', dataKey: "research_speed_modifier@modifier!percent2" },
        { title: 'Factory Production Speed', dataKey: "vehicle_produce_speed_modifier@modifier!percent2" },
        { title: 'Alloy Production Bonus', dataKey: "currency6_generate_modifier@modifier!percent2" },
        { title: 'Oil Production Bonus', dataKey: "currency5_generate_modifier@modifier!percent2" },
        { title: 'Defense Production Speed', dataKey: "basic_defense_produce_speed_modifier@modifier!percent2" },
        { title: 'Neutronium Production Bonus', dataKey: "currency7_generate_modifier@modifier!percent2" },//10
        { title: 'Tech Production Bonus', dataKey: "currency3_generate_modifier@modifier!percent2" },
        { title: 'Defense Effectiveness', dataKey: "basic_defense_attack_modifier@modifier!percent2" },
        { title: 'Gathering Loot Chance', dataKey: "hero_reward_modifier@modifier!percent2" },
        { title: 'Gathering Speed', dataKey: "march_gather_modifier@modifier!percent2" },
        { title: 'Light Infantry Attack', dataKey: "light_infantry_attack_modifier@modifier!percent2" },
        { title: 'Heavy Infantry Attack', dataKey: "heavy_infantry_attack_modifier@modifier!percent2" },
        { title: 'Ground Vehicle Attack', dataKey: "vehicle_attack_modifier@modifier!percent2" },
        { title: 'Air Vehicle Attack', dataKey: "air_attack_modifier@modifier!percent2" },
        { title: 'Infantry Defense', dataKey: "light_infantry_defense_modifier@modifier!percent2" },
        { title: 'Vehicle Defense', dataKey: "vehicle_defense_modifier@modifier!percent2" },//20
        { title: 'Combat Veteran', dataKey: "hero_city_unit_attack_modifier@modifier!percent2" },
        { title: 'Unit Health', dataKey: "light_infantry_health_modifier@modifier!percent2" },
        { title: 'Invader Energy Cost Reduction', dataKey: "hunt_energy_modifier@modifier!percent2" },
        { title: 'Hero Energy Regen per Minute', dataKey: "hero_energy_regen@value@whole" },
        { title: 'Hero Invader Attack', dataKey: "hero_monster_attack_modifier@modifier!percent2" },
        { title: 'Hero Invader Chain Attacks', dataKey: "hero_hunting_chain@value@whole" },
        { title: 'Hero Max Energy', dataKey: "hero_max_energy@value@whole" },
        { title: 'Hero Invader Speed', dataKey: "hunt_incoming_speed_modifier@modifier!percent2" },
        { title: 'Defeated Invader Bonus Energy', dataKey: "hunt_defeated_energy_restore@value@whole" },
        { title: 'Invader Double Reward Chance', dataKey: "hunt_bonus_reward_modifier@modifier!percent2" },//30
        { title: "Requirements",dataKey: "requirements!requirements"},
    ];
    const costsColumnMap = {
        '*': [1,2],        
    };
    const missionsColumnMap = {
        '*': [1,2],
    };
    const statsColumnMap = {
        '*': [2,32],
        hero_skill_troop_production_1: [3],
        hero_skill_food_production_1: [4],
        hero_skill_alloy_production_1:[8],
        hero_skill_oil_production_1:[9],//
        hero_skill_tech_production_1:[12],
        hero_skill_neutronium_production_1:[11],
        hero_skill_food_production_2:[4],
        hero_skill_oil_production_2:[9],
        hero_skill_alloy_production_2:[8],
        hero_skill_tech_production_2:[12],
        hero_skill_neutronium_production_2:[11],
        hero_skill_food_production_3:[4],
        hero_skill_alloy_production_3:[8],
        hero_skill_oil_production_3:[9],
        hero_skill_tech_production_3:[12],
        hero_skill_neutronium_production_3:[11],
        hero_skill_construction_1:[5],
        hero_skill_research_1:[6],
        hero_skill_gatherer_1:[15],
        hero_skill_gathering_loot:[14],
        hero_skill_construction_2:[5],
        hero_skill_research_2:[6],
        hero_skill_gatherer_2:[15],
        hero_skill_factory_production_1:[7],
        hero_skill_light_infantry_attack_1:[16],
        hero_skill_heavy_infantry_attack_1:[17],
        hero_skill_ground_vehicle_attack_1:[18],
        hero_skill_air_vehicle_attack_1:[19],
        hero_skill_infantry_defense_1:[20],
        hero_skill_vehicle_defense_1:[21],
        hero_skill_defense_production_1:[10],
        hero_skill_defense_effectiveness_1:[13],
        hero_skill_combat_veteran:[22],
        hero_skill_troop_production_2:[3],
        hero_skill_factory_production_2:[7],
        hero_skill_light_infantry_attack_2:[16],
        hero_skill_ground_vehicle_attack_2:[18],
        hero_skill_heavy_infantry_attack_2:[17],
        hero_skill_air_vehicle_attack_2:[19],
        hero_skill_defense_production_2:[10],
        hero_skill_infantry_defense_2:[20],
        hero_skill_vehicle_defense_2:[21],
        hero_skill_defense_effectiveness_2:[13],
        hero_skill_determination:[23],
        hero_skill_energy_usage_1:[24],
        hero_skill_energy_usage_2:[24],
        hero_skill_energy_usage_3:[24],
        hero_skill_energy_restoration_1:[25],
        hero_skill_energy_restoration_2:[25],
        hero_skill_speed_1:[29],
        hero_skill_speed_2:[29],
        hero_skill_attack_1:[26],
        hero_skill_attack_2:[26],
        hero_skill_max_energy_1:[28],
        hero_skill_max_energy_2:[28],
        hero_skill_max_energy_3:[28],
        hero_skill_sustained_attack_1:[27],
        hero_skill_sustained_attack_2:[27],
        hero_skill_loot_chance_increase_1:[31],
        hero_skill_loot_chance_increase_2:[31],
        hero_skill_bonus_energy:[30],                               
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
