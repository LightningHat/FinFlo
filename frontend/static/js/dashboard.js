// Fetch user details from localStorage
const userName = localStorage.getItem('userName');
const userEmail = localStorage.getItem('userEmail');
const userPicture = localStorage.getItem('userPicture');

// Display user details on the dashboard
document.getElementById('userName').textContent = userName;
document.getElementById('dashboardUserName').textContent = userName;
document.getElementById('dashboardUserEmail').textContent = userEmail;
document.getElementById('userPicture').src = userPicture;

// Example: Render a spending chart using Chart.js
const ctx = document.getElementById('spendingChart').getContext('2d');
const spendingChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Food', 'Shopping', 'Travel', 'Bills', 'Entertainment'],
        datasets: [{
            label: 'Spending',
            data: [500, 300, 200, 150, 100],
            backgroundColor: [
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
            ],
        }]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Monthly Spending'
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});