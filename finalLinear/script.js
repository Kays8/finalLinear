const stackContainer = document.getElementById('stack-container');
const block = document.querySelector('.block');
const block2 = document.querySelector('.block2');
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
        const positions = stack.map((block, index) => {
            const blockType = block.classList.contains('block') ? 'Block' : 'Block2';
            return `Position ${index + 1}: ${blockType}`;
        });

        const message = positions.join('\n');
        alert(`Peek:\n${message}`);
    } else {
        alert('Stack is empty. Cannot peek.');
    }
}
peekElement.addEventListener('click', peek);

function change() {
    stackContainer.addEventListener('mousedown', (e) => {
        let draggedElement = e.target;
        let offset = { x: e.clientX - draggedElement.getBoundingClientRect().left, y: e.clientY - draggedElement.getBoundingClientRect().top };

        function handleMouseMove(e) {
            draggedElement.style.position = 'absolute';
            draggedElement.style.left = e.clientX - offset.x + 'px';
            draggedElement.style.top = e.clientY - offset.y + 'px';
        }

        function handleMouseUp() {
            stackContainer.removeEventListener('mousemove', handleMouseMove);
            stackContainer.removeEventListener('mouseup', handleMouseUp);

            // Find the drop target
            const dropTarget = document.elementFromPoint(event.clientX, event.clientY);

            if (dropTarget && (dropTarget.classList.contains('block') || dropTarget.classList.contains('block2'))) {
                // Update the stack order
                const indexDragged = stack.indexOf(draggedElement);
                const indexTarget = stack.indexOf(dropTarget);

                stack.splice(indexDragged, 1);
                stack.splice(indexTarget, 0, draggedElement);

                // Remove and re-append elements to stackContainer to reflect the new order visually
                stackContainer.innerHTML = '';
                stack.forEach((block) => {
                    stackContainer.appendChild(block);
                });

                // Update status
                updateStatus();
            }

            draggedElement.style.position = '';
            draggedElement.style.left = '';
            draggedElement.style.top = '';
        }

        stackContainer.addEventListener('mousemove', handleMouseMove);
        stackContainer.addEventListener('mouseup', handleMouseUp);
    });
}

changeElement.addEventListener('click', change);

// ... (existing code)

block.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', 'block');
});

block2.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', 'block2');
});

stackContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
});

stackContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    const newBlock = (data === 'block') ? block.cloneNode(true) : block2.cloneNode(true);

    if ((data === 'block' || data === 'block2') && !isFull()) {
        stackContainer.appendChild(newBlock);
        stack.push(newBlock);

        // Update status
        updateStatus();
        
        newBlock.addEventListener('dblclick', () => {
            stackContainer.removeChild(newBlock);
            stack = stack.filter(item => item !== newBlock);
            // Update status
            updateStatus();
        });
    }
});

stackContainer.addEventListener('dblclick', (e) => {
    if (e.target.classList.contains('block') || e.target.classList.contains('block2')) {
        stackContainer.removeChild(e.target);
        stack = stack.filter(item => item !== e.target);
        // Update status
        updateStatus();
    }
});

function updateStatus() {
    isEmptyElement.textContent = isEmpty() ? '0' : 'Not Empty';
    isFullElement.textContent = isFull() ? 'Full' : 'Not Full';
    countElement.textContent = count();
    peekElement.addEventListener('click', peek);


}