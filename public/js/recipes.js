let recipes = [];
const recipesPerPage = 20;
let currentPage = 1;
let activeFilters = []; // To store search terms for dynamic filters

document.addEventListener('DOMContentLoaded', () => {
    // On page load, check if the URL contains a page number and a query
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query'); // Get the search query from the URL
    const page = parseInt(urlParams.get('page')) || 1; // Get the page number or default to 1
    const sortBy = urlParams.get('sortBy'); // Get sortBy parameter from the URL
    const sortDirection = urlParams.get('sortDirection'); // Get sortDirection from the URL
    const filters = urlParams.getAll('filters'); // Get filters from the URL
    checkUser();

    currentPage = page; // Set the current page based on URL parameter

    // If filters exist in the URL, populate activeFilters
    activeFilters = filters;

    if (sortBy && sortDirection) {
        // Retain the selected sort option in the dropdown
        document.getElementById('sortOptions').value = `${sortBy}_${sortDirection.toLowerCase()}`;
    }

    if (query) {
        document.getElementById('searchInput').value = query; // Set search input value
        searchRecipes(query); // If there's a search query, perform the search
    } else {
        getRecipes(); // Otherwise, load all recipes
    }

    document.getElementById('searchInput').addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            searchRecipes();
        }
    });
    document.getElementById('searchButton').addEventListener('click', function (event) {
        searchRecipes(); // Execute the search
    });
    document.getElementById('sortOptions').addEventListener('change', function () {
        const selectedSort = this.value;
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('query'); // Get the search query

        // If "Default" is selected
        if (selectedSort === 'default') {
            this.value = 'default';
            // Remove only sortBy and sortDirection, but keep the query
            urlParams.delete('sortBy');
            urlParams.delete('sortDirection');

            // If a query exists, make sure it's preserved in the URL
            if (query) {
                urlParams.set('query', query); // Ensure query remains in the URL
            }

            const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
            history.pushState({}, '', newUrl); // Remove all parameters
            getRecipes(); // Reset the displayed recipes
            return;
        }

        let sortBy = 'default';
        let sortDirection = 'ASC';

        // Update sortBy and sortDirection based on selection
        switch (selectedSort) {
            case 'name_asc':
                sortBy = 'name';
                sortDirection = 'ASC';
                break;
            case 'name_desc':
                sortBy = 'name';
                sortDirection = 'DESC';
                break;
            case 'serving_size_asc':
                sortBy = 'serving_size';
                sortDirection = 'ASC';
                break;
            case 'serving_size_desc':
                sortBy = 'serving_size';
                sortDirection = 'DESC';
                break;
            default:
                sortBy = null; // For "Default", reset to null
                break;
        }

        // Update URL parameters only if sortBy is not null
        if (sortBy) {
            urlParams.set('sortBy', sortBy);
            urlParams.set('sortDirection', sortDirection);
        }

        // If a query exists, ensure it is still part of the URL
        if (query) {
            urlParams.set('query', query);
        }

        const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
        history.pushState({ sortBy, sortDirection, page: currentPage }, '', newUrl); // Update the URL without reloading

        getRecipes();

    });

    // Restore filters from URL and check corresponding boxes
    if (filters.length > 0) {
        activeFilters = filters;
        updateFilterOptions(recipes, filters);
        getRecipes(); // Fetch recipes again based on the updated filters
    }

});

function getRecipes() {
    const urlParams = new URLSearchParams(window.location.search);
    const sortBy = urlParams.get('sortBy') || null; // Get sortBy from URL
    const sortDirection = urlParams.get('sortDirection') || null; // Get sortDirection from URL
    const query = urlParams.get('query') || null; // Get search query from URL
    const filters = urlParams.getAll('filters'); // Get filters from URL
    const page = currentPage || 1; // Ensure the current page is set
    const limit = recipesPerPage || 20; // Set the limit to 20 by default

    // Fetch sorted and/or filtered recipes based on query and sort parameters
    let fetchUrl = `/recipes/sorted/${page}/${limit}`;
    if (query) {
        fetchUrl += `?query=${encodeURIComponent(query)}`;
    }
    if (sortBy) {
        fetchUrl += `${query ? '&' : '?'}sortBy=${sortBy}&sortDirection=${sortDirection}`;
    }
    if (filters.length > 0) {
        fetchUrl += `${sortBy || query ? '&' : '?'}filters=${filters.join(',')}`;
    }

    // Log the fetch URL to see the constructed request
    console.log('Fetching recipes from URL:', fetchUrl);

    fetch(fetchUrl)
        .then(response => response.json())
        .then(data => {
            recipes = data; // Store fetched recipes
            displayRecipes(currentPage); // Display them on the page
            setupPagination(); // Setup pagination
            updateFilterOptions(recipes, filters);
        })
        .catch(error => console.error('Error fetching recipes:', error));
}

