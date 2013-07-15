if (process.platform === 'win32') {
    console.log("PhantomJS isntallation isn't supported on Windows. See");
    console.log("http://phantomjs.org/download.html for Windows installation");
    console.log("instructions.");
    console.log(" ");
    console.log("Once installed, you can tell Phapper to use your installation");
    console.log("like so:");
    console.log(" ");
    console.log("   var Phapper = require('phapper');");
    console.log("   Phapper.prototype.bin = '/path/to/phantomjs.exe';");
    console.log(" ");
    process.exit(0);
}

require('child_process')
    .spawn('./scripts/install.sh', [], { stdio: 'inherit', env: process.env });
