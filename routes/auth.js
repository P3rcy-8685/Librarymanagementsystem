var express = require('express');
var router = express.Router();
require("dotenv").config()
var connection  = require('../lib/db');
const crypto=require('crypto');
router.use(express.static(__dirname + '/public'));

router.get('/login/',function(req,res,next){
    res.render('login')})
router.post('/authentication/',function(req,res,next){
    var enr=req.body.uname;
    enr=connection.escape(enr);
    let query="Select salt from user where enrol="+enr
    connection.query(query,function(err,rows,fields){
    if(err) throw err
    if(rows.length<=0){
        res.render('check')

    } 
    else{
        let salt=rows[0].salt
        var pass=req.sanitize('pass').escape().trim()+salt
        let hash=crypto.createHash('sha256').update(pass).digest('hex')
        let query="Select * from user where enrol="+enr+" and password='"+hash+"'"
        connection.query(query,function(err,rows,fields){
            if(err) throw err
            if(rows.length<=0){
                res.render('check')
            }
            else{
                if (rows[0].admin==1){
                    req.session.loggedin = true;
                    req.session.name = rows[0].Name;
                    res.render('user/admin');
                }
                else{
                    req.session.loggedin = true;
                    req.session.name = rows[0].Name;
                    res.render('user/user',{enrol:rows[0].enrol})
                    }
                }
            }

)}
    }
)
})
router.get("/register/",function(req,res,next){
    res.render("register")
})
router.post('/post-register/',function(req,res,next){

    req.assert("name","Name is required bruh").notEmpty()
    req.assert("password","Password is required").notEmpty()
    req.assert("enr","Enrollement ID is needed").notEmpty()
    var errors=req.validationErrors()
    if(!errors){
        var salt=Math.random().toString(36).substring(2,15)
        var pass=req.sanitize('password').escape().trim()+salt
        let hash1=crypto.createHash('sha256').update(pass).digest('hex')
        let admin=0
        if (req.body.admin==2){
            admin=2
        }
        var user={
            enrol:req.sanitize('enr').escape().trim(),
            password:hash1,
            name:req.sanitize('name').escape().trim(),
            salt:salt,
            admin:admin
        }
        connection.query('Insert into user SET ?',user,function(err,result){
            if(err){
                req.flash('error',err)
                res.redirect('register')
                }
                else{

                    req.flash('sucess',"HOGAYYAA YAYAYAYA")
                    res.redirect('login')
                }
        })

    }
})
router.get('/logout/',function(req,res){
    req.session.destroy()
    res.redirect('/auth/login')
})
module.exports = router;