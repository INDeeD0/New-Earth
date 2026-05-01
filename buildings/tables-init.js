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
        { title:'<img src="pictures/AC.png" class="col-icon">', dataKey: "currency8@quantity!whole2" }, // 10
        { title:'<img src="pictures/Neut Crystal.png" class="col-icon">', dataKey: "core_neutronium_crystal@quantity!whole2" }, // 11
        { title:'<img src="pictures/Classified Documents.png" class="col-icon">', dataKey: "core_classified_documents@quantity!whole2" }, // 12
        { title:'<img src="pictures/Data Disk.png" class="col-icon">', dataKey: "core_data_disk@quantity!whole2"}, // 13
        { title:'<img src="pictures/Alien Power Core.png" class="col-icon">', dataKey: "core_alien_power_core@quantity!whole2"}, // 14
        { title:'<img src="pictures/Alien Tech.png" class="col-icon">', dataKey: "core_alien_component@quantity!whole2"}, // 15
        { title:'<img src="pictures/Alien Armor.png" class="col-icon">', dataKey: "core_alien_armor@quantity!whole2"}, // 16
        { title:'<img src="pictures/Armory Blueprints.png" class="col-icon">', dataKey: "armory_blueprints@quantity!whole2"}, // 17
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
        { title: "Deployment Limit", dataKey: "march_maximum@value!whole" },
        { title: "Deployment Capacity", dataKey: "march_unit_capacity@value!whole" },
        { title: "Unit Capacity", dataKey: "unit_capacity!whole" },//5
        { title: "Tech Generation", dataKey: "generate@quantity!whole3" },
        { title: "Tech Storage", dataKey: "limit@quantity!whole" },
        { title: "Food Generation", dataKey: "generate@quantity!whole3" },
        { title: "Food Storage", dataKey: "limit@quantity!whole" },
        { title: "Oil Generation", dataKey: "generate@quantity!whole3" },//10
        { title: "Oil Storage", dataKey: "limit@quantity!whole" },
        { title: "Alloy Generation", dataKey: "generate@quantity!whole3" },
        { title: "Alloy Storage", dataKey: "limit@quantity!whole" },
        { title: "Resource Storage", dataKey: "storage@quantity!whole" },
        { title: "Resource Protection", dataKey: "protection@quantity!whole" },//15
        { title: "Rally Capacity", dataKey: "rally_capacity@value!whole" },
        { title: "Instant Deploy", dataKey: "instant_deploy" },
        { title: "Rally Speed", dataKey: "march_rally_speed_modifier@modifier!percent2" },
        { title: "Neutronium Production Bonus", dataKey: "currency7_generate_modifier@modifier!percent2" },
        { title: "Increased Station Unit Capacity", dataKey: "bonus_station_unit_capacity@value!whole" },//20
        { title: "Outpost Combat Bonus", dataKey: "outpost_combat_modifier@modifier!percent2" },
        { title: "Training Capacity", dataKey: "production_capacity!whole" },
        { title: 'Infantry Defence Bonus <span class="info-icon" data-tip="Light Infantry, Heavy Infantry">❓</span>', dataKey: "light_infantry_defense_modifier@modifier!percent2" },
        { title: "Research Speed", dataKey: "research_speed_modifier@modifier!percent2" },
        { title: "Defence Capacity", dataKey: "static_unit_capacity!whole" },//25
        { title: 'Wall Defence Bonus <span class="info-icon" data-tip="Basic, Advanced, Experimental, Air">❓</span>', dataKey: "basic_defense_attack_modifier@modifier!percent2" },
        { title: "Resource Trade Limit", dataKey: "march_currency_capacity@value!whole" },
        { title: "Resource Trade Tax", dataKey: "march_currency_tax_modifier@modifier!percent2" },
        { title: 'Prototype Defence Bonus <span class="info-icon" data-tip="Prototype Units">❓</span>', dataKey: "prototype_infantry_defense_modifier@modifier!percent2" },
        { title: 'Vehicle Defence Bonus <span class="info-icon" data-tip="Vehicle, Air">❓</span>', dataKey: "vehicle_defense_modifier@modifier!percent2" },//30
        { title: "Turret Attack", dataKey: "attack@value!whole" },
        { title: "Facility Combat Bonus", dataKey: "city_combat_modifier@modifier!percent2" },
        { title: "Medical Capacity", dataKey: "unit_capacity!whole" },
        { title: 'Unit Health Bonus <span class="info-icon" data-tip="Light, Heavy, Vehicle, Air, Mech, Prototype, Alien">❓</span>', dataKey: "light_infantry_health_modifier@modifier!percent2" },
        { title: "Hero Protected XP", dataKey: "hero_xp_loss_modifier@modifier!percent2" },
        { title: "Hero Bonus XP", dataKey: "hero_xp_modifier@modifier!percent2" },
        { title: "Execution Reward", dataKey: "execute_random_reward@quantity!whole" },
        { title: "Shard Bonus", dataKey: "friend_collection_modifier@modifier!percent2" },
        { title: "Deployment Speed", dataKey: "march_speed_modifier@modifier!percent2" },
        { title: "Radar Level", dataKey: "radar_level@value!whole" },
        { title: "Scanning Range", dataKey: "scan_range@value!whole" },
        { title: "Radar Defence Bonus", dataKey: "city_attacker_attack_modifier@modifier!percent2" },
        { title: "Reinforcement Capacity", dataKey: "unit_capacity!whole" },
        { title: 'Mech Defence Bonus <span class="info-icon" data-tip="Mech Units">❓</span>', dataKey: "mech_infantry_defense_modifier@modifier!percent2" },
        { title: "Schematic Rarity", dataKey: "schematic_rarity" },
        { title: 'Alien Defence Bonus <span class="info-icon" data-tip="Alien Units">❓</span>', dataKey: "alien_light_infantry_defense_modifier@modifier!percent2" },
        { title: "Neut Generation", dataKey: "generate@quantity!whole3" },
        { title: "Neut Storage", dataKey: "limit@quantity!whole" },
    ];
    const costsColumnMap = {
        '*': [1,2,32],
        headquarters: [1,2,3,4,5,6,7,8,9,11,18],
        shelter: [1,2,3,4,5,6,7,8,9,11,18],
        blackmarket: [1,2,3,4,5,6,7,8,9,11,18],
        hydroponicfarm: [1,2,3,4,5,6,7,8,9,11,18],
        oilrig: [1,2,3,4,5,6,7,8,9,11,18],
        alloyrefinery: [1,2,3,4,5,6,7,8,9,11,18],
        supplydepot: [1,2,3,4,5,6,7,8,9,11,18],
        war_room: [1,2,3,4,5,6,7,8,9,11,12,18],
        engineering: [1,2,3,4,5,6,7,8,9,11,14,18],
        barracks: [1,2,3,4,5,6,7,8,9,11,18],
        researchlab: [1,2,3,4,5,6,7,8,9,11,15,18],
        walls: [1,2,3,4,5,6,7,8,9,11,16,18],
        globalnetwork: [1,2,3,4,5,6,7,8,9,11,18],
        experimentation_chamber: [1,2,3,4,5,6,7,8,9,11,18],
        factory: [1,2,3,4,5,6,7,8,9,11,18],
        turret: [1,2,3,4,5,6,7,8,9,11,16,18],
        medicalbay: [1,2,3,4,5,6,7,8,9,11,18],
        commandpost: [1,2,3,4,5,6,7,8,9,11,13,18],
        hostilecontainment: [1,2,3,4,5,6,7,8,9,11,18],
        shardcondenser: [1,2,3,4,5,6,7,8,9,11,18],
        airstrip: [1,2,3,4,5,6,7,8,9,11,18],
        satelliteuplink: [1,2,3,4,5,6,7,8,9,11,18],
        securitystation: [1,2,3,4,5,6,7,8,9,11,18],
        robotics_bay: [1,2,3,4,5,6,7,8,9,11,18],
        hero_armory: [1,2,3,4,5,6,7,8,9,11,17,18],
        alien_genetics_lab: [1,2,3,4,5,6,7,8,9,11,18],
        outpost_strategic:[1,2,4,5,7,8,10],
        outpost_harvest:[1,2,4,5,7,8,10]               
    };
    const missionsColumnMap = {
        '*': [1,2,32],     
    };
    const statsColumnMap = {
        '*': [2],
        headquarters: [3,4],
        shelter: [5],
        blackmarket: [6,7],
        hydroponicfarm: [8,9],
        oilrig: [10,11],
        alloyrefinery: [12,13],
        supplydepot: [14,15],
        war_room: [16,17,18],
        engineering: [19,20,21],
        barracks: [22,23],
        researchlab: [24],
        walls: [22,25,26],
        globalnetwork: [27,28],
        experimentation_chamber: [22,29],
        factory: [22,30],
        turret: [31,32],
        medicalbay: [33,34],
        commandpost: [35,36],
        hostilecontainment: [37],
        shardcondenser: [38],
        airstrip: [3,4,39],
        satelliteuplink: [40,41,42],
        securitystation: [43,32],
        robotics_bay: [22,44],
        hero_armory: [45],
        alien_genetics_lab: [22,46],
        outpost_strategic:[5],
        outpost_harvest:[5,47,48]                              
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
