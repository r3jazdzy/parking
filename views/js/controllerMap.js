app.controller('MapCtrl', ['$scope', 'ParkPosition', function ($scope, ParkPosition) {

	var myCenter=new google.maps.LatLng(48.1119800,-1.6742900);
	var mapProp;

	function initialize() {
	mapProp = {
		center:myCenter,
		zoom:10,
		mapTypeId:google.maps.MapTypeId.ROADMAP
	};

	var map=new google.maps.Map(document.getElementById("googleMap"), mapProp);

	//set informations of parkings around the world !
	ParkPosition.query().
	$promise.then(function(data) {

		console.log(data.length);
		for (var i=0; i< data.length; i++) {

			var marker=new google.maps.Marker({
				position:new google.maps.LatLng(data[i].geometry.coordinates[0],data[i].geometry.coordinates[1]),
			});

			marker.setMap(map);

			var infowindow = new google.maps.InfoWindow({
				content: data[i].id+" X places libres"
			});

			infowindow.open(map,marker);
			console.log(data[i].id +" coordinates : " +data[i].geometry.coordinates);
		}

	});
	//end set

	}
	function erreur(err) {
		console.log("error !!!");
		console.warn('ERROR(' + err.code + '): ' + err.message);
	}
/*
	if (navigator.geolocation){
		console.log("map geoloc available");
		var watchId = navigator.geolocation.watchPosition(successCallback,erreur,{enableHighAccuracy: true});
		console.log("wachtId : ",watchId);
	}
	else
		alert("Votre navigateur ne prend pas en compte la géolocalisation HTML5");
*/
	function successCallback(position){
		console.log("map successCallback");
		map.panTo(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
			map: map
		});
	}

	//google.maps.event.addDomListener(window, 'load', initialize);
	$scope.$on('$routeChangeSuccess', initialize);

}]);
