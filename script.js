// ============ TYPEWRITER EFFECT ============
const phrases = [
    'Ingeniero en Sistemas',
    'Desarrollador de Software',
    'Docente de Programación',
    'Especialista Full Stack',
    'Formador de Talentos'
];

let phraseIndex = 0;
let charIndex = 0;
let currentPhrase = '';
let isDeleting = false;

function typeWriter() {
    const fullPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        currentPhrase = fullPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        currentPhrase = fullPhrase.substring(0, charIndex + 1);
        charIndex++;
    }

    document.getElementById('typewriter').innerHTML = currentPhrase;

    let typeSpeed = 150;
    if (isDeleting) typeSpeed /= 2;

    if (!isDeleting && charIndex === fullPhrase.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
    }

    setTimeout(typeWriter, typeSpeed);
}

// ============ PROJECTS DATA & MANAGEMENT ============
let projects = [
    {
        title: "Sistema de Gestión Académica",
        category: "web",
        tech: "PHP, MySQL, Bootstrap, JavaScript",
        description: "Sistema completo para la gestión de estudiantes, docentes y cursos en instituciones educativas. Incluye módulos de inscripciones, calificaciones y reportes.",
        url: "",
        github: "https://github.com/maysalazar16/sistema-academico"
    },
    {
        title: "App de Control de Inventario",
        category: "web", 
        tech: "React, Node.js, MongoDB, Express",
        description: "Aplicación web para el control de inventarios en tiempo real con alertas automáticas, códigos de barras y reportes detallados.",
        url: "",
        github: "https://github.com/maysalazar16/inventario-app"
    },
    {
        title: "API REST para E-learning",
        category: "api",
        tech: "Python, Django, PostgreSQL, JWT",
        description: "API robusta para plataforma de aprendizaje en línea con autenticación, gestión de cursos, progreso de estudiantes y certificaciones.",
        url: "",
        github: "https://github.com/maysalazar16/elearning-api"
    },
    {
        title: "Dashboard Analítico SENA",
        category: "web",
        tech: "Vue.js, Chart.js, Laravel, MySQL",
        description: "Dashboard interactivo para visualizar métricas académicas y estadísticas de rendimiento de estudiantes del SENA Regional Valle.",
        url: "",
        github: "https://github.com/maysalazar16/sena-dashboard"
    }
];

function getCategoryColor(category) {
    const colors = {
        'web': 'var(--primary-color)',
        'mobile': 'var(--accent-color)',
        'desktop': '#10b981',
        'api': '#f59e0b',
        'other': '#6b7280'
    };
    return colors[category] || colors.other;
}

function getCategoryLabel(category) {
    const labels = {
        'web': 'Desarrollo Web',
        'mobile': 'App Móvil',
        'desktop': 'Aplicación Desktop',
        'api': 'API/Backend',
        'other': 'Otro'
    };
    return labels[category] || 'Otro';
}

function renderProjects() {
    const container = document.getElementById('projectsGrid');
    if (!container) return;
    
    container.innerHTML = '';

    projects.forEach((project, index) => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.style.animation = `fadeInUp 0.6s ease forwards ${index * 0.1}s`;
        
        projectCard.innerHTML = `
            <div class="project-header">
                <div class="project-category" style="background-color: ${getCategoryColor(project.category)}">
                    ${getCategoryLabel(project.category)}
                </div>
                <h3 class="project-title">${project.title}</h3>
                <p class="project-tech">${project.tech}</p>
            </div>
            <div class="project-body">
                <p class="project-description">${project.description}</p>
                <div class="project-actions">
                    ${project.url ? `<a href="${project.url}" class="btn btn-primary" target="_blank">Ver Demo</a>` : ''}
                    ${project.github ? `<a href="${project.github}" class="btn btn-secondary" target="_blank">Ver Código</a>` : ''}
                    <button class="btn btn-secondary" onclick="removeProject(${index})" style="background-color: #ef4444; color: white; border-color: #ef4444;">
                        Eliminar
                    </button>
                </div>
            </div>
        `;
        
        container.appendChild(projectCard);
    });
}

function addProject() {
    const name = document.getElementById('projectName').value.trim();
    const category = document.getElementById('projectCategory').value;
    const tech = document.getElementById('projectTech').value.trim();
    const description = document.getElementById('projectDescription').value.trim();
    const url = document.getElementById('projectUrl').value.trim();
    const github = document.getElementById('projectGithub').value.trim();

    if (!name || !category || !tech || !description) {
        showNotification('Por favor completa todos los campos obligatorios.', 'error');
        return;
    }

    const newProject = {
        title: name,
        category: category,
        tech: tech,
        description: description,
        url: url,
        github: github
    };

    projects.push(newProject);
    renderProjects();
    
    // Clear form
    document.getElementById('projectForm').reset();
    
    showNotification('¡Proyecto agregado exitosamente!', 'success');
    
    // Scroll to projects section
    document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
}

