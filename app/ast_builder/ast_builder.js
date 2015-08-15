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
  var templates = {
    barebonesIf: ["tuple",
                   ["atom", "if"],
                   ["placeholder"],
                   ["placeholder"]
                 ],
    ifWithCondition: ["tuple",
                       ["atom", "if"],
                       ["tuple",
                         ["atom", "input"],
                         ["atom", "contains"],
                         ["string", ":tableflip:"]
                       ],
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

  $scope.availableIfConditions = ["input contains tableflip"];

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
  $scope.astIsIfWithCondition = function(){
    return angular.equals($scope.ast, templates.ifWithCondition);
  };
  $scope.astIsIfWithConditionAndAction = function(){
    return angular.equals($scope.ast, templates.ifWithConditionAndAction);
  };
  $scope.getIfConditions = function(){
    // open modal
    angular.element('#ifConditionsModal')
      .modal('show');
    //return $scope.availableIfConditions;
  };
  $scope.addIfCondition = function(){
    $scope.ast = templates.ifWithCondition;
  };
  $scope.addIfAction = function(){
    $scope.ast = templates.ifWithConditionAndAction;
  };
  $scope.getIfCondition = function(){
    return $scope.ast[2][3][1];
  };
  $scope.ast = {};
}]);
