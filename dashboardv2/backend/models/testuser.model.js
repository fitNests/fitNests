const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testuserSchema = new Schema({
        pos : {
            type : Array,
            default : [],
        },
        action : {
            type : String,
        },
        delay : {
            type : Number,
        },
        user1 : {
            type : Array,
            default : [1,1,1,1,1,1]
        },
        user2 : {
            type : Array,
            default : [0,0,0,0,0,0]
        },
        user3 : {
            type : Array,
            default : [4,4,4,4,4,4]
        },

});

const Testuser = mongoose.model('TestUser', testuserSchema);

module.exports = Testuser;

/* Test for insomnia param
{
	"id" : "jake",
	"pos" : [1,2,3],
	"action" : "dancex",
	"delay" : 23,
	"user1" : [4,2,2],
   "user2" : [13,2,5]
  
}
*/