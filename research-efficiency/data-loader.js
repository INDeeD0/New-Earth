// data-loader.js
// responsible for fetching JSON files and building key maps used across modules

const DataLoader = (function(Helpers){
    const keyMap = {
        "Research Lab":"researchlab",        
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
        "Deployment Speed III":"specialdeploymentspeed3",
        "Deployment Size III":"specialdeploymentsize3",
        "Rally Speed II":"efficiencyrallyspeed2",
        "Rally Capacity II":"efficiencyrallycapacity2"
    };
    const reverseKeyMap = Object.fromEntries(
        Object.entries(keyMap).map(([label, key]) => [key.toLowerCase(), label])
    );

    async function loadAll(){
        const structPromise = fetch('molds/categories/research-efficiency.json').then(r => r.json());
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
