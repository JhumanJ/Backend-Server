var db = require('./database');
var express = require("express");
var router = express.Router();



// ---------Referral CRUD Functions-----------

var Referral = {

  // id, ehrID, status (0 waiting, 1 dealing with, 2 done), referred_by

  getAllReferrals:function(callback){
    return db.query("Select * from referrals",callback);
  },
  getReferralById:function(id,callback){
    return db.query("select * from referrals where referral_id=?",[id],callback);
  },
  waitingReferral:function(callback){
    return db.query("select * from referrals where status=0",callback);
  },
  assignedReferral:function(callback){
    return db.query("select * from referrals where status=1",callback);
  },
  doneReferral:function(callback){
    return db.query("select * from referrals where status=2",callback);
  },
  addReferral:function(Referral,callback){
    return db.query('INSERT INTO referrals SET ?', Referral,callback);
  },
  deleteReferral:function(id,callback){
    return db.query("delete from referrals where referral_id=?",[id],callback);
  },
  updateReferral:function(id,Referral,callback){
    Referral.referral_id = parseInt(id);
    return db.query("UPDATE referrals SET referred_by_id=?, ehrID=?, status=? WHERE referral_id= ?",[Referral.referred_by_id,Referral.ehrID,Referral.status,Referral.referral_id],callback);
  },
  initTable:function(){
    var init = db.query(`CREATE TABLE IF NOT EXISTS referrals
    (referral_id MEDIUMINT NOT NULL AUTO_INCREMENT,
    referred_by_id MEDIUMINT NOT NULL,
    status INT NOT NULL DEFAULT 0,
     ehrID varchar(500),
      assigned_date TIMESTAMP, PRIMARY KEY (referral_id))
     ENGINE=InnoDB DEFAULT CHARSET=latin1;` , function (error, results, fields) {
      if (error) {
        // console.log(error);
      }
    });
  }

};

// ----------Referral ROUTES----------

// Get a Referral by id - Get all Referral if id not specified
router.get('/:id?',function(req,res,next){

  if(req.params.id){
    Referral.getReferralById(req.params.id,function(err,rows){
      if(err) {
        res.json(err);
      } else {
        res.json(rows);
      }
    });
  } else{
    Referral.getAllReferrals(function(err,rows){
      if(err){
        res.json(err);
      } else {
        res.json(rows);
      }
    });
  }
});

// Insert job
router.post('/',function(req,res,next){
  Referral.addReferral(req.body.Referral,function(err,result){
    if(err) {
      res.json(err);
    } else{
      res.status(201);
      res.json(result);
    }
  });
 });

// Delete Referral
router.delete('/:id',function(req,res,next){
 Referral.deleteReferral(req.params.id,function(err,result){
   if(err) {
     res.json(err);
   } else{
     res.json(result);
   }
 });
});

// Update Referral
router.put('/:id',function(req,res,next){
  Referral.updateReferral(req.params.id,req.body.Referral,function(err,result){
    if(err) {
      res.json(err);
    } else{
      res.json(result);
    }
  });
 });

 // waiting Referrals
 router.get('/waiting',function(req,res,next){
   Referral.waitingReferral(function(err,result){
     if(err) {
       res.json(err);
     } else{
       res.json(result);
     }
   });
  });

  //assigned referral
  router.get('/assigned',function(req,res,next){
    Referral.assignedReferral(function(err,result){
      if(err) {
        res.json(err);
      } else{
        res.json(result);
      }
    });
   });

module.exports=Referral;
module.exports.router = router;
