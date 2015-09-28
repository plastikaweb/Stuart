(function() {
  'use strict';

  angular.module('stuartApp')
    .factory('stuartApi', stuartApi);

  function stuartApi($http, apiUrl) {
    var req = {
      url: apiUrl,
      method: 'GET',
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json',
        'x-channel': 'mobile'
      }
    };
    return {
      getData: function (limit, offset) {
        req.params = {
          'limit': limit,
          'offset': offset
        };
        return $http(req);
      }
    };
  }

})();