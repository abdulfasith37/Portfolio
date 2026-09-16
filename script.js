const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const theme = document.querySelector('.theme-toggle');

menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', open);
});

document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', () => nav.classList.remove('open'));
});

theme.addEventListener('click', () => {
  document.body.classList.toggle('light');
  theme.textContent = document.body.classList.contains('light') ? '☾' : '☼';
  localStorage.setItem('portfolio-theme', document.body.classList.contains('light') ? 'light' : 'dark');
});

if (localStorage.getItem('portfolio-theme') === 'light') {
  document.body.classList.add('light');
  theme.textContent = '☾';
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: .12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

document.getElementById('year').textContent = new Date().getFullYear();

const glow = document.querySelector('.cursor-glow');
document.addEventListener('pointermove', e => {
  glow.style.left = `${e.clientX}px`;
  glow.style.top = `${e.clientY}px`;
});

function loadCvImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function addWrapped(doc, text, x, y, width, size = 9, color = [55, 65, 75], lineGap = 4.2) {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(size);
  doc.setTextColor(...color);
  const lines = doc.splitTextToSize(text, width);
  doc.text(lines, x, y);
  return y + lines.length * lineGap;
}

function cvSection(doc, title, x, y, width) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 104, 160);
  doc.text(title.toUpperCase(), x, y);
  doc.setDrawColor(214, 224, 232);
  doc.setLineWidth(0.35);
  doc.line(x, y + 2.5, x + width, y + 2.5);
  return y + 9;
}

