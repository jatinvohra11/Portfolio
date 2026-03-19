/* ---- PAGE LOADER ---- */
(function () {
  const loader = document.getElementById('page-loader');
  window.addEventListener('load', () => {
    setTimeout(() => { loader.classList.add('done'); }, 1700);
  });
  setTimeout(() => { if (loader) loader.classList.add('done'); }, 3000);
})();


/* ---- CERTIFICATE MODAL ---- */
const CERTS = [
  {
    icon: '☁️',
    name: 'Cloud Computing',
    issuer: 'NPTEL',
    year: '2024',
    desc: 'Covered cloud service models (IaaS, PaaS, SaaS), virtualization, distributed systems, and deployment strategies on major cloud platforms.',
    file: 'cert-nptel-cloud.pdf',
    color: '#3b82f6'
  },
  {
    icon: '🤖',
    name: 'Build Generative AI Apps',
    issuer: 'Infosys Springboard',
    year: '2024',
    desc: 'Hands-on training in building generative AI applications using LLMs, prompt engineering, and integrating AI APIs into production systems.',
    file: 'cert-infosys-genai.pdf',
    color: '#a78bfa'
  },
  {
    icon: '📊',
    name: 'Ultimate Job Ready Data Science Course',
    issuer: 'CodewithHarry',
    year: '2024',
    desc: 'Comprehensive data science curriculum including Python, NumPy, Pandas, Matplotlib, Machine Learning algorithms, EDA, and Generative AI fundamentals.',
    file: 'cert-codewithharry-ds.pdf',
    color: '#f59e0b'
  },
  {
    icon: '⚙️',
    name: 'DSA with Java',
    issuer: 'Apna College',
    year: '2024',
    desc: 'Complete Data Structures and Algorithms course covering Arrays, Linked Lists, Trees, Graphs, Dynamic Programming, and problem-solving techniques in Java.',
    file: 'cert-apna-dsa.pdf',
    color: '#10b981'
  }
];

window.openCert = function(index) {
  const cert   = CERTS[index];
  const overlay = document.getElementById('cert-inline-overlay');
  const tag    = document.getElementById('cert-inline-tag');
  const title  = document.getElementById('cert-inline-title');
  const dlBtn  = document.getElementById('cert-inline-dl');
  const body   = document.getElementById('cert-inline-body');

  // Set header
  tag.textContent   = cert.issuer + ' · ' + cert.year;
  tag.style.color   = cert.color;
  title.textContent = cert.name;
  dlBtn.href        = cert.file;
  dlBtn.download    = cert.file;

  // Reset body with loader
  body.innerHTML = '<div class="cert-inline-loading"><div class="cert-spin"></div><p>Loading certificate...</p></div>';

  // Show overlay
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => overlay.classList.add('open'));

  // Load PDF after animation
  setTimeout(() => {
    body.innerHTML = '';
    const isPDF = cert.file.toLowerCase().endsWith('.pdf');

    if (isPDF) {
      // Try embed first
      const embed = document.createElement('embed');
      embed.src    = cert.file;
      embed.type   = 'application/pdf';
      embed.style.cssText = 'width:100%;height:100%;border:none;border-radius:0 0 18px 18px;';
      embed.onerror = () => loadFallback();
      body.appendChild(embed);
    } else {
      const img = document.createElement('img');
      img.src = cert.file;
      img.alt = cert.name;
      img.style.cssText = 'width:100%;height:100%;object-fit:contain;border-radius:0 0 18px 18px;';
      img.onerror = () => loadFallback();
      body.appendChild(img);
    }

    function loadFallback() {
      body.innerHTML =
        '<div class="cert-fallback">' +
          '<span class="cert-fall-icon">' + cert.icon + '</span>' +
          '<p class="cert-fall-name">' + cert.name + '</p>' +
          '<p class="cert-fall-issuer">' + cert.issuer + '</p>' +
          '<span class="cert-verified">✓ Certificate Verified</span>' +
          '<p class="cert-fall-desc">' + cert.desc + '</p>' +
          '<p class="cert-fall-hint">Place <code>' + cert.file + '</code> in your portfolio folder to display the certificate here.</p>' +
        '</div>';
    }
  }, 350);
};

window.closeCertInline = function() {
  const overlay = document.getElementById('cert-inline-overlay');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => {
    document.getElementById('cert-inline-body').innerHTML = '';
  }, 400);
};

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    window.closeCertInline();
    window.closeBlog && window.closeBlog();
  }
});


