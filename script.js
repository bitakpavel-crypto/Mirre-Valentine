// Config values (from provided settings)
const config = {
  valentineName: "Mirre",
  pageTitle: "Will You Be My Valentine? 💝",
  floatingEmojis: {
    hearts: ['❤️','💖','💝','💗','💓'],
    bears: ['🧸','🐻']
  },
  questions: {
    first: {
      text: "Do you like me?",
      yesBtn: "Yes",
      noBtn: "No",
      secretAnswer: "I don't like you, I love you! ❤️"
    },
    second: {
      text: "How much do you love me?",
      startText: "This much!",
      nextBtn: "Next ❤️"
    },
    third: {
      text: "Will you be my Valentine...?",
      yesBtn: "Yes!",
      noBtn: "No"
    }
  },
  loveMessages: {
    extreme: "WOOOOW You love me that much?? 🥰🚀💝",
    high: "To infinity and beyond! 🚀💝",
    normal: "And beyond! 🥰"
  },
  celebration: {
    title: "Yay! I'm the luckiest person...",
    message: "Now come get your gift...",
    emojis: "🎁💖🤗💝💋❤️💕"
  },
  colors: {
    backgroundStart: "#ffafbd",
    backgroundEnd: "#ffc3a0",
    buttonBackground: "#ff6b6b",
    buttonHover: "#ff8787",
    textColor: "#ff4757"
  },
  animations: {
    floatDuration: "15s",
    floatDistance: "50px",
    bounceSpeed: "0.5s",
    heartExplosionSize: 1.5
  },
  // music removed per user request
};

