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
        { title:'<img src="pictures/Power.png" class="col-icon">', dataKey: "power!whole2" },// 4
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
        { title:'<img src="pictures/Alien Tech.png" class="col-icon">', dataKey: "core_alien_component@quantity!whole2"}, // 15
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
        { title: "Detail Available", dataKey: "scout_level@value!whole" },//offensive start
        { title: 'Unit Production Speed <span class="info-icon" data-tip="Light Infantry, Heavy Infantry">❓</span>', dataKey: "light_infantry_produce_speed_modifier@modifier!percent2" },//2
        { title: 'Factory Production Speed <span class="info-icon" data-tip="Vehicle, Air">❓</span>', dataKey: "vehicle_produce_speed_modifier@modifier!percent2" },//3
        { title: "Light Infantry Attack", dataKey: "light_infantry_attack_modifier@modifier!percent2" },
        { title: "Heavy Infantry Attack", dataKey: "heavy_infantry_attack_modifier@modifier!percent2" },
        { title: "Ground Vehicle Attack", dataKey: "vehicle_attack_modifier@modifier!percent2" },
        { title: "Air Vehicle Attack", dataKey: "air_attack_modifier@modifier!percent2" },
        { title: "Light Infantry Defense", dataKey: "light_infantry_defense_modifier@modifier!percent2" },
        { title: "Heavy Infantry Defense", dataKey: "heavy_infantry_defense_modifier@modifier!percent2" },//10
        { title: "Ground Vehicle Defense", dataKey: "vehicle_defense_modifier@modifier!percent2" },
        { title: "Air Vehicle Defense", dataKey: "air_defense_modifier@modifier!percent2" },
        { title: "Troop Research", dataKey: "unlocked@modifier" },
        { title: "Light Infantry Health", dataKey: "light_infantry_health_modifier@modifier!percent2" },
        { title: "Heavy Infantry Health", dataKey: "heavy_infantry_health_modifier@modifier!percent2" },
        { title: "Ground Vehicle Health", dataKey: "vehicle_health_modifier@modifier!percent2" },
        { title: "Air Vehicle Health", dataKey: "air_health_modifier@modifier!percent2" },
        { title: 'Deployment Tactics <span class="info-icon" data-tip="Light, Heavy, Ground, Air Attack">❓</span>', dataKey: "light_infantry_attack_modifier@modifier!percent2" },
        { title: 'Reactive Armor <span class="info-icon" data-tip="Light, Heavy, Ground, Air Defense">❓</span>', dataKey: "light_infantry_defense_modifier@modifier!percent2" },
        { title: "Hero Deployment Attack Bonus", dataKey: "hero_march_unit_attack_modifier@modifier!percent2" },//20
        { title: "Hero Deployment Defense Bonus", dataKey: "hero_march_unit_defense_modifier@modifier!percent2" },
        { title: "Light/Heavy Infantry Speed", dataKey: "light_infantry_speed_modifier@modifier!percent2" },
        { title: "Ground/Air Vehicle Speed", dataKey: "vehicle_speed_modifier@modifier!percent2" },
        { title: 'Resilient Infantry <span class="info-icon" data-tip="Light, Heavy Health">❓</span>', dataKey: "light_infantry_health_modifier@modifier!percent2" },
        { title: 'Adaptive Circuitry <span class="info-icon" data-tip="Ground, Air Health">❓</span>', dataKey: "vehicle_health_modifier@modifier!percent2" },
        { title: 'Advanced Stamina <span class="info-icon" data-tip="Light, Heavy Speed">❓</span>', dataKey: "light_infantry_speed_modifier@modifier!percent2" },
        { title: 'Advanced Engines <span class="info-icon" data-tip="Ground, Air Speed">❓</span>', dataKey: "vehicle_speed_modifier@modifier!percent2" },
    ];
    const costsColumnMap = {
        '*': [1,2],
        offensivescouting:[1,2,3,4,5,6,7,8,9,18],
        offensivetrooptraining:[1,2,3,4,5,6,7,8,9,18],
        offensiveautomatedfactories:[1,2,3,4,5,6,7,8,9,18],
        offensivelightinfantryattack:[1,2,3,4,5,6,7,8,9,18],
        offensiveheavyinfantryattack:[1,2,3,4,5,6,7,8,9,18],
        offensivegroundvehicleattack:[1,2,3,4,5,6,7,8,9,18],
        offensiveairvehicleattack:[1,2,3,4,5,6,7,8,9,18],
        offensivelightinfantrydefense:[1,2,3,4,5,6,7,8,9,18],
        offensiveheavyinfantrydefense:[1,2,3,4,5,6,7,8,9,18],
        offensivegroundvehicledefense:[1,2,3,4,5,6,7,8,9,18],
        offensiveairvehicledefense:[1,2,3,4,5,6,7,8,9,18],
        offensiveunlocklightinfantrytier2:[1,2,3,4,5,6,7,8,9,18],
        offensiveunlockheavyinfantrytier2:[1,2,3,4,5,6,7,8,9,18],
        offensiveunlockgroundvehicletier2:[1,2,3,4,5,6,7,8,9,18],
        offensiveunlockairvehicletier2:[1,2,3,4,5,6,7,8,9,18],
        offensivefirstaid:[1,2,3,4,5,6,7,8,9,18],
        offensiveheavyarmor:[1,2,3,4,5,6,7,8,9,18],
        offensivefieldrepairs:[1,2,3,4,5,6,7,8,9,18],
        offensiveredundantsystems:[1,2,3,4,5,6,7,8,9,18],
        offensiveunlocklightinfantrytier3:[1,2,3,4,5,6,7,8,9,18],
        offensiveunlockheavyinfantrytier3:[1,2,3,4,5,6,7,8,9,18],
        offensiveunlockgroundvehicletier3:[1,2,3,4,5,6,7,8,9,18],
        offensiveunlockairvehicletier3:[1,2,3,4,5,6,7,8,9,18],
        offensivedeploymenttactics:[1,2,3,4,5,6,7,8,9,18],
        offensivereactivearmor:[1,2,3,4,5,6,7,8,9,18],
        offensiveunlocklightinfantrytier4:[1,2,3,4,5,6,7,8,9,15,18],
        offensiveunlockheavyinfantrytier4:[1,2,3,4,5,6,7,8,9,15,18],
        offensiveunlockgroundvehicletier4:[1,2,3,4,5,6,7,8,9,15,18],
        offensiveunlockairvehicletier4:[1,2,3,4,5,6,7,8,9,15,18],
        offensiveherotroopattack:[1,2,3,4,5,6,7,8,9,18],
        offensiveherotroopdefense:[1,2,3,4,5,6,7,8,9,18],
        offensiveimprovedstamina:[1,2,3,4,5,6,7,8,9,18],
        offensiveunlocklightinfantrytier5:[1,2,3,4,5,6,7,8,9,15,18],
        offensiveunlockheavyinfantrytier5:[1,2,3,4,5,6,7,8,9,15,18],
        offensiveimprovedengines:[1,2,3,4,5,6,7,8,9,18],
        offensiveunlockgroundvehicletier5:[1,2,3,4,5,6,7,8,9,15,18],
        offensiveunlockairvehicletier5:[1,2,3,4,5,6,7,8,9,15,18],
        offensiveresilientinfantry:[1,2,3,4,5,6,7,8,9,18],
        offensiveadaptivecircuitry:[1,2,3,4,5,6,7,8,9,18],
        offensiveadvancedstamina:[1,2,3,4,5,6,7,8,9,18],
        offensiveadvancedengines:[1,2,3,4,5,6,7,8,9,18],
        offensivegroundvehicleattack2:[1,2,3,4,5,6,7,8,9,18],
        offensivegroundvehicledefense2:[1,2,3,4,5,6,7,8,9,18],
        offensiveunlocklightinfantrytier6:[1,2,3,4,5,6,7,8,9,10,18],
        offensiveunlockheavyinfantrytier6:[1,2,3,4,5,6,7,8,9,10,18],
        offensiveunlockgroundvehicletier6:[1,2,3,4,5,6,7,8,9,10,18],
        offensiveunlockairvehicletier6:[1,2,3,4,5,6,7,8,9,10,18],
        offensivelightinfantryattack2:[1,2,3,4,5,6,7,8,9,18],
        offensivelightinfantrydefense2:[1,2,3,4,5,6,7,8,9,18],
        offensiveheavyinfantryattack2:[1,2,3,4,5,6,7,8,9,18],
        offensiveheavyinfantrydefense2:[1,2,3,4,5,6,7,8,9,18],
        offensiveairvehicleattack2:[1,2,3,4,5,6,7,8,9,18],
        offensiveairvehicledefense2:[1,2,3,4,5,6,7,8,9,18],
    };
    const missionsColumnMap = {
        '*': [1,2,32],     
    };
    const statsColumnMap = {
        '*': [2],
        offensivescouting: [3],
        offensivetrooptraining: [4],
        offensiveautomatedfactories: [5],
        offensivelightinfantryattack: [6],
        offensiveheavyinfantryattack: [7],
        offensivegroundvehicleattack: [8],
        offensiveairvehicleattack:[9],
        offensivelightinfantrydefense: [10],
        offensiveheavyinfantrydefense: [11],
        offensivegroundvehicledefense: [12],
        offensiveairvehicledefense: [13],
        offensiveunlocklightinfantrytier2: [14],
        offensiveunlockheavyinfantrytier2: [14],
        offensiveunlockgroundvehicletier2: [14],
        offensiveunlockairvehicletier2: [14],
        offensivefirstaid: [15],
        offensiveheavyarmor: [16],
        offensivefieldrepairs: [17],
        offensiveredundantsystems: [18],
        offensiveunlocklightinfantrytier3: [14],
        offensiveunlockheavyinfantrytier3: [14],
        offensiveunlockgroundvehicletier3: [14],
        offensiveunlockairvehicletier3: [14],
        offensivedeploymenttactics: [19],
        offensivereactivearmor: [20],
        offensiveunlocklightinfantrytier4: [14],
        offensiveunlockheavyinfantrytier4: [14],
        offensiveunlockgroundvehicletier4: [14],
        offensiveunlockairvehicletier4: [14],
        offensiveherotroopattack: [21],
        offensiveherotroopdefense:[22],
        offensiveimprovedstamina:[23],
        offensiveunlocklightinfantrytier5:[14],
        offensiveunlockheavyinfantrytier5:[14],
        offensiveimprovedengines:[24],
        offensiveunlockgroundvehicletier5:[14],
        offensiveunlockairvehicletier5:[14],
        offensiveresilientinfantry:[25],
        offensiveadaptivecircuitry:[26],
        offensiveadvancedstamina:[27],
        offensiveadvancedengines:[28],
        offensivegroundvehicleattack2:[8],
        offensivegroundvehicledefense2:[12],
        offensiveunlocklightinfantrytier6:[14],
        offensiveunlockheavyinfantrytier6:[14],
        offensiveunlockgroundvehicletier6:[14],
        offensiveunlockairvehicletier6:[14],
        offensivelightinfantryattack2:[6],
        offensivelightinfantrydefense2:[10],
        offensiveheavyinfantryattack2:[7],
        offensiveheavyinfantrydefense2:[11],
        offensiveairvehicleattack2:[9],
        offensiveairvehicledefense2:[13],                             
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
