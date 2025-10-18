// tree-and-ui.js
// Handles tree clicks, SVG line drawing, table toggles, and event delegation.

const UI = (function(Helpers, Tables, DataLoader, Totals){
    // reuse maps referenced by Tables renderer
    const checkedMap = Totals.getCheckedMap();
    const missionsCheckedMap = Totals.getMissionsCheckedMap();

    // some constants reused from original
    const columnMap = {"War_room":[12],"Commandpost":[13],"Engineering":[14],"Researchlab":[15],"Walls":[16],"Turret":[16],"Hero_armory":[17]};
    const timeHidden = ["Outpost_harvest","Outpost_strategic"];
    const outposts = ["Outpost_harvest","Outpost_strategic"];

    function drawLines(){
        const svg = document.getElementById('lines');
        if (!svg) return;
        svg.innerHTML = '';
        const container = document.getElementById('mapContainer');
        if (!container) return;

        const treeMap = {
            "Headquarters": ["Bunker","Black Market","Geoponic Farm","Oil Rig","Alloy Refinery","Supply Depot","Situation Room"],
            "Bunker": [], "Black Market": ["Engineering"], "Engineering": ["Experimentation Chamber","Factory","Turret"],
            "Factory": ["Robotics Bay"], "Geoponic Farm": ["Barracks"], "Oil Rig": ["Research Lab"], "Alloy Refinery": ["Wall"],
            "Barracks": ["Medical Bay","Command Post"], "Research Lab": ["Hostile Containment","Shard Reactor"], "Medical Bay": [],
            "Hostile Containment": ["Alien Genetics Labs"], "Wall": ["Airstrip","Satellite Uplink"], "Command Post": ["Hero Armory"],
            "Robotics Bay": [], "Alien Genetics Labs": [], "Hero Armory": [], "Supply Depot": ["Global Network"], "Global Network": ["Security Station"],
            "Situation Room": [], "Airstrip": [], "Satellite Uplink": [], "Security Station": [], "Turret": [], "Experimentation Chamber": [],
            "Shard Reactor": [], "Outpost Harvest": [], "Outpost Strategic": []
        };

        const elems = Array.from(container.children)
            .filter(el => el.classList && el.classList.contains('section'))
            .reduce((acc, el) => { acc[el.innerText.trim()] = el; return acc; }, {});

        for (let parentName in treeMap) {
            const children = treeMap[parentName];
            if (!children.length) continue;
            const parentEl = elems[parentName];
            if (!parentEl) continue;
            const parentRect = parentEl.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const startX = parentRect.right - containerRect.left;
            const startY = parentRect.top - containerRect.top + parentRect.height/2;

            children.forEach(childName => {
                const childEl = elems[childName]; if (!childEl) return;
                const childRect = childEl.getBoundingClientRect();
                const endX = childRect.left - containerRect.left;
                const endY = childRect.top - containerRect.top + childRect.height/2;
                const midX = startX + (endX - startX) / 2;

                const polyline = document.createElementNS("http://www.w3.org/2000/svg","polyline");
                polyline.setAttribute('points', `${startX},${startY} ${midX},${startY} ${midX},${endY} ${endX},${endY}`);
                polyline.setAttribute('stroke', '#ffcc00');
                polyline.setAttribute('stroke-width', '2');
                polyline.setAttribute('fill', 'none');
                polyline.setAttribute('stroke-linecap', 'round');
                polyline.setAttribute('stroke-linejoin', 'round');
                svg.appendChild(polyline);
            });
        }
    }

    function wireTreeClicks(keyMap, objMap){
        $('.section').on('click', function(){
            $('.section').removeClass('active'); $(this).addClass('active');

            const jsonKey = keyMap[$(this).text().trim()] || $(this).text().trim();
            // apply filter across all tables (key col)
            [$('#costsTable').DataTable(), $('#rewardsTable').DataTable(), $('#statsTable').DataTable()].forEach(tbl => tbl.column(0).search(jsonKey, true, false).draw());

            // hide conditional columns first (indices based on tables)
            const costsTable = $('#costsTable').DataTable();
            const TIME_COL = 3;
            costsTable.columns([TIME_COL, 10,11,12,13,14,15,16,17]).visible(false);

            if (!timeHidden.includes(jsonKey)) costsTable.column(TIME_COL).visible(true);
            if (!outposts.includes(jsonKey)) costsTable.column(11).visible(true);
            if (outposts.includes(jsonKey)) costsTable.column(10).visible(true);

            if (columnMap[jsonKey]) columnMap[jsonKey].forEach(idx => costsTable.column(idx).visible(true));

            // rebuild stats table for building
            Tables.rebuildStatsTableFor(jsonKey);

            $('.time-scale').val(currentScale);
            setTimeout(drawLines, 20);
        });
        $('.section.root').trigger('click');
    }

    function wireTableToggle(){
        $('.toggle-table-btn').on('click', function(){
            $('.toggle-table-btn').removeClass('active'); $(this).addClass('active');
            const tbl = $(this).data('table');

            $('#costsWrapper, #rewardsWrapper, #statsWrapper').css({height:0, overflow:'hidden'});
            $(`#${tbl}Wrapper`).css({height:'auto', overflow:'visible'});
            $('#missionsTotals').css('display', tbl === 'rewards' ? 'block' : 'none');
            $('#costsTotals').css('display', tbl === 'costs' ? 'block' : 'none');

            try {
                $('#costsTable').DataTable().fixedHeader.adjust();
                $('#rewardsTable').DataTable().fixedHeader.adjust();
                $('#statsTable').DataTable().fixedHeader.adjust();
            } catch(e){ /* ignore */ }

            setTimeout(function(){
                if (tbl === 'costs') Tables.setScrollRows($('#costsTable').DataTable());
                else if (tbl === 'rewards') Tables.setScrollRows($('#rewardsTable').DataTable());
                else if (tbl === 'stats') Tables.setScrollRows($('#statsTable').DataTable());
            }, 0);

            setTimeout(drawLines, 20);
        });
    }

    function wireDelegatedHandlers(){
        // Rewards checkboxes
        $('#rewardsTable tbody').on('change', '.row-checkbox', function(){
            const uid = $(this).attr('data-uid');
            const normalized = normalizeUid(uid);
            missionsCheckedMap[normalized] = $(this).is(':checked');
            Totals.updateMissionsTotals();
        });

        // Remove All button for Rewards
        $(document).on('click', '#removeAllRewards', function(e){
            e.preventDefault();
            Object.keys(missionsCheckedMap).forEach(k => delete missionsCheckedMap[k]);
            $('#rewardsTable').DataTable().rows().every(function(){
                const d = this.data();
                const uid = `${Helpers.stripHtml(d[0])}|${d[2]}`;
                missionsCheckedMap[uid] = false;
            });
            $('#rewardsTable').DataTable().rows().invalidate().draw(false);
            Totals.updateMissionsTotals();
        });

        // time-scale input sync
        $(document).on('input', '.time-scale', function(){
            const parsed = parseFloat($(this).val());
            if (!isNaN(parsed)) currentScale = parsed;
            $('.time-scale').val(currentScale);
            Tables.applyScale(currentScale);
            Totals.updateTotals(currentScale);
        });

        // Costs checkboxes
        $('#costsTable tbody').on('change', '.row-checkbox', function(){
            const uid = $(this).attr('data-uid');
            const normalized = normalizeUid(uid);
            checkedMap[normalized] = $(this).is(':checked');
            Totals.updateTotals(currentScale);
        });

        // Remove All button for Costs
        $(document).on('click', '#removeAll', function(e){
            e.preventDefault();
            Object.keys(checkedMap).forEach(k => delete checkedMap[k]);
            $('#costsTable').DataTable().rows().every(function(){
                const d = this.data();
                const uid = `${Helpers.stripHtml(d[0])}|${d[2]}`;
                checkedMap[uid] = false;
            });
            $('#costsTable').DataTable().rows().invalidate().draw(false);
            Totals.updateTotals(currentScale);
        });
    }

    function normalizeUid(uid){
        const parts = (uid || "").split('|');
        if (parts.length >= 2) {
            return `${Helpers.stripHtml(parts[0])}|${parts.slice(1).join('|')}`;
        }
        return uid;
    }

    // public bootstrap after data loaded and tables created
    function bootstrap(data){
        const keyMap = data.keyMap;
        const objMap = data.objMap;

        // initial draw of lines
        setTimeout(drawLines, 50);
        window.addEventListener('resize', function(){ setTimeout(drawLines, 20); });

        wireTreeClicks(keyMap, objMap);
        wireTableToggle();
        wireDelegatedHandlers();

        // initial totals triggers
        setTimeout(() => Totals.updateTotals(currentScale), 150);
        setTimeout(() => Totals.updateMissionsTotals(), 150);
    }

    return { bootstrap, drawLines };
})(Helpers, Tables, DataLoader, Totals);
