'use strict';

function modalCtrl ($scope, $modalInstance, $fileUploader) {
  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.uploader = $fileUploader.create({
    scope: $scope,
    url: '/usercontent/blog/img',
    autoUpload: true
  });

  $scope.uploader.progress = 0;

  $scope.uploader.bind('success', function (event, xhr, item, response) {
    $modalInstance.close('/usercontent/blog/' + response.filename);
  });
}

angular.module('stardate2App')
  .controller('TimelineCtrl', function ($scope, $window, $http, $sd, $modal, $alertService, marked) {
    $scope.nav = 'timeline';
    $scope.$sd = $sd;
    $scope.events = [];
    $scope.md = marked;
    $scope.getEvents = function () {
      $http({
        method: 'GET',
        url: '/events.json' // TODO
      })
      .success(function (data, status) {
        if (data.events) {
          $scope.events = data.events;
        }
      });
    };
    $scope.getEvents();

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
      $http({
        method: 'PUT',
        url: '/calendar',
        data: $scope.newEvent
      })
      .success(function (data, status) {
        $scope.editMode = $scope.timeline_add_active = false;
        $scope.getEvents();
      })
      .error(function (data, status) {
        $alertService.send('An error has ocurred. Please try again later.');
      });
    };
  });
