function ChatTree(element) {
    const state = {
        isLoaded: false,
        selectedElement: {
            DOMElement: element,
            treeLevel: 0
        }
    };

    function load(items) {
        if (state.isLoaded) {
            return;
        }
        element.addEventListener('keydown', handleEvent);
        element.addEventListener('dblclick', handleEvent);
        render(items, element, state.selectedElement.treeLevel);
        element.firstChild.className = 'selected';
        state.isLoaded = true;
        state.selectedElement.DOMElement = element.firstChild;
    }

    function render(items, appendAfter, indentLevel) {
        items.forEach(item => {
            let newElem = getNewElement('li', item, indentLevel);
            append(appendAfter, newElem);
            appendAfter = newElem;
        });
    }

    function append(appendAfter, newElem) {
        if (!state.isLoaded) {
            appendAfter.appendChild(newElem);
            state.isLoaded = true;
            return;
        }
        appendAfter.after(newElem);
    }

    function getNewElement(tag, item, indentLevel) {
        let newElement = document.createElement(tag);
        if (item.type === 'group') {
            newElement.expandData = item.items;
            let arrowDiv = document.createElement('div');
            arrowDiv.className = 'arrow-right';
            newElement.appendChild(arrowDiv);
        }
        newElement.indentLevel = indentLevel;
        newElement.style.textIndent = `${indentLevel}em`;
        newElement.innerHTML = item.name + newElement.innerHTML;
        return newElement;
    }

    function handleEvent(e) {
        let current = state.selectedElement.DOMElement;
        if (e.type === 'keydown') {
            switch (e.keyCode) {
                case 37: // left
                    fold(current);
                    break;
                case 38: // up
                    navUp(current);
                    break;
                case 39: // right
                    if (current.expanded === true || !current.expandData) {
                        return;
                    }
                    expand(current);
                    break;
                case 40: // down
                    navDown(current);
                    break;
                case 13: // enter
                    if (!current.expandData) {
                        return;
                    } else if (current.expanded === true) {
                        fold(current);
                    } else {
                        expand(current);
                    }
                    break;
            }
        }
        if (e.type === 'dblclick') {
            state.selectedElement.DOMElement.className = '';
            e.target.className = 'selected';
            state.selectedElement.DOMElement = e.target;
            if (!e.target.expandData) {
                return;
            } else if (e.target.expanded === true) {
                fold(e.target);
            } else {
                expand(e.target);
            }
        }
    }

    function fold(current) {
        if (current.expanded !== true && current.previousElementSibling) {
            let currentLevel = current.indentLevel;
            let prevElement = current.previousElementSibling;
            while(prevElement.indentLevel >= currentLevel) {
                navUp(current);
                current = state.selectedElement.DOMElement;
                if (current.previousElementSibling) {
                    prevElement = current.previousElementSibling;
                } else {
                    break;
                }
            }
            navUp(current);
        } else {
            current.expanded = false;
            current.firstElementChild.className = 'arrow-right';
            let nextElement = current.nextElementSibling;
            while(nextElement.indentLevel > current.indentLevel) {
                let removeElem = nextElement;
                nextElement = nextElement.nextElementSibling;
                removeElem.remove();
            }
        }
    }

    function navUp(current) {
        if (current.previousElementSibling) {
            current.className = '';
            current.previousElementSibling.className = 'selected';
            state.selectedElement.DOMElement = current.previousElementSibling;
        }
    }

    function expand(current) {
        current.expanded = true;
        current.firstElementChild.className = 'arrow-down';
        render(current.expandData, current, current.indentLevel+1);
        navDown(current);
    }

    function navDown(current) {
        if (current.nextElementSibling) {
            current.className = '';
            current.nextElementSibling.className = 'selected';
            state.selectedElement.DOMElement = current.nextElementSibling;
        }
    }

    function clear() {
        element.innerHTML = '';
        state.isLoaded = false;
        state.selectedElement.DOMElement = element;
    }

    return {
        load,
        clear,
        element,
    };
}
