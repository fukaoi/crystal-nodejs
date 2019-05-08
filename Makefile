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
	if [ ! -d ${HOME_DIR}/ ]; then \
		mkdir ${HOME_DIR}/; \
	fi
	cp ext/npm ext/npm_copy
	sed -i "1i #!${HOME_DIR}/ext/libnode" ext/npm_copy 
	cp -r ${BUILD_DIR} ${HOME_DIR}/
	mv ${HOME_DIR}/ext/npm_copy ${HOME_DIR}/ext/npm

clean:
	rm -rf ${HOME_DIR}/ext  
