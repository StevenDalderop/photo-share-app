/*
 * Defined the Mongoose Schema and return a Model for a Photo
 */

/* jshint node: true */

var mongoose = require('mongoose');

/*
 * Photo can have comments and we stored them in the Photo object itself using
 * this Schema:
 */

var mentionSchema = new mongoose.Schema({
    childIndex: Number,
    display: String,
    id: String,
    index: Number,
    plainTextIndex: Number    
});

var commentSchema = new mongoose.Schema({
    comment: String, // The plain text of the comment.
    comment_markup: String, // The text of the comment with id and mentions replaced.
    mentions: [mentionSchema], // The mentions within the comment.
    date_time: {type: Date, default: Date.now}, // The date and time when the comment was created.
    user_id: mongoose.Schema.Types.ObjectId,    // 	The ID of the user who created the comment.
});

// create a schema for Photo
var photoSchema = new mongoose.Schema({
    file_name: String, // 	Name of a file containing the actual photo (in the directory project6/images).
    date_time: {type: Date, default: Date.now}, // 	The date and time when the photo was added to the database
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, // The ID of the user who created the photo.
    comments: [commentSchema], // Array of comment objects representing the comments made on this photo.
    mentions: [mongoose.Schema.Types.ObjectId], // The IDs of the users who are mentioned for this photo.
    likes: [mongoose.Schema.Types.ObjectId] // The IDs of the users who like to this photo.
});

// the schema is useless so far
// we need to create a model using it
var Photo = mongoose.model('Photo', photoSchema);

// make this available to our photos in our Node applications
module.exports = Photo;
