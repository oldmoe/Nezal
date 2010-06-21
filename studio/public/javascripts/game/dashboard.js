var Dashboard = {
	months : [0,0,0,0,0,'يونيو','يوليو'],
	rounds : {
		first_round : {
			start : Date.parse('2010-06-11'),
			end : Date.parse('2010-06-25'),
			locations : [					
					[1, 0, 1, 0], 
					[1, 1, 0, 1], 
					[1, 1, 0, 1], 
					[1, 0, 1, 1],	
					[1, 1, 1, 0],
					[0, 1, 1, 1],
					[1, 0, 1, 1],	
					[1, 0, 1, 1],	
					[1, 1, 0, 1], 
					[1, 1, 0, 1], 
					[1, 1, 1, 0],
					[1, 1, 1, 1], 
					[1, 1, 1, 1], 
					[1, 1, 1, 1], 
					[1, 1, 1, 1]
			]
		},
		round16 : {
			start : Date.parse('2010-06-26'),
			end : Date.parse('2010-06-29'),
			locations : [
				[1, 0, 1, 0],
				[0, 1, 1, 0],
				[1, 0, 0, 1],
				[0, 1, 1, 0]
			]
		},
		quarters : {
			start : Date.parse('2010-07-02'),
			end : Date.parse('2010-07-03'),
			locations : [
				[1, 0, 1, 0],
				[0, 1, 0, 1]
			]
		},
		semis : {
			start : Date.parse('2010-07-06'),
			end : Date.parse('2010-07-07'),
			locations : [
				[1, 0, 1, 0],
				[0, 1, 0, 1]
			]
		},
		finals : {
			start : Date.parse('2010-07-10'),
			end : Date.parse('2010-07-11'),
			locations : [
				[1, 0, 1, 0],
				[0, 1, 0, 1]
			]
		}
	},
	
	scrolling : true,
	
	scrollUp : function(div, callback){
		if(!Dashboard.scrolling) return
		if(div.hasClassName('off')) return
		Dashboard.scrolling = false
		var table = $('first_roundTable')
		$$('.next_button')[0].removeClassName('off')
		new Effect.Move(table, {x:0, y: - 397, mode: 'relative', duration: 1.0 , afterFinish : function(){ Dashboard.scrolling = true; if(callback){callback()} }})
		myAudio.play('arrow_up_down')
		if(Number(table.style.top.gsub('px','')) - 397 + table.getHeight() <= 397 ) div.addClassName('off')
	},
	
	scrollDown : function(div, callback){
		if(!Dashboard.scrolling) return
		if(div.hasClassName('off')) return
		Dashboard.scrolling = false
		var table = $('first_roundTable')
		$$('.previous_button')[0].removeClassName('off')
		new Effect.Move(table, {x:0, y: 397, mode: 'relative', duration: 1.0 , afterFinish : function(){ Dashboard.scrolling = true; if(callback){callback()} }})
		myAudio.play('arrow_up_down')
		if(Number(table.style.top.gsub('px','')) + 397 >= 0 ) div.addClassName('off')
	},
	
	setupScrolling : function(){
		$$('.previous_button')[0].show().observe('click', function(){
			Dashboard.scrollUp(this)
		})
		$$('.next_button')[0].show().observe('click', function(){		
			Dashboard.scrollDown(this)
		})
	},
	
	removeScrolling : function(){
		$$('.previous_button')[0].hide()
		$$('.next_button')[0].hide()
	},
	
	matchesForDay : function(date){
		var matches = []
		this.data.matches.each(function(match){
			match = match[0]
			if(date.getMonth() == match.date.getMonth() && date.getDate() == match.date.getDate()){
				matches.push(match)
			}
		})
		return matches
	},
	
	matchesToLocations : function(round){
		var locations = []
		var round = this.rounds[round]
		var self = this
		round.locations.each(function(location, index){
			var date = new Date(round.start.toString()) 
			date.setDate(date.getDate()+index)
			var matches = self.matchesForDay(date)
			var matchedLocations = []
			location.each(function(loc, i){
				var match = null
				if(loc == 1){
					match = matches.shift()
					if(match == null) match = {date:date, empty:true}
				}else{
					match = {date:date, empty:true}
				}
				matchedLocations.push(match)
			})
			locations.push(matchedLocations)
		})
		return locations
	},
	
	getTeamById :function(id){
		return this.data.teams.find(function(team){
			return team[0].id == id
		})[0]
	},
	
	getPredictionByMatchId :function(id){
		var prediction =  this.data.predictions.find(function(p){
			return p.match_id == id
		})
		return prediction
	},
	
}
$(document).observe('dom:loaded',function(){
	FBConnect.init( function() {
		new Ajax.Request('matches', {method:'get', onComplete : function(req){
			Dashboard.data = (req.responseText).evalJSON()
			Dashboard.data.matches.each(function(match, index){
				match = match[0]
				time = match.start_time
				match.date = Date.parse(time.split(' ')[0])
				match.teamA = Dashboard.getTeamById(match.team_a_id)
				match.teamB = Dashboard.getTeamById(match.team_b_id)
				match.prediction = Dashboard.getPredictionByMatchId(match.id)
			})
			$('totalScore').innerHTML = Dashboard.data.user[0].global_score
			$('roundScore').innerHTML = Dashboard.data.user[0].first_round_score
			for(round in Dashboard.rounds){
				$(round+'Table').innerHTML = TrimPath.processDOMTemplate('table', {locations:Dashboard.matchesToLocations(round)})
			}
			//$('groupsTable').innerHTML = TrimPath.processDOMTemplate('table', {locations:Dashboard.matchesToLocations('first_round')})
			
			$('first_roundTable').show()
			Dashboard.setupScrolling();
			Dashboard.scrollUp($$('.previous_button')[0], function(){
				Dashboard.scrollUp($$('.previous_button')[0])
			})
			$('ranks').observe('click', function(){
				  if($('rankings_frame').src == null || $('rankings_frame').src == ''){
					$('rankings_frame').src = 'html/studio/ranking.html'
				  }
				  $('rankings_shade').setOpacity(0.8)
				  $('rankings').show();
			})

			$$("#content #links div").each(function(div){
				div.observe('click', function(){
					if(div.hasClassName('on')) return
					$$("#content #links div").each(function(d){d.removeClassName('on')})
					var className = div.className
					for(round in Dashboard.rounds){
						if(round != className){
							$(round+'Table').hide();
						}
						$(className+'Table').show();
						if(className == 'first_round'){
							Dashboard.setupScrolling();
						}else{
							Dashboard.removeScrolling();
						}
					}
					div.addClassName('on')
					$('roundScore').innerHTML = Dashboard.data.user[0][className +'_score']
					$('content').className = className
				})
			})
			
			$('sound').observe('click', function(){
				myAudio.toggle(this);
			})
		}})
	});
})