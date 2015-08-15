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
  $scope.templates = function(){
    return {
      barebonesIf: ["tuple",
                     ["atom", "if"],
                     $scope.condition,
                     ["placeholder"]
                   ],
      ifWithCondition: ["tuple",
                         ["atom", "if"],
                         $scope.condition,
                         ["placeholder"]
                       ],
      ifWithConditionAndAction: ["tuple",
                         ["atom", "if"],
                         ["tuple",
                           ["atom", "input"],
                           ["atom", "contains"],
                           ["string", ":tableflip:"]
                         ],
                         ["response", "(╯°□°）╯︵ ┻━┻"]
                       ]
    };
  };


  $scope.availableIfConditions = ["input contains tableflip"];

  $scope.numbers = [1, 2, 3];
  $scope.createBlock = function(type){
    if(type === 'if'){
      $scope.ast = $scope.templates().barebonesIf;
    }
  };
  $scope.astIsEmpty = function(){
    return angular.equals($scope.ast, {});
  };
  $scope.astIsBarebonesIf = function(){
    return angular.equals($scope.ast, $scope.templates().barebonesIf);
  };
  $scope.astIsBarebonesIfWithPlaceholder = function(){
    return angular.equals($scope.condition, ["placeholder"]);
  };
  $scope.astIsIfWithCondition = function(){
    return angular.equals($scope.ast, $scope.templates().ifWithCondition);
  };
  $scope.astIsIfWithConditionAndAction = function(){
    return angular.equals($scope.ast, $scope.templates().ifWithConditionAndAction);
  };
  $scope.getIfConditions = function(){
    // open modal
    angular.element('#ifConditionsModal')
      .modal('show');
    //return $scope.availableIfConditions;
  };
  $scope.setIfCondition = function(condition) {
    $scope.condition =  ["tuple",
                         ["atom", "input"],
                         ["atom", "contains"],
                         ["string", ":tableflip:"]
                       ];
    $scope.ast = $scope.templates().ifWithCondition;
    angular.element('#ifConditionsModal')
      .modal('hide');
  };
  $scope.addIfCondition = function(){
    $scope.ast = $scope.templates().ifWithCondition;
  };
  $scope.addIfAction = function(){
    $scope.ast = $scope.templates().ifWithConditionAndAction;
  };
  $scope.getIfCondition = function(){
    console.log($scope.ast);
    return $scope.ast[2][3][1];
  };
  $scope.ast = {};
}]);
