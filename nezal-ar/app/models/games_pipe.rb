require 'net/http'
require 'uri'
require 'digest/sha1'
require 'cgi'

class Gamespipe
  API_URL           = 'http://www.gamespipe.com/api.php'
  TRACKINGPIXEL_URL = 'http://www.gamespipe.com/tp.php'
  API_DOMAIN = 'www.gamespipe.com'
  API_PATH = '/api.php'

  def initialize(developer_id, game_id, api_key, test)
    @developer_id = developer_id
    @game_id = game_id
    @API_key = api_key
    @test_mode = (test ? '1' : '0')
  end
  
  def report_registration(tracking_code, user_id, user_name = '', user_mail = '', user_gender = '', user_birthday = '') 
    time = Time.now.utc.to_s
    request = {
            'Method'       => "ReportRegistration",
            'Trackingcode' => tracking_code,
            'UserID'       => user_id,
            'UserName'     => user_name,
            'UserMail'     => user_mail,
            'UserGender'   => user_gender,
            'UserBirthday' => user_birthday,
            'Test'         => @test_mode,
            'T'             => time,
            'Auth'          => Digest::SHA1.hexdigest(tracking_code + time + @API_key)
          }
    make_request(request);
  end
  
  def make_request(param)
    param['DeveloperID'] = @developer_id
    param['GameID']      = @game_id

    parsed_params = "#{API_PATH}?".concat(param.collect { |k,v| "#{k}=#{CGI::escape(v.to_s)}" }.join('&'))
    return Net::HTTP.get(API_DOMAIN, parsed_params) if not param.nil?
    return Net::HTTP.get(API_DOMAIN, API_PATH)
  end
  
end

