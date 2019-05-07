module Nodejs
  module Npm
    extend self
    @@npm = "#{Nodejs.home_dir}/ext/npm"

    # Cant create package.json in dot directory(hiden directory) e.g: .crysta-nodejs/
    def init : Bool
      system("cp #{Nodejs.home_dir}/ext/package.json #{Nodejs.home_dir}/")
    end

    def is_installed?(package_name : String) : Bool
      system("cd #{Nodejs.home_dir} && #{@@npm} list #{package_name} | grep #{package_name}")
    end

    def install(package_name : String) : Bool
      system("cd #{Nodejs.home_dir} && #{@@npm} install #{package_name}")
    end

    def uninstall(package_name : String) : Bool
      system("cd #{Nodejs.home_dir} && #{@@npm} uninstall #{package_name}")
    end

    def security_check
    end
  end
end
