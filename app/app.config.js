'use strict';
angular.
  module('usersApp').
  config(['$locationProvider' ,'$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/greeting', {
          template: '<greeting></greeting>'
        }).
        when('/users', {
          template: '<user-list></user-list>'
        }).
        otherwise('/greeting');
    }
  ]);
