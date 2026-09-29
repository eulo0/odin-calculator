const display = document.querySelector(".display");
const numbers = document.querySelectorAll(".button-number");
const equals = document.querySelector(".button-equal");
const operators = document.querySelectorAll(".button-operator");
const clear = document.querySelector(".button-clear");
const erase = document.querySelector(".button-erase");
const decimal = document.querySelector(".button-decimal");

const numberKeys = "0123456789";
const operatorKeys = "/*+-";
const divideZeroMsg = "Can't divide by Zero!"

// the empty strings set for these variables indicate that they are invalid values. This convention is also 
// used for comparisons elsewhere in the code
var focussedOperator = "";              // HTML element corresponding to an operator that is currently focussed (for keyboard support)
var firstNumber = "";
var secondNumber = "";
var currentOperator = "";  
var isResult = false;                   // flag for displaying results 
var secondNumberAvailable = false;      // flag for user to start typing second number 
var secondNumberTyped = false;          // flag that sees if the second number is already typed 

// Basic math functions 
function add(x,y){
    return Number(x) + Number(y);       // converted to a number first otherwise it would be concatenated as a string
}

function subtract(x,y){
    return x - y;
}

function multiply(x,y){
    return x * y;
}

function divide(x,y){
    if (y === "0"){
        firstNumber = "";
        secondNumber = "";
        currentOperator = "";
        isResult = false;
        return divideZeroMsg; 
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

// Button logic functions 

function clearDisplay(){         
    firstNumber = "";
    secondNumber = "";
    currentOperator = "";  
    isResult = false;                   
    secondNumberAvailable = false;      
    secondNumberTyped = false;           
    display.textContent = "";

}

function appendDisplay(number){
    // when the result is calculated or user is typing second number, set the flags off and wipe the display
    if (isResult || secondNumberAvailable){
        display.textContent = "";
        isResult = false;
        secondNumberAvailable = false;
        secondNumberTyped = true;
        focussedOperator.blur();
    }
    // makes sure the input is within the range of the calculator 
    if (display.textContent.length < 17){
        display.textContent += number;
    }
}

function eraseDisplay(){
    var currentDisplay = display.textContent;
    // erases the last character whenever its not empty or if its not a result showing 
    if (currentDisplay !== "" && !isResult){
        display.textContent = currentDisplay.slice(0, currentDisplay.length-1);
    }
}

function addDecimalToDisplay(){
    if (!display.textContent.includes("." && display.textContent !== divideZeroMsg)){
        display.textContent += ".";
    }
}

// for any operator being pressed 
function setOperator(operator){
    // sets firstNumber and currentOperator when they're not set yet
    if (firstNumber === "" || currentOperator === ""){
        currentOperator = operator;
        firstNumber = display.textContent;
        secondNumberAvailable = true;
    }
    // just changes the operator if the user is seeing a result or before typing the second number 
    // the last equality check is to handle an edge case to allow operator to be changed around when the display is empty
    else if (isResult || secondNumberAvailable || display.textContent === ""){
        currentOperator = operator
    }
    // for handling the case: 2 + 2 - (which would calculate 2+2, store it as the firstNumber, then
    // store - as the currentOperator). makes sure that the display is not empty before doing so.
    else if (display.textContent !== ""){
        var nextOperator = operator;
        secondNumber = display.textContent;
        var result = operate(firstNumber, secondNumber, currentOperator);
        display.textContent = sanitizeResult(result);
        firstNumber = result; 
        currentOperator = nextOperator;
        secondNumber = "";
        secondNumberTyped = false;
    }
    focussedOperator = document.getElementById(operator);
    focussedOperator.focus();
}

// used whenever = is called 
function evaluate(){
    // sets the second number if not already set
    if (display.textContent !== "" && secondNumberTyped){
        secondNumber = display.textContent;
        secondNumberTyped = false;
    }
    // only runs evaluage whenever all three variables have proper values
    if (firstNumber !== "" && secondNumber !== "" && currentOperator !== ""){
        var result = operate(firstNumber, secondNumber, currentOperator);
        display.textContent = sanitizeResult(result);
        firstNumber = result;
        secondNumber = "";
        currentOperator = "";
        secondNumberTyped = false;
    }
}

// Helper Function
function sanitizeResult(result){
    // rounds to the 0.0000000001th digit
    if (Number.isFinite(result)){
        return Math.round(result * 10000000000) / 10000000000
    }
    // just returns the result if its the divide by zero message. here, display.textContent isn't just set to the
    // message because it would be wiped after sanitizeResult() is called in evaluate()
    else if (result === divideZeroMsg){
        return result;
    }
}