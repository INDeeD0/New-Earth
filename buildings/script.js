
$(document).ready(function(){

    // --- DataTables defaults ---
    $.extend(true, $.fn.dataTable.defaults, {
        autoWidth: false,
        scrollX: false
    });

    // --- Page navigation ---
    $('#topNav .nav-btn').each(function(){
        if ($(this).data('page') === window.location.pathname.split('/').pop()) $(this).addClass('active');
        $(this).on('click', function(){ window.location.href = $(this).data('page'); });
    });

    // --- Helpers ---
    function formatTime(seconds) {
        seconds = Number(seconds) || 0;
        if (seconds <= 0) return "-";
        const d = Math.floor(seconds / 86400); seconds %= 86400;
        const h = Math.floor(seconds / 3600); seconds %= 3600;
        const m = Math.floor(seconds / 60); const s = seconds % 60;
        const parts = [];
        if (d) parts.push(d + "d");
        if (h) parts.push(h + "h");
        if (m) parts.push(m + "m");
        if (s && !d && !h && !m) parts.push(s + "s"); // show seconds only for small times
        return parts.join(" ");
    }

    function formatShort(num) {
        if (num === "-" || num === undefined || num === null) return "-";
        num = Number(num) || 0;
        if (num >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/,"") + "B";
        if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/,"") + "M";
        if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/,"") + "K";
        return num.toLocaleString();
    }

    function parseNumber(val) {
        if (typeof val === 'number') return val;
        if (!val) return 0;
        val = val.toString().trim().toUpperCase();
        let multiplier = 1;
        if (val.endsWith('K')) { multiplier = 1e3; val = val.slice(0,-1); }
        else if (val.endsWith('M')) { multiplier = 1e6; val = val.slice(0,-1); }
        else if (val.endsWith('B')) { multiplier = 1e9; val = val.slice(0,-1); }
        return (parseFloat(val) || 0) * multiplier;
    }

  const stripHtml = s => (s||"").toString().replace(/<[^>]*>/g,'').replace(/[%❓]/g,'').trim();

    // keep track of checked rows by uid (key|level)
    const checkedMap = Object.create(null);

    // independent selection map for Main Missions table
    const missionsCheckedMap = Object.create(null);

    // current time scale %
    let currentScale = 0;

    // --- Column definitions (kept in a variable so we can reference titles later) ---
    const colsDef = [
        { title: "Key", visible: false }, // 0
        { title: "<button id='removeAll' style='padding:2px 6px;'>&#x1F501</button>", orderable:false, width:"50px",
            // render the checkbox (uses checkedMap)
            render: function(data, type, row, meta) {
                // row is the row data array; row[0] = key, row[2] = level
                const keyVal = stripHtml(row && row[0] !== undefined ? row[0] : "");
                const levelVal = (row && row[2] !== undefined) ? String(row[2]) : String(meta.row);
                const uid = `${keyVal}|${levelVal}`;
                const checked = !!checkedMap[uid];
                // for display return the checkbox input, for sorting/filtering return boolean so DataTables doesn't display 'true/false'
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
        { title: "Food" },     // 5
        { title: "Oil" },      // 6
        { title: "Alloy" },    // 7
        { title: "Neutronium" }, // 8
        { title: "Alliance Credits" }, // 9
        { title: "Neutronium Crystal" }, // 10
        { title: "Classified Docs" }, // 11
        { title: "Data Disk" }, // 12
        { title: "Alien Power Core" }, // 13
        { title: "Alien Tech" }, // 14
        { title: "Alien Armor" }, // 15
        { title: "Armory Blueprints" }, // 16
        { title: "_raw", visible: false } // 17 (raw seconds)
    ];

    
    // column indexes for convenience
    const KEY_COL = 0;
    const CHECKBOX_COL = 1;
    const LEVEL_COL = 2;
    const TIME_COL = 3;
    const RAW_COL = colsDef.length - 1; // 17

    // --- Initialize DataTables ---
    const costsTable = $('#costsTable').DataTable({
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

    
    const rewardsTable = $('#rewardsTable').DataTable({
        scrollY: "800px", scrollCollapse: true, paging: false, dom: 'ti', info: false, fixedHeader: true, ordering:false,
        columns:[
            { title:"Key", visible:false },
            { title: "<button id='removeAllRewards' style='padding:2px 6px;'>&#x1F501</button>", orderable:false, width:"50px",
              render: function(data, type, row, meta) {
                const keyVal = stripHtml(row && row[0] !== undefined ? row[0] : "");
                const levelVal = (row && row[2] !== undefined) ? String(row[2]) : String(meta.row);
                const uid = `${keyVal}|${levelVal}`;
                const checked = !!missionsCheckedMap[uid];
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

    let statsTable = $('#statsTable').DataTable({
        scrollY: "800px", scrollCollapse: true, paging: false, dom: 'ti', info: false, fixedHeader: true, ordering:false,
        columns:[
            { title:"Key", visible:false },
            { title:"Level" }
        ]
    });

    // Limit visible rows by dynamically setting scroll height
    const VISIBLE_ROWS = 15;
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

    // Build dynamic Stats table per building: each stat/buff as its own column
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
            const cap = (typeof lvl.unit_capacity === 'number') ? formatShort(lvl.unit_capacity) : "-";
            const row = [bkey, i];

            // Unit Capacity
            if (columns.find(c => c.title === 'Unit Capacity')) row.push(cap);

            // Training Capacity (Barracks/Factory)
            if (columns.find(c => c.title === 'Training Capacity')) {
                const tcap = (typeof lvl.production_capacity === 'number') ? formatShort(lvl.production_capacity) : '-';
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
                row.push(dcap !== null ? formatShort(dcap) : '-');
            }

            // Other stats
            statColsFiltered.forEach(sub => {
                const s = (Array.isArray(lvl.stats) ? lvl.stats : []).find(x => String(x.subtype) === sub);
                let val = "-";
                if (s) {
                    const parts = [];
                    if (s.value !== undefined) {
                        if (!(typeof s.value === 'number' && s.value === 0)) {
                            parts.push(typeof s.value === 'number' ? formatShort(s.value) : s.value);
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
                if (a && a.value !== undefined) val = (typeof a.value === 'number') ? formatShort(a.value) : a.value;
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

    // --- Apply Time scaling to visible display column only (raw kept in last col) ---
    function applyScale(scale){
        costsTable.rows().every(function(){
            const d = this.data(); // array
            const raw = Number(d[RAW_COL]) || 0;
            d[TIME_COL] = raw > 0 ? formatTime(Math.floor(raw / (1 + scale/100))) : "-";
            this.data(d, false);
        });
        // redraw without resetting paging/state
        costsTable.draw(false);
        // totals depend on scale
        updateTotals();
    }

    // --- Update totals based on checkedMap and currentScale ---
    function updateTotals(){
        // prepare totals for all numeric columns except hidden/meta ones
        const totals = {};
        colsDef.forEach((col, idx) => {
            // exclude these columns from totals
            if (idx === KEY_COL || idx === CHECKBOX_COL || idx === LEVEL_COL || idx === RAW_COL) return;
            totals[idx] = 0;
        });

        // iterate only rows currently present (filtered by table search)
        costsTable.rows({search:'applied'}).every(function(){
            const d = this.data();
            const uid = `${stripHtml(d[KEY_COL])}|${d[LEVEL_COL]}`;
            if (checkedMap[uid]) {
                Object.keys(totals).forEach(k => {
                    const idx = parseInt(k);
                    if (idx === TIME_COL) {
                        const rawTime = Number(d[RAW_COL]) || 0;
                        const scaled = Math.floor(rawTime / (1 + currentScale/100));
                        totals[idx] += scaled;
                    } else {
                        totals[idx] += parseNumber(d[idx]);
                    }
                });
            }
        });

        // Build header and totals row only for non-zero totals (user requested not showing zero totals)
        const headerCells = [];
        const totalCells = [];
        Object.keys(totals).forEach(k => {
            const idx = parseInt(k);
            if (totals[idx] !== 0) {
                headerCells.push(`<th>${stripHtml(colsDef[idx].title)}</th>`);
                if (idx === TIME_COL) totalCells.push(`<td>${formatTime(totals[idx])}</td>`);
                else totalCells.push(`<td>${formatShort(totals[idx])}</td>`);
            }
        });

        $('#totalsHeader').html(headerCells.join(''));
        $('#totalsBody').html(totalCells.join(''));
    }

    
    // --- Delegated handlers ---

    // Rewards checkboxes
    $('#rewardsTable tbody').on('change', '.row-checkbox', function(){
        const uid = $(this).attr('data-uid');
        const parts = (uid || "").split('|');
        if (parts.length >= 2) {
            const normalized = `${stripHtml(parts[0])}|${parts.slice(1).join('|')}`;
            missionsCheckedMap[normalized] = $(this).is(':checked');
        } else {
            missionsCheckedMap[uid] = $(this).is(':checked');
        }
        updateMissionsTotals();
    });

    // Remove All button for Main Missions
    $(document).on('click', '#removeAllRewards', function(e){
        e.preventDefault();
        Object.keys(missionsCheckedMap).forEach(k => delete missionsCheckedMap[k]);
        rewardsTable.rows().every(function(){
            const d = this.data();
            const uid = `${stripHtml(d[0])}|${d[2]}`;
            missionsCheckedMap[uid] = false;
        });
        rewardsTable.rows().invalidate().draw(false);
        updateMissionsTotals();
    });

    // keep .time-scale input synchronized and apply scale on input (works for clones too)
    $(document).on('input', '.time-scale', function(){
        const parsed = parseFloat($(this).val());
        if (!isNaN(parsed)) currentScale = parsed;
        // sync both original and floating header clones
        $('.time-scale').val(currentScale);
        applyScale(currentScale);
    });

    // checkbox change -> update checkedMap & totals
    $('#costsTable tbody').on('change', '.row-checkbox', function(){
        const uid = $(this).attr('data-uid');
        // normalize uid to be safe
        const parts = (uid || "").split('|');
        if (parts.length >= 2) {
            const normalized = `${stripHtml(parts[0])}|${parts.slice(1).join('|')}`;
            checkedMap[normalized] = $(this).is(':checked');
        } else {
            checkedMap[uid] = $(this).is(':checked');
        }
        updateTotals();
    });

    
    // Remove All button in header (may be cloned by FixedHeader, so delegate)
    $(document).on('click', '#removeAll', function(e){
        e.preventDefault();
        // clear the map entirely (removes all keys)
        Object.keys(checkedMap).forEach(k => delete checkedMap[k]);

        // also ensure every current row has an explicit false so render will be consistent
        costsTable.rows().every(function(){
            const d = this.data();
            const uid = `${stripHtml(d[KEY_COL])}|${d[LEVEL_COL]}`;
            checkedMap[uid] = false;
        });

        // redraw so checkboxes reflect the cleared map
        costsTable.rows().invalidate().draw(false);
        updateTotals();
    });

    // Remove All button for custom table
    
    // ensure after every draw the .time-scale value stays (FixedHeader clones the header)
    costsTable.on('draw.dt', function(){
        $('.time-scale').val(currentScale);
    });
    
    // --- Initial totals trigger (safety) ---
    setTimeout(updateTotals, 150);
    setTimeout(updateMissionsTotals, 150);
    
    // --- Load JSON and populate tables ---
    const keyMap = {
        "Headquarters":"Headquarters","Black Market":"Blackmarket","Geoponic Farm":"Hydroponicfarm",
        "Oil Rig":"Oilrig","Alloy Refinery":"Alloyrefinery","Supply Depot":"Supplydepot","Situation Room":"War_room",
        "Engineering":"Engineering","Barracks":"Barracks","Research Lab":"Researchlab","Wall":"Walls",
        "Global Network":"Globalnetwork","Experimentation Chamber":"Experimentation_chamber",
        "Factory":"Factory","Turret":"Turret","Medical Bay":"Medicalbay","Hostile Containment":"Hostilecontainment",
        "Airstrip":"Airstrip","Satellite Uplink":"Satelliteuplink","Security Station":"Securitystation",
        "Robotics Bay":"Robotics_bay","Command Post":"Commandpost","Alien Genetics Labs":"Alien_genetics_lab",
        "Hero Armory":"Hero_armory","Bunker":"Shelter","Shard Reactor":"Shardcondenser",
        "Outpost Strategic":"Outpost_strategic","Outpost Harvest":"Outpost_harvest"
    };

    Promise.all([
        fetch('molds/categories/structures.json').then(r => r.json()),
        fetch('molds/categories/objective.json').then(r => r.json()).catch(() => ({}))
    ])
    .then(([data, objectives]) => {
        const subtypes = data._subtypes || {};
        window.structuresSubtypes = subtypes;

        // Build objective power delta map: target_subtype -> deltas by level
        const objMap = {};
        const oSub = (objectives && objectives._subtypes) || {};
        Object.values(oSub).forEach(obj => {
            const levels = obj.levels || [];
            let prev = 0;
            let targetKey = null;
            for (let i = 1; i < levels.length; i++) {
                const lvl = levels[i] || {};
                const req0 = (lvl.requirements || [])[0] || {};
                if (!targetKey && req0.target_subtype) targetKey = String(req0.target_subtype).toLowerCase();
                const cum = Number(lvl.power || 0);
                const delta = cum - prev;
                prev = cum;
                if (targetKey) {
                    if (!objMap[targetKey]) objMap[targetKey] = [];
                    objMap[targetKey][i] = delta;
                }
            }
        });

        Object.entries(subtypes).forEach(([key, building]) => {
            let prevPower = 0;

            (building.levels || []).forEach((lvl, i) => {
                if (!Object.keys(lvl).length) return;

                const power = ((lvl.power ?? 0) - prevPower);
                prevPower = lvl.power ?? 0;

                const getCost = (sub) => formatShort(lvl.costs?.find(c => c.target_subtype === sub)?.quantity ?? 0);

                const row = [
                    key,       // Key (hidden)
                    null,      // checkbox column - render will create the input
                    i,         // Level
                    lvl.upgrade_cost > 0 ? formatTime(Math.floor(lvl.upgrade_cost / (1 + currentScale/100))) : "-",
                    formatShort(power),
                    getCost('currency3'), getCost('currency4'), getCost('currency5'), getCost('currency6'),
                    getCost('currency7'), getCost('currency8'),
                    getCost('core_neutronium_crystal'), getCost('core_classified_documents'), getCost('core_data_disk'),
                    getCost('core_alien_power_core'), getCost('core_alien_component'), getCost('core_alien_armor'),
                    getCost('armory_blueprints'),
                    lvl.upgrade_cost // _raw = last element
                ];

                // add row
                costsTable.row.add(row);

                // rewards & stats
                const tech25n = Math.floor(parseNumber(getCost('currency3')) * 0.25);
                const food25n = Math.floor(parseNumber(getCost('currency4')) * 0.25);
                const oil25n = Math.floor(parseNumber(getCost('currency5')) * 0.25);
                const alloy25n = Math.floor(parseNumber(getCost('currency6')) * 0.25);
                const neutronium25n = Math.floor(parseNumber(getCost('currency7')) * 0.25);

                // Objective power per level using objective.json (same differential equation)
                const targetSub = (keyMap[key] || key).toString().toLowerCase();
                const missionDelta = objMap[targetSub]?.[i];
                const missionPower = missionDelta ? formatShort(missionDelta) : "-";

                rewardsTable.row.add([
                    key, null, i,
                    formatShort(lvl.reward?.hero_xp ?? 0),
                    missionPower,
                    formatShort(tech25n), formatShort(food25n), formatShort(oil25n), formatShort(alloy25n), formatShort(neutronium25n)
                ]);
                /* stats rows are populated per building on selection */
            });
        });

        // initial draw
        costsTable.draw();
        rewardsTable.draw();
        statsTable.draw();

        // ensure only a fixed number of rows are visible via scroll height
        setTimeout(function(){
            setScrollRows(costsTable, VISIBLE_ROWS);
            setScrollRows(rewardsTable, VISIBLE_ROWS);
            setScrollRows(statsTable, VISIBLE_ROWS);
        }, 0);

        // sync header input
        $('.time-scale').val(currentScale);

        // ensure Stats table is built for the active building on load
        try {
            const activeName = $('.section.active').text().trim() || 'Headquarters';
            const mapped = keyMap[activeName] || activeName;
            rebuildStatsTableFor(mapped);
        } catch(e) { /* ignore */ }

        // draw tree lines (if you use them)
        setTimeout(drawLines, 50);
    })
    .catch(err => console.error('Failed to load structures/objectives json', err));

    // --- Main Missions totals (independent) ---
    function updateMissionsTotals(){
        const totals = {3:0,4:0,5:0,6:0,7:0,8:0,9:0}; // Hero XP, Power, and resources
        rewardsTable.rows({search:'applied'}).every(function(){
            const d = this.data();
            const uid = `${stripHtml(d[0])}|${d[2]}`;
            if (missionsCheckedMap[uid]) {
                Object.keys(totals).forEach(k => {
                    const idx = parseInt(k);
                    totals[idx] += parseNumber(d[idx]);
                });
            }
        });
        const headerCells = [];
        const totalCells = [];
        Object.keys(totals).forEach(k => {
            const idx = parseInt(k);
            if (totals[idx] !== 0) {
                const title = rewardsTable.settings()[0].aoColumns[idx].sTitle;
                headerCells.push(`<th>${stripHtml(title)}</th>`);
                totalCells.push(`<td>${formatShort(totals[idx])}</td>`);
            }
        });
        $('#missionsTotalsHeader').html(headerCells.join(''));
        $('#missionsTotalsBody').html(totalCells.join(''));
    }

    // --- Tree filter (same behaviour as you had) ---
    const columnMap = {"War_room":[12],"Commandpost":[13],"Engineering":[14],"Researchlab":[15],"Walls":[16],"Turret":[16],"Hero_armory":[17]};
    const timeHidden = ["Outpost_harvest","Outpost_strategic"];
    const outposts = ["Outpost_harvest","Outpost_strategic"];

    $('.section').on('click', function(){
        $('.section').removeClass('active'); $(this).addClass('active');

        const jsonKey = keyMap[$(this).text().trim()] || $(this).text().trim();
        [costsTable, rewardsTable, statsTable].forEach(tbl => tbl.column(KEY_COL).search(jsonKey, true, false).draw());

        // hide all conditional columns first (indices based on colsDef)
        costsTable.columns([TIME_COL, 10,11,12,13,14,15,16,17]).visible(false);

        // time column visible if not hidden for this jsonKey
        if (!timeHidden.includes(jsonKey)) costsTable.column(TIME_COL).visible(true);

        // CNC (neutronium crystal) columns mapping
        if (!outposts.includes(jsonKey)) costsTable.column(11).visible(true); // CNC
        if (outposts.includes(jsonKey)) costsTable.column(10).visible(true); // Alliance Credits

        if (columnMap[jsonKey]) columnMap[jsonKey].forEach(idx => costsTable.column(idx).visible(true));

        rebuildStatsTableFor(jsonKey);

        $('.time-scale').val(currentScale);
        setTimeout(drawLines, 20);
    });
    $('.section.root').trigger('click');

    // --- Draw tree lines ---
    function drawLines(){
        const svg = document.getElementById('lines');
        if (!svg) return;
        svg.innerHTML = '';
        const container = document.getElementById('mapContainer');
        if (!container) return;

        const treeMap = {
            "Headquarters": ["Bunker","Black Market","Geoponic Farm","Oil Rig","Alloy Refinery","Supply Depot","Situation Room"],
            "Bunker": [], "Black Market": ["Engineering"], "Engineering": ["Experimentation Chamber","Factory","Turret"],
            "Factory": ["Robotics Bay"], "Geoponic Farm": ["Barracks"], "Oil Rig": ["Research Lab"], "Alloy Refinery": ["Wall"],
            "Barracks": ["Medical Bay","Command Post"], "Research Lab": ["Hostile Containment","Shard Reactor"], "Medical Bay": [],
            "Hostile Containment": ["Alien Genetics Labs"], "Wall": ["Airstrip","Satellite Uplink"], "Command Post": ["Hero Armory"],
            "Robotics Bay": [], "Alien Genetics Labs": [], "Hero Armory": [], "Supply Depot": ["Global Network"], "Global Network": ["Security Station"],
            "Situation Room": [], "Airstrip": [], "Satellite Uplink": [], "Security Station": [], "Turret": [], "Experimentation Chamber": [],
            "Shard Reactor": [], "Outpost Harvest": [], "Outpost Strategic": []
        };

        const elems = Array.from(container.children)
            .filter(el => el.classList && el.classList.contains('section'))
            .reduce((acc, el) => { acc[el.innerText.trim()] = el; return acc; }, {});

        for (let parentName in treeMap) {
            const children = treeMap[parentName];
            if (!children.length) continue;
            const parentEl = elems[parentName];
            if (!parentEl) continue;
            const parentRect = parentEl.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const startX = parentRect.right - containerRect.left;
            const startY = parentRect.top - containerRect.top + parentRect.height/2;

            children.forEach(childName => {
                const childEl = elems[childName]; if (!childEl) return;
                const childRect = childEl.getBoundingClientRect();
                const endX = childRect.left - containerRect.left;
                const endY = childRect.top - containerRect.top + childRect.height/2;
                const midX = startX + (endX - startX) / 2;

                const polyline = document.createElementNS("http://www.w3.org/2000/svg","polyline");
                polyline.setAttribute('points', `${startX},${startY} ${midX},${startY} ${midX},${endY} ${endX},${endY}`);
                polyline.setAttribute('stroke', '#ffcc00');
                polyline.setAttribute('stroke-width', '2');
                polyline.setAttribute('fill', 'none');
                polyline.setAttribute('stroke-linecap', 'round');
                polyline.setAttribute('stroke-linejoin', 'round');
                svg.appendChild(polyline);
            });
        }
    }
    window.addEventListener('resize', function(){ setTimeout(drawLines, 20); });

    // --- Toggle tables ---
    $('.toggle-table-btn').on('click', function(){
        $('.toggle-table-btn').removeClass('active'); $(this).addClass('active');
        const tbl = $(this).data('table');

        $('#costsWrapper, #rewardsWrapper, #statsWrapper').css({height:0, overflow:'hidden'});
        $(`#${tbl}Wrapper`).css({height:'auto', overflow:'visible'});
        // show totals for active table only
        $('#missionsTotals').css('display', tbl === 'rewards' ? 'block' : 'none');
        $('#costsTotals').css('display', tbl === 'costs' ? 'block' : 'none');

        try {
            costsTable.fixedHeader.adjust();
            rewardsTable.fixedHeader.adjust();
            statsTable.fixedHeader.adjust();
        } catch(e){ /* ignore */ }

        // adjust the visible rows for the active table
        setTimeout(function(){
            if (tbl === 'costs') setScrollRows(costsTable, VISIBLE_ROWS);
            else if (tbl === 'rewards') setScrollRows(rewardsTable, VISIBLE_ROWS);
            else if (tbl === 'stats') setScrollRows(statsTable, VISIBLE_ROWS);
        }, 0);

        setTimeout(drawLines, 20);
    });

});
