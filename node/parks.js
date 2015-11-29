var mongoose = require('mongoose');
var http = require('http');

var requestDelay = 1000 * 60;

var options = {
    host: 'data.citedia.com',
    path: '/r1/parks'
};

mongoose.connect('mongodb://localhost/parks');

var parkSchema = new mongoose.Schema({
    id : String
    , status: String
    , max: Number
    , free: Number
    , date: {type: Date, default: Date.now }
}, {
    versionKey : false
});

var Park = mongoose.model('Park', parkSchema);

/*var parking = new Park({
  id: 'colombier'
, status: 'AVAILABLE'
, max: 511
, free: 143
});*/

//Park.remove({}, function() { console.log('Collection Park removed') });

/*Park.find({id: 'colombier'}, function(error, data){
  if(error)
    console.log(error);
  else
    console.log(data);
});*/

function sendRequest(options) {
    http.get(options, function (res) {

        var str = '';
        res.on('data', function (buff) {
            str += buff;
        });
        res.on('end', function () {
                var json = isJsonAvailable(str);

                if (!json)
                    sendRequest(options);
                for (var tmp in json) {
                    if (tmp === 'parks' && json.hasOwnProperty(tmp)) {
                        var parkings = json[tmp];
                        for (var index in parkings) {
                            var park = parkings[index];
                            var id = park['id'];
                            var parkInformation = park['parkInformation'];
                            var status = parkInformation['status'];
                            var max = parkInformation['max'];
                            var free = parkInformation['free'];
                            var parking = new Park({
                                id: park["id"]
                                , status: parkInformation['status']
                                , max: parkInformation['max']
                                , free: parkInformation['free']
                            });
                            parking.save(function(err) {
                                if (err) return console.error(err);
                            });
                        }
                    }
                }
            }
        );
    });
}


function isJsonAvailable(str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return false;
    }
}

sendRequest(options);

/*setInterval(function () {
    sendRequest(options);
}, requestDelay);*/
