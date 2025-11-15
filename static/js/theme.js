// File: static/js/theme.js

document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');

  // Function to update the icon based on the current theme
  const updateIcon = () => {
    // Get the current theme from the <html> element's data attribute
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    if (currentTheme === 'dark') {
      themeIcon.classList.remove('bi-sun-fill');
      themeIcon.classList.add('bi-moon-stars-fill');
    } else {
      themeIcon.classList.remove('bi-moon-stars-fill');
      themeIcon.classList.add('bi-sun-fill');
    }
  };

  // Set the initial icon state when the page loads
  updateIcon();

  // Add click event listener to the toggle button
  themeToggle.addEventListener('click', () => {
    // Get the current theme
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    
    // Determine the new theme
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    // Set the new theme on the <html> element
    document.documentElement.setAttribute('data-bs-theme', newTheme);
    
    // Save the new theme to localStorage
    localStorage.setItem('theme', newTheme);

    // Update the icon to reflect the new theme
    updateIcon();
  });
});