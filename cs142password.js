var crypto = require('crypto');
/*
* Return a salted and hashed password entry from a
* clear text password.
* @param {string} clearTextPassword
* @return {object} passwordEntry
* where passwordEntry is an object with two string
* properties:
*      salt - The salt used for the password.
*      hash - The sha1 hash of the password and salt
*/
function makePasswordEntry(clearTextPassword) {
    let salt = crypto.randomBytes(8).toString('hex');
    let sha1 = crypto.createHash('sha1');
    sha1.update(salt + clearTextPassword);
    let hash = sha1.digest('hex');

    let passwordEntry = {
        salt: salt,
        hash: hash
    };

    return passwordEntry;
}

/*
* Return true if the specified clear text password
* and salt generates the specified hash.
* @param {string} hash
* @param {string} salt
* @param {string} clearTextPassword
* @return {boolean}
*/
function doesPasswordMatch(hash, salt, clearTextPassword) {
    let sha1 = crypto.createHash('sha1');
    sha1.update(salt + clearTextPassword);
    return sha1.digest('hex') === hash;
}

module.exports = {makePasswordEntry, doesPasswordMatch};