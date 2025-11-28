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
        if (typeof val === 'number') return val;
        if (!val) return 0;
        val = val.toString().trim().toUpperCase();
        let multiplier = 1;
        if (val.endsWith('K')) { multiplier = 1e3; val = val.slice(0,-1); }
        else if (val.endsWith('M')) { multiplier = 1e6; val = val.slice(0,-1); }
        else if (val.endsWith('B')) { multiplier = 1e9; val = val.slice(0,-1); }
        return (parseFloat(val) || 0) * multiplier;
    }

    const stripHtml = s => (s||"").toString().replace(/<[^>]*>/g,'').replace(/[%❓]/g,'').trim();

    return {
        formatTime, formatShort, parseNumber, stripHtml
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
        const containers = ['costs','stats','attributes','bonuses','modifiers','modifier','reward','buffs'];
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
        const rawKey = (dataKey || '').toLowerCase();
        const parts = rawKey.split('@');
        const baseKey = parts[0];
        const prefer = parts[1] || 'value';

        // direct field
        if (lvl && Object.prototype.hasOwnProperty.call(lvl, baseKey)) {
            const raw = lvl[baseKey];
            if (typeof raw === 'object') return extractFromEntry(raw, prefer);
            if (typeof raw === 'string' && !isNaN(raw)) return Number(raw);
            return raw;
        }

        // nested search
        return getFromKnownArraysExact(lvl, baseKey, prefer);
    }

    return { lookupValue };
})();
