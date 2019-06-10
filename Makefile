CRYSTAL_NODEJS_DIR := $(abspath $(dir $(lastword $(MAKEFILE_LIST))))

EXT_DIR          = ${CRYSTAL_NODEJS_DIR}/ext
NODE_BIN_DIR     = ${EXT_DIR}/${NODE_VERSION}/bin
NODE_LIB_DIR     = ${EXT_DIR}/${NODE_VERSION}/lib
NODE_INCLUDE_DIR = ${EXT_DIR}/${NODE_VERSION}/include
OBJECT_DIR       = ${EXT_DIR}/obj/${NODE_VERSION}
HIDDEN_DIR       = $(HOME)/.crystal-nodejs
NODE_VERSION     = v10.16.0
OS               = $(shell uname)
LINUX_SO         = libnode.so.64
MAC_OSX_SO       = libnode.64.dylib


.PHONY: all
all:
	make build

.PHONY: build
build:

# build libnode
	@echo OS:${OS}

# folders
	@if [ ! -d ${HIDDEN_DIR}/ ]; then \
		mkdir -p ${HIDDEN_DIR}/js; \
	fi

	@if [ ! -d ${HIDDEN_DIR}/bin ]; then \
	  cp -r ${NODE_BIN_DIR} ${HIDDEN_DIR}/; \
  fi	

	@if [ ! -d ${HIDDEN_DIR}/lib ]; then \
	  cp -r ${NODE_LIB_DIR} ${HIDDEN_DIR}/; \
		cp ${OBJECT_DIR}/${LINUX_SO} ${HIDDEN_DIR}/lib/; \
  fi	

	@if [ ${OS} = "Linux" ]; then \
		g++ \
		-std=c++11 -g -Wl,-rpath=${HIDDEN_DIR}/lib \
		-I${NODE_INCLUDE_DIR}/node/ \
		${EXT_DIR}/libnode.cc ${SOURCE} -o \
		${HIDDEN_DIR}/bin/node \
		${OBJECT_DIR}/${LINUX_SO}; \
  elif [ ${OS} = "Darwin" ]; then \
		g++ \
		-std=c++11 -g -Wl,-rpath ${HIDDEN_DIR}/lib \
		-I${NODE_INCLUDE_DIR}/node/ \
		${EXT_DIR}/libnode.cc ${SOURCE} -o \
		${HIDDEN_DIR}/bin/node \
		${OBJECT_DIR}/${MAC_OSX_SO}; \
  else \
		echo "Sorry,,,No support OS."; \
		exit 0; \
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

	@if [ ! -d ${OBJECT_DIR} ]; then \
		mkdir -p ${OBJECT_DIR}; \
	fi

	cd /tmp/node && ./configure --shared --prefix=/tmp/${NODE_VERSION}

	cd /tmp/node && make -j5  && make install

	@rm -rf ${EXT_DIR}/${NODE_VERSION} 
	@mkdir ${EXT_DIR}/${NODE_VERSION}

	@cp -r /tmp/${NODE_VERSION}/bin ${NODE_BIN_DIR}
	@cp -r /tmp/${NODE_VERSION}/lib ${NODE_LIB_DIR}	
	@cp -r /tmp/${NODE_VERSION}/include ${NODE_INCLUDE_DIR}	

	@if [ ${OS} = "Linux" ]; then \
		mv /tmp/${NODE_VERSION}/lib/${LINUX_SO} ${OBJECT_DIR}; \
  elif [ ${OS} = "Darwin" ]; then \
		mv /tmp/${NODE_VERSION}/lib/${MAC_OSX_SO} ${OBJECT_DIR}; \
	fi

clean:
	rm -rf ${HIDDEN_DIR}/  
