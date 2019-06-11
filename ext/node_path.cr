file_path = ARGV[0]

File.open(file_path) do |file|
  data = file.read_line
  puts "aaaaa"
  # File.write("index.html", data)
end
