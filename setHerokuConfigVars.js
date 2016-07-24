// Allow for environment variable usage
require('dotenv').config();
// for C-like string formatting
var format = require('util').format;
// to run shell commands in child process
var exec = require('child_process').exec;

var ENV_VARIABLES = [
    'MONGO_DB',
    'PROJECT_ID',
    'PRIVATE_KEY',
    'DATABASE_URL'
];

console.log('Setting environment variables in Heroku...\n');
ENV_VARIABLES.forEach(function(varName){
    var command = format('heroku config:set %s=\"%s\"', 
        varName, process.env[varName]);
    var logStatement = format('%s\n', command);
    console.log(logStatement);
    exec(command);
});
console.log('Finished!');
