// tables-init.js
// Initialize DataTables and provide API for rows/columns operations.

const Tables = (function(Helpers){
    const costsCols = [
        { title: "Key", visible: false }, // 0
        {
        title: "<button id='removeAllCosts' style='padding:2px 6px;'>&#x1F501</button>",
        orderable: false,
        width: "50px",
        render: function(data, type, row, meta) {
            const displayKey = Helpers.stripHtml(row && row[0] !== undefined ? row[0] : "");
            const levelVal = (row && row[2] !== undefined) ? String(row[2]) : String(meta.row);
            const uid = `${displayKey}|${levelVal}`;
            const normalize = s => (s || '').toString().toLowerCase().replace(/[\s_]/g, '');
            let jsonKey = (window.loadedKeyMap && window.loadedKeyMap[displayKey]) || displayKey;
            if (window.structuresSubtypes) {
            const subs = window.structuresSubtypes;
            const norm = normalize(jsonKey);
            const match = Object.keys(subs).find(k => normalize(k) === norm);
            if (!match) {
                const fuzzy = Object.keys(subs).find(k => normalize(k).includes(norm));
                if (fuzzy) jsonKey = fuzzy;
            } else {
                jsonKey = match;
            }
            }
            jsonKey = normalize(jsonKey);
            const checked = !!Totals.getCheckedMap()[uid];
            if (type === 'display') {
            return `<input type="checkbox" class="row-checkbox" data-uid="${uid}" data-json="${jsonKey}" data-lvl="${levelVal}" ${checked ? 'checked' : ''}>`;
            }
            return checked;
        }
        }, // end checkbox col

        { title:"LVL" },// 2
        {title: 'Time <input type="number" class="time-scale" style="width:40px;" step="1" min="0"> %<span class="info-icon" data-tip="Building boost">❓</span>',
            className: "dt-head-center",
            dataKey: "upgrade_cost"
        },
        { title:"Power", dataKey: "power" },// 4
        { title:"Tech", dataKey: "currency3@quantity" },// 5
        { title:"Food", dataKey: "currency4@quantity" },// 6
        { title:"Oil", dataKey: "currency5@quantity" },// 7
        { title:"Alloy", dataKey: "currency6@quantity" },// 8
        { title:"Neutronium", dataKey: "currency7@quantity" }, // 9
        { title:"Alien Augment", dataKey: "megaship_alien_augment@quantity" }, // 10
        { title:"Dark Matter", dataKey: "core_dark_matter@quantity"}, // 11
        { title:"Classified Docs", dataKey: "core_classified_documents@quantity" }, // 12
        { title:"Data Disk", dataKey: "core_data_disk@quantity"}, // 13
        { title:"Alien Power Core", dataKey: "core_alien_power_core@quantity"}, // 14
        { title:"Alien Tech", dataKey: "core_alien_component@quantity"}, // 15 used
        { title:"Alien Armor", dataKey: "core_alien_armor@quantity"}, // 16
        { title:"Armory Blueprints", dataKey: "armory_blueprints@quantity"}, // 17
        { title:"Buildings", dataKey: "requirements"}, // 18 
    ];
    const missionsCols =[
        { title:"Key", visible:false },
        { title: "<button id='removeAllRewards' style='padding:2px 6px;'>&#x1F501</button>", orderable:false, width:"50px",
            render: function(data, type, row, meta) {
            const keyVal = Helpers.stripHtml(row && row[0] !== undefined ? row[0] : "");
            const levelVal = (row && row[2] !== undefined) ? String(row[2]) : String(meta.row);
            const uid = `${keyVal}|${levelVal}`;
            const checked = !!Totals.getMissionsCheckedMap()[uid];
            if (type === 'display') {
                return `<input type=\"checkbox\" class=\"row-checkbox\" data-uid=\"${uid}\" ${checked ? 'checked' : ''}>`;
            }
            return checked;
            }
        },
        { title:"LVL" },
        { title:"Hero XP", dataKey: "hero_xp"  },
        { title:"Power", dataKey: "power" },
        { title:"Tech", dataKey: "currency3@quantity" },
        { title:"Food", dataKey: "currency4@quantity" },
        { title:"Oil", dataKey: "currency5@quantity" },
        { title:"Alloy", dataKey: "currency6@quantity" },
        { title:"Neutronium", dataKey: "currency7@quantity" }
    ]
    const statsCols = [
        { title: "Key", visible: false },
        { title: "LVL" },
        { title: "Detail Available", dataKey: "scout level" },//offensive start
        { title: 'Unit Production Speed <span class="info-icon" data-tip="Light Infantry, Heavy Infantry">❓</span>', dataKey: "light_infantry_produce_speed_modifier@modifier" },//2
        { title: 'Factory Production Speed <span class="info-icon" data-tip="Vehicle, Air">❓</span>', dataKey: "vehicle_produce_speed_modifier@modifier" },//3
        { title: "Light Infantry Attack", dataKey: "light_infantry_attack_modifier@modifier" },
        { title: "Heavy Infantry Attack", dataKey: "heavy_infantry_attack_modifier@modifier" },
        { title: "Ground Vehicle Attack", dataKey: "vehicle_attack_modifier@modifier" },
        { title: "Air Vehicle Attack", dataKey: "air_attack_modifier@modifier" },
        { title: "Light Infantry Defense", dataKey: "light_infantry_defense_modifier@modifier" },
        { title: "Heavy Infantry Defense", dataKey: "heavy_infantry_defense_modifier@modifier" },
        { title: "Ground Vehicle Defense", dataKey: "vehicle_defense_modifier@modifier" },
        { title: "Air Vehicle Defense", dataKey: "air_defense_modifier@modifier" },
        { title: "Troop Research", dataKey: "unlocked@modifier" },
        { title: "Light Infantry Health", dataKey: "light_infantry_health_modifier@modifier" },
        { title: "Heavy Infantry Health", dataKey: "heavy_infantry_health_modifier@modifier" },
        { title: "Ground Vehicle Health", dataKey: "vehicle_health_modifier@modifier" },
        { title: "Air Vehicle Health", dataKey: "air_health_modifier@modifier" },
        { title: 'Deployment Tactics <span class="info-icon" data-tip="Light, Heavy, Ground, Air Attack">❓</span>', dataKey: "light_infantry_attack_modifier@modifier" },
        { title: 'Reactive Armor <span class="info-icon" data-tip="Light, Heavy, Ground, Air Defense">❓</span>', dataKey: "light_infantry_defense_modifier@modifier" },
        { title: "Hero Deployment Attack Bonus", dataKey: "hero_march_unit_attack_modifier@modifier" },
        { title: "Hero Deployment Defense Bonus", dataKey: "hero_march_unit_defense_modifier@modifier" },
        { title: "Light/Heavy Infantry Speed", dataKey: "light_infantry_speed_modifier@modifier" },
        { title: "Ground/Air Vehicle Speed", dataKey: "vehicle_speed_modifier@modifier" },
        { title: 'Resilient Infantry <span class="info-icon" data-tip="Light, Heavy Health">❓</span>', dataKey: "light_infantry_health_modifier@modifier" },
        { title: 'Adaptive Circuitry <span class="info-icon" data-tip="Ground, Air Health">❓</span>', dataKey: "vehicle_health_modifier@modifier" },
        { title: 'Advanced Stamina <span class="info-icon" data-tip="Light, Heavy Speed">❓</span>', dataKey: "light_infantry_speed_modifier@modifier" },
        { title: 'Advanced Engines <span class="info-icon" data-tip="Ground, Air Speed">❓</span>', dataKey: "vehicle_speed_modifier@modifier" },//offensive finish
        { title: "Stationed Units Limit", dataKey: "march_stationed_units_limit@value" },
        { title: "Turret Attack", dataKey: "structure_attack_modifier@modifier" },
        { title: "Defense Salvage (Tier 1)", dataKey: "static_tier1_unit_save_modifier@modifier" },
        { title: 'Defense Strategist <span class="info-icon" data-tip="Basic,Advanced,Air,Experimental Attack">❓</span>', dataKey: "basic_defense_attack_modifier@modifier" },
        { title: 'Reinforced Fortifications <span class="info-icon" data-tip="Basic,Advanced,Air,Experimental Defense">❓</span>', dataKey: "basic_defense_defense_modifier@modifier" },
        { title: "Defense Salvage (Tier 2)", dataKey: "static_tier2_unit_save_modifier@modifier" },
        { title: "Defense Salvage (Tier 3)", dataKey: "static_tier3_unit_save_modifier@modifier" },
        { title: "Defense Salvage (Tier 4)", dataKey: "static_tier4_unit_save_modifier@modifier" },
        { title: "Defense Salvage (Tier 5)", dataKey: "static_tier5_unit_save_modifier@modifier" },
        { title: "Defense Salvage (Tier 6)", dataKey: "static_tier6_unit_save_modifier@modifier" },//defensive finish

    ];
    const costsColumnMap = {
        offensivescouting: [1,2,3,4,5,6,7,8,9,18],
        offensivetrooptraining: [1,2,3,4,5,6,7,8,9,18],
        offensiveautomatedfactories: [1,2,3,4,5,6,7,8,9,18],
        offensivelightinfantryattack: [1,2,3,4,5,6,7,8,9,18],
        offensiveheavyinfantryattack: [1,2,3,4,5,6,7,8,9,18],
        offensivegroundvehicleattack: [1,2,3,4,5,6,7,8,9,18],
        offensiveairvehicleattack: [1,2,3,4,5,6,7,8,9,18],
        offensivelightinfantrydefense: [1,2,3,4,5,6,7,8,9,18],
        offensiveheavyinfantrydefense: [1,2,3,4,5,6,7,8,9,18],
        offensivegroundvehicledefense: [1,2,3,4,5,6,7,8,9,18],
        offensiveairvehicledefense: [1,2,3,4,5,6,7,8,9,18],
        offensiveunlocklightinfantrytier2: [1,2,3,4,5,6,7,8,9,18],
        offensiveunlockheavyinfantrytier2: [1,2,3,4,5,6,7,8,9,18],
        offensiveunlockgroundvehicletier2: [1,2,3,4,5,6,7,8,9,18],
        offensiveunlockairvehicletier2: [1,2,3,4,5,6,7,8,9,18],
        offensivefirstaid: [1,2,3,4,5,6,7,8,9,18],
        offensiveheavyarmor: [1,2,3,4,5,6,7,8,9,18],
        offensivefieldrepairs: [1,2,3,4,5,6,7,8,9,18],
        offensiveredundantsystems: [1,2,3,4,5,6,7,8,9,18],
        offensiveunlocklightinfantrytier3: [1,2,3,4,5,6,7,8,9,18],
        offensiveunlockheavyinfantrytier3: [1,2,3,4,5,6,7,8,9,18],
        offensiveunlockgroundvehicletier3: [1,2,3,4,5,6,7,8,9,18],
        offensiveunlockairvehicletier3: [1,2,3,4,5,6,7,8,9,18],
        offensivedeploymenttactics: [1,2,3,4,5,6,7,8,9,18],
        offensivereactivearmor: [1,2,3,4,5,6,7,8,9,18],
        offensiveunlocklightinfantrytier4: [1,2,3,4,5,6,7,8,9,15,18],
        offensiveunlockheavyinfantrytier4: [1,2,3,4,5,6,7,8,9,15,18],
        offensiveunlockgroundvehicletier4: [1,2,3,4,5,6,7,8,9,15,18],
        offensiveunlockairvehicletier4: [1,2,3,4,5,6,7,8,9,15,18],
        offensiveherotroopattack: [1,2,3,4,5,6,7,8,9,18],
        offensiveherotroopdefense:[1,2,3,4,5,6,7,8,9,18],
        offensiveimprovedstamina:[1,2,3,4,5,6,7,8,9,18],
        offensiveunlocklightinfantrytier5:[1,2,3,4,5,6,7,8,9,15,18],
        offensiveunlockheavyinfantrytier5:[1,2,3,4,5,6,7,8,9,15,18],
        offensiveimprovedengines:[1,2,3,4,5,6,7,8,9,18],
        offensiveunlockgroundvehicletier5:[1,2,3,4,5,6,7,8,9,15,18],
        offensiveunlockairvehicletier5:[1,2,3,4,5,6,7,8,9,15,18],
        offensiveresilientinfantry:[1,2,3,4,5,6,7,8,9,18],
        offensiveadaptivecircuitry:[1,2,3,4,5,6,7,8,9,18],
        offensiveadvancedstamina:[1,2,3,4,5,6,7,8,9,18],
        offensiveadvancedengines:[1,2,3,4,5,6,7,8,9,18],
        offensivegroundvehicleattack2:[1,2,3,4,5,6,7,8,9,18],
        offensivegroundvehicledefense2:[1,2,3,4,5,6,7,8,9,18],
        offensiveunlocklightinfantrytier6:[1,2,3,4,5,6,7,8,9,10,18],
        offensiveunlockheavyinfantrytier6:[1,2,3,4,5,6,7,8,9,10,18],
        offensiveunlockgroundvehicletier6:[1,2,3,4,5,6,7,8,9,10,18],
        offensiveunlockairvehicletier6:[1,2,3,4,5,6,7,8,9,10,18],
        offensivelightinfantryattack2:[1,2,3,4,5,6,7,8,9,18],
        offensivelightinfantrydefense2:[1,2,3,4,5,6,7,8,9,18],
        offensiveheavyinfantryattack2:[1,2,3,4,5,6,7,8,9,18],
        offensiveheavyinfantrydefense2:[1,2,3,4,5,6,7,8,9,18],
        offensiveairvehicleattack2:[1,2,3,4,5,6,7,8,9,18],
        offensiveairvehicledefense2:[1,2,3,4,5,6,7,8,9,18],
        defensivefortifieddefenses:[1,2,3,4,5,6,7,8,9,18],
        defensiveturretattack:[1,2,3,4,5,6,7,8,9,18],
        defensiveunlockbuckshot:[1,2,3,4,5,6,7,8,9,18],
        defensiveheavyammunition:[1,2,3,4,5,6,7,8,9,18],
        defensivearmorpiercingammunition:[1,2,3,4,5,6,7,8,9,18],
        defensivehighexplosiveammunition:[1,2,3,4,5,6,7,8,9,18],
        defensivedefensesalvaging_1:[1,2,3,4,5,6,7,8,9,18],
        defensiveunlockbiogrenades:[1,2,3,4,5,6,7,8,9,18],
        defensiveunlockfraggrenades:[1,2,3,4,5,6,7,8,9,18],
        defensiveunlockcaltrops:[1,2,3,4,5,6,7,8,9,18],
        defensiveunlockflaklaunchers:[1,2,3,4,5,6,7,8,9,18],
        defensivedefensestrategist:[1,2,3,4,5,6,7,8,9,18],
        defensivereinforcedfortifications:[1,2,3,4,5,6,7,8,9,18],
        defensivedefensesalvaging_2:[1,2,3,4,5,6,7,8,9,18],
        defensiverazorwire:[1,2,3,4,5,6,7,8,9,18],
        defensiveairburstrounds:[1,2,3,4,5,6,7,8,9,18],
        defensiveantivehiclemines:[1,2,3,4,5,6,7,8,9,18],
        defensivecombatdrone:[1,2,3,4,5,6,7,8,9,18],
        defensivedefensesalvaging_3:[1,2,3,4,5,6,7,8,9,18],
        defensivephosporusammunition:[1,2,3,4,5,6,7,8,9,18],
        defensivelaserammunition:[1,2,3,4,5,6,7,8,9,18],
        defensivehighvelocityammunition:[1,2,3,4,5,6,7,8,9,18],
        defensiveelectromagneticpulseammunition:[1,2,3,4,5,6,7,8,9,18],
        defensivedefensesalvaging_4:[1,2,3,4,5,6,7,8,9,18],
        defensiveflamethrowers:[1,2,3,4,5,6,7,8,9,18],
        defensivemortarrounds:[1,2,3,4,5,6,7,8,9,18],
        defensiverocketpropelledgrenades:[1,2,3,4,5,6,7,8,9,18],
        defensivesurfacetoairmissiles:[1,2,3,4,5,6,7,8,9,18],
        defensivedefensesalvaging_5:[1,2,3,4,5,6,7,8,9,18],
        defensivedefensesalvaging_6:[1,2,3,4,5,6,7,8,9,18],
        defensivethermitegrenades:[1,2,3,4,5,6,7,8,9,11,18],
        defensiveclaymoremines:[1,2,3,4,5,6,7,8,9,11,18],
        defensiveelectricfence:[1,2,3,4,5,6,7,8,9,11,18],
        defensivemissilebattery:[1,2,3,4,5,6,7,8,9,11,18],
    };
    const missionsColumnMap = {
        offensivescouting: [1,2,3,4,5,6,7,8,9,10],
        offensivetrooptraining: [1,2,3,4,5,6,7,8,9,10],
        offensiveautomatedfactories: [1,2,3,4,5,6,7,8,9,10],
        offensivelightinfantryattack: [1,2,3,4,5,6,7,8,9,10],
        offensiveheavyinfantryattack: [1,2,3,4,5,6,7,8,9,10],
        offensivegroundvehicleattack: [1,2,3,4,5,6,7,8,9,10],
        offensiveairvehicleattack: [1,2,3,4,5,6,7,8,9,10],
        offensivelightinfantrydefense: [1,2,3,4,5,6,7,8,9,10],
        offensiveheavyinfantrydefense: [1,2,3,4,5,6,7,8,9,10],
        offensivegroundvehicledefense: [1,2,3,4,5,6,7,8,9,10],
        offensiveairvehicledefense: [1,2,3,4,5,6,7,8,9,10],
        offensiveunlocklightinfantrytier2: [1,2,3,4,5,6,7,8,9,10],
        offensiveunlockheavyinfantrytier2: [1,2,3,4,5,6,7,8,9,10],
        offensiveunlockgroundvehicletier2: [1,2,3,4,5,6,7,8,9,10],
        offensiveunlockairvehicletier2: [1,2,3,4,5,6,7,8,9,10],
        offensivefirstaid: [1,2,3,4,5,6,7,8,9,10],
        offensiveheavyarmor: [1,2,3,4,5,6,7,8,9,10],
        offensivefieldrepairs: [1,2,3,4,5,6,7,8,9,10],
        offensiveredundantsystems: [1,2,3,4,5,6,7,8,9,10],
        offensiveunlocklightinfantrytier3: [1,2,3,4,5,6,7,8,9,10],
        offensiveunlockheavyinfantrytier3: [1,2,3,4,5,6,7,8,9,10],
        offensiveunlockgroundvehicletier3: [1,2,3,4,5,6,7,8,9,10],
        offensiveunlockairvehicletier3: [1,2,3,4,5,6,7,8,9,10],
        offensivedeploymenttactics: [1,2,3,4,5,6,7,8,9,10],
        offensivereactivearmor: [1,2,3,4,5,6,7,8,9,10],
        offensiveunlocklightinfantrytier4: [1,2,3,4,5,6,7,8,9,10],
        offensiveunlockheavyinfantrytier4: [1,2,3,4,5,6,7,8,9,10],
        offensiveunlockgroundvehicletier4: [1,2,3,4,5,6,7,8,9,10],
        offensiveunlockairvehicletier4: [1,2,3,4,5,6,7,8,9,10],
        offensiveherotroopattack: [1,2,3,4,5,6,7,8,9,10],
        offensiveherotroopdefense:[1,2,3,4,5,6,7,8,9,10],
        offensiveimprovedstamina:[1,2,3,4,5,6,7,8,9,10],
        offensiveunlocklightinfantrytier5:[1,2,3,4,5,6,7,8,9,10],
        offensiveunlockheavyinfantrytier5:[1,2,3,4,5,6,7,8,9,10],
        offensiveimprovedengines:[1,2,3,4,5,6,7,8,9,10],
        offensiveunlockgroundvehicletier5:[1,2,3,4,5,6,7,8,9,10],
        offensiveunlockairvehicletier5:[1,2,3,4,5,6,7,8,9,10],
        offensiveresilientinfantry:[1,2,3,4,5,6,7,8,9,10],
        offensiveadaptivecircuitry:[1,2,3,4,5,6,7,8,9,10],
        offensiveadvancedstamina:[1,2,3,4,5,6,7,8,9,10],
        offensiveadvancedengines:[1,2,3,4,5,6,7,8,9,10],
        offensivegroundvehicleattack2:[1,2,3,4,5,6,7,8,9,10],
        offensivegroundvehicledefense2:[1,2,3,4,5,6,7,8,9,10],
        offensiveunlocklightinfantrytier6:[1,2,3,4,5,6,7,8,9,10],
        offensiveunlockheavyinfantrytier6:[1,2,3,4,5,6,7,8,9,10],
        offensiveunlockgroundvehicletier6:[1,2,3,4,5,6,7,8,9,10],
        offensiveunlockairvehicletier6:[1,2,3,4,5,6,7,8,9,10],
        offensivelightinfantryattack2:[1,2,3,4,5,6,7,8,9,10],
        offensivelightinfantrydefense2:[1,2,3,4,5,6,7,8,9,10],
        offensiveheavyinfantryattack2:[1,2,3,4,5,6,7,8,9,10],
        offensiveheavyinfantrydefense2:[1,2,3,4,5,6,7,8,9,10],
        offensiveairvehicleattack2:[1,2,3,4,5,6,7,8,9,10],
        offensiveairvehicledefense2:[1,2,3,4,5,6,7,8,9,10],
        defensivefortifieddefenses:[1,2,3,4,5,6,7,8,9,10],
        defensiveturretattack:[1,2,3,4,5,6,7,8,9,10],
        defensiveunlockbuckshot:[1,2,3,4,5,6,7,8,9,10],
        defensiveheavyammunition:[1,2,3,4,5,6,7,8,9,10],
        defensivearmorpiercingammunition:[1,2,3,4,5,6,7,8,9,10],
        defensivehighexplosiveammunition:[1,2,3,4,5,6,7,8,9,10],
        defensivedefensesalvaging_1:[1,2,3,4,5,6,7,8,9,10],
        defensiveunlockbiogrenades:[1,2,3,4,5,6,7,8,9,10],
        defensiveunlockfraggrenades:[1,2,3,4,5,6,7,8,9,10],
        defensiveunlockcaltrops:[1,2,3,4,5,6,7,8,9,10],
        defensiveunlockflaklaunchers:[1,2,3,4,5,6,7,8,9,10],
        defensivedefensestrategist:[1,2,3,4,5,6,7,8,9,10],
        defensivereinforcedfortifications:[1,2,3,4,5,6,7,8,9,10],
        defensivedefensesalvaging_2:[1,2,3,4,5,6,7,8,9,10],
        defensiverazorwire:[1,2,3,4,5,6,7,8,9,10],
        defensiveairburstrounds:[1,2,3,4,5,6,7,8,9,10],
        defensiveantivehiclemines:[1,2,3,4,5,6,7,8,9,10],
        defensivecombatdrone:[1,2,3,4,5,6,7,8,9,10],
        defensivedefensesalvaging_3:[1,2,3,4,5,6,7,8,9,10],
        defensivephosporusammunition:[1,2,3,4,5,6,7,8,9,10],
        defensivelaserammunition:[1,2,3,4,5,6,7,8,9,10],
        defensivehighvelocityammunition:[1,2,3,4,5,6,7,8,9,10],
        defensiveelectromagneticpulseammunition:[1,2,3,4,5,6,7,8,9,10],
        defensivedefensesalvaging_4:[1,2,3,4,5,6,7,8,9,10],
        defensiveflamethrowers:[1,2,3,4,5,6,7,8,9,10],
        defensivemortarrounds:[1,2,3,4,5,6,7,8,9,10],
        defensiverocketpropelledgrenades:[1,2,3,4,5,6,7,8,9,10],
        defensivesurfacetoairmissiles:[1,2,3,4,5,6,7,8,9,10],
        defensivedefensesalvaging_5:[1,2,3,4,5,6,7,8,9,10],
        defensivedefensesalvaging_6:[1,2,3,4,5,6,7,8,9,10],
        defensivethermitegrenades:[1,2,3,4,5,6,7,8,9,10],
        defensiveclaymoremines:[1,2,3,4,5,6,7,8,9,10],
        defensiveelectricfence:[1,2,3,4,5,6,7,8,9,10],
        defensivemissilebattery:[1,2,3,4,5,6,7,8,9,10],
    };
    const statsColumnMap = {
        offensivescouting: [2],
        offensivetrooptraining: [3],
        offensiveautomatedfactories: [4],
        offensivelightinfantryattack: [5],
        offensiveheavyinfantryattack: [6],
        offensivegroundvehicleattack: [7],
        offensiveairvehicleattack:[8],
        offensivelightinfantrydefense: [9],
        offensiveheavyinfantrydefense: [10],
        offensivegroundvehicledefense: [11],
        offensiveairvehicledefense: [12],
        offensiveunlocklightinfantrytier2: [13],
        offensiveunlockheavyinfantrytier2: [13],
        offensiveunlockgroundvehicletier2: [13],
        offensiveunlockairvehicletier2: [13],
        offensivefirstaid: [14],
        offensiveheavyarmor: [15],
        offensivefieldrepairs: [16],
        offensiveredundantsystems: [17],
        offensiveunlocklightinfantrytier3: [13],
        offensiveunlockheavyinfantrytier3: [13],
        offensiveunlockgroundvehicletier3: [13],
        offensiveunlockairvehicletier3: [13],
        offensivedeploymenttactics: [18],
        offensivereactivearmor: [19],
        offensiveunlocklightinfantrytier4: [13],
        offensiveunlockheavyinfantrytier4: [13],
        offensiveunlockgroundvehicletier4: [13],
        offensiveunlockairvehicletier4: [13],
        offensiveherotroopattack: [20],
        offensiveherotroopdefense:[21],
        offensiveimprovedstamina:[22],
        offensiveunlocklightinfantrytier5:[13],
        offensiveunlockheavyinfantrytier5:[13],
        offensiveimprovedengines:[23],
        offensiveunlockgroundvehicletier5:[13],
        offensiveunlockairvehicletier5:[13],
        offensiveresilientinfantry:[24],
        offensiveadaptivecircuitry:[25],
        offensiveadvancedstamina:[26],
        offensiveadvancedengines:[27],
        offensivegroundvehicleattack2:[7],
        offensivegroundvehicledefense2:[11],
        offensiveunlocklightinfantrytier6:[13],
        offensiveunlockheavyinfantrytier6:[13],
        offensiveunlockgroundvehicletier6:[13],
        offensiveunlockairvehicletier6:[13],
        offensivelightinfantryattack2:[5],
        offensivelightinfantrydefense2:[9],
        offensiveheavyinfantryattack2:[6],
        offensiveheavyinfantrydefense2:[10],
        offensiveairvehicleattack2:[8],
        offensiveairvehicledefense2:[12],
        defensivefortifieddefenses:[28],//defensive start
        defensiveturretattack:[29],
        defensiveunlockbuckshot:[13],
        defensiveheavyammunition:[13],
        defensivearmorpiercingammunition:[13],
        defensivehighexplosiveammunition:[13],
        defensivedefensesalvaging_1:[30],
        defensiveunlockbiogrenades:[13],
        defensiveunlockfraggrenades:[13],
        defensiveunlockcaltrops:[13],
        defensiveunlockflaklaunchers:[13],
        defensivedefensestrategist:[31],
        defensivereinforcedfortifications:[32],
        defensivedefensesalvaging_2:[33],
        defensiverazorwire:[13],
        defensiveairburstrounds:[13],
        defensiveantivehiclemines:[13],
        defensivecombatdrone:[13],
        defensivedefensesalvaging_3:[34],
        defensivephosporusammunition:[13],
        defensivelaserammunition:[13],
        defensivehighvelocityammunition:[13],
        defensiveelectromagneticpulseammunition:[13],
        defensivedefensesalvaging_4:[35],
        defensiveflamethrowers:[13],
        defensivemortarrounds:[13],
        defensiverocketpropelledgrenades:[13],
        defensivesurfacetoairmissiles:[13],
        defensivedefensesalvaging_5:[36],
        defensivedefensesalvaging_6:[37],
        defensivethermitegrenades:[13],
        defensiveclaymoremines:[13],
        defensiveelectricfence:[13],
        defensivemissilebattery:[13],        
    };

    // expose some indexes for other modules
    const KEY_COL = 0;
    const CHECKBOX_COL = 1;
    const LEVEL_COL = 2;
    const TIME_COL = 3;

    // DataTables instances (initialized later)
    const VISIBLE_ROWS = 12;

    function initDefaults(){
        $.extend(true, $.fn.dataTable.defaults, {
            autoWidth: false,
            scrollX: false
        });
    }
    function createAllCostsTables(structures,){
        const tables = {};
        const $masterContainer = $('#costsMasterContainer');

        Object.keys(structures).forEach(key => {
            const safeKey = key.toLowerCase().replace(/[\s_]/g, '');
            const wrapperId = `costsWrapper-${safeKey}`;
            const tableId   = `costsTable-${safeKey}`;

            // 🧹 if table already exists, reuse existing DataTable
            if ( $.fn.DataTable.isDataTable(`#${tableId}`) ) {
                tables[safeKey] = $(`#${tableId}`).DataTable();
                return; // skip reinit
            }

            // otherwise create fresh wrapper/table
            const $wrapper = $(`
            <div class="costsWrapper table-wrapper" id="${wrapperId}" style="display:none">
                <table id="${tableId}" class="display_compact_stripe" style="width:100%"></table>
                </div>
            `);
            $masterContainer.append($wrapper);

            const dt = $(`#${tableId}`).DataTable({
                scrollCollapse: true,
                paging: false,
                dom: 'ti',
                info: false,
                fixedHeader: false,
                ordering: false,
                autoWidth: false,
                columns: costsCols,
                scrollY: '0px',
            });

            tables[safeKey] = dt;
        });

        console.log(`✅ Created ${Object.keys(tables).length} cost tables`);
        return tables;
    }
    function createAllMissionsTables(structures,) {
        const tables = {};
        const $masterContainer = $('#missionsMasterContainer'); // create this div in HTML

        Object.keys(structures).forEach(key => {
            const safeKey = key.toLowerCase().replace(/[\s_]/g, '');
            const wrapperId = `rewardsWrapper-${safeKey}`;
            const tableId = `rewardsTable-${safeKey}`;

            if ($.fn.DataTable.isDataTable(`#${tableId}`)) {
                tables[safeKey] = $(`#${tableId}`).DataTable();
                return;
            }

            const $wrapper = $(`
                <div class="rewardsWrapper table-wrapper" id="${wrapperId}" style="display:none">
                    <table id="${tableId}" class="display_compact_stripe" style="width:100%"></table>
                </div>
            `);
            $masterContainer.append($wrapper);

            const dt = $(`#${tableId}`).DataTable({
                scrollCollapse: true,
                paging: false,
                dom: 'ti',
                info: false,
                fixedHeader: false,
                ordering: false,
                autoWidth: false,
                columns: missionsCols,
                scrollY: '0px',
            });

            tables[safeKey] = dt;
        });

        console.log(`✅ Created ${Object.keys(tables).length} mission tables`);
        return tables;
    }
    function createAllStatsTables(structures) {
        const tables = {};
        const $masterContainer = $('#statsMasterContainer');

        Object.keys(structures).forEach(key => {
            const safeKey = key.toLowerCase().replace(/[\s_]/g, '');
            const wrapperId = `statsWrapper-${safeKey}`;
            const tableId = `statsTable-${safeKey}`;

            if ($.fn.DataTable.isDataTable(`#${tableId}`)) {
                tables[safeKey] = $(`#${tableId}`).DataTable();
                return;
            }

            const $wrapper = $(`
                <div class="statsWrapper table-wrapper" id="${wrapperId}" style="display:none">
                    <table id="${tableId}" class="display_compact_stripe" style="width:100%"></table>
                </div>
            `);
            $masterContainer.append($wrapper);

            const dt = $(`#${tableId}`).DataTable({
                scrollCollapse: true,
                paging: false,
                dom: 'ti',
                info: false,
                fixedHeader: false,
                ordering: false,
                autoWidth: false,
                columns: statsCols,
                scrollY: '0px',
            });

            tables[safeKey] = dt;
        });

        console.log(`✅ Created ${Object.keys(tables).length} stats tables`);
        return tables;
    }
    function populateAllCostsTables(structures, costscheckedMapRef) {
        // Build a map of pretty names for "requirements"
        const prettyMap = {};
        Array.from(document.querySelectorAll('.section')).forEach(el => {
            const label = (el.innerText || el.textContent || '').toString().trim();
            if (!label) return;
            const norm = label.replace(/[_\s]/g, '').toLowerCase();
            prettyMap[norm] = label.replace(/\s+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        });

        for (const [rawKey, structure] of Object.entries(structures)) {
            const key = rawKey.toLowerCase().replace(/[\s_]/g, '');
            const dt = Tables.allCostsTables[key];
            if (!dt) continue;

            dt.clear();
            applyColumnVisibility(dt, costsColumnMap, rawKey);

            (structure.levels || []).forEach((lvl, idx) => {
                if (!lvl || idx === 0) return;
                const keyVal = rawKey;
                const lvlNum = idx;
                const uid = `${keyVal}|${lvlNum}`;
                const checked = !!costscheckedMapRef[uid];

                // --- start new row with same column count ---
                const row = Array(19).fill('-');
                row[0] = keyVal;
                row[1] = checked;
                row[2] = lvlNum;

                // === Loop over cost columns ===
                for (let col = 3; col < costsCols.length; col++) {
                    const colDef = costsCols[col];
                    const dataKey = (colDef.dataKey || '').toLowerCase();
                    if (!dataKey) continue;

                    let val = null;
                    try { val = Helpers.lookup.lookupValue(lvl, dataKey); } catch(e) { val = null; }

                    // === Custom handlers ===
                    // (1) Time scaling with raw storage for live rescaling
                    if (dataKey === "upgrade_cost" || dataKey.includes("upgrade_time") || dataKey === "time") {
                        const numericVal = Number(Helpers.lookup.lookupValue(lvl, dataKey)) || 0;

                        // 🧠 Store the raw time so applyScale() can reuse it
                        if (!row._rawTime) row._rawTime = {};
                        row._rawTime[col] = numericVal;

                        val = numericVal > 0
                            ? Helpers.formatTime(Math.floor(numericVal / (1 + window.currentScale / 100)))
                            : "-";
                    }


                    // (2) Power delta vs previous level
                    else if (dataKey === 'power') {
                        const prevPower = (structure.levels[lvlNum - 1] || {}).power || 0;
                        const delta = (lvl.power || 0) - prevPower;
                        val = Helpers.formatShort(delta);
                    }

                    // (3) Requirements (array -> pretty expandable display)
                    else if (dataKey === 'requirements' && Array.isArray(lvl.requirements)) {
                        const reqs = lvl.requirements
                            .map(r => {
                                // --- Structure Requirements ---
                                if (r.subtype === 'structure' && r.target_subtype && r.level !== undefined) {
                                    const raw = String(r.target_subtype || '');
                                    const normRaw = raw.replace(/[_\s]/g, '').toLowerCase();
                                    const pretty = prettyMap[normRaw] ||
                                        raw.replace(/([a-z])([A-Z])/g, '$1 $2')
                                        .replace(/[_-]+/g, ' ')
                                        .replace(/\b\w/g, c => c.toUpperCase());

                                    return `${pretty} Lvl ${r.level}`;
                                }

                                // --- Research Requirements ---
                                if (r.subtype === 'research' && r.target_subtype && r.level !== undefined) {
                                    const raw = String(r.target_subtype || '');
                                    const normRaw = raw.replace(/[_\s]/g, '').toLowerCase();
                                    const pretty = prettyMap[normRaw] ||
                                        raw.replace(/([a-z])([A-Z])/g, '$1 $2')
                                        .replace(/[_-]+/g, ' ')
                                        .replace(/\b\w/g, c => c.toUpperCase());

                                    return `${pretty} Lvl ${r.level}`;
                                }

                                return '';
                            })
                            .filter(Boolean);

                        if (reqs.length === 0) {
                            val = '-';
                        } else if (reqs.length === 1) {
                            val = reqs[0];
                        } else {
                            const first = reqs[0];
                            const rest = reqs.slice(1).map(r => `<div>${r}</div>`).join('');
                            const hidden = `<div class="req-hidden" style="display:none;">${rest}</div>`;
                            val = `
                                <div class="req-cell">
                                    ${first}
                                    <span class="req-toggle" style="cursor:pointer;color:#4af;margin-left:5px;">▼</span>
                                    ${hidden}
                                </div>
                            `;
                        }
                    }

                    // === Final formatting ===
                    if (val === null || val === undefined || val === '') val = '-';
                    else if (typeof val === 'number' && val > 1000) val = Helpers.formatShort(val);

                    row[col] = val;
                }

                // === Add the row ===
                try { dt.row.add(row); } catch (e) { console.warn('costs dt.row.add fail', e); }
            });

            dt.draw(false);
            Tables.setScrollRows(dt);
            try { dt.columns.adjust(); } catch(e) {}

            // Expandable requirements toggle per-table
            $(`#costsTable-${key}`).off('click', '.req-toggle').on('click', '.req-toggle', function(){
                const $cell = $(this).closest('.req-cell');
                const $hidden = $cell.find('.req-hidden');
                const expanded = $hidden.is(':visible');
                $hidden.slideToggle(150);
                $(this).text(expanded ? '▼' : '▲');
            });
        }
        console.log("✅ Populated all costs tables");        
    }
    function populateAllMissionsTables(structures, missionsCheckedMapRef, objMap) {
        for (const [rawKey, structure] of Object.entries(structures)) {
            const key = rawKey.toLowerCase().replace(/[\s_]/g, '');
            const dt = Tables.allMissionsTables[key];
            if (!dt) continue;

            dt.clear();
            applyColumnVisibility(dt, missionsColumnMap, rawKey);

            // --- Mission power lookup array (from DataLoader.objMap)
            const normalizedTarget = key;
            const missionPowerArr = (objMap && objMap[normalizedTarget]) || [];

            (structure.levels || []).forEach((lvl, lvlIdx) => {
                if (!lvl || !Object.keys(lvl).length || lvlIdx === 0) return;

                const keyVal = rawKey;
                const lvlNum = lvlIdx;
                const uid = `${keyVal}|${lvlNum}`;
                const checked = !!missionsCheckedMapRef[uid];

                // start new row same as cost pattern
                const row = Array(missionsCols.length).fill('-');
                row[0] = keyVal;
                row[1] = checked;
                row[2] = lvlNum;

                for (let col = 3; col < missionsCols.length; col++) {
                    const colDef = missionsCols[col];
                    const dataKey = (colDef.dataKey || '').toLowerCase();
                    if (!dataKey) continue;

                    let val = null;
                    try { val = Helpers.lookup.lookupValue(lvl, dataKey); } catch (e) { val = null; }

                    // === Custom handler (1): Override Power with missionPowerArr
                    if (dataKey === 'power') {
                        const missionDelta = missionPowerArr[lvlIdx];
                        val = missionDelta ? Helpers.formatShort(missionDelta) : '-';
                    }
                    // === Custom handler (2): Resource multiplier ×0.25
                    else if ([
                        'currency3@quantity', 
                        'currency4@quantity', 
                        'currency5@quantity', 
                        'currency6@quantity', 
                        'currency7@quantity'  
                    ].includes(dataKey)) {
                        const numVal = Number(val) || 0;
                        val = numVal > 0 ? numVal * 0.25 : 0;
                    }

                    // === Custom handler (2): Numeric formatting
                    if (val === null || val === undefined || val === '') {
                        val = '-';
                    } else if (typeof val === 'number' && val > 1000) {
                        val = Helpers.formatShort(val);
                    }

                    row[col] = val;
                }

                try { dt.row.add(row); } catch (e) { console.warn(`missions dt.row.add fail for ${key}`, e); }
            });

            // draw table
            dt.draw(false);
            Tables.setScrollRows(dt);
            try { dt.columns.adjust(); } catch (e) {}
        }

        console.log("✅ Populated all missions tables");
    }
    function populateAllStatsTables(structures) {
        for (const [rawKey, structure] of Object.entries(structures)) {
            const key = rawKey.toLowerCase().replace(/[\s_]/g, '');
            const dt = Tables.allStatsTables[key];
            if (!dt) continue;

            dt.clear();

            // ✅ Use the same unified column rule
            applyColumnVisibility(dt, statsColumnMap, rawKey);

            if (!structure || !Array.isArray(structure.levels)) continue;

            structure.levels.forEach((lvl, lvlIdx) => {
                if (!lvl || !Object.keys(lvl).length || lvlIdx === 0) return;
                const row = [rawKey, lvlIdx];

                for (let col = 2; col < statsCols.length; col++) {
                    const colDef = statsCols[col];
                    const dataKey = (colDef.dataKey || '').toLowerCase();
                    if (!dataKey) { row.push('-'); continue; }

                    const parts = dataKey.split('@');
                    const baseKey = parts[0];

                    let val = null;
                    try { val = Helpers.lookup.lookupValue(lvl, dataKey); } catch(e) { val = null; }

                    // === Generation scaling (minute → hour)
                    if (typeof val === 'number' && baseKey === 'generate' && (
                        ['blackmarket', 'hydroponicfarm', 'oilrig', 'alloyrefinery'].includes(key)
                    )) {
                        val = val * 60;
                    }

                    // === Special modifiers ===
                    if (val === null || val === undefined) {
                        val = '-';
                    } else if (typeof val === 'number') {
                        if (baseKey === 'hero_xp_loss_modifier') {
                            val = (50 + Math.abs(val) * 100).toFixed(2) + '%';
                        } else if (baseKey === 'march_currency_tax_modifier') {
                            val = (30 - Math.abs(val) * 100).toFixed(2) + '%';
                        } else if (baseKey.endsWith('_modifier')) {
                            val = (val * 100).toFixed(2) + '%';
                        } else if (val > 1000) {
                            val = Helpers.formatShort(val);
                        }
                    }

                    row.push(val);
                }

                try { dt.row.add(row); } catch(e){ console.warn('stats dt.row.add failed', e); }
            });

            dt.draw(false);
            Tables.setScrollRows(dt);
            try { dt.columns.adjust(); } catch(e){}
        }

        console.log("✅ Populated all stats tables");
    }
    function applyColumnVisibility(dt, map, rawKey) {
        if (!dt || !map) return;

        const normalized = rawKey.toLowerCase().replace(/[\s_]/g, '');
        let showCols = map[normalized] || [];
        if (!showCols.length) {
            const matchKey = Object.keys(map).find(k => 
                k.replace(/[\s_]/g, '') === normalized
            );
            if (matchKey) showCols = map[matchKey] || [];
        }

        const colCount = dt.columns().count();
        try { dt.columns().visible(false); } catch(e){}
        if (colCount > 1) try { dt.column(1).visible(true); } catch(e){} // always keep checkbox col visible

        showCols.forEach(i => {
            if (typeof i === 'number' && i >= 0 && i < colCount) {
                try { dt.column(i).visible(true); } catch(e){}
            }
        });
    }
    function setScrollRows(dt, rows = VISIBLE_ROWS){
        if (!dt || typeof dt.settings !== "function" || !dt.settings().length) {
            console.debug('setScrollRows: DataTable not ready'); 
            return;
        }
        // measure and cache row height per DataTable instance
        if (dt._rowHeight == null || dt._rowHeight < 10) {
            const $firstCell = $(dt.table().body()).find('tr:visible:first td:visible:first');
            const measured = $firstCell.length ? $firstCell.outerHeight() : 0;
            if (measured && measured >= 10) dt._rowHeight = measured;
        }
        const baseRow = (dt._rowHeight && dt._rowHeight >= 10) ? dt._rowHeight : 32; // safe fallback
        const height = Math.ceil(baseRow * rows);
        const $scrollBody = $(dt.table().container()).find('div.dataTables_scrollBody');
        if ($scrollBody.length) $scrollBody.css({ height: height + 'px', 'max-height': height + 'px' });
        const settings = dt.settings()[0];
        if (settings && settings.oScroll) settings.oScroll.sY = height + 'px';
        try { dt.columns.adjust(); } catch(e){/* ignore */ }
    }
    function applyScaleForTable(dt, scale) {
        if (!dt) return;
        dt.rows().every(function() {
            const d = this.data();
            if (!d || !d._rawTime) return;
            const rawVal = d._rawTime[Tables.TIME_COL];
            if (rawVal !== undefined) {
                const scaled = rawVal > 0
                    ? Helpers.formatTime(Math.floor(rawVal / (1 + scale / 100)))
                    : "-";
                d[Tables.TIME_COL] = scaled;
                this.data(d, false);
            }
        });
        dt.draw(false);
        if (typeof Totals.updateCostsTotals === "function") {
            Totals.updateCostsTotals(scale);
        }
    }
    function applyScale(scale) {
        if (!Tables.allCostsTables) return;

        // Find the active (visible) building and map to data key
        const activeSection = $('.section.active').text().trim();
        if (!activeSection) return;

        const keyMap = window.loadedKeyMap || window.keyMap || {};
        let mapped = keyMap[activeSection] || activeSection;
        let safeKey = mapped.toLowerCase().replace(/[\s_]/g, '');
        // Fuzzy match if direct match not present
        if (!Tables.allCostsTables[safeKey]) {
            const keys = Object.keys(Tables.allCostsTables);
            const exact = keys.find(k => k === safeKey);
            const contains = exact || keys.find(k => k.includes(safeKey));
            const containedBy = contains || keys.find(k => safeKey.includes(k));
            if (containedBy) safeKey = containedBy;
        }
        const dt = Tables.allCostsTables?.[safeKey];
        if (!dt) return;

        applyScaleForTable(dt, scale);
    }

    // Expose selected API
    return {
        initDefaults,
        createAllCostsTables,
        createAllMissionsTables,
        createAllStatsTables,    
        populateAllCostsTables,
        populateAllMissionsTables,
        populateAllStatsTables,    
        setScrollRows,
        applyScale,
        applyScaleForTable,
        applyColumnVisibility,        
        KEY_COL, CHECKBOX_COL, LEVEL_COL, TIME_COL,
    };
})(Helpers);
