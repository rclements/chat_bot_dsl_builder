'use strict';

console.log('loaded ast builder...');

angular.module('chatbotApp.AstBuilder', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/ast_builder', {
    templateUrl: 'ast_builder/ast_builder.html',
    controller: 'AstBuilderCtrl'
  });
}])

.controller('AstBuilderCtrl', ['$scope', function($scope) {
  $scope.condition = ["placeholder"];
  $scope.action    = ["placeholder"];
  $scope.setAst = function(){
    $scope.ast = ["tuple",
                   ["atom", "if"],
                   $scope.condition,
                   $scope.action
                 ];
  };

  $scope.availableIfConditions = [
    [
      ["atom", "input"],
      ["atom", "contains"],
      ["string", ":tableflip:"]
    ],
    [
      ["atom", "input"],
      ["atom", "contains"],
      ["string", "filthy"]
    ]
  ];

  $scope.availableIfActions = [
    ["response", "(╯°□°）╯︵ ┻━┻"]
  ];

  $scope.createBlock = function(type){
    if(type === 'if'){
      $scope.setAst();
    }
  };
  $scope.astIsEmpty = function(){
    return angular.equals($scope.ast, {});
  };
  $scope.astIsBarebonesIfWithPlaceholder = function(){
    return angular.equals($scope.condition, ["placeholder"]);
  };
  $scope.getIfConditions = function(){
    // open modal
    angular.element('#ifConditionsModal')
      .modal('show');
    //return $scope.availableIfConditions;
  };
  $scope.setIfCondition = function(condition) {
    $scope.condition =  ["tuple"].concat(condition);
    $scope.setAst();
    angular.element('#ifConditionsModal')
      .modal('hide');
  };
  $scope.getIfActions = function() {
    // open modal
    angular.element('#ifActionsModal')
      .modal('show');
  };
  $scope.setIfAction = function(action) {
    console.log("setting ", action);
    $scope.action = action;
    $scope.setAst();
    angular.element('#ifActionsModal')
      .modal('hide');
  };
  $scope.addIfCondition = function(){
    $scope.setAst();
  };
  $scope.addIfAction = function(){
    $scope.setAst();
  };
  $scope.getIfCondition = function(){
    return $scope.ast[2][3][1];
  };
  $scope.astIfConditionIsPlaceholder = function(){
    return angular.equals($scope.ast[2], ["placeholder"]);
  };
  $scope.astIfActionIsPlaceholder = function(){
    return angular.equals($scope.ast[3], ["placeholder"]);
  };
  $scope.ast = {};
}]);
