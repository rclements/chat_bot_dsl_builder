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

.controller('ChatbotsCtrl', ['$scope', '$location', 'ChatbotsFactory', 'ChatbotFactory', function($scope, $location, ChatbotsFactory, ChatbotFactory) {

  var chatbots = ChatbotsFactory.query(function(){
    $scope.chatbots = chatbots.data;
  });

  $scope.addChatbot = function(name) {
    ChatbotsFactory.create({chatbot: {name: name}});
    $location.path('/chatbots');
  };

  $scope.removeChatbot = function(chatbot) {
    ChatbotsFactory.delete(chatbot.id);
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
  var rules = ChatbotRulesFactory.show({id: $routeParams.id}, function() {
    console.log(rules);
    $scope.rules = rules.data;
  });

  $scope.back = function() {
    $location.path('/chatbots');
  };

  $scope.editRule = function(rule) {
    $location.path('/chatbots/' + $routeParams.id + '/rules/' + rule.id);
  };

  $scope.deleteRule = function(rule) {
    $http.delete(baseUrl + '/chatbots/' + $routeParams.id + '/rules/' + rule.id).then(function(){ alert('yay'); });
    $location.path('/chatbots/' + $routeParams.id + '/rules/');
  };

  $scope.newRule = function() {
    $location.path('/chatbots/' + $routeParams.id + '/rules/new');
  }
}])

.controller('ChatbotRuleCtrl', ['$scope', '$routeParams', '$location', 'ChatbotRuleFactory', '$http', function($scope, $routeParams, $location, ChatbotRuleFactory, $http) {
  $scope.rule = {};
  var rule = ChatbotRuleFactory.show({id: $routeParams.id, rule_id: $routeParams.rule_id}, function() {
    console.log(rule.data);
    $scope.rule = {
      id: rule.data.id,
      ast: JSON.parse(rule.data.ast)
    };
  });
 
  $scope.back = function() {
    $location.path('/chatbots');
  };

  $scope.saveRule = function() {
    $http.put(baseUrl + '/api/chatbots/' + $routeParams.id + '/rules/' + $scope.rule.id, {rule: {id: $scope.rule.id, ast: JSON.stringify($scope.rule.ast)}})
    .then(function(){
      alert('yay');
    });
  }
}])

.controller('ChatbotNewRuleCtrl', ['$scope', '$routeParams', '$location', 'ChatbotRulesFactory', '$http', function($scope, $routeParams, $location, ChatbotRulesFactory, $http) {
  $scope.rule = { ast: {} };
  $scope.addRule = function() {
    $http.post(baseUrl + '/api/chatbots/' + $routeParams.id + '/rules/', {rule: {chatbot_id: $routeParams.id, ast: JSON.stringify($scope.rule.ast)}})
    .then(function(){
      alert('yay');
    });
  };

  $scope.back = function() {
    $location.path('/chatbots');
  };
}])

var services = angular.module('chatbotApp.services', ['ngResource']);

var baseUrl = 'http://192.168.0.151:4000';

services.factory('ChatbotsFactory', function ($resource) {
  return $resource(baseUrl + '/api/chatbots', {}, {
    query: { method: 'GET' },
    create: { method: 'POST' }
  })
});

services.factory('ChatbotFactory', function ($resource) {
  return $resource(baseUrl + '/api/chatbots/:id', {}, {
    show: { method: 'GET' },
    update: { method: 'PUT', params: {id: '@id'} },
    delete: { method: 'DELETE', params: {id: '@id'} }
  })
});

services.factory('ChatbotRulesFactory', function ($resource) {
  return $resource(baseUrl + '/api/chatbots/:id/rules', {}, {
    create: { method: 'POST' },
    show: { method: 'GET' },
    update: { method: 'PUT', params: {id: '@id'} },
    delete: { method: 'DELETE', params: {id: '@id'} }
  })
});

services.factory('ChatbotRuleFactory', function ($resource) {
  return $resource(baseUrl + '/api/chatbots/:id/rules/:rule_id', {}, {
    show: { method: 'GET' },
    update: { method: 'PUT', params: {rule_id: '@rule_id', id: '@id'} },
    delete: { method: 'DELETE', params: {rule_id: '@rule_id', id: '@id'} }
  })
});

