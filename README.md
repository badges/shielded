shielded
========

[![deprecated](http://badges.github.io/stability-badges/dist/deprecated.svg)](http://github.com/badges/stability-badges)

try to solve https://github.com/olivierlacan/shields/issues/15?source=c 


```
Usage: shielded --label=[string] --value=[string] --file=[filepath] --color=[green/yellowgreen/yellow/red/lightgray/] --scale=[num]

Options:
  --label  [required]
  --value  [required]
  --file   [required]
  --color  [default: "green"]
  --scale  [default: 1]

```

##example output:
![light gray](https://raw.github.com/cainus/shielded/master/examples/lightgray.png)

![scale X 2](https://raw.github.com/cainus/shielded/master/examples/scale2.png)

![lots of text](https://raw.github.com/cainus/shielded/master/examples/long.png)


## installation:
```shell
git clone git@github.com:cainus/shielded.git  # clone this repo
cd shielded                                   # go into the newly created directory
npm install                                   # install the dependencies
./shielded --label=worked --value=yep --file=file.png --color=green --scale=1  # create a png named file.png
```

## Notes:
* This also works as a node.js library for use in node.js apps.  See https://github.com/cainus/shield-server for an example of a web application that uses this.
* @jbowes is a bad man and rewrote this service in golang:  https://github.com/jbowes/buckler .  It probably vastly outperforms this library.
