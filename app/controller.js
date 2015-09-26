'use strict';

angular.module('stuartApp')
  .controller('stuartController', stuartController);

function stuartController($scope, stuartApi) {
  $scope.tasksList = [];
  $scope.errorMessage = '';
  $scope.isLoading = isLoading;
  $scope.offset = 0;
  $scope.limit = 10;

  var loading = false;

  //loading state
  function isLoading() {
    return loading;
  }

  //pagination update
  function updateLimit(limit) {
    $scope.limit = limit;
    getTasks();
  }

  //load initial data
  getTasks();

  function getTasks() {
    loading = true;
    $scope.tasksList = [];

    stuartApi.getData($scope.limit, $scope.offset)
      .success(function (data) {
        console.log(data);
        $scope.tasksList = data;
        loading = false;
      })
      .error(function (err) {
        $scope.errorMessage = 'Something is wrong...';
        loading = false;
      });
  }
}
