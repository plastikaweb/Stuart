(function () {
  'use strict';

  angular.module('stuartApp')
    .controller('stuartController', stuartController);

  function stuartController($scope, stuartApi, googleMapsApi) {
    $scope.jobsList = [];
    $scope.errorMessage = '';
    $scope.isLoading = isLoading;
    $scope.loadMoreJobs = loadMoreJobs;
    $scope.loadModalMap = loadModalMap;
    $scope.offset = 0;
    $scope.limit = 5;
    $scope.currentJob = null;
    $scope.currentMap = {};

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

    //load map on modal window
    function loadModalMap($jobId) {
      $scope.currentJob = $jobId;
      $scope.currentMap = _.find($scope.jobsList, {'id': $scope.currentJob}).map;
      $('#modalMap').modal('show');
    }

    //load initial data
    getTasks();

    //scroll to bottom on load new jobs
    $scope.$watchCollection('jobsList', function (newNames, oldNames) {
      setTimeout(function () {
        if ($('.panel').length) {
          $('html, body').animate({
            scrollTop: $('.panel:last').offset().top
          }, 500);
        }
      }, 300);

    });

    //load google maps modal
    $('#modalMap').on('shown.bs.modal', function () {
      var map = new google.maps.Map(document.getElementById('map'), $scope.currentMap);
      map.setCenter(new google.maps.LatLng($scope.currentMap.latitude, $scope.currentMap.longitude));
      map.setZoom($scope.currentMap.zoom);
      var polyline = new google.maps.Polyline($scope.currentMap.polyline);
      polyline.setMap(map);
    });

    //remove google maps on unload modal
    $('#modalMap').on('hidden.bs.modal', function () {
      $scope.currentJob = null;
      $scope.currentMap = {};
      var map = new google.maps.Map(document.getElementById('map'), {});
    });

    //add tasks
    function getTasks() {
      loading = true;

      stuartApi.getData($scope.limit, $scope.offset)
        .then(function (response) {
          var jobs = response.data;
          _.forEach(jobs, function (el, key) {
            if (!_.isUndefined(el.currentDelivery)) {
              var latitude = el.currentDelivery.driver.currentDriverDevice.lastDriverDeviceLocation.latitude;
              var longitude = el.currentDelivery.driver.currentDriverDevice.lastDriverDeviceLocation.longitude;
              el.map = googleMapsApi.getMap(latitude, longitude);
              el.map.polyline = googleMapsApi.getPolyline(el.currentDelivery.suggestedPolylineToDestination);
            } else {
              el.map = false;
            }
          });

          $scope.jobsList = $scope.jobsList.concat(jobs);
          $scope.currentJob = $scope.jobsList[0].id;
          $scope.currentMap = $scope.jobsList[0].map;
          loading = false;
        }, function (response) {
          $scope.errorMessage = response.data || 'Something is wrong...';
          loading = false;
        });
    }

  }

})();

