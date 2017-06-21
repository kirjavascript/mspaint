let { Screen, Box, BigText, FileManager, Text, Button } = require('blessed');

let conStr = require('./constr');

module.exports = function webpackBox(screen, reload) {

    let wpStatus = new Box({
        parent: screen,
        left: 0,
        bottom: 0,
        height: '100%-3',
        label: 'webpack',
        scrollable: true,
        alwaysScroll: true,
        mouse: true,
        tags: true,
        scrollbar: { },
        border: {
            type: 'line',
        },
        style: {
            border: {
                fg: '#FA0',
            },
            scrollbar: {
                bg: 'grey',
            },
        },
    });


    const log = (obj) => {
        wpStatus.setContent(conStr(obj));
    };

    return ({ state, stats, options}) => {
        if(state) {

            const { errors, warnings, assets, entrypoints, chunks, modules, version, time, hash } = stats.toJson();

            const timestamp = `{#FC0-fg}⚡️{/#FA0-fg}{bold}${time}{/bold}ms`;

            // log({
            //     hash,
            //     time,
            //     stats: stats.toJson(),
            // });



            log({
                hash,
                time: timestamp,
                version,
                modules: modules.length,
                entrypoints,
                chunks,
                assets,
            });
            // wpStatus.setContent(errors[0])


            // let displayStats = (!options.quiet && options.stats !== false);
            // if(displayStats &&
                // !(stats.hasErrors() || stats.hasWarnings()) &&
                // options.noInfo)
                // displayStats = false;
            // if(displayStats) {
                // options.log(stats.toString(options.stats));
                // wpStatus.setContent(stats.toString(options.stats));
                // screen.render();
            // }
            if(!options.noInfo && !options.quiet) {
                wpStatus.style.border.fg = '#06A';
                screen.render();
                reload();
            }
        } else {
            wpStatus.style.border.fg = '#FA0';
            screen.render();
        }
    }

}
