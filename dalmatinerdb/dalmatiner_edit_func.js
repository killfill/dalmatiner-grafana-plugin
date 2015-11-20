var x;
define([
  'angular',
  'lodash',
  'jquery',
], function (angular, _, $) {
  'use strict';

  angular
    .module('grafana.directives')
    .directive('dalmatinerdbFuncEditor', function($compile) {

      var funcSpanTemplate = '<a class="dropdown-toggle" gf-dropdown="functionMenu" ' +
          'data-toggle="dropdown">{{aggr.name}}</a><span>(</span>';

      var paramTemplate = '<input type="text" style="display:none"' +
          ' class="tight-form-input"></input>';

      return {
        restrict: 'A',
        link: function postLink($scope, elem) {
          var $funcLink = $(funcSpanTemplate);

          $scope.functionMenu = $scope.buildAggrMenu('changeAggr', $scope.aggr.id * 1)

          $scope.functionMenu.unshift({
            text: "-- DELETE --",
            click: "deleteAggr('" + $scope.aggr.id + "');"
          });

          function clickFuncParam(idx, self) {
            /*jshint validthis:true */
            var $link = $(self);
            var $input = $link.next();

            $input.val($scope.aggr.vals[idx]);
            $input.css('width', ($link.width() + 16) + 'px');

            $link.hide();
            $input.show();
            $input.focus();
            $input.select();

          }

          function inputBlur(idx, self) {
            /*jshint validthis:true */
            var $input = $(self);
            var $link = $input.prev();
            if ($input.val() !== '') {
              $link.text($input.val());

              $scope.aggr.vals[idx] = $input.val();
              $scope.$apply($scope.get_data);
            }

            $input.hide();
            $link.show();
          }

          function inputKeyPress(idx, $link, $input, e) {
            /*jshint validthis:true */

            if(e.which === 13) {
              inputBlur.call(idx, $link, $input);
            }
          }

          function inputKeyDown() {
            /*jshint validthis:true */
            this.style.width = (3 + this.value.length) * 8 + 'px';
          }

          function addElementsAndCompile() {
            $funcLink.appendTo(elem);
            var i = 0;
            _.each($scope.aggr.vals, function(val) {
              var $link = $('<a ng-click="">' + val + '</a>');
              var $input = $(paramTemplate);
              if (i > 0) {
                $('<span>, </span>').appendTo(elem);
              }
              $link.appendTo(elem);
              $input.appendTo(elem);
              (function(idx) {
                $input.blur(function() {inputBlur(idx, this)});
                $link.click(function() {clickFuncParam(idx, this)});
                $input.keypress(function(e) {inputKeyPress(idx, $link, $input, e)});

              })(i);
              $input.keyup(inputKeyDown);
              i++;
            });
            $('<span>)</span>').appendTo(elem);
            $compile(elem.contents())($scope);
          }
          addElementsAndCompile();
        }
      };
    });
});