var fs       = require('fs');
var execSync = require('exec-sync');
var exec     = require('child_process').exec;

function Phapper(script, args) {
    if (!script)
        throw new Error("Script required!");

    if (!fs.existsSync(script))
        throw new Error("Script ("+script+") not found!");

    this.script = script;

    if (args)
        this.args = args;
}

Phapper.prototype = {
    command: function () {
        return "phantomjs "
                + this.script + " "
                + this.args.join(" ");
    },

    runSync: function () {
        var result = execSync(this.command(), true);
        var parsed;
        try { parsed = JSON.parse(result.stdout); } catch(e) {}

        this.results = { parsed: parsed, stdout: result.stdout,
                            stderr: result.stderr };

        return this.results;
    },

    run: function (callback) {
        return exec(this.command(), function (error, stdout, stderr) {
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
