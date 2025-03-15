"use strict";
// PixelArtMaker.ts
class PixelArtMaker {
    constructor() {
        // initial state
        this.gridBackup = '';
        // Initialize DOM elements
        this.colorPicker = document.getElementById('colorPicker');
        this.pixelCanvas = document.getElementById('pixel_canvas');
        this.errorDisplay = document.getElementById('error');
        this.height = 0;
        this.width = 0;
        // Initialize the backup state
        this.gridBackup = this.pixelCanvas.innerHTML;
        // Set up event listeners
        this.setupEventListeners();
    }
    // Set up event listeners
    setupEventListeners() {
        // Canvas cell events (using event delegation)
        document.addEventListener('mousedown', (event) => {
            const target = event.target;
            if (target.tagName === 'TD') {
                this.handleCellClick(target);
            }
        });
        // Double click to reset cell
        document.addEventListener('dblclick', (event) => {
            const target = event.target;
            if (target.tagName === 'TD') {
                target.style.backgroundColor = '#FFFFFF';
            }
        });
    }
    handleCellClick(cell) {
        // get value from the color picker element
        const colorValue = this.colorPicker.value;
        // color the passed cell background with the color value
        cell.style.backgroundColor = colorValue;
        // Set up drag coloring
        const handleMouseMove = (e) => {
            // get current target element when user starts drawing with mouse move
            const moveTarget = e.target;
            if (moveTarget.tagName === 'TD') {
                moveTarget.style.backgroundColor = colorValue;
            }
        };
        // Add mousemove event
        document.addEventListener('mousemove', handleMouseMove);
        // Remove mousemove event on mouseup
        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', handleMouseMove);
        }, { once: true });
    }
    makeGrid() {
        // Clear the canvas
        this.pixelCanvas.innerHTML = '';
        // Get dimensions from inputs
        const heightInput = document.getElementById('input_height');
        const widthInput = document.getElementById('input_width');
        // Set input values into member variables
        this.height = parseInt(heightInput.value);
        this.width = parseInt(widthInput.value);
        // Validate dimensions
        if (this.height > 50 || this.width > 50 || this.height < 1 || this.width < 1) {
            if (!this.errorDisplay.classList.contains('error')) {
                // Show error and reset Pixel Canvas
                this.errorDisplay.classList.add('error');
                this.errorDisplay.innerText = 'The dimension has to be smaller than 50 and bigger than 0';
                this.restoreBackup();
            }
            return;
        }
        // Clear error message
        this.errorDisplay.innerText = '';
        this.errorDisplay.classList.remove('error');
        // Create grid
        const table = document.createElement('tbody');
        for (let x = 0; x < this.height; x++) {
            const row = document.createElement('tr');
            for (let y = 0; y < this.width; y++) {
                const cell = document.createElement('td');
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
        this.pixelCanvas.appendChild(table);
        // Update backup
        this.gridBackup = this.pixelCanvas.innerHTML;
    }
    // Pixel Canvas reset function
    restoreBackup() {
        this.pixelCanvas.innerHTML = this.gridBackup;
    }
}
// Initialize the app
window.onload = () => {
    const pixelArtMaker = new PixelArtMaker();
    // Set up button click events
    const submitButton = document.getElementById('submit');
    if (submitButton) {
        submitButton.addEventListener('click', () => pixelArtMaker.makeGrid());
    }
    const resetButton = document.querySelector('button[type="reset"]');
    if (resetButton) {
        resetButton.addEventListener('click', () => pixelArtMaker.restoreBackup());
    }
};
