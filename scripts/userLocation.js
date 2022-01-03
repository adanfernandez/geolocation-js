if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(placeMap, fallo);
	navigator.geolocation.watchPosition(monitorPosition, fallo);
} else {
	window.alert("Tu navegador no permite la geolocalización.");
}

var userMarker;
var map;
var treasure;
var exactitud;

function placeMap(position) {
	var ltd=position.coords.latitude;
	var lng=position.coords.longitude;
	exactitud=position.coords.accuracy;
	console.log(`Exactitud ->  ${exactitud}`);
	var timestamp=position.timestamp;

	L.mapbox.accessToken = config.SECRET_API_KEY_MAPBOX;
	
	var bounds = calcBounds(ltd, lng);
	map = L.mapbox.map('map').setView([ltd, lng], 9).addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11'));
	
	L.rectangle(bounds, {color: "#ff7800", weight: 1}).addTo(map);
	map.fitBounds(bounds);
	placeTreasure(bounds[0][0], bounds[0][1], map);
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

function placeTreasure(lat, lng, map) {
	const ltd_variation = Math.floor(Math.random() * side + 1) / 1000;
	const lng_variation = Math.floor(Math.random() * side + 1) / 1000;

	var new_ltd = lat- (ltd_variation / r_earth) * (180 / pi);
	var new_lng = lng + (lng_variation / r_earth) * (180 / pi) / Math.cos(new_ltd * pi / 180);

	treasure = [new_ltd, new_lng];
}

function monitorPosition(position) {
	var ltd=position.coords.latitude;
	var lng=position.coords.longitude;

	if(!userMarker)	{
		this.userMarker = L.marker([ltd, lng]).addTo(map);
		console.log(`Marker created -> [${ltd}, ${lng}]`);
	}
	else this.userMarker = modifyMarker(userMarker, ltd, lng);

	var distance = calclDistanceUserTreasure(this.userMarker.getLatLng().lat, this.userMarker.getLatLng().lng,
		this.treasure[0], this.treasure[1]);
	if(!isOver(distance)) {
		giveInstructions();
	} else {
		alert("Juego terminado. ¡Has encontrado el tesoro!");
	}
}


function modifyMarker(marker, ltd, lng) {
	console.log(`Marker modified -> [${ltd}, ${lng}]`);
    var newLatLng = new L.LatLng(ltd, lng);
    marker.setLatLng(newLatLng); 
	return marker;
}

function calclDistanceUserTreasure(lat1, lon1, lat2, lon2)  {
	var dLat = toRad(lat2-lat1);
	var dLon = toRad(lon2-lon1);
	var lat1 = toRad(lat1);
	var lat2 = toRad(lat2);

	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = r_earth * c * 1000;
	console.log(`Distance -> [${d}]`);
	return d;
}

// Converts numeric degrees to radians
function toRad(value)  {
	return value * Math.PI / 180;
}

function giveInstructions() {
	var cadena = "Head ";
	const userLat = this.userMarker.getLatLng().lat;
	const userLng = this.userMarker.getLatLng().lng
	const treasureLat = this.treasure[0];
	const treasureLng = this.treasure[1]

	if(userLat > treasureLat) {
		cadena += "north";
	} else {
		cadena += "south";
	}
	if(userLng > treasureLng) {
		cadena += "west";
	} else {
		cadena += "east";
	}
	document.getElementById("instructions").innerText = cadena;
}


function isOver(distance) {
	return distance - 50 <= 0;
}