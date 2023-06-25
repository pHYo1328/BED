/*  Name : Kaung Si Phyo
    Admission Number: 2234878
    class: DIT/FT/1B/05*/
var db = require('../config/databaseConfig');
module.exports = {
    getInventoryID: function (user_id, film_id, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log("connected to database in inventory.js getInventoryID function");
                const getInventoryIDQuery = `select distinct inventory.inventory_id from inventory
                where film_id=? and store_id=(select store_id from customer where customer_id=?) and
                not exists (select * from rental where rental.inventory_id = inventory.inventory_id
                and rental.return_date is null
                ) ;`
                conn.query(getInventoryIDQuery, [film_id, user_id], (err, res) => {
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
    getInventoryDVD: function (inventory_id, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                conn.query(
                    `select inventory.inventory_id,film.title,film.rental_rate,film.description, dvd_image.image_name from inventory 
                    join film using (film_id)
                    LEFT JOIN dvd_image using (film_id)
                    where inventory.inventory_id=?;`,
                    [inventory_id],
                    (err,res)=>{
                        if(err){
                            console.log(err);
                            return callback(err,null);
                        }
                        else{
                            console.log(res);
                            return callback(null,res);
                        }
                    }
                )
            }
        })
    }
}