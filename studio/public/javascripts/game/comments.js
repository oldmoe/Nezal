var Configs = {
  template_path : "/javascripts/templates",  
}

var Comments = {

    smsNumber : 10, 
    
    comments : [ [ { "id" : 0, 
        "message" : "تنويه: نرجو من مستخدمي الموقع الكرام عدم إضافة أي تعليق يمس أو يسيء للأديان أو المعتقدات أو المقدسات. ونرجو عدم استخدام خدمة التعليقات في الترويج لأي إعلانات. كما نرجو ألا يتضمن التعليق السباب أو أي ألفاظ تخدش الحياء والذوق العام تجاه أي شخصيات عامة أو غير عامة "}] ],
    
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
        sms: [Configs.template_path + "/sms.tpl",  0],
    },

    fetchTemplate: function(template){
        new Ajax.Request(Comments.templates[template][0], 
                          {   method:'get',
                              onSuccess: function(t){
                          		  Comments.templates[template][1] = TrimPath.parseTemplate(t.responseText);
                              },
                          });
    },
    
    fetch : function(element) {
        var comment_id="";
        var last_comment = $$("#sms_marquee span").first()
        if(last_comment)
        { 
            comment_id = last_comment["id"]
        }
        new Ajax.Request( "/" + Comments.appId() + "/comments/" + Comments.matchId() + "/" + comment_id, 
                              {   method:'get', 
                                  onSuccess: function(t, json){
                                      var response = JSON.parse(t.responseText)
                                      Comments.comments = response["comments"].concat(Comments.comments)
                                      Comments.sms = Comments.templates.sms[1].process({ msgs : Comments.comments.slice(0,10) })
                                  },
                              });
    },
    
    refresh : function() {
  			$('sms_marquee').update(Comments.sms);
        Comments.fetch();
    },
    
    send : function(input_name) {
        var element = $(input_name)
        new Ajax.Request( "/" + Comments.appId() + "/comments/" + Comments.matchId(), 
                          {
                              method:'post', 
                              parameters: { message : element.value },
                              onSuccess: function(transport, json){
                                  element.value = null
                              },
                          });   
    },
    
    initialize: function(){
        for(var template in Comments.templates){
            Comments.fetchTemplate(template);
  	    }
  	    window.setTimeout( Comments.fetch, 100)
    },
	
}

Comments.initialize()
