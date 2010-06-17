var Configs = {
  template_path : "/javascripts/templates"  
}

var Comments = {

    smsNumber : 10, 
    
    comments : [ ],
    
    warning : [[ { "id" : 0, 
        "message" : "تنويه: نرجو من مستخدمي الموقع الكرام عدم إضافة أي تعليق يسيء للأديان , المعتقدات أو المقدسات. ونرجو عدم استخدام خدمة التعليقات في الترويج لأي إعلانات. كما نرجو ألا يتضمن التعليق السباب أو أي ألفاظ تخدش الحياء والذوق العام  "}]],
    
    sms : '',
        
    appId : function()
    {
		    var data = window.location.toString().split("/")[3]
		    return data
	  },

    matchId : function()
    {
        var matchId = null;
        var idParam = window.location.toString().split('?')[1]
        if(idParam) 
        {
          matchId = idParam.split('=')[1]
        }
        return matchId;
    },
    
    commentId : function()
    {
        $$('msgs div').first();
    },
    
    templates : {
        comments: [Configs.template_path + "/comments.tpl",  0],
        sms: [Configs.template_path + "/sms.tpl",  0]
    },

    fetchTemplate: function(template, callback){
        new Ajax.Request(Comments.templates[template][0], 
                          {   method:'get',
                              onSuccess: function(t){
                          		  Comments.templates[template][1] = TrimPath.parseTemplate(t.responseText);
                          		  callback();
                              }
                          });
    },
    
    fetch : function(element) {
        var comment_id="0";
        if(Comments.comments.first())
        {
          comment_id = Comments.comments.first()[0]['id'];
        }
        var matchId = "";
        if ( Comments.matchId() )
        {
          matchId = Comments.matchId() + "/"
        }
        new Ajax.Request( "/" + Comments.appId() + "/comments/" + matchId  + comment_id, 
                              {   method:'get', 
                                  onSuccess: function(t, json){
                                      var response = JSON.parse(t.responseText);
                                      Comments.comments = response["comments"].concat(Comments.comments).slice(0, 10)
                                      Comments.sms = Comments.templates.sms[1].process({ msgs : Comments.comments.concat(Comments.warning)});
                                			if ( ! $$('#sms_marquee marquee').first() )
                                			{
                                			    window.setTimeout( Comments.refreshUpdate, 1000);
                  			          		}
                  			          		window.setTimeout( Comments.fetch, 20000 );
                                  }
                              });
    },
    
    refreshUpdate : function() {
  			$('sms_marquee').update(Comments.sms);
  			if(Prototype.Browser.WebKit == true)
		    {
		    		time = ( $$('marquee').first().scrollWidth/700 ) * 11.5 + 5
		    		window.setTimeout( Comments.refreshUpdate, 1000 * time );
	      }
    },
    
    send : function(button, input_name) {
        if($(button).hasClassName('busy')) return
		$(button).addClassName('busy')
		myAudio.play('select')
		var element = $(input_name)
		
		window.setTimeout(function(){
			$(button).removeClassName('busy')
		}, 30000)
        var matchId = "";
        if ( Comments.matchId() )
        {
          matchId = Comments.matchId() + "/"
        }
        new Ajax.Request( "/" + Comments.appId() + "/comments/" + matchId, 
                          {
                              method:'post', 
                              parameters: { message : element.value },
                              onComplete: function(transport, json){
                                  element.value = ''
                                  
                              }
                          });   
    },
    
    initialize: function(){
        Comments.fetchTemplate("sms", Comments.fetch);
    }
	
}
