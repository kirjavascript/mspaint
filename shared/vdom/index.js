// send LIST in script/json tags? (dont do this, concurrency issues...)
// jsdom not needed if data is send as JSON

// no UID = local
// forward PART event from socket.js/cursors.js
// normalize xydxdy
// render()

let vdom = {
    local: [],
    items: [],
};

function updateVDOM(obj) {

    let { cmd, dom, uid } = obj;

    let domCmd = cmd.substr(4);

    console.log(obj, domCmd);

}

module.exports = {
    updateVDOM,
};
