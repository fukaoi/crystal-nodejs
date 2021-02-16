module Nodejs::Npm
  extend self
  NPM_PATH = "#{Internal.home_dir}/bin/npm"

  def init(path : String = package_path): Bool
    system("cd #{path} && #{NPM_PATH} init --yes")
  end

  def is_installed?(package_name : String, path : String = package_path) : Bool
    system("cd #{path} && #{NPM_PATH} ls #{package_name} | grep #{package_name}")
  end

  def install(package_name : String = "", path : String = package_path) : Bool
    if package_name.empty?
      system("cd #{path} && #{NPM_PATH} i")
    else
      system("cd #{path} && #{NPM_PATH} i #{package_name}")
    end
  end

  def uninstall(package_name : String, path : String = package_path) : Bool
    system("cd #{path} && #{NPM_PATH} un #{package_name}")
  end

  def at(path : String) : Nodejs::Npm
    @@package_path = path
    self
  end

  def package_path : String
    @@package_path ||= Dir.current
  end
end
