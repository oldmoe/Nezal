require 'net/https'
require 'base64'
require 'uri'
require 'openssl'

class FBHelper

  PATH = 'https://graph.facebook.com/'

  SESSION_EXPIRE_TIME = 60*60*2 #Facebook session expires in 2 Hours

  class << self

    def authenticate params, cookie_hash, app_configs
      # Check for signed request
      #   If exists then authenticate it
      #   else check for request cookie string
      puts "############### $$$$ #{app_configs['id']}"
      cookie = cookie_hash && cookie_hash['fbsr_' + app_configs['id']] ? cookie_hash['fbsr_' + app_configs['id']] : params['signed_request']
      if cookie
        session = decode cookie, app_configs
        request_expire = params['fb_sig_expires'].to_i
        expires_in = if request_expire < SESSION_EXPIRE_TIME
                        request_expire
                    else
                        SESSION_EXPIRE_TIME
                    end
        # If authenticated, same user in signed_request & params, session not expired return true
        if session && session['user_id'] && 
            session['user_id'].to_s == params[:fb_sig_user] 
#            && session['issued_at'] + expires_in > Time.now.to_i
          return session['user_id'].to_s
        else
          return nil
        end
      elsif params["fb_sig_user"] &&
          params["fb_sig_added"] == "1" &&
          params["fb_sig_expires"].to_i > Time.now.to_i &&
          params["fb_sig_api_key"] == app_configs['secret']
        return params['fb_sig_user']
      end 
      nil
    end

    def authenticate_signed_request request_parts, app_configs
      signature = base64_url_decode(request_parts[0])
      expected_signature = OpenSSL::HMAC.digest('sha256', app_configs['secret'], request_parts[1])
      signature == expected_signature
    end

    def decode request, app_configs
      # Signature part before '.'
      # Data part after '.'
      request_parts = request.split(".")
      data = base64_url_decode(request_parts[1])
      authenticate_signed_request(request_parts, app_configs) ?     Nezal::Decoder.decode(data) : nil
    end

    def base64_url_decode(input)
      encoded_input = input.gsub('-','+').gsub('_','/')
      encoded_input += '=' * (4 - encoded_input.size % 4)
      Base64.decode64(encoded_input)
    end
    

    def access_token app_configs
      path = PATH + 'oauth/access_token?' +
              'client_id=' + app_configs['id'] + 
              '&client_secret=' + app_configs['secret'] +
              '&grant_type=client_credentials'
      uri = URI.parse(path)
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      request = Net::HTTP::Get.new(uri.request_uri)
      response = http.request(request)
      response.body.split('=')[1]
    end

    def add_product app_configs, product_data
      product = {}
      ['name', 'description', 'link', 'price', 'data', 'item_id', 'picture'].each do |item|
        product[item] = product_data[item] || 'http://127.0.0.1/'
      end
      product['access_token'] = access_token app_configs
      puts product['access_token']
      path = PATH + app_configs['id'] + '/products'
      uri = URI.parse(path)
      # Full control
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      request = Net::HTTP::Post.new(uri.request_uri)
      request.set_form_data(product)
      response = http.request(request)
    end

    def add_deal app_configs, deal_data, product_id
      deal = {}
      ['link', 'purchase_url', 'link', 'discount_bps', 'preunlock_bps', 'start_time', 'end_time'].each do |item|
        deal[item] = deal_data[item] || 'http://127.0.0.1/'
      end
      deal['access_token'] = access_token app_configs
      path = PATH + app_configs['id'] + product_id + 'deals'
      uri = URI.parse(path)
      # Full control
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      request = Net::HTTP::Post.new(uri.request_uri)
      request.set_form_data(product)
      response = http.request(request)
    end

  end

end
