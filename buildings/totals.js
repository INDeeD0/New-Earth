// totals.js
// calculates totals for costs and missions. Depends on Tables and Helpers.

const Totals = (function(Helpers, Tables){
    const checkedMap = Object.create(null);
    const missionsCheckedMap = Object.create(null);
    const statsCheckedMap = Object.create(null);

    function getCheckedMap(){ return checkedMap; }
    function getMissionsCheckedMap(){ return missionsCheckedMap; }
    function getStatsCheckedMap(){ return statsCheckedMap; }

    function updateTotalsSystem(config) {
        const {
            tables,
            checkedMap,
            containerId,
            sectionTitle,
            scale = null
        } = config;

        const $container = $(containerId);
        const totals = {};

        // ❌ Nothing checked
        if (!Object.keys(checkedMap).some(k => checkedMap[k])) {
            $container.hide().empty();
            maybeHideAllTotals();
            return;
        }

        // 🔍 Find sample columns
        let sampleCols = null;
        for (const key in tables) {
            const dt = tables[key];
            if (dt && dt.settings && dt.settings().length) {
                sampleCols = dt.settings()[0].aoColumns;
                break;
            }
        }

        if (!sampleCols) {
            $container.hide().empty();
            maybeHideAllTotals();
            return;
        }

        // 🧮 Initialise numeric columns
        sampleCols.forEach((col, idx) => {
            if ([Tables.KEY_COL, Tables.CHECKBOX_COL, Tables.LEVEL_COL].includes(idx)) return;
            totals[idx] = 0;
        });

        // ➕ Sum checked rows
        Object.values(tables).forEach(dt => {
            if (!dt) return;

            dt.rows({ search: 'applied' }).every(function(){
                const d = this.data();
                const uid = `${Helpers.stripHtml(d[Tables.KEY_COL])}|${d[Tables.LEVEL_COL]}`;
                if (!checkedMap[uid]) return;

                Object.keys(totals).forEach(k => {
                    const idx = parseInt(k);

                    // 🔥 Special TIME scaling (Costs only)
                    if (scale !== null && idx === Tables.TIME_COL) {
                        const raw = d._rawTime?.[Tables.TIME_COL] ?? 0; // ✅ use raw numeric value
                        totals[idx] += Math.floor(raw / (1 + scale / 100));
                    } else {
                        totals[idx] += Helpers.parseNumber(d[idx]);
                    }
                });
            });
        });

        // 🏗 Build output
        const headerCells = [];
        const totalCells = [];

        Object.keys(totals).forEach(k => {
            const idx = parseInt(k);
            if (totals[idx] !== 0) {
                const title = (sampleCols[idx]?.sTitle || '')
                    .replace(/<input[^>]*>/g, '')      // remove input tags
                    .replace(/%/g, '')                 // remove percent signs
                    .replace(/<span[^>]*>.*?<\/span>/g, '') // remove span tags and their content
                    .trim();

                headerCells.push(`<th>${title}</th>`);

                totalCells.push(`<td>${
                    (scale !== null && idx === Tables.TIME_COL)
                        ? Helpers.formatTime(totals[idx])
                        : Helpers.formatShort(totals[idx])
                }</td>`);
            }
        });

        if (headerCells.length === 0) {
            $container.hide().empty();
            maybeHideAllTotals();
            return;
        }

        const html = `
            <div class="totals-block">
                <table class="totals-table">
                    <thead>
                        <tr>
                            <th colspan="${headerCells.length}" class="totals-section-title">
                                ${sectionTitle}
                            </th>
                        </tr>
                        <tr>${headerCells.join('')}</tr>
                    </thead>
                    <tbody>
                        <tr>${totalCells.join('')}</tr>
                    </tbody>
                </table>
            </div>
        `;

        $container.html(html).css({
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center',
            margin: '10px auto'
        }).show();

        maybeShowTotalsWrapper();
    }

    function updateCostsTotals(currentScale){
        updateTotalsSystem({
            tables: Tables.allCostsTables || {},
            checkedMap: checkedMap,
            containerId: '#costsTotals',
            sectionTitle: 'Costs Total',
            scale: currentScale
        });
    }

    function updateMissionsTotals(){
        updateTotalsSystem({
            tables: Tables.allMissionsTables || {},
            checkedMap: missionsCheckedMap,
            containerId: '#missionsTotals',
            sectionTitle: 'Missions Total'
        });
    }

    function updateStatsTotals(){
        updateTotalsSystem({
            tables: Tables.allStatsTables || {},
            checkedMap: statsCheckedMap,
            containerId: '#statsTotals',
            sectionTitle: 'Stats Total'
        });
    }

    // --- Helpers for visibility management ---
    function maybeShowTotalsWrapper(){
        const show = $('#costsTotals').is(':visible') || $('#missionsTotals').is(':visible') || $('#statsTotals').is(':visible');
        if (show) $('#totalsWrapper').css({ display: 'flex', flexDirection: 'column', alignItems: 'center' });
    }
    function maybeHideAllTotals(){
        if (!$('#costsTotals').is(':visible') && !$('#missionsTotals').is(':visible') && !$('#statsTotals').is(':visible')) {
            $('#totalsWrapper').hide();
        }
    }

    return {
        updateCostsTotals,
        updateMissionsTotals,
        updateStatsTotals,
        getCheckedMap,
        getMissionsCheckedMap,
        getStatsCheckedMap,
    };
})(Helpers, Tables);
