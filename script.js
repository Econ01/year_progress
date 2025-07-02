// Confetti effect for milestones
function triggerConfetti() {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    
    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        
        if (timeLeft <= 0) {
            return clearInterval(interval);
        }
        
        const particleCount = 50 * (timeLeft / duration);
        
        // Front confetti
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        
        // Back confetti
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
    }, 250);
}

// Milestone notification
function showMilestone(message) {
    const notification = document.getElementById('milestone-notification');
    const milestoneText = document.getElementById('milestone-text');
    
    milestoneText.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Share progress function
function shareProgress() {
    const percentage = document.getElementById('percentage').textContent;
    const year = new Date().getFullYear();
    const text = `Check out the year progress! We're ${percentage} through ${year}.\n`;
    const url = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: 'Year Progress',
            text: text,
            url: url
        }).catch(console.error);
    } else {
        navigator.clipboard.writeText(text + url);
        showMilestone('Link copied to clipboard!');
    }
}

// Main progress update function
function updateProgress() {
    // Get current date
    const now = new Date();
    
    // Get current year
    const year = now.getFullYear();
    
    // Check if leap year
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const totalDays = isLeapYear ? 366 : 365;
    
    // Calculate day of year (1-366)
    const start = new Date(year, 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    // Calculate progress percentage
    const percentage = ((dayOfYear / totalDays) * 100).toFixed(4);
    const percentageNum = parseFloat(percentage);
    
    // Update DOM elements
    document.getElementById('year-display').textContent = `${year} Progress`;
    document.getElementById('progress-bar').style.width = `${percentage}%`;
    document.getElementById('progress-percentage').textContent = `${percentage}%`;

    const percElement = document.getElementById('percentage');
    let currentPerc = parseFloat(percElement.textContent);
    const targetPerc = parseFloat(percentage);

    if (currentPerc !== targetPerc) {
        const increment = (targetPerc - currentPerc) / 10;
        const counter = setInterval(() => {
            currentPerc += increment;
            percElement.textContent = `${currentPerc.toFixed(4)}%`;
            if (Math.abs(targetPerc - currentPerc) < 0.01) {
                clearInterval(counter);
                percElement.textContent = `${targetPerc.toFixed(4)}%`;
                
                // Check for milestones
                const milestones = [25, 50, 75, 90, 99];
                if (milestones.includes(Math.floor(percentageNum))) {
                    triggerConfetti();
                    showMilestone(`${Math.floor(percentageNum)}% of the year!`);
                }
            }
        }, 50);
    }

    document.getElementById('days-count').innerHTML = 
        `<div><span class="days-highlight">${dayOfYear} days</span> passed</div>
         <div><span class="days-highlight">${totalDays - dayOfYear} days</span> remaining</div>`;
    
    // Update date/time
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    };
    
    // Format date and time separately
    const dateStr = now.toLocaleDateString('en-US', options);
    const timeStr = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    
    // Get timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Update separate elements
    document.getElementById('current-date').textContent = dateStr.split(',')[0] + ', ' + 
                                                        dateStr.split(',')[1] + ', ' + 
                                                        dateStr.split(',')[2].split(' at')[0];
    document.getElementById('current-time').textContent = timeStr;
    document.getElementById('timezone').textContent = timezone;
    
    document.getElementById('date-time').textContent = 
        `As of: ${dateStr}`;
}

// Update initially
updateProgress();

// Update every second
setInterval(updateProgress, 1000);