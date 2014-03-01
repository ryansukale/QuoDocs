var github = require('octonode'),
	url = require('url'),
	_ = require('underscore');
	
/*
 * users api.
 */
app.get('/userinfo', function(req, res) {
	
	res.json(req.session.userInfo);
	
});