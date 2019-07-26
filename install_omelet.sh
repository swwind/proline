#!/bin/bash

if [ -f static/client_linux ]; then
  rm -f static/client_linux
fi

git clone https://github.com/timber3252/omelet
cd omelet
cmake .
make
cp client_linux ../static
cd ..
rm -rf omelet

cd static
sudo chown root:root client_linux
sudo chmod 4511 client_linux
