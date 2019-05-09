MAKEFILE_DIR := $(abspath $(dir $(lastword $(MAKEFILE_LIST))))

BUILD_DIR = ${MAKEFILE_DIR}/ext/
OBJS		  = ${BUILD_DIR}node_main.o ${BUILD_DIR}libnode.so.64
SOURCE	  = ${BUILD_DIR}libnode.c
OUT			  = ${BUILD_DIR}libnode
CC	 		  = g++
FLAGS	 	  = -g -Wl,-rpath=${BUILD_DIR}
HOME_DIR  = $(HOME)/.crystal-nodejs

all: $(OBJS)
	@echo ${BUILD_DIR}
	$(CC) ${FLAGS} ${SOURCE} -o $(OUT) ${OBJS}
# need folder	
	if [ ! -d ${HOME_DIR}/ ]; then \
		mkdir -p ${HOME_DIR}/js; \
	fi

# rewrite npm path 
	sed -e "1i #!$(HOME)/.crystal-nodejs/ext/libnode" ext/npm > ext/npm-clone

# ext foloder copy	
	cp -R ${BUILD_DIR} ${HOME_DIR}/

# replace user customize path npm	
	cp ${HOME_DIR}/ext/npm-clone ${HOME_DIR}/ext/npm

clean:
	rm -rf ${HOME_DIR}/ext  
