app.controller('MapCtrl', ['$scope', function ($scope) {

	var myCenter=new google.maps.LatLng(51.508742,-0.120850);
  var mapProp;

  function initialize() {
    mapProp = {
      center:myCenter,
      zoom:5,
      mapTypeId:google.maps.MapTypeId.ROADMAP
    };
    var map=new google.maps.Map(document.getElementById("googleMap"), mapProp);

    //set informations of parkings around the world !
    var marker=new google.maps.Marker({
      position:myCenter,
    });

    marker.setMap(map);

    var infowindow = new google.maps.InfoWindow({
      content:"Hello World!"
    });

    infowindow.open(map,marker);
    //end set

  }
  function erreur(err) {
    console.log("error !!!");
    console.warn('ERROR(' + err.code + '): ' + err.message);
  }

  if (navigator.geolocation){
    console.log("map geoloc available");
    var watchId = navigator.geolocation.watchPosition(successCallback,erreur,{enableHighAccuracy: true});
    console.log("wachtId : ",watchId);
  }
  else
    alert("Votre navigateur ne prend pas en compte la géolocalisation HTML5");    
   
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