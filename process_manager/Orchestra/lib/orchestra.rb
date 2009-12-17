module Orchestra

  module SignalTrapper
    
    BASIC_SIGNALS = {:TERM => nil, :QUIT => nil, :INT => nil} 

=begin
    BASIC_SIGNALS.keys { |signal|
      trap (signal) { 
        cleanup
      }
    }      
=end

    # This method should recieve an array of signals
    # and the procedure to call when trapped
    def set_traps(signals, &call)    
      @trapped_signals= BASIC_SIGNALS if @trapped_signals.nil?
      signals.each { |signal|
        @trapped_signals[signal] = call
        trap(signal) { 
          @trapped_signals[signal].call signal 
        }
      }
    end
   
    def self.queue(signals)
      
    end
   
  end

end

