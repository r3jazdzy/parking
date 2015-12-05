var $server = 'http://192.168.200.215:4567';

angular.module('ParkServices', ['ngResource'])
  .factory('Parking', ['$resource',
  function($resource){
    return $resource('http://192.168.200.215:4567/parking', null);
  }])
  .factory('MaxParking', function($resource) {
    //  return $resource('http://192.168.200.215:4567/parking/max', null);
      return $resource(
        $server + "/parking/:Id",
        {Id: "@Id" },
        {
            "reviews": {'method': 'GET', 'params': {'reviews_only': "true"}, isArray: true}
        }
    );
  })
  .factory('LastParking', ['$resource',
  function($resource){
    return $resource('http://192.168.200.215:4567/parking/last', null);
  }])
  .factory('ParkPosition', ['$resource',
    function($resource) {
      return $resource('http://192.168.200.215:4567/parkingInformation', {}, {
        query: {method:'GET', params:{status:''}, isArray:true}
	});
  }]);
