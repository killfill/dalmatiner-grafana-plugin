define([
  'angular',
  'lodash',
  'app/core/utils/datemath',
  './dalmatiner_series',
  './query_builder',
  './directives',
  './query_ctrl',
  './aggr_add',
  './aggr_editor',
  './mget_editor',
],
function (angular, _, dateMath, DalmatinerSeries, DalmatinerQueryBuilder) {
  'use strict';

  var module = angular.module('grafana.services');

  module.factory('DalmatinerDatasource', function($q, backendSrv, templateSrv) {

    function DalmatinerDatasource(datasource) {
      this.urls = _.map(datasource.url.split(','), function(url) {
        return url.trim();
      });

      this.username = datasource.username;
      this.password = datasource.password;
      this.name = datasource.name;
      this.database = datasource.database;
      this.basicAuth = datasource.basicAuth;

    }

    DalmatinerDatasource.prototype.query = function(options) {

      var queries = options.targets
        .filter(function hiddens(target) {return !target.hide;})
        .map(function buildQuery(target) {
          var queryBuilder = new DalmatinerQueryBuilder(target);
          return queryBuilder.build().replace(/\$interval/g, (target.interval || options.interval));
        })
        .join(', ');

      //No query => return no data (inside a promise)
      if (!queries) {
        return $q(function(resolve) {resolve([]);});
      }

      var mainQuery = 'SELECT ' + templateSrv.replace(queries, options.scopedVars) + ' ' + getTimeFilter(options);

      // console.log('Q:', mainQuery);

      return this.dalmatinerQuery(mainQuery).then(function(res) {
        return {data: new DalmatinerSeries(res.s, res.d).getTimeSeries()};
      });
    };

    DalmatinerDatasource.prototype.dalmatinerQuery = function(query) {
      return this._dalmatinerRequest('GET', '/', {q: query});
    };

    DalmatinerDatasource.prototype.listBuckets = function() {
      return this._dalmatinerRequest('GET', '/buckets');
    };

    DalmatinerDatasource.prototype.listMetrics = function(bucket) {
      return this._dalmatinerRequest('GET', '/buckets/' + bucket);
    };

    DalmatinerDatasource.prototype.testDatasource = function() {
      return this.listBuckets().then(function () {
        return { status: "success", message: "Data source is working", title: "Success" };
      });
    };

    DalmatinerDatasource.prototype._dalmatinerRequest = function(method, url, params) {

      var currentUrl = this.urls.shift();
      this.urls.push(currentUrl);

      var options = {
        method: method,
        url:    currentUrl + url,
        params: params,
      };

      if (this.basicAuth) {
        options.headers = {Authorization: this.basicAuth};
      }

      return backendSrv.datasourceRequest(options).then(function ok(result) {
        return result.data;

      }, function error(err) {
        throw {message: 'Error: ' + (err.message || err.data || err.statusText), data: err.data, config: err.config };
      });
    };

    function isNumber(x) {
      return !isNaN(x);
    }

    function getTimeFilter(options) {
      var from = getDalmatinerTime(options.rangeRaw.from, false);
      var until = getDalmatinerTime(options.rangeRaw.to, true);
      var fromIsAbsolute = isNumber(from);

      if (until === 'now' && !fromIsAbsolute) {
        return 'LAST ' + from;
      }

      return 'BETWEEN ' + from + ' AND ' + until;
    }

    function getDalmatinerTime(date, roundUp) {
      if (_.isString(date)) {
        if (date === 'now') {
          return date;
        }

        var parts = /^now-(\d+)([d|h|m|s])$/.exec(date);
        if (parts) {
          var amount = parseInt(parts[1]);
          var unit = parts[2];
          return amount + unit;
        }
        date = dateMath.parse(date, roundUp);
      }
      return (date.valueOf() / 1000).toFixed(0);
    }

    return DalmatinerDatasource;

  });

});
