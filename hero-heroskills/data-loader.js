// data-loader.js
// responsible for fetching JSON files and building key maps used across modules

const DataLoader = (function(Helpers){
    const keyMap = {
        "Troop Production I":"hero_skill_troop_production_1",//offensive start
        "Food Production I":"hero_skill_food_production_1",
        "Alloy Production I":"hero_skill_alloy_production_1",
        "Oil Production I":"hero_skill_oil_production_1",
        "Tech Production I":"hero_skill_tech_production_1",
        "Neutronium Production I":"hero_skill_neutronium_production_1",
        "Food Production II":"hero_skill_food_production_2",
        "Oil Production II":"hero_skill_oil_production_2",
        "Alloy Production II":"hero_skill_alloy_production_2",
        "Tech Production II":"hero_skill_tech_production_2",
        "Neutronium Production II":"hero_skill_neutronium_production_2",
        "Food Production III":"hero_skill_food_production_3",
        "Alloy Production III":"hero_skill_alloy_production_3",
        "Oil Production III":"hero_skill_oil_production_3",
        "Tech Production III":"hero_skill_tech_production_3",
        "Neutronium Production III":"hero_skill_neutronium_production_3",
        "Construction I":"hero_skill_construction_1",
        "Research I":"hero_skill_research_1",
        "Gatherer I":"hero_skill_gatherer_1",
        "Gathering Loot Chance":"hero_skill_gathering_loot",
        "Construction II":"hero_skill_construction_2",
        "Research II":"hero_skill_research_2",
        "Gatherer II":"hero_skill_gatherer_2",
        "Factory Production I":"hero_skill_factory_production_1",
        "Light Infantry Attack I":"hero_skill_light_infantry_attack_1",
        "Heavy Infantry Attack I":"hero_skill_heavy_infantry_attack_1",
        "Ground Vehicle Attack I":"hero_skill_ground_vehicle_attack_1",
        "Air Vehicle Attack I":"hero_skill_air_vehicle_attack_1",
        "Infantry Defense I":"hero_skill_infantry_defense_1",
        "Vehicle Defense I":"hero_skill_vehicle_defense_1",
        "Defense Production I":"hero_skill_defense_production_1",
        "Defense Effectiveness I":"hero_skill_defense_effectiveness_1",
        "Combat Veteran":"hero_skill_combat_veteran",
        "Troop Production II":"hero_skill_troop_production_2",
        "Factory Production II":"hero_skill_factory_production_2",
        "Light Infantry Attack II":"hero_skill_light_infantry_attack_2",
        "Ground Vehicle Attack II":"hero_skill_ground_vehicle_attack_2",
        "Heavy Infantry Attack II":"hero_skill_heavy_infantry_attack_2",
        "Air Vehicle Attack II":"hero_skill_air_vehicle_attack_2",
        "Defense Production II":"hero_skill_defense_production_2",
        "Infantry Defense II":"hero_skill_infantry_defense_2",
        "Vehicle Defense II":"hero_skill_vehicle_defense_2",
        "Defense Effectiveness II":"hero_skill_defense_effectiveness_2",
        "Determination":"hero_skill_determination",
    };
    const reverseKeyMap = Object.fromEntries(
        Object.entries(keyMap).map(([label, key]) => [key.toLowerCase(), label])
    );

    async function loadAll(){
        const structPromise = fetch('molds/categories/hero_skill.json').then(r => r.json());
        const [structuresRaw] = await Promise.all([structPromise]);
        const subtypes = structuresRaw._subtypes || {};
        window.structuresSubtypes = subtypes;

        // === Global time-scale input handler ===
        $(document).off('input', '.time-scale').on('input', '.time-scale', function() {
            const scale = parseFloat($(this).val()) || 0;
            window.currentScale = scale; // store globally for totals, scaling etc.
            Tables.applyScale(scale);    // trigger live re-scaling and totals update
        });
        return { subtypes, keyMap, reverseKeyMap};
    }

    return { loadAll };
})(Helpers);
