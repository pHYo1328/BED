/*  Name : Kaung Si Phyo
    Admission Number: 2234878
    class: DIT/FT/1B/05*/
var db = require('../config/databaseConfig');
module.exports = {
    getLanguage: function (callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                conn.query("select language_id,name from language",(err,result)=>{
                    if(err){
                        console.log(err);
                        return callback(err,null);
                    }
                    else{
                        console.log(result);
                        return callback(null,result);
                    }
                });
            }
        })
    }
}