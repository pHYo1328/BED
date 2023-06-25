/*  Name : Kaung Si Phyo
    Admission Number: 2234878
    class: DIT/FT/1B/05*/
    var mysql = require('mysql');
    module.exports = {
        getConnection: function () {
            var conn = mysql.createConnection({
                host: "localhost",
                user: "bed_dvd_root",
                password: "pa$$woRD123",
                database: "bed_dvd_db",
                dateStrings: true,
                multipleStatements: true
            });
            return conn;
        }
    }