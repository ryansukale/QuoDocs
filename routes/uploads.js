var multiparty = require('multiparty'),
util = require('util'),
fs = require('fs');

app.post('/uploads/',function(req,res){
	
	var form = new multiparty.Form();
	
	form.parse(req, function(err, fields, files) {
		if (err) {
			res.writeHead(400, {'content-type': 'text/plain'});
			res.end("invalid request: " + err.message);
			return;
		}
		
		var audioUploadDir = [rootDir,config.uploads.base,config.uploads.type['audio']].join(path.sep);
		
		console.dir(files.recording[0].path);
		console.dir(audioUploadDir);
		
		fs.readFile(files.recording[0].path, function (err, data) {
			var newPath = [audioUploadDir,(256*Math.random())].join(path.sep);
			fs.writeFile(newPath, data, function (err) {
				res.send("Done!");
			});
		});
		
		//res.writeHead(200, {'content-type': 'text/plain'});
		//res.write('received fields:\n\n '+util.inspect(fields));
		//res.write('audioUploadDir '+audioUploadDir);
		//res.write('\n\n');
		//res.end('received files:\n\n '+util.inspect(files));
		
	});
	
	console.log(multiparty);
	//res.send(req.files);
	
});