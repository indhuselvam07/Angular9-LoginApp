var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  email:{type: String, Required: true},

  username: { type: String, Required:  true },
  
  password: { type: String, Required:  true},
  createdAt: {type:Date, Required:true},
  
});

let user = module.exports = mongoose.model('user', userSchema);
module.exports.get = function (callback, limit) {
    user.find(callback).limit(limit);
}