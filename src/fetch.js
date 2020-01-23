const http = require('http');

function fetch(url) {
    return new Promise((resolve, reject) => {
        http.get(url, res => { 
            if (res.statusCode >= 400)
                return reject(new Error(`Request Failed.\nStatus Code: ${res.statusCode}`));
            if (res.statusCode >= 300)
                return resolve(fetch(res.headers['location']));
            
            const buf = [];
            res.on('data', chunk => buf.push(chunk));
            res.on('end', () => resolve(Buffer.concat(buf)));
            res.on('error', reject);
        }).on('error', reject);
    });
}

module.exports = fetch;