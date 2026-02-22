// data-loader.js
// responsible for fetching JSON files and building key maps used across modules

const DataLoader = (function(Helpers){
    const keyMap = {
        "Standard Helmet":"gear_core_helmet",//offensive start
        "Standard Chest":"gear_core_chest",
        "Standard Boots":"gear_core_boots",
        "Standard Gun":"gear_core_gun",        
        "Reinforced Helmet":"gear_uncommon_helmet",
        "Reinforced Chest":"gear_uncommon_chest",
        "Reinforced Boots":"gear_uncommon_boots",
        "Reinforced Gun":"gear_uncommon_gun",        
        "Outer Skull":"gear_rare_helmet",
        "Fortifying Armour":"gear_rare_chest",        
        "Educating Crushers":"gear_rare_boots",
        "Wreched Ambusher":"gear_rare_gun",
        "Technician's Cap":"gear_epic_helmet",
        "Inspired Scrubs":"gear_epic_chest",
        "Medic's Boots":"gear_epic_boots",
        "Doomblaster":"gear_epic_gun",
        "Architect's Brain":"gear_augmented_helmet",
        "Medic-Aid Plate":"gear_augmented_chest",
        "Stalwart Stompers":"gear_augmented_boots",
        "Ferocious Defender":"gear_augmented_gun",
        "Lost General's Precision":"gear_augmented_gun_2",
        "Eagle Eyed Devestator":"gear_augmented_gun_3",
        "Infused Defender's Visor":"gear_prototype_helmet",
        "Infused Nitrosuit":"gear_prototype_chest",
        "Infused Machinist Treads":"gear_prototype_boots",
        "Storm Surge Helmet":"gear_storm_helm_set",
        "Storm Surge Guard":"gear_storm_chest_set",
        "Storm Surge Treads":"gear_storm_boots_set",
        "Storm Surge Rifle":"gear_storm_gun_set",
        "Neural Strike Helmet":"gear_prototype_helm_neural",
        "Neural Strike Armour":"gear_prototype_chest_neural",
        "Neural Strike Boots":"gear_prototype_boots_neural",
        "Neural Strike Shotgun":"gear_prototype_gun_neural",
        "Vanguard Helmet":"gear_vanguard_helm",
        "Vanguard Armour":"gear_vanguard_chest",
        "Vanguard Boots":"gear_vanguard_boots",
        "Vanguard DMR":"gear_vanguard_gun",                        
    };
    const reverseKeyMap = Object.fromEntries(
        Object.entries(keyMap).map(([label, key]) => [key.toLowerCase(), label])
    );

    async function loadAll(){
        const structPromise = fetch('molds/categories/gear.json').then(r => r.json());
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
