document.addEventListener('DOMContentLoaded', () => {
    // MOCK DATA: In a real application, this data would be fetched from a secure backend API.
    const weeklyTrendsData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
        phqScores: [10.2, 9.8, 11.1, 10.5, 9.9, 10.8],
        gadScores: [9.5, 9.9, 10.2, 9.6, 9.2, 9.8],
    };

    const concernsData = {
        labels: ['Moderate Depression', 'Mild Anxiety', 'Academic Stress', 'Sleep Issues', 'Minimal Symptoms'],
        values: [25, 35, 18, 12, 10],
    };

    const resourcesData = {
        labels: ['Relaxation Audio', 'Sleep Guides', 'Stress Management', 'Counsellor Info'],
        values: [45, 30, 18, 7],
    };

    // Chart 1: Overall Wellness Trends
    new Chart(document.getElementById('trendsChart'), {
        type: 'line',
        data: {
            labels: weeklyTrendsData.labels,
            datasets: [
                { label: 'Avg. PHQ-9 Score', data: weeklyTrendsData.phqScores, borderColor: 'var(--warn)', tension: 0.2, backgroundColor: 'rgba(217, 119, 6, 0.1)', fill: true },
                { label: 'Avg. GAD-7 Score', data: weeklyTrendsData.gadScores, borderColor: 'var(--accent)', tension: 0.2, backgroundColor: 'rgba(79, 70, 229, 0.1)', fill: true }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    // Chart 2: Key Concern Areas
    new Chart(document.getElementById('concernsChart'), {
        type: 'doughnut',
        data: {
            labels: concernsData.labels,
            datasets: [{
                data: concernsData.values,
                backgroundColor: ['#d97706', '#4f46e5', '#059669', '#64748b', '#e2e8f0'],
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    });

    // Chart 3: Resource Engagement
    new Chart(document.getElementById('resourcesChart'), {
        type: 'bar',
        data: {
            labels: resourcesData.labels,
            datasets: [{
                label: 'Clicks this month',
                data: resourcesData.values,
                backgroundColor: '#dbeafe',
                borderColor: 'var(--accent)',
                borderWidth: 1
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, indexAxis: 'y' }
    });
});