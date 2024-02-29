const map = L.map('map').setView([-24.80295269879563, 134.09082381891196], 4);
            
const tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    minZoom: 3,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
}).addTo(map);

function addMarkers(data) {
    for (let i = 0; i < data.length; i++) {
        var row = data[i];
        var marker = L.marker([row.lat, row.long]).addTo(map);
        var content = "<b>Project:</b> " + row.project + 
            "<br>" + 
            "<b>Code:</b> " + row.code +
            "<br>" + 
            "<b>Location:</b> " + row.site + ", " + row.country +
            "<br>" + 
            "<b>About:</b> " + row.comments 
        marker.bindPopup(content);
    }
}

Papa.parse('./map_data.csv', {
    download: true,
    header: true, 
    complete: function(results) {
        addMarkers(results.data);
    }
});