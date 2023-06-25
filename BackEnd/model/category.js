/*  Name : Kaung Si Phyo
    Admission Number: 2234878
    class: DIT/FT/1B/05*/
var db = require('../config/databaseConfig');
module.exports = {
    getCategroy: function(callback){
        var conn=db.getConnection();
        conn.connect(function(err){
            if (err){
                console.log(err);
                return callback(err,null);
            }
            else{
                console.log("connected to database");
                const query="SELECT category_id, name FROM category";
                conn.query(query,[],(err,res)=>{
                    conn.end();
                    if(err){
                        console.log(err);
                        return callback(err,null);
                    }
                    else{
                        console.log(res);
                        return callback(null,res);
                    }
                })
            }
        })
    },

    getFilmByCategory: function(category_id,rentalRate,startIndex,callback){
        console.log(category_id);
        var conn=db.getConnection();
        conn.connect(function(err){
            if (err){
                console.log(err);
                return callback(err,null);
            }
            else{
                console.log("connected to database");
                if(rentalRate.length > 0)
                {
                    console.log("I M HERE");
                    var retriveFilmQuery=`select film.title,film.rating, film.release_year,film.film_id,film.rental_rate, category.name from film,film_category,category where film.film_id=film_category.film_id and film_category.category_id= category.category_id and film_category.category_id=? and film.rental_rate<=? LIMIT 6 OFFSET ?;`;
                    var data=[category_id,rentalRate,startIndex];
                }
                
                else {
                    console.log("i m here")
                    var retriveFilmQuery=`select film.title,film.rating, film.release_year,film.film_id,film.rental_rate,category.name from film,film_category,category where film.film_id=film_category.film_id and  category.category_id=film_category.category_id and film_category.category_id=? LIMIT 6 OFFSET ?;`;
                    var data=[category_id,startIndex];
                }
                conn.query(retriveFilmQuery,data,(err,res)=>{
                    if(err){
                        console.log(err);
                        return callback(err,null);
                    }
                    else{
                        console.log(res);
                        return callback(null,res);
                    }
                })
            }
        })
    },
    getCountFilmByCategory: function(category_id,rentalRate,startIndex,callback){
        var conn=db.getConnection();
        conn.connect(function(err){
            if (err){
                console.log(err);
                return callback(err,null);
            }
            else{
                console.log("connected to database");
                if(rentalRate.length > 0)
                {
                    var getCountFilmByCategory=`SELECT COUNT(*) as count FROM  film,film_category where film.film_id=film_category.film_id and film_category.category_id=? and film.rental_rate<=?`;
                    var data=[category_id,rentalRate];
                }
                
                else {
                    var getCountFilmByCategory=`SELECT COUNT(*) as count FROM film,film_category where film.film_id=film_category.film_id and film_category.category_id=?`;
                    var data=[category_id];
                }
                conn.query(getCountFilmByCategory,data,(err,res)=>{
                    if(err){
                        console.log(err);
                        return callback(err,null);
                    }
                    else{
                        console.log(res);
                        return callback(null,res);
                    }
                })
            }
        })
    }
}