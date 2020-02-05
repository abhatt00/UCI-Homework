var queryUrl =  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
    console.log(data);
  });
// this makes the request for the data



function getColor(d) {
    return d > 6 ? '#800026' :
           d > 5 ? '#BD0026' :
           d > 4 ? '#E31A1C' :
           d > 3 ? '#FC4E2A' :
           d > 2 ? '#FD8D3C' :
           d > 1 ? '#9ebcda' :
           d > 0 ? '#2ca25f' :
                    '#1c9099';
}   

function createFeatures(earthquakeData) {

    

    function circleSize(mag) {
        if (mag==0) {
            return 1;
        }
        return mag*4;
    }
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p><hr><h3>" + feature.properties.mag + "</h3>");
    }
    function style(feature) {
        return {
            fillColor: getColor(feature.properties.mag),
            weight: 2,
            radius: circleSize(feature.properties.mag),
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }    
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng);
      },
      style: style
    });
  
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
  }

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


  var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        magnitudes = [0, 1, 2, 3, 4, 5, 6],
        labels = ["1c9099", "2ca25f", "9ebcda", "FD8D3C", "FC4E2A", "E31A1C", "BD0026"];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < magnitudes.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(magnitudes[i] + 1) + '"></i> ' +
            magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);


}


