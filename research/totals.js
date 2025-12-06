// totals.js
// calculates totals for costs and missions. Depends on Tables and Helpers.

const Totals = (function(Helpers, Tables){
    const checkedMap = Object.create(null);
    const missionsCheckedMap = Object.create(null);

    function getCheckedMap(){ return checkedMap; }
    function getMissionsCheckedMap(){ return missionsCheckedMap; }

    // --- Update Costs Totals ---
    function updateCostsTotals(currentScale){
        const totals = {};
        const allTables = Tables.allCostsTables || {};
        const allChecked = Totals.getCheckedMap();

        // hide container if nothing checked
        if (!Object.keys(allChecked).some(k => allChecked[k])) {
            $('#costsTotals').hide().empty();
            maybeHideAllTotals();
            return;
        }

        // find first valid table for column layout
        let sampleCols = null;
        for (const key in allTables) {
            const dt = allTables[key];
            if (dt && dt.settings && dt.settings().length) {
                sampleCols = dt.settings()[0].aoColumns;
                break;
            }
        }
        if (!sampleCols) {
            $('#costsTotals').hide().empty();
            maybeHideAllTotals();
            return;
        }

        // init totals for numeric columns
        sampleCols.forEach((col, idx) => {
            if ([Tables.KEY_COL, Tables.CHECKBOX_COL, Tables.LEVEL_COL].includes(idx)) return;
            totals[idx] = 0;
        });

        // sum up all checked rows
        Object.entries(allTables).forEach(([safeKey, dt]) => {
            if (!dt) return;
            dt.rows({ search: 'applied' }).every(function(){
                const d = this.data();
                const uid = `${Helpers.stripHtml(d[Tables.KEY_COL])}|${d[Tables.LEVEL_COL]}`;
                if (!allChecked[uid]) return;

                Object.keys(totals).forEach(k => {
                    const idx = parseInt(k);
                    if (idx === Tables.TIME_COL) {
                        const buildingName = d[Tables.KEY_COL];
                        const lvlIdx = parseInt(d[Tables.LEVEL_COL]);
                        const keyRaw = (buildingName || '').toLowerCase();
                        const structure = window.structuresSubtypes?.[keyRaw];
                        if (!structure || !structure.levels?.[lvlIdx]) return;

                        const rawTime = (d._rawTime && d._rawTime[idx])
                            ? d._rawTime[idx]
                            : Number(Helpers.lookup.lookupValue(structure.levels[lvlIdx], "upgrade_cost")) || 0;
                        const scaled = Math.floor(rawTime / (1 + currentScale / 100));
                        totals[idx] += scaled;
                    } else {
                        totals[idx] += Helpers.parseNumber(d[idx]);
                    }
                });
            });
        });

        // build totals HTML
        const headerCells = [];
        const totalCells = [];

        Object.keys(totals).forEach(k => {
            const idx = parseInt(k);
            if (totals[idx] !== 0) {
                const col = sampleCols[idx];
                const title = col?.sTitle || '';
                headerCells.push(`<th>${title}</th>`);
                totalCells.push(`<td>${
                    idx === Tables.TIME_COL
                        ? Helpers.formatTime(totals[idx])
                        : Helpers.formatShort(totals[idx])
                }</td>`);
            }
        });

        // nothing checked → hide
        if (headerCells.length === 0) {
            $('#costsTotals').hide().empty();
            maybeHideAllTotals();
            return;
        }

        const html = `
            <div class="totals-block">
                <table class="totals-table">
                    <thead>
                        <tr><th colspan="${headerCells.length}" class="totals-section-title">Costs Total</th></tr>
                        <tr>${headerCells.join('')}</tr>
                    </thead>
                    <tbody><tr>${totalCells.join('')}</tr></tbody>
                </table>
            </div>
        `;

        $('#costsTotals').html(html).css({
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center',
            margin: '10px auto'
        }).show();

        maybeShowTotalsWrapper();
    }

    // --- Update Missions Totals ---
    function updateMissionsTotals(){
        const allTables = Tables.allMissionsTables || {};
        const totals = {};

        // hide container if nothing checked
        if (!Object.keys(missionsCheckedMap).some(k => missionsCheckedMap[k])) {
            $('#missionsTotals').hide().empty();
            maybeHideAllTotals();
            return;
        }

        let sampleCols = null;
        for (const key in allTables) {
            const dt = allTables[key];
            if (dt && dt.settings && dt.settings().length) {
                sampleCols = dt.settings()[0].aoColumns;
                break;
            }
        }
        if (!sampleCols) {
            $('#missionsTotals').hide().empty();
            maybeHideAllTotals();
            return;
        }

        sampleCols.forEach((col, idx) => {
            if ([Tables.KEY_COL, Tables.CHECKBOX_COL, Tables.LEVEL_COL].includes(idx)) return;
            totals[idx] = 0;
        });

        Object.values(allTables).forEach(dt => {
            if (!dt) return;
            dt.rows({ search: 'applied' }).every(function(){
                const d = this.data();
                const uid = `${Helpers.stripHtml(d[Tables.KEY_COL])}|${d[Tables.LEVEL_COL]}`;
                if (!missionsCheckedMap[uid]) return;
                Object.keys(totals).forEach(k => {
                    totals[k] += Helpers.parseNumber(d[k]);
                });
            });
        });

        const headerCells = [];
        const totalCells = [];
        Object.keys(totals).forEach(k => {
            const idx = parseInt(k);
            if (totals[idx] !== 0) {
                const title = sampleCols[idx]?.sTitle || '';
                headerCells.push(`<th>${title}</th>`);
                totalCells.push(`<td>${Helpers.formatShort(totals[idx])}</td>`);
            }
        });

        if (headerCells.length === 0) {
            $('#missionsTotals').hide().empty();
            maybeHideAllTotals();
            return;
        }

        const html = `
            <div class="totals-block">
                <table class="totals-table">
                    <thead>
                        <tr><th colspan="${headerCells.length}" class="totals-section-title">Missions Total</th></tr>
                        <tr>${headerCells.join('')}</tr>
                    </thead>
                    <tbody><tr>${totalCells.join('')}</tr></tbody>
                </table>
            </div>
        `;

        $('#missionsTotals').html(html).css({
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center',
            margin: '10px auto'
        }).show();

        maybeShowTotalsWrapper();
    }

    // --- Helpers for visibility management ---
    function maybeShowTotalsWrapper(){
        const show = $('#costsTotals').is(':visible') || $('#missionsTotals').is(':visible');
        if (show) $('#totalsWrapper').css({ display: 'flex', flexDirection: 'column', alignItems: 'center' });
    }
    function maybeHideAllTotals(){
        if (!$('#costsTotals').is(':visible') && !$('#missionsTotals').is(':visible')) {
            $('#totalsWrapper').hide();
        }
    }

    return {
        updateCostsTotals,
        updateMissionsTotals,
        getCheckedMap,
        getMissionsCheckedMap
    };
})(Helpers, Tables);
