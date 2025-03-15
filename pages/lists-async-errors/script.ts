// Define interface for Dog API response structure
interface DogResponse {
    message: string;    // URL to dog image
    status: string;     // Status of the API response
}

// Define interface for a Dog object
interface Dog {
    url: string;        // URL to dog image
    fetchedAt: Date;    // Timestamp when the dog was fetched
}

// Store document reference in a shorter variable
const d: Document = document;

// Get DOM elements for dog section
const getDog = d.getElementById("btn-dog") as HTMLButtonElement;      // Button to fetch random dog
const dogImage = d.getElementById("dog-image") as HTMLImageElement;   // Image element for dog picture
const dogGallery = d.getElementById("dog-gallery") as HTMLDivElement; // Container for all fetched dogs

// Create an array to store all fetched dogs
const dogsArray: Dog[] = [];

// Helper function to handle HTTP errors in fetch responses
function handleErrors(request: Response): Response {
    if (!request.ok) {
        throw Error(request.status.toString());  // Convert status code to string and throw as error
    }
    return request;  // Return the response if no errors
}

// Function to add a new dog to the array and display it in the gallery
function addDogToGallery(dogUrl: string): void {
    // Create a new Dog object
    const newDog: Dog = {
        url: dogUrl,
        fetchedAt: new Date()
    };

    // Add the dog to our array
    dogsArray.push(newDog);

    // Create DOM elements for the new dog
    const dogContainer = document.createElement('div');
    dogContainer.className = 'dog-container';

    // Create and set up the image element
    const dogImg = document.createElement('img');
    dogImg.src = dogUrl;
    dogImg.alt = `Dog ${dogsArray.length}`;
    dogImg.className = 'gallery-dog-image';

    // Create and set up the info element
    const dogInfo = document.createElement('div');
    dogInfo.className = 'dog-info';
    dogInfo.textContent = `Dog #${dogsArray.length} - Fetched at: ${newDog.fetchedAt.toLocaleTimeString()}`;

    // Append elements to container
    dogContainer.appendChild(dogImg);
    dogContainer.appendChild(dogInfo);

    // Append container to gallery
    dogGallery.appendChild(dogContainer);

    // Log the current array to console for debugging
    console.log('Current dogs array:', dogsArray);

    // Update the stats section
    updateDogStats();
}

// Function to update the statistics about fetched dogs
function updateDogStats(): void {
    const statsElement = d.getElementById('dog-stats') as HTMLDivElement;

    // Only update if the element exists
    if (statsElement) {
        statsElement.innerHTML = `
            <h3>Dog Gallery Stats</h3>
            <p>Total dogs fetched: ${dogsArray.length}</p>
            <p>First dog fetched at: ${dogsArray.length > 0 ? dogsArray[0].fetchedAt.toLocaleString() : 'N/A'}</p>
            <p>Latest dog fetched at: ${dogsArray.length > 0 ? dogsArray[dogsArray.length - 1].fetchedAt.toLocaleString() : 'N/A'}</p>
        `;
    }
}

// Add click event listener for random dog button
getDog.addEventListener("click", function(): void {
    // API endpoint for random dog image
    const url: string = "https://dog.ceo/api/breeds/image/random";

    // Fetch data from the dog API
    fetch(url)
        .then(handleErrors)  // Handle HTTP errors first
        .then(function(response: Response): Promise<void> {
            // Parse the JSON response and update the dog image
            return response.json().then(function(data: DogResponse): void {
                // Set current dog image
                dogImage.src = data.message;

                // Add this dog to our gallery and array
                addDogToGallery(data.message);
            });
        })
        .catch(function(error: Error): void {
            console.log(error);  // Log any errors that occur
        });
});

// Initialize page - create gallery and stats containers if they don't exist
window.addEventListener('DOMContentLoaded', function(): void {
    // Create dog gallery container if it doesn't exist
    if (!dogGallery) {
        const newGallery = document.createElement('div');
        newGallery.id = 'dog-gallery';
        newGallery.className = 'dog-gallery';

        const galleryTitle = document.createElement('h2');
        galleryTitle.textContent = 'Dog Gallery';
        galleryTitle.className = 'gallery-title';

        document.body.appendChild(galleryTitle);
        document.body.appendChild(newGallery);
    }

    // Create dog stats container if it doesn't exist
    if (!d.getElementById('dog-stats')) {
        const statsContainer = document.createElement('div');
        statsContainer.id = 'dog-stats';
        statsContainer.className = 'dog-stats';
        document.body.appendChild(statsContainer);

        // Initialize stats
        updateDogStats();
    }
});
