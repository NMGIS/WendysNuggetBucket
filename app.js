require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/GeoJSONLayer",
    "esri/symbols/PictureMarkerSymbol",
    "esri/renderers/SimpleRenderer",
    "esri/PopupTemplate",
    "esri/geometry/Extent"
], function (Map, MapView, GeoJSONLayer, PictureMarkerSymbol, SimpleRenderer, PopupTemplate, Extent) {

    // Create a map with a basemap
    var map = new Map({
        basemap: "osm"
    });

    // Create a view and set the map to it
    var view = new MapView({
        container: "viewDiv",
        map: map,
        center: [-98.5795, 39.8283],
        zoom: 5.5
    });

    // Store the initial extent
    var initialExtent;

    view.when(function() {
        initialExtent = view.extent.clone();
    });

    // Define a PictureMarkerSymbol using your custom icon
    var pictureMarkerSymbol = new PictureMarkerSymbol({
        url: "icon.png",
        width: "30px",
        height: "33px"
    });

    // Create a renderer using the PictureMarkerSymbol
    var renderer = new SimpleRenderer({
        symbol: pictureMarkerSymbol
    });

    // Define a PopupTemplate for the features
    var popupTemplate = new PopupTemplate({
        title: "{city}, {state}", // Display city and state as the title
        content: [
            {
                type: "fields",
                fieldInfos: [
                    { fieldName: "id", label: "ID" },
                    { fieldName: "state", label: "State" },
                    { fieldName: "city", label: "City" },
                    { fieldName: "street1", label: "Street Address" },
                    { fieldName: "street2", label: "Additional Address" },
                    { fieldName: "country", label: "Country" }
                ]
            }
        ]
    });

    // Add a GeoJSON layer
    var geojsonLayer = new GeoJSONLayer({
        url: "map.geojson",
        renderer: renderer, // Apply the renderer to the GeoJSON layer
        popupTemplate: popupTemplate // Set the popup template for the GeoJSON layer
    });

    map.add(geojsonLayer);

    // Handle dropdown change event
    document.getElementById('stateDropdown').addEventListener('change', function(event) {
        var selectedState = event.target.value;
        if (selectedState === "ALL") {
            geojsonLayer.definitionExpression = null; // Show all features
            view.goTo(initialExtent); // Go to the initial extent
        } else {
            geojsonLayer.definitionExpression = "state = '" + selectedState + "'"; // Filter by state
            geojsonLayer.queryExtent().then(function(result) {
                view.goTo(result.extent);
            });
        }
    });

    document.getElementById('infoIcon').addEventListener('click', function() {
        var disclaimer = document.getElementById('disclaimer');
        if (disclaimer.classList.contains('hidden')) {
            disclaimer.classList.remove('hidden');
            disclaimer.style.display = 'block';
        } else {
            disclaimer.classList.add('hidden');
            disclaimer.style.display = 'none';
        }
    });

    document.getElementById('infoIcon').addEventListener('click', function() {
        var disclaimer = document.getElementById('disclaimer');
        disclaimer.classList.remove('hidden');
        disclaimer.style.display = 'block';
    });
    
    document.getElementById('closeBtn').addEventListener('click', function() {
        var disclaimer = document.getElementById('disclaimer');
        disclaimer.classList.add('hidden');
        disclaimer.style.display = 'none';
    });
    
    

});

