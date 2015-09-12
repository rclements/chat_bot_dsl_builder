'use strict';

angular.module('chatbotApp.Chatbots', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/chatbots', {
    templateUrl: 'chatbots/chatbots.html',
    controller: 'ChatbotsCtrl'
  })
  .when('/chatbots/:id', {
    templateUrl: 'chatbots/chatbot.html',
    controller: 'ChatbotCtrl'
  })
  .when('/chatbots/:id/rules', {
    templateUrl: 'chatbots/chatbot_rules.html',
    controller: 'ChatbotRulesCtrl'
  })
  .when('/chatbots/:id/rules/new', {
    templateUrl: 'chatbots/new_chatbot_rule.html',
    controller: 'ChatbotNewRuleCtrl'
  })
  .when('/chatbots/:id/rules/:rule_id', {
    templateUrl: 'chatbots/chatbot_rule.html',
    controller: 'ChatbotRuleCtrl'
  });
}])

.controller('ChatbotsCtrl', ['$scope', '$location', 'ChatbotFactory', function($scope, $location, ChatbotFactory) {
  ChatbotFactory.query().then(function(chatbots){
    $scope.chatbots = chatbots.data.data;
  });

  $scope.addChatbot = function(name) {
    ChatbotFactory.create({chatbot: {name: name}}).then(function() {
      ChatbotFactory.query().then(function(chatbots){
        $scope.chatbots = chatbots.data.data;
      });
    });
  };

  $scope.removeChatbot = function(chatbot) {
    ChatbotFactory.delete(chatbot.id).then(function() {
      ChatbotFactory.query().then(function(chatbots){
        $scope.chatbots = chatbots.data.data;
      });
    });
    return false;
  };

  $scope.showChatbot = function(chatbot) {
    $location.path('/chatbots/' + chatbot.id);
  };

  $scope.showChatbotRules = function(chatbot) {
    $location.path('/chatbots/' + chatbot.id + '/rules');
  };
}])

.controller('ChatbotCtrl', ['$scope', '$routeParams', '$location', 'ChatbotFactory', function($scope, $routeParams, $location, ChatbotFactory) {
  console.log('ChatbotCtrl');

  $scope.back = function() {
    $location.path('/chatbots');
  };

  var chatbot = ChatbotFactory.show({id: $routeParams.id}, function() {
    console.log(chatbot);
    $scope.chatbot = chatbot.data;
  });
}])

.controller('ChatbotRulesCtrl', ['$scope', '$routeParams', '$location', 'ChatbotRulesFactory', '$http', function($scope, $routeParams, $location, ChatbotRulesFactory, $http) {
  ChatbotRulesFactory.query($routeParams.id).then(function(rules){
    $scope.rules = rules.data.data;
    console.log($scope.rules);
  });

  $scope.back = function() {
    $location.path('/chatbots');
  };

  $scope.editRule = function(rule) {
    $location.path('/chatbots/' + $routeParams.id + '/rules/' + rule.id);
  };

  $scope.deleteRule = function(rule) {
    ChatbotRulesFactory.delete($routeParams.id, rule.id).then(function(){
      ChatbotRulesFactory.query($routeParams.id).then(function(rules){
        $scope.rules = rules.data.data;
      });
    });
  };

  $scope.newRule = function() {
    $location.path('/chatbots/' + $routeParams.id + '/rules/new');
  }
}])

.controller('ChatbotRuleCtrl', ['$scope', '$routeParams', '$location', 'ChatbotRulesFactory', '$http', function($scope, $routeParams, $location, ChatbotRulesFactory, $http) {
  $scope.rule = {};
  ChatbotRulesFactory.show($routeParams.id, $routeParams.rule_id).then(function(rule) {
    rule = rule.data.data;
    console.log(rule);
    $scope.rule = {
      id: rule.id,
      ast: JSON.parse(rule.ast)
    };
  });

  $scope.back = function() {
    $location.path('/chatbots/' + $routeParams.id + '/rules');
  };

  $scope.saveRule = function() {
    ChatbotRulesFactory.update($routeParams.id, $scope.rule.id, {rule: {id: $scope.rule.id, ast: JSON.stringify($scope.rule.ast)}}).then(function(){
      $location.path('/chatbots/' + $routeParams.id + "/rules");
    })
  }
}])

.controller('ChatbotNewRuleCtrl', ['$scope', '$routeParams', '$location', '$http', function($scope, $routeParams, $location, $http) {
  $scope.rule = { ast: {} };
  $scope.addRule = function() {
    $http.post(baseUrl + '/api/chatbots/' + $routeParams.id + '/rules/', {rule: { ast: JSON.stringify($scope.rule.ast) }})
    .then(function(){
      $location.path('/chatbots/' + $routeParams.id + '/rules');
    });
  };

  $scope.back = function() {
    $location.path('/chatbots');
  };
}])

var services = angular.module('chatbotApp.services', ['ngResource']);

var baseUrl = 'http://localhost:4000';

services.factory('ChatbotFactory', function ($http) {
  var chatbotsUrl = baseUrl + "/api/chatbots";
  return {
    query: function() {
            return $http.get(chatbotsUrl);
           },
    create: function(chatbot) {
            return $http.post(chatbotsUrl, chatbot);
            },
    show: function(chatbot){
            return $http.get(chatbotsUrl + "/" + chatbot.id);
          },
    update: function(chatbot){
            return $http.put(chatbotsUrl + "/" + chatbot.id, chatbot);
          },
    delete: function(chatbot_id){
            return $http.delete(chatbotsUrl + "/" + chatbot_id);
          }
  };
});

services.factory('ChatbotRulesFactory', function ($http) {
  var chatbotRulesUrl = baseUrl + "/api/chatbots";
  return {
    query: function(chatbot_id) {
            return $http.get(chatbotRulesUrl + "/" + chatbot_id + "/rules");
           },
    create: function(chatbot_id, rule) {
            return $http.post(chatbotRulesUrl + "/" + chatbot_id + "/rules", { rule: { ast: rule.ast } });
            },
    show: function(chatbot_id, rule_id){
            return $http.get(chatbotRulesUrl + "/" + chatbot_id + "/rules/" + rule_id);
          },
    update: function(chatbot_id, rule_id, rule){
            return $http.put(chatbotRulesUrl + "/" + chatbot_id + "/rules/" + rule_id, rule);
          },
    delete: function(chatbot_id, rule_id){
            return $http.delete(chatbotRulesUrl + "/" + chatbot_id + "/rules/" + rule_id);
          }
  };
});