function displayRecipes(page) {
    const list = document.getElementById('recipeContainer');
    if (!list) {
        console.error("Element with id 'recipeContainer' not found");
        return;
    }

    // Clear any previous content
    list.innerHTML = '';

    // Calculate the start and end index for slicing the recipes array
    const startIndex = (page - 1) * recipesPerPage;
    const endIndex = Math.min(startIndex + recipesPerPage, recipes.length);
    const recipesToDisplay = recipes.slice(startIndex, endIndex);

    if (recipesToDisplay.length === 0) {
        list.innerHTML = '<p>No recipes found matching your search.</p>'; // Inform the user if no recipes found
        return;
    }

    // Array of image URLs
    const images = [
        'img/food-1.jpg',
        'img/food-2.jpg',
        'img/food-3.jpg',
        'img/food-4.jpg'
    ];

    recipesToDisplay.forEach((recipe, index) => {
        const item = document.createElement('div');
        item.classList.add('col-xl-3', 'col-lg-4', 'col-md-6', 'wow', 'fadeInUp');
        item.setAttribute('data-wow-delay', '0.1s');

        const imageUrl = images[(startIndex + index) % images.length]; // Use index based on the current page

        item.innerHTML = `
            <div class="product-item">
                <div class="position-relative bg-light overflow-hidden">
                    <div class="bg-secondary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">New</div>
                </div>
                <div class="text-center p-4">
                    <img class="img-fluid w-100" src="${imageUrl}" alt="">
                    <a class="d-block h5 mb-2" href="">${recipe.name}</a>
                    <span class="text-primary me-1">${recipe.serving_size}</span>
                    <span class="text-body">${recipe.servings}</span>
                </div>
                <div class="d-flex border-top">
                    <small class="w-100 text-center py-2">
                        <a class="text-body" href="details.html?id=${recipe.recipe_id}"><i class="fa fa-eye text-primary me-2"></i>View detail</a>
                    </small>
                </div>

            </div>
        `;

        list.appendChild(item);
    });
}

function setupPagination() {
    const paginationContainer = document.getElementById('paginationContainer');
    paginationContainer.innerHTML = ''; // Clear any previous content

    const totalPages = Math.ceil(recipes.length / recipesPerPage);
    if (totalPages === 0) {
        paginationContainer.innerHTML = '<p>No results to display.</p>'; // Handle case where there are no results
        return;
    }
    const maxButtonsToShow = 10; // Maximum number of page buttons to display
    const ellipsis = '...';

    // Helper function to create a pagination button
    const createButton = (pageNum, isActive = false) => {
        const button = document.createElement('a');
        button.classList.add('py-3', 'px-5', 'paginationButton');
        if (isActive) {
            button.classList.add('active'); // Add active class for the current page
        }
        button.innerText = pageNum;
        button.href = '#'; // Prevent default link behavior
        button.addEventListener('click', (e) => {
            //e.preventDefault(); // Prevent page jump
            currentPage = pageNum; // Update current page
            displayRecipes(currentPage); // Display recipes for the current page

            // Update pagination display
            setupPagination();

            // Update the URL with the new page number
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set('page', pageNum); // Set the new page parameter
            const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
            history.pushState({ page: pageNum }, '', newUrl); // Update the URL without reloading
        });
        return button;
    };

    // Show first page button
    paginationContainer.appendChild(createButton(1, currentPage === 1));

    if (totalPages > maxButtonsToShow) {
        // Check if currentPage is near the start
        if (currentPage < 5) {
            // Show pages 2-10
            for (let i = 2; i <= Math.min(maxButtonsToShow, totalPages); i++) {
                paginationContainer.appendChild(createButton(i, currentPage === i));
            }
        } else if (currentPage > totalPages - 4) {
            // Show pages totalPages-9 to totalPages-1
            for (let i = Math.max(totalPages - maxButtonsToShow + 1, 2); i < totalPages; i++) {
                paginationContainer.appendChild(createButton(i, currentPage === i));
            }
        } else {
            // Show pages currentPage-4 to currentPage+5
            for (let i = currentPage - 4; i <= currentPage + 5; i++) {
                if (i > 1 && i < totalPages) {
                    paginationContainer.appendChild(createButton(i, currentPage === i));
                }
            }
        }

        // Add ellipsis
        paginationContainer.appendChild(document.createTextNode(ellipsis));

        // Show the last page button
        paginationContainer.appendChild(createButton(totalPages, currentPage === totalPages));
    } else {
        // If total pages are less than or equal to maxButtonsToShow, show all page numbers
        for (let i = 2; i <= totalPages; i++) {
            paginationContainer.appendChild(createButton(i, currentPage === i));
        }
    }
}

function updateFilterOptions(recipes, filters) {
    const filterMenu = document.getElementById('filterMenu');
    filterMenu.innerHTML = ''; // Clear existing filter options

    // Get unique search terms from the recipes and create filter options
    const searchTermSet = new Set();
    recipes.forEach(recipe => {
        if (recipe.search_terms) {
            recipe.search_terms.split(',').forEach(term => searchTermSet.add(term.trim()));
        }
    });

    // Convert the Set to an Array and sort it alphabetically
    const sortedTerms = Array.from(searchTermSet).sort((a, b) => a.localeCompare(b));

    // Create checkboxes for each unique, sorted search term
    sortedTerms.forEach(term => {
        const li = document.createElement('li');
        li.innerHTML = `<a class="dropdown-item"><input type="checkbox" class="filter-checkbox" value="${term}"> ${term}</a>`;
        filterMenu.appendChild(li);
    });

    // Retain checked state for filters from URL
    filters.forEach(filter => {
        const checkbox = document.querySelector(`.filter-checkbox[value="${filter}"]`);
        if (checkbox) checkbox.checked = true;
    });
}

