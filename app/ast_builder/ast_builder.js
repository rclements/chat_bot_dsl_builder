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
  }

  return {
    restrict: "E",
    scope: {
      ast: "="
    },
    templateUrl: "./ast_builder/ast_if.html",
    link: link,
    controller: function($scope){
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
            arguments: [
              {}, {}
            ]
          };
        }
        if(type === 'contains'){
          $scope.ast = {
            type: "contains",
            arguments: [
              {type: "var", arguments: [{type: "atom", arguments: ["input"]}]},
              {type: "string", arguments: ["filthy"]}
            ]
          };
        }
        if(type === 'response'){
          $scope.ast = {
            type: "response",
            arguments: [
              {type: "string", arguments: ["oh so dirty!"]}
            ]
          }
        }
      };
      $scope.astIsEmpty = function(){
        return angular.equals($scope.ast, {});
      };
      $scope.astIsIf = function(){
        console.log($scope.ast);
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
      console.log($scope.ast);
      $scope.response = $scope.ast.arguments[0];
      $scope.updateResponse = function(){
        $scope.ast.arguments[0] = $scope.response;
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
      $scope.containedText = $scope.ast.arguments[1].arguments[0];
      $scope.updateContainedText = function(){
        $scope.ast.arguments[1].arguments[0] = $scope.containedText;
      }
    }
  }
}])
;
