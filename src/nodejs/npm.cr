module Nodejs
  module Npm
    extend self
    @@npm = "#{ENV["PWD"]}/ext/npm" 

    def init : Bool
      system("#{@@npm} init --yes")
    end

    def is_installed?(package_name : String) : Bool
      status = false
      status |= File.directory?("#{ENV["PWD"]}/node_modules/#{package_name}")
      if ENV.has_key?("NODE_PATH")
        status |= File.directory?("#{ENV["NODE_PATH"]}/node_modules/#{package_name}")
      end
      status
    end
    
    def install(package_name : String) : Bool 
      system("#{@@npm} install #{package_name}")
      
    end

    def security_check
    end
  end
end
