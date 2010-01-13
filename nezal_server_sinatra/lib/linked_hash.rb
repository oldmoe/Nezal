class LinkedHash < Hash

  def[]=(key, value)
    if self.include?(key)
      v = self.fetch(key)
      v[:value] = value
    else
      v = {:value => value, :next => nil }
      if self.linked_values.last
        self.linked_values.last[:next] = v
      end
    end
    self.store(key, v)
  end  
  
  def [](key)
    if self.include?(key)
      self.fetch(key)[:value]
    end
  end

  def values
    self.collect{|k,v| v[:value]}
  end
  
  def linked_values
     self.collect{|k,v| v}
  end
  
end
