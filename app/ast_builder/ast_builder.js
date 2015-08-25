'use strict';

angular.module('chatbotApp.AstBuilder', ['ngRoute', 'RecursionHelper'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/ast_builder', {
    templateUrl: 'ast_builder/ast_builder.html',
    controller: 'AstBuilderCtrl'
  });
}])

.controller('AstBuilderCtrl', ['$scope', function($scope) {
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
      scope.data.ast = [
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
      scope.action = action;
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
      $scope.data = {
        ast: $scope.ast
      }
      $scope.condition = {};
      $scope.action = {};

      $scope.getCondition = function(){
        return $scope.data.ast[2][3][1];
      };
      $scope.conditionIsPlaceholder = function(){
        return angular.equals($scope.data.ast[2], {});
      };
      $scope.actionIsPlaceholder = function(){
        return angular.equals($scope.data.ast[3], {});
      };
    }
  }
}])

.directive("astElement", ["RecursionHelper", function(RecursionHelper){
  return {
    scope: {
      ast: "="
    },
    templateUrl: "./ast_builder/ast_element.html",
    controller: function($scope){
      $scope.createBlock = function(type){
        if(type === 'if'){
          $scope.ast = [
            "tuple",
            ["atom", "if"],
            {},
            {}
          ];
        }
        if(type === 'contains'){
          $scope.ast = [
            ["atom",   "contains"],
            ["var",    "input"],
            ["string", ":tableflip:"]
          ];
        }
        if(type === 'response'){
          $scope.ast = ["response", ""];
        }
      };
      $scope.astIsEmpty = function(){
        return angular.equals($scope.ast, {});
      };
      $scope.astIsIf = function(){
        return angular.equals($scope.ast[0], "tuple") &&
          angular.equals($scope.ast[1], ["atom", "if"]);
      };
      $scope.astIsResponse = function(){
        return angular.equals($scope.ast[0], "response");
      };
      $scope.astIsContains = function(){
        return angular.equals($scope.ast[0], ["atom", "contains"]);
      };
    },
    compile: function(element) {
      return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn){
        // normal link function goes here
      });
    }
  }
}])

.directive("astResponse", [function(){
  return {
    scope: {
      ast: "="
    },
    templateUrl: "./ast_builder/ast_response.html",
    controller: function($scope){
      $scope.response = $scope.ast[1];
      $scope.updateResponse = function(){
        $scope.ast[1] = $scope.response;
      }
    }
  }
}])

.directive("astContains", [function(){
  return {
    scope: {
      ast: "="
    },
    templateUrl: "./ast_builder/ast_contains.html",
    controller: function($scope){
      $scope.containedText = $scope.ast[2][1];
      $scope.updateContainedText = function(){
        $scope.ast[2][1] = $scope.containedText;
      }
    }
  }
}])
;