/* ---- NEURAL NETWORK BACKGROUND ---- */
(function () {
  const canvas = document.getElementById('canvas-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let nodes = [], animId, t = 0;
  const CONN_DIST = 160;
  const PULSE_SPEED = 0.012;

  // Pulse signals travelling along connections
  const pulses = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
  }

  function init() {
    nodes = [];
    const count = Math.min(55, Math.floor(canvas.width * canvas.height / 22000));
    for (let i = 0; i < count; i++) {
      nodes.push({
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r:  Math.random() * 2 + 1.5,
        pulse: Math.random() * Math.PI * 2,   // phase for glow pulse
        layer: Math.floor(Math.random() * 3),  // 0=input 1=hidden 2=output
      });
    }
  }

  function draw() {
    t += PULSE_SPEED;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const light = document.documentElement.getAttribute('data-theme') === 'light';

    // Color scheme
    const nodeColor  = light ? [100, 60, 220]  : [167, 139, 250];
    const connColor  = light ? [100, 60, 220]  : [124, 92, 252];
    const pulseColor = light ? [80,  200, 255] : [103, 232, 249];

    // Move nodes
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      n.pulse += 0.025;
    });

    // Draw connections with animated signals
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist > CONN_DIST) continue;

        const opacity = (1 - dist / CONN_DIST) * (light ? 0.12 : 0.18);

        // Static connection line
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(${connColor.join(',')},${opacity})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();

        // Travelling pulse signal along connection
        const phasedT = (t + i * 0.3 + j * 0.17) % (Math.PI * 2);
        const progress = (Math.sin(phasedT) + 1) / 2;
        const px = a.x + dx * progress;
        const py = a.y + dy * progress;

        if (opacity > 0.05) {
          const grad = ctx.createRadialGradient(px, py, 0, px, py, 5);
          grad.addColorStop(0, `rgba(${pulseColor.join(',')},${opacity * 3})`);
          grad.addColorStop(1, `rgba(${pulseColor.join(',')},0)`);
          ctx.beginPath();
          ctx.arc(px, py, 5, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }
      }
    }

    // Draw nodes (neurons)
    nodes.forEach(n => {
      const glow = 0.6 + 0.4 * Math.sin(n.pulse);
      const baseAlpha = light ? 0.5 : 0.75;

      // Outer glow ring
      const outerGrad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 4);
      outerGrad.addColorStop(0, `rgba(${nodeColor.join(',')},${glow * baseAlpha * 0.35})`);
      outerGrad.addColorStop(1, `rgba(${nodeColor.join(',')},0)`);
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2);
      ctx.fillStyle = outerGrad;
      ctx.fill();

      // Core node
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${nodeColor.join(',')},${glow * baseAlpha})`;
      ctx.fill();
    });

    animId = requestAnimationFrame(draw);
  }

  resize(); draw();
  window.addEventListener('resize', () => { cancelAnimationFrame(animId); resize(); });
})();


/* ---- SCROLL REVEAL ---- */
(function () {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const siblings = Array.from(e.target.parentElement.querySelectorAll('.reveal'));
      const idx = siblings.indexOf(e.target);
      e.target.style.transitionDelay = `${idx * 0.06}s`;
      e.target.classList.add('visible');
      obs.unobserve(e.target);
    });
  }, { threshold: 0.08 });
  els.forEach(el => obs.observe(el));
})();


/* ---- NAVBAR ---- */
(function () {
  const nav = document.getElementById('navbar');
  const ham = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 55);
  });

  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    links.classList.toggle('open');
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      ham.classList.remove('open');
      links.classList.remove('open');
    });
  });
})();


/* ---- THEME TOGGLE — Advanced Morphing Animation ---- */
(function () {
  const btn  = document.getElementById('theme-btn');
  const icon = document.getElementById('theme-icon');
  const html = document.documentElement;

  const stored = localStorage.getItem('jv-theme') || 'dark';
  html.setAttribute('data-theme', stored);
  icon.textContent = stored === 'dark' ? '🌙' : '☀️';

  btn.addEventListener('click', () => {
    const isDark = html.getAttribute('data-theme') === 'dark';
    const next   = isDark ? 'light' : 'dark';

    // 1. Burst ripple from button center
    const rect = btn.getBoundingClientRect();
    const burst = document.createElement('div');
    burst.className = 'theme-burst';
    burst.style.left = rect.left + rect.width / 2 + 'px';
    burst.style.top  = rect.top  + rect.height / 2 + 'px';
    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 800);

    // 2. Particles exploding from button
    for (let i = 0; i < 8; i++) {
      const p = document.createElement('div');
      p.className = 'theme-particle';
      const angle  = (i / 8) * 360;
      const dist   = 40 + Math.random() * 30;
      const dx = Math.cos(angle * Math.PI / 180) * dist;
      const dy = Math.sin(angle * Math.PI / 180) * dist;
      p.style.cssText = `left:${rect.left + rect.width/2}px;top:${rect.top + rect.height/2}px;--dx:${dx}px;--dy:${dy}px;background:${isDark ? '#f59e0b' : '#a78bfa'}`;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 700);
    }

    // 3. Full page sweep transition
    const sweep = document.createElement('div');
    sweep.className = 'theme-sweep';
    sweep.style.background = isDark
      ? 'linear-gradient(135deg, #faf8ff, #f2eeff)'
      : 'linear-gradient(135deg, #0f0f1a, #13131f)';
    document.body.appendChild(sweep);
    setTimeout(() => sweep.remove(), 700);

    // 4. Icon morph
    icon.style.transition = 'transform 0.5s cubic-bezier(0.34,1.8,0.64,1), opacity 0.15s, filter 0.3s';
    icon.style.transform  = 'rotate(720deg) scale(0)';
    icon.style.opacity    = '0';
    icon.style.filter     = 'blur(4px)';

    setTimeout(() => {
      html.setAttribute('data-theme', next);
      icon.textContent = next === 'dark' ? '🌙' : '☀️';
      localStorage.setItem('jv-theme', next);
      icon.style.transform = 'rotate(0deg) scale(1)';
      icon.style.opacity   = '1';
      icon.style.filter    = 'blur(0px)';
    }, 220);
  });
})();


/* ---- ACTIVE NAV HIGHLIGHT ---- */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => {
          l.classList.remove('active');
          if (l.getAttribute('href') === `#${e.target.id}`) l.classList.add('active');
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => obs.observe(s));
})();


