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
    @test_mode = 0
  end
  
  def report_registration(tracking_code, user_id, user_name = '', user_mail = '', user_gender = '', user_birthday = '') 
    time = get_formatted_time
    request = {
            'Method'       => "ReportRegistration",
            'Trackingcode' => tracking_code,
            'UserID'       => user_id,
            'UserName'     => user_name,
            'UserMail'     => user_mail,
            'UserGender'   => user_gender,
            'UserBirthday' => user_birthday,
            'Test'         => @test_mode,
            'T'            => time,
            'Auth'         => Digest::SHA1.hexdigest(tracking_code + time + @API_key)
          }
    make_request(request);
  end
  
  def report_payment(transaction_id, user_id, gross, fee, vat_percent = 0, currency = "USD", net = nil)
    time = get_formatted_time
    request = {
            'Method'          => "ReportPayment",
            'TransactionID'   => transaction_id,
            'UserID'          => user_id,
            'Date'            => time,
            'Gross'           => gross,
            'Fee'             => fee,
            'VAT'             => vat_percent,
            'Currency'        => currency,
            'Test'            => @test_mode,
            'T'               => time,
            'Auth'            => Digest::SHA1.hexdigest(transaction_id + time + @API_key)
          }
    puts "request = #{request}"
    make_request(request);
  end
  
  def get_formatted_time
     t = Time.now.to_s.split
     t.pop
     t = t.join(" ")
     return t
  end
  
  def make_request(param)
    param['DeveloperID'] = @developer_id
    param['GameID']      = @game_id

    parsed_params = "#{API_PATH}?".concat(param.collect { |k,v| "#{k}=#{CGI::escape(v.to_s)}" }.join('&'))
    res = Net::HTTP.get(API_DOMAIN, parsed_params)
    return res
  end
  
end

