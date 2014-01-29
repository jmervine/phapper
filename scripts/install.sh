#!/usr/bin/env bash
libdir="$(echo $(cd $(dirname $0)/..; pwd)/lib)"
srcpath="https://bitbucket.org/ariya/phantomjs/downloads"
if test "$npm_config_phantomjs_version"; then
  version="$npm_config_phantomjs_version"
else
  version="$npm_package_config_phantomjs_version"
fi

function yay_finished {
  echo " "
  echo "You can reference it within node like so:"
  echo " "
  echo "  var Phapper = require('phapper');"
  echo "  var phantom = new Phapper(script, args);"
  echo "  console.log(phantom.bin);"
  echo " "
  exit 0
}

function write_phpath_js {
  echo "module.exports.phantomjs = '$1';" > $libdir/phpath.js
  echo "PhantomJS is installed."
  echo "=> version: $(phantomjs --version)"
  echo "=> path: $1"
}

# check for phantomjs && exit
phantomjs=`which phantomjs`
if [ "$phantomjs" != "" ]; then
  if phantomjs --version | grep "$version" > /dev/null; then
    write_phpath_js $phantomjs
    yay_finished
  fi
fi

if test -x "$libdir/phantom/bin/phantomjs"; then
  write_phpath_js "$libdir/phantom/bin/phantomjs"
  yay_finished
fi

# dowload how? || fail
if which wget > /dev/null; then
  dldr="wget"
elif which curl > /dev/null; then
  dldr="curl -O"
else
  echo "I need wget or curl to download PhantomJS."
  exit 1
fi

# check os / arch || fail
if uname -a | grep Darwin 2>&1> /dev/null; then
  decomp="unzip -q -o"
  phdist="macosx"
  phpkg="phantomjs-$version-$phdist.zip"
elif uname -a | grep -i linux 2>&1>/dev/null; then
  decomp="tar -jxf"
  if uname -a | grep x86_64 2>&1> /dev/null; then
    phdist="linux-x86_64"
    phpkg="phantomjs-$version-$phdist.tar.bz2"
  else
    phdist="linux-i686"
    phpkg="phantomjs-$version-$phdist.tar.bz2"
  fi
else
  echo "Couldn't figure out your OS, please install phantomjs"
  echo "and reinstall Phapper."
  exit 1
fi

# check for previous temp dir || create
if ! test "$phapper_temp" && test -d $phapper_temp; then
  phapper_temp="/tmp/phapper.temp"
  mkdir -p $phapper_temp
  if [ $? -ne 0 ]; then
    echo "Couldn't make temp dir!";
    exit 1;
  fi
fi

cd $phapper_temp
# check for previous download || download
if test -f $phpkg; then
  echo "Found previous package, skipping download."
  echo "=> $phapper_temp/$phpkg"
  package="$phapper_temp/$phpkg"
else
  $dldr "$srcpath/$phpkg"
fi

# decompress package
echo "Decompressing $phpkg..."
$decomp $phpkg
if [ $? -ne 0 ]; then
  echo "Error occured decompressing $phpkg."
  exit 1
fi
mv phantomjs-$version-$phdist $libdir/phantom
if [ $? -ne 0 ]; then
  echo "Error moving phantom in to place."
  exit 1
fi

write_phpath_js "$libdir/phantom/bin/phantomjs"
yay_finished

# vim: ft=sh:
