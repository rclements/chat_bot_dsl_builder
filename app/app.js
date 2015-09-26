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
}]).
filter('ppjson', function () {
  function pretty(json) {
    return JSON ? JSON.stringify(json, null, 2) : 'your browser doesnt support JSON so cant pretty print';
  }
  return pretty;
});
;
