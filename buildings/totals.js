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

    function updateTotals(currentScale){
        const costsDef = TablesColsDefForTotals();
        const totals = {};
        costsDef.forEach((col, idx) => {
            if (idx === Tables.KEY_COL || idx === Tables.CHECKBOX_COL || idx === Tables.LEVEL_COL || idx === Tables.RAW_COL) return;
            totals[idx] = 0;
        });

        // iterate only visible rows (search applied)
        const costsTable = $('#costsTable').DataTable();
        costsTable.rows({search:'applied'}).every(function(){
            const d = this.data();
            const uid = `${Helpers.stripHtml(d[Tables.KEY_COL])}|${d[Tables.LEVEL_COL]}`;
            if (checkedMap[uid]) {
                Object.keys(totals).forEach(k => {
                    const idx = parseInt(k);
                    if (idx === Tables.TIME_COL) {
                        const rawTime = Number(d[Tables.RAW_COL]) || 0;
                        const scaled = Math.floor(rawTime / (1 + currentScale/100));
                        totals[idx] += scaled;
                    } else {
                        totals[idx] += Helpers.parseNumber(d[idx]);
                    }
                });
            }
        });

        const headerCells = [];
        const totalCells = [];
        Object.keys(totals).forEach(k => {
            const idx = parseInt(k);
            if (totals[idx] !== 0) {
                headerCells.push(`<th>${Helpers.stripHtml(TablesColTitle(idx))}</th>`);
                if (idx === Tables.TIME_COL) totalCells.push(`<td>${Helpers.formatTime(totals[idx])}</td>`);
                else totalCells.push(`<td>${Helpers.formatShort(totals[idx])}</td>`);
            }
        });

        $('#totalsHeader').html(headerCells.join(''));
        $('#totalsBody').html(totalCells.join(''));
    }

    function updateMissionsTotals(){
        const totals = {3:0,4:0,5:0,6:0,7:0,8:0,9:0};
        const rewardsTable = $('#rewardsTable').DataTable();
        rewardsTable.rows({search:'applied'}).every(function(){
            const d = this.data();
            const uid = `${Helpers.stripHtml(d[0])}|${d[2]}`;
            if (missionsCheckedMap[uid]) {
                Object.keys(totals).forEach(k => {
                    const idx = parseInt(k);
                    totals[idx] += Helpers.parseNumber(d[idx]);
                });
            }
        });
        const headerCells = [];
        const totalCells = [];
        Object.keys(totals).forEach(k => {
            const idx = parseInt(k);
            if (totals[idx] !== 0) {
                const title = $('#rewardsTable').DataTable().settings()[0].aoColumns[idx].sTitle;
                headerCells.push(`<th>${Helpers.stripHtml(title)}</th>`);
                totalCells.push(`<td>${Helpers.formatShort(totals[idx])}</td>`);
            }
        });
        $('#missionsTotalsHeader').html(headerCells.join(''));
        $('#missionsTotalsBody').html(totalCells.join(''));
    }

    // small helpers to obtain column titles from DataTables columns (safe)
    function TablesColsDefForTotals(){
        // we need to read the columns of the costs table
        const dt = $('#costsTable').DataTable();
        return dt.settings()[0].aoColumns.map(c => ({ title: c.sTitle }));
    }
    function TablesColTitle(idx){
        const dt = $('#costsTable').DataTable();
        const col = dt.settings()[0].aoColumns[idx];
        return col ? col.sTitle : '';
    }

    return {
        updateTotals, updateMissionsTotals, getCheckedMap, getMissionsCheckedMap
    };
})(Helpers, Tables);
