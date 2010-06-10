var Configs = {
  template_path : "/javascripts/templates",  
  html_path : "../../html/studio",
}

var Ranking = {


  roundsClass : { "global_score" : { "default" : "total-blue" , "selected" : "total-orange" } ,
                   "first_round_score" : { "default" : "first-round-blue" , "selected" : "first-round-orange" } ,
                   "round16_score" : { "default" : "round16-blue" , "selected" : "round16-orange" } , 
                   "quarters_score" : { "default" : "quarters-blue" , "selected" : "quarters-orange" } ,
                   "semis_score" : { "default" : "semis-blue" , "selected" : "semis-orange" } ,
                   "finals_score" : { "default" : "finals-blue" , "selected" : "finals-orange" } ,
                },

  selectedRound : "global_score",
  
  friendRankCarousel : null,
  
  globalRankCarousel : null,
  
  templates : {
    ranking: [Configs.template_path + "/ranking.tpl",  0],
  },

  appId : function()
  {
    var data = window.location.toString().split("/")[3]
    return data
  },

  fetchTemplate: function(template){
    new Ajax.Request(Ranking.templates[template][0], {
                                                    method:'get',
	                                                  onSuccess: function(t){
		                                            		  Ranking.templates[template][1] = TrimPath.parseTemplate(t.responseText);
			                                              }
	  });
  },
  
  fetch : function(element) {
    var loading = document.createElement('div');
    loading.addClassName('loading');
    $("ranking").appendChild(loading);

    new Ajax.Request( "/" + Ranking.appId() + "/ranking/" + element.id, {method:'get', onSuccess: function(t, json){
        response = JSON.parse(t.responseText)

        var i, k=0;
        holders = [];
        for(i=0; i< 11 - response["friends_ranking"].length; i++)
        {
          holders[i] = i
        }
        for(k=0; k< response["friends_ranking"].length; k++)
        {
          if(response["friends_ranking"]["me"] == true)
          {
            break;
          }
        }
        k += holders.length
				$$('#friends-rank-container ul').first().update(Ranking.templates.ranking[1].process({users : response["friends_ranking"], holders : holders}));
				
        holders = []
        for(var i=0; i< 3 - response["friends_top_scorers"].length; i++)
        {
          holders[i] = i
        }
				$$('#friends-top-scorers ul').first().update(Ranking.templates.ranking[1].process({users :response["friends_top_scorers"], holders : holders}));
				
        holders = []
        for(var i=0; i< 11 - response["global_ranking"].length; i++)
        {
          holders[i] = i
        }
        var j; 
        for(j=0; j< response["friends_ranking"].length; j++)
        {
          if(response["friends_ranking"]["me"] == true)
          {
            break;
          }
        }
        j += holders.length
				$$('#global-rank-container ul').first().update(Ranking.templates.ranking[1].process({users : response["global_ranking"], holders : holders}));
				
        holders = [];
        for(var i=0; i< 3 - response["global_top_scorers"].length; i++)
        {
          holders[i] = i
        }
				$$('#top-scorers ul').first().update(Ranking.templates.ranking[1].process({ users : response["global_top_scorers"], holders : holders}));
				
				$(Ranking.selectedRound).setAttribute('class', Ranking.roundsClass[Ranking.selectedRound]["default"]);
				Ranking.selectedRound = element.id;
				element.setAttribute('class', Ranking.roundsClass[element.id]["selected"]);
				if ( Ranking.friendRankCarousel != null)
				{
//				  Ranking.friendRankCarousel.destroy();
				}
	      Ranking.friendRankCarousel = new UI.Carousel("friends-rank-scroll");
	      Ranking.friendRankCarousel.scrollTo(k);
				if ( Ranking.globalRankCarousel !=null)
				{
//				  Ranking.globalRankCarousel.destroy();
				}
	      Ranking.globalRankCarousel = new UI.Carousel("global-rank-scroll");
	      Ranking.globalRankCarousel.scrollTo(j)
	      loading.remove();
			}
		})
  },
  
  initialize: function(){
    for(var template in Ranking.templates){
      Ranking.fetchTemplate(template);
	  }
  },
	
}

Ranking.initialize()
