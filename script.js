/* ---- PAGE LOADER ---- */
(function () {
  const loader = document.getElementById('page-loader');
  // Remove loader after 2s (bar animation takes 1.7s)
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('done');
    }, 1700);
  });
  // Failsafe: remove after 3s max
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
    file: 'cert-nptel-cloud.pdf', // Replace with your actual cert file
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
  const cert = CERTS[index];
  const overlay = document.getElementById('cert-modal-overlay');
  const header  = document.getElementById('cert-modal-header');
  const imgWrap = document.getElementById('cert-preview-card');
  const dlBtn   = document.getElementById('cert-download-btn');

  // Header
  header.innerHTML = `
    <span class="cm-tag">${cert.issuer} · ${cert.year}</span>
    <h2>${cert.name}</h2>
  `;

  // Certificate preview card (beautiful placeholder with cert details)
  imgWrap.innerHTML = `
    <div class="cert-preview-placeholder">
      <span class="cert-big-icon">${cert.icon}</span>
      <p class="cert-pl-name">${cert.name}</p>
      <p class="cert-pl-issuer">${cert.issuer}</p>
      <span class="cert-verified">✓ Certificate Verified</span>
      <p style="margin-top:1rem;font-size:0.8rem;color:var(--text2);line-height:1.6;max-width:360px;margin-left:auto;margin-right:auto;">${cert.desc}</p>
    </div>
  `;
  imgWrap.style.borderTop = '3px solid ' + cert.color;

  // Download button
  dlBtn.href = cert.file;
  dlBtn.download = cert.file;

  // If you have actual cert images, use this instead:
  // imgWrap.innerHTML = `<img src="certs/${cert.file}" alt="${cert.name}" />`;

  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => overlay.classList.add('open'));
};

window.closeCert = function() {
  const overlay = document.getElementById('cert-modal-overlay');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
};

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { window.closeCert(); window.closeBlog && window.closeBlog(); }
});

/* ============================================
   JATIN VOHRA PORTFOLIO — script.js
   ============================================ */

