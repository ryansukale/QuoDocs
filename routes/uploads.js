var multiparty = require('multiparty'),
util = require('util'),
fs = require('fs'),
fileExtension = '.wav';

app.post('/uploads/',function(req,res){
	
	var form = new multiparty.Form();
	
	form.parse(req, function(err, fields, files) {
		if (err) {
			res.writeHead(400, {'content-type': 'text/plain'});
			res.end("invalid request: " + err.message);
			return;
		}
		
		//console.log(fields);
		
		var userId = req.session.userInfo,
		itemId = fields['itemId'],
		itemType = fields['itemType'],
		projectId = fields['projectId'];
		
		var audioUploadDir = [rootDir,config.uploads.base,config.uploads.type['audio']].join(path.sep);
		
		//console.dir(files.recording[0].path);
		//console.dir(audioUploadDir);
		
		fs.readFile(files.recording[0].path, function (err, data) {
		
			var newPath = [audioUploadDir,Math.floor((256*Math.random()))].join(path.sep)+fileExtension;
			fs.writeFile(newPath, data, function (err) {
				
				fs.unlink(files.recording[0].path, function (err) {
					if (err) throw err;
					console.log('successfully deleted temp file' + files.recording[0].path);
				});
				
				res.send('Uploaded');
				
			});
		});
		
	});
	
	//console.log(multiparty);
	//res.send(req.files);
	
});