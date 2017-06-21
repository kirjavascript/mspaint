module.exports = () => {
    const monochrome = `┌┬┐┌─┐┌─┐┌─┐┬┌┐┌┬┐
│││└─┐├─┘├─┤│││││
┴ ┴└─┘┴  ┴ ┴┴┘└┘┴`;
    const rainbow = ['red', '#FA0', 'yellow', '#0F0', '#00F', '#518'];

    return '{bold}' + monochrome
        .split`\n`
        .map(line => {
            return line
                .match(/(...|..)/g)
                .map((d, i) => {
                    return `{${rainbow[i]}-fg}${d}`
                })
                .join``;
        })
        .join`\n` + '{/} (~˘▾˘)~';
};