function cvTag(doc, text, x, y) {
  const w = Math.min(52, doc.getTextWidth(text) + 7);
  doc.setFillColor(239, 248, 253);
  doc.roundedRect(x, y - 4.5, w, 7, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(22, 102, 150);
  doc.text(text, x + 3.5, y);
  return x + w + 3;
}

function cvFooter(doc, page) {
  doc.setDrawColor(222, 228, 234);
  doc.setLineWidth(0.3);
  doc.line(16, 286, 194, 286);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(125, 135, 145);
  doc.text('N. Abdul Fasith  •  Portfolio CV', 16, 291);
  doc.text('Page ' + page, 178, 291);
}

async function generateCV() {
  if (!window.jspdf) {
    alert('CV generator is loading. Please try again in a moment.');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  const navy = [7, 20, 35];
  const accent = [19, 151, 214];
  const ink = [27, 37, 48];
  const muted = [94, 105, 116];

  let photo = null;
  try { photo = await loadCvImage('assets/profile.png'); } catch (e) {}

  // PAGE 1 — premium two-column corporate layout
  doc.setFillColor(...navy);
  doc.rect(0, 0, 210, 48, 'F');
  doc.setFillColor(...accent);
  doc.rect(0, 46, 210, 2, 'F');

  if (photo) {
    doc.setFillColor(255, 255, 255);
    doc.circle(26, 24, 14.5, 'F');
    try { doc.addImage(photo, 'PNG', 12, 10, 28, 28, undefined, 'FAST'); } catch (e) {}
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text('N. ABDUL FASITH', 47, 19);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(180, 224, 247);
  doc.text('FOUNDER  •  IT UNDERGRADUATE  •  CYBERSECURITY ENTHUSIAST', 47, 27);
  doc.setFontSize(8.2);
  doc.setTextColor(226, 233, 239);
  doc.text('Trincomalee, Sri Lanka  |  +94 70 244 8089  |  abdulfasith373@gmail.com', 47, 35);
  doc.setTextColor(171, 209, 231);
  doc.text('linkedin.com/in/abdulfasith  |  github.com/abdulfasith37', 47, 41);

  // Left sidebar
  doc.setFillColor(244, 247, 249);
  doc.rect(0, 48, 65, 249, 'F');
  const lx = 13;
  let ly = 62;
  ly = cvSection(doc, 'Contact', lx, ly, 39);
  const contacts = [
    ['Location', 'Trincomalee, Sri Lanka'],
    ['Email', 'abdulfasith373@gmail.com'],
    ['Phone', '+94 70 244 8089'],
    ['LinkedIn', '/in/abdulfasith'],
    ['GitHub', '@abdulfasith37']
  ];
  contacts.forEach(([a,b]) => {
    doc.setFont('helvetica','bold'); doc.setFontSize(7.4); doc.setTextColor(...ink); doc.text(a, lx, ly);
    ly = addWrapped(doc, b, lx, ly + 4, 39, 7.3, muted, 3.6) + 4;
  });

  ly += 2;
  ly = cvSection(doc, 'Languages', lx, ly, 39);
  [['English','Intermediate',65],['Tamil','Native',100]].forEach(([name,level,val]) => {
    doc.setFont('helvetica','bold'); doc.setFontSize(7.8); doc.setTextColor(...ink); doc.text(name, lx, ly);
    doc.setFont('helvetica','normal'); doc.setFontSize(7); doc.setTextColor(...muted); doc.text(level, 50, ly, {align:'right'});
    doc.setFillColor(216,224,230); doc.roundedRect(lx, ly+3, 39, 2.2, 1, 1, 'F');
    doc.setFillColor(...accent); doc.roundedRect(lx, ly+3, 39*val/100, 2.2, 1, 1, 'F');
    ly += 14;
  });

  ly += 1;
  ly = cvSection(doc, 'Core Skills', lx, ly, 39);
  const skills = ['C / C++','Python','Java','PHP','JavaScript','HTML / CSS','Cybersecurity','Digital Marketing','AI Tools','Management','Leadership'];
  let sx = lx, sy = ly;
  skills.forEach(skill => {
    doc.setFont('helvetica','bold'); doc.setFontSize(6.9);
    const w = doc.getTextWidth(skill) + 6;
    if (sx + w > 54) { sx = lx; sy += 9; }
    doc.setFillColor(255,255,255); doc.roundedRect(sx, sy-4.5, w, 6.5, 1.8, 1.8, 'F');
    doc.setTextColor(52,72,88); doc.text(skill, sx+3, sy-0.3);
    sx += w + 2;
  });

  ly = 236;
  ly = cvSection(doc, 'Education', lx, ly, 39);
  doc.setFont('helvetica','bold'); doc.setFontSize(8); doc.setTextColor(...ink); doc.text('B.Sc. Information Technology', lx, ly);
  ly = addWrapped(doc, 'University of Vavuniya', lx, ly+5, 39, 7.4, muted, 3.7);
  doc.setFont('helvetica','bold'); doc.setFontSize(7); doc.setTextColor(...accent); doc.text('UNDERGRADUATE', lx, ly+2);

  // Main content
  const x = 77, width = 117;
  let y = 61;
  y = cvSection(doc, 'Professional Profile', x, y, width);
  y = addWrapped(doc,
    'Information Technology undergraduate and technology entrepreneur with practical experience and interests across software development, cybersecurity, digital marketing and emerging AI tools. Founder and CEO of Global Cybersecurity and Software Technologies (Pvt) Ltd (GCSST), with a focus on technology education, software solutions and digital growth.',
    x, y, width, 8.7, muted, 4.1) + 5;

  y = cvSection(doc, 'Leadership & Experience', x, y, width);
  doc.setFillColor(248,250,252); doc.roundedRect(x, y-3, width, 27, 3, 3, 'F');
  doc.setFillColor(...accent); doc.roundedRect(x, y-3, 2.2, 27, 1, 1, 'F');
  doc.setFont('helvetica','bold'); doc.setFontSize(10); doc.setTextColor(...ink); doc.text('Founder & CEO — GCSST', x+7, y+5);
  doc.setFont('helvetica','normal'); doc.setFontSize(7.8); doc.setTextColor(...accent); doc.text('Technology & Education', x+7, y+11);
  addWrapped(doc, 'Leading a technology and education initiative spanning cybersecurity awareness, IT training, software development, digital promotion and practical technology projects.', x+7, y+17, width-14, 7.7, muted, 3.6);
  y += 33;

  y = cvSection(doc, 'Selected Projects', x, y, width);
  const projects = [
    ['Urban Innovate Website','HTML • CSS • JavaScript','Urban-focused platform exploring local issues, solutions, community events and interactive ideas.'],
    ['PROVENOM','Python • Termux • Security','Automation-focused cybersecurity learning project for selected security-tool setup and workflows.'],
    ['Student Grade Management System','Java • OOP • Collections','Console application for academic records, unique-key lookup and class-average monitoring.'],
    ['Warehouse Inventory System','Java • OOP • Collections','Menu-driven inventory system for adding, removing, updating, searching and viewing stock.'],
    ['E-Commerce Website','Web • UI • JavaScript','Web project exploring product presentation, responsive layouts, user experience and functionality.'],
    ['Digital Marketing & Meta Ads','Meta Ads • Lead Generation','Hands-on promotion, audience targeting and lead-generation work for technology education.']
  ];
  projects.forEach(([name, tech, desc], i) => {
    const h = i === 1 ? 28 : 27;
    if (y + h > 278) return;
    doc.setFillColor(i % 2 ? 248 : 244, i % 2 ? 250 : 248, i % 2 ? 252 : 250);
    doc.roundedRect(x, y-3, width, h, 2.5, 2.5, 'F');
    doc.setFont('helvetica','bold'); doc.setFontSize(8.7); doc.setTextColor(...ink); doc.text(name, x+6, y+4);
    doc.setFont('helvetica','bold'); doc.setFontSize(6.8); doc.setTextColor(...accent); doc.text(tech, x+6, y+10);
    addWrapped(doc, desc, x+6, y+16, width-12, 7.2, muted, 3.5);
    y += h + 3;
  });
  cvFooter(doc, 1);

  // PAGE 2
  doc.addPage();
  doc.setFillColor(...navy); doc.rect(0,0,210,20,'F');
  doc.setFillColor(...accent); doc.rect(0,18,210,2,'F');
  doc.setFont('helvetica','bold'); doc.setFontSize(12); doc.setTextColor(255,255,255); doc.text('N. ABDUL FASITH',16,13);
  doc.setFont('helvetica','normal'); doc.setFontSize(7.5); doc.setTextColor(180,224,247); doc.text('PORTFOLIO CV  •  SELECTED WORK & PROFESSIONAL DETAILS', 194, 13, {align:'right'});

  let y2 = 34;
  y2 = cvSection(doc, 'Technical Competencies', 16, y2, 178);
  const competencyGroups = [
    ['Programming','C, C++, Python, Java, PHP, JavaScript'],
    ['Web Development','HTML/CSS, responsive interfaces, JavaScript, e-commerce concepts'],
    ['Cybersecurity','Security learning, Termux workflows, ethical-security concepts'],
    ['Digital & AI','Digital marketing, Meta Ads, lead generation, AI tools'],
    ['Professional','Management, leadership, communication, problem solving']
  ];
  competencyGroups.forEach(([title,desc]) => {
    doc.setFont('helvetica','bold'); doc.setFontSize(8.5); doc.setTextColor(...ink); doc.text(title, 16, y2);
    y2 = addWrapped(doc, desc, 55, y2, 139, 8.2, muted, 3.9) + 5;
  });

  y2 += 2;
  y2 = cvSection(doc, 'Education & Development', 16, y2, 178);
  doc.setFillColor(246,249,251); doc.roundedRect(16,y2-3,178,31,3,3,'F');
  doc.setFont('helvetica','bold'); doc.setFontSize(10); doc.setTextColor(...ink); doc.text('B.Sc. in Information Technology', 23, y2+5);
  doc.setFont('helvetica','normal'); doc.setFontSize(8.2); doc.setTextColor(...muted); doc.text('University of Vavuniya', 23, y2+12);
  doc.setFont('helvetica','bold'); doc.setFontSize(7.2); doc.setTextColor(...accent); doc.text('CURRENTLY UNDERGRADUATE', 23, y2+19);
  addWrapped(doc, 'Developing a foundation in programming, computing, databases, software development and practical technology problem solving.', 23, y2+25, 164, 7.5, muted, 3.5);
  y2 += 41;

  y2 = cvSection(doc, 'Professional Focus', 16, y2, 178);
  const focus = ['Software Development','Cybersecurity','Technology Education','Digital Entrepreneurship','AI & Emerging Tools'];
  let fx = 16, fy = y2;
  focus.forEach(t => { fx = cvTag(doc,t,fx,fy); if (fx > 165) { fx=16; fy+=11; } });
  y2 = fy + 16;

  y2 = cvSection(doc, 'Online Profiles', 16, y2, 178);
  const links = [
    ['GitHub','github.com/abdulfasith37'],
    ['LinkedIn','linkedin.com/in/abdulfasith'],
    ['GCSST','gcsstofficial@gmail.com']
  ];
  links.forEach(([a,b]) => {
    doc.setFillColor(248,250,252); doc.roundedRect(16,y2-5,178,12,2.5,2.5,'F');
    doc.setFont('helvetica','bold'); doc.setFontSize(8); doc.setTextColor(...ink); doc.text(a,23,y2+2);
    doc.setFont('helvetica','normal'); doc.setFontSize(8); doc.setTextColor(...accent); doc.text(b,58,y2+2);
    y2 += 16;
  });

  y2 += 3;
  y2 = cvSection(doc, 'Project Links', 16, y2, 178);
  const projectLinks = [
    ['PROVENOM','github.com/Prohackers535/PROVENOM'],
    ['Student Grade System','github.com/abdulfasith37/IT1214-Student-Grade-System'],
    ['Warehouse Inventory System','github.com/abdulfasith37/IT1214-Warehouse-Inventory-System']
  ];
  projectLinks.forEach(([a,b]) => {
    doc.setFont('helvetica','bold'); doc.setFontSize(8); doc.setTextColor(...ink); doc.text(a,16,y2);
    doc.setFont('helvetica','normal'); doc.setTextColor(...accent); doc.text(b,65,y2);
    y2 += 9;
  });

  y2 += 7;
  y2 = cvSection(doc, 'Professional Statement', 16, y2, 178);
  doc.setFillColor(...navy); doc.roundedRect(16,y2-3,178,35,4,4,'F');
  doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.setTextColor(235,242,247);
  const quote = '“Building practical skills through projects, technology education and continuous learning — with a strong interest in software, cybersecurity and digital innovation.”';
  const qlines = doc.splitTextToSize(quote, 158);
  doc.text(qlines, 26, y2+9);
  doc.setFont('helvetica','bold'); doc.setFontSize(7.5); doc.setTextColor(130,211,245); doc.text('N. ABDUL FASITH', 26, y2+26);

  cvFooter(doc, 2);
  doc.save('N_Abdul_Fasith_CV.pdf');
}

document.querySelectorAll('.cv-download').forEach(button => {
  button.addEventListener('click', generateCV);
});
