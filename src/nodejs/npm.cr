module Nodejs
  module Npm
    extend self
    def init(dir : String = "/tmp") 
      system("cd #{dir};#{Node::Npm.path} init --yes")
    end

    def is_installed?(package_name : String) : Bool
      status = false
      status |= File.directory?("#{ENV["PWD"]}/node_modules/#{package_name}")
      if ENV.has_key?("NODE_PATH")
        status |= File.directory?("#{ENV["NODE_PATH"]}/node_modules/#{package_name}")
      end
      status
    end

    def security_check
    end
  end
end
