OBJS	= ext/libnode
SOURCE	= ext/libnode.c
OUT	= ext/libnode
CC	 = gcc
FLAGS	 = -g -c -Wall
LFLAGS	 =  -L./ ./ext/node_main.o ./ext/libnode.so.64 -Wl,-rpath=./ext


all: $(OBJS)
	$(CC) -g $(OBJS) -o $(OUT) $(LFLAGS)

libnode.o: libnode.c
	$(CC) $(FLAGS) libnode.c 


clean:
	rm -f $(OBJS) $(OUT)
