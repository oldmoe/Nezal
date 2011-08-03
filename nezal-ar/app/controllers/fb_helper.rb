require 'net/https'
require 'uri'

class FBHelper

  PATH = 'https://graph.facebook.com/'

  class << self

    def authenticate request_parts, app_configs
      signature = base64_url_decode(request_parts[0])
      expected_signature = OpenSSL::HMAC.digest('sha256', app_configs['secret'], request_parts[1])
      signature == expected_signature
    end

    def decode request, app_configs
      # Signature part before '.'
      # Data part after '.'
      request_parts = signed_request.split(".")
      data = base64_url_decode(request_parts[1])
      authenticate request_parts, app_configs ? Metadata.decode(data) : nil
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
      puts response 
    end
    
  end

end
