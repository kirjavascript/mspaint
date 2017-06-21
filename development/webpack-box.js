let { Screen, Box, BigText, FileManager, Text, Button } = require('blessed');

module.exports = function webpackBox(screen, reload) {

    let wpStatus = new Box({
        parent: screen,
        top: 3,
        left: 0,
        height: '50%-3',
        label: 'webpack',
        scrollable: true,
        alwaysScroll: true,
        mouse: true,
        tags: true,
        scrollbar: { },
        padding: 1,
        border: {
            type: 'line',
        },
        style: {
            border: {
                fg: '#FA0',
            },
            scrollbar: {
                bg: '#0AF',
            },
        },
    });

    function formatBytes(bytes) {
        const sizes = ['ʙ','ᴋʙ','ᴍʙ','ɢʙ'];
        const i = Math.floor(Math.log(bytes) / Math.log(1e3));
        return '{bold}' + bytes / Math.pow(1e3, i) + '{/}' + sizes[i];
    }

    return ({ state, stats, options}) => {
        if(state) {

            const { errors, warnings, assets, entrypoints, chunks, modules, version, time, hash } = stats.toJson();

            const timestamp = `{#FC0-fg}⚡️{/#FA0-fg}{bold}${time}{/bold}ms`;
            const files = assets
                .map(({name, size}) => {
                    return `{#0AF-fg}${name}{/} ${formatBytes(size)}\n`
                })
                .join``;

            const warnStr = warnings.join``;
            const errorStr = errors.join``;

            const output = [
                `${timestamp}\n`,
                `${files}`,
                `{#0AF-fg}hash{/} {bold}${hash}{/}`,
                `{#0AF-fg}modules{/} {bold}${modules.length}{/}`,
                `{#0AF-fg}version{/} {bold}${version}{/}`,
            ];

            if (stats.hasErrors()) {
                output.push(`\n${errorStr}`);
            }
            if (stats.hasWarnings()) {
                output.push(`\n${warnStr}`);
            }

            wpStatus.setContent(output.join`\n`);

            wpStatus.style.border.fg = '#06A';
            screen.render();
            reload();
        } else {
            wpStatus.style.border.fg = '#FA0';
            screen.render();
        }
    }

}
