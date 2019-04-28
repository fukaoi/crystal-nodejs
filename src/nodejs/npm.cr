module Nodejs
  module Npm
    extend self
    @@npm = "#{ENV["PWD"]}/ext/npm"

    def init : Bool
      system("#{@@npm} init --yes")
    end

    def is_installed?(package_name : String) : Bool
      system("#{@@npm} list #{package_name} | grep #{package_name}")
    end

    def install(package_name : String) : Bool
      system("#{@@npm} install #{package_name}")
    end

    def security_check
    end
  end
end
