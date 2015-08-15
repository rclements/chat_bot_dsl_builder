'use strict';

describe('chatbotApp.AstBuilder module', function() {
  var scope, ctrl;

  beforeEach(module("chatbotApp.AstBuilder"));

  beforeEach(inject(function($rootScope, $controller) {
    scope = $rootScope.$new();
    ctrl = $controller('AstBuilderCtrl', {
      '$scope': scope
    });
  }));

  describe('ast_builder controller', function(){
    it('exists and stuff', function() {
      expect(ctrl).toBeDefined();
      expect(scope.ast).toEqual({});
    });
    it('can have an if block injected', function() {
      scope.createBlock('if');
      var expectedAst = ["tuple",
                          ["atom", "if"],
                          ["placeholder"],
                          ["placeholder"]
                        ];

      expect(scope.ast).toEqual(expectedAst);
    });
  });
});
