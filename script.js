const PI = 3.14159265;
const DELAYSPEED = 50;
const output = document.getElementById('output');
const pizzaOutput = document.getElementById('pizzaOutput');
const submit = document.getElementById('submit');
const reset = document.getElementById('reset');
let errorMessage;
let totalPizzaDiff = 0;
let delay = 0;

window.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
        checkAndSubmit();
    }

    console.log(isValid());

    if (isValid()) {
        submit.classList.remove('invalid');
    } else {
        submit.classList.add('invalid');
    }
});

submit.addEventListener('click', function () {
    checkAndSubmit();
});

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

function checkAndSubmit() {
    if (isValid()) {
        calculatePercentageDifference();
    }
}

const calculateCircleArea = ((diameter = 0) => {
    const radius = diameter / 2;
    const radSquared = radius ** 2;
    const area = PI * radSquared;

    return Math.round(area);
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

const calculatePercentageDifference = (() => {
    const smallSize = smallerPizza();
    const largeSize = largerPizza();
    const num1Area = calculateCircleArea(smallSize);
    const num2Area = calculateCircleArea(largeSize);
    const totalDiff = (100 - ((num1Area / num2Area) * 100)).toFixed(2);
    totalPizzaDiff = (num2Area / num1Area).toFixed(2);

    output.innerHTML = `
        <div>
            One
            <span class='small'>${smallSize}</span> inch pizza is
            <span class='percent'>${totalDiff}%</span> smaller than one
            <span class='large'>${largeSize}</span> inch pizza.<br><br> It would take
            <span class='total'>${totalPizzaDiff}</span>
            <span class='small'>${smallSize}</span> inch pizzas to match one
            <span class='large'>${largeSize}</span> inch pizza
        </div>
    `;

    if (totalPizzaDiff < 100) {
        generatePizzas(totalPizzaDiff);
    } else {
        output.innerHTML = '';
    }
  });

function createPizzaDiv() {
    for (let i = 1; i < totalPizzaDiff; i++) {
        pizzaOutput.innerHTML += `
            <div class='pizza' style="animation-delay: ${delay}ms"></div>
        `;

        delay += DELAYSPEED;
    }
}

function createLastPizzaDiv(lastPizzaDegrees) {
    if (lastPizzaDegrees !== 0) {
        delay += DELAYSPEED;
        const lastPizzaStyle = `background-image: conic-gradient(rgba(255, 255, 255, 0) ${lastPizzaDegrees}deg, white ${lastPizzaDegrees}deg), url('pizza.png');`;

            pizzaOutput.innerHTML += `
            <div class="pizza" style="${lastPizzaStyle} animation-delay: ${delay}ms"></div>
        `;
    }
}

async function generatePizzas(totalPizzaDiff) {
    pizzaOutput.innerHTML = '';
    const remainder = totalPizzaDiff - Math.floor(totalPizzaDiff);
    const lastPizzaDegrees = 360 * remainder;

    await createPizzaDiv();
    await createLastPizzaDiv(lastPizzaDegrees);

    delay = 0;
}