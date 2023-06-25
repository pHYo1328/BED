/*  Name : Kaung Si Phyo
    Admission Number: 2234878
    class: DIT/FT/1B/05*/
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var admin = require('../model/admin');
var verifyToken = require('../auth/verifyToken.js');
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config/config");
const film = require("../model/film");
const review = require("../model/review")
const category = require("../model/category")
const customer = require("../model/customer")
const inventory = require("../model/inventory");
const language =require("../model/language");
const payment = require("../model/payment");
const addRentalAndPayment = require("../model/rentalAndPayment");
const multer = require("multer");
const store = require("../model/store")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({
    storage: storage
});
var cors = require('cors');
const rentalAndPayment = require('../model/rentalAndPayment');
app.options('*', cors());
app.use(cors());

function validateName(name) {
    return !(/^[a-zA-Z\s]+$/.test(name));
}
// function to check name is only whitespace
function checkWhiteSpace(name) {
    return !(/\S/.test(name));
}

var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

app.use(bodyParser.json());
app.use(urlencodedParser);
app.post('/admin/login', function (req, res) {
    console.log(req.body)
    const email = req.body.email;
    const password = parseInt(req.body.password);

    if (isNaN(password)) {
        res.status(409).json({message : "Bad Request"});
    } else {
        admin.loginUser(email, req.body.password, (error, user) => {
            if (error) {
                res.status(500).send();
                return;
            } else if (user === null) {
                res.status(401).json({message:"there is no such account with these email and password"});
                return;
            } else {
                console.log(user.staff_id);
                const payload = {
                    user_id: user.staff_id
                };
                jwt.sign(payload, JWT_SECRET, {
                    algorithm: "HS256",
                    expiresIn: 86400
                }, (error, token) => {
                    if (error) {
                        console.log(error);
                        res.status(401).send();
                        return;
                    } else {
                        console.log(token);
                        res.status(200).send({
                            token: token,
                            user_id: user.staff_id
                        });
                    }
                });
            }
        });
    }
});


// End point to check login
app.post('/user/login', (req, res) => {
    const email = req.body.email;
    const password = parseInt(req.body.password);

    if (isNaN(password)) {
        res.status(409).json({message : "Bad Request"});
    } else {
        customer.loginUser(email, req.body.password, (error, user) => {
            if (error) {
                console.log(error);
                res.status(500).send();
                return;
            } else if (user === null) {
                res.status(401).json({message:"there is no such account with these email and password"});
                return;
            } else {
                const payload = {
                    user_id: user.customer_id
                };
                jwt.sign(payload, JWT_SECRET, {
                    algorithm: "HS256",
                    expiresIn: 86400
                }, (error, token) => {
                    if (error) {
                        console.log(error);
                        res.status(401).send();
                        return;
                    } else {
                        console.log(token);
                        console.log(user.customer_id)
                        res.status(200).send({
                            token: token,
                            user_id: user.customer_id
                        });
                    }
                });
            }
        });
    }
})

// end point to get film by tilte and rental rate
app.get('/film', function (req, res) {
    var {
        title,
        rentalRate,
        pageSize,
        pageNumber
    } = req.query;
    var startIndex = (pageNumber - 1) * pageSize;
    film.findFlimByTitle(title, rentalRate,startIndex, (err, result) => {
        if (err) {
            res.status(500).send();
            return;
        } else if (result == null) {
            res.status(401).send();
            return;
        } else {
            res.status(200).send(result);
        }
    })

})

// end point to get all category
app.get("/category", function (req, res) {
    category.getCategroy((err, result) => {
        if (err) {
            res.status(500).send();
            return;
        } else {
            console.log(result);
            res.status(200).send(result);
        }
    })
})

// endpoint to get dvds by category
app.get("/getFilmByCategory", function (req, res) {
    const {
        category_id,
        rentalRate,
        pageSize,
        pageNumber
    } = req.query;
    var startIndex = (pageNumber - 1) * pageSize;

    category.getFilmByCategory(category_id,rentalRate, startIndex, (err, result) => {
        if (err) {
            res.status(500).send();
            return;
        } else {
            console.log(result);
            res.status(200).send(result);
        }
    })
})

// endpoint to get all store data
app.get("/store", (req, res) => {
    store.getStore((err, result) => {
        if (err) {
            res.status(500).send();
            return;
        } else {
            console.log(result);
            res.status(200).send(result);
        }
    })
})

// endpoint to get dvd detail
app.get("/getFilmDetail", function (req, res) {
    const film_id = req.query.film_id;
    film.getFilmDetail(film_id, (err, result) => {
        if (err) {
            res.status(500).send();
            return;
        } else {
            res.status(200).send(result);
        }
    })
})

// end point to get film by title and category
app.get('/getFilmByTitleAndCategory', function (req, res) {
    var {
        title,
        rentalRate,
        category_id,
        pageSize,
        pageNumber
    } = req.query;
    var startIndex = (pageNumber - 1) * pageSize;
    film.findFilmBYTitleAndCategory(title, rentalRate, category_id, startIndex, function (err, result) {
        if (err) {
            res.status(500).send();
            return;
        } else {
            console.log(result);
            res.status(200).send(result);
        }
    })
})

