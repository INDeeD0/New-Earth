// tables-init.js
// Initialize DataTables and provide API for rows/columns operations.

const Tables = (function(Helpers){
    const costsDef = [
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
    const missionsDef =[
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
        { title:"Hero XP" },
        { title:"Power" },
        { title:"Tech" },
        { title:"Food" },
        { title:"Oil" },
        { title:"Alloy" },
        { title:"Neutronium" }
    ]
    const statsColsDef = [
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
    const RAW_COL = costsDef.length - 1; // 18

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
        // costsTable uses costsDef
        costsTable = $('#costsTable').DataTable({
            scrollY: "800px",
            scrollCollapse: true,
            paging: false,
            dom: 'ti',
            info: false,
            fixedHeader: true,
            ordering: false,
            autoWidth: true,
            columns: costsDef
        });

        // keep time-scale persistence when header gets cloned
        costsTable.on('draw.dt', function(){ $('.time-scale').val(currentScale); });
        return costsTable;
    }

    function createRewardsTable(missionsCheckedMapRef){
        rewardsTable = $('#rewardsTable').DataTable({
            scrollY: "800px", 
            scrollCollapse: true, 
            paging: false, 
            dom: 'ti', 
            info: false, 
            fixedHeader: true, 
            ordering:false,
            columns: missionsDef
        });
        return rewardsTable;
    }

    function createStatsTable() {
        statsTable = $('#statsTable').DataTable({
            scrollY: "800px",
            scrollCollapse: true,
            paging: false,
            dom: 'ti',
            info: false,
            fixedHeader: true,
            ordering: false,
            columns: statsColsDef
        });
        return statsTable;
    }


    function rebuildStatsTableFor(buildingName, data) {
        if (!$('#statsTable').length) return;

        const keyRaw = (buildingName || '').toString().toLowerCase();
        const structure = data || (window.structuresSubtypes && window.structuresSubtypes[keyRaw]);
        const dt = $('#statsTable').DataTable();

        try { dt.clear(); } catch (e) {}
        dt.columns().visible(false);
        // Always show "Level" column
        if (dt.column(1)) dt.column(1).visible(true);

        if (!structure || !Array.isArray(structure.levels) || !structure.levels.length) {
            dt.draw(false);
            return;
        }

        // === show relevant columns for this building (normalized match) ===
        const normalized = keyRaw.replace(/[\s_]/g, '');
        let showCols = statsColumnMap[keyRaw] || [];
        if (!showCols.length) {
            const matchKey = Object.keys(statsColumnMap).find(k => k.replace(/[\s_]/g, '') === normalized);
            if (matchKey) showCols = statsColumnMap[matchKey] || [];
        }
        showCols.forEach(i => {
            if (typeof i === 'number' && dt.column(i)) dt.column(i).visible(true);
        });

        // === Recursive numeric extractor ===
        function extractNumber(val) {
            if (val === null || val === undefined) return null;
            if (typeof val === 'number') return val;
            if (typeof val === 'string' && !isNaN(val)) return Number(val);
            if (typeof val === 'object') {
                for (const k in val) {
                    const sub = extractNumber(val[k]);
                    if (sub !== null && sub !== undefined) return sub;
                }
            }
            return null;
        }

        // === Helpers for exact lookup and aggregations ===
        function extractFromEntry(entry, prefer) {
            // When no prefer is given, use neutral priority to avoid bias and [object Object] display
            let order;
            if (prefer === 'modifier') order = ['modifier','value','quantity'];
            else if (prefer === 'value') order = ['value','modifier','quantity'];
            else if (prefer === 'quantity') order = ['quantity','value','modifier'];
            else order = ['quantity','value','modifier'];

            if (entry && typeof entry === 'object') {
                for (const k of order) {
                    if (entry[k] !== undefined && entry[k] !== null) {
                        const num = extractNumber(entry[k]);
                        if (num !== null && num !== undefined) return num;
                    }
                }
                // Fallback: scan nested props for first numeric
                const fallback = extractNumber(entry);
                if (fallback !== null && fallback !== undefined) return fallback;
                return null;
            }
            return extractNumber(entry);
        }

        function getFromKnownArraysExact(lvl, key, prefer = 'value') {
            const containers = ['stats', 'attributes', 'bonuses', 'modifiers', 'modifier'];
            for (const name of containers) {
                const container = lvl[name];
                if (!container) continue;

                // Case 1: Array of entries with subtype/target_subtype
                if (Array.isArray(container)) {
                    const found = container.find(a => {
                        const sub = String(a?.subtype || '').toLowerCase();
                        const target = String(a?.target_subtype || '').toLowerCase();
                        return sub === key || target === key;
                    });
                    if (found) return extractFromEntry(found, prefer);
                }
                // Case 2: Object map where keys may be subtypes
                else if (typeof container === 'object') {
                    // Direct key match
                    if (Object.prototype.hasOwnProperty.call(container, key)) {
                        const v = container[key];
                        const val = extractFromEntry(v, prefer);
                        if (val !== null) return val;
                    }
                    // Otherwise scan values for subtype exact match
                    for (const v of Object.values(container)) {
                        if (v && typeof v === 'object') {
                            const sub = String(v.subtype || '').toLowerCase();
                            const target = String(v.target_subtype || '').toLowerCase();
                            if (sub === key || target === key) {
                                const val = extractFromEntry(v, prefer);
                                if (val !== null) return val;
                            }
                        }
                    }
                }
            }
            return null;
        }

        
        
        // === loop over levels ===
        structure.levels.forEach((lvl, lvlIdx) => {
            if (!lvl || !Object.keys(lvl).length || lvlIdx === 0) return;
            const row = [buildingName, lvlIdx];

            for (let col = 2; col < statsColsDef.length; col++) {
                const colDef = statsColsDef[col];
                const rawKey = (colDef.dataKey || '').toLowerCase();
                const parts = rawKey.split('@');
                const baseKey = parts[0];
                const prefer = (parts[1] === 'modifier' || parts[1] === 'value' || parts[1] === 'quantity')
                    ? parts[1]
                    : undefined;

                let val = null;

                // 1️⃣ Prefer direct top-level field first
                if (lvl && Object.prototype.hasOwnProperty.call(lvl, baseKey)) {
                    const raw = lvl[baseKey];
                    if (typeof raw === 'object') {
                        val = extractFromEntry(raw, prefer);
                    } else if (typeof raw === 'string' && !isNaN(raw)) {
                        val = Number(raw);
                    } else {
                        val = raw;
                    }
                }
                
                // 4️⃣ Handle known nested arrays with exact subtype match
                if (val === null) {
                    val = getFromKnownArraysExact(lvl, baseKey, prefer);
                }

                // Apply 60x scale to generation for specific resource buildings
                const normalizedBuildingForScale = keyRaw.replace(/[\s_]/g, '');
                if (typeof val === 'number' && baseKey === 'generate' && (
                    normalizedBuildingForScale === 'blackmarket' ||
                    normalizedBuildingForScale === 'hydroponicfarm' ||
                    normalizedBuildingForScale === 'oilrig' ||
                    normalizedBuildingForScale === 'alloyrefinery'
                )) {
                    val = val * 60;
                }
                // 5️⃣ Format final value
                if (val === null || val === undefined) {
                    val = '-';
                } else if (typeof val === 'number') {
                    const isHeroProtected = baseKey === 'hero_xp_loss_modifier';
                    const isTradeTax = baseKey === 'march_currency_tax_modifier';
                    if (isHeroProtected) {
                        const protectedPct = 50 + Math.abs(val) * 100;
                        val = protectedPct.toFixed(2) + '%';
                    } else if (isTradeTax) {
                        const displayPct = 30 - Math.abs(val) * 100;
                        val = displayPct.toFixed(2) + '%';
                    } else {
                        const isPercent = baseKey.endsWith('_modifier');
                        if (isPercent) {
                            val = (val * 100).toFixed(2) + '%';
                        } else if (val > 1000) {
                            val = Helpers.formatShort(val);
                        }
                    }
                }

                row.push(val);
            }

            dt.row.add(row);
        });

        dt.draw(false);
        Tables.setScrollRows(dt);
    }
 

    function setScrollRows(dt, rows = VISIBLE_ROWS){
        if (!dt || typeof dt.settings !== "function" || !dt.settings().length) {
            console.debug('setScrollRows: DataTable not ready'); 
            return;
        }
        const $firstCell = $(dt.table().body()).find('tr:visible:first td:visible:first');
        let rowH = $firstCell.length ? $firstCell.outerHeight() : 30;
        const height = Math.ceil(rowH * rows);
        const $scrollBody = $(dt.table().container()).find('div.dataTables_scrollBody');
        if ($scrollBody.length) $scrollBody.css({ height: height + 'px', 'max-height': height + 'px' });
        const settings = dt.settings()[0];
        if (settings && settings.oScroll) settings.oScroll.sY = height + 'px';
        try { dt.columns.adjust(); } catch(e){/* ignore */ }
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


    // Expose selected API
    return {
        initDefaults,
        createCostsTable,
        createRewardsTable,
        createStatsTable,
        setScrollRows,
        applyScale,
        rebuildStatsTableFor,
        KEY_COL, CHECKBOX_COL, LEVEL_COL, TIME_COL, RAW_COL,
        statsColsDef
    };
})(Helpers);
