~function() {

    const args = '--harmony server/index.js --env.dev'.split` `;

    const proc = require('child_process')
        .spawn('node', args, {
            stdio: 'inherit',
        });

    require('chokidar')
        .watch('server/**/*', {ignored: /[\/\\]\./})
        .on('change', () => {
            proc.kill('SIGINT');
        });

    proc.on('exit', arguments.callee);

} ();
