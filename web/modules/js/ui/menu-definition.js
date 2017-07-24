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

                            fetch('/mem')
                                .then((res) => res.json())
                                .then(({physical, resources}) => {

                                    content.append('span')
                                        .classed('info', true)
                                        .html([
                                            'Microsoft (R) Paint',
                                            'Windows 98',
                                            'Copyright (C) 1980-1998 Microsoft Corp.',
                                            '\n',
                                            'This product is licenced to:',
                                            'everyone',
                                            '\n',
                                            '<hr/>',
                                            `Physical memory available to Windows:    ${physical}`,
                                            `<span class="right">${resources}</span>System resources: `,
                                        ].join`\n`);
                                });

                        },
                    });
                },
            },
        ],
    },
];
