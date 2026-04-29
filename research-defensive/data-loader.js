// data-loader.js
// responsible for fetching JSON files and building key maps used across modules

const DataLoader = (function(Helpers){
    const keyMap = {
        "Research Lab":"researchlab",
        "Stationed Units":"defensivefortifieddefenses",//Defensive start
        "Turret Technology":"defensiveturretattack",
        "Buckshots":"defensiveunlockbuckshot",
        "Heavy Ammunition":"defensiveheavyammunition",
        "Armor Piercing Ammunition":"defensivearmorpiercingammunition",
        "High Explosive Ammunition":"defensivehighexplosiveammunition",
        "Defense Salvaging 1":"defensivedefensesalvaging_1",
        "Bio Grenades":"defensiveunlockbiogrenades",
        "Frag Grenades":"defensiveunlockfraggrenades",
        "Caltrops":"defensiveunlockcaltrops",
        "Flak Launchers":"defensiveunlockflaklaunchers",
        "Defense Strategist":"defensivedefensestrategist",
        "Reinforced Fortifications":"defensivereinforcedfortifications",
        "Defense Salvaging 2":"defensivedefensesalvaging_2",
        "Razor Wires":"defensiverazorwire",
        "Air Burst Rounds":"defensiveairburstrounds",
        "Anti Vehicle Mines":"defensiveantivehiclemines",
        "Combat Drone":"defensivecombatdrone",
        "Defense Salvaging 3":"defensivedefensesalvaging_3",
        "Phosporus Ammunition":"defensivephosporusammunition",
        "Laser Ammunition":"defensivelaserammunition",
        "High Velocity Ammunition":"defensivehighvelocityammunition",
        "Electromagnetic Pulse Ammunition":"defensiveelectromagneticpulseammunition",
        "Defense Salvaging 4":"defensivedefensesalvaging_4",
        "Flame Throwers":"defensiveflamethrowers",
        "Mortar Rounds":"defensivemortarrounds",
        "Rocket Propelled Grenades":"defensiverocketpropelledgrenades",
        "Surface to Air Missiles":"defensivesurfacetoairmissiles",
        "Defense Salvaging 5":"defensivedefensesalvaging_5",
        "Defense Salvaging 6":"defensivedefensesalvaging_6",
        "Thermite Grenades":"defensivethermitegrenades",
        "Claymore Mines":"defensiveclaymoremines",
        "Electric Fence":"defensiveelectricfence",
        "Missile Battery":"defensivemissilebattery",
        "Defense Strategist II":"defensivedefensestrategist2",//Defensive finish
    };
    const reverseKeyMap = Object.fromEntries(
        Object.entries(keyMap).map(([label, key]) => [key.toLowerCase(), label])
    );

    async function loadAll(){
        const structPromise = fetch('molds/categories/research-defensive.json').then(r => r.json());
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
