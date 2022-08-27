/* jshint node: true */

/*
 * This builds on the webServer of previous projects in that it exports the current
 * directory via webserver listing on a hard code (see portno below) port. It also
 * establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch any file accessible
 * to the current user in the current directory or any of its children.
 *
 * This webServer exports the following URLs:
 * /              -  Returns a text status message.  Good for testing web server running.
 * /test          - (Same as /test/info)
 * /test/info     -  Returns the SchemaInfo object from the database (JSON format).  Good
 *                   for testing database connectivity.
 * /test/counts   -  Returns the population counts of the cs142 collections in the database.
 *                   Format is a JSON object with properties being the collection name and
 *                   the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the database.
 * /user/list     -  Returns an array containing all the User objects from the database.
 *                   (JSON format)
 * /user/:id      -  Returns the User object with the _id of id. (JSON format).
 * /photosOfUser/:id' - Returns an array with all the photos of the User (id). Each photo
 *                      should have all the Comments on the Photo (JSON format)
 *
 */

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

require('dotenv').config();

var async = require('async');

var express = require('express');
var app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const processFormBody = multer({ storage: multer.memoryStorage() }).single('uploadedphoto');
const fs = require("fs");
const cs142password = require('./cs142password.js');


// Load the Mongoose schema for User, Photo, and SchemaInfo
var User = require('./schema/user.js');
var Photo = require('./schema/photo.js');
var SchemaInfo = require('./schema/schemaInfo.js');
var Activity = require('./schema/activity.js');

let uri;

if (process.env.database === "mongo-atlas") {
    uri = `mongodb+srv://steven:${process.env.password}@cluster0.gihhua4.mongodb.net/?retryWrites=true&w=majority`;
} else {
    uri = 'mongodb://localhost/cs142project6';
}

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));
app.use(session({ secret: 'secretKey', resave: false, saveUninitialized: false, cookie: { maxAge: 3 * 60 * 60 * 1000 } }));
app.use(bodyParser.json());

app.get('/', function (request, response) {
    response.send('Simple web server of files from ' + __dirname);
});

/*
 * Use express to handle argument passing in the URL.  This .get will cause express
 * To accept URLs with /test/<something> and return the something in request.params.p1
 * If implement the get as follows:
 * /test or /test/info - Return the SchemaInfo object of the database in JSON format. This
 *                       is good for testing connectivity with  MongoDB.
 * /test/counts - Return an object with the counts of the different collections in JSON format
 */

app.post('/admin/login', (req, res) => {
    const login_name = req.body.login_name;
    const password = req.body.password;

    User
        .findOne({ login_name: login_name })
        .select('+password_digest +salt')
        .exec((err, user) => {
            if (err) {
                res.status(500).send(JSON.stringify(err));
                return;
            }

            if (user === null) {
                console.log('User with login_name: ' + login_name + ' not found.');
                res.status(400).send({ errors: { login_name: 'User not found' } });
                return;
            }

            if (!cs142password.doesPasswordMatch(user.password_digest, user.salt, password)) {
                res.status(400).send({ errors: { password: 'Invalid password' } });
                return;
            }

            let activity = new Activity({ user: user._id, type: 'login' });
            activity.save(err_ => {
                if (err_) {
                    res.status(500).send(JSON.stringify(err));
                }
            });

            req.session.user_id = user._id;
            req.session.save();

            let user_ = (({ _id, first_name, last_name, description, occupation, location }) => (
                { _id, first_name, last_name, description, occupation, location }))(user);

            res.status(200).send(JSON.stringify(user_));
        });
});


app.post('/admin/logout', (req, res) => {
    if (req.session.user_id === undefined) {
        res.status(400).send('Not logged in');
        return;
    }

    let user_id = req.session.user_id;

    req.session.destroy(err => {
        if (err) {
            res.status(500).send(JSON.stringify(err));
        }

        let activity = new Activity({ user: user_id, type: 'logout' });
        activity.save(err_ => {
            if (err_) {
                res.status(500).send(JSON.stringify(err));
            }
        });

        res.status(200).send();
    });
});


app.post('/user', (req, res) => {
    let data = req.body;

    if (data.password === "") {
        res.status(400).send({ errors: { password: { message: "path 'password' is required" } } });
        return;
    }

    let passwordObject = cs142password.makePasswordEntry(data.password);
    data.password_digest = passwordObject.hash;
    data.salt = passwordObject.salt;

    let user = new User(data);

    user.save({ validateBeforeSave: true }, err => {
        if (err) {
            res.status(400).send(JSON.stringify(err));
            return;
        }

        let activity = new Activity({ user: user._id, type: 'register' });
        activity.save(err_ => {
            if (err_) {
                res.status(500).send(JSON.stringify(err));
            }
        });

        res.status(200).send();
    });
});


app.use((req, res, next) => {
    if (!req.session.user_id) {
        console.log('not logged in');
        res.status(401).send('not authorized');
        return;
    }
    next();
});


