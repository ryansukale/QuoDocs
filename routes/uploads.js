var multiparty = require('multiparty'),
util = require('util'),
fs = require('fs'),
_ = require('underscore'),
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
		var fileNameBase = [itemType,projectId,itemId].join('_');
		
		var audioFiles = fs.readdirSync(audioUploadDir);
		console.log(audioFiles);
		
		var audioCount = 0;
		
		for(var i=0;i<audioFiles.length;i++){
			if(audioFiles[i].indexOf(fileNameBase)!==-1){
				audioCount++;
			}
		}
		
		audioCount++;
		var fileName = [fileNameBase,audioCount].join('_')+fileExtension;
		console.log('proposedFileName',fileName);
		
		fs.readFile(files.recording[0].path, function (err, data) {
		
			//var newPath = [audioUploadDir,Math.floor((256*Math.random()))].join(path.sep)+fileExtension;
			var newPath = [audioUploadDir,fileName].join(path.sep)+fileExtension;
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