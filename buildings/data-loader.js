// data-loader.js
// responsible for fetching JSON files and building key maps used across modules

const DataLoader = (function(Helpers){
    const keyMap = {
        "Headquarters":"Headquarters","Black Market":"Blackmarket","Geoponic Farm":"Hydroponicfarm",
        "Oil Rig":"Oilrig","Alloy Refinery":"Alloyrefinery","Supply Depot":"Supplydepot","Situation Room":"War_room",
        "Engineering":"Engineering","Barracks":"Barracks","Research Lab":"Researchlab","Wall":"Walls",
        "Global Network":"Globalnetwork","Experimentation Chamber":"Experimentation_chamber",
        "Factory":"Factory","Turret":"Turret","Medical Bay":"Medicalbay","Hostile Containment":"Hostilecontainment",
        "Airstrip":"Airstrip","Satellite Uplink":"Satelliteuplink","Security Station":"Securitystation",
        "Robotics Bay":"Robotics_bay","Command Post":"Commandpost","Alien Genetics Labs":"Alien_genetics_lab",
        "Hero Armory":"Hero_armory","Bunker":"Shelter","Shard Reactor":"Shardcondenser",
        "Outpost Strategic":"Outpost_strategic","Outpost Harvest":"Outpost_harvest"
    };

    async function loadAll(){
        const structPromise = fetch('molds/categories/structures.json').then(r => r.json());
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
