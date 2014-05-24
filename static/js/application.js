'use strict';

var alertService = function ($rootScope) {
  return {
    show: function () {
      return $rootScope.$broadcast('alertEvent', {show: true});
    },
    hide: function () {
      return $rootScope.$broadcast('alertEvent', {show: false});
    },
    send: function (opt) {
      if (typeof opt === 'string')
        return $rootScope.$broadcast('alertEvent', {show: true, msg: opt});
      else {
        var e = {show: true, style: 'warning'};
        if (typeof opt.style !== undefined)
          e.style = opt.style;
        if (typeof opt.msg === 'undefined')
          return;
        e.msg = opt.msg;
        return $rootScope.$broadcast('alertEvent', e);
      }
    }
  };
};

angular
  .module('stardate2App', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ui.bootstrap',
    'ngProgress'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        nav: 'index'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl'
      })
      .when('/404', {
        templateUrl: 'views/404.html'
      })
      .otherwise({
        redirectTo: '/404'
      });
  })
  .factory('$alertService', ['$rootScope', function ($rootScope) {
    return alertService($rootScope);
  }]);

function floatMsgCtrl ($scope) {
  $scope.show = false;
  $scope.style = 'warning';
  $scope.$on('alertEvent', function (e, opt) {
    for (var prop in opt)
      $scope[prop] = opt[prop];
  });
}

function NavCtrl($scope, $route) {
  $scope.isCollapsed = true;
  $scope.$route = $route;
  $scope.nav = {};
}

function ProgressCtrl($scope, ngProgress) {
  ngProgress.color('#00c2ff');
  $scope.$on('$routeChangeStart', function (e) {
    ngProgress.reset();
    ngProgress.start();
  });
  $scope.$on('$routeChangeSuccess', function (e) {
    ngProgress.complete();
  });
  $scope.$on('$routeChangeError', function (e) {
    ngProgress.reset();
  });
}