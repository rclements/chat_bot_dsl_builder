'use strict';

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
  $scope.ast = {};
}])

.directive("astIf", [function(){
  function link(scope, element, attrs) {
    scope.getConditions = function(){
      // open modal
      angular.element('.ifConditionsModal', element)
        .modal('show');
    };
    scope.updateAst = function() {
      scope.ast = [
        "tuple",
        ["atom", "if"],
        scope.condition,
        scope.action
      ];
    }
    scope.setCondition = function(condition) {
      scope.condition =  ["tuple"].concat(condition);
      scope.updateAst();
      angular.element('.ifConditionsModal')
        .modal('hide');
    };
    scope.getActions = function() {
      // open modal
      angular.element('.ifActionsModal', element)
        .modal('show');
    };
    scope.setAction = function(action) {
      console.log("setting ", action);
      $scope.action = action;
      scope.updateAst();
      angular.element('.ifActionsModal')
        .modal('hide');
    };
  }

  return {
    restrict: "E",
    scope: {
      ast: "="
    },
    templateUrl: "./ast_builder/ast_if.html",
    link: link,
    controller: function($scope){
      $scope.condition = "placeholder";
      $scope.action = "placeholder";
      $scope.availableIfConditions = [
        [
          ["atom",   "contains"],
          ["var",    "input"],
          ["string", ":tableflip:"]
        ],
        [
          ["atom",   "contains"],
          ["var",    "input"],
          ["string", "filthy"]
        ]
      ];

      $scope.availableIfActions = [
        ["response", "(╯°□°）╯︵ ┻━┻"]
      ];

      $scope.addCondition = function(){
        $scope.setAst();
      };
      $scope.addAction = function(){
        $scope.setAst();
      };
      $scope.getCondition = function(){
        console.log("getCondition");
        console.log($scope.ast);
        return $scope.ast[2][3][1];
      };
      $scope.conditionIsPlaceholder = function(){
        return angular.equals($scope.ast[2], ["placeholder"]);
      };
      $scope.actionIsPlaceholder = function(){
        return angular.equals($scope.ast[3], ["placeholder"]);
      };
    }
  }
}])

.directive("astElement", [function(){
  return {
    scope: {
      ast: "="
    },
    templateUrl: "./ast_builder/ast_element.html",
    controller: function($scope){
      $scope.astIsIf = function(){
        return angular.equals($scope.ast[0], "tuple") &&
          angular.equals($scope.ast[1], ["atom", "if"]);
      };
    }
  }
}])
;
