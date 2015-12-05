angular.module('ParkServices', ['ngResource'])
  .factory('Parking', ['$resource',
  function($resource){
    return $resource('/parking', null);
  }])
  .factory('MaxParking', function($resource) {
      return $resource(
        "/parking/:Id",
        {Id: "@Id" },
        {
            "reviews": {'method': 'GET', 'params': {'reviews_only': "true"}, isArray: true}
        }
    );
  })
  .factory('LastParking', ['$resource',
  function($resource){
    return $resource('/parking/last', null);
  }])
  .factory('ParkPosition', ['$resource',
    function($resource) {
      return $resource('/parking/information', {}, {
        query: {method:'GET', params:{status:''}, isArray:true}
	});
  }]);
