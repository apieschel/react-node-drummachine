const express = require("express");
const app = express();
const rimraf = require("rimraf");
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let ip = req.headers['x-forwarded-for'];
    if(ip) {
      ip = req.headers['x-forwarded-for'].split(',').shift();
    } else {
      ip = req.connection.remoteAddress;
    }
    
    ip = ip.split('.').join('');
    ip = process.cwd() + '/public/music/' + ip;
    
    if (!fs.existsSync(ip)) {
        fs.mkdirSync(ip);
    }
    
    const now = Date.now();
    const date = new Date();
    const dateString = date.getMonth() + "-" + date.getDate() + "-" + date.getFullYear() + "_" + date.getHours() + "h" + date.getMinutes() + "m";
    const path = file.fieldname + '_' + dateString;
    const dir = ip + '/' + path;

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    
    cb(null, ip + '/' + path);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const filter = function fileFilter (req, file, cb) {
  let nameString = file.originalname;
  let nameArray = nameString.split(".");
  let extension = nameArray[nameArray.length - 1];
  
  if(extension === "wav") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({storage: storage, fileFilter: filter});

// helmet security
const helmet = require('helmet');
app.use(helmet({
  frameguard: {
     action: 'deny'
  },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'", "https://api.glitch.com"],
      styleSrc: ["'self'", "https://button.glitch.me"],
      scriptSrc: ["'self'", "https://code.jquery.com", "https://button.glitch.me", "https://api.glitch.com"],
      imgSrc: ["'self'", "https://hyperdev.com", "https://glitch.com", "https://cdn.glitch.com", "https://s3.amazonaws.com"]
    }
   }
 }));

// https://stackoverflow.com/questions/38104090/how-can-i-read-files-from-directory-and-send-as-json-to-client
const fs = require('fs');
let path = process.cwd() + '/public/music/';
let logs = [];

function readDirectory(callback){
  fs.readdir(path, function(err, items) {
     logs.push(items);
     callback(logs);       
  }); 
}

app.get('/music', function(req,res){
   logs = []; 
  
   let ip = req.headers['x-forwarded-for'];
   if(ip) {
     ip = req.headers['x-forwarded-for'].split(',').shift();
   } else {
     ip = req.connection.remoteAddress;
   }
   ip = ip.split('.').join('');
  
   path = process.cwd() + '/public/music/' + ip + '/';
   readDirectory(function(logFiles){
     res.json({files : logFiles});
   });
});

app.get('/music/directory', function(req,res){
   logs = [];
   console.log('Testing the API.');
   console.log(req.headers);
   console.log(req.body);
  
   let ip = req.headers['x-forwarded-for'];
   if(ip) {
     ip = req.headers['x-forwarded-for'].split(',').shift();
   } else {
     ip = req.connection.remoteAddress;
   }
   ip = ip.split('.').join('');
  
   path = process.cwd() + '/public/music/' + ip + '/' + req.query.directory;
   readDirectory(function(logFiles){
     res.json({files : logFiles, directory: ip + '/' + req.query.directory});
   });
});

app.post('/api/fileanalyse', upload.array('upfile', 20), function (req, res, next) {
  console.log("Testing the API.");
  console.log(req.headers);
  console.log(req.files);
  console.log(req.file);
  console.log(req.body);
  res.redirect('/');
});

app.delete('/music/delete', function(req, res) {
  logs = []; 
  let ip = req.headers['x-forwarded-for'];
  if(ip) {
    ip = req.headers['x-forwarded-for'].split(',').shift();
  } else {
    ip = req.connection.remoteAddress;
  }
  ip = ip.split('.').join('');
  
  rimraf(process.cwd() + "/public/music/" + ip, function() {
    res.json("Your personal directory has been deleted.");
  });
});

app.set("port", process.env.PORT || 3001);

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});