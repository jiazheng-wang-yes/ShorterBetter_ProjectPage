const data = [
    { name: 'AMC', shorter: 0.32, distill: 0.47 },
    { name: 'Math', shorter: 0.39, distill: 0.59 },
    { name: 'Olympiad', shorter: 0.37, distill: 0.54 },
    { name: 'Minerva', shorter: 0.45, distill: 0.64 }
];

function createChart() {
    const chart = document.getElementById('chart');
    const maxValue = Math.max(...data.flatMap(d => [d.shorter, d.distill]));
    
    data.forEach((benchmark, index) => {
        const group = document.createElement('div');
        group.className = 'benchmark-group';
        
        const barsContainer = document.createElement('div');
        barsContainer.className = 'bars-container';
        
        // Create ShorterBetter bar
        const shorterBar = document.createElement('div');
        shorterBar.className = 'bar bar-shorter';
        const shorterHeight = (benchmark.shorter / maxValue) * 380;
        shorterBar.style.height = `${shorterHeight}px`;
        
        const shorterLabel = document.createElement('div');
        shorterLabel.className = 'value-label';
        shorterLabel.textContent = benchmark.shorter.toFixed(2);
        shorterBar.appendChild(shorterLabel);
        
        // Create Distill bar
        const distillBar = document.createElement('div');
        distillBar.className = 'bar bar-distill';
        const distillHeight = (benchmark.distill / maxValue) * 380;
        distillBar.style.height = `${distillHeight}px`;
        
        const distillLabel = document.createElement('div');
        distillLabel.className = 'value-label';
        distillLabel.textContent = benchmark.distill.toFixed(2);
        distillBar.appendChild(distillLabel);
        
        barsContainer.appendChild(shorterBar);
        barsContainer.appendChild(distillBar);
        
        const label = document.createElement('div');
        label.className = 'benchmark-label';
        label.textContent = benchmark.name;
        
        group.appendChild(barsContainer);
        group.appendChild(label);
        chart.appendChild(group);
        
        // Add staggered animation delay
        setTimeout(() => {
            shorterBar.style.animationDelay = `${index * 0.2}s`;
            distillBar.style.animationDelay = `${index * 0.2 + 0.1}s`;
        }, 100);
    });
}

// Add interactive effects
function addInteractivity() {
    const bars = document.querySelectorAll('.bar');
    bars.forEach(bar => {
        bar.addEventListener('mouseenter', () => {
            bars.forEach(otherBar => {
                if (otherBar !== bar) {
                    otherBar.style.opacity = '0.7';
                }
            });
        });
        
        bar.addEventListener('mouseleave', () => {
            bars.forEach(otherBar => {
                otherBar.style.opacity = '1';
            });
        });
    });
}

// Initialize the chart
document.addEventListener('DOMContentLoaded', () => {
    createChart();
    setTimeout(addInteractivity, 1500);
}); 