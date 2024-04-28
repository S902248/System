const apiUrl = 'https://dbioz2ek0e.execute-api.ap-south-1.amazonaws.com/mockapi/get-employees';
const tableBody = document.getElementById('employee-table-body');
const departmentFilter = document.getElementById('department-filter');
const genderFilter = document.getElementById('gender-filter');
const sortFilter = document.getElementById('sort-filter');
const prevButton = document.getElementById('prev-page');
const nextButton = document.getElementById('next-page');

let currentPage = 1;
const limit = 10;
let totalEmployees = 0;
let totalPages = 0;
let currentData = [];

// Fetch employee data
async function fetchEmployees() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        totalEmployees = data.length;
        totalPages = Math.ceil(totalEmployees / limit);
        return data;
    } catch (error) {
        console.error('Error fetching employee data:', error);
        return [];
    }
}

// Populate table rows
async function populateTable() {
    tableBody.innerHTML = '';
    const employees = await fetchEmployees();
    currentData = employees;

    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    const displayedData = currentData.slice(startIndex, endIndex);

    displayedData.forEach((employee, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${startIndex + index + 1}</td>
            <td>${employee.name}</td>
            <td>${employee.gender}</td>
            <td>${employee.department}</td>
            <td>${employee.salary}</td>
        `;
        tableBody.appendChild(row);
    });

    updatePaginationButtons();
}

// Update pagination buttons
function updatePaginationButtons() {
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
}

// Event listener for previous page button
prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        populateTable();
    }
});

// Event listener for next page button
nextButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        populateTable();
    }
});

// Event listeners for filters
departmentFilter.addEventListener('change', () => {
    applyFilters();
});

genderFilter.addEventListener('change', () => {
    applyFilters();
});

sortFilter.addEventListener('change', () => {
    applySorting();
});

// Apply filters based on selected department and gender
function applyFilters() {
    const departmentValue = departmentFilter.value;
    const genderValue = genderFilter.value;

    let filteredData = currentData;

    if (departmentValue) {
        filteredData = filteredData.filter(employee => employee.department === departmentValue);
    }

    if (genderValue) {
        filteredData = filteredData.filter(employee => employee.gender === genderValue);
    }

    currentData = filteredData;
    currentPage = 1;
    populateTable();
}

// Apply sorting based on selected order
function applySorting() {
    const sortValue = sortFilter.value;

    let sortedData = currentData;

    if (sortValue === 'asc') {
        sortedData.sort((a, b) => a.salary - b.salary);
    } else if (sortValue === 'desc') {
        sortedData.sort((a, b) => b.salary - a.salary);
    }

    currentData = sortedData;
    currentPage = 1;
    populateTable();
}

// Initial population of the table
populateTable();
