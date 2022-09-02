var mongoose = require("mongoose");

var activitiesSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    date_time: {type: Date, default: Date.now},
    type: String,
    photo: {type: mongoose.Schema.Types.ObjectId, ref: 'Photo'}
});

const Activity = mongoose.model('Activity', activitiesSchema);

module.exports = Activity;