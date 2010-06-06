class Sequel::Dataset
    def to_json
        naked.all.to_json
    end
end

class Sequel::Model
    def to_json
        this.to_json
    end
end

class Time
    def to_json
        to_s.to_json
    end
end