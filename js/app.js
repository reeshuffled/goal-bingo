const NUM_GOAL_BANK_COLS = 4;

const goalBank = [
    "Workout everyday for a week for at least 30 mins",
    "Read a non-fiction book",
    "Read a fiction book",
    "Watch a new movie (in theaters)", 
    "Try watching a new show",
    "Try a new restaurant",
    "Try a new type of cuisine/dish",
    "Go to a museum",
    "Stay overnight in a new city",
    "Try cooking a new recipe",
    "Try baking a new recipe",
    "Clean out a section of your room/living area",
    "Listen to a new album from start to finish",
    "Catch up with an old friend (in person)",
    "Call a friend to catch up",
    "Make a new friend (or at least acquaintance)",
    "Go on a date",
    "Don't drink alcohol for a week",
    "Don't drink caffeine for a week",
    "Don't eat meat for a week",
    "Don't buy non-necessary things for one week",
    "Try daily journaling for a week",
    "Take a hike",
    "Do a craft"
];

const bingoBoardEl = document.getElementById('bingo_board');

const goalBankEl = document.getElementById('goal_bank');
const newGoalInput = document.getElementById('goalInput');
// create goal bank rows
const bankContainers = [...Array(NUM_GOAL_BANK_COLS)].map(_ => createElement(
    createElement(goalBankEl, 'div'), 'ul')
);

/*
 * Initialize UI components.
 */
(function initUI() {
    initializeBingoBoard();

    getShuffledArray(goalBank).forEach(addGoalToBank);

    populateBingoBoard();

    document.getElementById('addGoal').onclick = createNewGoal;

    newGoalInput.onkeyup = e => {
        if (e.key == 'Enter') {
           createNewGoal();
        }
    }
})();

/**
 * Render Bingo board with goals.
 */
function populateBingoBoard() {
    const optedInGoals = getShuffledArray(
        [...document.querySelectorAll("input[type=checkbox]:checked")].map(x => x.value)
    );

    // populate Bingo cells
    let goalIndex = 0;
    for (let i = 1; i <= 5; i++) {
        for (let j = 0; j < 5; j++) {
            // skip free space
            if (i != 3 || j != 2) {
                bingoBoardEl.rows[i].cells[j].textContent = optedInGoals[goalIndex++];
            }
        }
    }
}

/**
 * Add new goal to Bingo board from user input.
 */
function createNewGoal() {
    // do not allow blank input
    if (newGoalInput.value.trim() == "") return;

    addGoalToBank(
        newGoalInput.value.trim(),
        document.querySelectorAll("input[type=checkbox]").length
    );

    // reset goal input
    newGoalInput.value = '';
    newGoalInput.focus();

    // re-render bingo board
    populateBingoBoard();
}

/**
 * Add new goal to Bingo board.
 * @param {String} goal 
 * @param {Number} i 
 */
function addGoalToBank(goal, i) {
    // create unique goal id
    const goalId = `goal_${Math.random().toString(16).slice(2)}`;

    const li = createElement(bankContainers[i % NUM_GOAL_BANK_COLS], 'li');

    createElement(li, 'input', {
        type: 'checkbox',
        id: goalId,
        value: goal,
        checked: true
    })
    // re-render bingo board on checkbox change
    .addEventListener("change", populateBingoBoard);

    createElement(li, 'label', {
        for: goalId,
        innerText: goal
    });

    // add delete goal button
    createElement(li, 'span', {
        innerText: '❌',
        onclick: () => {
            if (confirm('Are you sure you want to delete this goal?')) {
                // delete the goal
                bankContainers[i % NUM_GOAL_BANK_COLS].removeChild(li);

                // re-render bingo board
                populateBingoBoard();
            }
        }
    });
}

/**
 * Create the Bingo board.
 */
function initializeBingoBoard() {
    for (let i = 0; i <= 5; i++) {
        const row = createElement(bingoBoardEl, 'tr');

        for (let j = 0; j < 5; j++) {
            // create Bingo header
            if (i == 0) {
                createElement(row, 'th', {
                    textContent: 'BINGO'[j]
                });
            }
            // create free space
            else if (i == 3 && j == 2) {
                createElement(row, 'td', {
                    textContent: 'FREE'
                });
            }
            else {
                createElement(row, 'td');
            }
        }
    }
}

/**
 * Create an HTML element and add it to the DOM tree.
 * @param {HTMLElement} parent 
 * @param {String} tag 
 * @param {Object} attributes 
 */
function createElement(parent, tag, attributes = {}) {
    // create the element to whatever tag was given
    const el = document.createElement(tag);

    // go through all the attributes in the object that was given
    Object.entries(attributes)
        .forEach(([attr, value]) => {
            // handle the various special cases that will cause the Element to be malformed
            if (attr == "innerText") {
                el.innerText = value;
            }
            else if (attr == "innerHTML") {
                el.innerHTML = value;
            }
            else if (attr == "textContent") {
                el.textContent = value;
            }
            else if (attr == "onclick") {
                el.onclick = value;
            }
            else if (attr == "onkeydown") {
                el.onkeydown = value;
            }
            else {
                el.setAttribute(attr, value);
            }
        });

    // add the newly created element to its parent
    parent.appendChild(el);

    // return the element in case this element is a parent for later element creation
    return el;
}

/**
 * https://stackoverflow.com/a/46161940
 * @param {any[]} arr 
 * @returns 
 */
function getShuffledArray(arr){
    return [...arr].map( (_, i, arrCopy) => {
        const rand = i + ( Math.floor( Math.random() * (arrCopy.length - i) ) );

        [arrCopy[rand], arrCopy[i]] = [arrCopy[i], arrCopy[rand]];

        return arrCopy[i];
    });
}