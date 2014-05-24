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
    'ngProgress',
    'angularFileUpload',
    'hc.marked'
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
      .when('/timeline', {
        templateUrl: 'views/timeline.html',
        controller: 'TimelineCtrl'
      })
      .when('/shared', {
        templateUrl: 'views/timeline.html',
        controller: 'TimelineCtrl'
      })
      .when('/404', {
        templateUrl: 'views/404.html'
      })
      .otherwise({
        templateUrl: 'views/404.html'
      });
  })
  .factory('$alertService', ['$rootScope', function ($rootScope) {
    return alertService($rootScope);
  }])
  .factory('$sd', ['$rootScope', function ($rootScope) {
    var origin = new Date(Date.UTC(2011, 5, 18, 0, 0, 0, 0));
    return {
      toSD: function (utc) {
        var current;
        if (utc)
          current = new Date(utc);
        else
          current = new Date();
        return parseInt((current.getTime() - origin.getTime())/86400000).toString() + '.' + parseInt((current.getUTCHours()*60*60*1000 + current.getUTCMinutes()*60*1000 + current.getUTCSeconds()*1000 + current.getUTCMilliseconds())/8640000*1.6).toString(16);
      }
    };
  }])
  .factory('_rootdir_', ['$rootScope', function ($rootScope) {
    return '/SDR2';
  }]);

function floatMsgCtrl ($scope) {
  $scope.show = false;
  $scope.style = 'warning';
  $scope.$on('alertEvent', function (e, opt) {
    for (var prop in opt)
      $scope[prop] = opt[prop];
  });
}

function NavCtrl($scope, $route, $http, $rootScope, __rootdir__) {
  $scope.isCollapsed = true;
  $scope.$route = $route;
  $scope.nav = {};
  $scope.$on('loginEvent', function (e, user) {
    $scope.user = user;
    $scope.loggedin = true;
  });
  $scope.logout = function () {
    $http({
      method:'GET',
      url: __rootdir__ + '/logout' //'/logout.json' // TODO: Change to actual url
    })
    .success(function (data, status) {
      delete $scope.user;
      $scope.loggedin = false;
    });
  };
  $scope.checkUser = function () {
    $http({
      method: 'GET',
      url: __rootdir__ + '/currentLogin'
    })
    .success(function (data, status) {
      if (data.user)
        $rootScope.$broadcast('loginEvent', data.user);
    });
  };
  $scope.checkUser();
  $scope.broadcast = function (e) {
    $rootScope.$broadcast(e);
  };
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