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
        "Air Vehicle Defense II":"offensiveairvehicledefense2",//offensive finish
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
        "Missile Battery":"defensivemissilebattery",//Defensive finish
    };

    async function loadAll(){
        const structPromise = fetch('molds/categories/research.json').then(r => r.json());
        const objPromise = fetch('molds/categories/objective.json').then(r => r.json()).catch(() => ({}));
        const [structuresRaw, objectives] = await Promise.all([structPromise, objPromise]);
        const subtypes = structuresRaw._subtypes || {};
        window.structuresSubtypes = subtypes;

        // build objective power delta map
        const objMap = {};
        const oSub = (objectives && objectives._subtypes) || {};
        Object.values(oSub).forEach(obj => {
            const levels = obj.levels || [];
            let prev = 0;
            let targetKey = null;
            for (let i = 1; i < levels.length; i++) {
                const lvl = levels[i] || {};
                const req0 = (lvl.requirements || [])[0] || {};
                if (!targetKey && req0.target_subtype) targetKey = String(req0.target_subtype).toLowerCase();
                const cum = Number(lvl.power || 0);
                const delta = cum - prev;
                prev = cum;
                if (targetKey) {
                    if (!objMap[targetKey]) objMap[targetKey] = [];
                    objMap[targetKey][i] = delta;
                }
            }
        });
        // === Global time-scale input handler ===
        $(document).off('input', '.time-scale').on('input', '.time-scale', function() {
            const scale = parseFloat($(this).val()) || 0;
            window.currentScale = scale; // store globally for totals, scaling etc.
            Tables.applyScale(scale);    // trigger live re-scaling and totals update
        });


        return { subtypes, keyMap, objMap };
        
    }

    return { loadAll };
})(Helpers);