// Function to populate filter menu based on searched recipes
function useFilterOptions() {
    const selectedFilters = [...document.querySelectorAll('.filter-checkbox:checked')]
        .map(checkbox => checkbox.value);

    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('page', 1); // Reset to first page when filters are applied

    // Update URL parameters with selected filters
    selectedFilters.forEach(filter => {
        urlParams.append('filters', filter); // Add each filter as a URL parameter
    });

    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    history.pushState({}, '', newUrl); // Update the URL without reloading

    // Fetch and display filtered recipes
    filterRecipes(selectedFilters);
}

function filterRecipes(selectedFilters) {
    const query = document.getElementById('searchInput').value.trim();
    const fetchUrl = `/search?query=${encodeURIComponent(query)}&page=${currentPage}`;

    // Append filters to fetch URL
    if (selectedFilters.length > 0) {
        fetchUrl += `&filters=${selectedFilters.join('&filters=')}`; // Concatenate filters
    }

    fetch(fetchUrl)
        .then(response => response.json())
        .then(data => {
            recipes = data; // Store fetched recipes
            displayRecipes(currentPage); // Display recipes for the current page
            setupPagination(); // Setup pagination buttons
        })
        .catch(error => {
            console.error('Error fetching filtered recipes:', error);
        });
}

function searchRecipes(query) {
    const searchInput = document.getElementById('searchInput').value.trim();
    const searchQuery = query || searchInput; // Use the query from URL or input field

    // Check if the search query has changed to reset the current page to 1
    const urlParams = new URLSearchParams(window.location.search);
    const currentQuery = urlParams.get('query');
    const sortBy = urlParams.get('sortBy'); // Default to 'name'
    const sortDirection = urlParams.get('sortDirection'); // Default to 'ASC'
    const selectedFilters = [...document.querySelectorAll('#filterMenu input:checked')].map(input => input.value);
    activeFilters = selectedFilters;

    if (searchQuery && searchQuery !== currentQuery) {
        currentPage = 1; // Reset to the first page for a new search
    }

    // Combine search and sort when fetching the recipes
    let fetchUrl = `/search?query=${encodeURIComponent(searchQuery)}&page=${currentPage}`;

    // Include sorting parameters if they exist
    if (sortBy) {
        fetchUrl += `&sortBy=${sortBy}&sortDirection=${sortDirection}`;
    }

    if (activeFilters.length > 0) {
        fetchUrl += `&filters=${encodeURIComponent(activeFilters.join(','))}`;
    }

    // Log the fetch URL to see the constructed request
    console.log('Fetching recipes from URL:', fetchUrl);

    fetch(fetchUrl)
        .then(response => response.json())
        .then(data => {
            recipes = data; // Store fetched recipes
            displayRecipes(currentPage); // Display recipes for the current page
            setupPagination(); // Setup pagination buttons
            updateFilterOptions(recipes, activeFilters);

            // Update the URL parameters
            urlParams.set('query', searchQuery);
            urlParams.set('page', currentPage);
            if (activeFilters.length > 0) {
                urlParams.set('filters', activeFilters.join(','));
            } else {
                urlParams.delete('filters');
            }

            const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
            history.pushState({ query: searchQuery, page: currentPage, filters: activeFilters }, '', newUrl);
        })
        .catch(error => {
            console.error('Error fetching recipes:', error);
        });

    // Update the URL with both search query and sorting options
    urlParams.set('query', searchQuery); // Set the new query parameter
    urlParams.set('page', currentPage); // Update the page parameter
    if (sortBy) {
        urlParams.set('sortBy', sortBy); // Retain the sortBy parameter
        urlParams.set('sortDirection', sortDirection); // Retain the sortDirection parameter
        const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
        history.pushState({ query: searchQuery, page: currentPage, sortBy, sortDirection }, '', newUrl); // Update the URL without reloading
    }

    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    history.pushState({ query: searchQuery, page: currentPage }, '', newUrl); // Update the URL without reloading
}

function checkUser() {
    fetch('/check-session', {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            const plannerNav = document.getElementById('planner_nav');
            const userLink = document.getElementById('user-link');
            if (data.loggedIn) {
                // User is logged in, set the href to planner.html
                plannerNav.setAttribute('href', 'planner.html');
                userLink.setAttribute('href', 'dashboard.html');
                currentUser = data.user.id; // Store the current user ID
            } else {
                // User is not logged in, set the href to login.html
                plannerNav.setAttribute('href', 'login.html');
                userLink.setAttribute('href', 'login.html');
            }
        })
        .catch(error => {
            console.error('Error checking session:', error);
        });
}