const PI = 3.14159265;
const DELAYSPEED = 50;
const output = document.getElementById('output');
const error = document.getElementById('error');
const pizzaOutput = document.getElementById('pizzaOutput');
const submit = document.getElementById('submit');
const resetDiv = document.getElementById('resetDiv');
const reset = document.getElementById('reset');
const inputs = document.querySelectorAll('.num-imput');
const pizza1 = document.getElementById('pizza1');
const pizza2 = document.getElementById('pizza2');
const pizza1Price = document.getElementById('pizza1Price');
const pizza2Price = document.getElementById('pizza2Price');
const priceSlider = document.getElementById('priceSlider');
let totalPizzaDiff = 0;
let delay = 0;

//
// Listeners
//

inputs.forEach((input) => {
    input.addEventListener('keyup', function (e) {
        if (e.key === 'Enter') {
            checkAndSubmit();
        }

        if (isValid()) {
            submit.classList.remove('invalid');
        } else {
            submit.classList.add('invalid');
        }
    })
});

submit.addEventListener('click', function () {
    checkAndSubmit();
});

reset.addEventListener('click', function () {
    resetAll();
});

priceSlider.addEventListener('change', showPriceInput);

//
// Returns
//
const isValid = () => {
    const areSizesValid = checkPizzaSizeValues();
    const arePricesValid = checkPizzaPriceValues();
    let isValid = false;

    if (areSizesValid && arePricesValid) {
        isValid = true;
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
    const pizzaOne = {
        size: Number(pizza1.value),
        price: Number(pizza1Price.value) || null
    }
    const pizzaTwo = {
        size: Number(pizza2.value),
        price: Number(pizza2Price.value) || null
    }

    return pizzaOne.size < pizzaTwo.size ? pizzaOne : pizzaTwo || null;
}

const largerPizza = () => {
    const pizzaOne = {
        size: Number(pizza1.value),
        price: Number(pizza1Price.value) || null
    }
    const pizzaTwo = {
        size: Number(pizza2.value),
        price: Number(pizza2Price.value) || null
    }

    return pizzaOne.size > pizzaTwo.size ? pizzaOne : pizzaTwo || null;
}

const calculateBestDeal = (smallPizza, largePizza, smallPizzaPPSI, largePizzaPPSI) => {
    let bestDealPizza = null;

    if (smallPizzaPPSI > largePizzaPPSI) {
        bestDealPizza = largePizza;
        bestDealPizza.class = 'large';
        bestDealPizza.PPSI = largePizzaPPSI;
    } else {
        bestDealPizza = smallPizza;
        bestDealPizza.class = 'small';
        bestDealPizza.PPSI = smallPizzaPPSI;
    }

    return bestDealPizza;
}

const checkPizzaPriceValues = () => {
    let isValid = false;

    if (!priceSlider.checked) {
        isValid = true;
    } else {
        const pizzaOnePrice = Number(pizza1Price.value) || null;
        const pizzaTwoPrice = Number(pizza2Price.value) || null;

        if (pizzaOnePrice && pizzaTwoPrice && pizzaOnePrice > 0 && pizzaTwoPrice > 0) {
            isValid = true;

            error.innerHTML = '';
        } else if (pizzaOnePrice && pizzaTwoPrice && (pizzaOnePrice <= 0 || pizzaTwoPrice <= 0)) {
            error.innerHTML = 'Cannot enter values less than 0.';
        }
    }

    return isValid;
}

const checkPizzaSizeValues = () => {
    const pizzaOneSize = Number(pizza1.value) || null;
    const pizzaTwoSize = Number(pizza2.value) || null;
    let isValid = false;

    if (pizzaOneSize && pizzaTwoSize && pizzaOneSize > 0 && pizzaTwoSize > 0) {
        isValid = true;

        error.innerHTML = '';
    } else if (pizzaOneSize && pizzaTwoSize && (pizzaOneSize <= 0 || pizzaTwoSize <= 0)) {
        error.innerHTML = 'Cannot enter values less than 0.';
    }

    return isValid;
}

//
// Functions
//
function calculatePercentageDifference() {
    output.innerHTML = '';
    const smallPizza = smallerPizza();
    const largePizza = largerPizza();
    const smallPizzaArea = calculateCircleArea(smallPizza.size);
    const largePizzaArea = calculateCircleArea(largePizza.size);
    const percentageDiff = (100 - ((smallPizzaArea / largePizzaArea) * 100)).toFixed(2);
    totalPizzaDiff = (largePizzaArea / smallPizzaArea).toFixed(2);

    if (totalPizzaDiff < 100) {
        generatePizzas();
    } else {
        pizzaOutput.innerHTML = '';
    }

    if (priceSlider.checked) {
        const smallPizzaPPSI = (smallPizza.price / smallPizzaArea).toFixed(2);
        const largePizzaPPSI = (largePizza.price / largePizzaArea).toFixed(2);
        const bestDealPizza = calculateBestDeal(smallPizza, largePizza, smallPizzaPPSI, largePizzaPPSI);
        generatePricePerInchText(smallPizza, largePizza, smallPizzaPPSI, largePizzaPPSI, bestDealPizza);
    }

    generatePizzaDiffText(smallPizza.size, largePizza.size, percentageDiff);
};

function checkAndSubmit() {
    if (isValid()) {
        calculatePercentageDifference();
        resetDiv.classList.remove('hide');
    }
}

function createPizzaDiv() {
    for (let i = 1; i < totalPizzaDiff; i++) {
        pizzaOutput.innerHTML += `
            <div class='pizza' style="animation-delay: ${delay}ms"></div>
        `;

        delay += DELAYSPEED;
    }
}

function generatePizzaDiffText(smallSize, largeSize, percentageDiff) {
    output.innerHTML += `
        <div class="output-wrap">
            <div class="output-title">
                <h2>Pizza Difference</h2>
            </div>
            <div class="output-text">
                One
                <span class='small'>${smallSize}</span> inch pizza is
                <span class='percent'>${percentageDiff}%</span> smaller than one
                <span class='large'>${largeSize}</span> inch pizza.<br><br> It would take
                <span class='total'>${totalPizzaDiff}</span>
                <span class='small'>${smallSize}</span> inch pizzas to match one
                <span class='large'>${largeSize}</span> inch pizza
            </div>
        <div>
    `;
}

function generatePricePerInchText(smallPizza, largePizza, smallPizzaPPSI, largePizzaPPSI, bestDealPizza) {
    output.innerHTML += `
        <div class="output-wrap" id="pricePerInchOutput">
            <div class="output-title">
                <h2>Price Per Square Inch</h2>
            </div>
            <div class="output-text">
                The <span class='money'>$${smallPizza.price}</span> <span class='small'>${smallPizza.size}</span> inch pizza costs <span class='money'>$${smallPizzaPPSI}</span> per square inch.<br><br>
                Meanwhile, the <span class='money'>$${largePizza.price}</span> <span class='large'>${largePizza.size}</span> inch pizza costs <span class='money'>$${largePizzaPPSI}</span> per square inch.<br><br>
                Therefore, the <span class='${bestDealPizza.class}'>${bestDealPizza.size}</span> inch <span class='money'>$${bestDealPizza.price}</span> pizza at <span class='money'>$${bestDealPizza.PPSI}</span> per slice would be the best value per dollar.
            </div>
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
    output.innerHTML = '';
    pizzaOutput.innerHTML = '';
    pizza1.value = '';
    pizza2.value = '';
    pizza1Price.value = '';
    pizza2Price.value = '';
    resetDiv.classList.add('hide');
    submit.classList.add('invalid');
    delay = 0;
    pizza1.focus();
    pizza1.select();
}

function showPriceInput() {
    const pricePerInchOutput = document.getElementById('pricePerInchOutput') || null;

    if (priceSlider.checked) {
        pizza1Price.classList.remove('hide');
        pizza2Price.classList.remove('hide');

        if (pricePerInchOutput) {
            pricePerInchOutput.classList.remove('hide');
        }
    } else {
        pizza1Price.classList.add('hide');
        pizza2Price.classList.add('hide');

        if (pricePerInchOutput) {
            pricePerInchOutput.classList.add('hide');
        }
    }
}

async function generatePizzas() {
    pizzaOutput.innerHTML = '';
    const remainder = totalPizzaDiff - Math.floor(totalPizzaDiff);
    const lastPizzaDegrees = 360 * remainder;

    await createPizzaDiv();
    await createLastPizzaDiv(lastPizzaDegrees);

    delay = 0;
}