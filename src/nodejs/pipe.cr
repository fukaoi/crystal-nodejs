require "io"
require "json"

module Node
  class Pipe
		enum SendType
			Result
			Error
		end

    def initialize(
			mkfifo_file : String = "cr-node-#{Random.rand(10 ** 10)}",
			mkfifo_path : String = "/tmp",
			@timeout : Int32 = 1 # 0.001sec
		)
			@file = "#{mkfifo_path}/#{mkfifo_file}"
			create_mkfifo
    end

    def return_to_cr(result : String)
			to_pipe(result, SendType::Result)
    end

    def throw_to_cr(exception : String)
      ex = "#{exception}.message"
      to_pipe(ex, SendType::Error)
    end

		def parse
			io = IO::Memory.new
			Process.run("cat #{@file}", shell: true, output: io)
      data = JSON.parse(io.to_s.chomp)
      if data[SendType::Result.to_s]?
			  data[SendType::Result.to_s]
      else
			  data[SendType::Error.to_s]
        #todo : throw exception
      end
		end

    def replace_exitcode(source_code : String)
    end

    private def to_pipe(json_str : String, key : SendType)
      <<-CMD
      const exec = require('child_process').exec;
      const json = JSON.stringify(JSON.stringify({#{key}: #{json_str}}));
      exec(`echo ${json} > #{@file}`, {timeout: #{@timeout}}, 
      (err, out)=>{ 
        console.error('[to_pipe] ERR:', err)
        console.log('[to_pipe] OUT:', out)
        process.exit()
      })
      CMD
    end

    private def create_mkfifo
			unless File.exists?(@file) 
      	unless system("mkfifo #{@file}")
        	raise CrNodeException.new("Failed create mkfifo")
     		end
      end
		end
  end
end
