// This is the corrected script for your student dashboard.
const BACKEND_URL = 'http://127.0.0.1:5500';

// ===== QUESTION SETS =====
const PHQ = [
  { q:"1. Little interest or pleasure", opts:["Not at all (0)","Several days (1)","More than half the days (2)","Nearly every day (3)"]},
  { q:"2. Feeling down, depressed, hopeless", opts:["Not at all (0)","Several days (1)","More than half the days (2)","Nearly every day (3)"]},
  { q:"3. Trouble with sleep", opts:["Not at all (0)","Several days (1)","More than half the days (2)","Nearly every day (3)"]},
  { q:"4. Feeling tired or having little energy", opts:["Not at all (0)","Several days (1)","More than half the days (2)","Nearly every day (3)"]},
  { q:"5. Poor appetite or overeating", opts:["Not at all (0)","Several days (1)","More than half the days (2)","Nearly every day (3)"]},
  { q:"6. Feeling bad about yourself", opts:["Not at all (0)","Several days (1)","More than half the days (2)","Nearly every day (3)"]},
  { q:"7. Trouble concentrating", opts:["Not at all (0)","Several days (1)","More than half the days (2)","Nearly every day (3)"]},
  { q:"8. Moving/speaking slowly or being restless", opts:["Not at all (0)","Several days (1)","More than half the days (2)","Nearly every day (3)"]},
  { q:"9. Thoughts of self-harm", opts:["Not at all (0)","Several days (1)","More than half the days (2)","Nearly every day (3)"], safety:true}
];
const GAD = [
  { q:"1. Feeling nervous, anxious, on edge", opts:["Not at all (0)","Several days (1)","More than half the days (2)","Nearly every day (3)"]},
  { q:"2. Can't stop or control worrying", opts:["Not at all (0)","Several days (1)","More than half the days (2)","Nearly every day (3)"]},
  { q:"3. Worrying too much", opts:["Not at all (0)","Several days (1)","More than half the days (2)","Nearly every day (3)"]},
  { q:"4. Trouble relaxing", opts:["Not at all (0)","Several days (1)","More than half the days (2)","Nearly every day (3)"]},
  { q:"5. Being restless", opts:["Not at all (0)","Several days (1)","More than half the days (2)","Nearly every day (3)"]},
  { q:"6. Easily annoyed or irritable", opts:["Not at all (0)","Several days (1)","More than half the days (2)","Nearly every day (3)"]},
  { q:"7. Feeling afraid or awful", opts:["Not at all (0)","Several days (1)","More than half the days (2)","Nearly every day (3)"]}
];

// --- Functions to interact with the backend ---

async function fetchHealthData() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/health`);
        const data = await response.json();
        if (response.ok) {
            document.getElementById('hrValue').textContent = data.heartRate ? data.heartRate.toFixed(1) : 'N/A';
            document.getElementById('spo2Value').textContent = data.spo2 ? data.spo2.toFixed(1) : 'N/A';
            document.getElementById('googleFitBtn').textContent = 'Refresh Data';
        } else {
            console.error('Failed to fetch health data:', data.error);
        }
    } catch (error) {
        console.error('Network error fetching health data:', error);
    }
}

async function generateGeminiInsight(payload) {
    const aiSummaryEl = document.getElementById('aiSummary');
    aiSummaryEl.innerHTML = 'Generating your personalized insight...';
    try {
        const response = await fetch(`${BACKEND_URL}/api/gemini_insight`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        const data = await response.json();
        let insightHTML = `<p>${data.insight}</p>`;
        if (data.tips && data.tips.length > 0) {
            insightHTML += `<div class="action-footer"><p><b>Actionable Tip:</b> ${data.tips.join(' ')}</p><a href="/resources?phq=${payload.phqTotal}&gad=${payload.gadTotal}" class="btn">View Personalized Resources →</a></div>`;
        }
        aiSummaryEl.innerHTML = insightHTML;
    } catch (error) {
        console.error('Error fetching Gemini insight:', error);
        aiSummaryEl.innerHTML = 'Sorry, an error occurred. Please try again.';
    }
}

// --- UI and Data Handling ---

function readScores(containerId) {
    let total = 0;
    const selects = document.querySelectorAll(`#${containerId} select`);
    const answers = Array.from(selects).map(s => {
        const val = s.value ? Number(s.value) : null;
        if (val !== null) total += val;
        return val;
    });
    return { total, answers };
}

function runAnalysis() {
    const phqResult = readScores("phqQs");
    const gadResult = readScores("gadQs");
    
    document.getElementById('phqTotal').textContent = phqResult.total;
    document.getElementById('gadTotal').textContent = gadResult.total;
    
    const safetyEl = document.getElementById('phqSafety');
    const phq9Flag = phqResult.answers[8] > 0;
    safetyEl.textContent = phq9Flag ? "Flagged" : "OK";
    safetyEl.className = phq9Flag ? "band bad" : "band ok";

    const payload = {
        phqTotal: phqResult.total,
        gadTotal: gadResult.total,
        phq9Flag: phq9Flag,
        physioNotes: ['Heart Rate', 'Blood Oxygen from Google Fit']
    };
    generateGeminiInsight(payload);
}

// ===== CORRECTED QUESTIONNAIRE RENDERING FUNCTION =====

function makeBlock(qset, mountId){
    const mountEl = document.getElementById(mountId);
    if (!mountEl) {
        console.error(`Error: Element with ID "${mountId}" not found.`);
        return;
    }
    mountEl.innerHTML = ""; // Clear any previous content
    qset.forEach((item)=>{
        const sel = document.createElement("select");
        // Create the options for the dropdown
        sel.innerHTML = item.opts.map(opt => {
            const scoreMatch = opt.match(/\((\d)\)/);
            if (!scoreMatch) return ''; // Skip if option has no score
            const score = scoreMatch[1];
            const text = opt.replace(/\s\(.+\)/, '');
            return `<option value="${score}">${text}</option>`;
        }).join('');
        
        // Create the label for the dropdown
        const label = document.createElement("label");
        label.className = "muted";
        label.textContent = item.q;
        label.appendChild(sel);
        
        mountEl.appendChild(label);
    });
}

function initialize() {
    // This function runs when the page loads
    makeBlock(PHQ, 'phqQs'); // Create the PHQ-9 questions
    makeBlock(GAD, 'gadQs'); // Create the GAD-7 questions
    
    document.getElementById('analyzeBtn').addEventListener('click', runAnalysis);
    document.getElementById('googleFitBtn').addEventListener('click', () => {
        window.open(`${BACKEND_URL}/auth/google`, '_blank');
        alert('Please complete authorization in the new tab. You can then refresh your data here.');
    });
    fetchHealthData();
}

// Run the initialization
initialize();