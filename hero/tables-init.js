// tables-init.js
// Initialize DataTables and provide API for rows/columns operations.

const Tables = (function(Helpers){
    const costsCols = [
        { title: "Key", visible: false },
    ];
    const missionsCols =[
        { title:"Key", visible:false },
    ]
    const statsCols = [
        { title: "Key", visible: false },
        { title: "LVL" },
        { title: "Infantry Productoin Speed", dataKey: "light_infantry_produce_speed_modifier@modifier" },//2
        { title: 'Food Production Bonus', dataKey: "currency4_generate_modifier@modifier" },//3
        { title: 'Construction Speed', dataKey: "structure_speed_modifier@modifier" },
        { title: 'Research Speed', dataKey: "research_speed_modifier@modifier" },
        { title: 'Factory Production Speed', dataKey: "vehicle_produce_speed_modifier@modifier" },
        { title: 'Alloy Production Bonus', dataKey: "currency6_generate_modifier@modifier" },
        { title: 'Oil Production Bonus', dataKey: "currency5_generate_modifier@modifier" },
        { title: 'Defense Production Speed', dataKey: "basic_defense_produce_speed_modifier@modifier" },
        { title: 'Neutronium Production Bonus', dataKey: "currency7_generate_modifier@modifier" },//10
        { title: 'Tech Production Bonus', dataKey: "currency3_generate_modifier@modifier" },
        { title: 'Defense Effectiveness', dataKey: "basic_defense_attack_modifier@modifier" },
        { title: 'Gathering Loot Chance', dataKey: "hero_reward_modifier@modifier" },
        { title: 'Gathering Speed', dataKey: "march_gather_modifier@modifier" },
        { title: 'Light Infantry Attack', dataKey: "light_infantry_attack_modifier@modifier" },
        { title: 'Heavy Infantry Attack', dataKey: "heavy_infantry_attack_modifier@modifier" },
        { title: 'Ground Vehicle Attack', dataKey: "vehicle_attack_modifier@modifier" },
        { title: 'Air Vehicle Attack', dataKey: "air_attack_modifier@modifier" },
        { title: 'Infantry Defense', dataKey: "light_infantry_defense_modifier@modifier" },
        { title: 'Vehicle Defense', dataKey: "vehicle_defense_modifier@modifier" },//20
        { title: 'Combat Veteran', dataKey: "hero_city_unit_attack_modifier@modifier" },
        { title: 'Unit Health', dataKey: "light_infantry_health_modifier@modifier" },
        { title: 'Invader Energy Cost Reduction', dataKey: "hunt_energy_modifier@modifier" },
        { title: 'Hero Energy Regen per Minute', dataKey: "hero_energy_regen@value" },
        { title: 'Hero Invader Attack', dataKey: "hero_monster_attack_modifier@modifier" },
        { title: 'Hero Invader Chain Attacks', dataKey: "hero_hunting_chain@value" },
        { title: 'Hero Max Energy', dataKey: "hero_max_energy@value" },
        { title: 'Hero Invader Speed', dataKey: "hunt_incoming_speed_modifier@modifier" },
        { title: 'Defeated Invader Bonus Energy', dataKey: "hunt_defeated_energy_restore@value" },
        { title: 'Invader Double Reward Chance', dataKey: "hunt_bonus_reward_modifier@modifier" },//30
    ];
    const costsColumnMap = {};
    const missionsColumnMap = {};
    const statsColumnMap = {
        hero_skill_troop_production_1: [2],
        hero_skill_food_production_1: [3],
        hero_skill_alloy_production_1:[7],
        hero_skill_oil_production_1:[8],
        hero_skill_tech_production_1:[11],
        hero_skill_neutronium_production_1:[10],
        hero_skill_food_production_2:[3],
        hero_skill_oil_production_2:[8],
        hero_skill_alloy_production_2:[7],
        hero_skill_tech_production_2:[11],
        hero_skill_neutronium_production_2:[10],
        hero_skill_food_production_3:[3],
        hero_skill_alloy_production_3:[7],
        hero_skill_oil_production_3:[8],
        hero_skill_tech_production_3:[11],
        hero_skill_neutronium_production_3:[10],
        hero_skill_construction_1:[4],
        hero_skill_research_1:[5],
        hero_skill_gatherer_1:[14],
        hero_skill_gathering_loot:[13],
        hero_skill_construction_2:[4],
        hero_skill_research_2:[5],
        hero_skill_gatherer_2:[14],
        hero_skill_factory_production_1:[6],
        hero_skill_light_infantry_attack_1:[15],
        hero_skill_heavy_infantry_attack_1:[16],
        hero_skill_ground_vehicle_attack_1:[17],
        hero_skill_air_vehicle_attack_1:[18],
        hero_skill_infantry_defense_1:[19],
        hero_skill_vehicle_defense_1:[20],
        hero_skill_defense_production_1:[9],
        hero_skill_defense_effectiveness_1:[12],
        hero_skill_combat_veteran:[21],
        hero_skill_troop_production_2:[2],
        hero_skill_factory_production_2:[6],
        hero_skill_light_infantry_attack_2:[15],
        hero_skill_ground_vehicle_attack_2:[17],
        hero_skill_heavy_infantry_attack_2:[16],
        hero_skill_air_vehicle_attack_2:[18],
        hero_skill_defense_production_2:[9],
        hero_skill_infantry_defense_2:[19],
        hero_skill_vehicle_defense_2:[20],
        hero_skill_defense_effectiveness_2:[12],
        hero_skill_determination:[22],
        hero_skill_energy_usage_1:[23],
        hero_skill_energy_usage_2:[23],
        hero_skill_energy_usage_3:[23],
        hero_skill_energy_restoration_1:[24],
        hero_skill_energy_restoration_2:[24],
        hero_skill_speed_1:[28],
        hero_skill_speed_2:[28],
        hero_skill_attack_1:[25],
        hero_skill_attack_2:[25],
        hero_skill_max_energy_1:[27],
        hero_skill_max_energy_2:[27],
        hero_skill_max_energy_3:[27],
        hero_skill_sustained_attack_1:[26],
        hero_skill_sustained_attack_2:[26],
        hero_skill_loot_chance_increase_1:[30],
        hero_skill_loot_chance_increase_2:[30],
        hero_skill_bonus_energy:[29],                               
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
    function populateAllCostsTables(structures, costscheckedMapRef) {
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
                const checked = !!costscheckedMapRef[uid];

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
                                // --- Structure Requirements ---
                                if (r.subtype === 'structure' && r.target_subtype && r.level !== undefined) {
                                    const raw = String(r.target_subtype || '');
                                    const normRaw = raw.replace(/[_\s]/g, '').toLowerCase();
                                    const pretty = prettyMap[normRaw] ||
                                        raw.replace(/([a-z])([A-Z])/g, '$1 $2')
                                        .replace(/[_-]+/g, ' ')
                                        .replace(/\b\w/g, c => c.toUpperCase());

                                    return `${pretty} Lvl ${r.level}`;
                                }

                                // --- Research Requirements ---
                                if (r.subtype === 'research' && r.target_subtype && r.level !== undefined) {
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
                    } else if (dataKey === "cooldown" || dataKey.includes ("@duration") || dataKey === "drone_recharge_seconds@value") {
                        let raw = Number(Helpers.lookup.lookupValue(lvl, dataKey));
                        if (isNaN(raw)) {
                            val = "-";
                        } else {
                            if (raw < 0) {
                                val = "-" + Helpers.formatTime(Math.abs(raw));
                            } else {
                                val = Helpers.formatTime(raw);
                            }
                        }
                    } else if (typeof val === 'number') {
                        if (baseKey === 'hero_xp_loss_modifier') {
                            val = (50 + Math.abs(val) * 100).toFixed(2) + '%';
                        } else if (baseKey === 'march_currency_tax_modifier') {
                            val = (30 - Math.abs(val) * 100).toFixed(2) + '%';
                        } else if (baseKey.endsWith('_modifier') || baseKey === 'rally_capacity' || baseKey === 'march_unit_capacity') {
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
