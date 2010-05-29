FB_CONFIGS = YAML.load_file("config/facebook_apps.yml")

def FB_CONFIGS::find(field, app_name)
  FB_CONFIGS.each_pair do |key, value| 
    return value if (value[field] && value[field].index(app_name) == 0)
  end
end

