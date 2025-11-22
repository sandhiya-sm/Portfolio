const menuToggle = document.getElementById('menu-toggle');
const menu = document.querySelector('.menu');
const resumeModal = document.getElementById('resume-modal');
const viewResumeButton = document.getElementById('view-resume');
const modalCloseButton = document.getElementById('modal-close');
const contactForm = document.getElementById('contact-form');
const formResponse = document.getElementById('form-response');
const currentYear = document.getElementById('current-year');
const themeToggle = document.getElementById('theme-toggle');
const themeToggleMobile = document.getElementById('theme-toggle-mobile');

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

// Theme toggle functionality
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
};

const updateThemeIcon = (theme) => {
  const icon = theme === 'dark' ? '☀️' : '🌙';
  if (themeToggle) themeToggle.textContent = icon;
  if (themeToggleMobile) themeToggleMobile.textContent = icon;
};

const toggleTheme = () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
};

themeToggle?.addEventListener('click', toggleTheme);
themeToggleMobile?.addEventListener('click', toggleTheme);
initTheme();

// Dynamic navbar menu functionality
const navbarMenu = document.getElementById('navbar-menu');
let menuState = 'initial';

const updateMenu = (state) => {
  if (state === 'expanded') {
    navbarMenu.innerHTML = `
      <a href="#home" onclick="switchMenu('initial')">Home</a>
      <a href="#services">Services</a>
      <a href="#projects">Projects</a>
      <a href="#certifications">Certifications</a>
      <a href="#contact">Contact</a>
    `;
  } else {
    navbarMenu.innerHTML = `
      <a href="#home">Home</a>
      <a href="#about" onclick="switchMenu('expanded')">About</a>
      <a href="#contact">Contact</a>
    `;
  }
  menuState = state;
};

window.switchMenu = (state) => {
  updateMenu(state);
  if (state === 'expanded') {
    scrollToSection('#about');
  }
};

const scrollToSection = (targetId) => {
  const targetElement = document.querySelector(targetId);
  if (!targetElement) return;
  targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// Handle mobile navigation toggle
const toggleMobileMenu = () => {
  if (!menu) return;

  const isActive = menu.classList.toggle('active');
  menuToggle?.setAttribute('aria-expanded', String(isActive));
  menuToggle.innerHTML = `<i class="fas ${isActive ? 'fa-times' : 'fa-bars'}"></i>`;

  if (isActive) {
    menu.style.display = 'flex';
    menu.style.flexDirection = 'column';
    menu.style.position = 'absolute';
    menu.style.top = '80px';
    menu.style.right = '24px';
    menu.style.background = 'rgba(12, 16, 40, 0.95)';
    menu.style.padding = '24px';
    menu.style.gap = '18px';
    menu.style.borderRadius = '18px';
    menu.style.boxShadow = '0 24px 60px -30px rgba(0, 0, 0, 0.65)';
    menu.style.border = '1px solid rgba(106, 95, 253, 0.35)';
  } else {
    menu.removeAttribute('style');
  }
};

menuToggle?.addEventListener('click', toggleMobileMenu);

const closeMobileMenu = () => {
  if (!menu || !menu.classList.contains('active')) return;
  menu.classList.remove('active');
  menu.removeAttribute('style');
  menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
  menuToggle.setAttribute('aria-expanded', 'false');
};

// Smooth scroll for same-page links and close mobile menu on click
const scrollLinks = document.querySelectorAll('a[href^="#"]');
const sectionToggleGroups = document.querySelectorAll('.section-toggle');
const aboutSectionsNav = document.querySelector('.about-sections-nav');
const subSectionButtons = document.querySelectorAll('.nav-links button');

const setActiveSubButton = (sectionId) => {
  subSectionButtons.forEach((button) => {
    const isActive = button.dataset.target === sectionId;
    button.classList.toggle('active', isActive);
  });
};

const toggleDisplays = (section, view) => {
  const grids = section.querySelectorAll('[data-display="grid"]');
  const carousels = section.querySelectorAll('[data-display="carousel"]');

  grids.forEach((grid) => {
    grid.hidden = view === 'carousel';
  });

  carousels.forEach((carousel) => {
    carousel.hidden = view === 'grid';
  });
};

const updateToggleButtons = (group, view) => {
  const buttons = group.querySelectorAll('.toggle-button');
  buttons.forEach((button) => {
    const isActive = button.dataset.view === view;
    button.classList.toggle('active', isActive);
  });
};

scrollLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;

    event.preventDefault();
    scrollToSection(targetId);
    closeMobileMenu();
  });
});

