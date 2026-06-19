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
        { title:'<span class="info-icon" data-tip="Tech/h"><img src="pictures/Tech.png" class="col-icon"></span>', dataKey: "currencies_per_hour_tech@quantity!whole2h" },
        { title:'<span class="info-icon" data-tip="Tech"><img src="pictures/Tech.png" class="col-icon"></span>', dataKey: "currencies_tech@quantity!whole2" },        
        { title:'<span class="info-icon" data-tip="Food/h"><img src="pictures/Food.png" class="col-icon"></span>', dataKey: "currencies_per_hour_farm@quantity!whole2h" },
        { title:'<span class="info-icon" data-tip="Food"><img src="pictures/Food.png" class="col-icon"></span>', dataKey: "currencies_farm@quantity!whole2" },        
        { title:'<span class="info-icon" data-tip="Oil/h"><img src="pictures/Oil.png" class="col-icon"></span>', dataKey: "currencies_per_hour_oil@quantity!whole2h" },
        { title:'<span class="info-icon" data-tip="Oil"><img src="pictures/Oil.png" class="col-icon"></span>', dataKey: "currencies_oil@quantity!whole2" },        
        { title:'<span class="info-icon" data-tip="Alloy/h"><img src="pictures/Alloy.png" class="col-icon"></span>', dataKey: "currencies_per_hour_alloy@quantity!whole2h" },
        { title:'<span class="info-icon" data-tip="Alloy"><img src="pictures/Alloy.png" class="col-icon"></span>', dataKey: "currencies_alloy@quantity!whole2" },        
        { title:'<span class="info-icon" data-tip="Neut/h"><img src="pictures/Neut.png" class="col-icon"></span>', dataKey: "currencies_per_hour_neut@quantity!whole2h" },
        { title:'<span class="info-icon" data-tip="Neut"><img src="pictures/Neut.png" class="col-icon"></span>', dataKey: "currencies_neut@quantity!whole2" },
        { title:'<span class="info-icon" data-tip="Shards/h"><img src="pictures/Shards.png" class="col-icon"></span>', dataKey: "currencies_per_hour_shard@quantity!whole2h" },
        { title:'<span class="info-icon" data-tip="Shards"><img src="pictures/Shards.png" class="col-icon"></span>', dataKey: "currencies_shard@quantity!whole2" },
        { title:'<span class="info-icon" data-tip="Greys"><img src="pictures/Greys.png" class="col-icon"></span>', dataKey: "tier_1_alien@quantity!whole2" },
        { title:'<span class="info-icon" data-tip="Bashers"><img src="pictures/Bashers.png" class="col-icon"></span>', dataKey: "tier_2_alien@quantity!whole2" },
        { title:'<span class="info-icon" data-tip="UFOs"><img src="pictures/UFOs.png" class="col-icon"></span>', dataKey: "tier_3_alien@quantity!whole2" },
        { title:'<span class="info-icon" data-tip="Destroyers"><img src="pictures/Destroyers.png" class="col-icon"></span>', dataKey: "tier_4_alien@quantity!whole2" },
        { title:'<span class="info-icon" data-tip="Mastermind"><img src="pictures/Mastermind.png" class="col-icon"></span>', dataKey: "tier_5_alien@quantity!whole2" },
        { title:'<span class="info-icon" data-tip="Abomination"><img src="pictures/Abomination.png" class="col-icon"></span>', dataKey: "tier_6_alien@quantity!whole2" },
        { title:'<span class="info-icon" data-tip="Recruited Black Ops"><img src="pictures/Veteran Black Ops.png" class="col-icon"></span>', dataKey: "tier_1_blackops@quantity!whole2" },
        { title:'<span class="info-icon" data-tip="Superior Black Ops"><img src="pictures/Veteran Black Ops.png" class="col-icon"></span>', dataKey: "tier_2_blackops@quantity!whole2" },
        { title:'<span class="info-icon" data-tip="Veteran Black Ops"><img src="pictures/Veteran Black Ops.png" class="col-icon"></span>', dataKey: "tier_3_blackops@quantity!whole2" },
        { title:'<span class="info-icon" data-tip="Elite Black Ops"><img src="pictures/Veteran Black Ops.png" class="col-icon"></span>', dataKey: "tier_4_blackops@quantity!whole2" },
        { title:'<span class="info-icon" data-tip="Recruited Scavenger"><img src="pictures/Recruited Scavenger.png" class="col-icon"></span>', dataKey: "tier_1_scavengers@quantity!whole2" },
        { title:'<span class="info-icon" data-tip="Superior Scavenger"><img src="pictures/Recruited Scavenger.png" class="col-icon"></span>', dataKey: "tier_2_scavengers@quantity!whole2" },
        { title:'<span class="info-icon" data-tip="Veteran Scavenger"><img src="pictures/Recruited Scavenger.png" class="col-icon"></span>', dataKey: "tier_3_scavengers@quantity!whole2" },
        { title:'<span class="info-icon" data-tip="Elite Scavenger"><img src="pictures/Recruited Scavenger.png" class="col-icon"></span>', dataKey: "tier_4_scavengers@quantity!whole2" },
        { title:'<span class="info-icon" data-tip="Epic Scavenger"><img src="pictures/Recruited Scavenger.png" class="col-icon"></span>', dataKey: "tier_5_scavengers@quantity!whole2" },
        { title:'<span class="info-icon" data-tip="Shield"><img src="pictures/Abomination.png" class="col-icon"></span>', dataKey: "tier_5_alien_strider_shield@quantity!whole2" },
        { title:'<span class="info-icon" data-tip="Laser"><img src="pictures/Abomination.png" class="col-icon"></span>', dataKey: "tier_6_alien_strider_laser@quantity!whole2" }, 
        { title:'<span class="info-icon" data-tip="Health"><img src="pictures/Health.png" class="col-icon"></span>', dataKey: "monster_health@quantity!whole2" },   
        { title:'<span class="info-icon" data-tip="Energy Per Chain"><img src="pictures/Energy.png" class="col-icon"></span>', dataKey: "monster_energy_cost@quantity!whole2" },   
        { title:'<span class="info-icon" data-tip="Kill XP"><img src="pictures/XP1.png" class="col-icon"></span>', dataKey: "hero_xp@quantity!whole2" },
        { title:'<span class="info-icon" data-tip="Armory Supplies"><img src="pictures/Armory Supplies.png" class="col-icon"></span>', dataKey: "bundle_crafting_loot@quantity!whole2" },
        { title:'<span class="info-icon" data-tip="Swarm Supplies"><img src="pictures/Swarm Supplies.png" class="col-icon"></span>', dataKey: "bundle_crafting_loot_epic@quantity!whole2" },
        { title:'<span class="info-icon" data-tip="Saucer Supplies"><img src="pictures/Saucer Supplies.png" class="col-icon"></span>', dataKey: "bundle_crafting_loot_ufo@quantity!whole2" },
        { title:'<span class="info-icon" data-tip="Strider Supplies"><img src="pictures/Strider Supplies.png" class="col-icon"></span>', dataKey: "bundle_crafting_loot_strider@quantity!whole2" },
        { title:'<span class="info-icon" data-tip="Xenosaur Chest"><img src="pictures/Xenosaur Chest.png" class="col-icon"></span>', dataKey: "bundle_crafting_loot_xenosaur@quantity!whole2" },
        { title:'<span class="info-icon" data-tip="E-Xenosaur Chest"><img src="pictures/E-Xenosaur Chest.png" class="col-icon"></span>', dataKey: "bundle_crafting_loot_evolved_xenosaur@quantity!whole2" },          
        { title:'<img src="pictures/Armory Blueprints.png" class="col-icon">', dataKey: "armory_blueprints@quantity!whole2"},
        { title:'<span class="info-icon" data-tip="Alien Bulwark"><img src="pictures/Alien Bulwark.png" class="col-icon"></span>15', dataKey: "crafting_alien_bulwark@value" },//4 
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
    ];
    const costsColumnMap = {
        '*': [2],
        resources: [5,6,7,8,9,10,11,12,13,14,15,16],
        aliens: [17,18,19,20,21,22],
        invasion_alien_hive: [18,19,20,21],
        black_ops_sector: [23,24,25,26],
        crashed_dropship: [17,18,19,20],
        covert_testing_station: [17,18,19,20,23,24,25,26],
        scavengers_sector: [27,28,29,30,31],
        specialized_hostile_crash_site: [17,18,19,20],
        invader_alien_megaship: [18,19,20,21,22],
        invader_titanic_strider: [32,33],
        invader: [34,35,36,37,38],
        invader_ufo: [34,35,36,39],
        invader_plasma_strider: [34,35,36,40],
        invader_xenosaur: [34,35,36,41],
        invader_evolved_xenosaur: [34,35,36,42],
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
                if (lvlIdx === 0 || Helpers.isEmptyLevel(lvl)) return;

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