app.get('/test/:p1', function (request, response) {
    // Express parses the ":p1" from the URL and returns it in the request.params objects.
    console.log('/test called with param1 = ', request.params.p1);

    var param = request.params.p1 || 'info';

    if (param === 'info') {
        // Fetch the SchemaInfo. There should only one of them. The query of {} will match it.
        SchemaInfo.find({}, function (err, info) {
            if (err) {
                // Query returned an error.  We pass it back to the browser with an Internal Service
                // Error (500) error code.
                console.error('Doing /user/info error:', err);
                response.status(500).send(JSON.stringify(err));
                return;
            }
            if (info.length === 0) {
                // Query didn't return an error but didn't find the SchemaInfo object - This
                // is also an internal error return.
                response.status(500).send('Missing SchemaInfo');
                return;
            }

            // We got the object - return it in JSON format.
            console.log('SchemaInfo', info[0]);
            response.end(JSON.stringify(info[0]));
        });
    } else if (param === 'counts') {
        // In order to return the counts of all the collections we need to do an async
        // call to each collections. That is tricky to do so we use the async package
        // do the work.  We put the collections into array and use async.each to
        // do each .count() query.
        var collections = [
            { name: 'user', collection: User },
            { name: 'photo', collection: Photo },
            { name: 'schemaInfo', collection: SchemaInfo }
        ];
        async.each(collections, function (col, done_callback) {
            col.collection.countDocuments({}, function (err, count) {
                col.count = count;
                done_callback(err);
            });
        }, function (err) {
            if (err) {
                response.status(500).send(JSON.stringify(err));
            } else {
                var obj = {};
                for (var i = 0; i < collections.length; i++) {
                    obj[collections[i].name] = collections[i].count;
                }
                response.end(JSON.stringify(obj));

            }
        });
    } else {
        // If we know understand the parameter we return a (Bad Parameter) (400) status.
        response.status(400).send('Bad param ' + param);
    }
});

/*
 * URL /user/list - Return all the User object.
 */
app.get('/user/list', function (request, response) {
    User.find({}, function (err, users) {
        if (err) {
            response.status(500).send(JSON.stringify(err));
            return;
        }
        let users_ = users.map(({ _id, first_name, last_name }) => ({ _id, first_name, last_name }));
        response.status(200).send(users_);
    });
});

/*
 * URL /user/:id - Return the information for User (id)
 */
app.get('/user/:id', function (request, response) {
    var id = request.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        response.status(400).send('Not found');
        return;
    }
    User.findOne({ _id: id }, function (err, user) {
        if (err) {
            response.status(500).send(JSON.stringify(err));
            return;
        }
        if (user === null) {
            console.log('User with _id:' + id + ' not found.');
            response.status(400).send('Not found');
            return;
        }
        let user_ = (({ _id, first_name, last_name, description, occupation, location }) => (
            { _id, first_name, last_name, description, occupation, location }))(user);
        response.status(200).send(user_);
    });
});


/*
 * URL /photosOfUser/:id - Return the Photos for User (id)
 */
app.get('/photosOfUser/:id', function (request, response) {
    var id = request.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        response.status(400).send('Not found');
        return;
    }

    Photo.find({ user_id: id }, async function (err, photos) {
        if (err) {
            response.status(500).send(JSON.stringify(err));
            return;
        }
        if (photos === null) {
            console.log('Photos for user with _id:' + id + ' not found.');
            response.status(400).send('Not found');
            return;
        }

        let photos_ = JSON.parse(JSON.stringify(photos));

        await Promise.all(photos_.map(async function (photo) {
            delete photo.__v;
            await Promise.all(photo.comments.map(async function (comment) {
                try {
                    let user = await User.findOne({ _id: comment.user_id });


                    if (user === null) {
                        console.log('User with _id:' + id + ' not found.');
                        response.status(400).send('Not found');
                        return;
                    }
                    comment.user = (({ _id, first_name, last_name }) => ({ _id, first_name, last_name }))(user);
                    delete comment.user_id;

                } catch (_err) {
                    response.status(500).send(JSON.stringify(_err));
                }
            }));
        }));
        response.status(200).send(photos_);
    });
});


app.post('/commentsOfPhoto/:photo_id', (req, res) => {
    const photo_id = req.params.photo_id;
    const comment = req.body.comment;
    const user_id = req.session.user_id;

    if (comment === "") {
        res.status(400).send();
        return;
    }

    Photo.findOne({ _id: photo_id }, (err, photo) => {
        if (err) {
            res.status(500).send(JSON.stringify(err));
            return;
        }
        if (photo === null) {
            res.status(400).send('Photo with _id: ' + photo_id + ' not found.');
            return;
        }

        const new_comment = {
            comment: comment,
            user_id: user_id
        };

        photo.comments.push(new_comment);

        photo.save(_err => {
            if (_err) {
                res.status(500).send(JSON.stringify(_err));
                console.log(_err);
                return;
            }

            let activity = new Activity({ user: user_id, type: 'add comment', photo: photo_id });
            activity.save(error_ => {
                if (error_) {
                    res.status(500).send(JSON.stringify(error_));
                }
            });

            res.status(200).send();
        });
    });

});


