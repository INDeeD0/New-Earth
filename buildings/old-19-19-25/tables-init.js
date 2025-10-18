// tables-init.js
// Initialize DataTables and provide API for rows/columns operations.

const Tables = (function(Helpers){
    // constants used by other modules
    const colsDef = [
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

    // expose some indexes for other modules
    const KEY_COL = 0;
    const CHECKBOX_COL = 1;
    const LEVEL_COL = 2;
    const TIME_COL = 3;
    const RAW_COL = colsDef.length - 1; // 18

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
        // costsTable uses colsDef
        costsTable = $('#costsTable').DataTable({
            scrollY: "750px",
            scrollCollapse: true,
            paging: false,
            dom: 'ti',
            info: false,
            fixedHeader: true,
            ordering: false,
            autoWidth: true,
            columns: colsDef
        });

        // keep time-scale persistence when header gets cloned
        costsTable.on('draw.dt', function(){ $('.time-scale').val(currentScale); });
        return costsTable;
    }

    function createRewardsTable(missionsCheckedMapRef){
        rewardsTable = $('#rewardsTable').DataTable({
            scrollY: "800px", scrollCollapse: true, paging: false, dom: 'ti', info: false, fixedHeader: true, ordering:false,
            columns:[
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
                { title:"Level" },
                { title:"Hero XP" },
                { title:"Power" },
                { title:"Tech" },
                { title:"Food" },
                { title:"Oil" },
                { title:"Alloy" },
                { title:"Neutronium" }
            ]
        });
        return rewardsTable;
    }

    function createStatsTable(){
        statsTable = $('#statsTable').DataTable({
            scrollY: "800px", scrollCollapse: true, paging: false, dom: 'ti', info: false, fixedHeader: true, ordering:false,
            columns:[
                { title:"Key", visible:false },
                { title:"Level" }
            ]
        });
        return statsTable;
    }

    function setScrollRows(dt, rows = VISIBLE_ROWS){
        const $firstCell = $(dt.table().body()).find('tr:visible:first td:visible:first');
        let rowH = $firstCell.length ? $firstCell.outerHeight() : 30;
        const height = Math.ceil(rowH * rows);
        const $scrollBody = $(dt.table().container()).find('div.dataTables_scrollBody');
        $scrollBody.css({ height: height + 'px', 'max-height': height + 'px' });
        const settings = dt.settings()[0];
        settings.oScroll.sY = height + 'px';
        dt.columns.adjust();
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

    // Rebuild the stats table dynamically for a given building key (copied logic from original)
    function rebuildStatsTableFor(jsonKeyRaw){
        if (!window.structuresSubtypes) return;
        const bkey = (jsonKeyRaw || '').toString().toLowerCase();
        const building = window.structuresSubtypes[bkey];
        if (!building) {
            if ($.fn.DataTable.isDataTable('#statsTable')) {
                statsTable.clear().draw(false);
            }
            return;
        }
        const levels = building.levels || [];
        const statSet = new Set();
        const buffSet = new Set();
        levels.forEach((lvl) => {
            if (!lvl || !Object.keys(lvl).length) return;
            (Array.isArray(lvl.stats) ? lvl.stats : []).forEach(s => { if (s && s.subtype) statSet.add(String(s.subtype)); });
            (Array.isArray(lvl.attributes) ? lvl.attributes : []).forEach(a => { if (a && a.subtype) buffSet.add(String(a.subtype)); });
        });
        const nice = function(s){
            let t = String(s);
            t = t.replace(/_modifier\b/gi, '');
            t = t.replace(/modifier\b/gi, '');
            t = t.replace(/__+/g,'_').replace(/^_+|_+$/g,'');
            t = t.replace(/_/g,' ');
            t = t.replace(/\b\w/g, function(c){ return c.toUpperCase(); });
            return t.replace(/\s{2,}/g,' ').trim();
        };
        const columns = [
            { title: "Key", visible: false },
            { title: "Level" }
        ];
        const statCols = Array.from(statSet);
        const buffCols = Array.from(buffSet);
        const capacityExists = levels.some(lvl => typeof lvl.unit_capacity === 'number');
        const isWalls = bkey === 'walls';
        const isBarracks = bkey === 'barracks';
        const isFactory = bkey === 'factory';

        const defCapRe = /defen[cs]e.*cap/i;
        const wallBonusRe = /(attack|atk|defen[cs]e.*modifier)/i;
        const isRobotics = bkey === 'robotics_bay';
        const isExperimentation = bkey === 'experimentation_chamber';
        const isGenetics = bkey === 'alien_genetics_lab';
        const trainCapExists = (isBarracks || isFactory || isRobotics || isExperimentation || isGenetics) && levels.some(lvl => typeof lvl.production_capacity === 'number');
        const infDefRe = /infantry.*defen[cs]e.*modifier/i;
        const vehDefRe = /(vehicle|air).*defen[cs]e.*modifier/i;
        const mechDefRe2 = /mech_.*_(defen[cs]e|health).*modifier/i;
        const protoDefRe = /prototype_.*_(defen[cs]e|health).*modifier/i;
        const alienDefRe = /alien_.*_(defen[cs]e|health).*modifier/i;
        const hasDirectDefCap = levels.some(lvl => {
            if (!lvl) return false;
            return Object.keys(lvl).some(k => (typeof lvl[k] === 'number') && defCapRe.test(k));
        });
        const defStatKeys = statCols.filter(n => defCapRe.test(String(n)));
        const hasStaticUnitCap = levels.some(lvl => lvl && typeof lvl.static_unit_capacity === 'number');
        const defCapExists = isWalls && (hasDirectDefCap || defStatKeys.length > 0 || hasStaticUnitCap);

        let statColsFiltered = statCols.slice();
        let buffColsFiltered = buffCols.slice();
        if (isWalls) {
            statColsFiltered = statColsFiltered.filter(n => !(defCapRe.test(String(n)) || wallBonusRe.test(String(n))));
            buffColsFiltered = buffColsFiltered.filter(n => !wallBonusRe.test(String(n)));
        }
        if (isBarracks) {
            statColsFiltered = statColsFiltered.filter(n => !infDefRe.test(String(n)));
            buffColsFiltered = buffColsFiltered.filter(n => !infDefRe.test(String(n)));
        }
        if (isFactory) {
            statColsFiltered = statColsFiltered.filter(n => !vehDefRe.test(String(n)));
            buffColsFiltered = buffColsFiltered.filter(n => !vehDefRe.test(String(n)));
        }
        if (isRobotics) {
            statColsFiltered = statColsFiltered.filter(n => !mechDefRe2.test(String(n)));
            buffColsFiltered = buffColsFiltered.filter(n => !mechDefRe2.test(String(n)));
        }
        if (isExperimentation) {
            statColsFiltered = statColsFiltered.filter(n => !protoDefRe.test(String(n)));
            buffColsFiltered = buffColsFiltered.filter(n => !protoDefRe.test(String(n)));
        }
        if (isGenetics) {
            statColsFiltered = statColsFiltered.filter(n => !alienDefRe.test(String(n)));
            buffColsFiltered = buffColsFiltered.filter(n => !alienDefRe.test(String(n)));
        }

        if (capacityExists) columns.push({ title: "Unit Capacity" });
        if (defCapExists) columns.push({ title: "Defence Capacity" });
        if (trainCapExists) columns.push({ title: "Training Capacity" });
        statColsFiltered.forEach(sub => columns.push({ title: nice(sub) }));
        buffColsFiltered.forEach(sub => columns.push({ title: nice(sub) }));
        if (isWalls) columns.push({ title: "Wall Defence Bonus" });
        if (isBarracks) columns.push({ title: "Infantry Defence" });
        if (isFactory) columns.push({ title: "Vehicle Defence" });
        if (isRobotics) columns.push({ title: "Mech Defence" });
        if (isExperimentation) columns.push({ title: "Prototype Defence" });
        if (isGenetics) columns.push({ title: "Alien Defence" });

        if ($.fn.DataTable.isDataTable('#statsTable')) {
            statsTable.destroy();
        }
        $('#statsTable').empty();
        statsTable = $('#statsTable').DataTable({
            scrollY: "800px", scrollCollapse: true, paging: false, dom: 'ti', info: false, fixedHeader: true, ordering:false,
            columns: columns
        });

        levels.forEach((lvl, i) => {
            if (!lvl || !Object.keys(lvl).length) return;
            const cap = (typeof lvl.unit_capacity === 'number') ? Helpers.formatShort(lvl.unit_capacity) : "-";
            const row = [bkey, i];

            // Unit Capacity
            if (columns.find(c => c.title === 'Unit Capacity')) row.push(cap);

            // Training Capacity (Barracks/Factory)
            if (columns.find(c => c.title === 'Training Capacity')) {
                const tcap = (typeof lvl.production_capacity === 'number') ? Helpers.formatShort(lvl.production_capacity) : '-';
                row.push(tcap);
            }

            // Defence Capacity (Walls only): from stat subtype or direct field
            if (columns.find(c => c.title === 'Defence Capacity')) {
                let dcap = null;
                // from stats
                const sDef = (Array.isArray(lvl.stats) ? lvl.stats : []).find(x => defCapRe.test(String(x.subtype)));
                if (sDef && typeof sDef.value === 'number') dcap = sDef.value;
                // from direct field
                if (dcap === null) {
                    const k = Object.keys(lvl).find(k => (typeof lvl[k] === 'number') && defCapRe.test(k));
                    if (k) dcap = lvl[k];
                }
                // from static_unit_capacity
                if (dcap === null && typeof lvl.static_unit_capacity === 'number') dcap = lvl.static_unit_capacity;
                row.push(dcap !== null ? Helpers.formatShort(dcap) : '-');
            }

            // Other stats
            statColsFiltered.forEach(sub => {
                const s = (Array.isArray(lvl.stats) ? lvl.stats : []).find(x => String(x.subtype) === sub);
                let val = "-";
                if (s) {
                    const parts = [];
                    if (s.value !== undefined) {
                        if (!(typeof s.value === 'number' && s.value === 0)) {
                            parts.push(typeof s.value === 'number' ? Helpers.formatShort(s.value) : s.value);
                        }
                    }
                    if (typeof s.modifier === 'number' && s.modifier !== 0) {
                        const absMod = Math.abs(s.modifier);
                        const pctRaw = (absMod <= 1 || (absMod < 10 && !Number.isInteger(absMod))) ? (s.modifier * 100) : s.modifier;
                        const sign = pctRaw < 0 ? '-' : '';
                        const pctAbs = Math.abs(pctRaw);
                        let pctStr = (Math.round(pctAbs) === pctAbs)
                            ? String(pctAbs)
                            : pctAbs.toFixed(2).replace(/\.0+$/,'').replace(/0+$/,'').replace(/\.$/,'');
                        parts.push(`${sign}${pctStr}%`);
                    }
                    if (parts.length) val = parts.length > 1 ? `${parts[0]} (${parts[1]})` : parts[0];
                }
                row.push(val);
            });

            // Other buffs (excluding attacks for Walls)
            buffColsFiltered.forEach(sub => {
                const a = (Array.isArray(lvl.attributes) ? lvl.attributes : []).find(x => String(x.subtype) === sub);
                let val = "-";
                if (a && a.value !== undefined) val = (typeof a.value === 'number') ? Helpers.formatShort(a.value) : a.value;
                row.push(val);
            });

            // Combined Wall Defence Bonus
            if (isWalls) {
                const attList = (Array.isArray(lvl.attributes) ? lvl.attributes : []).filter(x => wallBonusRe.test(String(x.subtype)));
                const statList = (Array.isArray(lvl.stats) ? lvl.stats : []).filter(x => wallBonusRe.test(String(x.subtype)));
                const combined = [].concat(statList, attList);
                let bonus = '-';
                if (combined.length) {
                    const withMod = combined.find(it => typeof it.modifier === 'number' && it.modifier !== 0);
                    if (withMod) {
                        const absMod = Math.abs(withMod.modifier);
                        const pctRaw = (absMod <= 1 || (absMod < 10 && !Number.isInteger(absMod))) ? (withMod.modifier * 100) : withMod.modifier;
                        const sign = pctRaw < 0 ? '-' : '';
                        const pctAbs = Math.abs(pctRaw);
                        let pctStr = (Math.round(pctAbs) === pctAbs)
                            ? String(pctAbs)
                            : pctAbs.toFixed(2).replace(/\.0+$/,'').replace(/0+$/,'').replace(/\.$/,'');
                        bonus = `${sign}${pctStr}%`;
                    } else {
                        const withVal = combined.find(it => typeof it.value === 'number' && it.value !== 0);
                        if (withVal) {
                            const absVal = Math.abs(withVal.value);
                            const pctRaw = (absVal <= 1 || (absVal < 10 && !Number.isInteger(absVal))) ? (withVal.value * 100) : withVal.value;
                            const sign = pctRaw < 0 ? '-' : '';
                            const pctAbs = Math.abs(pctRaw);
                            let pctStr = (Math.round(pctAbs) === pctAbs)
                                ? String(pctAbs)
                                : pctAbs.toFixed(2).replace(/\.0+$/,'').replace(/0+$/,'').replace(/\.$/,'');
                            bonus = `${sign}${pctStr}%`;
                        }
                    }
                }
                row.push(bonus);
            }

            // Combined Infantry Defence (Barracks)
            if (isBarracks) {
                const attList = (Array.isArray(lvl.attributes) ? lvl.attributes : []).filter(x => infDefRe.test(String(x.subtype)));
                const statList = (Array.isArray(lvl.stats) ? lvl.stats : []).filter(x => infDefRe.test(String(x.subtype)));
                const combined = [].concat(statList, attList);
                let bonus = '-';
                if (combined.length) {
                    const withMod = combined.find(it => typeof it.modifier === 'number' && it.modifier !== 0);
                    if (withMod) {
                        const absMod = Math.abs(withMod.modifier);
                        const pctRaw = (absMod <= 1 || (absMod < 10 && !Number.isInteger(absMod))) ? (withMod.modifier * 100) : withMod.modifier;
                        const sign = pctRaw < 0 ? '-' : '';
                        const pctAbs = Math.abs(pctRaw);
                        let pctStr = (Math.round(pctAbs) === pctAbs)
                            ? String(pctAbs)
                            : pctAbs.toFixed(2).replace(/\.0+$/,'').replace(/0+$/,'').replace(/\.$/,'');
                        bonus = `${sign}${pctStr}%`;
                    } else {
                        const withVal = combined.find(it => typeof it.value === 'number' && it.value !== 0);
                        if (withVal) {
                            const absVal = Math.abs(withVal.value);
                            const pctRaw = (absVal <= 1 || (absVal < 10 && !Number.isInteger(absVal))) ? (withVal.value * 100) : withVal.value;
                            const sign = pctRaw < 0 ? '-' : '';
                            const pctAbs = Math.abs(pctRaw);
                            let pctStr = (Math.round(pctAbs) === pctAbs)
                                ? String(pctAbs)
                                : pctAbs.toFixed(2).replace(/\.0+$/,'').replace(/0+$/,'').replace(/\.$/,'');
                            bonus = `${sign}${pctStr}%`;
                        }
                    }
                }
                row.push(bonus);
            }

            // Combined Vehicle Defence (Factory)
            if (isFactory) {
                const attList = (Array.isArray(lvl.attributes) ? lvl.attributes : []).filter(x => vehDefRe.test(String(x.subtype)));
                const statList = (Array.isArray(lvl.stats) ? lvl.stats : []).filter(x => vehDefRe.test(String(x.subtype)));
                const combined = [].concat(statList, attList);
                let bonus = '-';
                if (combined.length) {
                    const withMod = combined.find(it => typeof it.modifier === 'number' && it.modifier !== 0);
                    if (withMod) {
                        const absMod = Math.abs(withMod.modifier);
                        const pctRaw = (absMod <= 1 || (absMod < 10 && !Number.isInteger(absMod))) ? (withMod.modifier * 100) : withMod.modifier;
                        const sign = pctRaw < 0 ? '-' : '';
                        const pctAbs = Math.abs(pctRaw);
                        let pctStr = (Math.round(pctAbs) === pctAbs)
                            ? String(pctAbs)
                            : pctAbs.toFixed(2).replace(/\.0+$/,'').replace(/0+$/,'').replace(/\.$/,'');
                        bonus = `${sign}${pctStr}%`;
                    } else {
                        const withVal = combined.find(it => typeof it.value === 'number' && it.value !== 0);
                        if (withVal) {
                            const absVal = Math.abs(withVal.value);
                            const pctRaw = (absVal <= 1 || (absVal < 10 && !Number.isInteger(absVal))) ? (withVal.value * 100) : withVal.value;
                            const sign = pctRaw < 0 ? '-' : '';
                            const pctAbs = Math.abs(pctRaw);
                            let pctStr = (Math.round(pctAbs) === pctAbs)
                                ? String(pctAbs)
                                : pctAbs.toFixed(2).replace(/\.0+$/,'').replace(/0+$/,'').replace(/\.$/,'');
                            bonus = `${sign}${pctStr}%`;
                        }
                    }
                }
                row.push(bonus);
            }

            // Combined Mech Defence (Robotics Bay)
            if (isRobotics) {
                const attList = (Array.isArray(lvl.attributes) ? lvl.attributes : []).filter(x => mechDefRe2.test(String(x.subtype)));
                const statList = (Array.isArray(lvl.stats) ? lvl.stats : []).filter(x => mechDefRe2.test(String(x.subtype)));
                const combined = [].concat(statList, attList);
                let bonus = '-';
                if (combined.length) {
                    const withMod = combined.find(it => typeof it.modifier === 'number' && it.modifier !== 0);
                    if (withMod) {
                        const absMod = Math.abs(withMod.modifier);
                        const pctRaw = (absMod <= 1 || (absMod < 10 && !Number.isInteger(absMod))) ? (withMod.modifier * 100) : withMod.modifier;
                        const sign = pctRaw < 0 ? '-' : '';
                        const pctAbs = Math.abs(pctRaw);
                        let pctStr = (Math.round(pctAbs) === pctAbs)
                            ? String(pctAbs)
                            : pctAbs.toFixed(2).replace(/\.0+$/,'').replace(/0+$/,'').replace(/\.$/,'');
                        bonus = `${sign}${pctStr}%`;
                    } else {
                        const withVal = combined.find(it => typeof it.value === 'number' && it.value !== 0);
                        if (withVal) {
                            const absVal = Math.abs(withVal.value);
                            const pctRaw = (absVal <= 1 || (absVal < 10 && !Number.isInteger(absVal))) ? (withVal.value * 100) : withVal.value;
                            const sign = pctRaw < 0 ? '-' : '';
                            const pctAbs = Math.abs(pctRaw);
                            let pctStr = (Math.round(pctAbs) === pctAbs)
                                ? String(pctAbs)
                                : pctAbs.toFixed(2).replace(/\.0+$/,'').replace(/0+$/,'').replace(/\.$/,'');
                            bonus = `${sign}${pctStr}%`;
                        }
                    }
                }
                row.push(bonus);
            }

            // Combined Prototype Defence (Experimentation Chamber)
            if (isExperimentation) {
                const attList = (Array.isArray(lvl.attributes) ? lvl.attributes : []).filter(x => protoDefRe.test(String(x.subtype)));
                const statList = (Array.isArray(lvl.stats) ? lvl.stats : []).filter(x => protoDefRe.test(String(x.subtype)));
                const combined = [].concat(statList, attList);
                let bonus = '-';
                if (combined.length) {
                    const withMod = combined.find(it => typeof it.modifier === 'number' && it.modifier !== 0);
                    if (withMod) {
                        const absMod = Math.abs(withMod.modifier);
                        const pctRaw = (absMod <= 1 || (absMod < 10 && !Number.isInteger(absMod))) ? (withMod.modifier * 100) : withMod.modifier;
                        const sign = pctRaw < 0 ? '-' : '';
                        const pctAbs = Math.abs(pctRaw);
                        let pctStr = (Math.round(pctAbs) === pctAbs)
                            ? String(pctAbs)
                            : pctAbs.toFixed(2).replace(/\.0+$/,'').replace(/0+$/,'').replace(/\.$/,'');
                        bonus = `${sign}${pctStr}%`;
                    } else {
                        const withVal = combined.find(it => typeof it.value === 'number' && it.value !== 0);
                        if (withVal) {
                            const absVal = Math.abs(withVal.value);
                            const pctRaw = (absVal <= 1 || (absVal < 10 && !Number.isInteger(absVal))) ? (withVal.value * 100) : withVal.value;
                            const sign = pctRaw < 0 ? '-' : '';
                            const pctAbs = Math.abs(pctRaw);
                            let pctStr = (Math.round(pctAbs) === pctAbs)
                                ? String(pctAbs)
                                : pctAbs.toFixed(2).replace(/\.0+$/,'').replace(/0+$/,'').replace(/\.$/,'');
                            bonus = `${sign}${pctStr}%`;
                        }
                    }
                }
                row.push(bonus);
            }

            // Combined Alien Defence (Alien Genetics Labs)
            if (isGenetics) {
                const attList = (Array.isArray(lvl.attributes) ? lvl.attributes : []).filter(x => alienDefRe.test(String(x.subtype)));
                const statList = (Array.isArray(lvl.stats) ? lvl.stats : []).filter(x => alienDefRe.test(String(x.subtype)));
                const combined = [].concat(statList, attList);
                let bonus = '-';
                if (combined.length) {
                    const withMod = combined.find(it => typeof it.modifier === 'number' && it.modifier !== 0);
                    if (withMod) {
                        const absMod = Math.abs(withMod.modifier);
                        const pctRaw = (absMod <= 1 || (absMod < 10 && !Number.isInteger(absMod))) ? (withMod.modifier * 100) : withMod.modifier;
                        const sign = pctRaw < 0 ? '-' : '';
                        const pctAbs = Math.abs(pctRaw);
                        let pctStr = (Math.round(pctAbs) === pctAbs)
                            ? String(pctAbs)
                            : pctAbs.toFixed(2).replace(/\.0+$/,'').replace(/0+$/,'').replace(/\.$/,'');
                        bonus = `${sign}${pctStr}%`;
                    } else {
                        const withVal = combined.find(it => typeof it.value === 'number' && it.value !== 0);
                        if (withVal) {
                            const absVal = Math.abs(withVal.value);
                            const pctRaw = (absVal <= 1 || (absVal < 10 && !Number.isInteger(absVal))) ? (withVal.value * 100) : withVal.value;
                            const sign = pctRaw < 0 ? '-' : '';
                            const pctAbs = Math.abs(pctRaw);
                            let pctStr = (Math.round(pctAbs) === pctAbs)
                                ? String(pctAbs)
                                : pctAbs.toFixed(2).replace(/\.0+$/,'').replace(/0+$/,'').replace(/\.$/,'');
                            bonus = `${sign}${pctStr}%`;
                        }
                    }
                }
                row.push(bonus);
            }

            statsTable.row.add(row);
        });
        statsTable.draw(false);
        setScrollRows(statsTable, VISIBLE_ROWS);
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
        KEY_COL, CHECKBOX_COL, LEVEL_COL, TIME_COL, RAW_COL
    };
})(Helpers);
