data={
  "name" : "thawragy",
  "ranks" : {},
  "quests":{ 
        "id_generator":0,
        "list":{}
    },
    "languages" : { 'english' : {}, 'arabic' : {} }
}

new Ajax.Request( '/nezal-admin/local-base-defender.json' , {
                method : 'put',
                parameters : { "data" : JSON.stringify(data) }
            });
