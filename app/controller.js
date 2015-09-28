'use strict';

angular.module('stuartApp')
  .controller('stuartController', stuartController);

function stuartController($scope, stuartApi, googleMapsApi) {
  $scope.jobsList = [];
  $scope.errorMessage = '';
  $scope.isLoading = isLoading;
  $scope.loadMoreJobs = loadMoreJobs;
  $scope.offset = 0;
  $scope.limit = 5;

  var loading = false;

  //loading state
  function isLoading() {
    return loading;
  }

  //pagination update
  function loadMoreJobs() {
    $scope.offset += $scope.limit;
    getTasks();
  }

  //load initial data
  getTasks();

  $scope.$watchCollection('jobsList', function (newNames, oldNames) {
    setTimeout(function() {
      if( $('.panel').length ) {
        $('html, body').animate({
          scrollTop: $('.panel:last').offset().top
        }, 500);
      }
    }, 300);

  });

  function getTasks() {
    loading = true;

    stuartApi.getData($scope.limit, $scope.offset)
      .then(function (response) {
        var jobs = response.data;
        _.forEach(jobs, function (el, key) {
          if(!_.isUndefined(el.currentDelivery)) {
            var latitude = el.currentDelivery.driver.currentDriverDevice.lastDriverDeviceLocation.latitude;
            var longitude = el.currentDelivery.driver.currentDriverDevice.lastDriverDeviceLocation.longitude;
            el.map = googleMapsApi.getMap(latitude, longitude);
            el.map.polyline = googleMapsApi.getPolyline(el.currentDelivery.suggestedPolylineToDestination);
          }
        });

        $scope.jobsList = $scope.jobsList.concat(jobs);
        loading = false;
      }, function (response) {
        $scope.errorMessage = response.data || 'Something is wrong...';
        loading = false;
      });
  }

}


