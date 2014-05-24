'use strict';

angular.module('stardate2App')
  .controller('LoginCtrl', function ($scope, $http, $alertService, $location, $rootScope, ngProgress) {
    $scope.nav = 'login';
    $scope.form = {};
    $scope.login = function () {
      ngProgress.reset();
      ngProgress.start();
      $http({
        method: 'POST',
        url: '/login',
        data: $scope.form
      })
      .success(function (data, status) {
        $location.url('#/');
        ngProgress.complete();
        if (data.user)
          $rootScope.$broadcast('loginEvent', data.user);
      })
      .error(function (data, status) {
        ngProgress.reset();
        console.log(data);
        $alertService.send('An error has ocurred. Please try again later.');
      });
    };
  });