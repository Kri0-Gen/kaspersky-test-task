angular.module('usersService', ['ngResource'])
   .factory('UsersFactory', function($resource) {
      return $resource('./users-service/generated.json',{ }, {
         getUsers: {method:'GET', isArray: true}
      });
   });