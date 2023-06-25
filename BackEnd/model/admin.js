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
            }
            else {
                console.log("Connected in admin.js");
                const query = "SELECT * FROM staff WHERE email=? AND password=?";
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
    },

    addActor: function (first_name, last_name, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected to database user.js addActor function");
                var sql = "INSERT INTO actor(first_name,last_name) values(?,?)";
                conn.query(sql, [first_name, last_name], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    }
                    else {
                        console.log(result);
                        return callback(null, result);
                    }
                })
            }
        })
    },
    addCustomer: function (data, callback) {
        //destructure the data 
        var { store_id, first_name, last_name, email, address_line1, address_line2, district, city, postal_code, phone,password } = data;
        const valueToEncrypt = password;
        const sha1 = crypto.createHash('sha1');
        sha1.update(valueToEncrypt);
        const encryptedValue = sha1.digest('hex');
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected to database in user.js addCustomer function");
                // insert the address first as address table is child table of customer
                conn.beginTransaction(function (err) {
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    }
                    else {
                        conn.query("SELECT city_id FROM city WHERE city=?", [city], (err, result) => {
                            if (err) {
                                console.log(err);
                                conn.rollback(function () {
                                    return callback("city_id_error", null);
                                });
                            }
                            else {
                                console.log(result)
                                if (result.length == 0) {
                                    conn.rollback(function () {
                                        return callback("city_id_error", null);
                                    });
                                }
                                else {
                                    const city_id = result[0].city_id;
                                    conn.query('INSERT INTO address(address,address2,district,city_id,postal_code,phone) VALUES(?,?,?,?,?,?)', [address_line1, address_line2, district, city_id, postal_code, phone], function (err, result) {
                                        if (err) {
                                            console.log(err);
                                            conn.rollback(function () {
                                                return callback(err, null);
                                            });
                                        }

                                        const address_id = result.insertId;
                                        console.log(address_id);
                                        conn.query('INSERT INTO customer(store_id,first_name,last_name,email,address_id,password) VALUES(?,?,?,?,?,?)', [store_id, first_name, last_name, email, address_id,encryptedValue], function (err, result) {
                                            if (err) {
                                                console.log(err);
                                                conn.rollback(function () {
                                                    if (err.code == "ER_NO_REFERENCED_ROW_2") {
                                                        return callback("store_id_error", null);
                                                    }
                                                    else if (err.code == 'ER_DUP_ENTRY') {
                                                        return callback("email_error", null);
                                                    }
                                                    else return callback(err, null);
                                                });
                                            }
                                            else {
                                                conn.commit(function (err) {
                                                    if (err) {
                                                        console.log(err);
                                                        conn.rollback(function () {
                                                            return callback(err, null);
                                                        });
                                                    }
                                                    else {
                                                        return callback(null, result.insertId);
                                                    }

                                                    conn.end();
                                                });
                                            }
                                        });
                                    });
                                }
                            }
                        })
                    }

                });

            }
        })
    },

    addDvd: function (formData, image, callback) {
        const { title,store_id, release_year, language, original_language, rental_duration, rental_rate, film_length, replacement_cost, rating, film_description, special_features,category } = formData;
        const image_name = image.originalname;
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected to database in user.js addDVD function");
                const addDvDQuery = `INSERT INTO film
                (title,description,release_year,language_id,original_language_id,rental_duration,rental_rate,length,replacement_cost,rating,special_features) 
                VALUES(?,?,?,?,?,?,?,?,?,?,?)`;
                const values = [
                    title,
                    film_description ||null,
                    release_year || null,
                    language,
                    original_language || null,
                    rental_duration || 3,
                    rental_rate || 4.99,
                    film_length || null,
                    replacement_cost || 19.99,
                    rating || "G", 
                    special_features || null
                ]
                conn.beginTransaction(function (err) {
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    }
                    else {
                        conn.query(addDvDQuery, values, (err, result) => {
                            if (err) {
                                console.log(err)
                                conn.rollback(() => {
                                    return callback(err, null);
                                });
                            } else {
                                const film_id=result.insertId;
                                conn.query("INSERT INTO dvd_image(image_name,film_id) VALUES(?,?)", [image_name,film_id ], (err, result) => {
                                    if (err) {
                                        console.log(err);
                                        conn.rollback(() => {
                                            return callback(err, null);
                                        })
                                    } else {
                                        conn.query("INSERT INTO film_category (film_id,category_id) VALUES(?,?)",[film_id,category],(err,result)=>{
                                            if(err){
                                                console.log(err);
                                                conn.rollback(()=>{
                                                    return callback(err,null);
                                                })
                                            }else{
                                                conn.query("INSERT INTO inventory(film_id,store_id) VALUES(?,?)",[film_id,store_id],(err,result)=>{
                                                    if(err){
                                                        console.log(err);
                                                        conn.rollback(()=>{
                                                            return callback(err,null);
                                                        })
                                                    }else{
                                                        conn.commit(() => {
                                                            if (err) {
                                                                console.log(err);
                                                                conn.rollback(() => {
                                                                    return callback(err, null);
                                                                })
                                                            }
                                                            else return callback(null, result);
                                                            conn.end();
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }
}
