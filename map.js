const map = L.map('map').setView([-24.80295269879563, 134.09082381891196], 4);
            
const tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    minZoom: 3,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
}).addTo(map);

var customControl = L.Control.extend({
    options: {
        position: 'topright' 
    },

    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

        container.style.backgroundColor = 'white';
        container.style.padding = '5px';

        container.innerHTML = `
            <center><b>Projects</b></center>
            <form id="markerFilter">
                <label><input type="radio" name="markerGroup" value="ALL" checked>All</label><br>
                <label><input type="radio" name="markerGroup" value="BECH">BEACHES</label><br>
                <label><input type="radio" name="markerGroup" value="BHPH">BHPH</label><br>
                <label><input type="radio" name="markerGroup" value="CSPW">CSPW</label><br>
                <label><input type="radio" name="markerGroup" value="DFFC">DFFC</label><br>
                <label><input type="radio" name="markerGroup" value="FRFC">FRFC</label><br>
                <label><input type="radio" name="markerGroup" value="HCHB">HCHB</label><br>
                <label><input type="radio" name="markerGroup" value="ICOA">ICoAST</label><br>
                <label><input type="radio" name="markerGroup" value="MHEA">MHEA</label><br>
                <label><input type="radio" name="markerGroup" value="MPAL">MPAL</label><br>
                <label><input type="radio" name="markerGroup" value="NPGS">NPGS</label><br>
                <label><input type="radio" name="markerGroup" value="OZCZ">OZCZ</label><br>
                <label><input type="radio" name="markerGroup" value="PIMP">PIMP</label><br>
                <label><input type="radio" name="markerGroup" value="QWST">QWST</label><br>
                <label><input type="radio" name="markerGroup" value="RICC">RICC</label><br>
                <label><input type="radio" name="markerGroup" value="SOUG">SOUG</label><br>
                <label><input type="radio" name="markerGroup" value="TERN">TERN</label><br>
                <label><input type="radio" name="markerGroup" value="WSDS">WSD</label><br>
                <!-- Add more groups as needed -->
            </form>
        `;

        L.DomEvent.disableClickPropagation(container);

        return container;
    }
});

map.addControl(new customControl());

var allMarkers = [];

function addMarkers(data) {
    allMarkers = []; 
    for (let i = 0; i < data.length; i++) {
        var row = data[i];
        var marker = L.marker([row.lat, row.long]).addTo(map);
        marker.group = row.group; 
        var content = "<b>Project:</b> " + row.project + 
            "<br>" + 
            "<br>" + 
            "<b>Location:</b> " + row.site + ", " + row.country +
            "<br>" + 
            "<br>" + 
            "<b>About Project:</b> " + row.comments;
        marker.bindPopup(content);
        allMarkers.push(marker);
    }
}

function updateMarkerVisibility(selectedGroup) {
    for (var i = 0; i < allMarkers.length; i++) {
        if (selectedGroup === 'ALL' || allMarkers[i].group === selectedGroup) {
            allMarkers[i].setOpacity(1); 
        } else {
            allMarkers[i].setOpacity(0.2); 
        }
    }
}

document.getElementById('markerFilter').addEventListener('change', function(e) {
    updateMarkerVisibility(e.target.value);
});

Papa.parse('./map_data.csv', {
    download: true,
    header: true, 
    complete: function(results) {
        addMarkers(results.data);
    }
});