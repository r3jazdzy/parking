var mongoose = require('mongoose');
var http = require('http');

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

var parkInformation = new ParkInformation({
    id: 'colombier'
    , name: 'Colombier'
    , geometry: {type: 'Point', coordinates: [-187247.17,6125141.12]}
});

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

var getNameAndInsertParking = function(park){
    var parkGeometry = park["geometry"];
    var parkId = park["id"];
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
                var parkName = json["name"];
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

/*¹ParkInformation.find({}, function(err, data){
    console.log(data);
});*/

