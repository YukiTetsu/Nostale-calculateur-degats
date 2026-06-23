import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Proxy calculation endpoint
app.post('/api/calculate', async (req, res) => {
    try {
        const { cookies, token } = await getSession();
        
        // Flatten nested objects to matching post params
        const bodyParams = new URLSearchParams();
        bodyParams.set('_token', token);

        // Utility to convert nested JSON keys to flat keys e.g., specialist_points[1]
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
        res.json(data);
    } catch (error) {
        console.error("Calculation API proxy error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Serve static React files in production
app.use(express.static(path.join(__dirname, 'dist')));
app.get('/{*path}', (req, res) => {
    // Check if dist folder exists, otherwise return a message
    res.sendFile(path.join(__dirname, 'dist', 'index.html'), (err) => {
        if (err) {
            res.status(200).send("NosTale Damage Calculator API is running. Build frontend files to view GUI.");
        }
    });
});

app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});
