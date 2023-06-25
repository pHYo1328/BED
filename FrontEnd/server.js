const express = require('express');
const serveStatic = require('serve-static');

var hostname = "localhost";
var port = 3001;

var app = express();
const path = require('path')
app.use('/static', express.static('public'))

app.get("/spdvd/admin/login", (req, res) => {
  res.sendFile("/public/login.html", { root: __dirname });
});
app.get("/spdvd/home", (req, res) => {
  
  res.sendFile("/public/home.html", { root: __dirname });
});

app.get("/spdvd/admin",(req,res)=>{
  res.sendFile("/public/admin.html",{root:__dirname});
})

app.get("/spdvd/result",(req,res)=>{
  const data=req.query.data;
  res.sendFile("/public/result.html",{root:__dirname,query:data});
})

app.get("/spdvd/detail",(req,res)=>{
  res.sendFile("/public/detail.html",{root:__dirname});
})

app.get("/spdvd/customerLogin",(req,res)=>{
  res.sendFile("/public/customerLogin.html",{root:__dirname});
})
app.get("/spdvd/addCustomer",(req,res)=>{
  res.sendFile("/public/addCustomer.html",{root:__dirname});
})

app.get("/spdvd/addDvD",(req,res)=>{
  res.sendFile("/public/addDvD.html",{root:__dirname});
})
app.listen(port, hostname, function () {
  console.log(`FrontEnd server hosted at http://${hostname}:${port}`);
})
