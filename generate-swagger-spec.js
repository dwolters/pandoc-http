const cpExec = require('child_process').exec;
const yamljs = require('yamljs');
const mediaTypeMapping = require('./mediatype-mapping.json');

const cmdListInputFormats = 'pandoc --list-input-formats';
const cmdListOutputFormats = 'pandoc --list-output-formats';
const separator = '\r\n';
let spec = yamljs.load('./pandoc.swagger.template.yaml');
let op = spec.paths['/'].post;

/**
 * Executes the specified command on the command line.
 *
 * @param {string} cmd The command to execute.
 * @return {Promise<string>} Promise which either resolves with the resulting output (stdout)
 *                           or rejects with an error and the corresponding output (stderr).
 */
function exec(cmd) {
    return new Promise((resolve, reject) => {
        cpExec(cmd, (error, stdout, stderr) => {
            if (error) {
                reject(stderr, error);
            } else {
                resolve(stdout);
            }
        });
    });
}

/**
 * Converts the output of Pandoc's listed input/output formats into an array of media types.
 *
 * @param {string} output The output returned by `pandoc --list-[input|output]-formats.
 * @return {string[]} The corresponding media types.
 */
function processFormatListOutput(output) {
    return output
        .split(separator)
        .map((format) => mediaTypeMapping[format])
        .filter((item) => item);
}

/**
 * Prints the specified spec to the standard output.
 * Uses JSON or YAML format based on command line argument.
 *
 * @param {Object} spec The Swagger description to save.
 */
function print(spec) {
    let extArg = process.argv[2];
    let ext = (extArg)? extArg.substring(2) : null;

    if (ext === 'yaml') {
        console.log(yamljs.stringify(spec, 10, 2));
    } else {
        console.log(JSON.stringify(spec, null, 2));
    }
}

Promise.all([
    exec(cmdListInputFormats),
    exec(cmdListOutputFormats),
])
.then((outputs) => {
    op.consumes = processFormatListOutput(outputs[0]);
    op.produces = processFormatListOutput(outputs[1]);
    return spec;
})
.then(print)
.catch(console.error);
