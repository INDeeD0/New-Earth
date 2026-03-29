// data-loader.js
// responsible for fetching JSON files and building key maps used across modules

const DataLoader = (function(Helpers){
    const keyMap = {
        "Research Lab":"researchlab",//offensive start
        "Scouting":"offensivescouting",
        "Troop Training":"offensivetrooptraining",
        "Automated Factories":"offensiveautomatedfactories",
        "Light Infantry Attack":"offensivelightinfantryattack",
        "Heavy Infantry Attack":"offensiveheavyinfantryattack",
        "Ground Vehicle Attack":"offensivegroundvehicleattack",
        "Air Vehicle Attack":"offensiveairvehicleattack",
        "Light Infantry Defense":"offensivelightinfantrydefense",
        "Heavy Infantry Defense":"offensiveheavyinfantrydefense",
        "Ground Vehicle Defense":"offensivegroundvehicledefense",
        "Air Vehicle Defense":"offensiveairvehicledefense",
        "Infiltrator Squad":"offensiveunlocklightinfantrytier2",
        "Pyro Squad":"offensiveunlockheavyinfantrytier2",
        "AFVs":"offensiveunlockgroundvehicletier2",
        "Attack Helicopters":"offensiveunlockairvehicletier2",
        "First Aid":"offensivefirstaid",
        "Heavy Armor":"offensiveheavyarmor",
        "Field Repairs":"offensivefieldrepairs",
        "Redundant Systems":"offensiveredundantsystems",
        "Assault Squad":"offensiveunlocklightinfantrytier3",
        "Commando Squad":"offensiveunlockheavyinfantrytier3",
        "Heavy Tanks":"offensiveunlockgroundvehicletier3",
        "Jet Fighters":"offensiveunlockairvehicletier3",
        "Deployment Tactics":"offensivedeploymenttactics",
        "Reactive Armor":"offensivereactivearmor",
        "Jet Troopers":"offensiveunlocklightinfantrytier4",
        "Shock Troopers":"offensiveunlockheavyinfantrytier4",
        "Titan Tanks":"offensiveunlockgroundvehicletier4",
        "Advanced Interceptors":"offensiveunlockairvehicletier4",
        "Hero Troop Attack":"offensiveherotroopattack",
        "Hero Troop Defense":"offensiveherotroopdefense",
        "Improved Stamina":"offensiveimprovedstamina",
        "Strike Squad":"offensiveunlocklightinfantrytier5",
        "Hellfire Squad":"offensiveunlockheavyinfantrytier5",
        "Improved Engines":"offensiveimprovedengines",
        "Arachnaut":"offensiveunlockgroundvehicletier5",
        "Solarwind Fighter":"offensiveunlockairvehicletier5",
        "Resilient Infantry":"offensiveresilientinfantry",
        "Adaptive Circuitry":"offensiveadaptivecircuitry",
        "Advanced Engines":"offensiveadvancedengines",
        "Advanced Stamina":"offensiveadvancedstamina",
        "Ground Vehicle Attack II":"offensivegroundvehicleattack2",
        "Ground Vehicle Defense II":"offensivegroundvehicledefense2",
        "Breacher Squad":"offensiveunlocklightinfantrytier6",
        "Rocket Trooper":"offensiveunlockheavyinfantrytier6",
        "Tarantulon":"offensiveunlockgroundvehicletier6",
        "Stealth Fighter":"offensiveunlockairvehicletier6",
        "Light Infantry Attack II":"offensivelightinfantryattack2",
        "Light Infantry Defense II":"offensivelightinfantrydefense2",
        "Heavy Infantry Attack II":"offensiveheavyinfantryattack2",
        "Heavy Infantry Defense II":"offensiveheavyinfantrydefense2",
        "Air Vehicle Attack II":"offensiveairvehicleattack2",
        "Air Vehicle Defense II":"offensiveairvehicledefense2",
    };
    const reverseKeyMap = Object.fromEntries(
        Object.entries(keyMap).map(([label, key]) => [key.toLowerCase(), label])
    );

    async function loadAll(){
        const structPromise = fetch('molds/categories/research-offensive.json').then(r => r.json());
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
