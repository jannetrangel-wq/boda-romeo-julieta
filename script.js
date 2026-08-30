/**
 * ==========================================================================
 * SCRIPT PRINCIPAL — BODA JULIETA CAPULETO & ROMEO MONTESCO
 * Interactividad: Sobre 3D, Efecto Táctil de Anillos, Música, Cuenta Regresiva & RSVP
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // --------------------------------------------------------------------------
    // 1. SELECTORES DE ELEMENTOS DEL DOM
    // --------------------------------------------------------------------------
    const envelopeScreen = document.getElementById('envelope-screen');
    const envelopeWrapper = document.getElementById('envelope-wrapper');
    const waxSealBtn = document.getElementById('wax-seal-btn');
    const invitationMain = document.getElementById('invitation-main');
    
    // Reproductor de Música
    const weddingAudio = document.getElementById('wedding-audio');
    const musicToggleBtn = document.getElementById('music-toggle-btn');
    const vinylIcon = document.getElementById('vinyl-icon');
    const audioWaves = document.getElementById('audio-waves');
    const musicStatusText = document.getElementById('music-status-text');

    // Cuenta Regresiva
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    // Calendario
    const addToCalendarBtn = document.getElementById('add-to-calendar-btn');
    const calendarDropdown = document.getElementById('calendar-dropdown');
    const calGoogle = document.getElementById('cal-google');
    const calIcs = document.getElementById('cal-ics');

    // Formulario RSVP
    const guestNameInput = document.getElementById('guest-name');
    const dietarySelect = document.getElementById('dietary-preferences');
    const customDietaryGroup = document.getElementById('custom-dietary-group');
    const customDietaryText = document.getElementById('custom-dietary-text');
    const rsvpNotes = document.getElementById('rsvp-notes');
    const whatsappRsvpBtn = document.getElementById('whatsapp-rsvp-btn');

    // Contenedor de partículas táctiles
    const touchContainer = document.getElementById('touch-effects-container');

    // --------------------------------------------------------------------------
    // 2. APERTURA DEL SOBRE DIGITAL INTERACTIVO
    // --------------------------------------------------------------------------
    let isEnvelopeOpened = false;

    function openEnvelope() {
        if (isEnvelopeOpened) return;
        isEnvelopeOpened = true;

        // Animar el sobre
        envelopeWrapper.classList.add('open');

        // Reproducir música automáticamente al primer gesto de interacción
        playBackgroundMusic();

        // Tras la animación del sobre, revelar la invitación principal
        setTimeout(() => {
            envelopeScreen.classList.add('opened');
            invitationMain.classList.remove('hidden');

            // Scroll suave hacia la parte superior de la invitación
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Iniciar observador de scroll para animaciones
            initScrollObserver();
        }, 900);
    }

    if (waxSealBtn) {
        waxSealBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openEnvelope();
        });
    }

    if (envelopeWrapper) {
        envelopeWrapper.addEventListener('click', openEnvelope);
    }

    // --------------------------------------------------------------------------
    // 3. REPRODUCTOR DE MÚSICA DE FONDO
    // --------------------------------------------------------------------------
    let isPlaying = false;

    function playBackgroundMusic() {
        weddingAudio.volume = 0;
        const playPromise = weddingAudio.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                isPlaying = true;
                updateMusicUI(true);
                // Subir volumen progresivamente (Fade In)
                let vol = 0;
                const fadeIn = setInterval(() => {
                    if (vol < 0.7) {
                        vol += 0.05;
                        weddingAudio.volume = Math.min(vol, 0.7);
                    } else {
                        clearInterval(fadeIn);
                    }
                }, 100);
            }).catch(() => {
                // Autoplay bloqueado por políticas de navegador
                isPlaying = false;
                updateMusicUI(false);
            });
        }
    }

    function toggleMusic() {
        if (isPlaying) {
            weddingAudio.pause();
            isPlaying = false;
            updateMusicUI(false);
        } else {
            weddingAudio.play().then(() => {
                isPlaying = true;
                updateMusicUI(true);
            }).catch(err => console.log('Error de reproducción:', err));
        }
    }

    function updateMusicUI(active) {
        if (active) {
            vinylIcon.classList.add('playing');
            audioWaves.classList.add('active');
            musicStatusText.textContent = 'Reproduciendo ♪';
            musicStatusText.style.color = '#C5A059';
        } else {
            vinylIcon.classList.remove('playing');
            audioWaves.classList.remove('active');
            musicStatusText.textContent = 'Música en Pausa';
            musicStatusText.style.color = '#8E867E';
        }
    }

    if (musicToggleBtn) {
        musicToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMusic();
        });
    }

    // --------------------------------------------------------------------------
    // 4. EFECTO TÁCTIL (TOUCH & CLICK): ANILLOS ENTRELAZADOS DORADOS
    // --------------------------------------------------------------------------
    let lastTapTime = 0;

    function createRingsEffect(x, y) {
        if (!touchContainer) return;

        // Crear elemento de anillos entrelazados SVG
        const ringElement = document.createElement('div');
        ringElement.className = 'golden-ring-particle';
        ringElement.style.left = `${x}px`;
        ringElement.style.top = `${y}px`;

        // SVG de dos anillos entrelazados con gema y brillo
        ringElement.innerHTML = `
            <svg width="68" height="52" viewBox="0 0 68 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Anillo Izquierdo -->
                <circle cx="26" cy="28" r="16" stroke="url(#goldGrad)" stroke-width="4.5" fill="none"/>
                <!-- Anillo Derecho (Entrelazado) -->
                <circle cx="42" cy="24" r="16" stroke="url(#goldGrad)" stroke-width="4.5" fill="none"/>
                <!-- Brillo / Diamante Superior -->
                <polygon points="42,4 46,9 42,14 38,9" fill="#FFFFFF"/>
                <circle cx="42" cy="9" r="2" fill="#FFE599"/>
                
                <!-- Definición de Gradiente Dorado -->
                <defs>
                    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FFF3C4"/>
                        <stop offset="35%" stop-color="#D4AF37"/>
                        <stop offset="70%" stop-color="#AA7C11"/>
                        <stop offset="100%" stop-color="#F9E29D"/>
                    </linearGradient>
                </defs>
            </svg>
        `;

        touchContainer.appendChild(ringElement);

        // Generar 3 chispas de luz alrededor
        for (let i = 0; i < 3; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'ring-sparkle';
            const size = Math.random() * 5 + 3;
            sparkle.style.width = `${size}px`;
            sparkle.style.height = `${size}px`;
            sparkle.style.left = `${x + (Math.random() * 50 - 25)}px`;
            sparkle.style.top = `${y + (Math.random() * 40 - 20)}px`;
            touchContainer.appendChild(sparkle);

            setTimeout(() => sparkle.remove(), 900);
        }

        // Remover después de completar la animación (1s)
        setTimeout(() => {
            if (ringElement && ringElement.parentNode) {
                ringElement.remove();
            }
        }, 1000);
    }

    // Escuchar toques y clics en toda la ventana
    window.addEventListener('pointerdown', (e) => {
        // Evitar generar chispas sobre campos de texto para comodidad del usuario
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
            return;
        }

        const now = Date.now();
        if (now - lastTapTime < 80) return; // Debounce suave
        lastTapTime = now;

        createRingsEffect(e.clientX, e.clientY);
    }, { passive: true });

    // --------------------------------------------------------------------------
    // 5. CUENTA REGRESIVA AL 27 DE NOVIEMBRE DE 2026 (20:00 HRS)
    // --------------------------------------------------------------------------
    // Viernes 27 de Noviembre, 2026, 20:00:00
    const targetDate = new Date(2026, 10, 27, 20, 0, 0).getTime(); // Mes 10 = Noviembre en JS

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            if (daysEl) daysEl.textContent = '00';
            if (hoursEl) hoursEl.textContent = '00';
            if (minutesEl) minutesEl.textContent = '00';
            if (secondsEl) secondsEl.textContent = '00';
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // --------------------------------------------------------------------------
    // 6. INTEGRACIÓN DE CALENDARIO (GOOGLE CALENDAR & .ICS)
    // --------------------------------------------------------------------------
    if (addToCalendarBtn && calendarDropdown) {
        addToCalendarBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            calendarDropdown.classList.toggle('hidden');
        });

        document.addEventListener('click', () => {
            calendarDropdown.classList.add('hidden');
        });

        // Configurar Google Calendar
        const eventTitle = encodeURIComponent("Boda Julieta Capuleto & Romeo Montesco");
        const eventDetails = encodeURIComponent("Celebración del Enlace Matrimonial de Julieta & Romeo.\nCeremonia Religiosa: Parroquia María Reyna de los Ángeles (20:00 hrs)\nRecepción: Quinta Real (21:00 hrs)");
        const eventLocation = encodeURIComponent("Parroquia María Reyna de los Ángeles, Av. Roberto Garza Sada 300, San Pedro Garza García, N.L.");
        
        // 27 Nov 2026 20:00 a 28 Nov 2026 03:00 (Hora México UTC-6) -> 20261128T020000Z/20261128T090000Z
        const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=20261128T020000Z/20261128T090000Z&details=${eventDetails}&location=${eventLocation}`;
        if (calGoogle) calGoogle.href = googleCalUrl;

        // Configurar Descarga Archivo .ICS
        if (calIcs) {
            calIcs.addEventListener('click', (e) => {
                e.preventDefault();
                const icsData = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Boda Julieta y Romeo//Invitacion Oficial//ES
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:boda-julieta-romeo-20261127@bodajulietyromeo.com
DTSTAMP:20260101T000000Z
DTSTART:20261128T020000Z
DTEND:20261128T090000Z
SUMMARY:Boda Julieta Capuleto & Romeo Montesco
DESCRIPTION:Celebración del Enlace Matrimonial de Julieta & Romeo.\\nCeremonia Religiosa: Parroquia María Reyna de los Ángeles (20:00 hrs)\\nRecepción: Quinta Real (21:00 hrs)
LOCATION:Parroquia María Reyna de los Ángeles, Av. Roberto Garza Sada 300, San Pedro Garza García, N.L.
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;
                
                const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.setAttribute('download', 'Boda_Julieta_y_Romeo.ics');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        }
    }

    // --------------------------------------------------------------------------
    // 7. FORMULARIO INTERACTIVO RSVP & ENVÍO A WHATSAPP
    // --------------------------------------------------------------------------
    if (dietarySelect && customDietaryGroup) {
        dietarySelect.addEventListener('change', () => {
            if (dietarySelect.value === 'Otra restricción específica') {
                customDietaryGroup.classList.remove('hidden');
                if (customDietaryText) customDietaryText.focus();
            } else {
                customDietaryGroup.classList.add('hidden');
            }
        });
    }

    if (whatsappRsvpBtn) {
        whatsappRsvpBtn.addEventListener('click', () => {
            const guestName = guestNameInput.value.trim();

            if (!guestName) {
                guestNameInput.focus();
                guestNameInput.style.borderColor = '#E53E3E';
                guestNameInput.placeholder = '¡Por favor ingresa tu nombre!';
                setTimeout(() => {
                    guestNameInput.style.borderColor = '';
                }, 2500);
                return;
            }

            // Asistencia seleccionada
            const attendanceSelected = document.querySelector('input[name="attendance"]:checked')?.value;
            const willAttend = attendanceSelected === 'si';

            // Preferencias alimentarias
            let dietaryInfo = dietarySelect.value;
            if (dietaryInfo === 'Otra restricción específica' && customDietaryText.value.trim() !== '') {
                dietaryInfo = customDietaryText.value.trim();
            }

            // Mensaje opcional
            const note = rsvpNotes.value.trim();

            // Construir mensaje elegante y estructurado
            let message = '';
            if (willAttend) {
                message = `¡Hola! Confirmo mi asistencia a la boda de Julieta y Romeo. ✨\n\n` +
                          `👤 *Invitado(s):* ${guestName}\n` +
                          `🍽️ *Mis restricciones o preferencias alimentarias son:* ${dietaryInfo}\n`;
                if (note) {
                    message += `💌 *Dedicatoria:* ${note}\n`;
                }
                message += `\n¡Nos vemos el 27 de Noviembre para celebrar juntos! 🥂✨`;
            } else {
                message = `¡Hola Julieta y Romeo! 🤍\n\n` +
                          `👤 *De:* ${guestName}\n` +
                          `Lamentablemente no podré acompañarlos en su enlace matrimonial el 27 de Noviembre, pero les deseo de corazón toda la felicidad en esta nueva etapa.\n`;
                if (note) {
                    message += `💌 *Mensaje:* ${note}\n`;
                }
            }

            // Codificar para URL de WhatsApp (+52 81 1015 5686)
            const phoneNumber = '528110155686';
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

            // Abrir WhatsApp en nueva pestaña
            window.open(whatsappUrl, '_blank');
        });
    }

    // --------------------------------------------------------------------------
    // 8. ANIMACIONES AL HACER SCROLL (INTERSECTION OBSERVER)
    // --------------------------------------------------------------------------
    function initScrollObserver() {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');

        if ('IntersectionObserver' in window) {
            const observerOptions = {
                root: null,
                threshold: 0.15,
                rootMargin: '0px 0px -40px 0px'
            };

            const observer = new IntersectionObserver((entries, observerInstance) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observerInstance.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            revealElements.forEach(el => observer.observe(el));
        } else {
            // Fallback para navegadores antiguos
            revealElements.forEach(el => el.classList.add('is-visible'));
        }
    }

    // Inicializar observador si la invitación ya es visible
    if (!invitationMain.classList.contains('hidden')) {
        initScrollObserver();
    }
});
