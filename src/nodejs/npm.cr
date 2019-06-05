module Nodejs
  module Npm
    extend self
    NPM_PATH = "#{Nodejs.home_dir}/bin/npm"

    def init : Bool
      system("cd #{Nodejs.home_dir}/js && #{NPM_PATH} init --yes")
    end

    def is_installed?(package_name : String) : Bool
      system("cd #{Nodejs.home_dir}/js && #{NPM_PATH} list #{package_name} | grep #{package_name}")
    end

    def install(package_name : String) : Bool
      system("cd #{Nodejs.home_dir}/js && #{NPM_PATH} install #{package_name}")
    end

    def uninstall(package_name : String) : Bool
      system("cd #{Nodejs.home_dir}/js && #{NPM_PATH} uninstall #{package_name}")
    end

    def security_check
    end
  end
end
