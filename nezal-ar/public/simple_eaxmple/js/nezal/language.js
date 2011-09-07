var Language = {

    supported : {
      'en_US' : 'english',
      'en_GB' : 'english',
      'fr_CA' : 'french',
      'fr_FR' : 'french',
      'ar_AR' : 'arabic'
    },
    
    langsNames : [
      ['english', 'English'],
      ['arabic', 'العربية'],
      ['french', 'Français']
    ],
    
    userLanguage : 'english',
    
    getLanguage : function(savedLang, callback){
        if(savedLang)
        {
          Language.userLanguage = savedLang;
          callback();
        }
        else
        {
          FBConnect.getUserInfo(function(){
              if(Language.supported[FBConnect.user.locale])
                  Language.userLanguage = Language.supported[FBConnect.user.locale];
              callback();
          })
        }
    },
    
    select : function(lang, callback){
        new Ajax.Request( 'users/locale', {method:'post',
                                parameters: { 'locale' : lang},
                                onSuccess: function(t){
                                    Language.userLanguage = t.responseText;
                                    callback();
                                }
                        })
    }
    
}
