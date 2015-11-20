define([
  'lodash',
],
function (_) {
  'use strict';

  function DalmatinerSeries(start, seriesList) {
    this.start = start;
    this.seriesList = seriesList;
  }

  var p = DalmatinerSeries.prototype;

  p.getTimeSeries = function() {
    var output = [];
    var self = this;
    var start = this.start;

    _.each(_.sortBy(self.seriesList, 'n'), function(series) {
      var seriesName = series.n;
      var seriesData = series.v;
      var seriesResolution = series.r / 1000;
      seriesData = seriesData.map(function(e, i) {
        return [e, (start+(i*seriesResolution)) * 1000];
      });
      output.push({ target: seriesName, datapoints: seriesData });

    });
    return output;
  };

  return DalmatinerSeries;
});
