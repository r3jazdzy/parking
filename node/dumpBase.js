var mongoose = require('mongoose');
var fs = require('fs');

mongoose.connect('mongodb://localhost/parks');

var parkSchema = new mongoose.Schema({
    id : String
    , status: String
    , max: Number
    , free: Number
    , date: {type: Number, default: Date.now }
}, {
    versionKey : false
});

var Park = mongoose.model('Park', parkSchema);

Park.find({}, function(error, data){
    fs.writeFile("/home/pi/Western_Digital/dump.json", data, function(err) {
        if(err) {
            console.log(err);
        }

        console.log("The file was saved!");
    });
});