CRYSTAL_NODEJS_DIR := $(abspath $(dir $(lastword $(MAKEFILE_LIST))))
EXT_DIR            = ${CRYSTAL_NODEJS_DIR}/ext
NODE_BIN_DIR       = ${EXT_DIR}/${NODE_VERSION}/bin
NODE_LIB_DIR       = ${EXT_DIR}/${NODE_VERSION}/lib
NODE_INCLUDE_DIR   = ${EXT_DIR}/${NODE_VERSION}/include
OBJECT_DIR         = ${EXT_DIR}/obj/${NODE_VERSION}
HIDDEN_DIR         = $(HOME)/.crystal-nodejs
NODE_VERSION       = v10.16.0
OS                 := $(shell uname)
SHARED_OBJECT      := $(shell if [ ${OS} = "Linux" ]; then echo libnode.so.64; elif [ ${OS} = "Darwin" ]; then echo libnode.64.dylib; fi)
BUILD_OPTION       := $(shell if [ ${OS} = "Linux" ]; then echo -rpath=${HIDDEN_DIR}/lib; elif [ ${OS} = "Darwin" ]; then echo -rpath ${HIDDEN_DIR}/lib; fi)


.PHONY: all
all: 

	@if [ ! ${OS} = "Linux" ] && [ ! ${OS} = "Darwin" ]; then \
		@echo "Not supported os"; \
		exit 0; \
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

	@if [ ! -d ${HIDDEN_DIR}/bin ]; then \
	  cp -r ${NODE_BIN_DIR} ${HIDDEN_DIR}/; \
  fi	

	@if [ ! -d ${HIDDEN_DIR}/lib ]; then \
	  cp -r ${NODE_LIB_DIR} ${HIDDEN_DIR}/; \
		cp ${OBJECT_DIR}/${SHARED_OBJECT} ${HIDDEN_DIR}/lib/; \
  fi	
  
# build node binary
	@g++ \
		-std=c++11 -g -Wl,${BUILD_OPTION} \
		-I${NODE_INCLUDE_DIR}/node/ \
		${EXT_DIR}/libnode.cc ${SOURCE} -o \
		${HIDDEN_DIR}/bin/node \
		${OBJECT_DIR}/${SHARED_OBJECT}; \

# rewrite npm path 
# @sed -i "1d" ${HIDDEN_DIR}/lib/node_modules/npm/bin/npm-cli.js
# @sed -i -e "1i #!${HIDDEN_DIR}/bin/node" ${HIDDEN_DIR}/lib/node_modules/npm/bin/npm-cli.js
	@crystal run ext/node_path.cr -- ${HIDDEN_DIR}/lib/node_modules/npm/bin/npm-cli.js ${HIDDEN_DIR}/bin/node
 

# Setting node path for npm
	@${HIDDEN_DIR}/bin/npm config set scripts-prepend-node-path true


# npm install for package.json
	@if [ -e ${HIDDEN_DIR}/js/package.json ]; then \
		cd ${HIDDEN_DIR}/js && ${HIDDEN_DIR}/bin/npm i; \
	fi	

.PHONY: nodejs
nodejs:

# git checkout node source
	@if [ ! -d /tmp/node/ ]; then \
		cd /tmp && git clone https://github.com/nodejs/node.git; \
	fi

	@cd /tmp/node && git checkout ${NODE_VERSION}

	@if [ ! -d /tmp/${NODE_VERSION} ]; then \
		mkdir /tmp/${NODE_VERSION}; \
	fi

# create dir for share object
	@if [ ! -d ${OBJECT_DIR} ]; then \
		mkdir -p ${OBJECT_DIR}; \
	fi

# node build
	@cd /tmp/node && ./configure --shared --prefix=/tmp/${NODE_VERSION}
	@cd /tmp/node && make -j5  && make install

# create dir for ext/vxxxxxxxx/
	@if [ ! -d ${NODE_VERSION} ]; then \
		mkdir -p ${NODE_BIN_DIR}; \
		mkdir -p ${NODE_LIB_DIR}; \
		mkdir -p ${NODE_INCLUDE_DIR}; \
	fi

# copy need files for libnode
	@cp -r /tmp/${NODE_VERSION}/bin/* ${NODE_BIN_DIR}
	@cp -r /tmp/${NODE_VERSION}/lib/* ${NODE_LIB_DIR}	
	@cp -r /tmp/${NODE_VERSION}/include/* ${NODE_INCLUDE_DIR}

	mv ${NODE_LIB_DIR}/${SHARED_OBJECT} ${OBJECT_DIR}; \

clean:
	rm -rf ${HIDDEN_DIR}/  
