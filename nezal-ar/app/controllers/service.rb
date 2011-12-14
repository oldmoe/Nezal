class Service

  FACEBOOK = 1
  KONGREGATE = 2

  PROVIDERS = { 'fb' => { :prefix => FACEBOOK, :helper => FBHelper },
                'k' => { :prefix => KONGREGATE }
              }
  
end
