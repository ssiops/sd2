'use strict';

angular.module('stardate2App')
  .controller('MainCtrl', function ($scope) {
    $scope.nav = 'index';
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
