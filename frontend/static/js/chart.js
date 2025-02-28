// Helper function to group transactions by category
function groupByCategory(transactions) {
    const categories = {};
    transactions.forEach(transaction => {
        const category = transaction.category;
        if (!categories[category]) {
            categories[category] = 0;
        }
        categories[category] += transaction.amount;
    });
    return categories;
}

// Helper function to group transactions by date
function groupByDate(transactions) {
    const dates = {};
    transactions.forEach(transaction => {
        const date = new Date(transaction.date).toLocaleDateString();
        if (!dates[date]) {
            dates[date] = 0;
        }
        dates[date] += transaction.amount;
    });
    return dates;
}

// Helper function to group transactions by month
function groupByMonth(transactions) {
    const months = {};
    transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const month = date.toLocaleString('default', { month: 'long' }) + ' ' + date.getFullYear();
        if (!months[month]) {
            months[month] = 0;
        }
        months[month] += transaction.amount;
    });
    return months;
}

// Create Pie Chart for Categories
function createCategoryChart() {
    const categoryData = groupByCategory(transactions);
    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(categoryData),
            datasets: [{
                data: Object.values(categoryData),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
                    '#9966FF', '#FF9F40', '#FFCD56'
                ],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Spending by Category'
                }
            }
        }
    });
}

// Create Line Chart for Spending Over Time
function createTimelineChart() {
    const dateData = groupByDate(transactions);
    const ctx = document.getElementById('timelineChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: Object.keys(dateData),
            datasets: [{
                label: 'Amount Spent',
                data: Object.values(dateData),
                borderColor: '#36A2EB',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Spending Over Time'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Create Bar Chart for Monthly Spending
function createMonthlyChart() {
    const monthData = groupByMonth(transactions);
    const ctx = document.getElementById('monthlyChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(monthData),
            datasets: [{
                label: 'Monthly Spending',
                data: Object.values(monthData),
                backgroundColor: '#4BC0C0',
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
}

// Initialize all charts
document.addEventListener('DOMContentLoaded', () => {
    createCategoryChart();
    createTimelineChart();
    createMonthlyChart();
});