class Payment < ActiveRecord::Base
  belongs_to  :profile, :class_name => "UserGameProfile"
  attr_accessible :profile_id , :price
end

################ SOCIAL GOLD #############################
require 'digest/md5'
require 'rubygems'
require 'base64'
require 'net/http'
require 'net/https'
require 'json/add/rails'
require 'cgi'
require 'logger'

# -----------------------------------------------------------------------------

class PaymentsClient

  # ----------------------------------------------------------------------------
  def initialize(server_name, server_port, offer_id, secret_merchant_key,logger, is_production=true)
    @server_name = server_name
    @server_port = server_port
    @is_production=is_production
    @offer_id = offer_id
    @secret_merchant_key = secret_merchant_key
    @logger = logger
  end

  # --------------------------------------------------------------------------
  #
  # buy_with_socialgold
  #
  # returns a URL to have in your IFRAME SRC= tag 
  # 
  # Reuired Params:
  #
  #  userID - string - the user_id of the player (e.g., "abc123") 
  #  usdAmount - float - amount in USD$ of the purchase (e.g., 1.75 implies $1.75) 
  #  currency_label - string - name of your currency (e.g., "Gold Coins") 
  #  currency_xrate - integer - how much $1 is worth (e.g., 100 implies $1 = 100 Gold Coins) 
  #  currency_amount - the amount of virtual currency in implied decimal (e.g., 10000 
  #    "100" of the currency. max = 99999999999900). Cannot be used with "quantity" 
  #  quantity - float - the amount of virtual currency without implied decimal (e.g. 100.99 
  #    "100.99" of the currency. Up to 2 decimal places, max = 999999999999.00).  Cannot be used with "currency_amount" 
  #
  # Optional Params:
  #  format ( iframe )
  #  app_params - string - a variable that will be passed back to you on the postback 
  #  platform - string - the platform of where this user is unique. If this is for a Facebook user, 
  #    then pass in "facebook", etc. Use these values if appropiate, otherwise send in a string representing the platform 
  #      facebook 
  #      myspace 
  #      orkut 
  #      friendster 
  #      hi5
  #      tagged 
  #      twitter 
  #      bebo 
  # You may also pass in any short (32 chars) alphanumeric string to represent your own platform. 
  # For example "mywebsite", "mygame123" 

  def get_buy_currency_url(user_id, usdAmount, currency_label, currency_xrate, currency_amount, quantity, format="iframe", app_params=nil, platform=nil)

    @logger.debug("getBuyCurrencyURL : user_id=#{user_id} usdAmount=#{usdAmount} format=#{format}")
    base_params = {:user_id => user_id, :action => 'buy_with_socialgold', :format => format, :offer_id => @offer_id}
    required_params = { :amount => usdAmount, :currency_label => currency_label, :currency_xrate => currency_xrate, 
                        :currency_amount => currency_amount, :quantity => quantity }
    optional_params = {:app_params => app_params, :platform => platform }
    port = (@server_port == :defaults) ? "" : ":#{@server_port}"
    url = "https://#{@server_name}#{port}"
    url << _generate_uri(base_params, required_params, optional_params)

    return url

  end

  # ----------------------------------------------------------------------------
  #
  # buy_goods_with_socialgold
  #
  # returns a URL to have in your IFRAME SRC= tag 
  # 
  # Reuired Params:
  #
  #  userID - string - the user_id of the player (e.g., "abc123") 
  #  usdAmount - float - amount in USD$ of the purchase (e.g., 1.75 implies $1.75) 
  #  title - string - description of item being sold
  #
  # Optional Params:
  #  format ( iframe )
  #  app_params - string - a variable that will be passed back to you on the postback 
  #  external_ref_id - string -  a unique string with your representation of the transaction
  #  quantity - int - default=1
  #  platform - string - the platform of where this user is unique. If this is for a Facebook user, 
  #    then pass in "facebook", etc. Use these values if appropiate, otherwise send in a string representing the platform 
  #      facebook 
  #      myspace 
  #      orkut 
  #      friendster 
  #      hi5
  #      tagged 
  #      twitter 
  #      bebo 
  #   You may also pass in any short (32 chars) alphanumeric string to represent your own platform. 
  #   For example "mywebsite", "mygame123" 
  #  platform_sub_id - int - unique enum, representing the above platforms - see website for details
  #  statement_descriptor - 8 character string - to be shown on invice, credit card statement, etc
  #  sku - string - unique string representing item in your system

  def get_buy_goods_url(user_id, usdAmount, title,
            format='iframe', external_ref_id=nil, quantity=nil, app_params=nil,
            platform=nil, platform_sub_id=nil, statement_descriptor=nil, sku=nil)
    @logger.debug("get_buy_goods_url : user_id=#{user_id} usdAmount=#{usdAmount} title=#{title} format=#{format}")
    base_params = {:user_id => user_id, :action => 'buy_goods_with_socialgold', :format => format, :offer_id => @offer_id}
    required_params = { :amount => usdAmount, :title => title }
    optional_params = {:app_params => app_params, :platform => platform , :external_ref_id => external_ref_id, 
                        :quantity => quantity, :platform_sub_id => platform_sub_id, :statement_descriptor => statement_descriptor, :sku => sku }
    port = (@server_port == :defaults) ? "" : ":#{@server_port}"
    url = "https://#{@server_name}#{port}"
    url << _generate_uri(base_params, required_params, optional_params)

    return url

  end



  # ===  PRIVATE  ==============================================================