// Basic wiring & DOM
document.addEventListener('DOMContentLoaded', () => {
  // Set title and name
  document.title = config.pageTitle;
  document.getElementById('pageTitle').textContent = config.pageTitle;
  document.getElementById('valentineName').textContent = config.valentineName;

  // Elements
  const step1 = document.getElementById('step-1');
  const step2 = document.getElementById('step-2');
  const step3 = document.getElementById('step-3');
  const celebration = document.getElementById('celebration');

  // Buttons
  const yes1 = document.getElementById('yes-1');
  const no1 = document.getElementById('no-1');
  const next2 = document.getElementById('next-2');
  const yes3 = document.getElementById('yes-3');
  const no3 = document.getElementById('no-3');
  const restart = document.getElementById('restart');

  // Step 1
  yes1.addEventListener('click', () => {
    reveal(step2);
  });

  // "No" button in step1 reveals secret message then continues
  no1.addEventListener('click', () => {
    alert(config.questions.first.secretAnswer);
    reveal(step2);
  });

  // Step 2 — love meter
  const meterFill = document.getElementById('meterFill');
  const meterText = document.getElementById('meterText');

  // animate meter to big random value (including extreme values) on load of step2
  function animateMeter() {
    // choose a pseudo-random value biased high
    const r = Math.random();
    // random choices to sometimes show extreme values
    let pct;
    if (r > 0.985) pct = 5000 + Math.floor(Math.random()*10000);        // extreme
    else if (r > 0.9) pct = 1000 + Math.floor(Math.random()*4000);     // very high
    else pct = 100 + Math.floor(Math.random()*900);                    // normal to high

    // visual cap at 100% for meter bar, display real value next to it
    const visualPct = Math.min(100, pct / 50); // scale big numbers into visible bar
    meterFill.style.width = visualPct + '%';
    meterText.textContent = `${config.questions.second.startText} ${pct}%`;

    // show appropriate message as a toast (simple)
    let msg = config.loveMessages.normal;
    if (pct > 5000) msg = config.loveMessages.extreme;
    else if (pct > 1000) msg = config.loveMessages.high;

    // small temporary highlight
    setTimeout(()=>showTempMessage(msg), 200);
  }

  next2.addEventListener('click', () => reveal(step3));

  // Step 3
  yes3.addEventListener('click', () => {
    reveal(celebration);
    showExplosion();
  });

  no3.addEventListener('click', () => {
    // playful nudge: bounce button and show secret line
    alert("No? That's okay — maybe try again later 💕");
  });

  restart.addEventListener('click', () => {
    // reset to initial state
    hideAll();
    reveal(step1);
  });

  // small helpers
  function reveal(el){
    hideAll();
    el.classList.remove('hidden');
    // trigger step-specific actions
    if (el === step2) setTimeout(animateMeter, 250);
  }
  function hideAll(){
    [step1, step2, step3, celebration].forEach(s => s.classList.add('hidden'));
  }

  // initial state
  hideAll();
  reveal(step1);

  /* Floating emojis generation */
  const floating = document.getElementById('floating');
  const allEmojis = [...config.floatingEmojis.hearts, ...config.floatingEmojis.bears];

  // create multiple floating emojis with randomized positions/durations
  const count = 18;
  for (let i=0;i<count;i++){ 
    const span = document.createElement('div');
    span.className = 'float-emoji';
    // pick emoji
    const emoji = allEmojis[Math.floor(Math.random()*allEmojis.length)];
    span.textContent = emoji;
    // position
    const left = Math.random()*100;
    const top = 30 + Math.random()*60; // keep mostly in upper-middle area
    span.style.left = left + 'vw';
    span.style.top = top + 'vh';
    // size
    const size = 16 + Math.floor(Math.random()*24);
    span.style.fontSize = size + 'px';
    // animation timing
    const dur = (parseInt(config.animations.floatDuration) * (0.75 + Math.random()*0.8)).toFixed(2) + 's';
    span.style.animation = `floatHoriz ${dur} linear infinite`;
    // horizontal distance as CSS variable for the animation
    span.style.setProperty('--float-distance', config.animations.floatDistance);
    // random delay
    span.style.animationDelay = (Math.random()*-10) + 's';
    floating.appendChild(span);
  }

  /* small temporary message display */
  function showTempMessage(text, timeout=2200){
    const el = document.createElement('div');
    el.textContent = text;
    el.style.position = 'fixed';
    el.style.left = '50%';
    el.style.top = '12%';
    el.style.transform = 'translateX(-50%)';
    el.style.background = 'rgba(255,255,255,0.95)';
    el.style.padding = '10px 14px';
    el.style.borderRadius = '12px';
    el.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
    el.style.zIndex = 9999;
    document.body.appendChild(el);
    setTimeout(()=>el.style.opacity = 0, timeout - 300);
    setTimeout(()=>el.remove(), timeout);
  }

  /* show heart explosion on celebration */
  function showExplosion(){
    const centerX = window.innerWidth/2;
    const centerY = window.innerHeight/2;
    const pieces = 24;
    for (let i=0;i<pieces;i++){ 
      const p = document.createElement('div');
      p.textContent = config.floatingEmojis.hearts[Math.floor(Math.random()*config.floatingEmojis.hearts.length)];
      p.style.position = 'fixed';
      p.style.left = centerX + 'px';
      p.style.top = centerY + 'px';
      p.style.fontSize = (16 + Math.random()*28) + 'px';
      p.style.zIndex = 9999;
      p.style.pointerEvents = 'none';
      const angle = Math.random()*Math.PI*2;
      const distance = 40 + Math.random()*140;
      const dx = Math.cos(angle)*distance;
      const dy = Math.sin(angle)*distance;
      p.style.transition = `transform 700ms ease-out, opacity 700ms ease-out`;
      document.body.appendChild(p);
      requestAnimationFrame(()=> {
        p.style.transform = `translate(${dx}px, ${dy}px) scale(${config.animations.heartExplosionSize})`;
        p.style.opacity = '0';
      });
      setTimeout(()=>p.remove(), 800);
    }
    // celebratory message
    showTempMessage(`${config.celebration.title} — ${config.celebration.message}`, 3000);
  }

});