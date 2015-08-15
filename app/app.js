'use strict';

// Declare app level module which depends on views, and components
angular.module('chatbotApp', [
  'ngRoute',
  'chatbotApp.AstBuilder',
  'chatbotApp.version'
]).

config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/ast_builder'});
}]);
