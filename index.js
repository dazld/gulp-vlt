"use strict";
var through = require('through2');
var gutil = require('gulp-util');
var _ = require('lodash');
var util = require('util');
var spawn = require('child_process').exec;
var fs = require('fs');
var path = require('path');
var log = console.log.bind(console);
var Promise = require('bluebird');

/*

 svlt: {
    options: {
        vaultWork: '../cms-pan-ui/cms-pan-ui-package/src/main/content/jcr_root/apps/richemont-pan/ui/',
        checkout: {
            host: {
                uri: 'http://localhost:<%=port%>/crx',
                user: 'admin',
                password: 'admin'
            },
            autoforce: true,
            stdout: true
        }
    }
}

*/



module.exports = function(options){
    options = options || {};
    _.defaults(options, {
        jcr_root: process.cwd() // almost never want this! maybe throw if no JCR root given?
    });



    function doVLT(file, enc, callback){

        // console.log(options);

        var cwd = options.jcr_root;

        if (file.isNull() || file.stat.isSymbolicLink()) {
            return callback(null, file);
        }

        // var fileN = file.path.replace(cwd, '');

        // var spawning = new Promise(function(resolve, reject){
            var args = ['vlt', 'commit', file.path];

            function complete(err,stdout,stderr){
                console.log(stdout)
                callback(err, file);
            }

            if (fs.existsSync(file.path)) {
                console.log('adding file:', file.path, cwd);
                spawn(args.join(' '),{cwd:cwd}, complete)
                // spawn('vlt', args, {cwd: cwd},complete);
            } else {
                args[1] = 'delete';
                console.log('deleting file:', file.path)
                spawn(args.join(' '),{cwd:cwd}, complete);
            }
        // }).catch(function(err){
        //     callback(err, file);
        // })

        // return callback(null,file);

    }

    return through.obj(doVLT);
}
