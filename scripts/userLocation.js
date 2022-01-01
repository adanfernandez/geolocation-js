if (navigator.geolocation) {
	var id=navigator.geolocation.watchPosition(procesarPosicion, fallo);
} else {
	window.alert("Tu navegador no permite la geolocalización.");
}

function procesarPosicion(position) {
	var latitud=position.coords.latitude;
	var longitud=position.coords.longitude;
	var exactitud=position.coords.accuracy;
	var timestamp=position.timestamp;

	var panel=document.getElementById("panel");

	var mensaje="<p>"+latitud+", "+longitud+" (Error: "+exactitud+"m)<br>";
	
	mensaje+=timestamp+"</p>";

	panel.innerHTML+=mensaje;
}

function fallo() {
	window.alert("No es posible geolocalizarte. Comprueba que tienes activada esa posibilidad.");
}
