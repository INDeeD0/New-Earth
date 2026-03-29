// data-loader.js
// responsible for fetching JSON files and building key maps used across modules

const DataLoader = (function(Helpers){
    const keyMap = {
        "Research Lab":"researchlab",
        "Research Knowledge":"operationsresearchknowledge",
        "Resource Knowledge":"operationsresourceknowledge",
        "Defensive Coordination":"operationsdefensivecoordination",
        "Research":"operationsresearch",
        "Construction Knowledge":"operationsconstructionknowledge",
        "Defensive Production":"operationsdefensiveproduction",
        "Construction":"operationsconstruction",
        "Tech Production":"operationstechproduction",
        "Food Production":"operationsfoodproduction",
        "Outpost Depot I":"operationsunlockoutpostdepot1",
        "Alloy Production":"operationsalloyproduction",
        "Oil Production":"operationsoilproduction",
        "Deployment Slot I":"operationsunlockdeploymentslot1",
        "Infantry Knowledge":"operationsinfantryknowledge",
        "Factory Knowledge":"operationsfactoryknowledge",
        "Troop Load":"operationstroopload",
        "Hero Facility Attack":"operationsherofacilityattack",
        "Outpost Depot II":"operationsunlockoutpostdepot2",
        "Gathering Speed":"operationsgatheringspeed",
        "Hero Facility Defense":"operationsherofacilitydefense",
        "Outpost Depot III":"operationsunlockoutpostdepot3",
        "Medical Efficiency":"operationsmedicalefficiency",
        "Outpost Knowledge":"operationsoutpostknowledge",
        "Alien Extractions":"operationsalienextractions",
        "Deployment Slot II":"operationsunlockdeploymentslot2",
        "Outpost Production":"operationsoutpostproduction",
        "Offensive Coordination":"operationsoffensivecoordination",
        "Deployment Slot III":"operationsunlockdeploymentslot3",
        "Gathering Speed II":"operationsgatheringspeed2",
        "Troop Load II":"operationstroopload2",
        "Capture Speed":"operationscapturespeed",//Operations Finish
    };
    const reverseKeyMap = Object.fromEntries(
        Object.entries(keyMap).map(([label, key]) => [key.toLowerCase(), label])
    );

    async function loadAll(){
        const structPromise = fetch('molds/categories/research-operations.json').then(r => r.json());
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
