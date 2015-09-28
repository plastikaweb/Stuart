'use strict';

angular.module('stuartApp')
  .factory('googleMapsApi', googleMapsApi);

function googleMapsApi() {
  var zoom = 16;

  return {
    getMap: function(lat, long) {
      return {center: {latitude: lat, longitude: long }, zoom: zoom};
    },
    getPolyline: function(code) {
      return {
        path: google.maps.geometry.encoding.decodePath(code),
        editable: false,
        draggable: false,
        geodesic: false,
        visible: true
      };
    }
  };
}