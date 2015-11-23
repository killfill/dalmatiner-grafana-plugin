define([
  'angular',
  'lodash',
  'jquery'
], function (angular, _, $) {
  'use strict';

  angular
    .module('grafana.directives')
    .directive('aggrAdd', function($compile) {

      var buttonTemplate = '<a  class="tight-form-item tight-form-func dropdown-toggle"' +
                              ' tabindex="1" gf-dropdown="aggrMenu" data-toggle="dropdown">' +
                              '<i class="fa fa-plus"></i></a>';

      return {
        link: function($scope, elem) {
          $scope.aggrMenu = $scope.buildAggrMenu('addAggr');

          var $button = $(buttonTemplate);
          $button.appendTo(elem);

          $compile(elem.contents())($scope);
        }
      };
    });
});
