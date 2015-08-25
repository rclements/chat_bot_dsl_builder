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

.directive('expressionMenu', [function() {
  return {
      restrict: 'A',
      link: function(scope, elem, attrs) {
        angular.element('.ui.dropdown').dropdown();
      }
    };
}])

.directive("astIf", [function(){
  function link(scope, element, attrs) {
    angular.element('.ui.dropdown').dropdown();
    scope.getConditions = function(){
      // open modal
      angular.element('.ifConditionsModal', element)
        .modal('show');
    };
    scope.setCondition = function(condition) {
      scope.ast.left = ["tuple"].concat(condition);
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
      scope.ast.right = action;
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
      $scope.conditionIsPlaceholder = function(){
        return angular.equals($scope.left, {});
      };
      $scope.actionIsPlaceholder = function(){
        return angular.equals($scope.right, {});
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

      $scope.expressions = ["if", "contains", "response"];
      $scope.createBlock = function(type){
        if(type === 'if'){
          $scope.ast = {
            type: "if",
            left: {},
            right: {}
          };
        }
        if(type === 'contains'){
          $scope.ast = {
            type: "contains",
            left: "input",
            right: ":tableflip"
          };
        }
        if(type === 'response'){
          $scope.ast = {
            type: "response",
            value: "response"
          }
        }
      };
      $scope.astIsEmpty = function(){
        return angular.equals($scope.ast, {});
      };
      $scope.astIsIf = function(){
        return angular.equals($scope.ast.type, "if");
      };
      $scope.astIsResponse = function(){
        return angular.equals($scope.ast.type, "response");
      };
      $scope.astIsContains = function(){
        return angular.equals($scope.ast.type, "contains");
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
        $scope.ast.value = $scope.response;
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
      $scope.containedText = $scope.ast.right;
      $scope.updateContainedText = function(){
        $scope.ast.right = $scope.containedText;
      }
    }
  }
}])
;
