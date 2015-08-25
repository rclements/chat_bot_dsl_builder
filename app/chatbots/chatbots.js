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

.controller('ChatbotRulesCtrl', ['$scope', '$routeParams', '$location', 'ChatbotRulesFactory', function($scope, $routeParams, $location, ChatbotRulesFactory) {
  var rules = ChatbotRulesFactory.show({id: $routeParams.id}, function() {
    console.log(rules);
    $scope.rules = rules.data;
  });

  $scope.editRule = function(rule) {
    $location.path('/chatbots/' + $routeParams.id + '/rules/' + rule.id);
  };

}])

.controller('ChatbotRuleCtrl', ['$scope', '$routeParams', '$location', 'ChatbotRuleFactory', '$http', function($scope, $routeParams, $location, ChatbotRuleFactory, $http) {
  var rule = ChatbotRuleFactory.show({id: $routeParams.id}, function() {
    $scope.rule = {
      id: rule.data[0].id,
      ast: JSON.parse(rule.data[0].ast)
    };
  });

  $scope.saveRule = function() {
    $http.put(baseUrl + '/api/chatbots/' + $routeParams.id + '/rules/' + $scope.rule.id, {rule: {id: $scope.rule.id, ast: JSON.stringify($scope.rule.ast)}})
    .then(function(){
      alert('yay');
    });
  }
}])

var services = angular.module('chatbotApp.services', ['ngResource']);

var baseUrl = 'http://192.168.1.202:4000';

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
    show: { method: 'GET' },
    update: { method: 'PUT', params: {id: '@id'} },
    delete: { method: 'DELETE', params: {id: '@id'} }
  })
});

services.factory('ChatbotRuleFactory', function ($resource) {
  return $resource(baseUrl + '/api/chatbots/:id/rules/:rule_id', {}, {
    show: { method: 'GET' },
    update: { method: 'PUT', params: {rule_id: '@rule_id', id: '@id'} },
    delete: { method: 'DELETE', params: {id: '@id'} }
  })
});

