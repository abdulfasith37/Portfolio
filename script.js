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


async function generateCV() {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert('CV generator is still loading. Please try again in a moment.');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210, H = 297;
  const navy = [7, 17, 31], blue = [32, 214, 255], ink = [20, 32, 45], muted = [91, 108, 125], light = [241, 246, 250];
  const margin = 17;
  let y = 18;

  const text = (value, x, yy, size = 10, color = ink, style = 'normal') => {
    doc.setFont('helvetica', style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
    doc.text(value, x, yy);
  };
  const wrapped = (value, x, yy, width, size = 9.5, color = muted, line = 4.6) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(value, width);
    doc.text(lines, x, yy);
    return yy + lines.length * line;
  };
  const heading = (title, yy) => {
    text(title.toUpperCase(), margin, yy, 9, blue, 'bold');
    doc.setDrawColor(...blue);
    doc.setLineWidth(.5);
    doc.line(margin, yy + 2.5, W - margin, yy + 2.5);
    return yy + 10;
  };
  const pill = (label, x, yy, width) => {
    doc.setFillColor(...light);
    doc.roundedRect(x, yy - 5, width, 7, 2, 2, 'F');
    text(label, x + 3, yy, 7.5, ink, 'bold');
  };

  // Header
  doc.setFillColor(...navy);
  doc.rect(0, 0, W, 58, 'F');
  text('N. Abdul Fasith', margin, 22, 24, [255,255,255], 'bold');
  text('FOUNDER | IT UNDERGRADUATE | CYBERSECURITY ENTHUSIAST', margin, 31, 8.5, blue, 'bold');
  text('Trincomalee, Sri Lanka', margin, 40, 8.5, [205,218,230]);
  text('abdulfasith373@gmail.com', margin, 47, 8.5, [205,218,230]);
  text('+94 70 244 8089', 83, 47, 8.5, [205,218,230]);
  text('linkedin.com/in/abdulfasith', 119, 40, 7.7, [205,218,230]);
  text('github.com/abdulfasith37', 119, 47, 7.7, [205,218,230]);

  // Profile photo
  try {
    const response = await fetch('assets/profile.png');
    const blob = await response.blob();
    const reader = new FileReader();
    const dataUrl = await new Promise(resolve => { reader.onload = () => resolve(reader.result); reader.readAsDataURL(blob); });
    doc.addImage(dataUrl, 'PNG', 166, 8, 28, 42, undefined, 'FAST');
    doc.setDrawColor(...blue);
    doc.setLineWidth(1);
    doc.rect(165.5, 7.5, 29, 43);
  } catch (e) {}

  y = 72;
  y = heading('Professional Summary', y);
  y = wrapped("Information Technology undergraduate, founder of Global Cybersecurity and Software Technologies (Pvt) Ltd (GCSST), and cybersecurity enthusiast with hands-on experience building academic and practical projects. Interested in software development, cybersecurity, digital marketing, AI tools and technology education. I enjoy learning through building useful digital solutions and leading technology-focused initiatives.", margin, y, W - margin*2, 9.2, muted, 4.8) + 3;

  y = heading('Education', y);
  text('B.Sc. in Information Technology', margin, y, 11, ink, 'bold');
  text('University of Vavuniya', margin, y + 5, 9.2, blue, 'bold');
  y += 14;

  y = heading('Experience & Leadership', y);
  text('Founder & CEO — GCSST', margin, y, 11, ink, 'bold');
  y = wrapped('Global Cybersecurity and Software Technologies (Pvt) Ltd (GCSST) — technology and education initiative focused on practical IT, cybersecurity, software technologies, IT training and digital growth.', margin, y + 5, W - margin*2, 9.1, muted, 4.7) + 4;
  text('Independent Technology Projects', margin, y, 11, ink, 'bold');
  y = wrapped('Developing and experimenting with projects across Java, Python, web development, digital marketing, cybersecurity and emerging AI tools.', margin, y + 5, W - margin*2, 9.1, muted, 4.7) + 4;

  y = heading('Technical Skills', y);
  const skills = ['C','C++','Python','Java','JavaScript','PHP','HTML / CSS','Cybersecurity','Digital Marketing','AI Tools','Management','Leadership','UI / UX','Problem Solving'];
  let px = margin, py = y;
  skills.forEach((s, i) => {
    const w = Math.max(18, doc.getTextWidth(s) + 7);
    if (px + w > W - margin) { px = margin; py += 10; }
    pill(s, px, py, w); px += w + 3;
  });
  y = py + 14;

  y = heading('Languages', y);
  text('English', margin, y, 10, ink, 'bold');
  text('Intermediate', 60, y, 9.5, muted);
  text('Tamil', 105, y, 10, ink, 'bold');
  text('Native', 143, y, 9.5, muted);
  y += 14;

  // Projects section, with page break if needed
  if (y > 245) { doc.addPage(); y = 20; }
  y = heading('Selected Projects', y);
  const projects = [
    ['Urban Innovate Website', 'HTML / CSS / JavaScript', 'Website concept for innovating urban areas, covering local issues, solutions, community events and interactive ideas.'],
    ['PROVENOM', 'Python / Termux / Security', 'Cybersecurity learning project focused on automating selected security-tool setup and workflows in Termux.'],
    ['Student Grade Management System', 'Java / OOP / Collections', 'Console application for academic tracking, student records, unique lookup and class-average monitoring.'],
    ['Warehouse Inventory System', 'Java / OOP / Collections', 'Menu-driven inventory application for adding, removing, updating, searching and viewing warehouse stock.'],
    ['E-Commerce Website', 'Web / UI / JavaScript', 'Practical e-commerce website project exploring product presentation, user experience and responsive web functionality.'],
    ['Digital Marketing & Meta Ads', 'Meta Ads / Marketing / Lead Generation', 'Hands-on work with promotional creatives, audience targeting and lead-generation campaigns for technology education.']
  ];
  projects.forEach((p, idx) => {
    if (y > 270) { doc.addPage(); y = 20; y = heading('Selected Projects — Continued', y); }
    text(`${String(idx+1).padStart(2,'0')}  ${p[0]}`, margin, y, 10.2, ink, 'bold');
    text(p[1], margin, y + 4.5, 7.8, blue, 'bold');
    y = wrapped(p[2], margin, y + 9, W - margin*2, 8.7, muted, 4.3) + 5;
  });

  if (y > 260) { doc.addPage(); y = 20; }
  y = heading('Online Profiles', y);
  text('GitHub: github.com/abdulfasith37', margin, y, 9, ink);
  text('LinkedIn: linkedin.com/in/abdulfasith', margin, y + 6, 9, ink);
  text('WhatsApp: +94 70 244 8089', margin, y + 12, 9, ink);
  text('Email: abdulfasith373@gmail.com', margin, y + 18, 9, ink);

  // Footer on every page
  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page++) {
    doc.setPage(page);
    doc.setDrawColor(215,225,234);
    doc.setLineWidth(.3);
    doc.line(margin, H - 13, W - margin, H - 13);
    text('N. Abdul Fasith  |  Portfolio CV', margin, H - 7, 7, muted);
    text(`Page ${page} of ${pages}`, W - margin - 22, H - 7, 7, muted);
  }

  doc.save('N_Abdul_Fasith_CV.pdf');
}
