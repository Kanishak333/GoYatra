const https = require('https');

function search(query) {
  return new Promise((resolve) => {
    https.get(`https://unsplash.com/napi/search/photos?query=${query}&per_page=1`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.results[0].id);
        } catch(e) { resolve(null); }
      });
    });
  });
}

async function run() {
  console.log("Hatchback:", await search('hatchback'));
  console.log("Sedan:", await search('sedan'));
  console.log("Luxury Car:", await search('luxury car'));
  console.log("SUV:", await search('suv'));
  console.log("Delivery Van:", await search('delivery van'));
  console.log("Auto Rickshaw:", await search('auto rickshaw'));
}
run();
