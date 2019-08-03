#!/bin/bash

set -e

if [ -f bin/client_linux ]; then
  rm -f bin/client_linux
fi

git clone https://github.com/timber3252/omelet
cd omelet
cmake .
make
cp client_linux ../bin
cd ..
rm -rf omelet
