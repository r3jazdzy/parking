'use strict';

/* Controllers */

angular
.module('ParkingControllers', [])
.controller('DashboardCtrl', ['$scope', function($scope, Park) {

  $scope['parks'] = [{"id":"colombier","status":"AVAILABLE","name":"Colombier","max":1143,"free":742},
  {"id":"gare-sud","status":"AVAILABLE","name":"Gare-Sud","max":294,"free":5},
  {"id":"dinan-chezy","status":"AVAILABLE","name":"Chézy-Dinan","max":403,"free":167},
  {"id":"vilaine","status":"AVAILABLE","name":"Vilaine","max":245,"free":148},
  {"id":"hoche","status":"AVAILABLE","name":"Hoche","max":776,"free":435},
  {"id":"kennedy","status":"AVAILABLE","name":"Centre Commercial Kennedy","max":193,"free":142},
  {"id":"lices","status":"AVAILABLE","name":"Les Lices","max":424,"free":207},
  {"id":"charles-de-gaulle","status":"AVAILABLE","name":"Charles de Gaulle","max":756,"free":416},
  {"id":"kleber","status":"AVAILABLE","name":"Kléber","max":394,"free":93},
  {"id":"arsenal","status":"AVAILABLE","name":"Arsenal","max":605,"free":445}];

  var parksName = [];
  var seriesFree = [];
  var seriesUses = [];

  for (var p in $scope['parks']) {
    parksName.push($scope['parks'][p].name);
    seriesFree.push($scope['parks'][p].free);
    seriesUses.push($scope['parks'][p].max - seriesFree[p]);
  }
  barChart(parksName, seriesFree, seriesUses);
}])
.controller('OccupationCtrl', ['$scope', function($scope) {
  //  barChart();
}])
.controller('ParksMaxCtrl', ['$scope', function($scope) {

  $scope['parks'] =
  [{"name":"Colombier","max":1143},
  {"name":"Gare-Sud","max":294},
  {"name":"Chézy-Dinan","max":403},
  {"name":"Vilaine","max":245},
  {"name":"Hoche","max":776},
  {"name":"Centre Commercial Kennedy","max":193},
  {"name":"Les Lices","max":424},
  {"name":"Charles de Gaulle","max":756},
  {"name":"Kléber","max":394},
  {"name":"Arsenal","max":605}];

  var parks = [];
  for (var p in $scope['parks']) {

    parks.push({name: $scope['parks'][p].name, y: $scope['parks'][p].max});
  }

  console.log(parks);
  pieChart(parks);
}])
.controller('AverageCtrl', ['$scope', 'Park', function($scope, Park) {

  Park.query().
  $promise.then(function(data) {

    //data = data.splice(data.length-5, 5);
    console.log(data.length);
    for (var i=0; i< data.length; i++) {
      var id = data[i]._id;

      var date = id.day + '/' + id.month + '/' + id.year + ' ' + id.hour + "h";

      console.log(date);
      console.log(data[i]._id);
    }
    //lineChart();
  });
}])
.controller('MapCtrl', ['$scope', function($scope) {
}]);

function barChart(parksName, seriesFree, seriesMax) {
  $('#chart_container').highcharts({
    chart: { type: 'column' },
    title: { text: "Taux occupation." },
    xAxis: { categories: parksName},
    yAxis: {
      allowDecimals: false,
      min: 0,
      title: { text: 'Nombre de places' }
    },
    tooltip: {
      formatter: function () {
        return '<b>' + this.x + '</b><br/>' +
        this.series.name + ': ' + this.y + '<br/>' +
        'Total: ' + this.point.stackTotal;
      }
    },
    plotOptions: {
      column: { stacking: 'normal' }
    },
    series: [{name: 'Libre',data: seriesFree},
    {name: 'Occupé',data: seriesMax}]
  });
}

function pieChart(parks) {
  $('#chart_container').highcharts({
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
    },
    title: { text: 'Nombre de places maximum.' },
    tooltip: { pointFormat: '{series.name}: <b>{point.y} places</b>' },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f}%',
          style: { color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black' }
        }
      }
    },
    series: [{
      name: "Nb de places",
      colorByPoint: true,
      data: parks/* [{ name: "Lices", y: 225 },
      { name: "Colombier", y: 150 },
      { name: "Hoche", y: 200 }]*/
    }]
  });
}

function lineChart() {
  $('#chart_container').highcharts({
    title: {
      text: 'Fréquentation des parkings',
      x: -20 //center
    },
    xAxis: {
      categories: ['12h', '13h', '14h', '15h', '16h']
    },
    yAxis: {
      title: {
        text: 'Fréquentation'
      },
      plotLines: [{
        value: 0,
        width: 1,
        color: '#808080'
      }]
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
      borderWidth: 0
    },
    series: [{
      name: 'Lices',
      data: [100, 120, 180, 110, 115]
    }, {
      name: 'Hoche',
      data: [85, 95, 92, 65, 62]
    }, {
      name: 'Colombier',
      data: [120, 150, 140, 120, 115]
    }]
  });
}