sectionToggleGroups.forEach((group) => {
  group.addEventListener('click', (event) => {
    const button = event.target.closest('.toggle-button');
    if (!button) return;

    const sectionId = button.dataset.section;
    const view = button.dataset.view;
    if (!sectionId || !view) return;

    const section = document.getElementById(sectionId);
    if (!section) return;

    updateToggleButtons(group, view);
    toggleDisplays(section, view);
  });
});

const handleSectionVisibility = () => {
  const sections = ['about', 'services', 'projects', 'certifications'];
  const revealOffset = 160;
  let shouldShowExpanded = false;

  sections.forEach(sectionId => {
    const section = document.getElementById(sectionId);
    if (section) {
      const { top, bottom } = section.getBoundingClientRect();
      if (top <= revealOffset && bottom > revealOffset) {
        shouldShowExpanded = true;
      }
    }
  });

  // Auto switch navbar based on scroll position
  if (shouldShowExpanded && menuState === 'initial') {
    updateMenu('expanded');
  } else if (!shouldShowExpanded && menuState === 'expanded') {
    updateMenu('initial');
  }

  // Handle about sections nav visibility
  const aboutSection = document.getElementById('about');
  if (aboutSection && aboutSectionsNav) {
    const { top, bottom } = aboutSection.getBoundingClientRect();
    const isInView = top <= revealOffset && bottom > revealOffset;
    
    if (isInView) {
      aboutSectionsNav.classList.add('visible');
      sectionToggleGroups.forEach((group) => group.classList.add('visible'));
    } else {
      aboutSectionsNav.classList.remove('visible');
      sectionToggleGroups.forEach((group) => group.classList.remove('visible'));
    }
  }
};

window.addEventListener('scroll', () => {
  handleSectionVisibility();
});

handleSectionVisibility();

const handleSubSectionClick = (event) => {
  const button = event.target.closest('button[data-target]');
  if (!button) return;

  const targetSectionId = button.dataset.target;
  if (!targetSectionId) return;

  scrollToSection(`#${targetSectionId}`);
  setActiveSubButton(targetSectionId);
};

subSectionButtons.forEach((button) => {
  button.addEventListener('click', handleSubSectionClick);
});

// Resume modal logic
const toggleModal = (open) => {
  if (!resumeModal) return;
  if (open) {
    resumeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  } else {
    resumeModal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

viewResumeButton?.addEventListener('click', () => toggleModal(true));
modalCloseButton?.addEventListener('click', () => toggleModal(false));

resumeModal?.addEventListener('click', (event) => {
  if (event.target === resumeModal) {
    toggleModal(false);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && resumeModal?.classList.contains('active')) {
    toggleModal(false);
  }
});

// Scroll-triggered fade-in animations
const fadeInElements = document.querySelectorAll('main section');

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in', 'visible');
    }
  });
}, observerOptions);

fadeInElements.forEach((element) => {
  element.classList.add('fade-in');
  observer.observe(element);
});

// Universal card interactive effects
const initCardInteractivity = () => {
  const allCards = document.querySelectorAll('.skill-card, .service-card, .project-card, .cert-card, .metric, .carousel-card');
  
  allCards.forEach((card, index) => {
    // Add mouse move effect for 3D tilt
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 15;
      const rotateY = (centerX - x) / 15;
      
      const currentTransform = card.classList.contains('project-card') ? 'translateY(-8px) scale(1.01)' : 'translateY(-8px) scale(1.02)';
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${currentTransform}`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
    
    // Add click ripple effect
    card.addEventListener('click', (e) => {
      const ripple = document.createElement('div');
      const rect = card.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(233, 30, 99, 0.3) 0%, transparent 70%);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 10;
      `;
      
      card.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
};

// Initialize card interactivity when DOM is loaded
document.addEventListener('DOMContentLoaded', initCardInteractivity);

// Re-initialize for dynamically loaded content
const reinitializeCards = () => {
  setTimeout(initCardInteractivity, 100);
};

// Listen for section visibility changes to reinitialize cards
window.addEventListener('scroll', () => {
  handleSectionVisibility();
});

// Contact form submission
const setFormMessage = (message, status) => {
  if (!formResponse) return;
  formResponse.textContent = message;
  formResponse.style.color = status === 'success' ? '#61f8d6' : '#ff6b6b';
};

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    setFormMessage('', '');

    const formData = new FormData(contactForm);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message.');
      }

      setFormMessage(data.message, 'success');
      contactForm.reset();
    } catch (error) {
      setFormMessage(error.message || 'Something went wrong.', 'error');
    }
  });
}