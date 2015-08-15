'use strict';

angular.module('chatbotApp.version', [
  'chatbotApp.version.interpolate-filter',
  'chatbotApp.version.version-directive'
])

.value('version', '0.1');
