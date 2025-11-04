// totals.js
// calculates totals for costs and missions. Depends on Tables and Helpers.

const Totals = (function(Helpers, Tables){
    // these maps are global-like in original; we keep them accessible
    // checkedMap and missionsCheckedMap are created here and reused
    const checkedMap = Object.create(null);
    const missionsCheckedMap = Object.create(null);

    // expose for other modules that may need to set/clear/check
    function getCheckedMap(){ return checkedMap; }
    function getMissionsCheckedMap(){ return missionsCheckedMap; }

    function updateCostsTotals(currentScale){
        const totals = {};
        const allTables = Tables.allCostsTables || {};
        const allChecked = Totals.getCheckedMap();

        // === Prepare combined totals for all visible columns across all tables ===
        let sampleCols = null;
        for (const key in allTables) {
            const dt = allTables[key];
            if (dt && dt.settings && dt.settings().length) {
                sampleCols = dt.settings()[0].aoColumns;
                break;
            }
        }
        if (!sampleCols) {
            console.warn("⚠️ No tables found for global totals");
            return;
        }

        sampleCols.forEach((col, idx) => {
            if (idx === Tables.KEY_COL || idx === Tables.CHECKBOX_COL || idx === Tables.LEVEL_COL) return;
            totals[idx] = 0;
        });

        // === Loop through every building table ===
        Object.entries(allTables).forEach(([safeKey, dt]) => {
            if (!dt) return;

            dt.rows({ search: 'applied' }).every(function(){
                const d = this.data();
                const uid = `${Helpers.stripHtml(d[Tables.KEY_COL])}|${d[Tables.LEVEL_COL]}`;
                if (!allChecked[uid]) return;

                Object.keys(totals).forEach(k => {
                    const idx = parseInt(k);

                    // special handling for time
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
                        return;
                    }

                    totals[idx] += Helpers.parseNumber(d[idx]);
                });
            });
        });

        // === Build totals table in #costsTotals ===
        const headerCells = [];
        const totalCells = [];

        Object.keys(totals).forEach(k => {
            const idx = parseInt(k);
            if (totals[idx] !== 0) {
                const col = sampleCols[idx];
                const title = col?.sTitle || '';
                headerCells.push(`<th>${Helpers.stripHtml(title)}</th>`);
                if (idx === Tables.TIME_COL) totalCells.push(`<td>${Helpers.formatTime(totals[idx])}</td>`);
                else totalCells.push(`<td>${Helpers.formatShort(totals[idx])}</td>`);
            }
        });

        $('#totalsHeader').html(headerCells.join(''));
        $('#totalsBody').html(totalCells.join(''));
        $('#costsTotals').show();
    }




    function updateMissionsTotals() {
        const allTables = Tables.allMissionsTables || {};
        const totals = {};
        let sampleCols = null;

        // find the first valid table
        for (const key in allTables) {
            const dt = allTables[key];
            if (dt && dt.settings && dt.settings().length) {
                sampleCols = dt.settings()[0].aoColumns;
                break;
            }
        }

        if (!sampleCols) {
            console.warn("⚠️ No missions tables found for totals");
            return;
        }

        // init totals for all numeric columns
        sampleCols.forEach((col, idx) => {
            if (idx === Tables.KEY_COL || idx === Tables.CHECKBOX_COL || idx === Tables.LEVEL_COL) return;
            totals[idx] = 0;
        });

        // loop through every missions table
        Object.values(allTables).forEach(dt => {
            if (!dt) return;
            dt.rows({ search: 'applied' }).every(function() {
                const d = this.data();
                const uid = `${Helpers.stripHtml(d[Tables.KEY_COL])}|${d[Tables.LEVEL_COL]}`;
                if (!missionsCheckedMap[uid]) return;

                Object.keys(totals).forEach(k => {
                    const idx = parseInt(k);
                    const val = Helpers.parseNumber(d[idx]);
                    totals[idx] += val;
                });
            });
        });

        // build totals display
        const headerCells = [];
        const totalCells = [];

        Object.keys(totals).forEach(k => {
            const idx = parseInt(k);
            if (totals[idx] !== 0) {
                const title = Helpers.stripHtml(sampleCols[idx]?.sTitle || '');
                headerCells.push(`<th>${title}</th>`);
                totalCells.push(`<td>${Helpers.formatShort(totals[idx])}</td>`);
            }
        });

        $('#missionsTotalsHeader').html(headerCells.join(''));
        $('#missionsTotalsBody').html(totalCells.join(''));
        $('#missionsTotals').show();
    }


    return {
        updateCostsTotals, updateMissionsTotals, getCheckedMap, getMissionsCheckedMap
    };
})(Helpers, Tables);
