var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var mangUsers = [];

mongoose.connect("mongodb+srv://anhgames78:hunganh78@mydatabase-ilnyv.gcp.mongodb.net/test?retryWrites=true");

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'Database connection error:'));
db.once('open', function() { console.log('Database is connected!!!')});

var loginSchema = new mongoose.Schema({
  usrname: String,
  usrpwd: String
});

var User = db.model("User", loginSchema);

//User.findOne({ 'usrname': 'nguyen tuan anh' }, function (err, person) {
//  console.log('%s is a %s.', person.usrname, person.usrpwd);
//});
User.count({ usrpwd : "anh" }, function( err, count){
    console.log( "Number of pass anh:", count );
})
User.find({}, function(err, person) {
  console.log(person);
});
//delete with this
//User.deleteOne({usrname: 'bao'}, function (err) {
//  if (err) return handleError(err);
  // deleted at most one tank document
//});

//modify with this
//User.findOne({usrname: 'Xuyen'}, function (err, user) {
//    user.usrpwd = 'xuyen';
//  user.usrname = 'xuyen';
//    
//
 //   user.save(function (err) {
 //       if(err) {
 //           console.error('ERROR!');
  //      }
  //  });
//});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST home page. */
router.post('/', function(req,res){
  User.findOne({'usrname' : req.body.usrname}, function (err, person) {
    if (person !== null) {
      if (person.usrpwd == req.body.usrpwd) {
        if (mangUsers.indexOf(req.body.usrname) === -1){        
        mangUsers.push(req.body.usrname);
        res.render("dangnhapthanhcong", { currentUser: req.body.usrname });
          } else {
            res.render("tkdadangnhap");
            }
      } else {
        res.render("saipwd");
      }
    } else {
      res.render("saiusr")
    }
  });
});

router.post('/login', function(req, res) {
  res.render('chatroom', { currentUser: req.body.currentUser });
});

router.post('/register', function(req,res){
  User.findOne({'usrname' : req.body.usrname}, function (err, person) {
    if (person === null) {
      if (req.body.usrpwd === req.body.usrpwd1) {
        var newUser = new User();
        newUser.usrname = req.body.usrname;
        newUser.usrpwd = req.body.usrpwd;
        newUser.save(function (err) {
          if (err) {
            console.log("Loi chua save!!!");
          } else {
            console.log("Da save thang cong!!!");
            res.render("dangkythanhcong");
          }
        });
      } else {
        res.render("passkhongkhop");
      }
    } else {
      res.render("taikhoantontai");
    }
  });
});

router.post('/logout', function(req, res){
      mangUsers.splice(mangUsers.indexOf(req.body.currentUser), 1);
  
  res.render("dangxuatthanhcong");
          
  
});

module.exports = router;
