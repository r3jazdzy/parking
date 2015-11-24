angular.module('BeerServices', ['ngResource'])
  .factory('Beer', ['$resource',
    function($resource) {
      return $resource('api/beers/:beerId', {}, {
        query: {method:'GET', params:{beerId:''}, isArray:true}
      });
    }]);
