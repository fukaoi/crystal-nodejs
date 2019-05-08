module Nodejs
  module Npm
    extend self
    @@npm = "#{Nodejs.home_dir}/ext/npm"

    def init : Bool
      system("cd #{Nodejs.home_dir}/js && #{@@npm} init --yes")
    end

    def is_installed?(package_name : String) : Bool
      system("cd #{Nodejs.home_dir}/js && #{@@npm} list #{package_name} | grep #{package_name}")
    end

    def install(package_name : String) : Bool
      system("cd #{Nodejs.home_dir}/js && #{@@npm} install #{package_name}")
    end

    def uninstall(package_name : String) : Bool
      system("cd #{Nodejs.home_dir}/js && #{@@npm} uninstall #{package_name}")
    end

    def security_check
    end
  end
end
