'use strict';

/* App Module */

var angularParking = angular.module('AngularParks', [
  'ParkingControllers',
  'ngRoute'
]);

angularParking.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/dashboard', {
        templateUrl: 'partials/dashboard.html',
        controller: 'DashboardCtrl'
      }).
      otherwise({
        redirectTo: '/dashboard'
      });
  }]);