// end point to add actor
app.post('/admin/addActor', verifyToken, function (req, res, next) {
    var {
        first_name,
        last_name
    } = req.body;
    console.log(first_name);
    console.log(last_name);
    if (first_name == undefined || last_name == undefined) {
        res.status(400).json({
            message: "missing data"
        });
    } else if (validateName(first_name) || validateName(last_name)) {
        res.status(400).json({
            message: "bad request"
        });
    } else if (checkWhiteSpace(first_name) || checkWhiteSpace(last_name)) {
        res.status(400).json({
            message: "bad request"
        });
    } else {
        console.log("no error")
        admin.addActor(first_name, last_name, function (err, result) {
            if (err) {
                res.status(500).json({
                    message: "Internal server error"
                });
            } else res.status(201).json({
                message: "actor added successfully"
            });
        })
    }
})

// end point to add customer
app.post('/admin/addCustomer', verifyToken, function (req, res, next) {
    console.log(req.body)
    var {
        store_id,
        first_name,
        last_name,
        email,
        password,
        address,
        address_line1,
        address_line2,
        district,
        city,
        postal_code,
        phone
    } = req.body;
    var object = req.body;
    console.log(object);
    

    // check data are undefined or not
    if (store_id == undefined ||
        first_name == undefined ||
        last_name == undefined || email == undefined || address_line1 == undefined || address_line2 == undefined || district == undefined || city == undefined || postal_code == undefined || phone == undefined || password==undefined) {
        res.status(400).json({
            "error_msg": "missing data"
        });
    }
    // check store_id is avaliable or name are valid
    // else if (store_id <= 0 || validateName(first_name) || validateName(last_name)|| checkWhiteSpace(first_name) || checkWhiteSpace(last_name)) {
    //     res.status(400).json({ message: "bad request" });
    // }
    else {
        admin.addCustomer(object, function (err, result) {
            console.log("err:" + err)
            console.log("result:" + result)
            if (err == 'store_id_error') {
                res.status(409).json({
                    message: "store_id is not availiable"
                });
            } else if (err == 'email_error') {
                res.status(409).json({
                    message: "email already exist"
                });
            } else if (err == 'city_id_error') {
                res.status(409).json({
                    message: "city is not availiable"
                });
            } else if (err) {
                res.status(500).json({
                    message: "Internal server error"
                });
            } else
                res.status(201).json({
                    message: `customer is successfully added\ncustomer ID:${result}`
                });
        })
    }
})

// end point to ad DvD
app.post('/addDvD', upload.single('image'),verifyToken, (req, res) => {
    const image = req.file;
    const {
        title,
        language,
        store_id
    } = req.body;
    console.log(store_id);
    if (image == null || image == undefined || title == null || title == undefined || language == null || language == undefined || store_id == null || store_id == undefined) {
        res.status(400).json({
            message: "bad request"
        })
    } else if (isNaN(parseInt(store_id))) {
        res.status(400).json({
            message: "bad request"
        });
    } else {
        admin.addDvd(req.body, image, (err, result) => {
            if (err) {
                res.status(500).json({
                    message: "Internal Server Error"
                });
            } else {
                console.log("no error")
                res.status(201).json({
                    message: "addig DVD successful"
                });
            }
        })
    }
})

// end point to add comments
app.post("/addComments", (req, res) => {
    var {
        name,
        email,
        rating,
        comment,
        film_id
    } = req.body;
    film_id = parseInt(film_id);
    if (name == undefined || email == undefined || rating == undefined || film_id == undefined) {
        res.status(400).json({
            message: "bad request"
        });
    } else if (isNaN(film_id)) {
        res.status(400).json({
            message: "bad request"
        });
    } else {
        review.addReview(req.body, (err, result) => {
            if (err) {
                res.status(500).json({
                    message: "Internal Server Error"
                });
            } else {
                res.status(201).json({
                    message: "successfully added comments"
                });
            }
        })
    }
})

// end point to get all comments
app.get("/getComments", (req, res) => {
    console.log(req.query)
    var {
        film_id
    } = req.query;
    film_id = parseInt(film_id);
    if (isNaN(film_id)) {
        res.status(400).json({
            message: "bad request"
        });
    } else {
        review.retreiveReview(film_id, (err, result) => {
            if (err) {
                res.status(500).json({
                    message: "Internal Server Error"
                });
            } else {
                res.status(200).json(result);
            }
        })
    }
})

// end point to check dvd is available and get inventory id for rent
app.get("/getInventoryID",verifyToken, (req, res) => {
    console.log(req.query);
    var {
        user_id,
        film_id
    } = req.query;
    console.log(user_id);
    if (user_id == null || user_id == undefined || film_id == null || film_id == undefined) {
        res.status(400).json({
            message: "Bad Request"
        });
    } else if (isNaN(parseInt(user_id)) || isNaN(parseInt(film_id))) {
        res.status(400).json({
            message: "Bad Request"
        });
    } else {
        inventory.getInventoryID(user_id, film_id, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    message: "Internal Server Error"
                });
            } else {
                console.log("this is" + result);
                res.status(200).json(result);
            }
        })
    }
})

