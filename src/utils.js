import * as config from '@setup';
import newUniqueId from 'locally-unique-id-generator';

export async function extractLinks(markdown, mdData) {
    const regex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1[^>]*?>(.*?)<\/a>/g;
    const links = [];

    let match;
    while ((match = regex.exec(markdown))) {
        if (match[2].includes("http")) {
            continue;
        } else {
            const label = match[3];
            const url = match[2];
            const id = url.split("/")[1];

            links.push({
                label, id,
                url
            });
        }
    }


    const itemUrls = links.filter(link => link.url.includes("item/")).map(link => link.id);
    const setUrls = links.filter(link => link.url.includes("set/")).map(link => link.id);
    const mediaUrls = links.filter(link => link.url.includes("media/")).map(link => link.id);


    const parseItems = [
        ...getItemsFromDbById(itemUrls, mdData, 'items'),
        ...getItemsFromDbById(mediaUrls, mdData, 'media'),
        ...getItemsFromDbById(setUrls, mdData, 'sets')
    ];



    for (let i = 0; i < parseItems.length; i++) {
        const link = links.find(d => parseItems[i]["@id"].includes(d.id));
        const json = parseItems[i];

        if (link) {
            link.uniqueId = newUniqueId();
            link.data = json;
        }
    }

    return links;
}

function getItemsFromDbById(ids, mdData, type) {
    const baseApiUrl = config.api;

    return mdData.filter(item => {
        const id = item["@id"];
        const idWithoutBaseUrl = id.split('/').pop();

        return ids.includes(idWithoutBaseUrl);
    }).map(item => {
        item["@id"] = item["@id"].replace(/\/items\//, '/resources/').replace(/\/media\//, '/resources/').replace(/\/item_sets\//, '/resources/');
        return item;
    });
}

export async function createTriplets(data) {
    let allTriplets = [];

    for (let i = 0; i < data.length; i++) {
        if (data[i].data) {
            let jsonLD = data[i].data;
            let set = data[i].set || null;
            let triplets = parseJSONLD(jsonLD, set);
            allTriplets = [...allTriplets, ...triplets];
        }
    }

    const graph = {
        nodes: allTriplets.reduce((acc, curr) => {
            if (!acc.find((n) => n.id === curr.source)) {
                acc.push({ id: curr.source, title: curr.title });
            }
            if (!acc.find((n) => n.id === curr.target)) {
                acc.push({ id: curr.target, title: curr.title });
            }
            return acc;
        }, []),
        links: allTriplets,
    };

    return { ...graph };
}

export function parseJSONLD(jsonLD, set) {
    let triplets = [];
    let source = jsonLD["@id"];


    if (set) {
        triplets.push({
            source: set["@id"],
            target: source,
            img: jsonLD?.thumbnail_display_urls?.large,
            title: jsonLD["o:title"],
        });
    }

    let parentKey;
    let reverse = false;

    const regex = /\b[a-zA-Z]+\d+[a-zA-Z]*\s/;

    const parseRecursive = function (obj) {
        for (let key in obj) {
            if (key === "@id" && (obj["o:title"] || obj.display_title || reverse)) {
                let target = obj["@id"];


                target = target.replace(/\/items\//, '/resources/').replace(/\/media\//, '/resources/').replace(/\/item_sets\//, '/resources/');

                const title = obj["o:title"] || obj.display_title;
                const img = obj?.thumbnail_url || obj?.thumbnail_display_urls?.large;

                let property = obj["property_label"]?.replace("_", " ")?.replace(regex, '') || parentKey?.replace(regex, '');

                const exists = triplets.some(triplet => triplet.source === source && triplet.target === target);

                if (!exists) {
                    triplets.push({
                        source: source,
                        target: target,
                        title,
                        img,
                        property,
                        reverse,
                    });
                }
            } else if (typeof obj[key] === "object") {
                if (isNaN(key)) {
                    const parts = key?.split(":");
                    const label = parts[1]?.split("_")?.join(" ");
                    parentKey = label;

                    if (key === "@reverse") {
                        reverse = true;
                    }
                }
                parseRecursive(obj[key]);
            }
        }
    };

    parseRecursive(jsonLD);
    return triplets;
}
