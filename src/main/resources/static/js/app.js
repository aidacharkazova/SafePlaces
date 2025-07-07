// app.js

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path.includes('index.html') || path === '/') {
        setupHomePage();
    } else if (path.includes('createLocation.html')) {
        setupCreateLocationPage();
    } else if (path.includes('locationDetails.html')) {
        setupLocationDetailsPage();
    }
});

// --- Home Page Logic ---
function setupHomePage() {
    const searchForm = document.getElementById('searchForm');
    const searchResultsDiv = document.getElementById('searchResults');

    if (searchForm) {
        searchForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            searchResultsDiv.innerHTML = '<p>Searching...</p>';

            const type = document.getElementById('type').value;
            const minRating = document.getElementById('minRating').value;
            const addressQuery = document.getElementById('addressQuery').value;

            const params = new URLSearchParams();
            if (type) params.append('type', type);
            if (minRating) params.append('minRating', minRating);
            if (addressQuery) params.append('address', addressQuery);

            const url = `${API_BASE_URL}/locations?${params.toString()}`;

            try {
                const locations = await fetchData(url);
                displayLocations(locations);
            } catch (error) {
                searchResultsDiv.innerHTML = `<p class="error-message">${error.message || 'Failed to fetch locations.'}</p>`;
            }
        });

        // Initial load of all locations
        loadAllLocations();
    }

    async function loadAllLocations() {
        try {
            const locations = await fetchData(`${API_BASE_URL}/locations`);
            displayLocations(locations);
        } catch (error) {
            searchResultsDiv.innerHTML = `<p class="error-message">${error.message || 'Failed to load initial locations.'}</p>`;
        }
    }

    function displayLocations(locations) {
        searchResultsDiv.innerHTML = ''; // Clear previous results
        if (locations && locations.length > 0) {
            locations.forEach(location => {
                const locationItem = document.createElement('div');
                locationItem.className = 'location-item';
                locationItem.innerHTML = `
                    <div class="location-details">
                        <h3>${location.name}</h3>
                        <p>Address: ${location.address}</p>
                        <p>Type: ${location.type}</p>
                        <p>Rating: ${location.averageRating ? location.averageRating.toFixed(1) : 'N/A'} (${location.reviewCount || 0} reviews)</p>
                    </div>
                    <div class="location-actions">
                        <a href="locationDetails.html?id=${location.id}">View Details & Reviews</a>
                    </div>
                `;
                searchResultsDiv.appendChild(locationItem);
            });
        } else {
            searchResultsDiv.innerHTML = '<p>No locations found matching your criteria.</p>';
        }
    }
}

// --- Create Location Page Logic ---
function setupCreateLocationPage() {
    const createLocationForm = document.getElementById('createLocationForm');
    const messageDiv = document.getElementById('message');

    if (createLocationForm) {
        createLocationForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            hideMessage(messageDiv);

            const name = document.getElementById('name').value;
            const address = document.getElementById('address').value;
            const type = document.getElementById('type').value;
            // const latitude = parseFloat(document.getElementById('latitude').value);
            // const longitude = parseFloat(document.getElementById('longitude').value);
            const amenitiesInput = document.getElementById('amenities').value;
            const amenities = amenitiesInput ? amenitiesInput.split(',').map(a => a.trim()).filter(a => a) : [];

            const newLocation = {
                name,
                address,
                type,
                // latitude,
                // longitude,
                amenities
            };

            try {
                const createdLocation = await postData(`${API_BASE_URL}/locations`, newLocation);
                displayMessage(`Location "${createdLocation.name}" added successfully!`, 'success', messageDiv);
                createLocationForm.reset(); // Clear the form
            } catch (error) {
                displayMessage(error.message || 'Failed to add location.', 'error', messageDiv);
            }
        });
    }
}

