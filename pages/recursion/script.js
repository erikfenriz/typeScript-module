"use strict";
// Fibonacci sequence is a sequence in which each element is
// the sum of the two elements that precede it
function fibonacci(n) {
    if (n <= 1)
        return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}
// This function is called from the DOM element to display fibonacci sequence
function startFibonacci() {
    // Setup. Get information from input and use output div to populate the results
    const inputElement = document.getElementById("fibInput");
    const outputElement = document.getElementById("fibOutput");
    // Get value from the input and convert it to integer if possible
    const num = parseInt(inputElement.value);
    // If the value turned out to be non-numeric or value is less than one,
    // show a message and drop out of function by using return keyword
    if (isNaN(num) || num < 1) {
        outputElement.innerHTML = "<p>Please enter a valid number (≥1).</p>";
        return;
    }
    // If condition passes, clear previous results to prepare for the new sequence
    outputElement.innerHTML = "";
    // Incrementally call fibonacci function.
    // Use 0 as base number and increment up to the input value
    for (let i = 0; i <= num; i++) {
        // setTimeout is a built-in browser function that delays function call
        setTimeout(() => {
            // incrementally call fibonacci to start from 0 and go up to a defined upper limit
            const fibNumber = fibonacci(i);
            // create box div element that will get placed into the DOM
            const box = document.createElement("div");
            // add class name to the newly created div (css styles are already defined)
            box.classList.add("fib-box");
            // use HTML div element textContent property to set the number
            box.textContent = `${fibNumber}`;
            // append the div box element to the div with id fibOutput
            outputElement.appendChild(box);
            // Delay for animation-like effect
            // by using incremental delay that increases equally for each number
        }, i * 500);
    }
}
