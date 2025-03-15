// PixelArtMaker.ts

class PixelArtMaker {
    // Member variables.
    // Width and Height of the grid
    private height: number;
    private width: number;
    // color picker element to select colors
    private colorPicker: HTMLInputElement;
    // table element to create a grid using height and width input values
    private pixelCanvas: HTMLTableElement;
    // element for errors
    private errorDisplay: HTMLDivElement;
    // initial state
    private gridBackup: string = '';

    constructor() {
        // Initialize DOM elements
        this.colorPicker = document.getElementById('colorPicker') as HTMLInputElement;
        this.pixelCanvas = document.getElementById('pixel_canvas') as HTMLTableElement;
        this.errorDisplay = document.getElementById('error') as HTMLDivElement;
        this.height = 0;
        this.width = 0;

        // Initialize the backup state
        this.gridBackup = this.pixelCanvas.innerHTML;

        // Set up event listeners
        this.setupEventListeners();
    }

    // Set up event listeners
    private setupEventListeners(): void {
        // Canvas cell events (using event delegation)
        document.addEventListener('mousedown', (event: MouseEvent): void => {
            const target = event.target as HTMLElement;
            if (target.tagName === 'TD') {
                this.handleCellClick(target);
            }
        });

        // Double click to reset cell
        document.addEventListener('dblclick', (event: MouseEvent): void => {
            const target = event.target as HTMLElement;
            if (target.tagName === 'TD') {
                target.style.backgroundColor = '#FFFFFF';
            }
        });
    }

    private handleCellClick(cell: HTMLElement): void {
        // get value from the color picker element
        const colorValue = this.colorPicker.value;
        // color the passed cell background with the color value
        cell.style.backgroundColor = colorValue;

        // Set up drag coloring
        const handleMouseMove = (e: MouseEvent) => {
            // get current target element when user starts drawing with mouse move
            const moveTarget = e.target as HTMLElement;
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

    public makeGrid(): void {
        // Clear the canvas
        this.pixelCanvas.innerHTML = '';

        // Get dimensions from inputs
        const heightInput = document.getElementById('input_height') as HTMLInputElement;
        const widthInput = document.getElementById('input_width') as HTMLInputElement;
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
    public restoreBackup(): void {
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
