// main.js
// top-level orchestrator: initializes everything in correct order

$(document).ready(async function(){
    // shared globals used by various modules (keeping them global to match your original code's behavior)
    window.currentScale = 0;

    // create DataTables and wire modules
    Tables.initDefaults();

    // create tables (they return DataTable instances if needed)
    const costs = Tables.createCostsTable();
    const rewards = Tables.createRewardsTable();
    const stats = Tables.createStatsTable();

    // load json and populate tables (mirrors original population logic)
    try {
        const data = await DataLoader.loadAll();
        const subtypes = data.subtypes;
        const keyMap = data.keyMap;
        const objMap = data.objMap;
        window.structuresSubtypes = subtypes;

        // populate tables
        Object.entries(subtypes).forEach(([key, building]) => {
            let prevPower = 0;
            (building.levels || []).forEach((lvl, i) => {
                if (!Object.keys(lvl).length) return;
                const power = ((lvl.power ?? 0) - prevPower);
                prevPower = lvl.power ?? 0;
                const getCost = (sub) => Helpers.formatShort(lvl.costs?.find(c => c.target_subtype === sub)?.quantity ?? 0);

                const row = [
                    key,       // Key (hidden)
                    null,      // checkbox column - render will create the input
                    i,         // Level
                    lvl.upgrade_cost > 0 ? Helpers.formatTime(Math.floor(lvl.upgrade_cost / (1 + window.currentScale/100))) : "-",
                    Helpers.formatShort(power),
                    getCost('currency3'), getCost('currency4'), getCost('currency5'), getCost('currency6'),
                    getCost('currency7'), getCost('currency8'),
                    getCost('core_neutronium_crystal'), getCost('core_classified_documents'), getCost('core_data_disk'),
                    getCost('core_alien_power_core'), getCost('core_alien_component'), getCost('core_alien_armor'),
                    getCost('armory_blueprints'),
                    lvl.upgrade_cost // _raw = last element
                ];

                $('#costsTable').DataTable().row.add(row);

                const tech25n = Math.floor(Helpers.parseNumber(getCost('currency3')) * 0.25);
                const food25n = Math.floor(Helpers.parseNumber(getCost('currency4')) * 0.25);
                const oil25n = Math.floor(Helpers.parseNumber(getCost('currency5')) * 0.25);
                const alloy25n = Math.floor(Helpers.parseNumber(getCost('currency6')) * 0.25);
                const neutronium25n = Math.floor(Helpers.parseNumber(getCost('currency7')) * 0.25);

                const targetSub = (keyMap[key] || key).toString().toLowerCase();
                const missionDelta = objMap[targetSub]?.[i];
                const missionPower = missionDelta ? Helpers.formatShort(missionDelta) : "-";

                $('#rewardsTable').DataTable().row.add([
                    key, null, i,
                    Helpers.formatShort(lvl.reward?.hero_xp ?? 0),
                    missionPower,
                    Helpers.formatShort(tech25n), Helpers.formatShort(food25n), Helpers.formatShort(oil25n), Helpers.formatShort(alloy25n), Helpers.formatShort(neutronium25n)
                ]);
            });
        });

        // initial draw
        $('#costsTable').DataTable().draw();
        $('#rewardsTable').DataTable().draw();
        $('#statsTable').DataTable().draw();

        // apply scroll rows
        setTimeout(function(){
            Tables.setScrollRows($('#costsTable').DataTable());
            Tables.setScrollRows($('#rewardsTable').DataTable());
            Tables.setScrollRows($('#statsTable').DataTable());
        }, 0);

        // sync header input
        $('.time-scale').val(window.currentScale);

        // ensure Stats table is built for the active building on load
        try {
            const activeName = $('.section.active').text().trim() || 'Headquarters';
            const mapped = keyMap[activeName] || activeName;
            Tables.rebuildStatsTableFor(mapped);
        } catch(e) { /* ignore */ }

        // draw tree lines
        setTimeout(() => UI.drawLines(), 50);

        // bootstrap UI (tree clicks, toggles, handlers)
        UI.bootstrap(data);
    } catch(err) {
        console.error('Failed to load structures/objectives json', err);
    }
});
// --- Page navigation (restored from original) ---
$(function(){
  $('#topNav .nav-btn').each(function(){
    const currentPage = window.location.pathname.split('/').pop().toLowerCase();
    const targetPage = $(this).data('page').toLowerCase();
    if (targetPage === currentPage) {
      $(this).addClass('active');
    }
    $(this).on('click', function(){
      window.location.href = $(this).data('page');
    });
  });
});

