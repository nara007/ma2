var fs = require('fs');
var express = require('express');
var multer  = require('multer')
var objRecognizer = require('./objRecognizer.js');


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload')
  },
  filename: function (req, file, cb) {
    // cb(null, file.fieldname + '-' + Date.now())
    cb(null, file.originalname)
  }
});

var upload = multer({ storage: storage })

var multiUpload = upload.fields([{ name: 'pic', maxCount: 6 }, { name: 'pcd', maxCount: 6 }])


var app = express();
// var upload = multer({ dest: 'upload/' });

// 单图上传
app.post('/upload', upload.single('logo'), function(req, res, next){
    res.send({ret_code: '0'});
});

app.post('/uploadfiles', multiUpload, function(req, res, next){
    res.send({ret_code: '0'});

    objRecognizer.generateLayout();
});


app.get('/form', function(req, res, next){
    var form = fs.readFileSync('./form.html', {encoding: 'utf8'});
    res.send(form);
});

app.get('/test', (req, res, next)=>{

	console.log("this is a test fucntion");

	objRecognizer.run(0).then(results=>{
		console.log(results);
		res.send("123");
	});
});








app.listen(3000);
