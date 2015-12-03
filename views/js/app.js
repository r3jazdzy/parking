'use strict';

/* App Module */

var angularParking = angular.module('AngularParks', [
  'ParkingControllers',
  'ParkServices',
  'ngRoute'
]);


angularParking.config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.
      when('/dashboard', {
        templateUrl: 'partials/dashboard.html',
        controller: 'DashboardCtrl'
      }).
      when('/occupation', {
        templateUrl: 'partials/chart.html',
        controller: 'OccupationCtrl'
      }).
      when('/maxParcks', {
        templateUrl: 'partials/chart.html',
        controller: 'ParksMaxCtrl'
      }).
      when('/average', {
        templateUrl: 'partials/chart.html',
        controller: 'AverageCtrl'
      }).
      when('/map', {
        templateUrl: 'partials/map.html',
        controller: 'MapCtrl'
      }).
      otherwise({
        redirectTo: '/dashboard'
      });
  }]);

/*
angularParking.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/dashboard', {
        templateUrl: 'partials/dashboard.html',
        controller: 'DashboardCtrl'
      }).
      when('/occupation', {
        templateUrl: 'partials/chart.html',
        controller: 'OccupationCtrl'
      }).
      when('/maxParcks', {
        templateUrl: 'partials/chart.html',
        controller: 'ParksMaxCtrl'
      }).
      when('/average', {
        templateUrl: 'partials/chart.html',
        controller: 'AverageCtrl'
      }).
      when('/map', {
        templateUrl: 'partials/map.html',
        controller: 'MapCtrl'
      }).
      otherwise({
        redirectTo: '/dashboard'
      });
  }]);
*/
