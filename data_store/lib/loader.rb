require 'active_support/inflector'

module  Loader

  def  Loader::load(class_name)
    dir_path = if ENV["environment"] == "test"
                  "test/models/"
              elsif ENV["environment"] == "production"
                  "app/models/"
              else
                  "models/"
              end
    require dir_path + ActiveSupport::Inflector.singularize(ActiveSupport::Inflector.tableize(class_name)) + ".rb"
  end 

end
