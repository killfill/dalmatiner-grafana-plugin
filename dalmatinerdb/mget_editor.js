define([
  'angular',
  'lodash',
  'jquery'
], function (angular, _, $) {
  'use strict';

  angular
    .module('grafana.directives')
    .directive('mgetEditor', function($compile) {

      var buttonTemplate = '<a  class="tight-form-item tight-form-func dropdown-toggle"' +
                              ' tabindex="1" gf-dropdown="mgetMenu" data-toggle="dropdown">' +
                              '<span>{{target.mget}}</span></a>';

      return {
        link: function($scope, elem) {

          $scope.mgetMenu = $scope.buildMgetMenu();

          var $button = $(buttonTemplate);
          $button.appendTo(elem);

          $compile(elem.contents())($scope);
        }
      };
    });
});
