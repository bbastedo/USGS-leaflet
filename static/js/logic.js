// store query
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"

//Use d3 to pull
d3.json(queryUrl, function(data) {
  // Create geoJSON
  var earthquakes = L.geoJSON(data.features, {
    onEachFeature : addpopups,
    pointToLayer : addcircle
  });
  createMap(earthquakes);
});

// Addpopups and Add Circle Functions
function addpopups(feature, layer) {
  return layer.bindPopup(`<h3> Location: ${feature.properties.place} </h3> <hr> <p> Magnitude: ${feature.properties.mag} </p> <hr> <p> ${Date(feature.properties.time)} </p>`);
}

function addcircle (feature, latlng) {
    var color = "";
    if (feature.properties.mag > 4.5){
      color = "Greenery";
    }
    else if (feature.properties.mag > 3.5){
      color = "Emerald";
    }
    else if (feature.properties.mag > 2.5){
      color = "Turquoise";
    }
    else {
      color = "Rose Quartz";
    }
    return new L.circle(latlng,{
      fillOpacity: 0.45,
      color: color,
      fillColor: color,
      radius: feature.properties.mag * 10000
    })
}

//plot markers
function createMap(earthquakes) {
  // Define satellite layer
  var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });
// Define outdoor layer
  var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });
  // basemap
  var baseMaps = {
    "Satellite_Map": satellite,
    "Outdoors_Map": outdoors
  };
  // Overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };
  // map properties
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4,
    layers: [outdoors, earthquakes]
  });
  // Switch between layers
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}