'use strict';

// Declare app level module which depends on views, and components
angular.module('chatbotApp', [
  'ngRoute',
  'chatbotApp.AstBuilder',
  'chatbotApp.Chatbots',
  'chatbotApp.services',
  'chatbotApp.version'
]).

config(['$httpProvider', '$routeProvider', function($httpProvider, $routeProvider) {
  $routeProvider.otherwise({redirectTo: '/ast_builder'});
}]);
