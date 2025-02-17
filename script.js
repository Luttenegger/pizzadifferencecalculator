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
const pizza1Slices = document.getElementById('pizza1Slices');
const pizza2Slices = document.getElementById('pizza2Slices');
const sliceSlider = document.getElementById('sliceSlider');
const outputTable = document.getElementById('outputTable');
const resetter = document.querySelectorAll('.resetter');
const themeToggle = document.getElementById('themeToggle');
let isLightMode = true;
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

themeToggle.addEventListener('click', function() {
    toggleTheme();
})

priceSlider.addEventListener('change', showPriceInput);
sliceSlider.addEventListener('change', showSlicesInput);

//
// Returns
//
const isValid = () => {
    const areSizesValid = checkValues(pizza1.value, pizza2.value);
    const arePricesValid = priceSlider.checked ? checkValues(pizza1Price.value, pizza2Price.value) : true;
    const areSlicesValid = sliceSlider.checked ? checkValues(pizza1Slices.value, pizza2Slices.value): true;
    let isValid = false;

    if (areSizesValid && arePricesValid && areSlicesValid) {
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
        price: Number(pizza1Price.value) || null,
        slices: Number(pizza1Slices.value) || null
    }
    const pizzaTwo = {
        size: Number(pizza2.value),
        price: Number(pizza2Price.value) || null,
        slices: Number(pizza2Slices.value) || null
    }

    return pizzaOne.size < pizzaTwo.size ? pizzaOne : pizzaTwo || null;
}

const largerPizza = () => {
    const pizzaOne = {
        size: Number(pizza1.value),
        price: Number(pizza1Price.value) || null,
        slices: Number(pizza1Slices.value) || null
    }
    const pizzaTwo = {
        size: Number(pizza2.value),
        price: Number(pizza2Price.value) || null,
        slices: Number(pizza2Slices.value) || null
    }

    return pizzaOne.size > pizzaTwo.size ? pizzaOne : pizzaTwo || null;
}

// const calculateBestDeal = (smallPizza, largePizza, smallPizzaPPSI, largePizzaPPSI) => {
//     let bestDealPizza = null;

//     if (smallPizzaPPSI > largePizzaPPSI) {
//         bestDealPizza = largePizza;
//         bestDealPizza.class = 'large';
//         bestDealPizza.PPSI = largePizzaPPSI;
//     } else {
//         bestDealPizza = smallPizza;
//         bestDealPizza.class = 'small';
//         bestDealPizza.PPSI = smallPizzaPPSI;
//     }

//     return bestDealPizza;
// }

const checkValues = (inputOne, inputTwo) => {
    const firstVal = Number(inputOne) || null;
    const secondVal = Number(inputTwo) || null;
    let isValid = false;

    if (firstVal && secondVal && firstVal > 0 && secondVal > 0) {
        isValid = true;

        error.innerHTML = '';
    } else if (firstVal && secondVal && (firstVal <= 0 || secondVal <= 0)) {
        error.innerHTML = 'Cannot enter values less than 0.';
    }

    return isValid;
}

const generatePPSIText = (smallPizzaPPSI, largePizzaPPSI) => {
    return `
        <div class='table-row'>
            <div class='table-data'>Square Inch</div>
            <div class="table-data ${smallPizzaPPSI < largePizzaPPSI ? 'best-deal' : ''}">$${smallPizzaPPSI}</div>
            <div class="table-data ${largePizzaPPSI < smallPizzaPPSI ? 'best-deal' : ''}">$${largePizzaPPSI}</div>
        </div>
    `;
}

const generatePPSText = (smallPizza, largePizza) => {
    const smallPizzaPPS = (smallPizza.price / smallPizza.slices).toFixed(2);
    const largePizzaPPS = (largePizza.price / largePizza.slices).toFixed(2);

    return `
        <div class='table-row'>
            <div class='table-data'>Slice</div>
            <div class="table-data">$${smallPizzaPPS}</div>
            <div class="table-data">$${largePizzaPPS}</div>
        </div>
    `;
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

    if (priceSlider.checked || sliceSlider.checked) {
        generatePizzaTable(smallPizza, largePizza, smallPizzaArea, largePizzaArea);
    }

    generatePizzaDiffText(smallPizza.size, largePizza.size, percentageDiff);
    output.scrollIntoView({ behavior: "smooth", block: "nearest" });
};

