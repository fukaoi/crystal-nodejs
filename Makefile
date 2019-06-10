CRYSTAL_NODEJS_DIR := $(abspath $(dir $(lastword $(MAKEFILE_LIST))))

EXT_DIR          = ${CRYSTAL_NODEJS_DIR}/ext
NODE_BIN_DIR     = ${EXT_DIR}/${NODE_VERSION}/bin
NODE_LIB_DIR     = ${EXT_DIR}/${NODE_VERSION}/lib
NODE_INCLUDE_DIR = ${EXT_DIR}/${NODE_VERSION}/include
NODE_OBJECT_DIR  = ${EXT_DIR}/${NODE_VERSION}/obj
HIDDEN_DIR       = $(HOME)/.crystal-nodejs
NODE_VERSION     = v10.16.0
OS               = $(shell uname)
LINUX_SO         = libnode.so.64
MAC_OSX_SO       = libnode.64.dylib


.PHONY: all
all:

	@if [ ! -d ${NODE_BIN_DIR}/ ] || [ ! -d ${NODE_LIB_DIR}/ ] || [ ! -d ${NODE_INCLUDE_DIR}/ ]; then \
		make nodejs; \
	fi

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
		-std=c++11 -g -Wl,-rpath=${NODE_OBJECT_DIR} \
		-I${NODE_INCLUDE_DIR}/node/ \
		${EXT_DIR}/libnode.cc ${SOURCE} -o \
		${NODE_BIN_DIR}/node \
		${NODE_OBJECT_DIR}/${LINUX_SO}; \
  elif [ ${OS} = "Darwin" ]; then \
		g++ \
		-std=c++11 -g -Wl,-rpath ${NODE_OBJECT_DIR} \
		-I${NODE_INCLUDE_DIR}/node/ \
		${EXT_DIR}/libnode.cc ${SOURCE} -o \
		${NODE_BIN_DIR}/node \
		${NODE_OBJECT_DIR}/${MAC_OSX_SO}; \
  else \
		echo "Sorry,,,No support OS."; \
		exit 0; \
	fi

	@if [ ! -d ${HIDDEN_DIR}/bin ]; then \
	  cp -r ${NODE_BIN_DIR} ${HIDDEN_DIR}/; \
  fi	

	@if [ ! -d ${HIDDEN_DIR}/lib ]; then \
	  cp -r ${NODE_LIB_DIR} ${HIDDEN_DIR}/; \
	  cp -r ${NODE_LIB_DIR}/node_modules/npm/* ${HIDDEN_DIR}/lib/; \
  fi	

# rewrite npm path 
	@sed -i "1d" ${HIDDEN_DIR}/lib/node_modules/npm/bin/npm-cli.js
	@sed -i -e "1i #!${HIDDEN_DIR}/bin/node" ${HIDDEN_DIR}/lib/node_modules/npm/bin/npm-cli.js


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

	cd /tmp/node && make -j5  && make install

	rm -rf ${EXT_DIR}/${NODE_VERSION} 
	mkdir ${EXT_DIR}/${NODE_VERSION}

	@cp -r /tmp/${NODE_VERSION}/bin ${NODE_BIN_DIR}
	@cp -r /tmp/${NODE_VERSION}/lib ${NODE_LIB_DIR}	
	@cp -r /tmp/${NODE_VERSION}/include ${NODE_INCLUDE_DIR}	

clean:
	rm -rf ${HIDDEN_DIR}/  