=begin

Purpose : 

  To generate the the URL for socialgold server (includes signing of of the parameters)
              
Pre-Condition :

  baseParams                  : Parameters that is required for all methods
  requiredParams              : Parameters that is required specfic to the method
  optionalParams              : Parameters that is optional for the specific method

Post-Condition : 

  Return the URL

=end

  private
  def _generate_uri(baseParams, requiredParams, optionalParams) 
   
    signature_params = {:user_id => baseParams[:user_id], :ts => Time.now.to_i, :offer_id => baseParams[:offer_id] }
    format = baseParams[:format]

    signature_params.merge!(requiredParams) if !(requiredParams.nil?)

    signature_params.merge!(optionalParams) if !(optionalParams.nil?)

    signature_params.delete_if {|key, value| value == nil}

    to_sign = signature_params.collect{|tuple| tuple.first}.collect{|k| k.to_s}.sort. # sort the keys
      collect{ |k| k + signature_params[k.to_sym].to_s }.join('') # create canonical string

    calculated_signature = Digest::MD5.hexdigest(to_sign + @secret_merchant_key)
   
    url = ""

    send_uri = "/payments/v1/#{@offer_id}/#{baseParams[:action]}/?sig=#{calculated_signature}&ts=#{signature_params[:ts]}&format=#{format}&user_id=#{baseParams[:user_id]}"
    
    send_uri << _convert_hash_to_uri(requiredParams) if !(requiredParams.nil?)

    send_uri << _convert_hash_to_uri(optionalParams) if !(optionalParams.nil?)
    
    url << send_uri

    return url

  end

  # ----------------------------------------------------------------------------
=begin

Purpose : 

  To convert the values in hash into a URL format "&variable_name=value&value=2&"
              
Pre-Condition :

  target_hash  : hash that contains values needed to convert into URL format

Post-Condition : 

  Return a string with the correct URI format

=end

  private
  def _convert_hash_to_uri(target_hash) #converting them into URL format &variable_name=value&value=2&....
    url = ""
    target_hash.each_pair { |key,value|
      url << "&#{key}=#{CGI.escape(value.to_s)}" if !value.nil?
    }
    return url
  end

  # ----------------------------------------------------------------------------
  private 
  def _get_response(cmd_uri, use_ssl=false)

    if @server_port == :defaults
      port = use_ssl ?  Net::HTTP.https_default_port : Net::HTTP.default_port
      http_client = Net::HTTP.new(@server_name, port)
    else
      http_client = Net::HTTP.new(@server_name, @server_port)
    end
    if use_ssl
      if @is_production
        http_client.use_ssl = true
        http_client.ssl_timeout = 5
        http_client.verify_mode = OpenSSL::SSL::VERIFY_PEER
        # http_client.ca_file = ‘/usr/share/curl/curl-ca-bundle.crt’
        http_client.verify_depth = 2
        # http_client.enable_post_connection_check = true # does not work with older versions of ruby < 1.8.6 p 114 
      else
        http_client.use_ssl = true
        http_client.ssl_timeout = 10
        http_client.verify_mode = OpenSSL::SSL::VERIFY_NONE
        http_client.verify_depth = 2
        # http_client.enable_post_connection_check = false  #NOTE tolerate api.sandbox.jambool.com via *.jambool.com cert
      end
    end

    result = {}
    http_client.start do |http|
      request = Net::HTTP::Get.new(cmd_uri)
      response = http_client.request(request)
      result[:body] = response.body
      result[:code] = response.code
    end
    return result
  end


end
#############################################################