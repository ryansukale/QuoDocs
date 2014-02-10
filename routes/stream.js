/*
 * stream api.
 */
 
var path = require('path');
app.get('/streams/:id', function(req, res) {

		streamConfig = config.stream;
		audioFilePath  = path.join(rootDir,streamConfig.baseDir,streamConfig.type.audioDir);
		res.send("Audio File Path : " + audioFilePath);
	
});

app.post('/streams/', function(req, res) {

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
		
		res.send("Post : Audio File Path : " + audioFilePath);
	
});