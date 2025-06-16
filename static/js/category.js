const categoryData = {
    distill: {
        'Pivotal Reasoning': 15.0,
        'Productive Elaboration & Calculation': 40.0,
        'Exploring Alternatives': 10.7,
        'Verification & Self-Correction': 23.3,
        'Non-Substantive Statement': 10.9
    },
    shorter: {
        'Pivotal Reasoning': 30.6,
        'Productive Elaboration & Calculation': 46.8,
        'Exploring Alternatives': 6.8,
        'Verification & Self-Correction': 9.2,
        'Non-Substantive Statement': 6.6
    }
};

const categoryDefinitions = {
    'Pivotal Reasoning': 'Steps that directly correspond to a specific part of the final solution.',
    'Productive Elaboration & Calculation': 'Necessary calculations, deductions, or planning that support a pivotal step but are not restated in the final summary.',
    'Exploring Alternatives': 'Attempts to try different approaches or check other methods, even if they are not used in the final solution.',
    'Verification & Self-Correction': 'Checks and corrections of earlier results to catch errors.',
    'Non-Substantive Statement': 'Redundant comments, filler, or trivial rephrasing that does not advance the solution.'
};

const colors = {
    'Pivotal Reasoning': '#7fb3d3',
    'Productive Elaboration & Calculation': '#f4a261',
    'Exploring Alternatives': '#90c695',
    'Verification & Self-Correction': '#f76c6c',
    'Non-Substantive Statement': '#c8a2c8'
};

function createPieChart(svgId, data) {
    const svg = document.getElementById(svgId);
    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2 - 10;
    const centerX = width / 2;
    const centerY = height / 2;

    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    let currentAngle = -Math.PI / 2; // Start at top

    Object.entries(data).forEach(([category, percentage]) => {
        const angle = (percentage / 100) * 2 * Math.PI;
        const endAngle = currentAngle + angle;

        const x1 = centerX + radius * Math.cos(currentAngle);
        const y1 = centerY + radius * Math.sin(currentAngle);
        const x2 = centerX + radius * Math.cos(endAngle);
        const y2 = centerY + radius * Math.sin(endAngle);

        const largeArc = angle > Math.PI ? 1 : 0;

        const pathData = [
            'M', centerX, centerY,
            'L', x1, y1,
            'A', radius, radius, 0, largeArc, 1, x2, y2,
            'Z'
        ].join(' ');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        path.setAttribute('fill', colors[category]);
        path.setAttribute('stroke', 'white');
        path.setAttribute('stroke-width', '2');
        path.style.cursor = 'pointer';
        path.style.transition = 'all 0.3s ease';

        // Add text label
        const labelAngle = currentAngle + angle / 2;
        const labelRadius = radius * 0.75;
        const labelX = centerX + labelRadius * Math.cos(labelAngle);
        const labelY = centerY + labelRadius * Math.sin(labelAngle);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', labelX);
        text.setAttribute('y', labelY);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('fill', 'white');
        text.setAttribute('font-size', '14');
        text.setAttribute('font-weight', 'bold');
        text.textContent = `${percentage.toFixed(1)}%`;
        text.style.pointerEvents = 'none';

        // Add interactivity
        path.addEventListener('mouseenter', (e) => {
            path.style.transform = 'scale(1.05)';
            path.style.transformOrigin = `${centerX}px ${centerY}px`;
            path.style.filter = 'brightness(1.1)';
            showTooltip(e, category, percentage, true);
        });

        path.addEventListener('mouseleave', () => {
            path.style.transform = 'scale(1)';
            path.style.filter = 'none';
            hideTooltip();
        });

        path.addEventListener('mousemove', (e) => {
            updateTooltipPosition(e);
        });

        svg.appendChild(path);
        if (percentage > 5) { // Only show label if slice is large enough
            svg.appendChild(text);
        }

        currentAngle = endAngle;
    });
}

function showTooltip(event, category, percentage, showDefinition = false) {
    const tooltip = document.getElementById('tooltip');
    let content = `${category}: ${percentage !== undefined ? percentage.toFixed(1) + '%' : ''}`;
    if (showDefinition && categoryDefinitions[category]) {
        content += `\n${categoryDefinitions[category]}`;
    }
    tooltip.textContent = content;
    tooltip.style.opacity = '1';
    updateTooltipPosition(event);
}

function updateTooltipPosition(event) {
    const tooltip = document.getElementById('tooltip');
    tooltip.style.left = (event.pageX + 10) + 'px';
    tooltip.style.top = (event.pageY - 30) + 'px';
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.style.opacity = '0';
}

// Legend interactivity
function addLegendInteractivity() {
    const legendItems = document.querySelectorAll('.legend-item');
    
    legendItems.forEach(item => {
        const category = item.dataset.category;
        const categoryName = getLegendCategoryName(category);
        item.addEventListener('mouseenter', (e) => {
            // Highlight corresponding segments in both charts
            const allPaths = document.querySelectorAll('path');
            allPaths.forEach(path => {
                const pathColor = path.getAttribute('fill');
                const categoryColor = getCategoryColor(category);
                if (pathColor === categoryColor) {
                    path.style.filter = 'brightness(1.2)';
                    path.style.transform = 'scale(1.05)';
                } else {
                    path.style.opacity = '0.6';
                }
            });
            // Show definition tooltip
            showTooltip(e, categoryName, undefined, true);
        });
        
        item.addEventListener('mouseleave', () => {
            const allPaths = document.querySelectorAll('path');
            allPaths.forEach(path => {
                path.style.filter = 'none';
                path.style.transform = 'scale(1)';
                path.style.opacity = '1';
            });
            hideTooltip();
        });
        item.addEventListener('mousemove', (e) => {
            updateTooltipPosition(e);
        });
    });
}

function getLegendCategoryName(category) {
    switch (category) {
        case 'pivotal': return 'Pivotal Reasoning';
        case 'elaboration': return 'Productive Elaboration & Calculation';
        case 'alternatives': return 'Exploring Alternatives';
        case 'verification': return 'Verification & Self-Correction';
        case 'nonsubstantive': return 'Non-Substantive Statement';
        default: return category;
    }
}

function getCategoryColor(category) {
    const categoryMap = {
        'pivotal': colors['Pivotal Reasoning'],
        'elaboration': colors['Productive Elaboration & Calculation'],
        'alternatives': colors['Exploring Alternatives'],
        'verification': colors['Verification & Self-Correction'],
        'nonsubstantive': colors['Non-Substantive Statement']
    };
    return categoryMap[category];
}

// Initialize charts
document.addEventListener('DOMContentLoaded', () => {
    createPieChart('distill-chart', categoryData.distill);
    createPieChart('shorter-chart', categoryData.shorter);
    addLegendInteractivity();
});