/* ---- GITHUB STATS ---- */
(function () {
  const USERNAME = 'jatinvohra11';

  async function load() {
    try {
      const [uRes, rRes] = await Promise.all([
        fetch(`https://api.github.com/users/${USERNAME}`),
        fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100`)
      ]);
      if (!uRes.ok) throw new Error();

      const u = await uRes.json();
      const repos = rRes.ok ? await rRes.json() : [];

      document.getElementById('gh-repos').textContent = u.public_repos || '—';
      document.getElementById('gh-followers').textContent = u.followers || '—';

      if (Array.isArray(repos)) {
        const stars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
        document.getElementById('gh-stars').textContent = stars;

        const langs = {};
        repos.forEach(r => { if (r.language) langs[r.language] = (langs[r.language] || 0) + 1; });
        const top = Object.entries(langs).sort((a, b) => b[1] - a[1])[0];
        if (top) document.getElementById('gh-lang').textContent = top[0];
      }
    } catch {
      document.getElementById('gh-repos').textContent = '12+';
      document.getElementById('gh-followers').textContent = '25+';
      document.getElementById('gh-stars').textContent = '8+';
    }

    const img = document.getElementById('github-contrib');
    if (img) img.src = `https://ghchart.rshah.org/a78bfa/${USERNAME}`;
  }

  load();
})();


/* ---- FLOATING CHATBOT ---- */
(function () {
  const fab      = document.getElementById('chat-fab');
  const popup    = document.getElementById('chat-popup');
  const closeBtn = document.getElementById('chat-popup-close');
  const box      = document.getElementById('chat-messages');
  const inp      = document.getElementById('chat-input');
  const sug      = document.getElementById('chat-suggestions');

  function openChat() { popup.classList.add('open'); fab.classList.add('open'); inp.focus(); }
  function closeChat() { popup.classList.remove('open'); fab.classList.remove('open'); }

  fab.addEventListener('click', () => { popup.classList.contains('open') ? closeChat() : openChat(); });
  closeBtn.addEventListener('click', closeChat);
  document.addEventListener('click', e => { if (!popup.contains(e.target) && !fab.contains(e.target)) closeChat(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeChat(); });

  const KB = {
    intro:    "Hey! 👋 I'm Jatin's AI assistant.\nAsk me anything — his age, projects, skills, hobbies, background, or how to hire him!",
    who:      "Jatin Vohra is a 21-year-old AI Developer & CSE student at Lovely Professional University, Punjab.\n\nHe builds intelligent systems — RAG pipelines, AI chatbots, full-stack web apps. Currently open to internships & full-time AI/ML roles! 🚀",
    age:      "Jatin is 21 years old! 🎂\n\nAt 21, he's already shipped 3 complete AI projects:\n1️⃣ Event Reminder System\n2️⃣ Gemini-powered Startup Chatbot\n3️⃣ RAG-based AI Assistant with FAISS + Ollama\n\nPretty impressive for 21, right? 😄",
    about:    "Quick snapshot of Jatin 👇\n\n🧑‍💻 Name: Jatin Vohra\n📅 Age: 21 years\n🎓 B.Tech CSE — LPU (2023–2027)\n📍 Punjab, India\n💼 AI Developer | Full Stack Dev\n\nDriven by one belief: AI is the most transformative tool of our time — and he wants to be one of the builders, not just a user.",
    projects: "Jatin has shipped 3 real AI projects 🚀\n\n1️⃣ Event Reminder System\n   Flask web app with auth, CRUD & notifications\n\n2️⃣ Startup Advisor Chatbot\n   Gemini API + voice input + dark mode + chat history\n\n3️⃣ RAG-Based AI Assistant (EDUQX)\n   FAISS vector search + Ollama Phi-3 + hallucination guardrails\n   For NCERT Class 9-12 content",
    technologies: "Jatin's tech stack 💻\n\n🐍 Languages: Python, Java, Kotlin, C++, SQL\n⚡ Frameworks: Flask, HTML, CSS, JavaScript\n🧠 AI/ML: FAISS, Gemini API, Ollama, RAG, sentence-transformers\n🛢 DBs: MySQL, FAISS Vector DB\n🛠 Tools: Git, GitHub, VS Code, Power BI\n📱 Mobile: Kotlin + Jetpack Compose\n\nLearning: FastAPI, Docker, prompt engineering",
    skills:   "Core skills 💡\n\nTechnical:\n• RAG systems & LLM integration\n• Vector databases (FAISS)\n• Python, Flask, REST APIs\n• Full-stack web dev\n• Android (Kotlin)\n\nSoft Skills:\n• Critical Thinking & Problem Solving\n• Quick Learner — adapts fast\n• Strong communicator",
    education: "Academic Background 🎓\n\n🏛 B.Tech CSE — LPU (2023–2027)\n   Lovely Professional University, Punjab\n\n📚 Class XII — 70%\n   Grand Columbus International School\n\n📚 Class X — 80%\n   St. Peter's Convent School",
    experience: "Experience 💼\n\n🖥 Online Exam Proctor — LPU (Dec 2025–Present)\n   AI-assisted proctoring, academic integrity, student support\n\n🌱 Volunteer — Anmol Social & Welfare Society\n   Food & clothing drives, tree plantation, community events",
    certifications: "Certifications 🏆\n\n☁️ Cloud Computing — NPTEL\n🤖 Build Generative AI Apps — Infosys Springboard\n📊 Job Ready Data Science — CodewithHarry\n⚙️ DSA with Java — Apna College",
    hobbies:  "Jatin beyond the code 🎯\n\n🎮 Competitive programming & LeetCode\n🎵 Lo-fi music while coding late night\n📹 YouTube: '1 Minute Coding Gyaan' (quick dev tips!)\n🌱 Volunteering with Anmol Social & Welfare Society\n🤖 Experimenting with new LLMs & AI papers\n📱 Building Android apps as side projects\n☕ Coffee + Code = Jatin's formula 😄",
    location: "📍 Punjab, India\n\nJatin studies at LPU in Phagwara, Punjab.\nOpen to remote roles globally & relocation for the right opportunity! 🌍",
    contact:  "Reach Jatin 📬\n\n📧 jatinvohra792@gmail.com\n💼 linkedin.com/in/jatinvohra11\n🐙 github.com/jatinvohra11\n\nOr use the Contact form on this page — he responds within 24 hours! ⚡",
    hire:     "Yes! Jatin is actively looking 🚀\n\nLooking for:\n• AI/ML Engineering roles (intern or full-time)\n• Backend dev (Python/Flask/Java)\n• Full-stack with AI integration\n• Remote & on-site both OK\n\nWhy hire him?\n✅ 3 real AI projects shipped\n✅ Hands-on: RAG, LLMs, vector DBs\n✅ 21 y/o with strong fundamentals\n✅ Fast learner who ships\n\nContact via form or LinkedIn! 💼",
    fun:      "Fun facts about Jatin 🎉\n\n🦉 Night owl — most productive after 10 PM\n☕ Runs on coffee while building AI systems\n🤖 Genuinely believes AI will change everything\n📹 YouTube channel with coding tips (no face cam!)\n🌱 Volunteers on weekends\n🎯 Dream: Ship an AI product with 1000+ real users\n💬 Motto: Build things, break things, learn things!",
    default:  "Hmm, didn't catch that! 🤔\n\nTry asking:\n• 'Who is Jatin?' or 'How old is he?'\n• 'What projects has he built?'\n• 'What's his tech stack?'\n• 'What are his hobbies?'\n• 'How to contact him?'\n• 'Why should I hire him?'\n\nJust ask naturally — I understand! 😊"
  };

  function respond(msg) {
    const m = msg.toLowerCase().trim();

    if (/^(hi|hello|hey|hii|helo|namaste|yo|sup|howdy)/.test(m)) return KB.intro;
    if (m.includes('fun') || m.includes('fact') || m.includes('interest') || m.includes('cool') || m.includes('surprise')) return KB.fun;
    if (m.includes('age') || m.includes(' old') || m.includes('born') || m.includes('kitne') || m.includes('saal') || m === '21' || m.includes('how old') || m.includes('umar')) return KB.age;
    if (m.includes('where') || m.includes('location') || m.includes('city') || m.includes('india') || m.includes('punjab') || m.includes('from where') || m.includes('belong')) return KB.location;
    if (m.includes('who is') || m.includes('who are') || m.includes('introduce') || m.includes('about jatin') || m.includes('tell me')) return KB.who;
    if (m.includes('about') || m.includes('background') || m.includes('overview') || m.includes('summary') || m.includes('describe')) return KB.about;
    if (m.includes('project') || m.includes('built') || m.includes('build') || m.includes('made') || m.includes('app') || m.includes('develop') || m.includes('rag') || m.includes('chatbot')) return KB.projects;
    if (m.includes('tech') || m.includes('stack') || m.includes('language') || m.includes('framework') || m.includes('python') || m.includes('java') || m.includes('flask') || m.includes('tool') || m.includes('use karta')) return KB.technologies;
    if (m.includes('hire') || m.includes('job') || m.includes('intern') || m.includes('recruit') || m.includes('work with') || m.includes('opportunity') || m.includes('available') || m.includes('employ')) return KB.hire;
    if (m.includes('cert') || m.includes('course') || m.includes('nptel') || m.includes('infosys') || m.includes('apna') || m.includes('award') || m.includes('achiev')) return KB.certifications;
    if (m.includes('skill') || m.includes('know') || m.includes('expert') || m.includes('good at') || m.includes('capable') || m.includes('abilit')) return KB.skills;
    if (m.includes('edu') || m.includes('degree') || m.includes('lpu') || m.includes('university') || m.includes('college') || m.includes('school') || m.includes('study') || m.includes('class') || m.includes('marks') || m.includes('cgpa')) return KB.education;
    if (m.includes('experience') || m.includes('proctor') || m.includes('volunteer') || m.includes('anmol') || m.includes('work') || m.includes('internship done')) return KB.experience;
    if (m.includes('hobby') || m.includes('hobbies') || m.includes('free time') || m.includes('like to') || m.includes('enjoy') || m.includes('passion') || m.includes('youtube') || m.includes('music') || m.includes('game') || m.includes('coding gyaan') || m.includes('spare')) return KB.hobbies;
    if (m.includes('contact') || m.includes('reach') || m.includes('email') || m.includes('linkedin') || m.includes('github') || m.includes('message') || m.includes('connect') || m.includes('dm')) return KB.contact;

    return KB.default;
  }

  function scrollBottom() {
    requestAnimationFrame(() => {
      box.scrollTop = box.scrollHeight;
      setTimeout(() => { box.scrollTop = box.scrollHeight; }, 60);
    });
  }

  function append(text, type) {
    const d = document.createElement('div');
    d.className = `bubble ${type}`;
    d.textContent = text;
    box.appendChild(d);
    scrollBottom();
  }

  function showTyping() {
    const d = document.createElement('div');
    d.className = 'typing-bubble'; d.id = 'typ';
    d.innerHTML = '<span></span><span></span><span></span>';
    box.appendChild(d);
    scrollBottom();
  }

  function send(text) {
    const msg = (text || inp.value).trim();
    if (!msg) return;
    append(msg, 'user');
    inp.value = '';
    sug.style.display = 'none';
    showTyping();
    setTimeout(() => {
      const t = document.getElementById('typ');
      if (t) t.remove();
      append(respond(msg), 'bot');
    }, 600 + Math.random() * 300);
  }

  window.sendChat    = () => send();
  window.sendSuggest = el => send(el.textContent);
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
})();


/* ---- CONTACT FORM — Formspree → jatinvohra792@gmail.com ---- */
window.submitForm = async function (e) {
  e.preventDefault();
  const form    = e.target;
  const btn     = document.getElementById('form-submit');
  const success = document.getElementById('form-success');

  btn.textContent = 'Sending...';
  btn.disabled = true;

  try {
    const res = await fetch('https://formspree.io/f/mreyjggv', {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      form.style.display = 'none';
      success.style.display = 'flex';
      form.reset();
    } else {
      throw new Error();
    }
  } catch {
    // Fallback: open email client
    const name    = form.querySelector('[name="name"]').value;
    const email   = form.querySelector('[name="email"]').value;
    const message = form.querySelector('[name="message"]').value;
    const sub  = encodeURIComponent('Portfolio Contact from ' + name);
    const body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message);
    window.location.href = 'mailto:jatinvohra792@gmail.com?subject=' + sub + '&body=' + body;
    btn.textContent = '✓ Opening Email...';
    setTimeout(() => { btn.textContent = 'Send Message ✦'; btn.disabled = false; }, 2500);
  }
};


/* ---- CURSOR GLOW (desktop only) ---- */
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const g = document.createElement('div');
  g.style.cssText = `
    position:fixed;pointer-events:none;z-index:9998;
    width:380px;height:380px;border-radius:50%;
    background:radial-gradient(circle, rgba(124,92,252,0.06) 0%, transparent 70%);
    transform:translate(-50%,-50%);
    transition:left 0.1s ease,top 0.1s ease;
    top:-200px;left:-200px;
  `;
  document.body.appendChild(g);
  document.addEventListener('mousemove', e => {
    g.style.left = e.clientX + 'px';
    g.style.top = e.clientY + 'px';
  });
})();


/* ---- BLOG MODAL ---- */
const BLOGS = [
  {
    tag: 'AI / LLMs',
    title: 'Building a RAG System from Scratch: What I Learned',
    date: 'March 2025',
    readTime: '5 min read',
    content: `
      <p>When I first started building EDUQX — my RAG-based AI assistant for NCERT content — I had no idea how complex retrieval-augmented generation would get. Here's everything I learned the hard way.</p>
      <h2>What Even Is RAG?</h2>
      <p>RAG (Retrieval-Augmented Generation) is a technique where instead of relying solely on an LLM's training data, you fetch relevant documents from an external knowledge base and inject them into the prompt as context. The result? Accurate, grounded answers — no hallucinations.</p>
      <div class="article-callout">💡 Think of it like an open-book exam vs. a closed-book one. RAG gives the model the "book" at query time.</div>
      <h2>Step 1 — Ingesting PDFs</h2>
      <p>The first challenge was extracting clean text from NCERT PDFs. Raw PDF extraction is messy — headers, footers, and page numbers all sneak in. I used <code>pdfplumber</code> and wrote custom logic to strip noise.</p>
      <h2>Step 2 — Chunking Strategy</h2>
      <p>This is where most tutorials gloss over the hardest part. Chunk too small and you lose context. Chunk too large and retrieval quality drops. After testing, I settled on:</p>
      <ul>
        <li>Chunk size: 400 tokens with 60-token overlap</li>
        <li>Semantic chunking — split at paragraph boundaries, not arbitrary character counts</li>
        <li>Metadata tagging each chunk with chapter and subject</li>
      </ul>
      <h2>Step 3 — Embedding & FAISS Indexing</h2>
      <p>I used <code>sentence-transformers</code> with the <code>all-MiniLM-L6-v2</code> model to generate embeddings. FAISS IndexFlatL2 gave me fast similarity search even on 10,000+ chunks.</p>
      <pre><code>from sentence_transformers import SentenceTransformer
import faiss, numpy as np

model = SentenceTransformer('all-MiniLM-L6-v2')
embeddings = model.encode(chunks)
index = faiss.IndexFlatL2(384)
index.add(np.array(embeddings))</code></pre>
      <h2>Key Takeaways</h2>
      <ul>
        <li>Chunking strategy matters more than your embedding model choice</li>
        <li>Always test retrieval quality independently before hooking up the LLM</li>
        <li>Prompt engineering is 50% of a good RAG system</li>
        <li>Local LLMs (Ollama + Phi-3) are surprisingly capable for domain-specific RAG</li>
      </ul>
      <hr class="article-divider"/>
      <p>Building EDUQX taught me that RAG is less about ML and more about data engineering and prompt design. If you're starting out — nail the chunking first, everything else follows.</p>
    `
  },
  {
    tag: 'Career',
    title: 'How I Built 3 AI Projects While in College',
    date: 'February 2025',
    readTime: '4 min read',
    content: `
      <p>Being a CS student at LPU while simultaneously building real-world AI projects isn't easy. Here's my honest breakdown of how I made it work — and what I'd do differently.</p>
      <h2>The Mindset Shift: Projects Over Grades</h2>
      <p>I'm not saying grades don't matter — they do. But the projects on your CV are what get you the interview. A 7.5 CGPA with 3 strong AI projects beats a 9.0 with zero projects, every single time in tech interviews.</p>
      <div class="article-callout">🎯 Every project I built was chosen with one question in mind: "Does this make me more hireable in AI/ML?"</div>
      <h2>Time Management: My System</h2>
      <ul>
        <li><strong>Weekday evenings (8–11 PM):</strong> 2–3 hours of focused project work</li>
        <li><strong>Saturday mornings:</strong> Learning new concepts, watching tutorials</li>
        <li><strong>Sunday:</strong> Reviewing progress, planning next week</li>
        <li>No social media during work blocks — phone in another room</li>
      </ul>
      <hr class="article-divider"/>
      <p>Three projects in one year while attending college is absolutely doable. The key is consistency over intensity — 2 focused hours every night beats a 12-hour weekend session every time.</p>
    `
  },
  {
    tag: 'Python',
    title: 'Flask vs FastAPI: My Honest Take After Building Both',
    date: 'January 2025',
    readTime: '6 min read',
    content: `
      <p>I've built production apps with both Flask and FastAPI. After using both in real projects — not just tutorials — here's my unfiltered comparison.</p>
      <h2>The Quick Answer</h2>
      <div class="article-callout">Use <strong>Flask</strong> if you're building a small web app with templates and forms.<br/>Use <strong>FastAPI</strong> if you're building an API that needs to be fast, well-documented, and type-safe.</div>
      <h2>Flask: Where It Shines</h2>
      <ul>
        <li>Zero configuration to get started</li>
        <li>Jinja2 templating built-in — great for server-rendered UIs</li>
        <li>Massive ecosystem of extensions</li>
        <li>Gentle learning curve — perfect for beginners</li>
      </ul>
      <h2>FastAPI: Where It Shines</h2>
      <ul>
        <li>Automatic API documentation (Swagger UI at <code>/docs</code>)</li>
        <li>Type hints enforced via Pydantic — fewer bugs</li>
        <li>Async support out of the box</li>
        <li>Much faster than Flask for I/O heavy tasks</li>
      </ul>
      <hr class="article-divider"/>
      <p>Both are excellent frameworks. I still use Flask for quick projects and FastAPI for anything that needs to scale. Learn Flask first — then FastAPI will make much more sense.</p>
    `
  }
];

window.openBlog = function(index) {
  const blog = BLOGS[index];
  const overlay = document.getElementById('blog-modal-overlay');
  const modalContent = document.getElementById('blog-modal-content');
  const modal = document.getElementById('blog-modal');

  modalContent.innerHTML = `
    <span class="article-tag">${blog.tag}</span>
    <h1 class="article-title">${blog.title}</h1>
    <div class="article-meta">
      <span>📅 ${blog.date}</span>
      <span>⏱ ${blog.readTime}</span>
      <span>✍️ Jatin Vohra</span>
    </div>
    <div class="article-body">${blog.content}</div>
  `;

  modal.scrollTop = 0;
  requestAnimationFrame(() => {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
};

window.closeBlog = function() {
  const overlay = document.getElementById('blog-modal-overlay');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
};

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') window.closeBlog();
});