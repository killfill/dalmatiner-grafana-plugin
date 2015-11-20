define([
  'angular',
  'lodash',
  './query_builder',
],
function (angular, _) {
  'use strict';

  var module = angular.module('grafana.controllers');

  module.controller('DalmatinerQueryCtrl', function($scope, $timeout, $sce, templateSrv, $q, uiSegmentSrv) {

    $scope.init = function() {
      if (!$scope.target) { return; }

      var target = $scope.target;
      target.aggrs = target.aggrs || [];

      if (!target.bucket) {
        $scope.bucketSegment = uiSegmentSrv.newSelectMeasurement();
      } else {
        $scope.bucketSegment = uiSegmentSrv.newSegment(target.bucket);
      }

      if (!target.metric) {
        $scope.metricSegment = uiSegmentSrv.newSelectMeasurement();
      } else {
        $scope.metricSegment = uiSegmentSrv.newSegment(target.metric);
      }

      $scope.aggrs = [
        {
          name: 'avg',
          vals: ['1s']
        },
        {
          name: 'sum',
          vals: ["1s"]
        },
        {
          name: 'min',
          vals: ["1s"]
        },
        {
          name: 'max',
          vals: ["1s"]
        },
        {
          name: 'percentile',
          vals: [0.99, "1s"]
        },
        {
          name: 'derivate',
          vals: []
        },
        {
          name: 'divide',
          vals: [1]
        },
        {
          name: 'multiply',
          vals: [1]
        }
      ];
    };

    $scope.addAggr = function(aggr) {
      aggr.id = Math.ceil(Math.random() * 10000000000)
      $scope.target.aggrs.push(aggr);
      $scope.get_data();
    };

    $scope.changeAggr = function(newAggr, currentAggrId) {

      //Get the index of the aggr we want to change
      var idx = $scope.target.aggrs.reduce(function(prev, aggr, idx) { 
        return aggr.id == currentAggrId ? idx : prev
      }, 0)

      var old = $scope.target.aggrs[idx]
      newAggr.id = old.id

      if (!old.vals || old.vals.length != newAggr.vals.length)
        $scope.target.aggrs[idx] = newAggr
      else
        $scope.target.aggrs[idx].name = newAggr.name

      $scope.$parent.get_data();
    };

    $scope.deleteAggr = function(id) {
      $scope.target.aggrs = $scope.target.aggrs.filter(function(a) {return a.id != id})
      $scope.$parent.get_data();
    }

    $scope.bucketChanged = function() {
      $scope.target.bucket = $scope.bucketSegment.value;
    };

    $scope.metricChanged = function() {
      $scope.target.metric = $scope.metricSegment.value;
      $scope.get_data();
    };

    $scope.getMetrics = function() {
      return $scope.datasource.listMetrics(this.target.bucket)
        .then($scope.transformToSegments(false), $scope.handleQueryError);
    };

    $scope.toggleQueryMode = function () {
      $scope.target.rawQuery = !$scope.target.rawQuery;
      $scope.get_data();
    };

    $scope.getBuckets = function () {
      return $scope.datasource.listBuckets()
        .then($scope.transformToSegments(false), $scope.handleQueryError);
    };

    $scope.buildAggrMenu = function(functionName, idx) {
      //We could have submenus here with submenu:[]
      //Click should not contain "s
      
      return $scope.aggrs.map(function(aggr) {

          var funArgs = JSON.stringify(aggr).replace(/"/g, "'")
          if (idx) funArgs += ', ' + idx

          return {
            text: aggr.name,
            click: functionName + "(" + funArgs + ")"
          }
      })
    }

    $scope.handleQueryError = function(err) {
      $scope.parserError = err.message || 'Failed to issue metric query';
      return [];
    };

    $scope.transformToSegments = function(addTemplateVars) {

      return function(results) {
        var segments = _.map(results, function(segment) {
          // original: return uiSegmentSrv.newSegment({ value: segment.text, expandable: segment.expandable });
          return uiSegmentSrv.newSegment({ value: segment });
        });

        if (addTemplateVars) {
          _.each(templateSrv.variables, function(variable) {
            segments.unshift(uiSegmentSrv.newSegment({ type: 'template', value: '/$' + variable.name + '$/', expandable: true }));
          });
        }

        return segments;
      };
    };
    $scope.init();

  });

});
