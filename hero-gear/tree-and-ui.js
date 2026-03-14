// tree-and-ui.js
// Handles tree clicks, SVG line drawing, table toggles, and event delegation.

const UI = (function(Helpers, Tables, DataLoader, Totals){
    // === DRAG SCROLL SUPPORT FOR MAP CONTAINERS ===
    function enableDragScroll(el) {
        let isDown = false;
        let startX;
        let startY;
        let scrollLeft;
        let scrollTop;

        el.addEventListener("mousedown", (e) => {
            isDown = true;
            el.classList.add("dragging");
            startX = e.pageX - el.offsetLeft;
            startY = e.pageY - el.offsetTop;
            scrollLeft = el.scrollLeft;
            scrollTop = el.scrollTop;
        });

        el.addEventListener("mouseleave", () => {
            isDown = false;
            el.classList.remove("dragging");
        });

        el.addEventListener("mouseup", () => {
            isDown = false;
            el.classList.remove("dragging");
        });

        el.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - el.offsetLeft;
            const y = e.pageY - el.offsetTop;
            const walkX = (x - startX) * 1;
            const walkY = (y - startY) * 1;
            el.scrollLeft = scrollLeft - walkX;
            el.scrollTop = scrollTop - walkY;
        });
    }
    
    const mapLines = {
        map1: [
            { from: [0,0], to: [0,3] },
            { from: [1,0], to: [1,3] },
            { from: [2,0], to: [2,3] },
            { from: [3,0], to: [3,3] },
            { from: [4,0], to: [4,5] },
            { from: [5,0], to: [5,2] },
            { from: [6,0], to: [6,3] },
            { from: [7,0], to: [7,3] },
            { from: [8,0], to: [8,3] },
        ],

        map2: [
        ],
        map3: [
        ],
    };
    function drawLinesForMap(containerId, svgId, coordLines) {
        const container = document.getElementById(containerId);
        const svg = document.getElementById(svgId);
        if (!container || !svg) return;

        svg.innerHTML = "";

        // Make SVG match entire scroll area
        svg.setAttribute("width", container.scrollWidth);
        svg.setAttribute("height", container.scrollHeight);
        svg.setAttribute("viewBox", `0 0 ${container.scrollWidth} ${container.scrollHeight}`);

        const style = window.getComputedStyle(container);

        // --- Extract column width from grid-template-columns ---
        const colTokens = style.gridTemplateColumns.split(" ");
        let colWidth = 150;  // fallback
        if (colTokens.length > 0) {
            const match = colTokens[0].match(/(\d+)px/);
            if (match) colWidth = parseInt(match[1]);
        }

        // --- Extract row height from grid-template-rows ---
        const rowTokens = style.gridTemplateRows.split(" ");
        let rowHeight = 100; // fallback
        if (rowTokens.length > 0) {
            const match = rowTokens[0].match(/(\d+)px/);
            if (match) rowHeight = parseInt(match[1]);
        }

        // --- Extract gaps (computed by browser) ---
        const gapCol = parseInt(style.columnGap) || 0;
        const gapRow = parseInt(style.rowGap) || 0;

        // Convert grid coordinates to screen coordinates
        function center(col, row) {
            const x = (col * (colWidth + gapCol)) + colWidth / 2;
            const y = (row * (rowHeight + gapRow)) + rowHeight / 2;
            return { x, y };
        }

        // Draw lines
        for (const link of coordLines) {
            const [c1, r1] = link.from;
            const [c2, r2] = link.to;

            const p = center(c1, r1);
            const c = center(c2, r2);

            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", p.x);
            line.setAttribute("y1", p.y);
            line.setAttribute("x2", c.x);
            line.setAttribute("y2", c.y);
            line.setAttribute("stroke", "#ffcc00");
            line.setAttribute("stroke-width", "2");

            svg.appendChild(line);
        }
    }


    function initMultipleTrees(mapLines) {

        for (const mapId in mapLines) {
            const svgId = "lines" + mapId.replace("map", "");

            const redraw = () =>
                drawLinesForMap(mapId, svgId, mapLines[mapId]);

            const container = document.getElementById(mapId);
            if (!container) continue;

            container.addEventListener("scroll", () => requestAnimationFrame(redraw));
            window.addEventListener("resize", () => requestAnimationFrame(redraw));

            // initial draw
            redraw();
        }
    }



    function wireTreeClicks(keyMap) {
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
            $(`#rewardsWrapper-${safeKey}`).css('visibility','hidden').show();
            $(`#statsWrapper-${safeKey}`).css('visibility','hidden').show();
            $('.time-scale').val(currentScale);

            // === Adjust scrolling height ===
            Tables.setScrollRows(dt);
            Tables.applyScale(window.currentScale);

            // Also enforce 12-row height for missions/stats when selecting a building
            const mdt = Tables.allMissionsTables?.[safeKey];
            const sdt = Tables.allStatsTables?.[safeKey];
            setTimeout(function(){
                if (mdt) Tables.setScrollRows(mdt);
                if (sdt) Tables.setScrollRows(sdt);
                // reveal after heights are applied to avoid flicker
                $(`#rewardsWrapper-${safeKey}`).css('visibility','visible');
                $(`#statsWrapper-${safeKey}`).css('visibility','visible');
                drawLines();
            }, 0);
        });
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
            $('#statsTotals').css('display', tbl === 'stats' ? 'block' : 'none');


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
        $('#statsTotals').hide();        
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
        // ✅ Time-scale live update for costs time column
        $(document).on('input change', '.time-scale', function(){
            const val = parseFloat($(this).val());
            const scale = isNaN(val) ? 0 : val;
            window.currentScale = scale;
            try {
                // find the DataTable tied to this header input
                const $wrapper = $(this).closest('.dataTables_wrapper');
                const $bodyTable = $wrapper.find('.dataTables_scrollBody table');
                const dt = ($bodyTable.length && $.fn.DataTable.isDataTable($bodyTable[0])) ? $bodyTable.DataTable() : null;
                if (dt && typeof Tables.applyScaleForTable === 'function') {
                    Tables.applyScaleForTable(dt, scale);
                } else {
                    Tables.applyScale(scale);
                }
            } catch(e) {}
        });

        function wireTotalsSystem(config) {
            const {
                wrapper,
                removeBtn,
                tablesGetter,
                mapGetter,
                updater
            } = config;

            const checkedMap = mapGetter();

            // ✅ Checkbox change
            $(document).on('change', `${wrapper} .row-checkbox`, function(){
                const uid = normalizeUid($(this).data('uid'));
                checkedMap[uid] = $(this).is(':checked');
                updater();
            });

            // ✅ Remove All
            $(document).on('click', removeBtn, function(e){
                e.preventDefault();

                Object.keys(checkedMap).forEach(k => delete checkedMap[k]);

                const tables = tablesGetter();
                if (tables) {
                    Object.values(tables).forEach(dt => {
                        if (!dt || typeof dt.rows !== 'function') return;

                        dt.rows().every(function(){
                            const d = this.data();
                            if (!d) return;
                            const uid = `${Helpers.stripHtml(d[0])}|${d[2]}`;
                            checkedMap[uid] = false;
                        });

                        dt.rows().invalidate().draw(false);
                    });
                }

                updater();
            });
        }

        // ✅ COSTS
        wireTotalsSystem({
            wrapper: '.costsWrapper',
            removeBtn: '#removeAllCosts',
            tablesGetter: () => Tables.allCostsTables,
            mapGetter: Totals.getCheckedMap,
            updater: () => Totals.updateCostsTotals(window.currentScale)
        });

        // ✅ MISSIONS
        wireTotalsSystem({
            wrapper: '.rewardsWrapper',
            removeBtn: '#removeAllRewards',
            tablesGetter: () => Tables.allMissionsTables,
            mapGetter: Totals.getMissionsCheckedMap,
            updater: () => Totals.updateMissionsTotals()
        });

        // ✅ STATS
        wireTotalsSystem({
            wrapper: '.statsWrapper',
            removeBtn: '#removeAllStats',
            tablesGetter: () => Tables.allStatsTables,
            mapGetter: Totals.getStatsCheckedMap,
            updater: () => Totals.updateStatsTotals()
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

    function drawLines() {
        for (const mapId in mapLines) {
            const svgId = "lines" + mapId.replace("map", "");
            drawLinesForMap(mapId, svgId, mapLines[mapId]);
        }
    }
    function initInternalMapSwitching() {
        document.querySelectorAll(".nav-btn[data-map]").forEach(btn => {
            btn.addEventListener("click", () => {
                const target = btn.dataset.map;

                document.querySelectorAll(".container[id^='map']").forEach(m => {
                    m.style.display = "none";
                });

                const selected = document.getElementById(target);
                if (!selected) return;

                selected.style.display = "grid";

                // Defer root selection and line drawing to next frame to ensure layout is ready
                requestAnimationFrame(() => {
                    selectRootOfMap(selected);
                    const index = target.replace("map", "");
                    const svgId = "lines" + index;
                    drawLinesForMap(target, svgId, mapLines[target]);
                });
            });
        });
    }

    function selectRootOfMap(mapElement) {
        if (!mapElement) return;
        const root = mapElement.querySelector(".section.root");
        if (root) root.click();
    }


    // public bootstrap after data loaded and tables created
    function bootstrap(data){
        initMultipleTrees(mapLines);
        initInternalMapSwitching();
        document.querySelectorAll(".container[id^='map']").forEach(el => {
            enableDragScroll(el);
        });
        const keyMap = data.keyMap;
        const subs = window.structuresSubtypes || {};
        Tables.allCostsTables = Tables.createAllCostsTables(subs, Totals.getCheckedMap());
        Tables.populateAllCostsTables(subs, Totals.getCheckedMap());
        Tables.allMissionsTables = Tables.createAllMissionsTables(subs, Totals.getMissionsCheckedMap());
        Tables.populateAllMissionsTables(subs, Totals.getMissionsCheckedMap());
        Tables.allStatsTables = Tables.createAllStatsTables(subs, Totals.getStatsCheckedMap());
        Tables.populateAllStatsTables(subs, Totals.getStatsCheckedMap());
        // initial draw of lines
        setTimeout(drawLines, 50);
        window.addEventListener('resize', function(){ setTimeout(drawLines, 20); });
        wireTreeClicks(keyMap);
        wireTableToggle();
        wireDelegatedHandlers();
        setTimeout(() => Totals.updateCostsTotals(currentScale), 150);
        setTimeout(() => Totals.updateMissionsTotals(), 150);
        setTimeout(() => Totals.updateStatsTotals(), 150);
        // Reveal map1 without flash and auto-select its root on next frame
        requestAnimationFrame(() => {
            document.querySelectorAll(".container[id^='map']").forEach(m => {
                m.style.display = "none";
            });
            const m1 = document.getElementById("map1");
            if (!m1) return;
            m1.style.display = "grid";
            requestAnimationFrame(() => {
                const root = m1.querySelector(".section.root");
                if (root) root.click();
                const svgId = "lines1";
                drawLinesForMap("map1", svgId, mapLines["map1"]);
            });
        });
    }

    // 👇 nothing else goes here inside the module
    return { bootstrap, drawLines };
})(Helpers, Tables, DataLoader, Totals);

