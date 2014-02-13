/*
 * stream api.
 */
 
var path = require('path');
app.get('/streams/:id', function(req, res, next) {

		streamConfig = config.stream;
		audioFilePath  = path.join(rootDir,streamConfig.baseDir,streamConfig.type.audioDir);
		res.send("Audio File Path : " + audioFilePath);
	
});

app.post('/streams/', function(req, res, next) {

		
		//WIP
		//var streamConfig = config.stream,
		//audioFilePath = rootDir + path.sep + streamConfig.baseDir +path.sep + streamConfig.type.audioDir + path.sep,
		//postData = '';
		//
		//req.setEncoding('utf8');
		//
		//req.addListener('data', function(postDataChunk) {
		//		postData += postDataChunk;
		//});
    //
		//req.addListener('end', function() {
		//		console.log(postData);
		//		//route(handle, pathname, response, postData);
		//});
		
		console.log(req.body);
		
		res.send("Post : Audaio File Path : ");
	
});


app.post('/postTest',function(req,res){
	console.log(postTest);
});