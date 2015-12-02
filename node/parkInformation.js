var mongoose = require('mongoose');
var http = require('http');
var proj4 = require('proj4');

var options = {
    host: 'data.citedia.com',
    path: '/r1/parks'
};

mongoose.connect('mongodb://localhost/parks');

var parkInformationSchema = new mongoose.Schema({
    id: String
    , name: String
    , geometry: {
        'type': {
            type: String,
            required: true,
            enum: ['Point', 'LineString', 'Polygon'],
            default: 'Point'
        },
        coordinates: [
            { type: [ Number ] }
        ]
    }
} , {
    versionKey: false
});


var ParkInformation = mongoose.model('ParkInformation', parkInformationSchema);

/*var parkInformation = new ParkInformation({
    id: 'colombier'
    , name: 'Colombier'
    , geometry: {type: 'Point', coordinates: [-187247.17,6125141.12]}
});*/

ParkInformation.remove({}, function(){ console.log("collection ParkInformation removed")});

function sendRequest(options) {
    http.get(options, function (res) {

        var str = "";
        res.on("data", function (buff) {
            str += buff;
        });
        res.on("end", function () {
            var json = isJsonAvailable(str);

            if (!json)
                sendRequest(options);
            for (var tmp in json) {
                if (tmp === "features" && json.hasOwnProperty(tmp)) {
                    var features = json[tmp];
                    for (var parkInfo in features) {
                        if (parkInfo === "features" && features.hasOwnProperty(parkInfo)) {
                            var parkings = features[parkInfo];
                            for (var index in parkings) {
                                getNameAndInsertParking(parkings[index]);
                            }
                        }
                    }
                }
            }
        });
    });
}

function convertCoordinates(coordinates){
	var firstProjection = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +units=m +k=1.0 +nadgrids=@null +no_defs"
	var secondProjection = "+proj=longlat +a=6378137.0 +b=6356752.31424518 +ellps=WGS84 +datum=WGS84 +units=degrees"
	return proj4(firstProjection, secondProjection, coordinates);
}

var getNameAndInsertParking = function(park){
	var parkGeometry = park.geometry;
    var coordinates = convertCoordinates(parkGeometry.coordinates);
	var tmp = coordinates[0];
	coordinates[0] = coordinates[1];
	coordinates[1] = tmp;
	parkGeometry.coordinates = coordinates;
    var parkId = park.id;
    var url = {
        host: options.host,
        path: options.path + '/' + parkId
    };
    http.get(url, function (res) {
        var str = "";
        res.on("data", function (buff) {
            str += buff;
        });
        res.on("end", function () {
            json = isJsonAvailable(str);
            if (!json)
                getNameAndInsertParking(park);
            else {
                var parkName = json.name;
                var parkInformation = new ParkInformation({
                    id: parkId
                    , name: parkName
                    //, geometry: {type: 'Point', coordinates: [-187247.17,6125141.12]}
                    ,geometry: parkGeometry
                });
                parkInformation.save(function(err){
                    if(err)
                        return console.error(err);
                });
            }
        });
    });
};


function isJsonAvailable(str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return false;
    }
}


sendRequest(options);

ParkInformation.find({}, function(err, data){
    console.log(data);
});

