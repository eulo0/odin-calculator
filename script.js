const display = document.querySelector(".display");
const numbers = document.querySelectorAll(".button-number");
const equals = document.querySelector(".button-equal");
const operators = document.querySelectorAll(".button-operator");
const clear = document.querySelector(".button-clear");
const erase = document.querySelector(".button-erase");
const decimal = document.querySelector(".button-decimal");

const numberKeys = "0123456789";
const operatorKeys = "/*+-";

var firstNumber = "ERROR";
var secondNumber = "ERROR";
var currentOperator = "ERROR";
var isResult = false; 
var secondNumberAvailable = false;

function add(x,y){
    return Number(x) + Number(y);
}

function subtract(x,y){
    return x - y;
}

function multiply(x,y){
    return x * y;
}

function divide(x,y){
    if (y == 0){
        firstNumber = "ERROR";
        secondNumber = "ERROR";
        currentOperator = "ERROR";
        return "Can't divide by Zero!"
    }
    return x / y;
}

function operate (x, y, op){
    isResult = true;
    switch(op){
        case "+":
            return add(x,y);
            break;
        case "-":
            return subtract(x,y);
            break;
        case "*":
            return multiply(x,y);
            break;
        case "/":
            return divide(x,y);
            break;
    }
}

numbers.forEach((number) => {
    number.addEventListener("click", () => {
        appendDisplay(number.textContent);
    });
});

operators.forEach((operator) => {
    operator.addEventListener("click", () => {
        setOperator(operator.textContent)
    });
});

equals.addEventListener("click", evaluate);

clear.addEventListener("click", clearDisplay);

erase.addEventListener("click", eraseDisplay);

decimal.addEventListener("click", addDecimalToDisplay);

document.addEventListener("keydown", (event) => {
    if (numberKeys.includes(event.key) && display.textContent.length < 17){
        appendDisplay(event.key);
    }
    else if (event.key === "Backspace"){
        eraseDisplay();
    }
    else if (event.key === "Delete"){
        clearDisplay();
    }
    else if (event.key === "."){
        addDecimalToDisplay();
    }
    else if (operatorKeys.includes(event.key)){
        setOperator(event.key);
    }
    else if (event.key === "Enter" || event.key === "="){
        evaluate();
    }
});

// Helper Functions 

function clearDisplay(){
    firstNumber = "ERROR";
    secondNumber = "ERROR";
    currentOperator = "ERROR";
    isResult = false;
    display.textContent = "";
}

function appendDisplay(number){
    if (isResult || secondNumberAvailable){
        display.textContent = "";
        isResult = false;
        secondNumberAvailable = false;
    }
    if (display.textContent.length < 17){
        display.textContent += number;
    }
}

function eraseDisplay(){
    var currentDisplay = display.textContent;
    if (currentDisplay !== "" && !isResult){
        display.textContent = currentDisplay.slice(0, currentDisplay.length-1);
    }
}

function addDecimalToDisplay(){
    if (!display.textContent.includes(".")){
        display.textContent += ".";
    }
}

function setOperator(operator){
    if (firstNumber === "ERROR" || currentOperator === "ERROR"){
        currentOperator = operator;
        firstNumber = display.textContent;
        secondNumberAvailable = true;
    }
    else if (isResult || secondNumberAvailable){
        currentOperator = operator
    }
    else{
        var nextOperator = operator;
        secondNumber = display.textContent;
        var result = operate(firstNumber, secondNumber, currentOperator);
        display.textContent = result;
        firstNumber = result; 
        currentOperator = nextOperator;
        secondNumber = "ERROR";
    }

    document.getElementById(operator).focus();
}

function evaluate(){
    if (secondNumber === "ERROR" || display.textContent !== ""){
        secondNumber = display.textContent;
    }
    if (firstNumber !== "ERROR" || secondNumber !== "ERROR" || currentOperator !== "ERROR"){
        var result = operate(firstNumber, secondNumber, currentOperator);
        display.textContent = result;
        firstNumber = result;
        secondNumber = "ERROR";
        currentOperator = "ERROR";
    }
}

