var path = require('path');
var objectAssign = require('object-assign');
var nightwatch = require.main.require('nightwatch');
var CliRunner = require.main.require('nightwatch/lib/runner/cli/clirunner');
var ClientManager = require.main.require('nightwatch/lib/runner/clientmanager');
var client;

function World() {
    objectAssign(this, client.api);
}

function bootstrap(options) {
    var runner = new CliRunner(process.argv);
    var clientManager;

    if (this.BeforeFeatures && this.AfterFeatures) {
        this.BeforeFeatures(function(event, done) {
            runner.init();
            clientManager = new ClientManager();
            client = clientManager.init(runner.test_settings).get();
            runner.startSelenium(done);
        });

        this.AfterFeatures(function(event, done) {
            runner.stopSelenium(done);
        });
    }

    if (this.Before && this.After) {
        this.BeforeFeature(function (event, done) {
            client.on('selenium:session_create', function() {
                done();
            });
            client.start();
        });

        this.AfterFeature(function (event, done) {
            client.api.end(function() {
                done();
            });
        });
    }

    this.World = World;
    return __filename;
}

module.exports = bootstrap;