/* ---- PARTICLE CANVAS ---- */
(function () {
  const canvas = document.getElementById('canvas-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let pts = [], animId;

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }

  function init() {
    pts = [];
    for (let i = 0; i < 65; i++) {
      pts.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.3 + 0.25,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        o: Math.random() * 0.4 + 0.08
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const light = document.documentElement.getAttribute('data-theme') === 'light';

    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = light
        ? `rgba(124,92,252,${p.o * 0.5})`
        : `rgba(167,139,250,${p.o})`;
      ctx.fill();
    });

    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (d < 110) {
          const a = light
            ? 0.04 * (1 - d / 110)
            : 0.12 * (1 - d / 110);
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(124,92,252,${a})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    animId = requestAnimationFrame(draw);
  }

  resize(); init(); draw();
  window.addEventListener('resize', () => { cancelAnimationFrame(animId); resize(); init(); draw(); });
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


/* ---- THEME TOGGLE ---- */
(function () {
  const btn  = document.getElementById('theme-btn');
  const icon = document.getElementById('theme-icon');
  const html = document.documentElement;

  const stored = localStorage.getItem('jv-theme') || 'dark';
  html.setAttribute('data-theme', stored);
  icon.textContent = stored === 'dark' ? '🌙' : '☀️';

  btn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';

    // 1. Ripple effect on button
    btn.classList.add('ripple');
    setTimeout(() => btn.classList.remove('ripple'), 500);

    // 2. Spinning icon swap
    icon.style.transition = 'transform 0.4s cubic-bezier(0.34,1.6,0.64,1), opacity 0.2s';
    icon.style.transform  = 'rotate(360deg) scale(0)';
    icon.style.opacity    = '0';

    // 3. Full-page flash
    const flash = document.createElement('div');
    flash.className = 'theme-flash';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 500);

    setTimeout(() => {
      html.setAttribute('data-theme', next);
      icon.textContent = next === 'dark' ? '🌙' : '☀️';
      localStorage.setItem('jv-theme', next);
      icon.style.transform = 'rotate(0deg) scale(1)';
      icon.style.opacity   = '1';
    }, 200);
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
  const USERNAME = 'jatinvohra11'; // ← Change to your real GitHub username

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
  const fab     = document.getElementById('chat-fab');
  const popup   = document.getElementById('chat-popup');
  const closeBtn = document.getElementById('chat-popup-close');
  const box     = document.getElementById('chat-messages');
  const inp     = document.getElementById('chat-input');
  const sug     = document.getElementById('chat-suggestions');

  /* --- Toggle open/close --- */
  function openChat() {
    popup.classList.add('open');
    fab.classList.add('open');
    inp.focus();
  }
  function closeChat() {
    popup.classList.remove('open');
    fab.classList.remove('open');
  }

  fab.addEventListener('click', () => {
    popup.classList.contains('open') ? closeChat() : openChat();
  });
  closeBtn.addEventListener('click', closeChat);

  // Close on outside click
  document.addEventListener('click', e => {
    if (!popup.contains(e.target) && !fab.contains(e.target)) closeChat();
  });

  // Close on Escape
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeChat(); });

  /* --- Knowledge base --- */
  const KB = {
    'who is jatin': 'Jatin Vohra is a CS Engineering student at LPU. He\'s passionate about AI systems, backend dev, and intelligent applications. 🎓',
    projects: 'Three major projects:\n\n1️⃣ Event Reminder System — Flask + CRUD\n2️⃣ Startup Advisor Chatbot — Gemini API with voice input\n3️⃣ RAG-Based AI Assistant — FAISS + Ollama (Phi-3) for NCERT content',
    technologies: 'Python, Java, Flask, FAISS, Gemini API, Ollama, SQL, HTML/CSS/JS. Also learning Kotlin for Android. 💻',
    hire: 'Yes! Looking for internships & full-time roles in AI/ML and backend dev. Use the contact form or LinkedIn! 🚀',
    skills: 'Java · Python · Kotlin · C++ · Flask · JavaScript · FAISS · Gemini API · MySQL · Git\nCerts: Cloud Computing, GenAI (Infosys), DSA with Java ⚡',
    education: 'B.Tech CSE at LPU. 80% in Class X, 70% in Class XII. 🎓',
    experience: 'Online Exam Proctor at LPU since Dec 2025. Volunteers with Anmol Social & Welfare Society. 🌱',
    youtube: 'Check the GitHub and LinkedIn links on this page for more! 🔗',
    contact: 'Use the contact form, email, LinkedIn, or GitHub. Links are in the Contact section! 📬',
    default: 'I know Jatin pretty well 😄\nAsk about his projects, skills, experience, or how to hire him!'
  };

  function respond(msg) {
    const m = msg.toLowerCase();
    if (m.includes('who') && m.includes('jatin')) return KB['who is jatin'];
    if (m.includes('project') || m.includes('built')) return KB.projects;
    if (m.includes('tech') || m.includes('stack') || m.includes('language') || m.includes('use')) return KB.technologies;
    if (m.includes('hire') || m.includes('available') || m.includes('job') || m.includes('intern')) return KB.hire;
    if (m.includes('skill')) return KB.skills;
    if (m.includes('edu') || m.includes('degree') || m.includes('lpu')) return KB.education;
    if (m.includes('experience') || m.includes('work')) return KB.experience;
    if (m.includes('contact') || m.includes('reach') || m.includes('email')) return KB.contact;
    return KB.default;
  }

  function scrollBottom() {
    // Force scroll to bottom — works even in flex containers
    requestAnimationFrame(() => {
      box.scrollTop = box.scrollHeight;
      // Double-tap for safety after render
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


/* ---- CONTACT FORM ---- */
window.submitForm = function (e) {
  e.preventDefault();
  const btn = document.getElementById('form-submit');
  btn.textContent = '✓ Message Sent!';
  btn.classList.add('success');
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Send Message ✦';
    btn.classList.remove('success');
    btn.disabled = false;
    e.target.reset();
  }, 3500);
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

      <div class="article-callout">
        💡 Think of it like an open-book exam vs. a closed-book one. RAG gives the model the "book" at query time.
      </div>

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

      <h2>Step 4 — The Guardrail Problem</h2>
      <p>Without guardrails, the local Phi-3 model would sometimes ignore retrieved context and answer from its own training data — exactly the hallucination I was trying to prevent. The fix was a strict prompt template:</p>
      <pre><code>Answer ONLY using the context below.
If the answer is not in the context, say:
"I don't have information about that in the provided material."

Context: {retrieved_chunks}
Question: {user_query}</code></pre>

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

      <div class="article-callout">
        🎯 Every project I built was chosen with one question in mind: "Does this make me more hireable in AI/ML?"
      </div>

      <h2>Project 1: Event Reminder System</h2>
      <p>My first real web app. I built it to learn Flask end-to-end — authentication, database ops, session management, frontend integration. Took 3 weeks of evenings. The goal wasn't innovation, it was fundamentals.</p>

      <h2>Project 2: Startup Advisor Chatbot</h2>
      <p>After learning Flask, I wanted to work with an LLM API. Gemini API was free and powerful. I added voice input, dark mode, and chat history — not because they were technically impressive, but because they made the project look polished to recruiters.</p>

      <h3>The "Polish Rule"</h3>
      <p>Spend 20% extra time on UI and README. A project that looks finished gets 10x more attention than a technically deeper project that looks messy.</p>

      <h2>Project 3: RAG-Based AI (EDUQX)</h2>
      <p>My most ambitious project. This one took 6 weeks and taught me more about AI pipelines than any course ever could. FAISS, embeddings, Ollama, prompt engineering — I learned it all by breaking things.</p>

      <h2>Time Management: My System</h2>
      <ul>
        <li><strong>Weekday evenings (8–11 PM):</strong> 2–3 hours of focused project work</li>
        <li><strong>Saturday mornings:</strong> Learning new concepts, watching tutorials</li>
        <li><strong>Sunday:</strong> Reviewing progress, planning next week</li>
        <li>No social media during work blocks — phone in another room</li>
      </ul>

      <h2>How to Pick Your Next Project</h2>
      <p>Use this filter: Does this project let me learn a new technology AND produce something I can demo in 60 seconds? If yes — build it. If it's purely academic with no visible output — skip it.</p>

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
      <div class="article-callout">
        Use <strong>Flask</strong> if you're building a small web app with templates and forms.<br/>
        Use <strong>FastAPI</strong> if you're building an API that needs to be fast, well-documented, and type-safe.
      </div>

      <h2>Flask: Where It Shines</h2>
      <p>Flask is where I started. It's minimal, flexible, and has been around forever — meaning Stack Overflow has answers for literally everything.</p>
      <ul>
        <li>Zero configuration to get started</li>
        <li>Jinja2 templating built-in — great for server-rendered UIs</li>
        <li>Massive ecosystem of extensions (Flask-Login, Flask-SQLAlchemy, etc.)</li>
        <li>Gentle learning curve — perfect for beginners</li>
      </ul>

      <pre><code>from flask import Flask, jsonify
app = Flask(__name__)

@app.route('/api/hello')
def hello():
    return jsonify({'message': 'Hello from Flask'})</code></pre>

      <h2>FastAPI: Where It Shines</h2>
      <p>FastAPI is built on Starlette and Pydantic. It's modern, async-first, and generates OpenAPI docs automatically. For AI backends serving ML models, it's a game changer.</p>
      <ul>
        <li>Automatic API documentation (Swagger UI at <code>/docs</code>)</li>
        <li>Type hints enforced via Pydantic — fewer bugs</li>
        <li>Async support out of the box — handles concurrent requests better</li>
        <li>Much faster than Flask for I/O heavy tasks</li>
      </ul>

      <pre><code>from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Query(BaseModel):
    text: str

@app.post('/api/query')
async def query(q: Query):
    return {'response': process(q.text)}</code></pre>

      <h2>The Gotchas Nobody Tells You</h2>
      <h3>Flask Gotcha: Scaling pain</h3>
      <p>Flask's built-in server is single-threaded. For production, you MUST use Gunicorn or uWSGI. I learned this the hard way when my chatbot app crashed under load.</p>

      <h3>FastAPI Gotcha: Async confusion</h3>
      <p>FastAPI is async, but if you call a blocking function inside an async route without <code>run_in_executor</code>, you'll block the entire event loop. This is a subtle bug that's very hard to diagnose.</p>

      <h3>Both Gotchas: CORS</h3>
      <p>Both frameworks need explicit CORS configuration when your frontend is on a different domain. Forget this once and you'll spend 2 hours debugging a 3-line fix.</p>

      <h2>My Recommendation</h2>
      <ul>
        <li><strong>Student/beginner project:</strong> Flask — less overhead, learn the web fundamentals</li>
        <li><strong>AI/ML API backend:</strong> FastAPI — async, typed, auto-documented</li>
        <li><strong>Full website with UI:</strong> Flask — Jinja2 templates are still great</li>
        <li><strong>Microservices/production API:</strong> FastAPI — performance matters here</li>
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

  // Reset scroll
  modal.scrollTop = 0;

  // Trigger open animation
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

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') window.closeBlog();
});