function generatePizzaTable(smallPizza, largePizza, smallPizzaArea, largePizzaArea) {
    const smallPizzaPPSI = (smallPizza.price / smallPizzaArea).toFixed(2);
    const largePizzaPPSI = (largePizza.price / largePizzaArea).toFixed(2);
    let PPSIHtml = priceSlider.checked ? generatePPSIText(smallPizzaPPSI, largePizzaPPSI) : '';
    let PPSHtml = sliceSlider.checked ? generatePPSText(smallPizza, largePizza) : '';

    output.innerHTML += `
        <div class='output-wrap'>
            <div class="output-title">
                <h2>Price Information</h2>
            </div>
            <div class='table'>
                <div class='table-row'>
                    <div class='table-head'>Price Per</div>
                    <div class='table-head'>${smallPizza.size} Inch Pizza</div>
                    <div class='table-head'>${largePizza.size} Inch Pizza</div>
                </div class='table-row'>
                ${PPSIHtml}
                ${PPSHtml}
            </div>
            <div class='table-key'>
                <div class='green-key'></div>
                <div>Best value per dollar</div>
            </div>
        </div>
    `
}

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

function createLastPizzaDiv(lastPizzaDegrees) {
    const bgColor = isLightMode ? `rgb(40, 40, 40)` : 'beige';

    if (lastPizzaDegrees !== 0) {
        delay += DELAYSPEED;
        const lastPizzaStyle = `background-image: conic-gradient(rgba(255, 255, 255, 0) ${lastPizzaDegrees}deg, ${bgColor} ${lastPizzaDegrees}deg), url('pizza.png');`;

            pizzaOutput.innerHTML += `
            <div class="pizza" style="${lastPizzaStyle} animation-delay: ${delay}ms"></div>
        `;
    }
}

function resetAll() {
    resetter.forEach((element) => {
        element.value = '';
    })
    output.innerHTML = '';
    pizzaOutput.innerHTML = '';
    resetDiv.classList.add('hide');
    submit.classList.add('invalid');
    delay = 0;
    pizza1.focus();
    pizza1.select();
}

function showPriceInput() {
    const pricePerInchOutput = document.getElementById('pricePerInchOutput') || null;

    if (priceSlider.checked || sliceSlider.checked) {
        pizza1Price.parentNode.classList.remove('hide');
        pizza2Price.parentNode.classList.remove('hide');

        if (pricePerInchOutput) {
            pricePerInchOutput.classList.remove('hide');
        }
    } else {
        pizza1Price.parentNode.classList.add('hide');
        pizza2Price.parentNode.classList.add('hide');

        if (pricePerInchOutput) {
            pricePerInchOutput.classList.add('hide');
        }
    }
}

function showSlicesInput() {
    const pricePerSliceOutput = document.getElementById('pricePerSliceOutput') || null;

    if (sliceSlider.checked) {
        pizza1Slices.parentNode.classList.remove('hide');
        pizza2Slices.parentNode.classList.remove('hide');

        if (pricePerSliceOutput) {
            pricePerSliceOutput.classList.remove('hide');
        }
    } else {
        pizza1Slices.parentNode.classList.add('hide');
        pizza2Slices.parentNode.classList.add('hide');

        if (pricePerSliceOutput) {
            pricePerSliceOutput.classList.add('hide');
        }
    }

    showPriceInput();
}

async function generatePizzas() {
    pizzaOutput.innerHTML = '';
    const remainder = totalPizzaDiff - Math.floor(totalPizzaDiff);
    const lastPizzaDegrees = 360 * remainder;

    await createPizzaDiv();
    await createLastPizzaDiv(lastPizzaDegrees);

    delay = 0;
}

function toggleTheme() {
    isLightMode = themeToggle.checked;

    if (isLightMode) {
        localStorage.removeItem('darkMode');
        document.body.classList.remove('dark-mode');
    } else {
        localStorage.setItem('darkMode', 'true');
        document.body.classList.add('dark-mode');
    }
}

function checkTheme() {
    console.log(localStorage.getItem('darkMode'));

    if (localStorage.getItem('darkMode')) {
        isLightMode = false;
        themeToggle.checked = false;
        document.body.classList.add('dark-mode');
    } else {
        themeToggle.checked = true;
        document.body.classList.remove('dark-mode');
    }
}

checkTheme();