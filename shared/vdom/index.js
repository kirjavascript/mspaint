// allow sending vdom as flat html (somehow)
// frontend has it's own implementation
// virtual DOM for server side rendering (https://github.com/WebReflection/hyperHTML)
// server side rendering shouldn't need events
// server side rendering means not having to send data via LIST
// send LIST in script/json tags?
// jsdom not needed if data is send as JSON

// no UID = local
// forward PART event from socket.js/cursors.js
// render()

let vdom = {
    local: [],
    items: [],
};

function updateVDOM(obj) {

}

module.exports = {
    updateVDOM,
};
