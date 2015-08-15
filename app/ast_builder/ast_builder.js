'use strict';

console.log('loaded ast builder...');

angular.module('chatbotApp.AstBuilder', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/ast_builder', {
    templateUrl: 'ast_builder/ast_builder.html',
    controller: 'AstBuilderCtrl'
  });
}])

.controller('AstBuilderCtrl', function($scope, $http) {

  var templates = {
    barebonesIf: ["tuple",
                   ["atom", "if"],
                   ["placeholder"],
                   ["placeholder"]
                 ]
  };

  $scope.numbers = [1, 2, 3];
  $scope.createBlock = function(type){
    if(type === 'if'){
      $scope.ast = templates.barebonesIf;
    }
  };
  $scope.astIsEmpty = function(){
    return angular.equals($scope.ast, {});
  };
  $scope.astIsBarebonesIf = function(){
    return angular.equals($scope.ast, templates.barebonesIf);
  };
  $scope.ast = {};
});
