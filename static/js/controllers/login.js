'use strict';

angular.module('stardate2App')
  .controller('LoginCtrl', function ($scope, $http, $alertService, $location, $rootScope, ngProgress, __rootdir__) {
    $scope.nav = 'login';
    $scope.form = {};
    $scope.login = function () {
      ngProgress.reset();
      ngProgress.start();
      $http({
        method: 'POST',
        url: __rootdir__ + '/login',
        data: $scope.form
      })
      .success(function (data, status) {
        ngProgress.complete();
        $location.url('#/');
        if (data.user)
          $rootScope.$broadcast('loginEvent', data.user);
      })
      .error(function (data, status) {
        ngProgress.reset();
        $alertService.send('An error has ocurred. Please try again later.');
        if (data.err) console.log(data.err);
      });
    };
  });