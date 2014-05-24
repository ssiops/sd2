'use strict';

angular.module('stardate2App')
  .controller('MainCtrl', function ($scope, $timeout) {
    $scope.nav = 'index';
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.deathRayTitle = 'Hexchain Deathray';
    $scope.deathRay = function () {
      $scope.cooldown = true;
      $scope.deathRayTitle = 'Cooling down';
      $timeout(function () {
        $scope.cooldown = false;
        $scope.deathRayTitle = 'Hexchain Deathray';
      }, 42000);
    };
  });
