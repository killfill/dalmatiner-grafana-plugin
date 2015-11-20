define([
  'angular',
],
function (angular) {
  'use strict';

  var module = angular.module('grafana.directives');

  module.directive('metricQueryEditorDalmatinerdb', function() {
    return {controller: 'DalmatinerQueryCtrl', templateUrl: 'app/plugins/datasource/dalmatinerdb/partials/query.editor.html'};
  });

  module.directive('metricQueryOptionsDalmatinerdb', function() {
    return {templateUrl: 'app/plugins/datasource/dalmatinerdb/partials/query.options.html'};
  });

  module.directive('annotationsQueryEditorDalmatinerdb', function() {
    return {templateUrl: 'app/plugins/datasource/dalmatinerdb/partials/annotations.editor.html'};
  });

});
