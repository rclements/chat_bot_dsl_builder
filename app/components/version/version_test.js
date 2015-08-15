'use strict';

describe('chatbotApp.version module', function() {
  beforeEach(module('chatbotApp.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
