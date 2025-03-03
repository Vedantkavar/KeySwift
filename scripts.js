// Theme dropdown functionality
const themeToggle = document.getElementById('theme-toggle');
const themeDropdown = document.getElementById('theme-dropdown');
const themeOptions = document.querySelectorAll('.theme-option');
const styleSheet = document.getElementById('theme-css');

// Performance optimization: Cache current theme
let currentTheme = styleSheet.getAttribute('href').replace('.css', '');

// Set initial selected state based on current theme
function updateSelectedState() {
    themeOptions.forEach(option => {
        // Check if this option matches current theme
        const isSelected = option.getAttribute('data-theme') === currentTheme;
        option.classList.toggle('selected', isSelected);
    });
}

// Initialize selected state
updateSelectedState();

// Toggle dropdown visibility
themeToggle.addEventListener('click', function(e) {
    e.stopPropagation(); // Prevent event bubbling
    themeDropdown.classList.toggle('show');
});

// Handle theme selection with improved performance
themeOptions.forEach(option => {
    option.addEventListener('click', function() {
        const selectedTheme = this.getAttribute('data-theme');
        
        // Only change if theme is actually different
        if (selectedTheme !== currentTheme) {
            // Update stylesheet href
            styleSheet.setAttribute('href', selectedTheme + '.css');
            
            // Update current theme cache
            currentTheme = selectedTheme;
            
            // Update selection indicators efficiently
            themeOptions.forEach(opt => 
                opt.classList.toggle('selected', opt === this)
            );
            
            // Update the button data attribute for CSS
            const themeName = this.textContent.trim();
            themeToggle.setAttribute('data-current-theme', themeName);
        }
        
        themeDropdown.classList.remove('show');
    });
});

// Close dropdown when clicking outside - use event delegation
document.addEventListener('click', function(event) {
    if (themeDropdown.classList.contains('show') && 
        !themeToggle.contains(event.target) && 
        !themeDropdown.contains(event.target)) {
        themeDropdown.classList.remove('show');
    }
});

// Optimize CSS transitions by applying them only when needed
document.addEventListener('DOMContentLoaded', function() {
    // Preload CSS files to improve switching performance
    themeOptions.forEach(option => {
        const theme = option.getAttribute('data-theme');
        if (theme !== currentTheme) {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = theme + '.css';
            document.head.appendChild(link);
        }
    });
});