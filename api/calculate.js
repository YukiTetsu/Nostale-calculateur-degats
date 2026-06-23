let cachedCookies = null;
let cachedCsrfToken = null;
let cacheExpiry = 0;

async function getSession() {
    const now = Date.now();
    if (cachedCookies && cachedCsrfToken && now < cacheExpiry) {
        return { cookies: cachedCookies, token: cachedCsrfToken };
    }
    
    console.log("Session cache expired or empty. Fetching new session...");
    const response = await fetch('https://nosapki.com/fr/calculators/dmg_pve', {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });
    
    const setCookieHeaders = response.headers.getSetCookie();
    const cookieHeader = setCookieHeaders.map(c => c.split(';')[0]).join('; ');
    
    const html = await response.text();
    const csrfTokenMatch = html.match(/name="csrf-token" content="([^"]+)"/);
    if (!csrfTokenMatch) {
        throw new Error("Could not find csrf-token in HTML");
    }
    
    cachedCookies = cookieHeader;
    cachedCsrfToken = csrfTokenMatch[1];
    cacheExpiry = now + 10 * 60 * 1000; // 10 minutes cache
    
    console.log("Successfully established new session with NosApki.");
    return { cookies: cachedCookies, token: cachedCsrfToken };
}

export default async function handler(req, res) {
    // Add CORS headers for safety
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { cookies, token } = await getSession();
        
        const bodyParams = new URLSearchParams();
        bodyParams.set('_token', token);

        const flattenObject = (obj, prefix = '') => {
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    const value = obj[key];
                    const formKey = prefix ? `${prefix}[${key}]` : key;
                    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
                        flattenObject(value, formKey);
                    } else if (Array.isArray(value)) {
                        value.forEach((val, index) => {
                            if (val !== null && typeof val === 'object') {
                                flattenObject(val, `${formKey}[${index}]`);
                            } else if (val !== undefined && val !== null) {
                                bodyParams.append(`${formKey}[${index}]`, val);
                            }
                        });
                    } else if (value !== undefined && value !== null) {
                        bodyParams.append(formKey, value);
                    }
                }
            }
        };

        flattenObject(req.body);

        console.log(`Forwarding calculation request (monster_id: ${req.body.monster_id || 'none'}, level: ${req.body.level || 'none'})...`);

        const response = await fetch('https://nosapki.com/fr/calculators/dmg_pve/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'X-CSRF-TOKEN': token,
                'Cookie': cookies,
                'Referer': 'https://nosapki.com/fr/calculators/dmg_pve',
                'Origin': 'https://nosapki.com'
            },
            body: bodyParams.toString()
        });
        
        if (!response.ok) {
            const errText = await response.text();
            console.error("NosApki API error:", response.status, errText);
            return res.status(response.status).json({ error: `NosApki API error: ${response.status}` });
        }
        
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("Calculation API proxy error:", error);
        res.status(500).json({ error: error.message });
    }
}