// batch endpoint to retrive all cart items data with promises
app.post('/getCart',verifyToken, (req, res) => {
    const requests = req.body.requests;

    // Process each request in the array
    Promise.all(requests.map(request => {
            return new Promise((resolve, reject) => {
                if (request.method === 'GET' && request.endpoint.startsWith('/getInventoryDVD')) {
                    const inventory_id = request.endpoint.split('/')[2];
                    inventory.getInventoryDVD(inventory_id, (err, result) => {
                        if (err) {
                            reject({
                                status: 500,
                                body: err
                            });
                        } else {
                            resolve({
                                status: 200,
                                body: result[0]
                            });
                        }
                    })
                } else {
                    reject({
                        status: 400,
                        body: 'Invalid request'
                    });
                }
            });
        }))
        .then(responses => {
            res.json({
                responses
            });
        })
        .catch(error => {
            res.status(500).json({
                error
            });
        });
});

// batch api to insert all record in asychornous manner
app.post('/insertRecord',verifyToken, (req, res) => {
    const requests = req.body.requests;
    // Process each request in the array
    Promise.all(requests.map(request => {
            return new Promise((resolve, reject) => {
                if (request.method === 'POST' && request.endpoint.startsWith('/addRentalAndPaymentData')) {
                    const {
                        inventory_id,
                        user_id
                    } = JSON.parse(request.endpoint.split('?')[1]);
                    rentalAndPayment.addRentalAndPaymentData(inventory_id, user_id, (err, result) => {
                        if (err) {
                            reject({
                                status: 500,
                                body: err
                            });
                        } else {
                            resolve({
                                status: 201,
                                body: {
                                    message: "record data is successfully added"
                                }
                            });
                        }
                    })
                } else {
                    reject({
                        status: 400,
                        body: 'Invalid request'
                    });
                }
            });
        }))
        .then(responses => {
            res.json({
                responses
            });
        })
        .catch(error => {
            res.status(500).json({
                error
            });
        });
});


// endpoint to get all langauge
app.get('/language',(req,res)=>{
    language.getLanguage((err,result)=>{
        if (err) {
            res.status(500).send();
            return;
        } else {
            console.log(result);
            res.status(200).send(result);
        }
    })
})

// endpoint to get all payment history
app.get('/getAllPayments',verifyToken,(req,res)=>{
    console.log(req.query)
    const {customer_id}=req.query;
    if(isNaN(customer_id)){
        res.status(400).json({message: "Bad Request"});
    }else{
        payment.getAllPayment(customer_id,(err,result)=>{
            if(err){
                res.status(500).json({message: "Internal Server Error"});
            }
            else{
                res.status(200).json(result);
            }
        })
    }
})

//endpoint to get count of films with specified title
app.get('/film/count', function (req, res) {
    var {
        title,
        rentalRate,
        pageSize,
        pageNumber
    } = req.query;
    var startIndex = (pageNumber - 1) * pageSize;
    film.getCountFlimByTitle(title, rentalRate,startIndex, (err, result) => {
        if (err) {
            res.status(500).send();
            return;
        } else if (result == null) {
            res.status(401).send();
            return;
        } else {
            res.status(200).send(result);
        }
    })

})

/// endpoint to get count of films with specified category
app.get("/getFilmByCategory/count", function (req, res) {
    const {
        category_id,
        rentalRate,
        pageSize,
        pageNumber
    } = req.query;
    var startIndex = (pageNumber - 1) * pageSize;

    category.getCountFilmByCategory(category_id,rentalRate, startIndex, (err, result) => {
        if (err) {
            res.status(500).send();
            return;
        } else {
            console.log(result);
            res.status(200).send(result);
        }
    })
})

/// endpoint to get count of films with specified title and category
app.get('/getFilmByTitleAndCategory/count', function (req, res) {
    var {
        title,
        rentalRate,
        category_id,
        pageSize,
        pageNumber
    } = req.query;
    var startIndex = (pageNumber - 1) * pageSize;
    film.GetCountFilmBYTitleAndCategory(title, rentalRate, category_id, startIndex, function (err, result) {
        if (err) {
            res.status(500).send();
            return;
        } else {
            console.log(result);
            res.status(200).send(result);
        }
    })
})

app.get('/GetAllFilms', function (req, res) {
    var {
        pageSize,
        pageNumber
    } = req.query;
    var startIndex = (pageNumber - 1) * pageSize;
    film.getAllFilm(startIndex, (err, result) => {
        if (err) {
            res.status(500).send();
            return;
        } else {
            res.status(200).send(result);
        }
    })

})

app.get('/GetCountOFAllFilms', function (req, res) {
    film.getCountOfAllFilm((err, result) => {
        if (err) {
            res.status(500).send();
            return;
        } else {
            res.status(200).send(result);
        }
    })

})
module.exports = app;