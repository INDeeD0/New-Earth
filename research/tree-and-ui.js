// tree-and-ui.js
// Handles tree clicks, SVG line drawing, table toggles, and event delegation.

const UI = (function(Helpers, Tables, DataLoader, Totals){
    // reuse maps referenced by Tables renderer
    const checkedMap = Totals.getCheckedMap();
    const missionsCheckedMap = Totals.getMissionsCheckedMap();

    function drawLines(){
        const gridLines = [//column,row
            { from: [0,1], to: [4,1] },
            { from: [0,1], to: [1,0] },
            { from: [1,0], to: [22,0] },
            { from: [4,0], to: [5,1] },
            { from: [5,1], to: [7,1] },
            { from: [7,1], to: [8,0] },
            { from: [9,0], to: [10,1] },                
            { from: [10,1], to: [11,1] },
            { from: [11,1], to: [12,0] },
            { from: [12,0], to: [13,1] },
            { from: [16,0], to: [17,1] },
            { from: [19,0], to: [20,1] },
            { from: [20,1], to: [22,1] },
            { from: [2,2], to: [25,2] },
            { from: [7,2], to: [8,1] },
            { from: [8,1], to: [9,1] },
            { from: [9,1], to: [10,2] },
            { from: [11,2], to: [12,1] },
            { from: [15,2], to: [16,1] },
            { from: [22,2], to: [23,1] },
            { from: [23,1], to: [25,1] },
            { from: [14,1], to: [15,1] },
            { from: [1,1], to: [2,2] },
            { from: [4,1], to: [5,2] },
        ];

        const svg = document.getElementById("lines");
            const container = document.getElementById("mapContainer");
            if (!svg || !container) return;

            svg.innerHTML = "";

            const COL_W = 150;
            const ROW_H = 100;
            const GAP_X = 20;
            const GAP_Y = 5;

            // Make SVG match the TOTAL internal scroll area
            svg.setAttribute("width", container.scrollWidth);
            svg.setAttribute("height", container.scrollHeight);

            function getCenter(col, row) {
                return {
                    x: col * (COL_W + GAP_X) + COL_W / 2,
                    y: row * (ROW_H + GAP_Y) + ROW_H / 2
                };
            }

            gridLines.forEach(conn => {
                const a = getCenter(conn.from[0], conn.from[1]);
                const b = getCenter(conn.to[0], conn.to[1]);

                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", a.x);
                line.setAttribute("y1", a.y);
                line.setAttribute("x2", b.x);
                line.setAttribute("y2", b.y);
                line.setAttribute("stroke", "#ffcc00");
                line.setAttribute("stroke-width", "2");
                line.setAttribute("stroke-linecap", "round");

                svg.appendChild(line);
            });
        }

        const container = document.getElementById("mapContainer");
        if (container) {
            container.addEventListener("scroll", () => requestAnimationFrame(drawLines));
        }
        window.addEventListener("resize", () => requestAnimationFrame(drawLines));

    function wireTreeClicks(keyMap, objMap) {
        $('.section').on('click', function () {
            // === UI highlight ===
            $('.section').removeClass('active');
            $(this).addClass('active');

            const displayName = $(this).text().trim();
            const mappedKey = keyMap[displayName] || displayName;
            const lowerKey = mappedKey.toLowerCase();
            const safeKey = lowerKey.replace(/[\s_]/g, '');

            // === Hide all cost wrappers, then show the selected one ===
            $('.costsWrapper').hide();
            const $wrapper = $(`#costsWrapper-${safeKey}`);
            if ($wrapper.length) $wrapper.show();

            // === Get the correct DataTable instance ===
            const dt = Tables.allCostsTables?.[safeKey];
            if (!dt) {
                console.warn(`⚠️ No DataTable found for ${safeKey}`);
                return;
            }

            // === STATS TABLE + MISSIONS TABLE ===
            let structureData = window.structuresSubtypes?.[lowerKey];
            if (!structureData) {
                const allSubs = window.structuresSubtypes || {};
                const norm = lowerKey.replace(/[ _]/g, '');
                const matchSub = Object.keys(allSubs).find(k =>
                    k.replace(/[ _]/g, '').toLowerCase() === norm
                ) || Object.keys(allSubs).find(k =>
                    k.replace(/[ _]/g, '').toLowerCase().includes(norm)
                );
                if (matchSub) structureData = allSubs[matchSub];
            }

            $('.rewardsWrapper, .statsWrapper').hide();
            $(`#rewardsWrapper-${safeKey}`).show();
            $(`#statsWrapper-${safeKey}`).show();
            $('.time-scale').val(currentScale);

            // === Adjust scrolling height ===
            Tables.setScrollRows(dt);
            Tables.applyScale(window.currentScale);
            setTimeout(drawLines, 20);
        });

        // === Trigger default root click (Headquarters, etc.) ===
        $('.section.root').trigger('click');
    }

    function wireTableToggle() {
        $('.toggle-table-btn').on('click', function () {
            // Highlight the active toggle
            $('.toggle-table-btn').removeClass('active');
            $(this).addClass('active');

            const tbl = $(this).data('table'); // 'costs', 'missions', or 'stats'

            // Hide all master containers first
            $('#costsMasterContainer, #missionsMasterContainer, #statsMasterContainer')
                .css({ height: 0, overflow: 'hidden', display: 'none' });

            // Show only the selected one
            if (tbl === 'costs') {
                $('#costsMasterContainer').css({ height: 'auto', overflow: 'visible', display: 'block' });
            } else if (tbl === 'missions') {
                $('#missionsMasterContainer').css({ height: 'auto', overflow: 'visible', display: 'block' });
            } else if (tbl === 'stats') {
                $('#statsMasterContainer').css({ height: 'auto', overflow: 'visible', display: 'block' });
            }

            // Totals visibility
            $('#missionsTotals').css('display', tbl === 'missions' ? 'block' : 'none');
            $('#costsTotals').css('display', tbl === 'costs' ? 'block' : 'none');

            // Adjust DataTables headers if visible
            try {
                Object.values(Tables.allCostsTables || {}).forEach(dt => dt.columns.adjust());
                Object.values(Tables.allMissionsTables || {}).forEach(dt => dt.columns.adjust());
                Object.values(Tables.allStatsTables || {}).forEach(dt => dt.columns.adjust());
            } catch (e) { /* ignore */ }

            // Recalculate visible scroll height
            setTimeout(function () {
                if (tbl === 'costs') {
                    Object.values(Tables.allCostsTables || {}).forEach(dt => Tables.setScrollRows(dt));
                } else if (tbl === 'missions') {
                    Object.values(Tables.allMissionsTables || {}).forEach(dt => Tables.setScrollRows(dt));
                } else if (tbl === 'stats') {
                    Object.values(Tables.allStatsTables || {}).forEach(dt => Tables.setScrollRows(dt));
                }
            }, 0);

            setTimeout(drawLines, 20);
        });

        // ✅ Default view = Costs table only
        $('#costsMasterContainer').css({ height: 'auto', overflow: 'visible', display: 'block' });
        $('#missionsMasterContainer, #statsMasterContainer').css({ height: 0, overflow: 'hidden', display: 'none' });
        $('#costsTotals').hide();
        $('#missionsTotals').hide();
    }
    function autoTickChain(buildingKey, level, visited = new Set(), depth = 0, tickedMap = {}) {
        const subs = window.structuresSubtypes || {};
        const keyMap = window.loadedKeyMap || window.keyMap || {};
        const normalize = s => (s || '').toString().toLowerCase().replace(/[\s_]/g, '');
        const pretty = s => s.charAt(0).toUpperCase() + s.slice(1);

        let mapped = keyMap[buildingKey] || buildingKey;
        let normKey = normalize(mapped);

        // --- match to structure ---
        if (!subs[normKey]) {
            const match = Object.keys(subs).find(k => normalize(k) === normKey)
                || Object.keys(subs).find(k => normalize(k).includes(normKey))
                || Object.keys(subs).find(k => normKey.includes(normalize(k)));
            if (match) normKey = normalize(match);
            else {
                console.warn(`⚠️ No matching structure for "${buildingKey}" → "${normKey}", stopping chain.`);
                return;
            }
        }

        let structure = subs[normKey];
        if (!structure || !Array.isArray(structure.levels)) {
            console.warn(`⚠️ Invalid structure data for ${normKey}, stopping.`);
            return;
        }

        const nodeId = `${normKey}|${level}`;
        if (visited.has(nodeId)) return;
        visited.add(nodeId);
        // snapshot currently-checked uids (only on the root call)
        let __preCheckedSet = null;
        if (depth === 0) {
            __preCheckedSet = new Set();
            document.querySelectorAll('.row-checkbox:checked').forEach(cb => {
                const uid = cb.getAttribute('data-uid');
                if (uid) __preCheckedSet.add(uid);
            });
        }

        // --- Owned levels from inputs ---
        const currentLevels = {};
        document.querySelectorAll('.section input[type="number"]').forEach(inp => {
            const name = inp.closest('.section')?.innerText?.trim();
            if (!name) return;
            const mappedName = keyMap[name] || name;
            const val = parseInt(inp.value, 10);
            if (!isNaN(val)) currentLevels[normalize(mappedName)] = val;
        });

        // --- Step 1: ensure all previous levels of *this* building are ticked ---
        const ownedLvl = currentLevels[normKey] || 0;
        for (let i = ownedLvl + 1; i <= level; i++) {
            const uid = `${normKey}|${i}`;
            const checkbox = $(`.row-checkbox[data-uid*="${normKey}"][data-uid$="|${i}"]`);
            if (checkbox.length && !checkbox.prop('checked')) {
                checkbox.prop('checked', true).trigger('change');
                if (!tickedMap[normKey]) tickedMap[normKey] = [];
                tickedMap[normKey].push(i);
            }
        }

        // --- Step 2: process requirements recursively ---
        const lvlData = structure.levels[level];
        if (lvlData && Array.isArray(lvlData.requirements)) {
            lvlData.requirements.forEach(req => {
                if (req.subtype !== 'structure' || !req.target_subtype) return;

                const reqKey = keyMap[req.target_subtype] || req.target_subtype;
                const reqNorm = normalize(reqKey);
                const match = Object.keys(subs).find(k => normalize(k) === reqNorm)
                    || Object.keys(subs).find(k => normalize(k).includes(reqNorm))
                    || Object.keys(subs).find(k => reqNorm.includes(normalize(k)));
                if (!match) return;

                const finalReqNorm = normalize(match);
                let reqLvl = Math.min(parseInt(req.level, 10) || 1, (subs[finalReqNorm]?.levels?.length || 1) - 1);

                const ownedLvl = currentLevels[finalReqNorm] || 0;
                if (ownedLvl >= reqLvl) return;

                const uid = `${finalReqNorm}|${reqLvl}`;
                const checkbox = $(`.row-checkbox[data-uid*="${finalReqNorm}"][data-uid$="|${reqLvl}"]`);
                if (checkbox.length && !checkbox.prop('checked')) {
                    checkbox.prop('checked', true).trigger('change');
                    if (!tickedMap[finalReqNorm]) tickedMap[finalReqNorm] = [];
                    tickedMap[finalReqNorm].push(reqLvl);
                }

                autoTickChain(reqKey, reqLvl, visited, depth + 1, tickedMap);
            });
        }

        // === Summary (only print once at the very end) ===
        if (depth === 0) {
            // Create or reuse a global buffer
            window.__autoTickBuffer = window.__autoTickBuffer || [];
            const isRootCall = !window.__autoTickActive;
            window.__autoTickActive = true;

            // snapshot before tick run (for difference calc)
            const before = new Set();
            document.querySelectorAll('.row-checkbox:checked').forEach(cb => before.add(cb.dataset.uid));

            // defer so all sub-ticks & .trigger('change') complete
            setTimeout(() => {
                const after = new Set();
                document.querySelectorAll('.row-checkbox:checked').forEach(cb => after.add(cb.dataset.uid));

                const diff = [...after].filter(uid => !before.has(uid));
                window.__autoTickBuffer.push(...diff);

                // only print once when no other autoTickChain is active
                if (isRootCall) {
                    const added = Array.from(new Set(window.__autoTickBuffer));
                    window.__autoTickBuffer = [];
                    window.__autoTickActive = false;

                    if (added.length === 0) {
                        showPopup("🧩 No new ticks were applied.");
                    } else {
                        added.push(`${normalize(buildingKey)}|${level}`);

                        // group and compress
                        const grouped = {};
                        added.forEach(uid => {
                            const [key, lvlStr] = uid.split('|');
                            const lvl = parseInt(lvlStr, 10);
                            if (!grouped[key]) grouped[key] = [];
                            if (!isNaN(lvl)) grouped[key].push(lvl);
                        });

                        const compress = arr => {
                            const sorted = [...new Set(arr)].sort((a,b)=>a-b);
                            const out = [];
                            for (let n of sorted) {
                                if (!out.length) out.push([n,n]);
                                else if (n === out[out.length-1][1] + 1) out[out.length-1][1] = n;
                                else out.push([n,n]);
                            }
                            return out.map(r => r[0]===r[1]?`${r[0]}`:`${r[0]}–${r[1]}`).join(', ');
                        };

                        const pretty = s => s.replace(/[_-]+/g,' ')
                                            .replace(/\b\w/g,c=>c.toUpperCase());

                        let total = 0;
                        let lines = [];
                        Object.entries(grouped).forEach(([k,v])=>{
                            total += v.length;
                            lines.push(`✔ ${pretty(k)}: ${compress(v)}`);
                        });

                        const message = `
                            <strong>✅ Auto-tick Summary</strong><br>
                            ${lines.join('<br>')}
                            <br><strong>🧮 Buildings Required:</strong> ${total}
                        `;
                        showPopup(message, 9000);
                    }

                    // redraw once at the end
                    if (Tables.allCostsTables) {
                        Object.values(Tables.allCostsTables).forEach(dt => dt.rows().invalidate().draw(false));
                    }
                    Totals.updateCostsTotals(window.currentScale);
                }


            }, 100);
        }
    }


    function wireDelegatedHandlers(){
        // ✅ COSTS checkboxes (all cost tables)
        $(document).on('change', '.costsWrapper .row-checkbox', function(){
            const $cb = $(this);
            const uid = $cb.data('uid');
            const jsonKey = $cb.data('json');
            const lvl = parseInt($cb.data('lvl'), 10);
            const isChecked = $cb.is(':checked');

            checkedMap[uid] = isChecked;
            Totals.updateCostsTotals(window.currentScale);

            if (isChecked && $('#autoLinkToggle').is(':checked')) {
                // 🔁 Auto-tick the full prerequisite chain (only if Auto-total is ON)
                autoTickChain(jsonKey, lvl);
            }100
        });

        // ✅ Remove All button for COSTS (multi-table safe)
        $(document).on('click', '#removeAllCosts', function(e){
            e.preventDefault();
            Object.keys(checkedMap).forEach(k => delete checkedMap[k]);

            if (Tables.allCostsTables) {
                Object.values(Tables.allCostsTables).forEach(dt => {
                    if (!dt || typeof dt.rows !== 'function') return;
                    dt.rows().every(function() {
                        const d = this.data();
                        if (!d) return;
                        const uid = `${Helpers.stripHtml(d[0])}|${d[2]}`;
                        checkedMap[uid] = false;
                    });
                    dt.rows().invalidate().draw(false);
                });
            }

            Totals.updateCostsTotals(window.currentScale);
        });

        // ✅ Rewards checkboxes (all mission tables)
        $(document).on('change', '.rewardsWrapper .row-checkbox', function(){
            const uid = $(this).attr('data-uid');
            const normalized = normalizeUid(uid);
            missionsCheckedMap[normalized] = $(this).is(':checked');
            Totals.updateMissionsTotals();
        });

        // ✅ Remove All button for Rewards (multi-table safe)
        $(document).on('click', '#removeAllRewards', function(e){
            e.preventDefault();
            Object.keys(missionsCheckedMap).forEach(k => delete missionsCheckedMap[k]);

            if (Tables.allMissionsTables) {
                Object.values(Tables.allMissionsTables).forEach(dt => {
                    if (!dt || typeof dt.rows !== 'function') return;
                    dt.rows().every(function() {
                        const d = this.data();
                        if (!d) return;
                        const uid = `${Helpers.stripHtml(d[0])}|${d[2]}`;
                        missionsCheckedMap[uid] = false;
                    });
                    dt.rows().invalidate().draw(false);
                });
            }

            Totals.updateMissionsTotals();
        });

        // time-scale + costs remain the same ...
    }


    function normalizeUid(uid){
        const parts = (uid || "").split('|');
        if (parts.length >= 2) {
            return `${Helpers.stripHtml(parts[0])}|${parts.slice(1).join('|')}`;
        }
        return uid;
    }

    // public bootstrap after data loaded and tables created
    function bootstrap(data){
        const keyMap = data.keyMap;
        const objMap = data.objMap;
        const subs = window.structuresSubtypes || {};
        Tables.allCostsTables = Tables.createAllCostsTables(subs, Totals.getCheckedMap());
        Tables.populateAllCostsTables(subs, Totals.getCheckedMap());
        Tables.allMissionsTables = Tables.createAllMissionsTables(subs, Totals.getMissionsCheckedMap());
        Tables.populateAllMissionsTables(subs, Totals.getMissionsCheckedMap(), objMap);
        Tables.allStatsTables = Tables.createAllStatsTables(subs);
        Tables.populateAllStatsTables(subs);

        // initial draw of lines
        setTimeout(drawLines, 50);
        window.addEventListener('resize', function(){ setTimeout(drawLines, 20); });

        wireTreeClicks(keyMap, objMap);
        wireTableToggle();
        wireDelegatedHandlers();

        setTimeout(() => Totals.updateCostsTotals(currentScale), 150);
        setTimeout(() => Totals.updateMissionsTotals(), 150);

    }

    // 👇 nothing else goes here inside the module
    return { bootstrap, drawLines };
})(Helpers, Tables, DataLoader, Totals);

