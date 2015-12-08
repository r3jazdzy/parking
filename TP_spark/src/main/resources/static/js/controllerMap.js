app.controller('MapCtrl', ['$scope', 'ParkPosition', 'LastParking', function ($scope, ParkPosition, LastParking) {

    var myCenter = new google.maps.LatLng(48.1119800, -1.6742900);
    var mapProp;

    function initialize() {
        mapProp = {
            center: myCenter,
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

        //set informations of parkings around the world !
        ParkPosition.query().
        $promise.then(function (data) {


            LastParking.query().
            $promise.then(function (lastParkingData) {

                for (var i = 0; i < data.length; i++) {
                    var value = data[i];
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(value.geometry.coordinates[0], value.geometry.coordinates[1]),
                    });

                    marker.setMap(map);

                    var free = "X";
                    for (var j = 0; j < lastParkingData.length; j++) {
                        if (lastParkingData[j].name == value.name)
                            free = lastParkingData[j].free;
                    }

                    var infowindow = new google.maps.InfoWindow({
                        content: value.name + " : " + free + " places libres"
                    });

                    infowindow.open(map, marker);
                }
            });
        });
        //end set

    }

    function erreur(err) {
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
    function successCallback(position) {
        map.panTo(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
            map: map
        });
    }

    //google.maps.event.addDomListener(window, 'load', initialize);
    $scope.$on('$routeChangeSuccess', initialize);

}]);
