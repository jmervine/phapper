var fs       = require('fs');
var execSync = require('exec-sync');
var execFile = require('child_process').execFile;
var path     = require('path');

function Phapper(script, args, opts) {
    // mostly for test stub
    if (!Phapper.prototype.bin) {
        this.bin = require(path.join(__dirname, 'phpath')).phantomjs;
    }

    if (!script) {
        throw new Error("Script required!");
    }

    this.script = script;
    this.args   = args || [];
    this.opts   = opts || {};
}

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
        var result = execSync(this.commandString(), true);
        var parsed;
        try { parsed = JSON.parse(result.stdout); } catch(e) {}

        this.results = { parsed: parsed, stdout: result.stdout,
                            stderr: result.stderr };

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
