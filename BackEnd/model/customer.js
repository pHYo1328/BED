/*  Name : Kaung Si Phyo
    Admission Number: 2234878
    class: DIT/FT/1B/05*/
var db = require('../config/databaseConfig');
var config = require('../config/config');
var jwt = require('jsonwebtoken');

const crypto = require('crypto');

module.exports = {
    loginUser: function (email, password, callback) {
        const valueToEncrypt = password;
        const sha1 = crypto.createHash('sha1');

        sha1.update(valueToEncrypt);
        const encryptedValue = sha1.digest('hex');

        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log("Connected!");
                const query = "SELECT customer_id,active FROM customer WHERE email=? AND password=?";
                conn.query(query, [email, encryptedValue], (error, results) => {
                    if (error) {
                        callback(error, null);
                        return;
                    } else if (results.length === 0) {
                        return callback(null, null);
                    } else {
                        const user = results[0];
                        return callback(null, user);
                    }
                });
            }
        });
    }
}