// data-loader.js
// responsible for fetching JSON files and building key maps used across modules

const DataLoader = (function(Helpers){
    const keyMap = {
        "Power Core 1":"supplyshop_core_alien_power_core_1_a",
        "Power Core 2":"supplyshop_core_alien_power_core_1_b",
        "Power Core 3":"supplyshop_core_alien_power_core_2_a",
        "Power Core 4":"supplyshop_core_alien_power_core_2_b",
        "Alien Tech 1":"supplyshop_core_alien_component_1_a",
        "Alien Tech 2":"supplyshop_core_alien_component_1_b",
        "Alien Tech 3":"supplyshop_core_alien_component_2_a",
        "Alien Tech 4":"supplyshop_core_alien_component_2_b",
        "Alien Armor 1":"supplyshop_core_alien_armor_1_a",
        "Alien Armor 2":"supplyshop_core_alien_armor_1_b",
        "Alien Armor 3":"supplyshop_core_alien_armor_2_a",
        "Alien Armor 4":"supplyshop_core_alien_armor_2_b",
        "Data Disk 1":"supplyshop_core_data_disk_1_a",
        "Data Disk 2":"supplyshop_core_data_disk_1_b",
        "Data Disk 3":"supplyshop_core_data_disk_2_a",
        "Data Disk 4":"supplyshop_core_data_disk_2_b",
        "Classified Documents 1":"supplyshop_core_classified_documents_1_a",
        "Classified Documents 2":"supplyshop_core_classified_documents_1_b",
        "Classified Documents 3":"supplyshop_core_classified_documents_2_a",
        "Classified Documents 4":"supplyshop_core_classified_documents_2_b",
        "Armory Blueprints 1":"supplyshop_armory_blueprints_1_a",
        "Armory Blueprints 2":"supplyshop_armory_blueprints_1_b",
        "Armory Blueprints 3":"supplyshop_armory_blueprints_2_a",
        "Armory Blueprints 4":"supplyshop_armory_blueprints_2_b",
        
        
    };
    const reverseKeyMap = Object.fromEntries(
        Object.entries(keyMap).map(([label, key]) => [key.toLowerCase(), label])
    );

    async function loadAll(){
        const structPromise = fetch('molds/categories/supply_shop2.json').then(r => r.json());
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
