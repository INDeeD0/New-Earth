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
        { title: "Tier 1 Infantry Efficiency", dataKey: "light_infantry_t1_cost_modifier@modifier!percent2" },//3
        { title: "Tier 1 Vehicle Efficiency", dataKey: "vehicle_t1_cost_modifier@modifier!percent2" },
        { title: "Tier 1 Defense Efficiency", dataKey: "basic_defense_t1_cost_modifier@modifier!percent2" },//5
        { title: "Tier 2 Infantry Efficiency", dataKey: "light_infantry_t2_cost_modifier@modifier!percent2" },
        { title: "Tier 2 Vehicle Efficiency", dataKey: "vehicle_t2_cost_modifier@modifier!percent2" },
        { title: "Tier 2 Defense Efficiency", dataKey: "basic_defense_t2_cost_modifier@modifier!percent2" },  
        { title: "Tier 3 Infantry Efficiency", dataKey: "light_infantry_t3_cost_modifier@modifier!percent2" },
        { title: "Tier 3 Vehicle Efficiency", dataKey: "vehicle_t3_cost_modifier@modifier!percent2" },//10
        { title: "Tier 3 Defense Efficiency", dataKey: "basic_defense_t3_cost_modifier@modifier!percent2" },
        { title: "Tier 4 Infantry Efficiency", dataKey: "light_infantry_t4_cost_modifier@modifier!percent2" },
        { title: "Tier 4 Vehicle Efficiency", dataKey: "vehicle_t4_cost_modifier@modifier!percent2" },
        { title: "Tier 4 Defense Efficiency", dataKey: "basic_defense_t4_cost_modifier@modifier!percent2" },
        { title: "Tier 5 Infantry Efficiency", dataKey: "light_infantry_t5_cost_modifier@modifier!percent2" },//15
        { title: "Tier 5 Vehicle Efficiency", dataKey: "vehicle_t5_cost_modifier@modifier!percent2" },
        { title: "Tier 5 Defense Efficiency", dataKey: "basic_defense_t5_cost_modifier@modifier!percent2" },
        { title: "Tier 4 Mech Efficiency", dataKey: "mech_infantry_t4_cost_modifier@modifier!percent2" },
        { title: "Tier 4 Alien Efficiency", dataKey: "alien_light_infantry_t4_cost_modifier@modifier!percent2" },
        { title: "Tier 4 Prototype Efficiency", dataKey: "prototype_infantry_t4_cost_modifier@modifier!percent2" },//20
        { title: "Tier 5 Mech Efficiency", dataKey: "mech_aircraft_t5_cost_modifier@modifier!percent2" },
        { title: "Tier 5 Alien Efficiency", dataKey: "alien_heavy_infantry_t5_cost_modifier@modifier!percent2" },
        { title: "Tier 5 Prototype Efficiency", dataKey: "prototype_vehicle_t5_cost_modifier@modifier!percent2" },
        { title: "Tier 6 Mech Efficiency", dataKey: "mech_infantry_t6_cost_modifier@modifier!percent2" },
        { title: "Tier 6 Alien Efficiency", dataKey: "alien_light_infantry_t6_cost_modifier@modifier!percent2" },//25
        { title: "Tier 6 Prototype Efficiency", dataKey: "prototype_air_t6_cost_modifier@modifier!percent2" },        
        { title: "Maximum Alliance Helpers", dataKey: "help_request_maximum_helpers@value" },        
        { title: "Deployment Speed", dataKey: "march_speed_modifier@modifier!percent2" },
        { title: "Deployment Capacity", dataKey: "march_unit_capacity@modifier!percent2" },
        { title: "Resource Trade Tax", dataKey: "march_currency_tax_modifier@modifier!percent2" },//30
        { title: "Resource Trade Limit", dataKey: "march_currency_capacity@value!whole2" },
        { title: "Resource Generation", dataKey: "currency3_generate_modifier@modifier!percent2" },
        { title: "Infantry Production Capacity", dataKey: "infantry_productionqueue_capacity@value!whole2" },
        { title: "Vehicle Production Capacity", dataKey: "vehicle_productionqueue_capacity@value!whole2" },
        { title: "Increased Stationed Unit Capacity", dataKey: "bonus_station_unit_capacity@value!whole2" },//35
        { title: "Scanning Range", dataKey: "scan_range@value" },
        { title: "Rally Capacity", dataKey: "rally_capacity@modifier!percent2" },
        { title: "Rally Speed", dataKey: "march_rally_speed_modifier@modifier!percent2" },

    ];
    const costsColumnMap = {
        '*': [1,2],
        specialbarracksefficiency1:[1,2,3,4,5,6,7,8,9,18],
        specialfactoryefficiency1:[1,2,3,4,5,6,7,8,9,18],
        specialdefenseefficiency1:[1,2,3,4,5,6,7,8,9,18],
        specialdeploymentspeed1:[1,2,3,4,5,6,7,8,9,18],
        specialdeploymentsize1:[1,2,3,4,5,6,7,8,9,18],
        specialbarracksefficiency2:[1,2,3,4,5,6,7,8,9,18],
        specialfactoryefficiency2:[1,2,3,4,5,6,7,8,9,18],
        specialdefenseefficiency2:[1,2,3,4,5,6,7,8,9,18],
        specialtradetaxreduction:[1,2,3,4,5,6,7,8,9,18],
        specialtradecapacityincrease:[1,2,3,4,5,6,7,8,9,18],
        specialresourcegeneration:[1,2,3,4,5,6,7,8,9,18],
        specialbarracksefficiency3:[1,2,3,4,5,6,7,8,9,18],
        specialfactoryefficiency3:[1,2,3,4,5,6,7,8,9,18],
        specialdefenseefficiency3:[1,2,3,4,5,6,7,8,9,18],
        specialtrooptrainingcapacity:[1,2,3,4,5,6,7,8,9,18],
        specialproductioncapacity:[1,2,3,4,5,6,7,8,9,18],
        specialreinforcementcapacity:[1,2,3,4,5,6,7,8,9,18],
        specialdeploymentspeed2:[1,2,3,4,5,6,7,8,9,18],
        specialdeploymentsize2:[1,2,3,4,5,6,7,8,9,18],
        specialbarracksefficiency4:[1,2,3,4,5,6,7,8,9,18],
        specialfactoryefficiency4:[1,2,3,4,5,6,7,8,9,18],
        specialdefenseefficiency4:[1,2,3,4,5,6,7,8,9,18],
        specialbarracksefficiency5:[1,2,3,4,5,6,7,8,9,18],
        specialfactoryefficiency5:[1,2,3,4,5,6,7,8,9,18],
        specialdefenseefficiency5:[1,2,3,4,5,6,7,8,9,18],
        specialspecializedefficiency5:[1,2,3,4,5,6,7,8,9,18],
        specialalienefficiency5:[1,2,3,4,5,6,7,8,9,18],
        specialprototypeefficiency5:[1,2,3,4,5,6,7,8,9,18],
        specialspecializedefficiency6:[1,2,3,4,5,6,7,8,9,18],
        specialalienefficiency6:[1,2,3,4,5,6,7,8,9,18],
        specialprototypeefficiency6:[1,2,3,4,5,6,7,8,9,18],
        efficiencyrallyspeed:[1,2,3,4,5,6,7,8,9,18],
        efficiencyrallycapacity:[1,2,3,4,5,6,7,8,9,18],
        efficiencyalliancehelp:[1,2,3,4,5,6,7,8,9,18],
        efficiencyscanrange:[1,2,3,4,5,6,7,8,9,18],
        specialspecializedefficiency4:[1,2,3,4,5,6,7,8,9,18],
        specialalienefficiency4:[1,2,3,4,5,6,7,8,9,18],
        specialprototypeefficiency4:[1,2,3,4,5,6,7,8,9,18],
        specialdeploymentspeed3:[1,2,3,4,5,6,7,8,9,18],
        specialdeploymentsize3:[1,2,3,4,5,6,7,8,9,18],
        efficiencyrallyspeed2:[1,2,3,4,5,6,7,8,9,18],
        efficiencyrallycapacity2:[1,2,3,4,5,6,7,8,9,18],             
    };
    const missionsColumnMap = {
        '*': [1,2,32],     
    };
    const statsColumnMap = {
        '*': [2],
        specialbarracksefficiency1:[3],
        specialfactoryefficiency1:[4],
        specialdefenseefficiency1:[5],
        specialbarracksefficiency2:[6],
        specialfactoryefficiency2:[7],
        specialdefenseefficiency2:[8],
        specialbarracksefficiency3:[9],
        specialfactoryefficiency3:[10],
        specialdefenseefficiency3:[11],
        specialbarracksefficiency4:[12],
        specialfactoryefficiency4:[13],
        specialdefenseefficiency4:[14],
        specialbarracksefficiency5:[15],
        specialfactoryefficiency5:[16],
        specialdefenseefficiency5:[17],
        specialspecializedefficiency4:[18],
        specialalienefficiency4:[19],
        specialprototypeefficiency4:[20],         
        specialspecializedefficiency5:[21],
        specialalienefficiency5:[22],
        specialprototypeefficiency5:[23],
        specialspecializedefficiency6:[24],
        specialalienefficiency6:[25],
        specialprototypeefficiency6:[26],
        efficiencyalliancehelp:[27],
        specialdeploymentspeed1:[28],
        specialdeploymentsize1:[29],
        specialdeploymentspeed2:[28],
        specialdeploymentsize2:[29],
        specialtradetaxreduction:[30],
        specialtradecapacityincrease:[31],
        specialresourcegeneration:[32],                         
        specialtrooptrainingcapacity:[33],
        specialproductioncapacity:[34],
        specialreinforcementcapacity:[35],
        efficiencyscanrange:[36], 
        efficiencyrallycapacity:[37],                
        efficiencyrallyspeed:[38],
        specialdeploymentspeed3:[28],
        specialdeploymentsize3:[29],
        efficiencyrallyspeed2:[38],
        efficiencyrallycapacity2:[37],             
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
