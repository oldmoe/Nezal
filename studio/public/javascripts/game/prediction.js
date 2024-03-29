var Prediction = {

    prediction : [],

    appId : function()
    {
		    var data = window.location.toString().split("/")[3];
		    return data;
	  },

    send : function( button ) {
		if($(button).hasClassName('busy') || $(button).hasClassName('off'))return
		myAudio.play('select')
        $(button).addClassName('busy')
		var id = window.location.search.toString().split('?')[1].split('=')[1].split('&')[0]
      	var error = false
      	if (﻿Studio.match.kicks)
      	{
          if ( ($('goalsA').innerHTML ==  $('goalsB').innerHTML) && ( $('penaltiesA').innerHTML == $('penaltiesB').innerHTML) )
          {
            error = true;
            alert("الماتش لا يمكنه الانتهاء بالتعادل في ضربات الجزاء");
          }else if( ($('goalsA').innerHTML !=  $('goalsB').innerHTML) && ($('penaltiesA').innerHTML != 00 || $('penaltiesB').innerHTML  != 00))
          {
            error = true;
            alert("لا يمكن ادخال ضربات جزاء بينما الاهداف غير متساوية");            
          }
        }
        if(!error) {
          Prediction.prediction = { "goals_a" : parseInt($('goalsA').innerHTML),
                                    "goals_b" : parseInt($('goalsB').innerHTML), 
                                    "kicks_a" : $('penaltiesA').innerHTML,
                                    "kicks_b" : $('penaltiesB').innerHTML
                                  }
          FBConnect.publish(Studio.match, Prediction.prediction);
          new Ajax.Request( "/" + Prediction.appId() + "/predictions/" + id, 
                          {
                              method:'post', 
                              parameters: { 
                                "goals_a" : $('goalsA').innerHTML,
                                "goals_b" : $('goalsB').innerHTML,
                                "kicks_a" : $('penaltiesA').innerHTML,
                                "kicks_b" : $('penaltiesB').innerHTML
                              },
                              onSuccess: function(t, json){
                                  Prediction.prediction = JSON.parse(t.responseText);
                                  $(button).removeClassName('busy')
                              }
                          });   
      }else{
		 $(button).removeClassName('busy')
	  }
    }
    
}