app.put('/photo/:photo_id', (req, res) => {
    const photo_id = req.params.photo_id;
    const like = req.body.like;
    const user_id = req.session.user_id;

    if (like === "") {
        res.status(400).send();
        return;
    }

    Photo.findOne({ _id: photo_id }, async function (err, photo) {
        if (err) {
            res.status(500).send(JSON.stringify(err));
            return;
        }
        if (photo === null) {
            res.status(400).send('photo not found');
            return;
        }
        photo.likes = photo.likes.filter(id => id.toString() !== user_id);
        if (like) {
            photo.likes.push(user_id);
        }

        await photo.save(err_ => {
            if (err_) {
                res.status(500).send(JSON.stringify(err));
            }
        });

        photo = JSON.parse(JSON.stringify(photo));

        await Promise.all(photo.comments.map(async function (comment) {
            try {
                let user = await User.findOne({ _id: comment.user_id });
                if (user === null) {
                    res.status(400).send('user not found');
                }
                comment.user = (({ _id, first_name, last_name }) => ({ _id, first_name, last_name }))(user);
            } catch (_err) {
                res.status(500).send(JSON.stringify(_err));
            }
        }));

        res.status(200).send(photo);
    });
});


app.post('/photos/new', (request, response) => {
    processFormBody(request, response, function (err) {
        if (err) {
            // XXX -  Insert error handling code here.
            response.status(500).send();
            return;
        }
        if (!request.file) {
            response.status(400).send('No image send');
            return;
        }
        // request.file has the following properties of interest
        //      fieldname      - Should be 'uploadedphoto' since that is what we sent
        //      originalname:  - The name of the file the user uploaded
        //      mimetype:      - The mimetype of the image (e.g. 'image/jpeg',  'image/png')
        //      buffer:        - A node Buffer containing the contents of the file
        //      size:          - The size of the file in bytes

        // XXX - Do some validation here.
        if (!(['image/jpg', 'image/jpeg', 'image/png'].includes(request.file.mimetype))) {
            response.status(400).send('invalid mimetype');
            return;
        }
        if (request.file.size > 2 ** 10 * 4000) {
            response.status(400).send('filesize too large');
            return;
        }

        // We need to create the file in the directory "images" under an unique name. We make
        // the original file name unique by adding a unique prefix with a timestamp.
        const timestamp = new Date().valueOf();
        const filename = 'U' + String(timestamp) + request.file.originalname;

        fs.writeFile("./images/" + filename, request.file.buffer, function (err_) {
            // XXX - Once you have the file written into your images directory under the name
            // filename you can create the Photo object in the database
            if (err_) {
                console.log(err_);
                response.status(500).send(JSON.stringify(err_));
            }

            const user_id = request.session.user_id;

            const photo_object = {
                user_id: user_id,
                comments: [],
                file_name: filename
            };

            const photo = new Photo(photo_object);
            photo.save(error => {
                if (error) {
                    console.log(error);
                    response.status(500).send(error);
                    return;
                }

                let activity = new Activity({ user: request.session.user_id, type: 'photo upload', photo: photo._id });
                activity.save(error_ => {
                    if (error_) {
                        response.status(500).send(JSON.stringify(error_));
                    }
                });

                response.status(200).send();
            });
        });
    });
});


app.post('/mentionsOfPhoto/:photo_id', (req, res) => {
    const mentions = req.body.mentions;
    const photo_id = req.params.photo_id;

    Photo.findOne({ _id: photo_id }, (err, photo) => {
        if (err) {
            res.status(500).send(JSON.stringify(err));
            return;
        }
        if (photo === null) {
            res.status(400).send('photo does not exist');
            return;
        }

        for (const user of mentions) {
            photo.mentions.push(user.id);
        }

        photo.save((err_) => {
            if (err_) {
                res.status(500).JSON.stringify(err);
            }
            res.status(200).send('mentions added');
        });
    });
});


app.get('/mentionedPhotos/:user_id', (req, res) => {
    const user_id = req.params.user_id;

    Photo
        .find({ mentions: user_id })
        .populate('user_id')
        .exec((err, photos) => {
            if (err) {
                res.status(500).send(JSON.stringify(err));
                return;
            }
            res.status(200).send(photos);
        });
});


app.get('/activities', (req, res) => {
    Activity
        .find({}, null, { limit: 5, sort: { date_time: "desc" } })
        .populate("user")
        .populate("photo")
        .populate({
            path: "photo",
            populate: {path: "user_id"}
        })
        .exec((err, activities) => {
            if (err) {
                res.status(500).send(JSON.stringify(err));
                return;
            }
            res.status(200).send(activities);
        });
});


var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});
