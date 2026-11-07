const https = require('https');

const images = {
    "Smouha": "https://img-3.aqarmap.com.eg/new-aqarmap-media/search-thumb/2012/5fd08bad72958383856225.jpg",
    "Roshdy": "https://img-1.aqarmap.com.eg/new-aqarmap-media/search-thumb/2012/5fcf6beac1ff8106244961.jpg",
    "San Stefano": "https://img-2.aqarmap.com.eg/new-aqarmap-media/search-thumb/2012/5fd0818e1c850696344777.jpg",
    "Miami": "https://img-0.aqarmap.com.eg/new-aqarmap-media/search-thumb/2012/5fd0a5419542a225732701.jpg",
    "Kafr Abdo": "https://img-4.aqarmap.com.eg/new-aqarmap-media/search-thumb/2008/5f27d952a2a29092561011.jpg",
    "Sidi Gaber": "https://img-3.aqarmap.com.eg/new-aqarmap-media/search-thumb/2012/5fd09a14e469f819956364.jpg",
    "Lauran": "https://img-3.aqarmap.com.eg/new-aqarmap-media/search-thumb/2012/5fd0a1769047f057873505.jpg",
    "Victoria": "https://img-2.aqarmap.com.eg/new-aqarmap-media/search-thumb/2012/5fd09dc29092c588111077.jpg",
    "Sidi Bishr": "https://img-4.aqarmap.com.eg/new-aqarmap-media/search-thumb/2012/5fd08da209ae5246429635.jpg",
    "Borg El Arab": "https://img-1.aqarmap.com.eg/new-aqarmap-media/search-thumb/2012/5fcf666ccb547402713003.jpeg",
    "Camp Cesar": "https://img-3.aqarmap.com.eg/new-aqarmap-media/search-thumb/2012/5fd09e8d0d6c5581952476.jpg",
    "Glim": "https://img-1.aqarmap.com.eg/new-aqarmap-media/search-thumb/2012/5fcf6a9ea6d0c606464967.jpg",
    "El Mandara": "https://img-0.aqarmap.com.eg/new-aqarmap-media/search-thumb/2101/600d3afb3b634001763018.jpg",
    "El Asafra": "https://img-2.aqarmap.com.eg/new-aqarmap-media/search-thumb/2012/5fcf5dc0739aa322920808.jpg",
    "Moharram Bey": "https://img-3.aqarmap.com.eg/new-aqarmap-media/search-thumb/2012/5fcf297621cca104490050.jpeg",
    "Ibrahimia": "https://img-0.aqarmap.com.eg/new-aqarmap-media/search-thumb/2012/5fcf417c5d36b405455939.jpg",
    "Fleming": "https://img-4.aqarmap.com.eg/new-aqarmap-media/search-thumb/2012/5fd09affc5740915860212.jpg",
    "Stanley": "https://img-4.aqarmap.com.eg/new-aqarmap-media/search-thumb/2012/5fd089c2ad462493683764.jpg",
    "Bolekly": "https://img-4.aqarmap.com.eg/new-aqarmap-media/search-thumb/2012/5fcf691dc6e5d856515058.jpg",
    "Zezenia": "https://img-2.aqarmap.com.eg/new-aqarmap-media/search-thumb/2012/5fd07f149fed6824182759.jpg",
    "Bakoos": "https://img-2.aqarmap.com.eg/new-aqarmap-media/search-thumb/2101/600d3d7bae794072761788.jpg",
    "Ganaklis": "https://img-0.aqarmap.com.eg/new-aqarmap-media/search-thumb/2012/5fd0a7d2a7f7d448945552.jpg",
    "El Mamoura": "https://img-2.aqarmap.com.eg/new-aqarmap-media/search-thumb/2101/600d37eada002264766873.jpg",
    "Sporting": "https://img-2.aqarmap.com.eg/new-aqarmap-media/search-thumb/2012/5fd084bec66c1085949046.jpg",
    "Saba Basha": "https://img-4.aqarmap.com.eg/new-aqarmap-media/search-thumb/2012/5fd08065ebf3e055411256.jpg",
    "El Hadara": "https://img-0.aqarmap.com.eg/new-aqarmap-media/search-thumb/2012/5fcf580abcc3a678323444.jpg",
    "El Chatby": "https://img-0.aqarmap.com.eg/new-aqarmap-media/search-thumb/2012/5fcf5b59ed5e5944452504.jpg",
    "King Mariout": "https://img-1.aqarmap.com.eg/new-aqarmap-media/search-thumb/2012/5fd0a036e8277132762664.jpg",
    "Cleopatra": "https://img-2.aqarmap.com.eg/new-aqarmap-media/search-thumb/2012/5fd09f450d99c379224748.jpg",
    "Mansheya": "https://img-1.aqarmap.com.eg/new-aqarmap-media/search-thumb/2012/5fcf636788bee503073542.jpg",
    "El Montazah": "https://img-0.aqarmap.com.eg/new-aqarmap-media/search-thumb/2012/5fcf6049541e5723340436.jpg",
    "El Amreya": "https://img-3.aqarmap.com.eg/new-aqarmap-media/search-thumb/2012/5fd0a5fab98e3871434543.jpg",
    "Abu Talat": "https://img-2.aqarmap.com.eg/new-aqarmap-media/search-thumb/2012/5fcf3ecc283a1971012536.jpg",
    "New Miami": "https://img-2.aqarmap.com.eg/new-aqarmap-media/search-thumb/2008/5f27d79380bb6331309208.jpg",
    "Mahta El Raml": "https://img-0.aqarmap.com.eg/new-aqarmap-media/search-thumb/2012/5fd0a34a6096d912878787.jpg",
    "El Seyouf": "https://img-1.aqarmap.com.eg/new-aqarmap-media/search-thumb/2012/5fcf59bc6e45c510687627.jpg",
    "Abo Qir": "https://img-4.aqarmap.com.eg/new-aqarmap-media/search-thumb/2012/5fcf2e6fa0e41469557710.jpeg"
};

function check(name, url) {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            resolve({ name, url, status: res.statusCode });
        }).on('error', (e) => {
            resolve({ name, url, status: 500, error: e.message });
        });
    });
}

async function run() {
    const results = await Promise.all(Object.entries(images).map(([n, u]) => check(n, u)));
    results.forEach(r => {
        if (r.status !== 200) {
            console.log(`FAILED: ${r.name} - ${r.status} - ${r.url}`);
        } else {
            console.log(`OK: ${r.name}`);
        }
    });
}

run();
