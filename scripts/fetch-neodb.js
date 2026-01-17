import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// const dotenv = await import('dotenv');
// dotenv.config();

// Simple .env parser to avoid npm install issues
function loadEnv() {
    try {
        const envPath = path.join(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf-8');
            content.split('\n').forEach(line => {
                const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/);
                if (match) {
                    const key = match[1];
                    let value = match[2] || '';
                    // Remove quotes if present
                    if (value.startsWith('"') && value.endsWith('"')) {
                        value = value.slice(1, -1);
                    }
                    if (!process.env[key]) {
                        process.env[key] = value;
                    }
                }
            });
            console.log('Loaded .env file');
        }
    } catch (e) {
        console.warn('Failed to load .env file:', e.message);
    }
}

loadEnv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const NEODB_API_BASE = 'https://neodb.social/api';
const OUTPUT_FILE = path.join(__dirname, '../src/data/neodb.json');

// Get token from environment variable
const TOKEN = process.env.NEODB_ACCESS_TOKEN;

if (!TOKEN) {
    console.warn('Warning: NEODB_ACCESS_TOKEN not found in environment variables.');
    console.warn('Skipping NeoDB sync. Using existing data if available.');
    process.exit(0);
}

// Fetch all shelf types for each category
// Shelf types: 'wishlist' (想看), 'progress' (在看), 'complete' (看过), 'dropped' (搁置)
const SHELF_TYPES = ['complete', 'progress']; // Now fetching both 'complete' and 'progress'
const CATEGORIES = ['book', 'movie', 'tv', 'game']; // Added 'tv' for TV shows/series

async function fetchCategory(category) {
    console.log(`Fetching ${category}...`);
    let allItems = [];
    
    // We need to fetch for each shelf type if we want everything, but user likely wants 'complete'
    // Let's iterate over shelf types if needed, but for now just 'complete'
    for (const shelfType of SHELF_TYPES) {
        let page = 1;
        let hasNext = true;
        const MAX_PAGES = 3; 

        while (hasNext && page <= MAX_PAGES) {
            try {
                // Correct endpoint: /me/shelf/{shelf_type}?category={category}
                const url = `${NEODB_API_BASE}/me/shelf/${shelfType}?category=${category}&page=${page}`;
                console.log(`Requesting: ${url}`);
                
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${TOKEN}`,
                        'Accept': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
                }

                const data = await response.json();
                
                if (data.data && Array.isArray(data.data)) {
                    // Add shelf type info to items
                    const itemsWithShelfType = data.data.map(item => ({
                        ...item,
                        shelf_type: shelfType // Add 'complete' or 'progress' to the item data
                    }));
                    allItems = allItems.concat(itemsWithShelfType);
                }
                
                if (data.pages > page) {
                    page++;
                } else {
                    hasNext = false;
                }
                
                await new Promise(resolve => setTimeout(resolve, 500));
                
            } catch (error) {
                console.error(`Error fetching ${category} (${shelfType}) page ${page}:`, error.message);
                hasNext = false; 
            }
        }
    }
    
    console.log(`Fetched ${allItems.length} items for ${category}`);
    return allItems;
}

async function main() {
    const result = {};

    for (const category of CATEGORIES) {
        result[category] = await fetchCategory(category);
    }

    // Ensure directory exists
    const dir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
    console.log(`Successfully wrote NeoDB data to ${OUTPUT_FILE}`);
}

main().catch(console.error);
