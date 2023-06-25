/*  Name : Kaung Si Phyo
    Admission Number: 2234878
    class: DIT/FT/1B/05*/
var db = require('../config/databaseConfig');
module.exports = {
    getAllPayment: function (customer_id,callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                conn.query(`
                select film.title,film.rental_rate, dvd_image.image_name from payment 
                left join rental using (rental_id)
                left join inventory using (inventory_id)
                left join film using (film_id)
                left join dvd_image using (film_id)
                where payment.customer_id=?
                `,[customer_id],(err,result)=>{
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