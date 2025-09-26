document.addEventListener('DOMContentLoaded', () => {
    // Get the query parameters from the URL
    const params = new URLSearchParams(window.location.search);
    const phqScore = parseInt(params.get('phq'), 10);
    const gadScore = parseInt(params.get('gad'), 10);

    const recommendationText = document.getElementById('recommendationText');
    
    if (isNaN(phqScore) || isNaN(gadScore)) {
        recommendationText.textContent = "Explore the resources below to learn about mental wellness strategies and where to find support.";
        return;
    }

    // Determine the primary focus based on scores
    let focus = "maintaining wellness";
    let highestScore = Math.max(phqScore, gadScore);
    let primaryConcern = phqScore >= gadScore ? "depressive symptoms" : "anxiety";
    let severity = "mild";

    if (highestScore >= 15) {
        severity = "severe";
        focus = `managing severe ${primaryConcern}`;
    } else if (highestScore >= 10) {
        severity = "moderate";
        focus = `managing moderate ${primaryConcern}`;
    } else if (highestScore >= 5) {
        focus = `addressing mild ${primaryConcern}`;
    }

    // Update the recommendation card text
    recommendationText.innerHTML = `Your scores suggest a primary focus on <b>${focus}</b>. Based on this, we've highlighted the most relevant sections for you below.`;

    // Highlight relevant sections
    highlightSection('lifestyleSection'); // Foundational for everyone

    if (severity === 'severe' || severity === 'moderate') {
        highlightSection('professionalSection', true);
        highlightSection('selfHelpSection');
    } else if (severity === 'mild') {
        highlightSection('selfHelpSection', true);
    }
});

function highlightSection(sectionId, isPrimary = false) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('recommended-section');
        if (isPrimary) {
            const title = section.querySelector('.h2');
            const badge = document.createElement('span');
            badge.className = 'chip';
            badge.textContent = 'Recommended Starting Point';
            badge.style.marginLeft = '12px';
            title.appendChild(badge);
        }
    }
}