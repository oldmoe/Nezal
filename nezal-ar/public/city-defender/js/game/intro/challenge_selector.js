var ChallengeSelector = {

  challenges: [],
  
  selected: 0,
    
  list: function(element){
    $(Intro.pages[Intro.currentPage]).style['cursor'] = "progress"
    element.style['cursor'] = "progress"
    new Ajax.Request('challenges', {method:'get', onComplete: function(t, json){
        ChallengeSelector.challenges = JSON.parse(t.responseText);
        $('challenges').innerHTML = Intro.templates.challenges[1].process({"challenges" : ChallengeSelector.challenges});
        Intro.next();
			}
		})
  },
  
  select: function(challenge, callback){
    new Ajax.Request('challenges' + challenge + "/city.info" , {method:'get', onComplete: function(t, json){
        ChallengeSelector.city = JSON.parse(t.responseText);
        $('cityInfo').innerHTML = Intro.templates.cityInfo[1].process({ "city" : ChallengeSelector.city, "path" : challenge });
        callback();
			}
		})
  }
  
}


