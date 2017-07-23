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
                    dialog({
                        title: 'About Paint',
                        width: 348,
                        height: 283,
                        contentClass: 'about',
                        y: -100,
                        onLoad: (content) => {
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
                                ].join`\n`);
                        },
                    });
                },
            },
        ],
    },
];
