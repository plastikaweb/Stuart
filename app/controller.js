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
            $('#modalMap').modal('show');

            $scope.currentJob = $jobId;
            $scope.currentMap = _.find($scope.jobsList, {'id': $jobId}).map;
            var myOptions = {
                zoom: 8,
                center: new google.maps.LatLng(-34.397, 150.644),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById('map'),
                myOptions);
            google.maps.event.trigger(map, 'resize');
        }

        //load initial data
        getTasks();

        $scope.$watchCollection('jobsList', function (newNames, oldNames) {
            setTimeout(function () {
                if ($('.panel').length) {
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
                    loading = false;
                }, function (response) {
                    $scope.errorMessage = response.data || 'Something is wrong...';
                    loading = false;
                });
        }

    }

})();

