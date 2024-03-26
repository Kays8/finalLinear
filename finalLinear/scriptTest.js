const stackContainer = document.getElementById('stack-container');
const boxes = document.querySelectorAll('.manager');
const apprentices = document.querySelectorAll('.apprentice');
const isEmptyElement = document.getElementById('is-empty');
const isFullElement = document.getElementById('is-full');
const countElement = document.getElementById('count');
const peekElement = document.getElementById('peek');
const changeElement = document.getElementById('change');
let stack = [];

function isEmpty() {
    return stack.length === 0;
}

function isFull() {
    const stackCapacity = 5;
    return stack.length === stackCapacity;
}

function count() {
    return stack.length;
}

function peek() {
    if (!isEmpty()) {
        const positions = stack.map((box, index) => {
            const boxType = box.classList.contains('manager') ? 'manager' : 'apprentice';
            return `Position ${index + 1}: ${boxType}`;
        });

        const message = positions.join('\n');
        alert(`${message}`);
    } else {
        alert('Stack is empty. Cannot peek.');
    }
}
peekElement.addEventListener('click', peek);

function change() {
    if (!isEmpty()) {
        // Shuffle the stack array to change positions
        stack = stack.sort(() => Math.random() - 0.5);

        // Remove all box from the stack container
        stackContainer.innerHTML = '';

        // Append the shuffled box back to the stack container
        stack.forEach((box) => {
            stackContainer.appendChild(box);
        });

        // Update status
        updateStatus();
    } else {
        alert('Stack is empty. Cannot change.');
    }
}

changeElement.addEventListener('click', change);

boxes.forEach((box) => {
    box.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', 'box');
    });
});

apprentices.forEach((box2) => {
    box2.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', 'box2');
    });
});

stackContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
});

stackContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    const targetId = e.target.id;

    const isManager = data === 'box';
    const isApprentice = data === 'box2';
    const isSameId = targetId !== '' && document.getElementById(targetId) !== null;
    const isNotFull = !isFull();

    if ((isManager || isApprentice) && isSameId && isNotFull) {
        const newBox = isManager ? boxes[0].cloneNode(true) : apprentices[0].cloneNode(true);
        stackContainer.appendChild(newBox);
        stack.push(newBox);

        updateStatus();

        newBox.addEventListener('dblclick', () => {
            stackContainer.removeChild(newBox);
            stack = stack.filter(item => item !== newBox);
            updateStatus();
        });
    }
});

stackContainer.addEventListener('dblclick', (e) => {
    if (e.target.classList.contains('manager') || e.target.classList.contains('apprentice')) {
        stackContainer.removeChild(e.target);
        stack = stack.filter(item => item !== e.target);
        updateStatus();
    }
});

function updateStatus() {
    isEmptyElement.textContent = isEmpty() ? 'Empty' : 'Not Empty';
    isFullElement.textContent = isFull() ? 'Full' : 'Not Full';
    countElement.textContent = count();
    peekElement.addEventListener('click', peek);
}
