/*  Name : Kaung Si Phyo
    Admission Number: 2234878
    class: DIT/FT/1B/05*/
var db = require('../config/databaseConfig');
module.exports = {
    findFlimByTitle: function (title, rentalRate, startIndex, callback) {
        title = "%" + title + "%";
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log("connected to database");
                if (rentalRate.length > 0) {
                    var query = "select film.film_id,film.title,film.release_year,film.rating,film.rental_rate,category.name from film, film_category,category where film.title like ?and film.film_id=film_category.film_id and film_category.category_id= category.category_id and film.rental_rate<=? LIMIT 6 OFFSET ?;";
                    var data = [title, rentalRate, startIndex];
                } else {
                    var query = "select film.film_id,film.title,film.release_year,film.rating,film.rental_rate,category.name from film, film_category,category where film.title like ?and film.film_id=film_category.film_id and film_category.category_id= category.category_id LIMIT 6 OFFSET ?;"
                    var data = [title, startIndex];
                }
                conn.query(query, data, function (err, res) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else if (res.length == 0) {
                        return callback(null, null);
                    } else {
                        return callback(null, res);
                    }
                })

            }
        })
    },

    getCountFlimByTitle: function (title, rentalRate, startIndex, callback) {
        title = "%" + title + "%";
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log("connected to database");
                if (rentalRate.length > 0) {
                    var query = "SELECT COUNT(*) as count FROM film where title like ? and rental_rate<=?";
                    var data = [title, rentalRate];
                } else {
                    var query = "SELECT COUNT(*) as count FROM film where title like ?"
                    var data = [title];
                }
                conn.query(query, data, function (err, res) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else if (res.length == 0) {
                        return callback(null, null);
                    } else {
                        return callback(null, res);
                    }
                })

            }
        })
    },

    getFilmDetail: function (film_id, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log("connected to database");
                const detailQuery = `SELECT film.title,film.release_year,film.description,film.rating,film.rental_rate,category.name as "category" from film,film_category,category where film.film_id=film_category.film_id and film_category.category_id=category.category_id and film.film_id=?;SELECT actor.first_name,actor.last_name from actor,film_actor,film WHERE film_actor.film_id=film.film_id AND actor.actor_id=film_actor.actor_id AND film.film_id=?;SELECT image_name from dvd_image where film_id=?;`;
                conn.query(detailQuery, [film_id, film_id, film_id], (err, res) => {
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        console.log(res);
                        return callback(null, res);
                    }
                })
            }
        })
    },
    findFilmBYTitleAndCategory: function (title, rental_rate, category_id, startIndex, callback) {
        var conn = db.getConnection();
        title = "%" + title + "%";
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log("connected to database in function to search dvd according to two data");
                if (rental_rate.length > 0) {
                    var findFilmQuery = `select film.film_id,film.title,film.release_year,film.rating,film.rental_rate,category.name from film,film_category,category where film.title like ? and film.rental_rate<? and film.film_id=film_category.film_id and film_category.category_id= category.category_id and film_category.category_id=? LIMIT 6 OFFSET ?;`;
                    var data = [title, rental_rate, category_id, startIndex];
                } else {
                    var findFilmQuery = `select film.film_id,film.title,film.release_year,film.rating,film.rental_rate,category.name from film,film_category,category where film.title like ? and film.film_id=film_category.film_id and film_category.category_id= category.category_id and film_category.category_id=? LIMIT 6 OFFSET ?;`
                    var data = [title, category_id, startIndex];
                }
                conn.query(findFilmQuery, data, (err, res) => {
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        console.log(res);
                        return callback(null, res);
                    }
                })
            }
        })
    },

    GetCountFilmBYTitleAndCategory: function (title, rental_rate, category_id, startIndex, callback) {
        var conn = db.getConnection();
        title = "%" + title + "%";
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log("connected to database in function to search dvd according to two data");
                if (rental_rate.length > 0) {
                    var findCountFilmQuery = `SELECT COUNT(*) as count FROM film,film_category where film.title like ? and film.rental_rate<? and film.film_id=film_category.film_id and film_category.category_id=?;`;
                    var data = [title, rental_rate, category_id];
                } else {
                    var findCountFilmQuery = `SELECT COUNT(*) as count FROM film,film_category where film.title like ? and film.film_id=film_category.film_id and film_category.category_id=?`
                    var data = [title, category_id];
                }
                conn.query(findCountFilmQuery, data, (err, res) => {
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        console.log(res);
                        return callback(null, res);
                    }
                })
            }
        })
    },
    getAllFilm: function (startIndex,callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                conn.query(`select film.film_id,film.title,film.release_year,film.rating,film.rental_rate,category.name 
                from film,film_category,category 
                where film.film_id=film_category.film_id and film_category.category_id= category.category_id 
                LIMIT 6 OFFSET ?`,[startIndex],
                (err,result)=>{
                    if(err){
                        console.log(err);
                        return callback(err,null);
                    }
                    else{
                        console.log(result);
                        return callback(null,result);
                    }
                })
            }
        })
    },
    getCountOfAllFilm: function (callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                conn.query(`select COUNT(*) as count
                from film,film_category,category 
                where film.film_id=film_category.film_id and film_category.category_id= category.category_id`,
                (err,result)=>{
                    if(err){
                        console.log(err);
                        return callback(err,null);
                    }
                    else{
                        console.log(result);
                        return callback(null,result);
                    }
                })
            }
        })
    }
}