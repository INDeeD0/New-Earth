// data-loader.js
// responsible for fetching JSON files and building key maps used across modules

const DataLoader = (function(Helpers){
    const keyMap = {
        "Research Lab":"researchlab",
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
        "Prototype Attack II":"specializedprototypeattack2",
        "Alien Attack II":"specializedalienattack2",
        "Mech Attack II":"specializedmechattack2",
        "Prototype Defense II":"specializedprototypedefense2",
        "Alien Defense II":"specializedaliendefense2",
        "Mech Defense II":"specializedmechdefense2",
        "Prototype Health II":"specializedprototypehealth2",
        "Alien Health II":"specializedalienhealth2",
        "Mech Health II":"specializedmechhealth2",        
    };
    const reverseKeyMap = Object.fromEntries(
        Object.entries(keyMap).map(([label, key]) => [key.toLowerCase(), label])
    );

    async function loadAll(){
        const structPromise = fetch('molds/categories/research-specialized.json').then(r => r.json());
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
