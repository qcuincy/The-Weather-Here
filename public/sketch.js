function setup() {
    noCanvas();
    // Getting user location
    let lat, lon, weather, air;
    if ('geolocation' in navigator) {
        console.log('geolocation available');
        navigator.geolocation.getCurrentPosition(async position => {
            try{
                lat = position.coords.latitude;
                lon = position.coords.longitude;
                document.getElementById('latitude').textContent = lat.toFixed(2);
                document.getElementById('longitude').textContent = lon.toFixed(2);
                //const api_url = `https://api.tomorrow.io/v4/timelines?location=${lat},${lon}&fields=temperature&timesteps=1h&units=metric&apikey=XKrJHrR3hdRd0663P44dALsOCb5BioBR`
                const api_url = `weather/${lat},${lon}`;
                const fetch_response = await fetch(api_url);
                const json = await fetch_response.json();
                weather = json.weather.current;
                air = json.air_quality.results[0].measurements[0];
                document.getElementById('summary').textContent = weather.condition.text.toLowerCase();
                document.getElementById('temperature').textContent = weather.temp_c;
                document.getElementById('weather-image').src = weather.condition.icon;
                document.getElementById('aq').textContent = air.value;
                document.getElementById('aq-units').textContent = air.unit;
        }   catch(error) {
                console.log(error);
                air = { value: -1 };
                document.getElementById('aq').textContent = "NO READING";
            }

            const data = { lat, lon, weather, air };
            const options = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            };
            const button = document.getElementById('check-in');
            let db_response, db_json;
            button.addEventListener('click', async function() {
                db_response = await fetch('/api', options);
                db_json = await db_response.json();
                console.log(db_json)
            })
            
            
        });
    
    } else {
        lat = 0;
        lon = 0;
        console.log('geolocation not available');

    };
}