function removeProject(index) {
    if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
        projects.splice(index, 1);
        renderProjects();
        showNotification('Proyecto eliminado correctamente.', 'success');
    }
}

// ============ FILE UPLOAD FUNCTIONALITY ============
let uploadedFiles = [];

function initializeFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');

    if (!uploadArea || !fileInput) return;

    // Click to select files
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    // File input change
    fileInput.addEventListener('change', handleFileSelect);

    // Drag and drop events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });

    uploadArea.addEventListener('drop', handleDrop, false);
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight(e) {
    document.getElementById('uploadArea').classList.add('drag-over');
}

function unhighlight(e) {
    document.getElementById('uploadArea').classList.remove('drag-over');
}

function handleFileSelect(e) {
    const files = e.target.files;
    handleFiles(files);
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

function handleFiles(files) {
    if (files.length === 0) return;
    
    const fileList = Array.from(files);
    const validFiles = fileList.filter(file => {
        const validTypes = [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp',
            'application/pdf', 'text/plain', 'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/html', 'text/css', 'text/javascript', 'text/python'
        ];
        return validTypes.includes(file.type) || 
               file.name.match(/\.(js|html|css|py|txt|md)$/);
    });

    if (validFiles.length === 0) {
        showNotification('Por favor selecciona archivos válidos.', 'error');
        return;
    }

    uploadedFiles = [...uploadedFiles, ...validFiles];
    updateUploadDisplay(validFiles);
    
    const fileNames = validFiles.map(file => file.name).join(', ');
    showNotification(`${validFiles.length} archivo(s) seleccionado(s): ${fileNames}`, 'success');
}

function updateUploadDisplay(files) {
    const uploadArea = document.getElementById('uploadArea');
    const fileCount = uploadedFiles.length;
    
    uploadArea.innerHTML = `
        <div class="upload-icon">📁</div>
        <h3>Archivos seleccionados: ${fileCount}</h3>
        <p>${files.map(f => f.name).join(', ')}</p>
        <small style="color: var(--text-muted);">Haz clic para seleccionar más archivos</small>
    `;
}

// ============ FORM HANDLING ============
function initializeForms() {
    // Project form
    const projectForm = document.getElementById('projectForm');
    if (projectForm) {
        projectForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addProject();
        });
    }

    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactSubmit();
        });
    }
}

function handleContactSubmit() {
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !subject || !message) {
        showNotification('Por favor completa todos los campos.', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Por favor ingresa un email válido.', 'error');
        return;
    }

    // Crear el enlace de mailto con todos los datos
    const emailSubject = encodeURIComponent(`${subject} - Contacto desde Portfolio`);
    const emailBody = encodeURIComponent(
        `Hola Mairon,\n\n` +
        `Mi nombre es ${name} y me gustaría contactarte.\n\n` +
        `Mensaje:\n${message}\n\n` +
        `Mis datos de contacto:\n` +
        `Email: ${email}\n\n` +
        `Enviado desde tu portfolio web.`
    );
    
    const mailtoLink = `mailto:maironsalazar16@gmail.com?subject=${emailSubject}&body=${emailBody}`;
    
    // Abrir el cliente de correo
    window.location.href = mailtoLink;
    
    // Mostrar confirmación
    showNotification('¡Redirigiendo a tu cliente de correo! El mensaje está pre-llenado.', 'success');
    
    // Limpiar formulario después de un momento
    setTimeout(() => {
        document.getElementById('contactForm').reset();
    }, 2000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ============ SMOOTH SCROLLING ============
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = 80;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============ MOBILE NAVIGATION ============
function initializeMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ============ NOTIFICATIONS ============
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;

    // Add animation keyframes if not already added
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            .notification button {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// ============ SCROLL ANIMATIONS ============
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll
    document.querySelectorAll('.timeline-item, .stat-item, .skill-category, .contact-card').forEach(el => {
        observer.observe(el);
    });
}

// ============ INITIALIZATION ============
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    typeWriter();
    renderProjects();
    initializeFileUpload();
    initializeForms();
    initializeSmoothScrolling();
    initializeMobileNav();
    initializeScrollAnimations();

    // Add loading animation to page
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);

    console.log('✅ Portfolio de Mairon Salazar cargado correctamente');
});