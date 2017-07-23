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
                    console.log('print');
                },
            },
        ],
    },
];
