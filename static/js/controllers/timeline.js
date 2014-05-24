'use strict';

function modalCtrl ($scope, $modalInstance, $fileUploader, __rootdir__) {
  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.uploader = $fileUploader.create({
    scope: $scope,
    url: __rootdir__ + '/usercontent/img/',
    autoUpload: true
  });

  $scope.uploader.progress = 0;

  $scope.uploader.bind('success', function (event, xhr, item, response) {
    $modalInstance.close(response.url);
  });
}

angular.module('stardate2App')
  .controller('TimelineCtrl', function ($scope, $window, $location, $http, $sd, $modal, $alertService, marked, __rootdir__) {

    
    $scope.$sd = $sd;
    $scope.events = [];
    $scope.md = marked;
    $scope.getEvents = function (origin) {
      var url = __rootdir__ + '/mycalendar';
      if (origin === 'shared')
        url = __rootdir__ + '/sharedcalendar';
      $http({
        method: 'GET',
        url: url
      })
      .success(function (data, status) {
        if (data.events) {
          $scope.events = data.events;
        }
      })
      .error(function (data, status) {
        $alertService.send('An error has ocurred. Please try again later.');
        if (data.err) console.log(data.err);
      });
    };
    if ($location.url().search(/timeline$/g) >= 0) {
      $scope.nav = 'timeline';
      $scope.getEvents();
    } else {
      $scope.nav = 'shared';
      $scope.getEvents('shared');
    }

    $scope.textarea = $window.document.getElementById('editor-body');
    $scope.newEvent = {style: 'default'};
    $scope.newEvent.value = '';
    $scope.insert = function(opt) {
      $scope.newEvent.value = $scope.textarea.value;
      var start = $scope.textarea.selectionStart;
      var end = $scope.textarea.selectionEnd;
      if (opt.wrap) {
        if (start === end)
          $scope.textarea.value = $scope.newEvent.value.substring(0, start) + opt.wrap + opt.wrap + $scope.newEvent.value.substring(end, $scope.newEvent.value.length);
        else
          $scope.textarea.value = $scope.newEvent.value.substring(0, start) + opt.wrap + $scope.newEvent.value.substring(start, end) + opt.wrap + $scope.newEvent.value.substring(end, $scope.newEvent.value.length);
        $scope.textarea.selectionStart = $scope.textarea.selectionEnd = start + opt.wrap.length;
      }
      if (opt.home) {
        var br = start - 1;
        for (; br >= 0 && $scope.newEvent.value.charAt(br) !== '\n'; br--);
        br++;
        $scope.textarea.value = $scope.newEvent.value.substring(0, br) + opt.home + $scope.newEvent.value.substring(br, $scope.newEvent.value.length);
        $scope.textarea.selectionStart = $scope.textarea.selectionEnd = start + opt.home.length;
      }
      if (opt.line) {
        $scope.textarea.value = $scope.newEvent.value.substring(0, start) + '\n' + opt.line + '\n' + $scope.newEvent.value.substring(start, $scope.newEvent.value.length);
        $scope.textarea.selectionStart = $scope.textarea.selectionEnd = start + opt.line.length + 2;
      }
      if (opt.simple) {
        $scope.textarea.value = $scope.newEvent.value.substring(0, start) + opt.simple + $scope.newEvent.value.substring(start, $scope.newEvent.value.length);
      }
      $scope.textarea.focus();
    };
    $scope.openModal = function () {
      var modalInstance = $modal.open({
        templateUrl: 'imgUpload.html',
        controller: modalCtrl
      });

      modalInstance.result.then(function (src) {
        $scope.insert({simple: '![ALT](' + src + ')'});
      }, function () {
      });
    };

    $scope.toEditor = function (index) {
      for (var prop in $scope.events[index]) {
        $scope.newEvent[prop] = $scope.events[index][prop];
      }
      $scope.textarea.value = $scope.newEvent.content;
      $scope.editMode = $scope.timeline_add_active = true;
    };

    $scope.post = function (really) {
      if (!really)
        return;
      $scope.newEvent.content = $scope.textarea.value;
      var url = __rootdir__ + '/calendar';
      if ($scope.newEvent.id)
        url +=  $scope.newEvent.id;
      $http({
        method: 'POST',
        url: url,
        data: $scope.newEvent
      })
      .success(function (data, status) {
        $scope.editMode = $scope.timeline_add_active = false;
        $scope.getEvents();
      })
      .error(function (data, status) {
        $alertService.send('An error has ocurred. Please try again later.');
        if (data.err) console.log(data.err);
      });
    };

    $scope.share = function (userid, eventid) {
      $http({
        method: 'POST',
        url: __rootdir__ + '/calendarRestrict/' + eventid,
        data: {'userid': userid}
      })
      .success(function (data, status) {
        $alertService.send({style: 'success', msg: 'Your event has been successfully shared.'});
      })
      .error(function (data, status) {
        $alertService.send('An error has ocurred. Please try again later.');
        if (data.err) console.log(data.err);
      });
    };

    $scope.getUsers = function () {
      $http({
        method: 'GET',
        url: __rootdir__ + '/allUser'//'/users.json'
      })
      .success(function (data, status) {
        if (data.users)
          $scope.users = data.users;
      })
      .error(function (data, status) {
        $alertService.send('An error has ocurred. Please try again later.');
        if (data.err) console.log(data.err);
      });
    };
    $scope.getUsers();
  });
