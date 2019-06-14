require "spec"
require "../src/nodejs"
require "file_utils"

src_dir = "spec/js"
dist_dir = "#{ENV["HOME"]}/.crystal-nodejs/js"

FileUtils.cp("#{src_dir}/package.json", "#{dist_dir}/package.json")
FileUtils.cp("#{src_dir}/package-lock.json", "#{dist_dir}/package-lock.json")

Nodejs::Npm.install
