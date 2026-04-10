/* ===================================================
   Elysia Birthday 2026 — Interactive Script
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initSequentialReveal();
  initEnvelope();
  initBirthdayPopup();
  initMusic();
});

/* ---------- Floating Particles ---------- */
function initParticles() {
  const container = document.getElementById('particles');
  const symbols = ['♥', '♥', '✦', '✧', '♡', '❤'];

  function createParticle() {
    const el = document.createElement('span');
    el.classList.add('particle');

    const isHeart = Math.random() > 0.4;
    el.classList.add(isHeart ? 'heart' : 'sparkle');
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    // Random properties
    const size = 12 + Math.random() * 22; // 12–34px
    const left = Math.random() * 100;     // 0–100%
    const duration = 8 + Math.random() * 12; // 8–20s
    const delay = Math.random() * 4;

    el.style.cssText = `
      left: ${left}%;
      font-size: ${size}px;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;

    container.appendChild(el);

    // Remove after animation
    setTimeout(() => {
      el.remove();
    }, (duration + delay) * 1000 + 500);
  }

  // Initial burst
  for (let i = 0; i < 15; i++) {
    setTimeout(createParticle, i * 300);
  }

  // Continuous stream
  setInterval(createParticle, 1200);
}

/* ---------- Sequential Line Reveal ---------- */
function initSequentialReveal() {
  const landing = document.getElementById('landing');
  const lines = landing.querySelectorAll('.reveal-line');
  let currentIndex = 0;
  const totalLines = lines.length;

  function showNextLine() {
    if (currentIndex >= totalLines) {
      // All lines done — auto-scroll to envelope
      setTimeout(() => {
        document.getElementById('envelope-section').scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 500);
      return;
    }

    const line = lines[currentIndex];
    line.classList.add('visible');

    // Last two lines hold for 5 seconds, others for 3 seconds
    const holdTime = (currentIndex >= totalLines - 2) ? 5000 : 3000;

    setTimeout(() => {
      line.classList.add('fade-out');
      line.classList.remove('visible');

      // Wait for fade-out transition, then show next
      setTimeout(() => {
        currentIndex++;
        showNextLine();
      }, 800);
    }, holdTime);
  }

  // Start the sequence after a short initial delay
  setTimeout(showNextLine, 600);
}

/* ---------- Envelope ---------- */
function initEnvelope() {
  const wrapper = document.getElementById('envelope-wrapper');
  const envelope = document.getElementById('envelope');
  const letter = document.getElementById('letter');
  let isOpen = false;

  wrapper.addEventListener('click', () => {
    if (isOpen) return;
    isOpen = true;

    // Step 1: Flip to back
    envelope.classList.add('flipped');

    // Step 2: Open flap
    setTimeout(() => {
      envelope.classList.add('opened');
    }, 900);

    // Step 3: Letter slides up
    setTimeout(() => {
      letter.classList.add('revealed');
    }, 1600);
  });
}

/* ---------- Gift Card Popup ---------- */
function initBirthdayPopup() {
  const continueBtn = document.getElementById('letter-continue');
  const popup = document.getElementById('birthday-popup');
  const overlay = document.getElementById('overlay');
  const giftCard = document.getElementById('gift-card');
  const giftText = document.getElementById('gift-card-text');
  const claimedMsg = document.getElementById('gift-card-claimed');
  const finePrint = document.getElementById('gift-card-fine-print');
  let claimed = false;

  continueBtn.addEventListener('click', (e) => {
    e.stopPropagation();

    // Activate blurred overlay
    overlay.classList.add('active');

    // Show the gift card popup
    popup.classList.add('active');
  });

  // Click on the gift card to claim
  giftCard.addEventListener('click', (e) => {
    e.stopPropagation();
    if (claimed) return;
    claimed = true;

    // Show claimed message and hide fine print
    claimedMsg.classList.add('visible');
    if (finePrint) {
      finePrint.style.opacity = '0';
      finePrint.style.animation = 'none';
    }
  });

  // Click outside (on overlay or popup background) to dismiss
  overlay.addEventListener('click', () => {
    overlay.classList.remove('active');
    popup.classList.remove('active');
  });

  popup.addEventListener('click', () => {
    overlay.classList.remove('active');
    popup.classList.remove('active');
  });
}

/* ---------- Background Music ---------- */
function initMusic() {
  const btn = document.getElementById('music-toggle');
  let audio = null;
  let playing = false;
  let initialized = false;

  // We'll use a gentle piano track from a royalty-free source
  // Using a basic oscillator as placeholder (can be replaced with an mp3)
  function createAmbientMusic() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    // Create a serene ambient pad
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 2);
    gainNode.connect(ctx.destination);

    // Soft chord: C4-E4-G4-B4
    const frequencies = [261.63, 329.63, 392.0, 493.88];
    const oscillators = [];

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Slight detune for warmth
      osc.detune.setValueAtTime(i * 3 - 4, ctx.currentTime);

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0.25, ctx.currentTime);

      osc.connect(oscGain);
      oscGain.connect(gainNode);
      osc.start();
      oscillators.push({ osc, gain: oscGain });
    });

    return { ctx, gainNode, oscillators };
  }

  btn.addEventListener('click', () => {
    if (!initialized) {
      audio = createAmbientMusic();
      initialized = true;
      playing = true;
      btn.classList.remove('muted');
    } else if (playing) {
      audio.gainNode.gain.linearRampToValueAtTime(0, audio.ctx.currentTime + 0.5);
      playing = false;
      btn.classList.add('muted');
    } else {
      audio.gainNode.gain.linearRampToValueAtTime(0.06, audio.ctx.currentTime + 0.5);
      playing = true;
      btn.classList.remove('muted');
    }
  });

  // Start muted
  btn.classList.add('muted');
}
