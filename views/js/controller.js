'use strict';

/* Controllers */

angular
  .module('ParkingControllers', [])
  .controller('DashboardCtrl', ['$scope', function($scope) {
  }])
  .controller('OccupationCtrl', ['$scope', function($scope) {
    barChart();
  }])
  .controller('ParksMaxCtrl', ['$scope', function($scope) {
    pieChart();
  }])
  .controller('AverageCtrl', ['$scope', function($scope) {
    lineChart();
  }])
  .controller('MapCtrl', ['$scope', function($scope) {
  }]);

function barChart() {
  $('#chart_container').highcharts({
    chart: { type: 'column' },
    title: { text: "Taux occupation." },
    xAxis: { categories: ['Colombier','Lices','Hoche']},
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
    series: [{name: 'Libre',data: [10, 8, 15]},
      {name: 'Occupé',data: [5, 2, 8]}]
  });
}

function pieChart() {
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
        data: [{ name: "Lices", y: 225 },
          { name: "Colombier", y: 150 },
          { name: "Hoche", y: 200 }]
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
