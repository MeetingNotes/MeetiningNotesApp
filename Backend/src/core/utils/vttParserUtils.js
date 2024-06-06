function parseVTT(content) {
    const lines = content.split('\n').map(line => line.trim());
    if (!lines[0].startsWith('WEBVTT')) {
        return false;
    }

    let i = 1;
    while (i < lines.length) {
        if (lines[i] === '') {
            i++;
            continue;
        }

        if (lines[i].includes('-') && !lines[i].includes('-->')) {
            i++;
        }

        if (i < lines.length && lines[i].includes('-->')) {
            if (!/\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}/.test(lines[i])) {
                return false;
            }
            i++;
        } else if (lines[i] !== '') {
            return false;
        }

        while (i < lines.length && lines[i] !== '') {
            i++; 
        }
    }

    return true;
}
module.exports = { parseVTT };
