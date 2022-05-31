const e = require('express');
var express = require('express');
var router = express.Router();
var connection  = require('../lib/db');

router.post("/mybooks",function(req,res){
    if (req.session.loggedin===true){
        var enr=req.body.enrol
        let query="Select * from issued where issued_by="+connection.escape(enr)
        connection.query(query,function(err,result,fields){
            if (err) throw err
            res.render('user/user',{result:result,books:1,all:0,enrol:enr})
        })
}
else{
    res.render('login')
}
})
router.post("/issuebooks",function(req,res){
    if (req.session.loggedin===true){
    var enr=req.body.enrol
    let query="Select * from books where quantity>0"
    connection.query(query,function(err,result,fields){
        if (err) throw err
        res.render('user/user',{result:result,enrol:enr,all:1,book:0})
    })}
    else{
        res.render('login')
    }
})
router.post('/issue',function(req,res){
    if (req.session.loggedin===true){
    var enr=req.body.enrol
    var name=req.body.name
    let query="select * from books where Book='"+connection.escape(name)+"'"
    let quan
    connection.query(query,function(err,result,fields){
        if (err) throw err
        quan=result[0].quantity
    quan=quan-1
    query="update books set quantity="+quan+" where book='"+connection.escape(name)+"'"

    connection.query(query,function(err,result,fields){
        if (err) throw err
    })
    
})
    
    query="insert into requested(name,issued_by,status) values('"+connection.escape(name)+"','"+connection.escape(enr)+"','requested')"
    console.log(query)

    connection.query(query,function(err,result,fields){
        if (err) throw err
        res.render('user/user',{enrol:enr})
    })
}
else{
    res.render('login')
}
})

router.post("/pendingrequest",function(req,res){
    if (req.session.loggedin===true){
        var enr=req.body.enrol
        let query="Select * from requested where issued_by="+connection.escape(enr)+" and status='requested'"
        connection.query(query,function(err,result,fields){
            if (err) throw err
            res.render('user/user',{result:result,request:1,all:0,enrol:enr})
        })
}
else{
    res.render('login')
}

})
router.post("/rejectedrequest",function(req,res){
    if (req.session.loggedin===true){
        var enr=req.body.enrol
        let query="Select * from requested where issued_by="+connection.escape(enr)+" and status is NULL"
        connection.query(query,function(err,result,fields){
            if (err) throw err
            res.render('user/user',{result:result,rejected:1,all:0,enrol:enr})
        })
        query="delete from requested where issued_by="+connection.escape(enr)+" and status is NULL"
        connection.query(query,function(err,result,fields){
            if (err) throw err})
}
else{
    res.render('login')
}
})
module.exports = router;