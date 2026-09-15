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

function addCvText(doc, text, x, y, maxWidth, fontSize = 9.5, lineHeight = 13) {
  doc.setFontSize(fontSize);
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

function drawCvHeader(doc) {
  doc.setFillColor(7, 17, 31);
  doc.rect(0, 0, 210, 43, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('N. ABDUL FASITH', 18, 18);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(170, 220, 255);
  doc.text('Founder  |  IT Undergraduate  |  Cybersecurity Enthusiast', 18, 27);
  doc.setTextColor(225, 232, 240);
  doc.setFontSize(8.5);
  doc.text('Trincomalee, Sri Lanka  •  abdulfasith373@gmail.com  •  +94 70 244 8089', 18, 35);
  doc.text('linkedin.com/in/abdulfasith  •  github.com/abdulfasith37', 18, 40);
}

function sectionTitle(doc, title, x, y, width = 174) {
  doc.setTextColor(18, 75, 125);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(title.toUpperCase(), x, y);
  doc.setDrawColor(55, 160, 220);
  doc.setLineWidth(0.7);
  doc.line(x, y + 3, x + width, y + 3);
  return y + 11;
}

async function generateCV() {
  if (!window.jspdf) {
    alert('CV generator is loading. Please try again in a moment.');
    return;
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  drawCvHeader(doc);

  let y = 53;
  const left = 18;
  const right = 192;

  y = sectionTitle(doc, 'Professional Profile', left, y);
  doc.setTextColor(45, 52, 60);
  doc.setFont('helvetica', 'normal');
  y = addCvText(doc,
    'Information Technology undergraduate and technology entrepreneur with practical interests in software development, cybersecurity, digital marketing and emerging AI technologies. Founder and CEO of Global Cybersecurity and Software Technologies (Pvt) Ltd (GCSST), focused on technology education, software solutions and digital growth.',
    left, y, 174, 9.2, 12);

  y += 4;
  y = sectionTitle(doc, 'Education', left, y);
  doc.setTextColor(25, 30, 36);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5);
  doc.text('B.Sc. in Information Technology', left, y);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
  doc.text('University of Vavuniya', left, y + 6);
  doc.setTextColor(85, 92, 100); doc.text('Undergraduate', 155, y + 6);
  y += 16;

  y = sectionTitle(doc, 'Leadership & Experience', left, y);
  doc.setTextColor(25, 30, 36);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5);
  doc.text('Founder & CEO — GCSST', left, y);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
  y = addCvText(doc, 'Leading a technology and education initiative covering cybersecurity awareness, IT training, software development, digital promotion and practical technology projects.', left, y + 6, 174, 9, 11.5);
  y += 3;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5); doc.setTextColor(25, 30, 36);
  doc.text('Independent Technology Projects', left, y);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
  y = addCvText(doc, 'Building and experimenting with web applications, Java console systems, Python automation, digital marketing campaigns and AI tools while developing practical problem-solving skills.', left, y + 6, 174, 9, 11.5);

  y += 4;
  y = sectionTitle(doc, 'Selected Projects', left, y);
  const projects = [
    ['Urban Innovate Website', 'HTML, CSS, JavaScript', 'Concept platform for urban issues, solutions, community events and interactive ideas.'],
    ['PROVENOM', 'Python, Termux, Security', 'Cybersecurity learning project focused on automating selected security-tool setup and workflows.'],
    ['Student Grade Management System', 'Java, OOP, Collections', 'Console application for academic tracking, record lookup and class-average monitoring.'],
    ['Warehouse Inventory System', 'Java, OOP, Collections', 'Menu-driven inventory application for adding, removing, updating, searching and viewing stock.'],
    ['E-Commerce Website', 'Web, UI, JavaScript', 'Responsive e-commerce project exploring product presentation, user experience and web functionality.'],
    ['Digital Marketing & Meta Ads', 'Meta Ads, Marketing, Lead Gen', 'Hands-on work with promotion, audience targeting and lead-generation campaigns for technology education.']
  ];
  projects.forEach(([name, tech, desc]) => {
    doc.setTextColor(25, 30, 36); doc.setFont('helvetica', 'bold'); doc.setFontSize(9.7); doc.text(name, left, y);
    doc.setTextColor(18, 110, 170); doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.text(tech, 116, y);
    doc.setTextColor(70, 77, 85); doc.setFont('helvetica', 'normal');
    y = addCvText(doc, desc, left, y + 5, 174, 8.5, 10.5) + 2;
  });

  if (y > 270) { doc.addPage(); y = 20; }
  else { y += 3; }

  y = sectionTitle(doc, 'Technical Skills', left, y);
  doc.setTextColor(45, 52, 60); doc.setFont('helvetica', 'normal'); doc.setFontSize(9.2);
  y = addCvText(doc, 'C • C++ • Python • PHP • Java • JavaScript • HTML/CSS • Cybersecurity • Digital Marketing • AI Tools • Management • Leadership • UI/UX • Problem Solving', left, y, 174, 9.2, 12);

  y += 4;
  y = sectionTitle(doc, 'Languages', left, y);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.setTextColor(35, 42, 50);
  doc.text('English', left, y); doc.setFont('helvetica', 'normal'); doc.text('Intermediate', 55, y);
  doc.setFont('helvetica', 'bold'); doc.text('Tamil', 105, y); doc.setFont('helvetica', 'normal'); doc.text('Native', 140, y);
  y += 15;

  y = sectionTitle(doc, 'Professional Links', left, y);
  doc.setTextColor(18, 90, 145); doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
  doc.text('GitHub: github.com/abdulfasith37', left, y);
  doc.text('LinkedIn: linkedin.com/in/abdulfasith', left, y + 7);
  doc.setTextColor(85, 92, 100); doc.setFontSize(8.2);
  doc.text('Generated directly from the portfolio • N. Abdul Fasith', left, 287);
  doc.text('Page ' + doc.getNumberOfPages(), 183, 287);

  doc.save('N_Abdul_Fasith_CV.pdf');
}

document.querySelectorAll('.cv-download').forEach(button => {
  button.addEventListener('click', generateCV);
});
