/*  Name : Kaung Si Phyo
    Admission Number: 2234878
    class: DIT/FT/1B/05*/
var db = require('../config/databaseConfig');
module.exports = {
    getStore: function (callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                const query="SELECT store.store_id,address.address, address.district, address.city_id FROM store,address WHERE store.address_id = address.address_id;"
                conn.query(query,[],(err,res)=>{
                    if(err){
                        console.log(err);
                        return callback(err,null);
                    }
                    else {
                        console.log(res);
                        return callback(null,res);
                    }
                })
            }
        })
    }
}