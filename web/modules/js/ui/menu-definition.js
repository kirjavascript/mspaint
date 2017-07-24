import { dialog } from './dialog';

// File Edit View Colors Help

export const menuDefinition = [
    {
        name: 'File',
        ulIndex: 0,
        children: [
            {
                name: 'New',
            },
            {
                name: 'Open',
            },
            {
                name: 'Save',
            },
            {
                name: 'Save As',
            },
            {
                hr: true,
            },
            {
                name: 'Print',
            },
        ],
    },
    {
        name: 'Help',
        ulIndex: 0,
        children: [
            {
                name: 'Documentation',
                ulIndex: 0,
                action() {
                    window.open('https://www.github.com/kirjavascript/mspaint');
                },
            },
            {
                hr: true,
            },
            {
                name: 'About Paint',
                ulIndex: 0,
                action() {

                    fetch('/mem')
                        .then((res) => res.json())
                        .then(({physical, resources}) => {

                            dialog({
                                title: 'About Paint',
                                width: 370,
                                height: 320,
                                contentClass: 'about',
                                y: -100,
                                onLoad: ({ content, close }) => {
                                    content.append('img')
                                        .attr('src', '/logo.png');

                                    content.append('span')
                                            .classed('info', true)
                                            .html([
                                                'Microsoft (R) Paint',
                                                'Windows 98',
                                                'Copyright (C) 1981-1998 Microsoft Corp.',
                                                '\n',
                                                'This product is licenced to:',
                                                'everyone',
                                                '\n',
                                                '<hr/>',
                                                `<span class="right">${physical}</span>Physical memory available to Windows:`,
                                                `<span class="right">${resources}</span>System resources: `,
                                                '\n\n',
                                            ].join`\n`)
                                            .append('div')
                                            .classed('button', true)
                                            .on('click', close)
                                            .text('Ok')
                                            .append('div');

                                },
                            });

                        });
                },
            },
        ],
    },
];

menuDefinition[1].children[2].action();
