var Prediction = {

    appId : function()
    {
		    var data = window.location.toString().split("/")[3]
		    return data
	  },

    send : function( button ) {
		myAudio.play('select')
        button.style.cursor = "progress";
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
        if(!error)
        {
          new Ajax.Request( "/" + Prediction.appId() + "/predictions/" + id, 
                          {
                              method:'post', 
                              parameters: { 
                                "goals_a" : $('goalsA').innerHTML,
                                "goals_b" : $('goalsB').innerHTML,
                                "kicks_a" : $('penaltiesA').innerHTML,
                                "kicks_b" : $('penaltiesB').innerHTML,
                              },
                              onSuccess: function(transport, json){
                                  button.style.cursor = "pointer";
                              },
                          });   
      }
    }
    
}
