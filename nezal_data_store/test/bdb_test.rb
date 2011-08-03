require 'minitest/unit'
require './data_store'

class BdbTest < MiniTest::Unit::TestCase

  def setup
    @driver ||= Driver::Bdb::DB.new(store)
    super
  end

end
