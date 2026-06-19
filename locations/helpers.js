// helpers.js
// small utilities: formatting, parsing, and simple DOM helpers

const Helpers = (function(){
    function formatTime(seconds) {
        seconds = Number(seconds) || 0;
        if (seconds <= 0) return "-";
        const d = Math.floor(seconds / 86400); seconds %= 86400;
        const h = Math.floor(seconds / 3600); seconds %= 3600;
        const m = Math.floor(seconds / 60); const s = seconds % 60;
        const parts = [];
        if (d) parts.push(d + "d");
        if (h) parts.push(h + "h");
        if (m) parts.push(m + "m");
        if (s && !d && !h && !m) parts.push(s + "s");
        return parts.join(" ");
    }

    function formatShort(num) {
        if (num === "-" || num === undefined || num === null) return "-";
        num = Number(num) || 0;
        if (num >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/,"") + "B";
        if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/,"") + "M";
        if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/,"") + "K";
        return num.toLocaleString();
    }

    function parseNumber(val) {

        if (val === null || val === undefined) return 0;

        // already numeric
        if (typeof val === 'number') return val;

        // strip html
        let str = String(val)
            .replace(/<[^>]*>/g, '')
            .trim()
            .toUpperCase();

        // multiplier support
        let multiplier = 1;
        if (str.endsWith('K')) { multiplier = 1e3; str = str.slice(0,-1); }
        else if (str.endsWith('M')) { multiplier = 1e6; str = str.slice(0,-1); }
        else if (str.endsWith('B')) { multiplier = 1e9; str = str.slice(0,-1); }

        // 🔥 remove commas + spaces
        str = str.replace(/,/g,'').replace(/\s/g,'');

        const n = parseFloat(str);
        return isNaN(n) ? 0 : n * multiplier;
    }

    const stripHtml = s => (s||"").toString().replace(/<[^>]*>/g,'').replace(/[%❓]/g,'').trim();

    function formatValue(val, dataKey, lvl = null, context = {}) {
        if (val === null || val === undefined) return '-';

        let key = (dataKey || '').toLowerCase();
        let flag = null;

        // -------- SPLIT FLAG --------
        if (key.includes('!')) {
            const parts = key.split('!');
            key = parts[0];
            flag = parts[1];
        }

        // -------- TIME HANDLING --------
        if (
            key === 'cooldown' ||
            key.includes('@duration') ||
            key === 'drone_recharge_seconds@value'
        ) {
            const raw = Number(val);
            if (isNaN(raw)) return '-';
            return raw < 0
                ? '-' + formatTime(Math.abs(raw))
                : formatTime(raw);
        }

        // -------- FLAGS --------
        if (flag === 'power') {const prev = context.prevLvl?.power || 0;const curr = Number(lvl?.power) || 0;const delta = curr - prev;return delta !== 0 ? Helpers.formatShort(delta) : '-';}
        if (flag === 'whole') return Math.round(Number(val)).toLocaleString();
        if (flag === 'whole2') return Helpers.formatShort(Number(val));
        if (flag === 'whole2h') {return Helpers.formatShort(Number(val)) + '/h';}
        if (flag === 'whole3') {const n = Number(val);if (isNaN(n)) return '-';return (Math.round(n) * 60).toLocaleString();}
        if (flag === 'percent') return Math.round(Number(val)) + '%';
        if (flag === 'percent2') {const num = Number(val);if (isNaN(num)) return '-';return (num * 100).toFixed(2) + '%';}
        if (flag === 'time') {const raw = Number(val);if (isNaN(raw)) return '-';return raw < 0 ? '-' + formatTime(Math.abs(raw)) : formatTime(raw);}
        if (flag === 'time2') {const raw = Number(val);if (isNaN(raw)) return '-';return raw < 0 ? '-' + formatTime(Math.abs(raw)) : formatTime(raw)}
        if (flag === 'requirements') {
            const reqs = lvl?.requirements;
            if (!Array.isArray(reqs) || reqs.length === 0) return '-';

            const list = reqs.map(r => {
                const key = String(r.target_subtype || '').toLowerCase();

                const name =
                    window.reverseKeyMap?.[key] ||
                    r.target_subtype ||
                    'Unknown';

                const level = r.level ?? '?';

                return `${name} LVL ${level}`;
            }).filter(Boolean);

            if (list.length === 1) return list[0];

            const first = list[0];
            const rest = list.slice(1).map(r => `<div>${r}</div>`).join('');

            return `
                <div class="req-cell">
                    ${first}
                    <span class="req-toggle" style="cursor:pointer;color:#4af;margin-left:5px;">▼</span>
                    <div class="req-hidden" style="display:none;">${rest}</div>
                </div>
            `;
        }

        return val;
    }
    function isEmptyLevel(lvl) {
    return (
        !lvl ||
        (
            typeof lvl === 'object' &&
            !Array.isArray(lvl) &&
            Object.keys(lvl).length === 0
        )
    );
}

    return {
        formatTime, formatShort, parseNumber, stripHtml, formatValue,isEmptyLevel
    };
})();
Helpers.lookup = (function(){
    function extractNumber(val) {
        if (val === null || val === undefined) return null;
        if (typeof val === 'number') return val;
        if (typeof val === 'string' && !isNaN(val)) return Number(val);
        if (typeof val === 'object') {
            for (const k in val) {
                const sub = extractNumber(val[k]);
                if (sub !== null && sub !== undefined) return sub;
            }
        }
        return null;
    }

    function extractFromEntry(entry, prefer) {
        let order;
        if (prefer === 'modifier') order = ['modifier','value','quantity','duration'];
        else if (prefer === 'value') order = ['value','modifier','quantity','duration'];
        else if (prefer === 'quantity') order = ['quantity','value','modifier','duration'];
        else if (prefer === 'duration') order = ['duration','quantity','value','modifier'];
        else order = ['quantity','value','modifier','duration'];

        if (entry && typeof entry === 'object') {
            for (const k of order) {
                if (entry[k] !== undefined && entry[k] !== null) {
                    const num = extractNumber(entry[k]);
                    if (num !== null && num !== undefined) return num;
                }
            }
        }
        return extractNumber(entry);
    }

    function getFromKnownArraysExact(lvl, key, prefer = 'value') {
        const containers = ['costs','stats','attributes','bonuses','modifiers','modifier','reward','buffs','currencies_per_hour','attributes','currencies_per_hour','currencies','units','units_a','items'];
        for (const name of containers) {
            const container = lvl[name];
            if (!container) continue;

            if (Array.isArray(container)) {
                const found = container.find(a => {
                    const sub = String(a?.subtype || '').toLowerCase();
                    const target = String(a?.target_subtype || '').toLowerCase();
                    return sub === key || target === key;
                });
                if (found) return extractFromEntry(found, prefer);
            } else if (typeof container === 'object') {
                if (Object.prototype.hasOwnProperty.call(container, key)) {
                    const v = container[key];
                    const val = extractFromEntry(v, prefer);
                    if (val !== null) return val;
                }
                for (const v of Object.values(container)) {

                    // nested arrays
                    if (Array.isArray(v)) {
                        const found = v.find(a => {
                            const sub = String(a?.subtype || '').toLowerCase();
                            const target = String(a?.target_subtype || '').toLowerCase();
                            return sub === key || target === key;
                        });

                        if (found) {
                            const val = extractFromEntry(found, prefer);
                            if (val !== null) return val;
                        }
                    }

                    if (v && typeof v === 'object') {
                        const sub = String(v.subtype || '').toLowerCase();
                        const target = String(v.target_subtype || '').toLowerCase();

                        if (sub === key || target === key) {
                            const val = extractFromEntry(v, prefer);
                            if (val !== null) return val;
                        }
                    }
                }
            }
        }
        return null;
    }

    // unified lookup
    function lookupValue(lvl, dataKey) {
        const raw = (dataKey || '').toLowerCase();

        // 🔥 strip format flag FIRST
        const keyWithoutFlag = raw.split('!')[0];

        // then handle @prefer
        const parts = keyWithoutFlag.split('@');
        const baseKey = parts[0];
        const prefer = parts[1] || 'value';

        // direct field
        if (lvl && Object.prototype.hasOwnProperty.call(lvl, baseKey)) {
            const rawVal = lvl[baseKey];
            if (typeof rawVal === 'object') return extractFromEntry(rawVal, prefer);
            if (typeof rawVal === 'string' && !isNaN(rawVal)) return Number(rawVal);
            return rawVal;
        }

        // nested search
        return getFromKnownArraysExact(lvl, baseKey, prefer);
    }

    return { lookupValue};
})();
