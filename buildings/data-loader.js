// data-loader.js
// responsible for fetching JSON files and building key maps used across modules

const DataLoader = (function(Helpers){
    const keyMap = {
        "Headquarters":"headquarters",
        "Black Market":"blackmarket",
        "Geoponic Farm":"hydroponicfarm",
        "Oil Rig":"oilrig",
        "Alloy Refinery":"alloyrefinery",
        "Supply Depot":"supplydepot",
        "Situation Room":"war_room",
        "Engineering":"engineering",
        "Barracks":"barracks",
        "Research Lab":"researchlab",
        "Wall":"walls",
        "Global Network":"globalnetwork",
        "Experimentation Chamber":"experimentation_chamber",
        "Factory":"factory",
        "Turret":"turret",
        "Medical Bay":"medicalbay",
        "Hostile Containment":"hostilecontainment",
        "Airstrip":"airstrip",
        "Satellite Uplink":"satelliteuplink",
        "Security Station":"securitystation",
        "Robotics Bay":"robotics_bay",
        "Command Post":"commandpost",
        "Alien Genetics Labs":"alien_genetics_lab",
        "Hero Armory":"hero_armory",
        "Bunker":"shelter",
        "Shard Reactor":"shardcondenser",
        "Outpost Strategic":"outpost_strategic",
        "Outpost Harvest":"outpost_harvest"
    };
    const reverseKeyMap = Object.fromEntries(
        Object.entries(keyMap).map(([label, key]) => [key.toLowerCase(), label])
    );

    async function loadAll(){
        const structPromise = fetch('molds/categories/structure.json').then(r => r.json());
        const [structuresRaw] = await Promise.all([structPromise]);
        const subtypes = structuresRaw._subtypes || {};
        window.structuresSubtypes = subtypes;

        // === Global time-scale input handler ===
        $(document).on('input change', '.time-scale', function() {
            const val = parseFloat($(this).val()) || 0;
            window.currentScale = val;

            // Find visible wrapper & table
            const $wrapper = $('.costsWrapper:visible');
            if (!$wrapper.length) return;

            const tableId = $wrapper.find('table').attr('id');
            const dt = $.fn.DataTable.isDataTable(`#${tableId}`) ? $(`#${tableId}`).DataTable() : null;
            if (!dt) return;

            applyScaleForTable(dt, val);
        });
        return { subtypes, keyMap, reverseKeyMap};
    }

    return { loadAll };
})(Helpers);
