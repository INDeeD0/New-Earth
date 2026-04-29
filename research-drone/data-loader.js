// data-loader.js
// responsible for fetching JSON files and building key maps used across modules

const DataLoader = (function(Helpers){
    const keyMap = {
        "Research Lab":"researchlab",        
        "Drone Command 2":"dronecommand1",
        "Drone Power Cell I":"dronepowercell1",
        "Drone Shard Reactor":"dronesharddetector",
        "Drone Command 3":"dronecommand2",
        "Drone Scanner I":"dronescanners1",
        "Drone Weapons I":"droneweaponsmk1",
        "Drone Support I":"dronesupport1",
        "Drone Command 4":"dronecommand3",
        "Drone Scanner II":"dronescanners2",
        "Drone Weapons II":"droneweaponsmk2",
        "Drone Support II":"dronesupport2",
        "Drone Command 5":"dronecommand4",
        "Drone Power Cell II":"dronepowercell2",
        "Drone Advanced Capabilities":"droneadvancedcapabilities",
        "Drone Command 6":"dronecommand5",
        "Drone Scanner III":"dronescanners3",
        "Drone Weapons III":"droneweaponsmk3",
        "Drone Support III":"dronesupport3",
        "Drone Command 7":"dronecommand6",
        "Drone Experimental Capabilities":"droneexperimentalcapabilities",
        "Drone Command 8":"dronecommand7",
        "Drone Command 9":"dronecommand8",
        "Drone Command 10":"dronecommand9",
        "Drone Shard Reactor II":"dronesharddetector2",        

    };
    const reverseKeyMap = Object.fromEntries(
        Object.entries(keyMap).map(([label, key]) => [key.toLowerCase(), label])
    );

    async function loadAll(){
        const structPromise = fetch('molds/categories/research-drone.json').then(r => r.json());
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
