MAKEFILE_DIR := $(dir $(lastword $(MAKEFILE_LIST)))

BUILD_DIR = ${MAKEFILE_DIR}ext/
OBJS		= ${BUILD_DIR}node_main.o ${BUILD_DIR}libnode.so.64
SOURCE	= ${BUILD_DIR}libnode.c
OUT			= ${BUILD_DIR}libnode
CC	 		= g++
FLAGS	 	= -g -Wl,-rpath=${BUILD_DIR}

IR := $(shell pwd)

all: $(OBJS)
	$(CC) ${FLAGS} ${SOURCE} -o $(OUT) ${OBJS}

clean:
	rm -f $(OBJS) $(OUT)
