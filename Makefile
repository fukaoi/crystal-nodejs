MAKEFILE_DIR := $(abspath $(dir $(lastword $(MAKEFILE_LIST))))

BUILD_DIR = ${MAKEFILE_DIR}/ext/
HOME_DIR  = $(HOME)/.crystal-nodejs
BINARY_DIR= $(HOME)/.crystal-nodejs/ext
OBJS		  = ${BUILD_DIR}node_main.o ${BUILD_DIR}libnode.so.64
SOURCE	  = ${BUILD_DIR}libnode.c
OUT			  = ${BUILD_DIR}libnode
CC	 		  = g++
FLAGS	 	  = -g -Wl,-rpath=${BUILD_DIR}
OS = $(shell uname)

all: $(OBJS)

# build libnode
	@echo OS:${OS}

	@if [ ${OS} = "Linux" ]; then \
		$(CC) ${FLAGS} ${SOURCE} -o $(OUT) ${OBJS}; \
	else \
		echo No support os:${OS}; \
	fi

# rewrite npm path 
	@sed -e "1i #!$(HOME)/.crystal-nodejs/ext/libnode" ext/npm > ext/npm-clone

# ext foloder copy	
	@cp -R ${BUILD_DIR} ${HOME_DIR}/

# replace user customize path npm	
	@cp ${BINARY_DIR}/npm-clone ${BINARY_DIR}/npm

# alias libnode to node
	@if [ ! -e ${BINARY_DIR}/node ]; then \
		ln -s  ${BINARY_DIR}/libnode ${BINARY_DIR}/node; \
	fi

# Setting node path for npm
	@${BINARY_DIR}/npm config set setscripts-prepend-node-path ${BINARY_DIR}/

clean:
	rm -rf ${BINARY_DIR}/  