// --- Location Details Page Logic ---
function setupLocationDetailsPage() {
    const locationNameElem = document.getElementById('locationName');
    const locationAddressElem = document.getElementById('locationAddress');
    const locationTypeElem = document.getElementById('locationType');
   // const locationCoordsElem = document.getElementById('locationCoords');
    const locationAmenitiesElem = document.getElementById('locationAmenities');
    const locationRatingElem = document.getElementById('locationRating');
    const locationReviewCountElem = document.getElementById('locationReviewCount');
    const locationNotFoundElem = document.getElementById('locationNotFound');
    const reviewsListDiv = document.getElementById('reviewsList');
    const noReviewsMessage = document.getElementById('noReviewsMessage');
    const createReviewForm = document.getElementById('createReviewForm');
    const reviewMessageDiv = document.getElementById('reviewMessage');
    const safetyFeaturesCheckboxesDiv = document.getElementById('safetyFeaturesCheckboxes');

    const urlParams = new URLSearchParams(window.location.search);
    const locationId = urlParams.get('id');

    if (!locationId) {
        locationNotFoundElem.style.display = 'block';
        return;
    }

    // Populate safety features checkboxes
    if (safetyFeaturesCheckboxesDiv) {
        SafetyFeatures.forEach(feature => {
            const div = document.createElement('div');
            const checkboxId = `sf-${feature}`;
            div.innerHTML = `
                <input type="checkbox" id="${checkboxId}" name="safetyFeatures" value="${feature}">
                <label for="${checkboxId}">${feature.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}</label>
            `;
            safetyFeaturesCheckboxesDiv.appendChild(div);
        });
    }


    loadLocationDetails(locationId);
    loadReviews(locationId);

    async function loadLocationDetails(id) {
        try {
            const location = await fetchData(`${API_BASE_URL}/locations/${id}`);
            console.log("Fetched Location Data:", location);
            console.log("Review Count from fetched data:", location.reviewCount);
            console.log("Average Rating from fetched data:", location.averageRating);

            locationNameElem.textContent = location.name;
            locationAddressElem.textContent = location.address;
            locationTypeElem.textContent = location.type;
            // locationCoordsElem.textContent = `${location.latitude}, ${location.longitude}`;
            locationAmenitiesElem.textContent = location.amenities && location.amenities.length > 0 ? location.amenities.join(', ') : 'N/A';
            locationRatingElem.textContent = location.averageRating ? location.averageRating.toFixed(1) : 'N/A';
            locationReviewCountElem.textContent = location.reviewCount || 0;

            locationNotFoundElem.style.display = 'none';
        } catch (error) {
            locationNotFoundElem.textContent = error.message || 'Location details could not be loaded.';
            locationNotFoundElem.style.display = 'block';
            console.error('Failed to load location details:', error);
        }
    }

    async function loadReviews(id) {
        reviewsListDiv.innerHTML = ''; // Clear previous reviews
        noReviewsMessage.style.display = 'none';
        try {
            const reviews = await fetchData(`${API_BASE_URL}/reviews/locationId/${id}`);
            if (reviews && reviews.length > 0) {
                reviews.forEach(review => {
                    const reviewItem = document.createElement('div');
                    reviewItem.className = 'review-item';
                    reviewItem.innerHTML = `
                        <div class="review-content">
                            <p><strong>User:</strong> ${review.userName || 'Anonymous'}</p>
                            <p><strong>Rating:</strong> ${review.rating}/5</p>
                            <p><strong>Comment:</strong> ${review.comment || 'No comment provided.'}</p>
                            <p><strong>Safety Features:</strong> ${review.safetyFeatures && review.safetyFeatures.length > 0 ? review.safetyFeatures.map(f => f.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())).join(', ') : 'None'}</p>
                            <p class="review-date">Reviewed on: ${formatDateTime(review.createdAt)}</p>
                        </div>
                    `;
                    reviewsListDiv.appendChild(reviewItem);
                });
            } else {
                noReviewsMessage.style.display = 'block';
            }
        } catch (error) {
            reviewsListDiv.innerHTML = `<p class="error-message">${error.message || 'Failed to load reviews.'}</p>`;
            noReviewsMessage.style.display = 'none';
        }
    }

    if (createReviewForm) {
        createReviewForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            hideMessage(reviewMessageDiv);

            const userName = document.getElementById('userName').value;
            const rating = parseInt(document.getElementById('rating').value);
            const comment = document.getElementById('comment').value;

            const selectedSafetyFeatures = Array.from(document.querySelectorAll('input[name="safetyFeatures"]:checked'))
                .map(checkbox => checkbox.value);

            const newReview = {
                locationId: locationId,
                userId: "tempUser123", // TODO: In a real application, replace with actual logged-in user ID
                userName: userName,
                rating: rating,
                comment: comment,
                safetyFeatures: selectedSafetyFeatures
            };

            try {
                const createdReview = await postData(`${API_BASE_URL}/reviews`, newReview);
                displayMessage('Review submitted successfully!', 'success', reviewMessageDiv);
                createReviewForm.reset(); // Clear the form
                // Uncheck all safety features
                document.querySelectorAll('input[name="safetyFeatures"]:checked').forEach(checkbox => {
                    checkbox.checked = false;
                });
                loadReviews(locationId); // Reload reviews to show the new one
                loadLocationDetails(locationId);

            } catch (error) {
                displayMessage(error.message || 'Failed to submit review.', 'error', reviewMessageDiv);
            }
        });

    }
}