const scl = 7;
const mymap = L.map('checkinMap').setView([0, 0], 1);
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

// Adding opensea tileurl to mymap
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);

getData();
async function getData() {
    const response = await fetch('/api');
    const data = await response.json();
    let txt;
    for (item of data) {

        const marker = L.marker([item.lat, item.lon]).addTo(mymap)
        txt = `Weather @ ${item.lat.toFixed(2)}&deg;, ${item.lon.toFixed(2)}&deg;
        is '${item.weather.condition.text.toLowerCase()}'.</br>
        Current temperature = ${item.weather.temp_c} °C.</br>`;

        if (item.air.value < 0) {
            txt += ' No air quality reading.'
        } else {
            txt += `The air quality is currently ${item.air.value} ${item.air.unit}.`
        }


        marker.bindPopup(txt);
        // const root = document.createElement('p');
        // const itm = document.createElement('div');
        // const geo = document.createElement('div');
        // const date = document.createElement('div');
        // const img = document.createElement('img');

        // geo.textContent = `${item.lat}°, ${item.lon}°`;
        // itm.textContent = `item: ${item.item}`;
        // const dateString = new Date(item.timestamp)
        // date.textContent = dateString;
        // img.src = item.image64;
        // img.alt = "Get some fuckin glasses blind cunt!"

        // root.append(geo, itm, date, img);
        // document.body.append(root)
    }
}




