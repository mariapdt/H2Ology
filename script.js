// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Navigation between pages
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all links and pages
        navLinks.forEach(l => l.classList.remove('active'));
        pages.forEach(p => p.classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');
        
        // Show corresponding page
        const targetPage = link.getAttribute('href').substring(1);
        document.getElementById(targetPage).classList.add('active');
        
        // Close mobile menu if open
        navMenu.classList.remove('active');
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// Water Calculator Function
function calculateWater() {
    const weightInput = document.getElementById('weight');
    const resultDiv = document.getElementById('result');
    const weight = parseFloat(weightInput.value);
    
    // Validate input
    if (!weight || weight <= 0 || weight > 300) {
        resultDiv.innerHTML = `
            <div style="color: #e74c3c; font-size: 1.1rem;">
                ⚠️ Please enter a valid weight between 1 and 300 kg
            </div>
        `;
        return;
    }
    
    // Calculate water intake (Body weight in kg × 0.033)
    const waterNeeded = (weight * 0.033).toFixed(2);
    const waterInML = (waterNeeded * 1000).toFixed(0);
    const waterInCups = (waterNeeded * 4.22).toFixed(1); // 1 liter ≈ 4.22 cups
    
    // Display result with animation
    resultDiv.innerHTML = `
        <div class="result-text">You should drink approximately:</div>
        <div class="result-number">${waterNeeded} L</div>
        <div style="font-size: 1.1rem; color: #007ea7; margin-top: 1rem;">
            That's about ${waterInML} ml or ${waterInCups} cups per day
        </div>
        <div style="margin-top: 1.5rem; padding: 1rem; background: #e8f8f5; border-radius: 8px; color: #00695c;">
            💧 <strong>Pro Tip:</strong> With your H2Ology Smart Bottle, you'll get personalized reminders to reach this goal!
        </div>
    `;
}

// Allow Enter key to calculate
document.getElementById('weight')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        calculateWater();
    }
});

// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Add scroll effect to navbar
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
    }
    
    lastScroll = currentScroll;
});

// Animate cards on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.value-card, .feature-card, .sustainability-card, .app-feature');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});