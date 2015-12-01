angular.module('ParkServices', ['ngResource'])
  .factory('Park', ['$resource',
    function($resource) {
      return $resource('http://192.168.200.215:4567/parking', {}, {
        query: {method:'GET', params:{status:''}, isArray:true}
      });
    }]);
