'use strict';

angular.module('stuartApp')
  .controller('stuartController', stuartController);

function stuartController($scope, stuartApi) {
  $scope.jobsList = [];
  $scope.lastCollection = [];
  $scope.errorMessage = '';
  $scope.isLoading = isLoading;
  $scope.loadMoreJobs = loadMoreJobs;
  $scope.offset = 0;
  $scope.limit = 10;

  var loading = false;

  //loading state
  function isLoading() {
    return loading;
  }

  //pagination update
  function loadMoreJobs() {
    $scope.offset += 10;
    getTasks();
  }

  //load initial data
  getTasks();

  $scope.$watchCollection('jobsList', function(newNames, oldNames) {
    console.log($('body').height());
    window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
  });

  function getTasks() {
    loading = true;

    stuartApi.getData($scope.limit, $scope.offset)
      .then(function (response) {
        $scope.lastCollection = response.data;
        $scope.jobsList = $scope.jobsList.concat($scope.lastCollection);
        loading = false;
      }, function (response) {
        $scope.errorMessage = response.data || 'Something is wrong...';
        loading = false;
      });
  }
}
