CRYSTAL_NODEJS_DIR := $(abspath $(dir $(lastword $(MAKEFILE_LIST))))

EXT_DIR      = ${CRYSTAL_NODEJS_DIR}/ext
NODE_BIN_DIR = ${EXT_DIR}/${NODE_VERSION}/bin
NODE_LIB_DIR = ${EXT_DIR}/${NODE_VERSION}/lib
HIDDEN_DIR   = $(HOME)/.crystal-nodejs
NODE_VERSION = v10.16.0
OS           = $(shell uname)


.PHONY: all
all:
	make nodejs
	make build

.PHONY: build
build:

# build libnode
	@echo OS:${OS}

# folders
	@if [ ! -d ${HIDDEN_DIR}/ ]; then \
		mkdir -p ${HIDDEN_DIR}/js; \
	fi

	@if [ ${OS} = "Linux" ]; then \
		g++ \
		-std=c++11 -g -Wl,-rpath=${NODE_LIB_DIR} \
		-I/tmp/${NODE_VERSION}/include/node/ \
		${EXT_DIR}/libnode.cc ${SOURCE} -o \
		${NODE_BIN_DIR}/node \
		${NODE_LIB_DIR}/libnode.so.64; \
  elif [ ${OS} = "Darwin" ]: then \
		g++ \
		-std=c++11 -g -Wl,-rpath ${NODE_LIB_DIR} \
		-I/tmp/${NODE_VERSION}/include/node/ \
		${EXT_DIR}/libnode.cc ${SOURCE} -o \
		${NODE_BIN_DIR}/node \
		${NODE_LIB_DIR}/libnode.so.64.dylib; \
	else 
		echo "Sorry,,,No support OS."; \
		exit 0; \
	fi

# rewrite npm path 
	@sed -i "1d" ${NODE_LIB_DIR}/node_modules/npm/bin/npm-cli.js
	@sed -i -e "1i #!${HIDDEN_DIR}/bin/node" ${NODE_LIB_DIR}/node_modules/npm/bin/npm-cli.js

# symbolic bin/ lib/	
	@if [ ! -d ${HIDDEN_DIR}/bin ]; then \
	  cp -r ${NODE_BIN_DIR} ${HIDDEN_DIR}/; \
  fi	

	@if [ ! -d ${HIDDEN_DIR}/lib ]; then \
	  cp -r ${NODE_LIB_DIR} ${HIDDEN_DIR}/; \
	  cp -r ${NODE_LIB_DIR}/node_modules/npm/* ${HIDDEN_DIR}/lib/; \
  fi	

# Setting node path for npm
	@${HIDDEN_DIR}/bin/npm config set scripts-prepend-node-path true


# npm install for package.json
	@if [ -e ${HIDDEN_DIR}/js/package.json ]; then \
		cd ${HIDDEN_DIR}/js && ${HIDDEN_DIR}/bin/npm i; \
	fi	

.PHONY: nodejs
nodejs:

	@if [ ! -d /tmp/node/ ]; then \
		cd /tmp && git clone https://github.com/nodejs/node.git; \
	fi

	@cd /tmp/node && git checkout ${NODE_VERSION}

	@if [ ! -d /tmp/${NODE_VERSION} ]; then \
		mkdir /tmp/${NODE_VERSION}; \
	fi

	cd /tmp/node && ./configure --shared --prefix=/tmp/${NODE_VERSION}

	cd /tmp/node && make -j4  && make install

	rm -rf ${EXT_DIR}/${NODE_VERSION} 
	mkdir ${EXT_DIR}/${NODE_VERSION}

	@cp -r /tmp/${NODE_VERSION}/bin ${NODE_BIN_DIR}
	@cp -r /tmp/${NODE_VERSION}/lib ${NODE_LIB_DIR}	

clean:
	rm -rf ${HIDDEN_DIR}/  
