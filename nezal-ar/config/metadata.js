data={
  "buildings" : {
    "townhall":{
      "levels":{
            "0" : { "dependency" :{"buildings":{}}, "limited_by":null,"limiting":{"global":3,"others":{"lumbermill":2}},
                    "hp": 1000, "time" : 0,
                    "display":{"xdim":48,"ydim":52,"zdim":100,"imgWidth":160,"imgHeight":186,
                               "area":"158,115,167,40,162,12,144,30,141,42,100,29,85,14,78,1,71,17,54,26,26,40,18,44,9,52,14,112,61,134,76,149,93,136,133,120,152,122,157,117"},
                    "storageCapacity":50000
            },
            "1" : { "dependency" :{"buildings":{}}, "limited_by":null,"limiting":{"global":3,"others":{"lumbermill":2}},
                    "hp": 1000,"rock":4000,"lumber":2000,"time":15,
                    "display":{"xdim":48,"ydim":52,"zdim":100,"imgWidth":160,"imgHeight":186,
                               "area":"158,115,167,40,162,12,144,30,141,42,100,29,85,14,78,1,71,17,54,26,26,40,18,44,9,52,14,112,61,134,76,149,93,136,133,120,152,122,157,117"},
                    "storageCapacity":50000
            },
            "2" : { "dependency" :{"buildings":{}}, "limited_by":null,"limiting":{"global":3,"others":{"lumbermill":2}},
                    "hp": 2000,"rock":3000,"lumber":3000,"time":15,
                    "display":{"xdim":48,"ydim":52,"zdim":100,"imgWidth":160,"imgHeight":186,
                               "area":"158,115,167,40,162,12,144,30,141,42,100,29,85,14,78,1,71,17,54,26,26,40,18,44,9,52,14,112,61,134,76,149,93,136,133,120,152,122,157,117"},
                    "storageCapacity":50000
            }
      }
    },
    "quarry":{
      "levels":{
        "0" : {
          "dependency" :{"buildings":{"townhall":1}}, "limited_by":"townhall","limiting":{"global":3,"others":{}},
          "hp": 800, "time" : 0,
          "display"  : {"xdim":35,"ydim":35,"zdim":31,"imgWidth":124,"imgHeight":93,
                        "area":"9,26,10,21,19,15,33,8,65,11,79,14,94,34,115,55,110,64,84,79,78,91,58,94,56,84,47,84,10,69,5,52,11,37"}
        },
        "1":{
          "dependency" :{"buildings":{"townhall":1}}, "limited_by":null,"limiting":{"global":3,"others":{}},
          "hp": 800, "rock":2000, "lumber":2000, "time":15, "max_workers":1, "unit_per_worker_minute":20, "capacity":1000,
          "display" : {"xdim":35,"ydim":35,"zdim":31,"imgWidth":124,"imgHeight":93,
                       "area":"9,26,10,21,19,15,33,8,65,11,79,14,94,34,115,55,110,64,84,79,78,91,58,94,56,84,47,84,10,69,5,52,11,37"}
        },
        "2":{ 
          "dependency" :{"buildings":{"townhall":1}}, "limited_by":null,"limiting":{"global":3,"others":{}}, 
          "hp": 5000,"rock":2000,"lumber":2000,"time":15,"max_workers":1,"unit_per_worker_minute":20,"capacity":1000,
          "display":{"xdim":35,"ydim":35,"zdim":31,"imgWidth":124,"imgHeight":93,
                     "area":"9,26,10,21,19,15,33,8,65,11,79,14,94,34,115,55,110,64,84,79,78,91,58,94,56,84,47,84,10,69,5,52,11,37"}
        }
      }
    },
    "lumbermill":{
      "levels":{
        "0" : {
          "dependency" :{"buildings":{"townhall":1}}, "limited_by":"townhall","limiting":{"global":3,"others":{}},
          "hp": 800,"time" : 0,
          "display":{"xdim":35,"ydim":35,"zdim":62,"imgWidth":124,"imgHeight":124,
                     "area":"97,79,89,42,104,31,107,19,98,5,83,4,66,0,52,12,35,4,29,9,25,29,18,26,17,12,6,17,0,69,17,74,25,81,40,81,92,81"}},
        "1" : {
          "dependency" :{"buildings":{"townhall":1}}, "limited_by":"townhall","limiting":{"global":3,"others":{}},
          "hp": 800, "rock":2000, "lumber":3000, "time":15,
          "max_workers":1,"unit_per_worker_minute":20,"capacity":1000,
          "display":{"xdim":35,"ydim":35,"zdim":62,"imgWidth":124,"imgHeight":124,
                     "area":"97,79,89,42,104,31,107,19,98,5,83,4,66,0,52,12,35,4,29,9,25,29,18,26,17,12,6,17,0,69,17,74,25,81,40,81,92,81"}}
        }
    },
    "storage":{
      "levels":{
        "0":{ "dependency" :{"buildings":{"townhall":1}}, "limited_by":null,"limiting":{"global":3,"others":{}},
              "hp": 700,"time": 0 ,
              "display":{"xdim":17, "ydim":17, "zdim":124, "imgWidth":64, "imgHeight":155,
                         "area":"2,133,5,116,8,101,10,86,8,73,7,58,10,41,18,33,26,28,26,18,36,19,37,29,51,41,54,59,52,75,52,92,52,108,56,124,56,139,35,148,22,147,14,145,6,140"}
        },
        "1":{ "dependency" :{"buildings":{"townhall":1}}, "limited_by":null,"limiting":{"global":3,"others":{}},
              "hp": 700,"rock":1000,"lumber":1000,"time":15,"storageCapacity":2000,
              "display":{"xdim":17, "ydim":17, "zdim":124, "imgWidth":64,"imgHeight":155,
                         "area":"2,133,5,116,8,101,10,86,8,73,7,58,10,41,18,33,26,28,26,18,36,19,37,29,51,41,54,59,52,75,52,92,52,108,56,124,56,139,35,148,22,147,14,145,6,140"}
        },
        "2":{ "dependency" :{"buildings":{"townhall":1}}, "limited_by":null,"limiting":{"global":3,"others":{}}, 
              "hp": 1000,"rock":1000,"lumber":1000,"time":15,"storageCapacity":2000,
              "display":{"xdim":17, "ydim":17, "zdim":124, "imgWidth":64,"imgHeight":155, 
                         "area":"61,138,40,150,20,150,2,140,1,91,9,66,13,38,28,27,36,16,50,33,60,48,62,64,55,77,58,97,61,121"}
        }
      }
  },
    "defense_center":{
      "levels":{
        "0":{ "dependency" :{"buildings":{"townhall":1}}, "limited_by":null,"limiting":{"global":3,"others":{}},
        "hp": 700,"time": 0 ,
              "display":{"xdim":35, "ydim":35, "zdim":93, "imgWidth":124, "imgHeight":155,
              "area":"102,97,97,45,83,43,53,1,32,25,6,61,0,82,4,113,67,120,100,102"}
        },
        "1":{ "dependency" :{"buildings":{"townhall":1}}, "limited_by":null,"limiting":{"global":3,"others":{}},
        "hp": 700,"rock":1000,"lumber":1500,"time":15,
              "display":{"xdim":35, "ydim":35, "zdim":93, "imgWidth":124, "imgHeight":155,
              "area":"102,97,97,45,83,43,53,1,32,25,6,61,0,82,4,113,67,120,100,102"}
        }
      }
  },
  "war_factory" : {
       "levels":{
         "0" : {
              "dependency" :{"buildings":{"townhall":1}}, "limited_by":null,"limiting":{"global":3,"others":{}},
              "hp": 800,
              "time" : 0,
              "max_queue_size":0,
              "queue":{"size":0,"creep":null,"last_creep_start":null,"creep_production_time":null},
              "display" : {"xdim":35,"ydim":35,"zdim":93,"imgWidth":124,"imgHeight":155,
                           "area":"101,118,102,111,102,91,104,77,107,72,84,61,81,60,67,21,63,14,38,17,45,20,45,28,42,37,52,44,47,61,21,70,18,73,25,99,21,85,13,101,10,123,48,141,79,128"}
        },
        "1":{
              "dependency" :{"buildings":{"townhall":1}}, "limited_by":null,"limiting":{"global":3,"others":{}},
              "hp": 800, "rock":2000, "lumber":2000, "time":15,
              "max_queue_size":3,
              "queue":{"size":0,"creep":null,"last_creep_start":null,"creep_production_time":null},
              "display" : {"xdim":35,"ydim":35,"zdim":93,"imgWidth":124,"imgHeight":155,
                           "area":"101,118,102,111,102,91,104,77,107,72,84,61,81,60,67,21,63,14,38,17,45,20,45,28,42,37,52,44,47,61,21,70,18,73,25,99,21,85,13,101,10,123,48,141,79,128"}
        }
      }
  },
  "house" :{
    "levels":{
       "0" : {
            "workers" : 2,
            "dependency" :{"buildings":{"townhall":1}}, "limited_by":null,"limiting":{"global":3,"others":{}},
            "hp": 800,
            "time" : 0,
            "display" : {"xdim":35,"ydim":35,"zdim":93,"imgWidth":124,"imgHeight":155,
                         "area":"109,116,104,106,104,94,86,85,90,49,76,41,63,30,52,28,48,17,45,14,43,27,30,39,17,56,18,62,28,88,25,104,16,101,22,116,20,122,54,136,106,117"}
      },
      "1":{
            "workers" : 2,
            "dependency" :{"buildings":{"townhall":1}}, "limited_by":null,"limiting":{"global":3,"others":{}},
            "hp": 800, "rock":2000, "lumber":2000, "time":15,
            "display" : {"xdim":35,"ydim":35,"zdim":93,"imgWidth":124,"imgHeight":155,
                         "area":"109,116,104,106,104,94,86,85,90,49,76,41,63,30,52,28,48,17,45,14,43,27,30,39,17,56,18,62,28,88,25,104,16,101,22,116,20,122,54,136,106,117"}
      }
    }
  },
  "palm" : {
		"levels":{
					"0":{ 
						  "dependency" :{"buildings":{"townhall":1}}, "limited_by":null,"limiting":{"global":3,"others":{}},
						  "hp": 1000, "time": 2, 
						  "display":{ "xdim":17,"ydim":17,"zdim":62,"imgWidth":64,"imgHeight":93,
								  "area" : "51,83,63,37,61,24,42,8,17,3,9,20,0,38,10,73,29,90,50,86"} 
					},
					"1":{
						  "dependency" :{"buildings":{"townhall":1}}, "limited_by":null,"limiting":{"global":3,"others":{}},
						  "hp": 1000, "time": 2,  "rock" : 100, "lumber" : 100,
						  "display":{ "xdim":17,"ydim":17,"zdim":62,"imgWidth":64,"imgHeight":93,
								  "area" : "51,83,63,37,61,24,42,8,17,3,9,20,0,38,10,73,29,90,50,86"} 
					}
		  }
  },
  "garage" : {
		"levels":{
       "0" : {
            "workers" : 2,
            "dependency" :{"buildings":{"townhall":1}}, "limited_by":null,"limiting":{"global":3,"others":{}},
            "hp": 800,
            "time" : 0,
            "display" : {"xdim":35,"ydim":35,"zdim":93,"imgWidth":124,"imgHeight":155,
                         "area":"109,116,104,106,104,94,86,85,90,49,76,41,63,30,52,28,48,17,45,14,43,27,30,39,17,56,18,62,28,88,25,104,16,101,22,116,20,122,54,136,106,117"}
      },
      "1":{
            "workers" : 2,
            "dependency" :{"buildings":{"townhall":1}}, "limited_by":null,"limiting":{"global":3,"others":{}},
            "hp": 800, "rock":2000, "lumber":2000, "time":15,
            "display" : {"xdim":35,"ydim":35,"zdim":93,"imgWidth":124,"imgHeight":155,
                         "area":"109,116,104,106,104,94,86,85,90,49,76,41,63,30,52,28,48,17,45,14,43,27,30,39,17,56,18,62,28,88,25,104,16,101,22,116,20,122,54,136,106,117"}
      }
	  }
  },
  "defense_research" : {
		"levels":{
       "0" : {
            "workers" : 2,
            "dependency" :{"buildings":{"townhall":1}}, "limited_by":null,"limiting":{"global":3,"others":{}},
            "hp": 800,
            "time" : 0,
            "display" : {"xdim":35,"ydim":35,"zdim":93,"imgWidth":124,"imgHeight":155,
                         "area":"109,116,104,106,104,94,86,85,90,49,76,41,63,30,52,28,48,17,45,14,43,27,30,39,17,56,18,62,28,88,25,104,16,101,22,116,20,122,54,136,106,117"}
      },
      "1":{
            "workers" : 2,
            "dependency" :{"buildings":{"townhall":1}}, "limited_by":null,"limiting":{"global":3,"others":{}},
            "hp": 800, "rock":2000, "lumber":2000, "time":15,
            "display" : {"xdim":35,"ydim":35,"zdim":93,"imgWidth":124,"imgHeight":155,
                         "area":"109,116,104,106,104,94,86,85,90,49,76,41,63,30,52,28,48,17,45,14,43,27,30,39,17,56,18,62,28,88,25,104,16,101,22,116,20,122,54,136,106,117"}
      }
	  }
  },
  "military_research" : {
		"levels":{
       "0" : {
            "workers" : 2,
            "dependency" :{"buildings":{"townhall":1}}, "limited_by":null,"limiting":{"global":3,"others":{}},
            "hp": 800,
            "time" : 0,
            "display" : {"xdim":35,"ydim":35,"zdim":93,"imgWidth":124,"imgHeight":155,
                         "area":"109,116,104,106,104,94,86,85,90,49,76,41,63,30,52,28,48,17,45,14,43,27,30,39,17,56,18,62,28,88,25,104,16,101,22,116,20,122,54,136,106,117"}
      },
      "1":{
            "workers" : 2,
            "dependency" :{"buildings":{"townhall":1}}, "limited_by":null,"limiting":{"global":3,"others":{}},
            "hp": 800, "rock":2000, "lumber":2000, "time":15,
            "display" : {"xdim":35,"ydim":35,"zdim":93,"imgWidth":124,"imgHeight":155,
                         "area":"109,116,104,106,104,94,86,85,90,49,76,41,63,30,52,28,48,17,45,14,43,27,30,39,17,56,18,62,28,88,25,104,16,101,22,116,20,122,54,136,106,117"}
      }
	  }
  },
  "wedge" : {
    "levels":{
        "0":{ 
              "dependency" :{"buildings":{"townhall":1,"defense_center":1}}, "limited_by":null,"limiting":{"global":3,"others":{}},
              "hp": 1000, "weapon" : "slingshot", "time": 10, 
              "specs" : { "power" : 30, "range" : 200, "speed" : 100, "armor" : 100 },
              "display":{ "xdim":17,"ydim":17,"zdim":62,"imgWidth":64,"imgHeight":93,
                      "movingArea":"16,82,12,67,10,50,0,53,0,40,8,39,6,25,3,6,20,1,36,4,34,19,30,38,38,39,42,51,28,50,23,64,18,78",
                      "area" : "20,68,19,54,16,39,15,22,27,13,38,13,47,21,46,39,43,55,38,67,37,69,48,75,40,79,27,80,12,74"} 
        },
        "1":{
              "dependency" :{"buildings":{"townhall":1,"defense_center":1}}, "limited_by":null,"limiting":{"global":3,"others":{}},
              "hp": 1000, "weapon" : "slingshot", "time": 10, 
              "specs" : { "power" : 30, "range" : 200, "speed" : 100, "armor" : 100 },
              "time": 10, "rock" : 100, "lumber" : 100,
              "display" : {"xdim":17, "ydim":17, "zdim":62, "imgWidth":64, "imgHeight":93,
                    "movingArea":"16,82,12,67,10,50,0,53,0,40,8,39,6,25,3,6,20,1,36,4,34,19,30,38,38,39,42,51,28,50,23,64,18,78",
                    "area" : "20,68,19,54,16,39,15,22,27,13,38,13,47,21,46,39,43,55,38,67,37,69,48,75,40,79,27,80,12,74"} 
        }
      }
  },
  "gaddafi" : {
    "levels":{
      "0":{ 
            "dependency" :{"buildings":{"townhall":1,"defense_center":1}}, "limited_by":null,"limiting":{"global":3,"others":{}},
            "hp": 1000, "weapon" : "slingshot", "time": 10, 
            "specs" : { "power" : 30, "range" : 200, "speed" : 100, "armor" : 100 },
            "display":{ "xdim":17,"ydim":17,"zdim":62,"imgWidth":64,"imgHeight":93,
                    "movingArea":"16,82,12,67,10,50,0,53,0,40,8,39,6,25,3,6,20,1,36,4,34,19,30,38,38,39,42,51,28,50,23,64,18,78",
                    "area" : "20,68,19,54,16,39,15,22,27,13,38,13,47,21,46,39,43,55,38,67,37,69,48,75,40,79,27,80,12,74"} 
      },
      "1":{
            "dependency" :{"buildings":{"townhall":1,"defense_center":1}}, "limited_by":null,"limiting":{"global":3,"others":{}},
            "hp": 1000, "weapon" : "slingshot", "time": 10, 
            "specs" : { "power" : 30, "range" : 200, "speed" : 100, "armor" : 100 },
            "time": 10, "rock" : 100, "lumber" : 100,
            "display" : {"xdim":17, "ydim":17, "zdim":62, "imgWidth":64, "imgHeight":93,
                  "movingArea":"16,82,12,67,10,50,0,53,0,40,8,39,6,25,3,6,20,1,36,4,34,19,30,38,38,39,42,51,28,50,23,64,18,78",
                  "area" : "20,68,19,54,16,39,15,22,27,13,38,13,47,21,46,39,43,55,38,67,37,69,48,75,40,79,27,80,12,74"} 
      }
      }
    }
  },
  
  researches : {
    "cement" : {
      "dependency" : {  },
      "benefits" : {
        //10 means : 10%
        "buildings" : { "hp": 10 } 
      },
      "needs" : {
        time : 10,
        rock : 1000,
        lumber : 1000
      }
    }
  },
  
  "workers":{
    "initial_allowed" : 3,
    "initial_coins" : 50,
    "factor" : 2
  },
  "weapons" : {
      "slingshot" : { 
          "cost" :  { "lumber" : 100, "rock" : 80 },
          "display" : {"xdim":17,"ydim":17,"zdim":70,"imgWidth":64,"imgHeight":93,"area" : "12,9,28,4,50" }
      },
      "kraken2" : { 
          "specs" : { "power" : 100, "range" : 200, "speed" : 100, "armor" : 100 },
          "cost" :  { "lumber" : 100, "rock" : 80 },
          "display" : {"xdim":17,"ydim":17,"zdim":70,"imgWidth":64,"imgHeight":93,"area" : "12,9,28,4,50" }
      }
  },
  "creeps":{
      "car" : {
          "hp" : 100,
          "power" : 10,
          "speed" : 3,
          "garage_units":2,
          "production_time":10
      }
  },
  "xp_levels" : {
    "1" :{"max_helping_power" : 5, "helping_power_unit_every" : 1800, "max_xp" : 100},
    "2" :{"max_helping_power" : 6, "helping_power_unit_every" : 1800, "max_xp" : 400},
    "3" :{"max_helping_power" : 7, "helping_power_unit_every" : 1800, "max_xp" : 1000},
    "4" :{"max_helping_power" : 8, "helping_power_unit_every" : 1800, "max_xp" : 1800},
    "5" :{"max_helping_power" : 9, "helping_power_unit_every" : 1800, "max_xp" : 3000},
    "6" :{"max_helping_power" : 10, "helping_power_unit_every" : 1800, "max_xp" : 5000},
    "7" :{"max_helping_power" : 11, "helping_power_unit_every" : 1800, "max_xp" : 8000},
    "8" :{"max_helping_power" : 12, "helping_power_unit_every" : 1800, "max_xp" : 12000}
  }, 
  "languages" : { 'english' : {}, 'arabic' : {} }
}

new Ajax.Request( '/nezal-admin/local-base-defender/metadata' , {
                method : 'put',
                parameters : { "data" : JSON.stringify(data) }
            });
