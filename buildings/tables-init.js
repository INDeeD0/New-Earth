// tables-init.js
// Initialize DataTables and provide API for rows/columns operations.

const Tables = (function(Helpers){
    const costsCols = [
        { title: "Key", visible: false }, // 0
        {
        title: "<button id='removeAllCosts' style='padding:2px 6px;'>&#x1F501</button>",
        orderable: false,
        width: "50px",
        render: function(data, type, row, meta) {
            const displayKey = Helpers.stripHtml(row && row[0] !== undefined ? row[0] : "");
            const levelVal = (row && row[2] !== undefined) ? String(row[2]) : String(meta.row);
            const uid = `${displayKey}|${levelVal}`;
            const normalize = s => (s || '').toString().toLowerCase().replace(/[\s_]/g, '');
            let jsonKey = (window.loadedKeyMap && window.loadedKeyMap[displayKey]) || displayKey;
            if (window.structuresSubtypes) {
            const subs = window.structuresSubtypes;
            const norm = normalize(jsonKey);
            const match = Object.keys(subs).find(k => normalize(k) === norm);
            if (!match) {
                const fuzzy = Object.keys(subs).find(k => normalize(k).includes(norm));
                if (fuzzy) jsonKey = fuzzy;
            } else {
                jsonKey = match;
            }
            }
            jsonKey = normalize(jsonKey);
            const checked = !!Totals.getCheckedMap()[uid];
            if (type === 'display') {
            return `<input type="checkbox" class="row-checkbox" data-uid="${uid}" data-json="${jsonKey}" data-lvl="${levelVal}" ${checked ? 'checked' : ''}>`;
            }
            return checked;
        }
        }, // end checkbox col

        { title:"LVL" },// 2
        {title: 'Time <input type="number" class="time-scale" style="width:40px;" step="1" min="0"> %<span class="info-icon" data-tip="Building boost">❓</span>',
            className: "dt-head-center",
            dataKey: "upgrade_cost"
        },
        { title:"Power", dataKey: "power" },// 4
        { title:"Tech", dataKey: "currency3@quantity" },// 5
        { title:"Food", dataKey: "currency4@quantity" },// 6
        { title:"Oil", dataKey: "currency5@quantity" },// 7
        { title:"Alloy", dataKey: "currency6@quantity" },// 8
        { title:"Neutronium", dataKey: "currency7@quantity" }, // 9
        { title:"Alliance Credits", dataKey: "currency8@quantity" }, // 10
        { title:"Neutronium Crystal", dataKey: "core_neutronium_crystal@quantity" }, // 11
        { title:"Classified Docs", dataKey: "core_classified_documents@quantity" }, // 12
        { title:"Data Disk", dataKey: "core_data_disk@quantity"}, // 13
        { title:"Alien Power Core", dataKey: "core_alien_power_core@quantity"}, // 14
        { title:"Alien Tech", dataKey: "core_alien_component@quantity"}, // 15
        { title:"Alien Armor", dataKey: "core_alien_armor@quantity"}, // 16
        { title:"Armory Blueprints", dataKey: "armory_blueprints@quantity"}, // 17
        { title:"Buildings", dataKey: "requirements"}, // 18
    ];
    const missionsCols =[
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
        { title:"LVL" },
        { title:"Hero XP", dataKey: "hero_xp"  },
        { title:"Power", dataKey: "power" },
        { title:"Tech", dataKey: "currency3@quantity" },
        { title:"Food", dataKey: "currency4@quantity" },
        { title:"Oil", dataKey: "currency5@quantity" },
        { title:"Alloy", dataKey: "currency6@quantity" },
        { title:"Neutronium", dataKey: "currency7@quantity" }
    ]
    const statsCols = [
        { title: "Key", visible: false },
        { title: "LVL" },
        { title: "Deployment Limit", dataKey: "march_maximum@value" },
        { title: "Deployment Capacity", dataKey: "march_unit_capacity@value" },
        { title: "Unit Capacity", dataKey: "unit_capacity" },
        { title: "Tech Generation", dataKey: "generate@quantity" },
        { title: "Tech Storage", dataKey: "limit@quantity" },
        { title: "Food Generation", dataKey: "generate@quantity" },
        { title: "Food Storage", dataKey: "limit@quantity" },
        { title: "Oil Generation", dataKey: "generate@quantity" },
        { title: "Oil Storage", dataKey: "limit@quantity" },
        { title: "Alloy Generation", dataKey: "generate@quantity" },
        { title: "Alloy Storage", dataKey: "limit@quantity" },
        { title: "Resource Storage", dataKey: "storage@quantity" },
        { title: "Resource Protection", dataKey: "protection@quantity" },
        { title: "Rally Capacity", dataKey: "rally_capacity@value" },
        { title: "Instant Deploy", dataKey: "instant_deploy" },
        { title: "Rally Speed", dataKey: "march_rally_speed_modifier@modifier" },
        { title: "Neutronium Production Bonus", dataKey: "currency7_generate_modifier@modifier" },
        { title: "Increased Station Unit Capacity", dataKey: "bonus_station_unit_capacity@value" },
        { title: "Outpost Combat Bonus", dataKey: "outpost_combat_modifier@modifier" },
        { title: "Training Capacity", dataKey: "production_capacity" },
        { title: 'Infantry Defence Bonus <span class="info-icon" data-tip="Light Infantry, Heavy Infantry">❓</span>', dataKey: "light_infantry_defense_modifier@modifier" },
        { title: "Research Speed", dataKey: "research_speed_modifier@modifier" },
        { title: "Defence Capacity", dataKey: "static_unit_capacity" },
        { title: 'Wall Defence Bonus <span class="info-icon" data-tip="Basic, Advanced, Experimental, Air">❓</span>', dataKey: "basic_defense_attack_modifier@modifier" },
        { title: "Resource Trade Limit", dataKey: "march_currency_capacity@value" },
        { title: "Resource Trade Tax", dataKey: "march_currency_tax_modifier@modifier" },
        { title: 'Prototype Defence Bonus <span class="info-icon" data-tip="Prototype Units">❓</span>', dataKey: "prototype_infantry_defense_modifier@modifier" },
        { title: 'Vehicle Defence Bonus <span class="info-icon" data-tip="Vehicle, Air">❓</span>', dataKey: "vehicle_defense_modifier@modifier" },
        { title: "Turret Attack", dataKey: "attack@value" },
        { title: "Facility Combat Bonus", dataKey: "city_combat_modifier@modifier" },
        { title: "Medical Capacity", dataKey: "unit_capacity" },
        { title: 'Unit Health Bonus <span class="info-icon" data-tip="Light, Heavy, Vehicle, Air, Mech, Prototype, Alien">❓</span>', dataKey: "light_infantry_health_modifier@modifier" },
        { title: "Hero Protected XP", dataKey: "hero_xp_loss_modifier@modifier" },
        { title: "Hero Bonus XP", dataKey: "hero_xp_modifier@modifier" },
        { title: "Execution Reward", dataKey: "execute_random_reward@quantity" },
        { title: "Shard Bonus", dataKey: "friend_collection_modifier@modifier" },
        { title: "Deployment Speed", dataKey: "march_speed_modifier@modifier" },
        { title: "Radar Level", dataKey: "radar_level@value" },
        { title: "Scanning Range", dataKey: "scan_range@value" },
        { title: "Radar Defence Bonus", dataKey: "city_attacker_attack_modifier@modifier" },
        { title: "Reinforcement Capacity", dataKey: "unit_capacity" },
        { title: 'Mech Defence Bonus <span class="info-icon" data-tip="Mech Units">❓</span>', dataKey: "mech_infantry_defense_modifier@modifier" },
        { title: "Schematic Rarity", dataKey: "schematic_rarity" },
        { title: 'Alien Defence Bonus <span class="info-icon" data-tip="Alien Units">❓</span>', dataKey: "alien_light_infantry_defense_modifier@modifier" }
    ];
    const costsColumnMap = {
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
        outpost_strategic:[1,2,3,4,5,6,7,8,9,10],
        outpost_harvest:[1,2,3,4,5,6,7,8,9,10]
    };
    const missionsColumnMap = {
        headquarters: [1,2,3,4,5,6,7,8,9,10],
        shelter: [1,2,3,4,5,6,7,8,9,10],
        blackmarket: [1,2,3,4,5,6,7,8,9,10],
        hydroponicfarm: [1,2,3,4,5,6,7,8,9,10],
        oilrig: [1,2,3,4,5,6,7,8,9,10],
        alloyrefinery: [1,2,3,4,5,6,7,8,9,10],
        supplydepot: [1,2,3,4,5,6,7,8,9,10],
        war_room: [1,2,3,4,5,6,7,8,9,10],
        engineering: [1,2,3,4,5,6,7,8,9,10],
        barracks: [1,2,3,4,5,6,7,8,9,10],
        researchlab: [1,2,3,4,5,6,7,8,9,10],
        walls: [1,2,3,4,5,6,7,8,9,10],
        globalnetwork: [1,2,3,4,5,6,7,8,9,10],
        experimentation_chamber: [1,2,3,4,5,6,7,8,9,10],
        factory: [1,2,3,4,5,6,7,8,9,10],
        turret: [1,2,3,4,5,6,7,8,9,10],
        medicalbay: [1,2,3,4,5,6,7,8,9,10],
        commandpost: [1,2,3,4,5,6,7,8,9,10],
        hostilecontainment: [1,2,3,4,5,6,7,8,9,10],
        shardcondenser: [1,2,3,4,5,6,7,8,9,10],
        airstrip: [1,2,3,4,5,6,7,8,9,10],
        satelliteuplink: [1,2,3,4,5,6,7,8,9,10],
        securitystation: [1,2,3,4,5,6,7,8,9,10],
        robotics_bay: [1,2,3,4,5,6,7,8,9,10],
        hero_armory: [1,2,3,4,5,6,7,8,9,10],
        alien_genetics_lab: [1,2,3,4,5,6,7,8,9,10]
    };
    const statsColumnMap = {
        headquarters: [2, 3],
        shelter: [4],
        blackmarket: [5, 6],
        hydroponicfarm: [7, 8],
        oilrig: [9, 10],
        alloyrefinery: [11, 12],
        supplydepot: [13, 14],
        war_room: [15, 16, 17],
        engineering: [18, 19, 20],
        barracks: [21, 22],
        researchlab: [23],
        walls: [21, 24, 25],
        globalnetwork: [26, 27],
        experimentation_chamber: [21, 28],
        factory: [21, 29],
        turret: [30, 31],
        medicalbay: [32, 33],
        commandpost: [34, 35],
        hostilecontainment: [36],
        shardcondenser: [37],
        airstrip: [2, 3, 38],
        satelliteuplink: [39, 40, 41],
        securitystation: [42, 31],
        robotics_bay: [21, 43],
        hero_armory: [44],
        alien_genetics_lab: [21, 45]
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
                scrollY: "800px",
                scrollCollapse: true,
                paging: false,
                dom: 'ti',
                info: false,
                fixedHeader: false,
                ordering: false,
                autoWidth: false,
                columns: costsCols
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
                scrollY: "800px",
                scrollCollapse: true,
                paging: false,
                dom: 'ti',
                info: false,
                fixedHeader: false,
                ordering: false,
                autoWidth: false,
                columns: missionsCols
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
                scrollY: "800px",
                scrollCollapse: true,
                paging: false,
                dom: 'ti',
                info: false,
                fixedHeader: false,
                ordering: false,
                autoWidth: false,
                columns: statsCols
            });

            tables[safeKey] = dt;
        });

        console.log(`✅ Created ${Object.keys(tables).length} stats tables`);
        return tables;
    }
    function populateAllCostsTables(structures, checkedMapRef) {
        // Build a map of pretty names for "requirements"
        const prettyMap = {};
        Array.from(document.querySelectorAll('.section')).forEach(el => {
            const label = (el.innerText || el.textContent || '').toString().trim();
            if (!label) return;
            const norm = label.replace(/[_\s]/g, '').toLowerCase();
            prettyMap[norm] = label.replace(/\s+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        });

        for (const [rawKey, structure] of Object.entries(structures)) {
            const key = rawKey.toLowerCase().replace(/[\s_]/g, '');
            const dt = Tables.allCostsTables[key];
            if (!dt) continue;

            dt.clear();
            applyColumnVisibility(dt, costsColumnMap, rawKey);

            (structure.levels || []).forEach((lvl, idx) => {
                if (!lvl || idx === 0) return;
                const keyVal = rawKey;
                const lvlNum = idx;
                const uid = `${keyVal}|${lvlNum}`;
                const checked = !!checkedMapRef[uid];

                // --- start new row with same column count ---
                const row = Array(19).fill('-');
                row[0] = keyVal;
                row[1] = checked;
                row[2] = lvlNum;

                // === Loop over cost columns ===
                for (let col = 3; col < costsCols.length; col++) {
                    const colDef = costsCols[col];
                    const dataKey = (colDef.dataKey || '').toLowerCase();
                    if (!dataKey) continue;

                    let val = null;
                    try { val = Helpers.lookup.lookupValue(lvl, dataKey); } catch(e) { val = null; }

                    // === Custom handlers ===
                    // (1) Time scaling with raw storage for live rescaling
                    if (dataKey === "upgrade_cost" || dataKey.includes("upgrade_time") || dataKey === "time") {
                        const numericVal = Number(Helpers.lookup.lookupValue(lvl, dataKey)) || 0;

                        // 🧠 Store the raw time so applyScale() can reuse it
                        if (!row._rawTime) row._rawTime = {};
                        row._rawTime[col] = numericVal;

                        val = numericVal > 0
                            ? Helpers.formatTime(Math.floor(numericVal / (1 + window.currentScale / 100)))
                            : "-";
                    }


                    // (2) Power delta vs previous level
                    else if (dataKey === 'power') {
                        const prevPower = (structure.levels[lvlNum - 1] || {}).power || 0;
                        const delta = (lvl.power || 0) - prevPower;
                        val = Helpers.formatShort(delta);
                    }

                    // (3) Requirements (array -> pretty expandable display)
                    else if (dataKey === 'requirements' && Array.isArray(lvl.requirements)) {
                        const reqs = lvl.requirements
                            .map(r => {
                                if (r.subtype === 'structure' && r.target_subtype && r.level !== undefined) {
                                    const raw = String(r.target_subtype || '');
                                    const normRaw = raw.replace(/[_\s]/g, '').toLowerCase();
                                    const pretty = prettyMap[normRaw] ||
                                        raw.replace(/([a-z])([A-Z])/g, '$1 $2')
                                        .replace(/[_-]+/g, ' ')
                                        .replace(/\b\w/g, c => c.toUpperCase());
                                    return `${pretty} Lvl ${r.level}`;
                                }
                                return '';
                            })
                            .filter(Boolean);

                        if (reqs.length === 0) {
                            val = '-';
                        } else if (reqs.length === 1) {
                            val = reqs[0];
                        } else {
                            const first = reqs[0];
                            const rest = reqs.slice(1).map(r => `<div>${r}</div>`).join('');
                            const hidden = `<div class="req-hidden" style="display:none;">${rest}</div>`;
                            val = `
                                <div class="req-cell">
                                    ${first}
                                    <span class="req-toggle" style="cursor:pointer;color:#4af;margin-left:5px;">▼</span>
                                    ${hidden}
                                </div>
                            `;
                        }
                    }

                    // === Final formatting ===
                    if (val === null || val === undefined || val === '') val = '-';
                    else if (typeof val === 'number' && val > 1000) val = Helpers.formatShort(val);

                    row[col] = val;
                }

                // === Add the row ===
                try { dt.row.add(row); } catch (e) { console.warn('costs dt.row.add fail', e); }
            });

            dt.draw(false);
            Tables.setScrollRows(dt);
            try { dt.columns.adjust(); } catch(e) {}

            // Expandable requirements toggle per-table
            $(`#costsTable-${key}`).off('click', '.req-toggle').on('click', '.req-toggle', function(){
                const $cell = $(this).closest('.req-cell');
                const $hidden = $cell.find('.req-hidden');
                const expanded = $hidden.is(':visible');
                $hidden.slideToggle(150);
                $(this).text(expanded ? '▼' : '▲');
            });
        }
        console.log("✅ Populated all costs tables");        
    }
    function populateAllMissionsTables(structures, missionsCheckedMapRef, objMap) {
        for (const [rawKey, structure] of Object.entries(structures)) {
            const key = rawKey.toLowerCase().replace(/[\s_]/g, '');
            const dt = Tables.allMissionsTables[key];
            if (!dt) continue;

            dt.clear();
            applyColumnVisibility(dt, missionsColumnMap, rawKey);

            // --- Mission power lookup array (from DataLoader.objMap)
            const normalizedTarget = key;
            const missionPowerArr = (objMap && objMap[normalizedTarget]) || [];

            (structure.levels || []).forEach((lvl, lvlIdx) => {
                if (!lvl || !Object.keys(lvl).length || lvlIdx === 0) return;

                const keyVal = rawKey;
                const lvlNum = lvlIdx;
                const uid = `${keyVal}|${lvlNum}`;
                const checked = !!missionsCheckedMapRef[uid];

                // start new row same as cost pattern
                const row = Array(missionsCols.length).fill('-');
                row[0] = keyVal;
                row[1] = checked;
                row[2] = lvlNum;

                for (let col = 3; col < missionsCols.length; col++) {
                    const colDef = missionsCols[col];
                    const dataKey = (colDef.dataKey || '').toLowerCase();
                    if (!dataKey) continue;

                    let val = null;
                    try { val = Helpers.lookup.lookupValue(lvl, dataKey); } catch (e) { val = null; }

                    // === Custom handler (1): Override Power with missionPowerArr
                    if (dataKey === 'power') {
                        const missionDelta = missionPowerArr[lvlIdx];
                        val = missionDelta ? Helpers.formatShort(missionDelta) : '-';
                    }
                    // === Custom handler (2): Resource multiplier ×0.25
                    else if ([
                        'currency3@quantity', 
                        'currency4@quantity', 
                        'currency5@quantity', 
                        'currency6@quantity', 
                        'currency7@quantity'  
                    ].includes(dataKey)) {
                        const numVal = Number(val) || 0;
                        val = numVal > 0 ? numVal * 0.25 : 0;
                    }

                    // === Custom handler (2): Numeric formatting
                    if (val === null || val === undefined || val === '') {
                        val = '-';
                    } else if (typeof val === 'number' && val > 1000) {
                        val = Helpers.formatShort(val);
                    }

                    row[col] = val;
                }

                try { dt.row.add(row); } catch (e) { console.warn(`missions dt.row.add fail for ${key}`, e); }
            });

            // draw table
            dt.draw(false);
            Tables.setScrollRows(dt);
            try { dt.columns.adjust(); } catch (e) {}
        }

        console.log("✅ Populated all missions tables");
    }
    function populateAllStatsTables(structures) {
        for (const [rawKey, structure] of Object.entries(structures)) {
            const key = rawKey.toLowerCase().replace(/[\s_]/g, '');
            const dt = Tables.allStatsTables[key];
            if (!dt) continue;

            dt.clear();

            // ✅ Use the same unified column rule
            applyColumnVisibility(dt, statsColumnMap, rawKey);

            if (!structure || !Array.isArray(structure.levels)) continue;

            structure.levels.forEach((lvl, lvlIdx) => {
                if (!lvl || !Object.keys(lvl).length || lvlIdx === 0) return;
                const row = [rawKey, lvlIdx];

                for (let col = 2; col < statsCols.length; col++) {
                    const colDef = statsCols[col];
                    const dataKey = (colDef.dataKey || '').toLowerCase();
                    if (!dataKey) { row.push('-'); continue; }

                    const parts = dataKey.split('@');
                    const baseKey = parts[0];

                    let val = null;
                    try { val = Helpers.lookup.lookupValue(lvl, dataKey); } catch(e) { val = null; }

                    // === Generation scaling (minute → hour)
                    if (typeof val === 'number' && baseKey === 'generate' && (
                        ['blackmarket', 'hydroponicfarm', 'oilrig', 'alloyrefinery'].includes(key)
                    )) {
                        val = val * 60;
                    }

                    // === Special modifiers ===
                    if (val === null || val === undefined) {
                        val = '-';
                    } else if (typeof val === 'number') {
                        if (baseKey === 'hero_xp_loss_modifier') {
                            val = (50 + Math.abs(val) * 100).toFixed(2) + '%';
                        } else if (baseKey === 'march_currency_tax_modifier') {
                            val = (30 - Math.abs(val) * 100).toFixed(2) + '%';
                        } else if (baseKey.endsWith('_modifier')) {
                            val = (val * 100).toFixed(2) + '%';
                        } else if (val > 1000) {
                            val = Helpers.formatShort(val);
                        }
                    }

                    row.push(val);
                }

                try { dt.row.add(row); } catch(e){ console.warn('stats dt.row.add failed', e); }
            });

            dt.draw(false);
            Tables.setScrollRows(dt);
            try { dt.columns.adjust(); } catch(e){}
        }

        console.log("✅ Populated all stats tables");
    }
    function applyColumnVisibility(dt, map, rawKey) {
        if (!dt || !map) return;

        const normalized = rawKey.toLowerCase().replace(/[\s_]/g, '');
        let showCols = map[normalized] || [];
        if (!showCols.length) {
            const matchKey = Object.keys(map).find(k => 
                k.replace(/[\s_]/g, '') === normalized
            );
            if (matchKey) showCols = map[matchKey] || [];
        }

        const colCount = dt.columns().count();
        try { dt.columns().visible(false); } catch(e){}
        if (colCount > 1) try { dt.column(1).visible(true); } catch(e){} // always keep checkbox col visible

        showCols.forEach(i => {
            if (typeof i === 'number' && i >= 0 && i < colCount) {
                try { dt.column(i).visible(true); } catch(e){}
            }
        });
    }
    function setScrollRows(dt, rows = VISIBLE_ROWS) {
        if (!dt || typeof dt.settings !== "function" || !dt.settings().length) {
            console.debug("setScrollRows: DataTable not ready");
            return;
        }

        // Wait for render completion
        setTimeout(() => {
            const $tableBody = $(dt.table().body());
            const $firstRow = $tableBody.find("tr:visible:first");

            // measure height of first visible row accurately (include borders)
            const rowH = $firstRow.length ? $firstRow.outerHeight(true) : 32;
            if (rowH <= 0) return;

            // compute total height rounded to full pixels
            const height = Math.ceil(rowH * rows + 0);

            const $scrollBody = $(dt.table().container()).find("div.dataTables_scrollBody");
            if ($scrollBody.length) {
                $scrollBody.css({
                    height: height + "px",
                    "max-height": height + "px",
                    overflowY: "auto"
                });
            }

            // update internal DataTables scroll size
            const settings = dt.settings()[0];
            if (settings && settings.oScroll) {
                settings.oScroll.sY = height + "px";
            }

            // smooth column adjustment
            try { dt.columns.adjust(); } catch (e) {}

        }, 50); // small delay ensures DOM is fully drawn
    }
    function applyScale(scale) {
        if (!Tables.allCostsTables) return;

        // Find the active (visible) building
        const activeSection = $('.section.active').text().trim();
        if (!activeSection) return;

        const safeKey = activeSection.toLowerCase().replace(/[\s_]/g, '');
        const dt = Tables.allCostsTables?.[safeKey];
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
        applyColumnVisibility,        
        KEY_COL, CHECKBOX_COL, LEVEL_COL, TIME_COL,
    };
})(Helpers);
