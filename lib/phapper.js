var fs       = require('fs');
var child    = require('child_process');
var execSync = child.execSync;
var execFile = child.execFile;
var path     = require('path');

var BIN = require(path.join(__dirname, 'phpath')).phantomjs;
var VERSION = execSync(BIN + ' --version').stdout.trim();

function Phapper(script, args, opts) {
    // mostly for test stub
    if (!Phapper.prototype.bin) {
        this.bin = BIN;
    }

    if (!script) {
        throw new Error("Script required!");
    }

    this.script = script;
    this.args   = args || [];
    this.opts   = opts || {};
}

Phapper.phantomjs = {
    version: VERSION,
    path: BIN,
    bin: BIN
};

Phapper.prototype = {
    commandString: function () {
        var str = [this.bin, this.script]
                .concat(this.args)
                .join(" ");

        if (this.opts.cwd) {
            str = "cd " + this.opts.cwd + " && " + str;
        }
        return str;
    },

    commandArray: function () {
        return [this.script]
                .concat(this.args);
    },

    runSync: function () {
        var result = execSync(this.commandString());
        var parsed;
        try { parsed = JSON.parse(result.stdout); } catch(e) {}

        this.results = { parsed: parsed, output: result.stdout,
                            // for backwards compatibility, will remove
                            // in 0.2.0
                            stdout: result.stdout,
                            stderr: '' };

        return this.results;
    },

    run: function (callback) {
        return execFile(this.bin, this.commandArray(), this.opts, function (error, stdout, stderr) {
            var parsed;
            try { parsed = JSON.parse(stdout); } catch(e) {}
            callback(parsed, {
                error: error, stdout: stdout, stderr: stderr
            });
        });
    },

};

module.exports = Phapper;

// vim: ft=javascript:
