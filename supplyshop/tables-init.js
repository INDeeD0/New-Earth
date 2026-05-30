// tables-init.js
// Initialize DataTables and provide API for rows/columns operations.

const Tables = (function(Helpers){
    const costsCols = [
        { title: "Key", visible: false },
        {
        title: "<button id='removeAllCosts' style='padding:2px 6px;'>&#x1F501</button>", orderable: false, width: "50px",
            render: function(data, type, row, meta) {
            const keyVal = Helpers.stripHtml(row && row[0] !== undefined ? row[0] : "");
            const levelVal = (row && row[2] !== undefined) ? String(row[2]) : String(meta.row);
            const uid = `${keyVal}|${levelVal}`;
            const checked = !!Totals.getCheckedMap()[uid];
            if (type === 'display') {
                return `<input type=\"checkbox\" class=\"row-checkbox\" data-uid=\"${uid}\" ${checked ? 'checked' : ''}>`;
            }
            return checked;
            }
        },
        { title:"LVL" },// 2
        {title: `
            <div class="headflex">
                <img src="pictures/Time.png" class="col-icon">
                <input type="number" class="time-scale" style="width:40px;" step="1" min="0"> %
                <span class="info-icon" data-tip="Building boost">❓</span>
            </div>
        `,
        className: "dt-head-center",
        dataKey: "upgrade_cost!time"},
        { title:'<span class="info-icon" data-tip="Alien Bulwark"><img src="pictures/Alien Bulwark.png" class="col-icon"></span>15', dataKey: "crafting_alien_bulwark@value" },//4
        { title:'<span class="info-icon" data-tip="Reflectium"><img src="pictures/Reflectium.png" class="col-icon"></span>15', dataKey: "crafting_reflectium@value" },
        { title:'<span class="info-icon" data-tip="Power Cell"><img src="pictures/Power Cell.png" class="col-icon"></span>15', dataKey: "crafting_power_cell@value" },
        { title:'<span class="info-icon" data-tip="Alien Alloy"><img src="pictures/Alien Alloy.png" class="col-icon"></span>15', dataKey: "crafting_alien_alloy@value" },
        { title:'<span class="info-icon" data-tip="Bio-Mesh"><img src="pictures/Bio-Mesh.png" class="col-icon"></span>15', dataKey: "crafting_biomesh@value" },
        { title:'<span class="info-icon" data-tip="Deployment Recall"><img src="pictures/Deployment Recall.png" class="col-icon"></span>9', dataKey: "march_recall@value" },
        { title:'<span class="info-icon" data-tip="Tech 500K"><img src="pictures/Tech 500K.png" class="col-icon"></span>12', dataKey: "currency3_500k@value" },
        { title:'<span class="info-icon" data-tip="Food 500K"><img src="pictures/Food 500K.png" class="col-icon"></span>12', dataKey: "currency4_500k@value" },
        { title:'<span class="info-icon" data-tip="VIP 7D"><img src="pictures/VIP 7D.png" class="col-icon"></span>5', dataKey: "vip_time_7d@value" },
        { title:'<span class="info-icon" data-tip="Defense Boost 12H"><img src="pictures/Defense Boost 12H.png" class="col-icon"></span>5', dataKey: "combat_defense_boost_12h@value" },
        { title:'<span class="info-icon" data-tip="Rocket Fuel"><img src="pictures/Rocket Fuel.png" class="col-icon"></span>5', dataKey: "march_25_percent_boost@value" },
        { title:'<span class="info-icon" data-tip="Gathering Boost 24H"><img src="pictures/Gathering Boost 24H.png" class="col-icon"></span>5', dataKey: "march_gather_boost_24h@value" },
        { title:'<span class="info-icon" data-tip="Healing Speedup 3H"><img src="pictures/Healing Speedup 3H.png" class="col-icon"></span>5', dataKey: "boost_hospital_3h@value" },
        { title:'<span class="info-icon" data-tip="Shield 8H"><img src="pictures/Shield 8H.png" class="col-icon"></span>5', dataKey: "shield_8h@value" },
        { title:'<span class="info-icon" data-tip="Neut Crystal"><img src="pictures/Neut Crystal.png" class="col-icon"></span>5', dataKey: "core_neutronium_crystal@value" },
        { title:'<span class="info-icon" data-tip="Oil 500K"><img src="pictures/Oil 500K.png" class="col-icon"></span>12', dataKey: "currency5_500k@value" }, 
        { title:'<span class="info-icon" data-tip=""Alloy 500K"><img src="pictures/Alloy 500K.png" class="col-icon"></span>12', dataKey: "currency6_500k@value" },
        { title:'<span class="info-icon" data-tip="Gathering Boost 7D"><img src="pictures/Gathering Boost 7D.png" class="col-icon"></span>5', dataKey: "march_gather_boost_7d@value" },
        { title:'<span class="info-icon" data-tip="Hero Invader Skill Reset"><img src="pictures/Hero Invader Skill Reset.png" class="col-icon"></span>5', dataKey: "hero_monster_skill_reset@value" }, 
        { title:'<span class="info-icon" data-tip="VIP 1D"><img src="pictures/VIP 1D.png" class="col-icon"></span>15', dataKey: "vip_time_1d@value" },
        { title:'<span class="info-icon" data-tip="Titanium"><img src="pictures/Titanium.png" class="col-icon"></span>15', dataKey: "crafting_titanium@value" }, 
        { title:'<span class="info-icon" data-tip="Scope"><img src="pictures/Scope.png" class="col-icon"></span>15', dataKey: "crafting_scope@value" }, //25
        { title:'<span class="info-icon" data-tip="Doron Plate"><img src="pictures/Doron Plate.png" class="col-icon"></span>15', dataKey: "crafting_doron_plate@value" }, 
        { title:'<span class="info-icon" data-tip="Shells"><img src="pictures/Shells.png" class="col-icon"></span>15', dataKey: "crafting_shells@value" }, 
        { title:'<span class="info-icon" data-tip="Neut 15K"><img src="pictures/Neut 15K.png" class="col-icon"></span>15', dataKey: "currency7_15k@value" },
        { title:'<span class="info-icon" data-tip="Hero XP 20K"><img src="pictures/Hero XP 20K.png" class="col-icon"></span>5', dataKey: "hero_xp_20k@value" }, 
        { title:'<span class="info-icon" data-tip="Stim-Pack 1K"><img src="pictures/Stim-Pack 1K.png" class="col-icon"></span>5', dataKey: "hero_energy_1000@value" }, 
        { title:'<span class="info-icon" data-tip="Reflectium"><img src="pictures/Reflectium.png" class="col-icon"></span>15', dataKey: "crafting_reflectium@value" },
        { title:'<span class="info-icon" data-tip="Power Cell"><img src="pictures/Power Cell.png" class="col-icon"></span>15', dataKey: "crafting_power_cell@value" },
        { title:'<span class="info-icon" data-tip="Bio-Mesh"><img src="pictures/Bio-Mesh.png" class="col-icon"></span>15', dataKey: "crafting_biomesh@value" },
        { title:'<span class="info-icon" data-tip="Light Pods"><img src="pictures/Light Pods.png" class="col-icon"></span>5', dataKey: "march_25_percent_capacity@value" },
        { title:'<span class="info-icon" data-tip="Defense Boost 12H"><img src="pictures/Defense Boost 12H.png" class="col-icon"></span>5', dataKey: "combat_defense_boost_12h@value" },
        { title:'<span class="info-icon" data-tip="Healing Speedup 3H"><img src="pictures/Healing Speedup 3H.png" class="col-icon"></span>5', dataKey: "boost_hospital_3h@value" },
        { title:'<span class="info-icon" data-tip="Stim-Pack 500"><img src="pictures/Stim-Pack 500.png" class="col-icon"></span>5', dataKey: "hero_energy_500@value" },
        { title:'<span class="info-icon" data-tip="VIP 1D"><img src="pictures/VIP 1D.png" class="col-icon"></span>15', dataKey: "vip_time_1d@value" },
        { title:'<span class="info-icon" data-tip="Rocket Fuel"><img src="pictures/Rocket Fuel.png" class="col-icon"></span>5', dataKey: "march_25_percent_boost@value" },
        { title:'<span class="info-icon" data-tip="Food Boost 1D"><img src="pictures/Food Boost 1D.png" class="col-icon"></span>9', dataKey: "boost_currency4_1d@value" },
        { title:'<span class="info-icon" data-tip="Oil Boost 1D"><img src="pictures/Oil Boost 1D.png" class="col-icon"></span>9', dataKey: "boost_currency5_1d@value" },
        { title:'<span class="info-icon" data-tip="Healing Speedup 3H"><img src="pictures/Healing Speedup 3H.png" class="col-icon"></span>5', dataKey: "boost_hospital_3h@value" },
        { title:'<span class="info-icon" data-tip="Titanium"><img src="pictures/Titanium.png" class="col-icon"></span>15', dataKey: "crafting_titanium@value" },
        { title:'<span class="info-icon" data-tip="Silencer"><img src="pictures/Silencer.png" class="col-icon"></span>15', dataKey: "crafting_silencer@value" }, //35
        { title:'<span class="info-icon" data-tip="Carbon Fiber"><img src="pictures/Carbon Fiber.png" class="col-icon"></span>15', dataKey: "crafting_carbon_fiber@value" }, 
        { title:'<span class="info-icon" data-tip="Chrome Alloy"><img src="pictures/Chrome Alloy.png" class="col-icon"></span>15', dataKey: "crafting_chrome_alloy@value" },
        { title:'<span class="info-icon" data-tip="Tech 150K"><img src="pictures/Tech 150K.png" class="col-icon"></span>15', dataKey: "currency3_150k@value" },  
        { title:'<span class="info-icon" data-tip="Food 150K"><img src="pictures/Food 150K.png" class="col-icon"></span>15', dataKey: "currency4_150k@value" }, 
        { title:'<span class="info-icon" data-tip="Tech Boost 1D"><img src="pictures/Tech Boost 1D.png" class="col-icon"></span>9', dataKey: "boost_currency3_1d@value" },
        { title:'<span class="info-icon" data-tip="Alloy Boost 1D"><img src="pictures/Alloy Boost 1D.png" class="col-icon"></span>9', dataKey: "boost_currency6_1d@value" },
        { title:'<span class="info-icon" data-tip="Healing Speedup 3H"><img src="pictures/Healing Speedup 3H.png" class="col-icon"></span>5', dataKey: "boost_hospital_3h@value" },
        { title:'<span class="info-icon" data-tip="Alien Alloy"><img src="pictures/Alien Alloy.png" class="col-icon"></span>15', dataKey: "crafting_alien_alloy@value" },
        { title:'<span class="info-icon" data-tip="Shells"><img src="pictures/Shells.png" class="col-icon"></span>15', dataKey: "crafting_shells@value" },
        { title:'<span class="info-icon" data-tip="Player Mission Refresh"><img src="pictures/Player Mission Refresh.png" class="col-icon"></span>5', dataKey: "new_missions_category1@value" },
        { title:'<span class="info-icon" data-tip="Hero XP 5K"><img src="pictures/Hero XP 5K.png" class="col-icon"></span>5', dataKey: "hero_xp_5k@value" },
        { title:'<span class="info-icon" data-tip="Healing Speedup 3H"><img src="pictures/Healing Speedup 3H.png" class="col-icon"></span>5', dataKey: "boost_hospital_3h@value" },
        { title:'<span class="info-icon" data-tip="Speedup 1H"><img src="pictures/Speedup 1H.png" class="col-icon"></span>5', dataKey: "boost_1h@value" },
        { title:'<span class="info-icon" data-tip="VIP 1D"><img src="pictures/VIP 1D.png" class="col-icon"></span>15', dataKey: "vip_time_1d@value" },
        { title:'<span class="info-icon" data-tip="Alien Bulwark"><img src="pictures/Alien Bulwark.png" class="col-icon"></span>12', dataKey: "crafting_alien_bulwark@value" },
        { title:'<span class="info-icon" data-tip="Gathering Boost 24H"><img src="pictures/Gathering Boost 24H.png" class="col-icon"></span>5', dataKey: "march_gather_boost_24h@value" },
        { title:'<span class="info-icon" data-tip="Doron Plate"><img src="pictures/Doron Plate.png" class="col-icon"></span>15', dataKey: "crafting_doron_plate@value" },
        { title:'<span class="info-icon" data-tip="Player Mission Refresh"><img src="pictures/Player Mission Refresh.png" class="col-icon"></span>5', dataKey: "new_missions_category1@value" },
        { title:'<span class="info-icon" data-tip="Stim-Pack 1K"><img src="pictures/Stim-Pack 1K.png" class="col-icon"></span>5', dataKey: "hero_energy_1000@value" }, 
        { title:'<span class="info-icon" data-tip="Alien Bulwark"><img src="pictures/Alien Bulwark.png" class="col-icon"></span>15', dataKey: "crafting_alien_bulwark@value" },//4
        { title:'<span class="info-icon" data-tip="Reflectium"><img src="pictures/Reflectium.png" class="col-icon"></span>15', dataKey: "crafting_reflectium@value" },
        { title:'<span class="info-icon" data-tip="Power Cell"><img src="pictures/Power Cell.png" class="col-icon"></span>15', dataKey: "crafting_power_cell@value" },
        { title:'<span class="info-icon" data-tip="Alien Alloy"><img src="pictures/Alien Alloy.png" class="col-icon"></span>15', dataKey: "crafting_alien_alloy@value" },
        { title:'<span class="info-icon" data-tip="Bio-Mesh"><img src="pictures/Bio-Mesh.png" class="col-icon"></span>15', dataKey: "crafting_biomesh@value" },
        { title:'<span class="info-icon" data-tip="Hero XP 20K"><img src="pictures/Hero XP 20K.png" class="col-icon"></span>5', dataKey: "hero_xp_20k@value" },
        { title:'<span class="info-icon" data-tip="Neut Boost 1D"><img src="pictures/Neut Boost 1D.png" class="col-icon"></span>9', dataKey: "boost_currency7_1d@value" }, 
        { title:'<span class="info-icon" data-tip="Healing Speedup 3H"><img src="pictures/Healing Speedup 3H.png" class="col-icon"></span>5', dataKey: "boost_hospital_3h@value" },
        { title:'<span class="info-icon" data-tip="Stim-Pack 500"><img src="pictures/Stim-Pack 500.png" class="col-icon"></span>5', dataKey: "hero_energy_500@value" },
        { title:'<span class="info-icon" data-tip="Neut Crystal"><img src="pictures/Neut Crystal.png" class="col-icon"></span>5', dataKey: "core_neutronium_crystal@value" },
        { title:'<span class="info-icon" data-tip="Rocket Fuel"><img src="pictures/Rocket Fuel.png" class="col-icon"></span>5', dataKey: "march_25_percent_boost@value" },
        { title:'<span class="info-icon" data-tip="Gathering Boost 24H"><img src="pictures/Gathering Boost 24H.png" class="col-icon"></span>5', dataKey: "march_gather_boost_24h@value" },
        { title:'<span class="info-icon" data-tip="Healing Speedup 3H"><img src="pictures/Healing Speedup 3H.png" class="col-icon"></span>5', dataKey: "boost_hospital_3h@value" },
        { title:'<span class="info-icon" data-tip="Shield 8H"><img src="pictures/Shield 8H.png" class="col-icon"></span>5', dataKey: "shield_8h@value" },
        { title:'<span class="info-icon" data-tip="VIP 1D"><img src="pictures/VIP 1D.png" class="col-icon"></span>15', dataKey: "vip_time_1d@value" },
        { title:'<span class="info-icon" data-tip="Mobile Outpost Vehicle"><img src="pictures/Mobile Outpost Vehicle.png" class="col-icon"></span>5', dataKey: "mobile_outpost_vehicle@value" },
        { title:'<span class="info-icon" data-tip="Attack Boost 1D"><img src="pictures/Attack Boost 1D.png" class="col-icon"></span>5', dataKey: "combat_attack_boost_1d@value" },
        { title:'<span class="info-icon" data-tip="Chrome Alloy"><img src="pictures/Chrome Alloy.png" class="col-icon"></span>15', dataKey: "crafting_chrome_alloy@value" }, 
        { title:'<span class="info-icon" data-tip="Hero Invader Skill Reset"><img src="pictures/Hero Invader Skill Reset.png" class="col-icon"></span>5', dataKey: "hero_monster_skill_reset@value" }, 
        { title:'<span class="info-icon" data-tip="Carbon Fiber"><img src="pictures/Carbon Fiber.png" class="col-icon"></span>15', dataKey: "crafting_carbon_fiber@value" },
        { title:'<span class="info-icon" data-tip="Titanium"><img src="pictures/Titanium.png" class="col-icon"></span>15', dataKey: "crafting_titanium@value" }, 
        { title:'<span class="info-icon" data-tip="Scope"><img src="pictures/Scope.png" class="col-icon"></span>15', dataKey: "crafting_scope@value" }, //25
        { title:'<span class="info-icon" data-tip="Doron Plate"><img src="pictures/Doron Plate.png" class="col-icon"></span>15', dataKey: "crafting_doron_plate@value" },
        { title:'<span class="info-icon" data-tip="Shells"><img src="pictures/Shells.png" class="col-icon"></span>15', dataKey: "crafting_shells@value" },
        { title:'<span class="info-icon" data-tip="Neut 15K"><img src="pictures/Neut 15K.png" class="col-icon"></span>15', dataKey: "currency7_15k@value" }, 
        { title:'<span class="info-icon" data-tip="Healing Speedup 3H"><img src="pictures/Healing Speedup 3H.png" class="col-icon"></span>5', dataKey: "boost_hospital_3h@value" },
        { title:'<span class="info-icon" data-tip="Player Mission Refresh"><img src="pictures/Player Mission Refresh.png" class="col-icon"></span>5', dataKey: "new_missions_category1@value" },
        { title:'<span class="info-icon" data-tip="Power Cell"><img src="pictures/Power Cell.png" class="col-icon"></span>15', dataKey: "crafting_power_cell@value" },
        { title:'<span class="info-icon" data-tip="Bio-Mesh"><img src="pictures/Bio-Mesh.png" class="col-icon"></span>15', dataKey: "crafting_biomesh@value" },
        { title:'<span class="info-icon" data-tip="Chrome Alloy"><img src="pictures/Chrome Alloy.png" class="col-icon"></span>15', dataKey: "crafting_chrome_alloy@value" },
        { title:'<span class="info-icon" data-tip="Light Pods"><img src="pictures/Light Pods.png" class="col-icon"></span>5', dataKey: "march_25_percent_capacity@value" },
        { title:'<span class="info-icon" data-tip="Defense Boost 12H"><img src="pictures/Defense Boost 12H.png" class="col-icon"></span>5', dataKey: "combat_defense_boost_12h@value" },
        { title:'<span class="info-icon" data-tip="Healing Speedup 3H"><img src="pictures/Healing Speedup 3H.png" class="col-icon"></span>5', dataKey: "boost_hospital_3h@value" },
        { title:'<span class="info-icon" data-tip="Stim-Pack 500"><img src="pictures/Stim-Pack 500.png" class="col-icon"></span>5', dataKey: "hero_energy_500@value" },
        { title:'<span class="info-icon" data-tip="VIP 1D"><img src="pictures/VIP 1D.png" class="col-icon"></span>15', dataKey: "vip_time_1d@value" },
        { title:'<span class="info-icon" data-tip="Shield 8H"><img src="pictures/Shield 8H.png" class="col-icon"></span>5', dataKey: "shield_8h@value" },
        { title:'<span class="info-icon" data-tip="Hero XP 5K"><img src="pictures/Hero XP 5K.png" class="col-icon"></span>5', dataKey: "hero_xp_5k@value" },
        { title:'<span class="info-icon" data-tip="Gathering Boost 24H"><img src="pictures/Gathering Boost 24H.png" class="col-icon"></span>5', dataKey: "march_gather_boost_24h@value" },
        { title:'<span class="info-icon" data-tip="Alien Alloy"><img src="pictures/Alien Alloy.png" class="col-icon"></span>15', dataKey: "crafting_alien_alloy@value" },
        { title:'<span class="info-icon" data-tip="Bio-Mesh"><img src="pictures/Bio-Mesh.png" class="col-icon"></span>15', dataKey: "crafting_biomesh@value" },
        { title:'<span class="info-icon" data-tip="Silencer"><img src="pictures/Silencer.png" class="col-icon"></span>15', dataKey: "crafting_silencer@value" }, //35
        { title:'<span class="info-icon" data-tip="Carbon Fiber"><img src="pictures/Carbon Fiber.png" class="col-icon"></span>15', dataKey: "crafting_carbon_fiber@value" }, 
        { title:'<span class="info-icon" data-tip="Chrome Alloy"><img src="pictures/Chrome Alloy.png" class="col-icon"></span>15', dataKey: "crafting_chrome_alloy@value" }, 
        { title:'<span class="info-icon" data-tip="Tech 150K"><img src="pictures/Tech 150K.png" class="col-icon"></span>15', dataKey: "currency3_150k@value" },  
        { title:'<span class="info-icon" data-tip="Food 150K"><img src="pictures/Food 150K.png" class="col-icon"></span>15', dataKey: "currency4_150k@value" },
        { title:'<span class="info-icon" data-tip="Stim-Pack 500"><img src="pictures/Stim-Pack 500.png" class="col-icon"></span>5', dataKey: "hero_energy_500@value" },
        { title:'<span class="info-icon" data-tip="Doron Plate"><img src="pictures/Doron Plate.png" class="col-icon"></span>15', dataKey: "crafting_doron_plate@value" },
        { title:'<span class="info-icon" data-tip="Bio-Mesh"><img src="pictures/Bio-Mesh.png" class="col-icon"></span>15', dataKey: "crafting_biomesh@value" },
        { title:'<span class="info-icon" data-tip="VIP 1D"><img src="pictures/VIP 1D.png" class="col-icon"></span>15', dataKey: "vip_time_1d@value" },
        { title:'<span class="info-icon" data-tip="Neut Crystal"><img src="pictures/Neut Crystal.png" class="col-icon"></span>5', dataKey: "core_neutronium_crystal@value" },
        { title:'<span class="info-icon" data-tip="Player Mission Refresh"><img src="pictures/Player Mission Refresh.png" class="col-icon"></span>5', dataKey: "new_missions_category1@value" },
        { title:'<span class="info-icon" data-tip="Hero XP 5K"><img src="pictures/Hero XP 5K.png" class="col-icon"></span>5', dataKey: "hero_xp_5k@value" },
        { title:'<span class="info-icon" data-tip="Healing Speedup 3H"><img src="pictures/Healing Speedup 3H.png" class="col-icon"></span>5', dataKey: "boost_hospital_3h@value" },
        { title:'<span class="info-icon" data-tip="Speedup 1H"><img src="pictures/Speedup 1H.png" class="col-icon"></span>5', dataKey: "boost_1h@value" },
        { title:'<span class="info-icon" data-tip="VIP 1D"><img src="pictures/VIP 1D.png" class="col-icon"></span>15', dataKey: "vip_time_1d@value" },
        { title:'<span class="info-icon" data-tip="Hero Invader Skill Reset"><img src="pictures/Hero Invader Skill Reset.png" class="col-icon"></span>5', dataKey: "hero_monster_skill_reset@value" }, 
        { title:'<span class="info-icon" data-tip="Gathering Boost 7D"><img src="pictures/Gathering Boost 7D.png" class="col-icon"></span>5', dataKey: "march_gather_boost_7d@value" }, 
        { title:'<span class="info-icon" data-tip="Reflectium"><img src="pictures/Reflectium.png" class="col-icon"></span>15', dataKey: "crafting_reflectium@value" },
        { title:'<span class="info-icon" data-tip="Stim-Pack 1K"><img src="pictures/Stim-Pack 1K.png" class="col-icon"></span>5', dataKey: "hero_energy_1000@value" },
        { title:'<span class="info-icon" data-tip="Neut 50K"><img src="pictures/Neut 50K.png" class="col-icon"></span>5', dataKey: "currency7_50k@value" }, 
    ];
    const missionsCols =[
        { title: "Key", visible: false },
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
        { title: "LVL" },
    ]
    const statsCols = [
        { title: "Key", visible: false },
        { title: "<button id='removeAllStats' style='padding:2px 6px;'>&#x1F501</button>", orderable:false, width:"50px",
            render: function(data, type, row, meta) {
            const keyVal = Helpers.stripHtml(row && row[0] !== undefined ? row[0] : "");
            const levelVal = (row && row[2] !== undefined) ? String(row[2]) : String(meta.row);
            const uid = `${keyVal}|${levelVal}`;
            const checked = !!Totals.getStatsCheckedMap()[uid];
            if (type === 'display') {
                return `<input type=\"checkbox\" class=\"row-checkbox\" data-uid=\"${uid}\" ${checked ? 'checked' : ''}>`;
            }
            return checked;
            }
        },
        { title: "LVL" },
    ];
    const costsColumnMap = {
        '*': [],
        supplyshop_core_alien_power_core_1_a: [4,5,6,7,8], 
        supplyshop_core_alien_power_core_1_b: [9,10,11,12,13],
        supplyshop_core_alien_power_core_2_a: [14,15,16,17,18], 
        supplyshop_core_alien_power_core_2_b: [19,20,21,22,23], 
        supplyshop_core_alien_component_1_a: [24,25,26,27,28],
        supplyshop_core_alien_component_1_b: [29,30,31,32,33],
        supplyshop_core_alien_component_2_a: [34,35,36,37,38],
        supplyshop_core_alien_component_2_b: [39,40,41,42,43],
        supplyshop_core_alien_armor_1_a: [44,45,46,47,48],
        supplyshop_core_alien_armor_1_b: [49,50,51,52,53],
        supplyshop_core_alien_armor_2_a: [54,55,56,57,58],
        supplyshop_core_alien_armor_2_b: [59,60,61,62,63],
        supplyshop_core_data_disk_1_a: [64,65,66,67,68],
        supplyshop_core_data_disk_1_b: [69,70,71,72,73],
        supplyshop_core_data_disk_2_a: [74,75,76,77,78],
        supplyshop_core_data_disk_2_b: [79,80,81,82,83],
        supplyshop_core_classified_documents_1_a: [84,85,86,87,88],
        supplyshop_core_classified_documents_1_b: [89,90,91,92,93],
        supplyshop_core_classified_documents_2_a: [94,95,96,97,98],
        supplyshop_core_classified_documents_2_b: [99,100,101,102,103],
        supplyshop_armory_blueprints_1_a: [104,105,106,107,108],
        supplyshop_armory_blueprints_1_b: [109,110,111,112,113],
        supplyshop_armory_blueprints_2_a: [114,115,116,117,118],
        supplyshop_armory_blueprints_2_b: [119,120,121,122,123],
        
    };
    const missionsColumnMap = {
        '*': [1,2],     
    };
    const statsColumnMap = {
        '*': [2],                          
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
    function populateAllCostsTables(structures, checkedMapRef) {
        for (const [rawKey, structure] of Object.entries(structures)) {
            const key = rawKey.toLowerCase().replace(/[\s_]/g, '');
            const dt = Tables.allCostsTables[key];
            if (!dt) continue;

            dt.clear();
            applyColumnVisibility(dt, costsColumnMap, rawKey);

            if (!structure || !Array.isArray(structure.levels)) continue;

            structure.levels.forEach((lvl, lvlIdx) => {
                if (!lvl || lvlIdx === 0) return;

                const uid = `${rawKey}|${lvlIdx}`;
                const checked = !!checkedMapRef?.[uid];

                // base row (must match column count)
                const row = Array(costsCols.length).fill('-');
                row[0] = rawKey;
                row[1] = checked;
                row[2] = lvlIdx;

                for (let col = 3; col < costsCols.length; col++) {
                    const colDef = costsCols[col];
                    const fullKey = (colDef.dataKey || '').toLowerCase();
                    if (!fullKey) continue;

                    let val = null;
                    try {
                        val = Helpers.lookup.lookupValue(lvl, fullKey);
                    } catch (e) { val = null; }

                    // ✅ store raw time for the TIME_COL
                    if (col === Tables.TIME_COL) {
                        if (!row._rawTime) row._rawTime = {};
                        row._rawTime[col] = Number(val) || 0;
                        val = row._rawTime[col] > 0
                            ? Helpers.formatTime(Math.floor(row._rawTime[col] / (1 + window.currentScale / 100)))
                            : "-";
                    }
                    const prevLvl = structure.levels[lvlIdx - 1] || null;
                    row[col] = Helpers.formatValue(val, fullKey, lvl, { prevLvl });
                }

                try { dt.row.add(row); }
                catch (e) { console.warn('costs dt.row.add failed', e); }
            });

            dt.draw(false);
            Tables.setScrollRows(dt);
            try { dt.columns.adjust(); } catch(e){}
        }

        console.log("✅ Populated all costs tables");
    }
    
    function populateAllMissionsTables(structures, missionsCheckedMapRef = {}) {
        for (const [rawKey, structure] of Object.entries(structures)) {
            const key = rawKey.toLowerCase().replace(/[\s_]/g, '');
            const dt = Tables.allMissionsTables[key];
            if (!dt) continue;

            dt.clear();
            applyColumnVisibility(dt, missionsColumnMap, rawKey);

            if (!structure || !Array.isArray(structure.levels)) continue;

            structure.levels.forEach((lvl, lvlIdx) => {
                if (!lvl || lvlIdx === 0) return;

                const uid = `${rawKey}|${lvlIdx}`;
                const checked = !!missionsCheckedMapRef?.[uid];

                const row = Array(missionsCols.length).fill('-');
                row[0] = rawKey;
                row[1] = checked;
                row[2] = lvlIdx;

                for (let col = 3; col < missionsCols.length; col++) {
                    const colDef = missionsCols[col];
                    const fullKey = (colDef.dataKey || '').toLowerCase();
                    if (!fullKey) continue;

                    let val = null;
                    try {
                        val = Helpers.lookup.lookupValue(lvl, fullKey);
                    } catch (e) {
                        val = null;
                    }

                    row[col] = Helpers.formatValue(val, fullKey, lvl);
                }

                try { dt.row.add(row); }
                catch (e) { console.warn('missions dt.row.add failed', e); }
            });

            dt.draw(false);
            Tables.setScrollRows(dt);
            try { dt.columns.adjust(); } catch(e){}
        }

        console.log("✅ Populated all missions tables");
    }
    function populateAllStatsTables(structures, statsCheckedMapRef = {}) {
        for (const [rawKey, structure] of Object.entries(structures)) {
            const key = rawKey.toLowerCase().replace(/[\s_]/g, '');
            const dt = Tables.allStatsTables[key];
            if (!dt) continue;

            dt.clear();
            applyColumnVisibility(dt, statsColumnMap, rawKey);

            if (!structure || !Array.isArray(structure.levels)) continue;

            structure.levels.forEach((lvl, lvlIdx) => {
                if (!lvl || lvlIdx === 0) return;

                const uid = `${rawKey}|${lvlIdx}`;
                const checked = !!statsCheckedMapRef?.[uid];

                const row = Array(statsCols.length).fill('-');
                row[0] = rawKey; 
                row[1] = checked;   
                row[2] = lvlIdx;   

                for (let col = 3; col < statsCols.length; col++) {
                    const colDef = statsCols[col];
                    const fullKey = (colDef.dataKey || '').toLowerCase();
                    if (!fullKey) continue;

                    let val = null;
                    try {
                        val = Helpers.lookup.lookupValue(lvl, fullKey);
                    } catch (e) {
                        val = null;
                    }

                    row[col] = Helpers.formatValue(val, fullKey, lvl);
                }

                try {
                    dt.row.add(row);
                } catch (e) {
                    console.warn('stats dt.row.add failed', e);
                }
            });

            dt.draw(false);
            Tables.setScrollRows(dt);
            try { dt.columns.adjust(); } catch (e) {}
        }

        console.log("✅ Populated all stats tables");
    }
    
    function storeRawTimeForTable(dt, colIndex) {
        dt.rows().every(function() {
            const row = this.data();
            if (!row) return;

            if (!row._rawTime) row._rawTime = {};
            const val = Number(row[colIndex]) || 0;
            row._rawTime[colIndex] = val;
        });
    }
    
    function applyColumnVisibility(dt, map, rawKey) {
        if (!dt || !map) return;

        const normalized = rawKey.toLowerCase().replace(/[\s_]/g, '');

        // 👇 wildcard columns (apply to all)
        const baseCols = map['*'] || [];

        // 👇 exact or normalized match
        let specificCols = map[normalized];
        if (!specificCols) {
            const matchKey = Object.keys(map).find(
                k => k !== '*' && k.replace(/[\s_]/g, '') === normalized
            );
            specificCols = matchKey ? map[matchKey] : [];
        }

        // 👇 final visible columns = ONLY what's listed
        const visibleCols = [...new Set([...baseCols, ...specificCols])];

        const colCount = dt.columns().count();

        // 🔒 hide EVERYTHING first
        for (let i = 0; i < colCount; i++) {
            try { dt.column(i).visible(false, false); } catch(e){}
        }

        // 👀 show only listed columns
        visibleCols.forEach(i => {
            if (Number.isInteger(i) && i >= 0 && i < colCount) {
                try { dt.column(i).visible(true, false); } catch(e){}
            }
        });

        try { dt.columns.adjust(false); } catch(e){}
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
            const row = this.data();
            if (!row || !row._rawTime) return;

            const rawVal = row._rawTime[Tables.TIME_COL];
            if (rawVal !== undefined) {
                row[Tables.TIME_COL] = rawVal > 0
                    ? Helpers.formatTime(Math.floor(rawVal / (1 + scale / 100)))
                    : "-";

                this.data(row, false); // update row but don’t redraw yet
            }
        });

        dt.draw(false); // redraw table once
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
