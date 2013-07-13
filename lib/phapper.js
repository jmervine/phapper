var fs       = require('fs');
var execSync = require('exec-sync');
var execFile = require('child_process').execFile;
var path     = require('path');

function Phapper(script, args) {
    // mostly for test stub
    if (!Phapper.prototype.bin) {
        this.bin = require(path.join(__dirname, 'phpath')).phantomjs;
    }

    if (!script)
        throw new Error("Script required!");

    if (!fs.existsSync(script))
        throw new Error("Script ("+script+") not found!");

    this.script = script;

    if (args)
        this.args = args;
}

Phapper.prototype = {
    commandString: function () {
        return [this.bin, this.script]
                .concat(this.args)
                .join(" ");
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
        return execFile(this.bin, this.commandArray(), function (error, stdout, stderr) {
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
