~function() {

    const args = '--harmony server/index.js --env.dev'.split` `;

    const proc = require('child_process')
        .spawn('node', args, {
            stdio: 'inherit',
        });

    const rip = () => {process.exit()};

    proc.on('exit', rip);

    require('chokidar')
        .watch('server/**/*', {ignored: /[\/\\]\./})
        .on('change', () => {
            proc.removeListener('exit', rip);
            proc.on('exit', arguments.callee);
            proc.kill('SIGINT');
        });

} ();
