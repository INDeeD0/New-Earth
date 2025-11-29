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
        "Drone Command 10":"dronecommand9",//drone finish
        "Barrack Efficiency I":"specialbarracksefficiency1",
        "Factory Efficiency I":"specialfactoryefficiency1",
        "Defense Efficiency I":"specialdefenseefficiency1",
        "Deployment Speed I":"specialdeploymentspeed1",
        "Deployment Size I":"specialdeploymentsize1",
        "Barrack Efficiency II":"specialbarracksefficiency2",
        "Factory Efficiency II":"specialfactoryefficiency2",
        "Defense Efficiency II":"specialdefenseefficiency2",
        "Trade Tax Reduction":"specialtradetaxreduction",
        "Trade Capacity Increase":"specialtradecapacityincrease",
        "Resource Generation":"specialresourcegeneration",
        "Barrack Efficiency III":"specialbarracksefficiency3",
        "Factory Efficiency III":"specialfactoryefficiency3",
        "Defense Efficiency III":"specialdefenseefficiency3",
        "Troop Training Capacity":"specialtrooptrainingcapacity",
        "Production Capacity":"specialproductioncapacity",
        "Reinforcement Capacity":"specialreinforcementcapacity",
        "Deployment Speed II":"specialdeploymentspeed2",
        "Deployment Size II":"specialdeploymentsize2",
        "Scan Range":"efficiencyscanrange",
        "Barrack Efficiency IV":"specialbarracksefficiency4",
        "Factory Efficiency IV":"specialfactoryefficiency4",
        "Defense Efficiency IV":"specialdefenseefficiency4",
        "Alliance Help":"efficiencyalliancehelp",
        "Rally Capacity":"efficiencyrallycapacity",
        "Rally Speed":"efficiencyrallyspeed",
        "Barrack Efficiency V":"specialbarracksefficiency5",
        "Factory Efficiency V":"specialfactoryefficiency5",
        "Defense Efficiency V":"specialdefenseefficiency5",
        "Specialized Efficiency IV":"specialspecializedefficiency4",
        "Alien Efficiency IV":"specialalienefficiency4",
        "Prototype Efficiency IV":"specialprototypeefficiency4",
        "Specialized Efficiency V":"specialspecializedefficiency5",
        "Alien Efficiency V":"specialalienefficiency5",
        "Prototype Efficiency V":"specialprototypeefficiency5",
        "Specialized Efficiency VI":"specialspecializedefficiency6",
        "Alien Efficiency VI":"specialalienefficiency6",
        "Prototype Efficiency VI":"specialprototypeefficiency6",
        "Prototype Training Speed":"specializedprototypetrainingspeed",
        "Alien Training Speed":"specializedalientrainingspeed",
        "Mech Training Speed":"specializedmechtrainingspeed",
        "Prototype Attack":"specializedprototypeattack",
        "Alien Attack":"specializedalienattack",
        "Mech Attack":"specializedmechattack",
        "Prototype Defense":"specializedprototypedefense",
        "Alien Defense":"specializedaliendefense",
        "Mech Defense":"specializedmechdefense",
        "Prototype Health":"specializedprototypehealth",
        "Alien Health":"specializedalienhealth",
        "Mech Health":"specializedmechhealth",
        "Tactical Ballistic Launcher":"specializedunlockprototypetier5",
        "Renegade Alien Hunter":"specializedunlockalientier5",
        "Orbital Interceptor":"specializedunlockmechtier5",
        "Prototype Speed":"specializedprototypespeed",
        "Alien Speed":"specializedalienspeed",
        "Mech Speed":"specializedmechspeed",
        "Obsidian Hawk":"specializedunlockprototypetier6",
        "Alien Breacher":"specializedunlockalientier6",
        "Mech Troopers":"specializedunlockmechtier6",
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
