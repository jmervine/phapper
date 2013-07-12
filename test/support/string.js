#!/usr/bin/env bash

function STDERR () {
  cat - 1>&2
}

echo "stdout: foobar"
echo "stderr: foobar" | STDERR
# vim: ft=sh:
