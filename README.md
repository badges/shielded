shielded
========

try to solve https://github.com/badges/shields/issues/15?source=c, *Shields as a Service*


```
Usage: shielded --label=[string] --value=[string] --file=[filepath] --color=[green/yellowgreen/yellow/red/lightgray/] --scale=[num]

Options:
  --label  [required]
  --value  [required]
  --file   [required]
  --color  [default: "green"]
  --scale  [default: 1]

```

## Example output:
![light gray](https://raw.github.com/badges/shielded/master/examples/lightgray.png)

![scale X 2](https://raw.github.com/badges/shielded/master/examples/scale2.png)

![lots of text](https://raw.github.com/badges/shielded/master/examples/long.png)


## Installation:
```shell
git clone git@github.com:badges/shielded.git  # clone this repo
cd shielded                                   # go into the newly created directory
npm install                                   # install the dependencies
./shielded --label=worked --value=yep --file=file.png --color=green --scale=1  # create a png named file.png
```

## Notes:
* This also works as a node.js library for use in node.js apps.  See https://github.com/badges/shield-server for an example of a web application that uses this.
* @jbowes is a bad man and rewrote this service in golang:  https://github.com/jbowes/buckler .  It probably vastly outperforms this library.
