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
    
    // Update DOM elements
    document.getElementById('year-display').textContent = `${year} Progress`;
    document.getElementById('progress-bar').style.width = `${percentage}%`;

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
            }
        }, 50);
    }

    document.getElementById('days-count').textContent = 
        `${dayOfYear} days passed • ${totalDays - dayOfYear} days remaining`;
    
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
        
    // Update time visualization
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const totalMinutes = hours * 60 + minutes + seconds / 60;
    
    document.querySelector('.passed-time').style.flex = 
        `${(totalMinutes / (24 * 60)) * 100}%`;
    document.querySelector('.current-marker').style.left = 
        `${(totalMinutes / (24 * 60)) * 100}%`;
}

// Update initially
updateProgress();

// Update every second
setInterval(updateProgress, 1000);