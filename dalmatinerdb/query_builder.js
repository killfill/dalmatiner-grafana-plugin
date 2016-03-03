define([
  'lodash'
],
function () {
  'use strict';

  function DalmatinerQueryBuilder(target) {
    this.target = target;
  }

  var p = DalmatinerQueryBuilder.prototype;

  p.build = function() {
    return this.target.rawQuery ? this._modifyRawQuery() : this._buildQuery();
  };

  p._buildQuery = function() {

    var q = this.target;

    if (!q.bucket) {
      throw "Bucket is missing";
    }

    if (!q.metric) {
      throw "Metric is missing";
    }

    var src = q.metric + " BUCKET '" + q.bucket + "'";
    if (q.mget_enabled && q.mget && q.mget !== 'none') {
      src = q.mget + "(" + src + ")";
    }
    if (q.aggrs) {
      q.aggrs.forEach(function(aggr) {
        src = aggr.name + "(" + src;
        if (aggr.vals.length > 0) {
          src = src + ", " + aggr.vals.join(", ");
        }
        src = src + ")";
      });
    }

    if (q.alias && q.alias !== "") {
      src = src + " AS '" + q.alias + "'";
    }

    //For switching to raw query
    this.target.query = src;
    return src;
  };

  p._modifyRawQuery = function () {
    var query = this.target.query.replace(";", "");
    return query;
  };

  return DalmatinerQueryBuilder;
});
