var db = require('../database');
var express = require("express");
var router = express.Router();



// ---------SpecialityAssigment CRUD Functions-----------

var SpecialityAssigment = {

  // speciality_assigment_id, speciality_id, meeting_id

  getAllSpecialitiesAssigments:function(callback){
    return db.query("Select * from specialities_assigments LEFT JOIN specialities ON specialities.speciality_id=specialities_assigments.speciality_id",callback);
  },
  getSpecialityAssigmentById:function(id,callback){
    return db.query("select * from specialities_assigments LEFT JOIN specialities ON specialities.speciality_id=specialities_assigments.speciality_id where speciality_assigment_id=?",[id],callback);
  },
  getSpecialityAssigmentByMeetingId:function(id,callback){
    return db.query("select * from specialities_assigments LEFT JOIN specialities ON specialities.speciality_id=specialities_assigments.speciality_id where meeting_id=?",[id],callback);
  },
  addSpecialityAssigment:function(SpecialityAssigment,callback){
    return db.query('INSERT INTO specialities_assigments SET ?', SpecialityAssigment,callback);
  },
  deleteSpecialityAssigment:function(id,callback){
    return db.query("delete from specialities_assigments where speciality_assigment_id=?",[id],callback);
  },
  updateSpecialityAssigment:function(id,SpecialityAssigment,callback){
    SpecialityAssigment.speciality_assigment_id = parseInt(id);
    return db.query("UPDATE specialities_assigments SET speciality_id=?, meeting_id=? WHERE speciality_assigment_id= ?",[SpecialityAssigment.speciality_id,SpecialityAssigment.meeting_id,SpecialityAssigment.speciality_assigment_id],callback);
  },
  initTable:function(){
    var init = db.query(`CREATE TABLE IF NOT EXISTS specialities_assigments
    (speciality_assigment_id MEDIUMINT NOT NULL AUTO_INCREMENT, speciality_id MEDIUMINT NOT NULL, meeting_id MEDIUMINT NOT NULL, PRIMARY KEY (speciality_assigment_id))
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
    SpecialityAssigment.getSpecialityAssigmentById(req.params.id,function(err,rows){
      if(err) {
        res.json(err);
      } else {
        res.json(rows);
      }
    });
  } else{
    SpecialityAssigment.getAllSpecialitiesAssigments(function(err,rows){
      if(err){
        res.json(err);
      } else {
        res.json(rows);
      }
    });
  }
});

router.get('/meeting/:id?',function(req,res,next){

    SpecialityAssigment.getSpecialityAssigmentByMeetingId(req.params.id,function(err,rows){
      if(err) {
        res.json(err);
      } else {
        res.json(rows);
      }
    });

});

// Insert Speciality
router.post('/',function(req,res,next){

    SpecialityAssigment.addSpecialityAssigment(req.body.SpecialityAssigment,function(err,result){
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
     SpecialityAssigment.deleteSpecialityAssigment(req.params.id,function(err,result){
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

   SpecialityAssigment.updateSpecialityAssigment(req.params.id,req.body.SpecialityAssigment,function(err,result){
        if(err) {
          console.log(err);
          res.json(err);
        } else{
          res.json(result);
        }
   });

 });



module.exports=SpecialityAssigment;
module.exports.router = router;
