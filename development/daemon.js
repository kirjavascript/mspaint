~function() {

    const args = '--harmony server/index.js --env.dev'.split` `;

    const reload = process.argv.includes('--reload');

    const proc = require('child_process')
        .spawn('node', args, {
            stdio: 'inherit',
        });

    const rip = () => {
        if (reload) {
            arguments.callee();
        }
        else {
            process.exit();
        }
    };

    proc.on('exit', rip);

    require('chokidar')
        .watch(['server/**/*', 'development/**/*'], {ignored: /[\/\\]\./})
        .on('change', () => {
            proc.removeListener('exit', rip);
            proc.on('exit', arguments.callee);
            proc.kill('SIGINT');
        });

} ();
