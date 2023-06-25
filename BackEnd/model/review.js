/*  Name : Kaung Si Phyo
    Admission Number: 2234878
    class: DIT/FT/1B/05*/
var db = require('../config/databaseConfig');
module.exports = {
    addReview:(data,callback)=>{
        const {name,email,rating,comment,film_id}=data;
        var conn=db.getConnection();
        conn.connect(function(err){
            if (err){
                console.log(err);
                return callback(err,null);
            }
            else{
                console.log("connect to database in comment.js add comments function");
                const addCommentQuery="INSERT INTO dvd_reviews(name,email,rating_score,comment,film_id) VALUES(?,?,?,?,?)";
                const data=[
                    name,email,
                    rating,
                    comment || null,
                    film_id
                ]
                conn.query(addCommentQuery,data,(err,res)=>{
                    if(err){
                        console.log(err);
                        return callback(err,null);
                    }
                    else{
                        console.log(res);
                        return callback(null,res);
                    }
                })
            }})
    },
    retreiveReview:(film_id,callback)=>{
        var conn=db.getConnection();
        conn.connect(function(err){
            if (err){
                console.log(err);
                return callback(err,null);
            }
            else{
                console.log("connect to database in comment.js add comments function");
                const selectQuery="SELECT * FROM dvd_reviews WHERE film_id=?";
                conn.query(selectQuery,[film_id],(err,res)=>{
                    if(err){
                        console.log(err);
                        return callback(err,null);
                    }
                    else{
                        console.log(res);
                        return callback(null,res);
                    }
                })
            }})
    }
}