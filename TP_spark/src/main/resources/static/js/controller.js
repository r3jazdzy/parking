'use strict';

/* Controllers */

var app = angular
    .module('ParkingControllers', [])
    .controller('DashboardCtrl', ['$scope', 'LastParking', function ($scope, LastParking) {

        LastParking.query().
        $promise.then(function (data) {

            var parksName = [];
            var seriesFree = [];
            var seriesUses = [];

            $scope['parks'] = [];

            for (var i = 0; i < data.length; i++) {
                var value = data[i];
                parksName.push(value.name);
                seriesFree.push(value.free);
                seriesUses.push(value.max - value.free);
                $scope['parks'].push({
                    "id": value.id,
                    "status": value.status,
                    "name": value.name,
                    "max": value.max,
                    "free": value.free
                });
            }
            barChart(parksName, seriesFree, seriesUses);
        });
    }])
    .controller('ParksMaxCtrl', ['MaxParking', function (MaxParking) {

        MaxParking.query().
        $promise.then(function (data) {

            var parks = [];
            for (var i = 0; i < data.length; i++) {
                parks.push({name: data[i]._id.name, y: data[i].max});
            }


            pieChart(parks);
        });
    }])
    .controller('AverageCtrl', ['Parking', function (Parking) {

        Parking.query().
        $promise.then(function (data) {

            var categories = [];
            var series = [];

            for (var i = 0; i < data.length; i++) {
                var values = data[i].values;

                var serie = {name: data[i]._id.name, data: [], visible: false};

                for (var j = 0; j < values.length; j++) {
                    var value = values[j];
                    var date = value.day + '/' + value.month + '/' + value.year + ' ' + value.hour + "h";
                    serie.data.push(value.max - value.free);
                    if (categories[categories.length - 1] != date) categories.push(date);
                }
                series.push(serie);
            }
            lineChart(categories, series);
        });
    }]);

function barChart(parksName, seriesFree, seriesMax) {
    $('#chart_container').highcharts({
        chart: {type: 'column'},
        title: {text: "Taux occupation."},
        xAxis: {categories: parksName},
        yAxis: {
            allowDecimals: false,
            min: 0,
            title: {text: 'Nombre de places'}
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.x + '</b><br/>' +
                    this.series.name + ': ' + this.y + '<br/>' +
                    'Total: ' + this.point.stackTotal;
            }
        },
        plotOptions: {
            column: {stacking: 'normal'}
        },
        series: [{name: 'Libre', data: seriesFree},
            {name: 'Occupé', data: seriesMax}]
    });
}

function pieChart(parks) {
    $('#chart_container').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45,
                beta: 0
            }
        },
        title: {text: 'Nombre de places maximum.'},
        tooltip: {pointFormat: '{series.name}: <b>{point.y} places</b>'},
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                depth: 35,
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f}%',
                    style: {color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'}
                }
            }
        },
        series: [{
            type: 'pie',
            name: "Nb de places",
            colorByPoint: true,
            data: parks
        }]
    });
}

function lineChart(categories, series) {
    $('#chart_container').highcharts({
        chart: {
            zoomType: 'x',
            type: 'spline'
        },
        title: {
            text: 'Fréquentation des parkings',
            x: -20 //center
        },
        xAxis: {
            categories: categories
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
        plotOptions: {
            spline: {
                lineWidth: 3,
                states: {
                    hover: {
                        lineWidth: 4
                    }
                },
                marker: {
                    enabled: false
                }
            }
        },
        series: series
    });
}
