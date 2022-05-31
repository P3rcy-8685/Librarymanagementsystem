const e = require('express');
var express = require('express');
var router = express.Router();
var connection  = require('../lib/db');
router.post('/addbooks',function(req,res,next){
    if (req.session.loggedin){
    var code=req.body.code
    var book=req.body.book
    let query="select * from books where book='"+book+"'"
    connection.query(query,function(err,result){
        if (result.length<=0){
            query="Insert into books (Sno,Book,quantity) values ('"+code+"','"+book+"',1)";
            connection.query(query,function(err,result){
                if (err) throw err;
                res.render('user/admin')        
    })
}

else{
    let quan=result[0].quantity;
    quan=quan+1
    query="update books set quantity="+quan+" where book='"+book+"'"
    connection.query(query,function(err,result){
        if (err) throw err;
        res.render('user/admin')    
})
}
})
    }
    else{
        res.render('login')

    }
})


router.get('/request/',function(req,res){
    if (req.session.loggedin){
        let query="select * from requested where status='requested'"
        connection.query(query,function(err,result){
        if (err) throw err;
            res.render('user/admin',{result:result,request:1,avail:0,issue:0})
   
    })
    }
    else{
        res.render('login')
    }

    })

router.get('/avail/',function(req,res){
    if (req.session.loggedin){

    let query="select * from books where quantity>0"
    connection.query(query,function(err,result){
        if (err) throw err;
        res.render('user/admin',{result:result,request:0,avail:1,issue:0})

    })}
    else{
        res.render('login')

    }
})

router.get('/issue/',function(req,res){
    if (req.session.loggedin){

    let query="select * from issued"
    connection.query(query,function(err,result){
        if (err) throw err;
        res.render('user/admin',{result:result,request:0,avail:0,issue:1})
    })}
    else{
        res.render('login')
    }
})

router.post("/aprove/",function(req,res){
    var aprov=req.body.aprove
    var by=req.body.issue
    var code=req.body.book
    if (aprov==1){
        let quer="delete from requested where Issued_by='"+by+"' and name='"+code+"'"
        console.log(quer)
        connection.query(quer,function(err,result){
            if(err) throw err;})
        quer="insert into issued values('"+code+"','"+by+"')"
        console.log(quer)

        connection.query(quer,function(err,result){
            if(err) throw err;
            res.redirect('request')
        })
    }
    else{
        let quer="update requested set status= NULL where name='"+code+"' and issued_by='"+by+"'"
        connection.query(quer,function(err,result){
            if(err) throw err;
            res.redirect('request')
    })
}})
router.post("/adminyes/",function(req,res){
    var aprov=req.body.aprove
    var code=req.body.Sno
    if (aprov==1){
        let quer="update user set admin='1' where enrol='"+code+"'"
        connection.query(quer,function(err,result){
            if(err) throw err;
            res.redirect('adminreq')
        })
    }
    else{
        let quer="update user set admin= 0 where enrol='"+code+"'"
        connection.query(quer,function(err,result){
            if(err) throw err;})
         quer="update user set admin= 0 where enrol='"+code+"'"
        connection.query(quer,function(err,result){
            if(err) throw err;
            res.redirect('adminreq')
    })
}})
router.get('/adminreq/',function(req,res){
    if (req.session.loggedin){
        let query="select * from user where admin='2'"
        connection.query(query,function(err,result){
        if (err) throw err;
            res.render('user/admin',{result:result,admin:1})
    })
    }
    else{
        res.render('login')
    }

    })
module.exports = router;