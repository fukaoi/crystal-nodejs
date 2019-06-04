CRYSTAL_NODEJS_DIR := $(abspath $(dir $(lastword $(MAKEFILE_LIST))))

EXT_DIR      = ${CRYSTAL_NODEJS_DIR}/ext/
HIDDEN_DIR   = $(HOME)/.crystal-nodejs
OBJS		     = ${EXT_DIR}node_main.o ${EXT_DIR}libnode.so.64
SOURCE	     = ${EXT_DIR}libnode.c
OUT			     = ${EXT_DIR}node
CC	 		     = g++
FLAGS	 	  	 = -g -Wl,-rpath=${EXT_DIR}
NODE_VERSION = v10.16.0
OS        	 = $(shell uname)

all: $(OBJS)

# build libnode
	@echo OS:${OS}

# folders
	@if [ ! -d ${HIDDEN_DIR}/ ]; then \
		mkdir -p ${HIDDEN_DIR}/js; \
	fi

	@if [ ${OS} = "Linux" ]; then \
		$(CC) ${FLAGS} ${SOURCE} -o $(OUT) ${OBJS}; \
	else \
		echo No support os:${OS}; \
	fi

# rewrite npm path 
	@sed -e "1i #!$(HOME)/.crystal-nodejs/ext/node" ext/npm > ext/npm-clone

# ext foloder copy	
	@cp -R ${EXT_DIR} ${HIDDEN_DIR}/

# replace user customize path npm	
	@cp ${EXT_DIR}/npm-clone ${EXT_DIR}/npm

# alias libnode to node
	@if [ ! -e ${EXT_DIR}/node ]; then \
		ln -s  ${EXT_DIR}/libnode ${EXT_DIR}/node; \
	fi

# Setting node path for npm
	@${EXT_DIR}/npm config set scripts-prepend-node-path true


# npm install for package.json
	@if [ -e ${HIDDEN_DIR}/js/package.json -o -e ${HIDDEN_DIR}/js/package-lock.json ]; then \
		cd ${HIDDEN_DIR}/js && ${HIDDEN_DIR}/ext/npm i; \
	fi	

build:

	@if [ ! -d /tmp/node/ ]; then \
		cd /tmp && git clone git@github.com:nodejs/node.git; \
	fi

	@cd /tmp/node && git checkout ${NODE_VERSION}

	@if [ ! -d /tmp/${NODE_VERSION} ]; then \
		mkdir /tmp/${NODE_VERSION}; \
	fi

	cd /tmp/node && ./configure --shared --prefix=/tmp/${NODE_VERSION}

	cd /tmp/node && make -j  && make install

	@if [ ! -d ${EXT_DIR}/${NODE_VERSION} ]; then \
		mkdir ${EXT_DIR}/${NODE_VERSION}; \
	fi

	@cp -r  /tmp/${NODE_VERSION}/bin ${EXT_DIR}/${NODE_VERSION}/
	@cp -r /tmp/${NODE_VERSION}/lib  ${EXT_DIR}/${NODE_VERSION}/	

clean:
	rm -rf ${HIDDEN_DIR}/  
	rm -rf /tmp/node
	rm -rf /tmp/${NODE_VERSION}
