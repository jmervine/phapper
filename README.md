# Phapper

[![Build Status](https://travis-ci.org/jmervine/phapper.png?branch=master)](https://travis-ci.org/jmervine/phapper) &nbsp; [![Dependancy Status](https://david-dm.org/jmervine/phapper.png)](https://david-dm.org/jmervine/phapper) &nbsp; [![NPM Version](https://badge.fury.io/js/phapper.png)](https://badge.fury.io/js/phapper)


Simple PhantomJS Script wrapper for Node.js, which parsed JSON output from the
passed PhantomJS script (if possible).

### Links

* [package](https://npmjs.org/package/phapper)
* [source](http://github.com/jmervine/phapper)
* [tests](https://travis-ci.org/jmervine/phapper)

### Node.js Version

Tested on the following node versions (via [Travis-ci.org](http://travis-ci.org)):

- 0.8
- 0.10


## Install

    $ npm install phapper
    
> Note: On CentOS 6, I had to install the following packages:
> - `sudo yum install freetype fontconfig`

#### Additional Installation Notes

You can specify different versions of [PhantomJS](http://mervine.net/phantomjs) using `npm config`:

    $ npm config set phantomjs_version

> You will have to reinstall `phapper` if you change this option after initially installing it.

I've added limited Windows support, in that you'll have to install [PhantomJS](http://mervine.net/phantomjs) yourself and then specify the path in your code:

    :::js
    var Phapper = require('phapper');
    Phapper.prototype.bin = 'c:\path\to\phantomjs.exe';

> It's important to note that I haven't tested this on Windows (and don't really have an easy way to), so feedback and/or pull requests are welcome.


## Usage

    :::js
    var Phapper = require('phapper');
    var phap = new Phapper("/path/to/phantom/script.js",
                            [ "--arg1", "val1", "--arg2", "arg3" ]);
    // Phapper also takes an Object as a third argument which can be
    // anything you might pass to `child_process.exec`. E.g. `env`,
    // `cwd`, etc. When using runSync, only `cwd` is supported.

    console.log("Run Sync");
    var results = phap.runSync();
    // => results
    // {
    //    parsed: { parsed json from stdout || undefined },
    //    stdout: "stdout string",
    //    stderr: "stderr string"
    // }
    if (results.parsed) {
        console.log("result object:\n%j", results.parsed);
    } else {
        console.log(results.stdout);
    }

    console.log("Run Async");
    phap.run( function (result, resultObj) {
        // => result
        // { parsed json from stdout || undefined }
        // => resultObj
        // {
        //    stdout: "stdout string",
        //    stderr: "stderr string"
        //    error:  "error string"
        // }
        if (result) {
            console.log("Results:\n%j", result);
        }
        console.log("Raw Results:");
        console.log(resultObj.stdout);
        console.log(resultObj.stderr);
        if (resultObj.error) {
            console.error(resultObj.error);
        }
    });

