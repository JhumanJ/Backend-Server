var db = require('../database');
var express = require("express");
var router = express.Router();



// ---------Specialties CRUD Functions-----------

var Speciality = {

  // speciality_id, name

  getAllSpecialities:function(callback){
    return db.query("Select * from specialities",callback);
  },
  getSpecialityById:function(id,callback){
    return db.query("select * from specialities where speciality_id=?",[id],callback);
  },
  addSpeciality:function(Speciality,callback){
    return db.query('INSERT INTO specialities SET ?', Speciality,callback);
  },
  deleteSpeciality:function(id,callback){
    return db.query("delete from specialities where speciality_id=?",[id],callback);
  },
  updateSpeciality:function(id,Speciality,callback){
    Speciality.speciality_id = parseInt(id);
    console.log(Speciality);
    return db.query("UPDATE specialities SET name=? WHERE speciality_id= ?",[Speciality.name,Speciality.speciality_id],callback);
  },
  initTable:function(){
    var init = db.query(`CREATE TABLE IF NOT EXISTS specialities
    (speciality_id MEDIUMINT NOT NULL AUTO_INCREMENT, name varchar(500) NOT NULL, PRIMARY KEY (speciality_id))
     ENGINE=InnoDB DEFAULT CHARSET=latin1;` , function (error, results, fields) {
      if (error) {
        console.log(error);
      }
    });
  }

};

// ----------Specialities ROUTES----------

// Get a Speciality by id - Get all Specialities if id not specified
router.get('/:id?',function(req,res,next){

  if(req.params.id){
    Speciality.getSpecialityById(req.params.id,function(err,rows){
      if(err) {
        res.json(err);
      } else {
        res.json(rows);
      }
    });
  } else{
    Speciality.getAllSpecialities(function(err,rows){
      if(err){
        res.json(err);
      } else {
        res.json(rows);
      }
    });
  }
});

// Insert Speciality
router.post('/',function(req,res,next){

    Speciality.addSpeciality(req.body.Speciality,function(err,result){
        if(err) {
          res.json(err);
        } else{
            res.status(201);
            res.json(result);
        }
    });

 });

// Delete Speciality
router.delete('/:id',function(req,res,next){
     Speciality.deleteSpeciality(req.params.id,function(err,result){
       if(err) {
         console.log(err);
         res.json(err);
       } else{
         res.json(result);
       }
     });
});

// Update Speciality
router.put('/:id',function(req,res,next){

   Speciality.updateSpeciality(req.params.id,req.body.Speciality,function(err,result){
        if(err) {
          console.log(err);
          res.json(err);
        } else{
          res.json(result);
        }
   });

 });



module.exports=Speciality;
module.exports.router = router;
