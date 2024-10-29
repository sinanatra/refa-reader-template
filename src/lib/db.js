import { writable } from 'svelte/store';

export const db = writable([]);

export async function loadDb() {
    try {
        const response = await fetch('/db.json');
        if (!response.ok) {
            throw new Error(`Failed to load db.json: ${response.statusText}`);
        }
        const data = await response.json();
        db.set(data.map((d) => {
            return {
                ...d,
                // only for omeka
                "@id": d["@id"]
                    ?.replace(/\/items\//, '/resources/')
                    ?.replace(/\/media\//, '/resources/')
                    ?.replace(/\/item_sets\//, '/resources/')
            };
        }));


    } catch (error) {
        console.error('Error loading db.json:', error);
    }
}
