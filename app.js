document.addEventListener('DOMContentLoaded', function () {

    // Constants for accessing Contentful data
    const SPACE_ID = 'jfrq7us7g4od';
    const ACCESS_TOKEN = '7FqtTec07V5rJtMe9ZgHMtwt0NY6SyjfgJcgIdACgLU';

    const cardsContainer = document.querySelector('#content');
    const monthFilters = document.querySelectorAll('input[name="month"]');
    const timeOfDayFilters = document.querySelectorAll('input[name="timeOfDay"]');

    // Function to fetch and display data from Contentful
    async function fetchData() {
        try {
            const response = await fetch(`https://cdn.contentful.com/spaces/${SPACE_ID}/environments/master/entries?access_token=${ACCESS_TOKEN}`);
            const data = await response.json();

            // Sort items in descending order
            const sortedItems = data.items.sort((a, b) => new Date(b.fields.date) - new Date(a.fields.date));

            displayData(sortedItems);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function displayData(items) {
        cardsContainer.innerHTML = '';  // clear any existing cards

        items.forEach(item => {
            const formattedDateTime = formatDateTime(item.fields.date);

            const colDiv = document.createElement('div');
            colDiv.className = 'col-12 col-sm-12 col-md-3 col-lg-2 mb-4';

            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <p>${item.fields.description}</p>
                <div class="date-wrapper">
                    <p>${formattedDateTime.date}</p>
                    <p>${formattedDateTime.time}</p>
                </div>
            `;

            if (shouldDisplayCard(formattedDateTime)) {
                colDiv.appendChild(card);
                cardsContainer.appendChild(colDiv);
            }
        });
    }

    function shouldDisplayCard(dateTime) {
        const selectedMonth = document.querySelector('input[name="month"]:checked').value;
        const selectedTimeOfDay = document.querySelector('input[name="timeOfDay"]:checked').value;

        if (selectedMonth !== "all" && parseInt(selectedMonth) !== dateTime.month) {
            return false;
        }

        if (selectedTimeOfDay === "morning" && dateTime.hours >= 12) {
            return false;
        } else if (selectedTimeOfDay === "night" && dateTime.hours < 12) {
            return false;
        }

        return true;
    }

    // Function to format the date and time
    function formatDateTime(dateTimeString) {
        const dateTime = new Date(dateTimeString);
        const day = dateTime.getDate();
        const month = dateTime.getMonth();
        const hours = dateTime.getHours();
        const minutes = String(dateTime.getMinutes()).padStart(2, '0');        

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthName = monthNames[month];

        return {
            date: `${day} ${monthName}`,
            time: `${hours}:${minutes}`,
            month,
            hours
        };
    }

    // Add event listeners for the filters
    monthFilters.forEach(filter => filter.addEventListener('change', () => fetchData()));
    timeOfDayFilters.forEach(filter => filter.addEventListener('change', () => fetchData()));

    // Call fetchData immediately after the DOM is fully loaded
    fetchData();
});
