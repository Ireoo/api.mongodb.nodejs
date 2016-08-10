var mongoose = require('mongoose');
var schema   = mongoose.Schema,
    id       = schema.ObjectId;
mongoose.set('debug', true);

 var db = mongoose.connect('mongodb://qiyi:meiyoumima@120.27.142.69:27017/qiyi');
//var db = mongoose.connect('mongodb://admin:NFxMHxdS5Oj7@mongodb-ccalaop1.myalauda.cn:10948');
//var db = mongoose.connect(process.env.MONGODB_CONNECTION);

var entity = new schema({
    "title"          : {type : String, default: ''},
    "city"           : {type : String, default: ''},
    "lat"            : {type : Number, default: 0},
    "lng"            : {type : Number, default: 0},
    "address"        : {type : String, default: ''},
    "telephone"      : {type : String, default: ''},
    "tag"            : {type : String, default: ''},
    "uid"            : {type : String, default: '', unique: true},
    "image_num"      : {type : Number, default: 0},
    "comment_num"    : {type : Number, default: 0},
    "overall_rating" : {type : Number, default: 0},
    "context"        : {type : String, default: ''}
});  // , { versionKey: false }
db.model('entity', entity);


//var scenery = new schema({
//    title   : {type : String, default: ''},
//    url     : {type : String, default: '', unique: true},
//    image   : {type : Number, default: ''},
//    status  : {type : Number, default: 0},
//    timer   : {type : Number, default: 0}
//});  // , { versionKey: false }
//db.model('scenery', scenery);

exports.entity = db.model('entity');