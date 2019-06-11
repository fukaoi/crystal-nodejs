file_path = ARGV[0]
replace_ment = ARGV[1]

File.open(file_path) do |file|
  _ = file.read_line
  all = "#! #{replace_ment}\n#{file.gets_to_end}"
  File.write(file_path, all)
end
