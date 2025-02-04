const PI = 3.14159265;
const DELAYSPEED = 50;
const output = document.getElementById('output');
const pizzaOutput = document.getElementById('pizzaOutput');
const submit = document.getElementById('submit');
const resetDiv = document.getElementById('resetDiv');
const reset = document.getElementById('reset');
const pizzaOne = document.getElementById('pizza1');
let errorMessage;
let totalPizzaDiff = 0;
let delay = 0;

//
// Listeners
//
window.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
        checkAndSubmit();
    }

    if (isValid()) {
        submit.classList.remove('invalid');
    } else {
        submit.classList.add('invalid');
    }
});

submit.addEventListener('click', function () {
    checkAndSubmit();
});

reset.addEventListener('click', function () {
    resetAll();
});

//
// Returns
//
const isValid = () => {
    const pizzaOne = Number(document.getElementById('pizza1').value) || null;
    const pizzaTwo = Number(document.getElementById('pizza2').value) || null;
    let isValid = false;

    if (pizzaOne && pizzaTwo && pizzaOne > 0 && pizzaTwo > 0) {
        isValid = true;
    } else {
        errorMessage = 'Entries are not valid. Please enter only positive numbers'
    }

    return isValid;
}

const calculateCircleArea = ((diameter = 0) => {
    const radius = diameter / 2;
    const radSquared = radius ** 2;
    const area = PI * radSquared;

    return area;
});

const smallerPizza = () => {
    const pizzaOne = Number(document.getElementById('pizza1').value);
    const pizzaTwo = Number(document.getElementById('pizza2').value);
    return pizzaOne < pizzaTwo ? pizzaOne : pizzaTwo || null;
}

const largerPizza = () => {
    const pizzaOne = Number(document.getElementById('pizza1').value);
    const pizzaTwo = Number(document.getElementById('pizza2').value);
    return pizzaOne > pizzaTwo ? pizzaOne : pizzaTwo || null;
}

//
// Functions
//
function calculatePercentageDifference() {
    const smallSize = smallerPizza();
    const largeSize = largerPizza();
    const num1Area = calculateCircleArea(smallSize);
    const num2Area = calculateCircleArea(largeSize);
    const percentageDiff = (100 - ((num1Area / num2Area) * 100)).toFixed(2);
    totalPizzaDiff = (num2Area / num1Area).toFixed(2);

    generatePizzaText(smallSize, largeSize, percentageDiff);

    if (totalPizzaDiff < 100) {
        generatePizzas();
    } else {
        pizzaOutput.innerHTML = '';
    }
};

function checkAndSubmit() {
    if (isValid()) {
        calculatePercentageDifference();
    }

    resetDiv.classList.remove('hide');
}

function createPizzaDiv() {
    for (let i = 1; i < totalPizzaDiff; i++) {
        pizzaOutput.innerHTML += `
            <div class='pizza' style="animation-delay: ${delay}ms"></div>
        `;

        delay += DELAYSPEED;
    }
}

function generatePizzaText(smallSize, largeSize, percentageDiff) {
    output.innerHTML = `
        <div>
            One
            <span class='small'>${smallSize}</span> inch pizza is
            <span class='percent'>${percentageDiff}%</span> smaller than one
            <span class='large'>${largeSize}</span> inch pizza.<br><br> It would take
            <span class='total'>${totalPizzaDiff}</span>
            <span class='small'>${smallSize}</span> inch pizzas to match one
            <span class='large'>${largeSize}</span> inch pizza
        </div>
    `;
}

function createLastPizzaDiv(lastPizzaDegrees) {
    if (lastPizzaDegrees !== 0) {
        delay += DELAYSPEED;
        const lastPizzaStyle = `background-image: conic-gradient(rgba(255, 255, 255, 0) ${lastPizzaDegrees}deg, beige ${lastPizzaDegrees}deg), url('pizza.png');`;

            pizzaOutput.innerHTML += `
            <div class="pizza" style="${lastPizzaStyle} animation-delay: ${delay}ms"></div>
        `;
    }
}

function resetAll() {
    const pizza1 = document.getElementById('pizza1');
    output.innerHTML = '';
    pizzaOutput.innerHTML = '';
    pizza1.value = '';
    document.getElementById('pizza2').value = '';
    resetDiv.classList.add('hide');
    delay = 0;
    pizza1.focus();
    pizza1.select();
}

async function generatePizzas() {
    pizzaOutput.innerHTML = '';
    const remainder = totalPizzaDiff - Math.floor(totalPizzaDiff);
    const lastPizzaDegrees = 360 * remainder;

    await createPizzaDiv();
    await createLastPizzaDiv(lastPizzaDegrees);

    delay = 0;
}