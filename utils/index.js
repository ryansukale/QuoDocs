var _ = require('underscore');

var pointsConfig = {
	standard : {
		'response-audio':10,
		'response-text':10
	},
	bonus : {
		first:20
	}
};

var applicableBonus = {
	'response-audio': function(options){
		//console.log('here');
		var applicableBonuses = [];
		if(options.allResponses.length===1){
			applicableBonuses.push('first');
		}
		return applicableBonuses;
	}
}

module.exports = {
	grantPoints:function (options){
		
		var standardPoints  = pointsConfig.standard[options.type];
		
		var applicableBonuses = applicableBonus[options.type](options.details);
		
		console.log('applicableBonuses:'+applicableBonuses);
		var bonuses = {};
		var totalPoints = standardPoints;
		_.each(applicableBonuses, function(bonusType, index, list){
			bonuses[bonusType] = pointsConfig.bonus[bonusType];
			totalPoints += bonuses[bonusType];
			console.log(totalPoints);
		});
		
		return {
			standardPoints : standardPoints,
			bonuses : bonuses,
			totalPoints : totalPoints
		}
		
	}
}
