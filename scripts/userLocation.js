if (navigator.geolocation) {
	var id=navigator.geolocation.watchPosition(procesarPosicion, fallo);
} else {
	window.alert("Tu navegador no permite la geolocalización.");
}

function procesarPosicion(position) {
	var ltd=position.coords.latitude;
	var lng=position.coords.longitude;

	var exactitud=position.coords.accuracy;
	var timestamp=position.timestamp;
	L.mapbox.accessToken = config.SECRET_API_KEY_MAPBOX;

	var bounds = calcBounds(ltd, lng);

	var map = L.mapbox.map('map').setView([ltd, lng], 9).addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11'));
	L.rectangle(bounds, {color: "#ff7800", weight: 1}).addTo(map);
	map.fitBounds(bounds);
}

function fallo() {
	window.alert("No es posible geolocalizarte. Comprueba que tienes activada esa posibilidad.");
}

function calcBounds(ltd, lng) {
	return [calcNortWesthCorner(ltd, lng), calcSouthEastCorner(ltd, lng)];
}

function calcNortWesthCorner(ltd, lng) {	
    var new_ltd = ltd + (radius / r_earth) * (180 / pi);
	var new_lng = lng - (radius / r_earth) * (180 / pi) / Math.cos(new_ltd * pi / 180);
	return [new_ltd, new_lng];
}

function calcSouthEastCorner(ltd, lng) {
	var new_ltd = ltd - (radius / r_earth) * (180 / pi);
	var new_lng = lng + (radius / r_earth) * (180 / pi) / Math.cos(new_ltd * pi / 180);
	return [new_ltd, new_lng];
}