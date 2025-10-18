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
