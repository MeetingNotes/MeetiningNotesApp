function parseVTT(content) {
    const lines = content.split('\n').map(line => line.trim());
    if (!lines[0].startsWith('WEBVTT')) {
        console.log('Invalid header:', lines[0]);
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
                console.log(`Invalid timestamp format at line ${i + 1}:`, lines[i]);
                return false;
            }
            i++;
        } else if (lines[i] !== '') {
            console.log(`Expected timestamp but found other text at line ${i + 1}:`, lines[i]);
            return false;
        }

        while (i < lines.length && lines[i] !== '') {
            i++; 
        }
    }

    console.log('VTT content is valid.');
    return true;
}
module.exports = { parseVTT };
