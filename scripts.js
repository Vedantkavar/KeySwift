// Theme dropdown functionality
const themeToggle = document.getElementById('theme-toggle');
const themeDropdown = document.getElementById('theme-dropdown');
const themeOptions = document.querySelectorAll('.theme-option');
const styleSheet = document.getElementById('theme-css');

// Set initial selected state based on current theme
function updateSelectedState() {
    const currentTheme = styleSheet.getAttribute('href').replace('.css', '');
    
    themeOptions.forEach(option => {
        // Check if this option matches current theme
        const isSelected = option.getAttribute('data-theme') === currentTheme;
        
        if (isSelected) {
            option.classList.add('selected');
            // Update the theme button to show current theme
            themeToggle.textContent = option.textContent.trim();
        } else {
            option.classList.remove('selected');
        }
    });
}

// Initialize selected state
updateSelectedState();

// Toggle dropdown visibility
themeToggle.addEventListener('click', function() {
    themeDropdown.classList.toggle('show');
    updateSelectedState(); // Update selection state when opening dropdown
});

// Handle theme selection
themeOptions.forEach(option => {
    option.addEventListener('click', function() {
        const selectedTheme = this.getAttribute('data-theme');
        styleSheet.setAttribute('href', selectedTheme + '.css');
        
        // Update selection indicators
        themeOptions.forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');
        
        // Update the theme button text to reflect current selection
        themeToggle.textContent = this.textContent.trim();
        
        themeDropdown.classList.remove('show');
        
        // Add a subtle visual feedback when theme changes
        document.body.style.transition = "background-color 0.5s ease";
    });
});

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    if (!themeToggle.contains(event.target) && !themeDropdown.contains(event.target)) {
        themeDropdown.classList.remove('show');
    }
});