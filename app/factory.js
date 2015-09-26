'use strict';

angular.module('stuartApp')
  .factory('stuartApi', stuartApi);

function stuartApi($http, apiUrl) {
  var req = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-channel': 'mobile'
    }
  };
  return {
    getData: function (limit, offset) {
      req.url = apiUrl + '?limit=' + limit + '&offset=' + offset;
      return $http(req);
    }
  };
}
