module MetadataManager 
  

  def self.included(base)
    base.before_save do
      self["metadata"]= Metadata.encode(self.metadata)
    end
    base.after_save do 
      @decoded_metadata = nil
    end
  end  

  def metadata 
    @decoded_metadata ||= Metadata.decode(self["metadata"])
  end

  def metadata=(metadata)
    self["metadata"]= Metadata.encode(metadata)
    @decoded_metadata = nil
  end

end
