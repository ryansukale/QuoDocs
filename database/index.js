var mysql = require('mysql');
var connectionPool = mysql.createPool({
	//host     : 'example.org', use the default localhost
	user     : env.MYSQL_USERNAME,
	password : env.MYSQL_PASSWORD,
	database : env.DATABASE,
	supportBigNumbers: true
});
		
module.exports = (function(){
	return {
		pool  : connectionPool
	}	
})();