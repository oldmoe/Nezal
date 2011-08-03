data={
  "name" : "local-base-defender",
  "buildings" : {
        "townhall": {
            "levels":{
                "0": {"dependency":{"buildings":{}},"limited_by":null,"limiting":{"global":3,"others":{"lumbermill":2}},"hp":1000,"time":0,
                      "display":{"xdim":48,"ydim":52,"zdim":100,"imgWidth":160,"imgHeight":186,"area":"158,117"},"storageCapacity":20000
                },
                "1": {"dependency":{"buildings":{}},"limited_by":null,
                    "limiting" : { "global":1, "others" : {"lumbermill":2,"quarry":2,"house":2,"defense_center":1,"war_factory":1} },
                    "hp":800,"rock":12000,"lumber":3000,"time":10,
                    "display":{"xdim":48,"ydim":52,"zdim":100,"imgWidth":157,"imgHeight":186,"area":"158,117"}, "storageCapacity":50000
                },
                "2": {"dependency":{"buildings":{"storage":"2","defense_center":"1"}},"limited_by":null,
                      "limiting":{"global":1,"others" : {"lumbermill":2,"quarry":2,"house":2,"defense_center":1,"war_factory":1}},
                      "hp":1000,"rock":100000,"lumber":25000,"time":21600,
                      "display":{"xdim":48,"ydim":52,"zdim":100,"imgWidth":157,"imgHeight":186,"area":"158,117"},"storageCapacity":100000
                }
            },
            "defense":false,"displayable":{"hp":false,"rock":false,"lumber":false,"time":false,"storageCapacity":false}
        },

        "quarry":{
            "levels":{
                "0":{"dependency":{"buildings":{"townhall":1}},"limited_by":"townhall",
                    "limiting":{"global":3,"others":{}},"hp":800,"time":0,
                    "display":{"xdim":35,"ydim":35,"zdim":31,"imgWidth":124,"imgHeight":93,"area":"9,37"}
                },
                "1":{"dependency":{"buildings":{"townhall":"1"}},"limited_by":"townhall",
                    "limiting":{"global":1,"others":{"storage":"1"}},"hp":300,"rock":1000,"lumber":4000,"time":10,"max_workers":1,
                    "unit_per_worker_minute":30,"capacity":3600,
                    "display":{"xdim":35,"ydim":35,"zdim":31,"imgWidth":124,"imgHeight":93,"area":"9,37"}
                },
                "2":{"dependency":{"buildings":{"townhall":"1"}},"limited_by":"townhall",
                    "limiting":{"global":1,"others":{"storage":"1"}},"hp":330,"rock":2000,"lumber":8000,"time":300,"max_workers":1,
                    "unit_per_worker_minute":60,"capacity":14400,
                    "display":{"xdim":35,"ydim":35,"zdim":31,"imgWidth":124,"imgHeight":93,"area":"9,37"}
                },
                "3":{"dependency":{"buildings":{"townhall":"2"}},"limited_by":"townhall",
                    "limiting":{"global":1,"others":{"storage":"2"}},"hp":360,"rock":7000,"lumber":28000,"time":900,"max_workers":1,
                    "unit_per_worker_minute":90,"capacity":32400,
                    "display":{"xdim":35,"ydim":35,"zdim":31,"imgWidth":124,"imgHeight":93,"area":"9,37"}
                }
            },
            "defense":false,
            "displayable":{"hp":true,"rock":false,"lumber":false,"time":false,
                          "max_workers":false,"unit_per_worker_minute":true,"capacity":true}
        },

        "lumbermill":{
            "levels":{
                "0":{"dependency":{"buildings":{"townhall":1}},"limited_by":"townhall",
                      "limiting":{"global":3,"others":{}},"hp":800,"time":0,
                      "display":{"xdim":35,"ydim":35,"zdim":62,"imgWidth":124,"imgHeight":124,"area":"97,81"}
                },
                "1":{"dependency":{"buildings":{"townhall":"1"}},"limited_by":"townhall",
                      "limiting":{"global":1,"others":{"storage":1}},"hp":300,"rock":4000,"lumber":1000,
                      "time":10,"max_workers":1,"unit_per_worker_minute":30,"capacity":3600,
                      "display":{"xdim":35,"ydim":35,"zdim":62,"imgWidth":124,"imgHeight":124,"area":"97,81"}
                }
            },
            "defense":false,
            "displayable":{"hp":false,"rock":false,"lumber":false,"time":false,"max_workers":false,"unit_per_worker_minute":true,"capacity":true}
        },

        "storage":{
            "levels":{
                "0":{"dependency":{"buildings":{"townhall":1}},"limited_by":null,
                    "limiting":{"global":3,"others":{}},"hp":700,"time":0,
                    "display":{"xdim":17,"ydim":17,"zdim":124,"imgWidth":64,"imgHeight":155,"area":"2,140"}
                },
                "1":{"dependency":{"buildings":{"quarry":"1","lumbermill":"1"}},"limited_by":"quarry",
                    "limiting":{"global":1,"others":{}},"hp":400,"rock":2000,"lumber":500,"time":300,"storageCapacity":12500,
                    "display":{"xdim":17,"ydim":17,"zdim":124,"imgWidth":64,"imgHeight":155,"area":"61,121"}
                },
                "2":{"dependency":{"buildings":{"quarry":"2","lumbermill":"2"}},"limited_by":"quarry",
                    "limiting":{"global":1,"others":{}},"hp":440,"rock":10000,"lumber":2500,"time":2400,"storageCapacity":50000,
                    "display":{"xdim":17,"ydim":17,"zdim":124,"imgWidth":64,"imgHeight":155,"area":"61,121"}
                }
            },"defense":false,"displayable":{"hp":false,"rock":false,"lumber":false,"time":false,"storageCapacity":true}
        },

        "defense_center":{
            "levels":{
                "0":{"dependency":{"buildings":{"townhall":1}},"limited_by":null,
                    "limiting":{"global":3,"others":{}},"hp":700,"time":0,
                    "display":{"xdim":35,"ydim":35,"zdim":93,"imgWidth":124,"imgHeight":155,"area":"111,117"}
                },
                "1":{"dependency":{"buildings":{"townhall":"1"}},"limited_by":"townhall",
                    "limiting":{"global":1,"others":{"wedge":"5","gaddafi":"5"}},"hp":600,"rock":4000,"lumber":1000,"time":10,
                    "display":{"xdim":35,"ydim":35,"zdim":93,"imgWidth":124,"imgHeight":155,"area":"111,117"}
                },
                "2":{"dependency":{"buildings":{"townhall":"2"}},"limited_by":"townhall",
                    "limiting":{"global":1,"others":{"wedge":"5","gaddafi":"5"}},"hp":700,"rock":35000,"lumber":8000,"time":14400,
                    "display":{"xdim":35,"ydim":35,"zdim":93,"imgWidth":124,"imgHeight":155,"area":"111,117"}
                }
            },"defense":false
        },

        "war_factory":{
            "levels":{
                "0":{"dependency":{"buildings":{"townhall":1}},"limited_by":null,"limiting":{"global":3,"others":{}},"hp":800,"time":0,
                    "display":{"xdim":35,"ydim":35,"zdim":93,"imgWidth":124,"imgHeight":155,"area":"101,128"},"max_queue_size":0
                },
                "1":{"dependency":{"buildings":{"townhall":"1"}},"limited_by":null,
                    "limiting":{"global":1,"others":{}},"hp":600,"rock":1500,"lumber":6000,"time":1800,
                    "display":{"xdim":35,"ydim":35,"zdim":93,"imgWidth":124,"imgHeight":155,"area":"101,128"},
                    "queue":{"size":0,"creep":null,"last_creep_start":null,"creep_production_time":null},
                    "queue_size":3,"max_queue_size":10
                },
                "2":{"dependency":{"buildings":{"townhall":1}},"limited_by":null,
                    "limiting":{"global":3,"others":{}},"hp":700,"rock":12000,"lumber":50000,"time":14400,
                    "display":{"xdim":35,"ydim":35,"zdim":93,"imgWidth":124,"imgHeight":155,"area":"101,128"},
                    "queue_size":3,"queue":{"size":0,"creep":null,"last_creep_start":null,"creep_production_time":null},
                    "max_queue_size":20
                }
            },
            "defense":false,"displayable":{"hp":false,"rock":false,"lumber":false,"time":false}
        },


        "house":{
            "levels":{
                "0":{"workers":2,"dependency":{"buildings":{"townhall":1}},"limited_by":null,
                    "limiting":{"global":3,"others":{}},"hp":800,"time":0,
                    "display":{"xdim":35,"ydim":35,"zdim":93,"imgWidth":124,"imgHeight":155,"area":"109,117"}
                },
                "1":{"workers":2,"dependency":{"buildings":{"townhall":"1"}},"limited_by":"townhall",
                    "limiting":{"global":1,"others":{}},"hp":300,"rock":8000,"lumber":2000,"time":300,
                    "display":{"xdim":35,"ydim":35,"zdim":93,"imgWidth":124,"imgHeight":155,"area":"109,117"}
                }
            },"defense":false,"displayable":{"workers":true,"hp":false,"rock":false,"lumber":false,"time":false}
        },

        "wedge":{
            "levels":{
                "0":{"dependency":{"buildings":{"townhall":1,"defense_center":1}},"limited_by":null,
                    "limiting":{"global":3,"others":{}},"hp":1000,"weapon":"slingshot","time":10,
                    "specs":{"power":30,"range":200,"speed":100,"armor":100},
                    "display":{"xdim":17,"ydim":17,"zdim":93,"imgWidth":64,"imgHeight":93,"movingArea":"16,78","area":"20,74"}
                },
                "1":{"dependency":{"buildings":{"townhall":"1","defense_center":"1"}},"limited_by":null,
                    "limiting":{"global":1,"others":{}},"hp":300,"weapon":"slingshot","time":300,
                    "specs":{"power":20,"range":100,"speed":100,"armor":100},"rock":250,"lumber":1000,
                    "display":{"xdim":17,"ydim":17,"zdim":93,"imgWidth":64,"imgHeight":93,"movingArea":"16,78","area":"20,74"}
                }
            },"defense":true
        },

        "gaddafi":{
            "levels":{
                "0":{"dependency":{"buildings":{"townhall":1,"defense_center":1}},"limited_by":null,
                    "limiting":{"global":3,"others":{}},"hp":1000,"weapon":"slingshot","time":10,
                    "specs":{"power":30,"range":200,"speed":100,"armor":100},
                    "display":{"xdim":17,"ydim":17,"zdim":93,"imgWidth":64,"imgHeight":93,"movingArea":"16,78","area":"20,74"}
                },
                "1":{"dependency":{"buildings":{"townhall":"1","defense_center":"1"}},"limited_by":null,
                    "limiting":{"global":1,"others":{}},"hp":500,"weapon":"slingshot","time":10,
                    "specs":{"power":30,"range":150,"speed":100,"armor":100},"rock":250,"lumber":1000,
                    "display":{"xdim":17,"ydim":17,"zdim":93,"imgWidth":64,"imgHeight":93,"movingArea":"16,78","area":"20,74"}
                }
            },"defense":true
        },


        "palm":{
            "levels":{
                "0":{"dependency":{"buildings":{"townhall":1}},"limited_by":null,
                    "limiting":{"global":3,"others":{}},"hp":1000,"time":2,
                    "display":{"xdim":17,"ydim":17,"zdim":62,"imgWidth":64,"imgHeight":93,"area":"51,86"}
                },
                "1":{"dependency":{"buildings":{"townhall":1}},"limited_by":null,"limiting":{"global":3,"others":{}},
                    "hp":1000,"time":2,"rock":100,"lumber":100,
                    "display":{"xdim":17,"ydim":17,"zdim":62,"imgWidth":64,"imgHeight":93,"area":"51,86"}
                }
            },"defense":true
        },

        "defense_research":{
            "levels":{
                "0":{"workers":2,"dependency":{"buildings":{"townhall":1}},"limited_by":null,
                    "limiting":{"global":3,"others":{}},"hp":800,"time":0,
                    "display":{"xdim":35,"ydim":35,"zdim":93,"imgWidth":124,"imgHeight":155,"area":"109,117"}
                },
                "1":{"workers":2,"dependency":{"buildings":{"townhall":1}},"limited_by":null,
                    "limiting":{"global":3,"others":{}},"hp":800,"rock":2000,"lumber":2000,"time":15,
                    "display":{"xdim":35,"ydim":35,"zdim":93,"imgWidth":124,"imgHeight":155,"area":"109,117"}
                }
            },"defense":false
        },



        "military_research":{
            "levels":{
                "0":{"workers":2,"dependency":{"buildings":{"townhall":1}},"limited_by":null,
                    "limiting":{"global":3,"others":{}},"hp":800,"time":0,
                    "display":{"xdim":35,"ydim":35,"zdim":93,"imgWidth":124,"imgHeight":155,"area":"109,117"}
                },
                "1":{"workers":2,"dependency":{"buildings":{"townhall":1}},"limited_by":null,
                    "limiting":{"global":3,"others":{}},"hp":800,"rock":2000,"lumber":2000,"time":15,
                    "display":{"xdim":35,"ydim":35,"zdim":93,"imgWidth":124,"imgHeight":155,"area":"109,117"}
                }
            },"defense":false
        },

        "garage":{
            "levels":{
                "0":{"workers":2,"dependency":{"buildings":{"townhall":1}},"limited_by":null,
                    "limiting":{"global":3,"others":{}},"hp":800,"time":0,"storage_units":0,
                    "display":{"xdim":35,"ydim":35,"zdim":93,"imgWidth":124,"imgHeight":155,"area":"109,117"}
                },
                "1":{"workers":2,"storage_units":10,"dependency":{"buildings":{"townhall":1}},"limited_by":null,
                    "limiting":{"global":3,"others":{}},"hp":800,"rock":2000,"lumber":2000,"time":15,
                    "display" : {"xdim":35,"ydim":35,"zdim":0,"imgWidth":124,"imgHeight":62,"area":"109,117"}
                },
                "2":{"workers":2,"storage_units":20,"dependency":{"buildings":{"townhall":1}},"limited_by":null,
                    "limiting":{"global":3,"others":{}},"hp":800,"rock":2000,"lumber":2000,"time":15,
                    "display" : {"xdim":35,"ydim":35,"zdim":0,"imgWidth":124,"imgHeight":62,"area":"109,117"}
                }
            },"defense":false
        }
    }, 

   "researches" : {
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
    },
    "laser" : {
      "dependency" : {  },
      "benefits" : {
        //10 means : 10%
        "buildings" : { "hp": 10 } 
      },
      "needs" : {
        time : 3600,
        rock : 100,
        lumber : 100
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
          "speed" : 10,
          "garage_units":2,
         "needs" : {
          time : 5,
          rock : 100,
          lumber : 100
        }
      },
      "axe" : {
          "hp" : 100,
          "power" : 10,
          "speed" : 10,
          "garage_units":2,
         "needs" : {
          time : 5,
          rock : 100,
          lumber : 100
        }
      },
      "sonic" : {
          "hp" : 100,
          "power" : 10,
          "speed" : 10,
          "garage_units":2,
         "needs" : {
          time : 5,
          rock : 100,
          lumber : 100
        }
      }
  },
  "battle" : {
    "bigginer_protection" : 2000,
    "level_difference" : 3,
    "steal_percentage" : 0.2,
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

  "ranks" : {"1":{"name":"1","lower_exp":"0","upper_exp":"10"}},

  "quests":{ 
        "id_generator":6,
        "list":{
            "0":{"name":"townhall","parent":null,
                "conditions":{"buildings":{"townhall":{"level":1}},"resources":{}},
                "rewards":{"coins":10,"exp":10,"lumber":10},
                "primal":true,"id":"0","mandatory":true,"category":1
            },
            "2":{"name":"workers","parent":"0","conditions":{"buildings":{},"resources":{"workers":3}},
                "rewards":{"coins":10,"exp":10,"lumber":1000},
                "primal":false,"id":"2","mandatory":true,"category":1
            },
            "3":{"name":"lumbermill","parent":"2",
                "conditions":{"buildings":{"lumbermill":{"level":1,"assigned_workers":1}},"resources":{}},
                "rewards":{"coins":10,"lumber":10},"primal":false,"id":"3","mandatory":true,"category":1
            },
            "5":{"name":"quarry","parent":"3",
                "conditions":{"buildings":{"quarry":{"level":1,"assigned_workers":1}},"resources":{}},
                "rewards":{"lumber":100,"rock":100},"primal":false,"id":"5","mandatory":false,"category":1
            }
        }
    },

    "languages" : { 'english' : {}, 'arabic' : {} }
}

new Ajax.Request( '/nezal-admin/local-base-defender.json' , {
                method : 'put',
                parameters : { "data" : JSON.stringify(data) }
            });
