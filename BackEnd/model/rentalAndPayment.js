/*  Name : Kaung Si Phyo
    Admission Number: 2234878
    class: DIT/FT/1B/05*/
var db = require('../config/databaseConfig');
module.exports = {
    addRentalAndPaymentData: function (inventory_id, customer_id, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                conn.beginTransaction((err) => {
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        conn.query(
                            `INSERT INTO rental(rental_date,inventory_id,customer_id,staff_id) VALUES(NOW(),?,?,(SELECT staff.staff_id FROM staff,customer WHERE staff.store_id =customer.store_id AND customer.customer_id=?))`,
                            [inventory_id, customer_id, customer_id],
                            (err, res) => {
                                if (err) {
                                    console.log(err);
                                    conn.rollback(function () {
                                        return callback(err, null);
                                    });
                                } else {
                                    const rental_id = res.insertId;
                                    conn.query(
                                        `INSERT INTO payment
                                        (customer_id,staff_id,rental_id,amount)
                                        VALUES(?,(SELECT staff.staff_id FROM staff,customer WHERE staff.store_id =customer.store_id AND customer.customer_id=?),?,(SELECT film.rental_rate FROM inventory,film WHERE inventory.film_id=film.film_id AND inventory.inventory_id=?)
                                        )`,
                                        [customer_id,customer_id, rental_id,inventory_id],
                                        (err, res) => {
                                            if (err) {
                                                console.log(err);
                                                conn.rollback(function () {
                                                    return callback(err, null);
                                                });
                                            } else {
                                                conn.commit(function (err,result) {
                                                    if (err) {
                                                        console.log(err);
                                                        conn.rollback(function () {
                                                            return callback(err, null);
                                                        });
                                                    } else {
                                                        return callback(null, result);
                                                    }

                                                    conn.end();
                                                });
                                            }
                                        }
                                    )
                                }
                            }
                        )
                    }
                })
            }
        })
    }
}