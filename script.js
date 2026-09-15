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
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  const W = 210, H = 297;
  const sidebar = 62;
  const navy = [7, 17, 31];
  const blue = [32, 214, 255];
  const ink = [25, 37, 50];
  const muted = [91, 108, 125];
  const pale = [238, 244, 248];
  const white = [255, 255, 255];
  const mainX = 76;
  const mainW = 118;
  const marginR = 17;
  let y = 20;

  const setFont = (size, color = ink, style = 'normal') => {
    doc.setFont('helvetica', style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
  };
  const drawText = (value, x, yy, size = 9, color = ink, style = 'normal', opts = {}) => {
    setFont(size, color, style);
    doc.text(value, x, yy, opts);
  };
  const wrap = (value, x, yy, width, size = 8.7, color = muted, leading = 4.35, style = 'normal') => {
    setFont(size, color, style);
    const lines = doc.splitTextToSize(value, width);
    doc.text(lines, x, yy);
    return yy + lines.length * leading;
  };
  const section = (title, yy) => {
    drawText(title.toUpperCase(), mainX, yy, 8.5, blue, 'bold');
    doc.setDrawColor(...pale);
    doc.setLineWidth(.35);
    doc.line(mainX, yy + 3, W - marginR, yy + 3);
    return yy + 11;
  };
  const sideLabel = (title, yy) => {
    drawText(title.toUpperCase(), 11, yy, 7.2, blue, 'bold');
    doc.setDrawColor(55, 75, 94);
    doc.setLineWidth(.35);
    doc.line(11, yy + 2.5, sidebar - 10, yy + 2.5);
    return yy + 9;
  };
  const bullet = (value, yy, width = mainW) => {
    doc.setFillColor(...blue);
    doc.circle(mainX + 1.4, yy - 1.2, .9, 'F');
    return wrap(value, mainX + 6, yy, width - 6, 8.6, muted, 4.25) + 2;
  };
  const skill = (label, yy) => {
    drawText(label, 11, yy, 8, white, 'normal');
    doc.setFillColor(40, 57, 74);
    doc.roundedRect(11, yy + 2.5, 40, 1.6, .8, .8, 'F');
    doc.setFillColor(...blue);
    doc.roundedRect(11, yy + 2.5, Math.min(40, label.length * 1.5 + 8), 1.6, .8, .8, 'F');
    return yy + 10;
  };

  // Sidebar
  doc.setFillColor(...navy);
  doc.rect(0, 0, sidebar, H, 'F');

  // Photo
  try {
    const response = await fetch('assets/profile.png');
    const blob = await response.blob();
    const reader = new FileReader();
    const dataUrl = await new Promise(resolve => {
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
    doc.addImage(dataUrl, 'PNG', 11, 14, 40, 50, undefined, 'FAST');
    doc.setDrawColor(...blue);
    doc.setLineWidth(.8);
    doc.rect(10.5, 13.5, 41, 51);
  } catch (e) {
    doc.setDrawColor(...blue);
    doc.rect(11, 14, 40, 50);
    drawText('AF', 21, 43, 25, blue, 'bold');
  }

  drawText('N. ABDUL FASITH', 11, 75, 11.5, white, 'bold');
  drawText('FOUNDER • IT • CYBERSECURITY', 11, 81, 6.3, blue, 'bold');

  let sy = 94;
  sy = sideLabel('Contact', sy);
  drawText('Trincomalee, Sri Lanka', 11, sy, 7.4, white); sy += 8;
  drawText('abdulfasith373@gmail.com', 11, sy, 7.1, white); sy += 8;
  drawText('+94 70 244 8089', 11, sy, 7.4, white); sy += 8;
  drawText('linkedin.com/in/abdulfasith', 11, sy, 6.9, white); sy += 8;
  drawText('github.com/abdulfasith37', 11, sy, 6.9, white); sy += 15;

  sy = sideLabel('Languages', sy);
  drawText('English', 11, sy, 8, white, 'bold');
  drawText('Intermediate', 11, sy + 5, 7, [170,190,207]); sy += 15;
  drawText('Tamil', 11, sy, 8, white, 'bold');
  drawText('Native', 11, sy + 5, 7, [170,190,207]); sy += 15;

  sy = sideLabel('Core Skills', sy);
  ['C / C++','Python','Java','JavaScript','PHP','HTML / CSS','Cybersecurity','Digital Marketing','AI Tools','Leadership'].forEach(s => { sy = skill(s, sy); });

  sy = sideLabel('Focus', Math.min(sy + 2, 238));
  wrap('Software development, cybersecurity, technology education, digital growth and emerging AI tools.', 11, sy, 40, 7.3, [180,195,210], 4.0);

  // Main header
  drawText('N. Abdul Fasith', mainX, 25, 25, ink, 'bold');
  drawText('FOUNDER | IT UNDERGRADUATE | CYBERSECURITY ENTHUSIAST', mainX, 33, 8.3, blue, 'bold');
  drawText('Founder & CEO, Global Cybersecurity and Software Technologies (Pvt) Ltd (GCSST)', mainX, 40, 7.7, muted, 'normal');
  doc.setDrawColor(...blue);
  doc.setLineWidth(1);
  doc.line(mainX, 46, W - marginR, 46);

  y = 58;
  y = section('Professional Profile', y);
  y = wrap('Information Technology undergraduate and technology entrepreneur with a strong interest in software development, cybersecurity, digital marketing and AI. Founder and CEO of GCSST, combining technical learning with leadership, technology education and practical project development. I learn by building and enjoy turning ideas into useful digital solutions.', mainX, y, mainW, 8.8, muted, 4.4) + 5;

  y = section('Education', y);
  drawText('B.Sc. in Information Technology', mainX, y, 10.5, ink, 'bold');
  drawText('University of Vavuniya', mainX, y + 5.2, 8.5, blue, 'bold');
  drawText('Undergraduate', W - marginR, y + 5.2, 7.4, muted, 'normal', { align: 'right' });
  y += 16;

  y = section('Leadership & Experience', y);
  drawText('Founder & CEO — GCSST', mainX, y, 10.2, ink, 'bold');
  y = wrap('Leading Global Cybersecurity and Software Technologies (Pvt) Ltd (GCSST), a technology and education initiative focused on practical IT, cybersecurity, software technologies, IT training and digital growth.', mainX, y + 5, mainW, 8.5, muted, 4.25) + 5;
  drawText('Independent Technology Projects', mainX, y, 10.2, ink, 'bold');
  y = wrap('Building and experimenting with academic and practical projects across Java, Python, web development, cybersecurity, digital marketing and AI tools.', mainX, y + 5, mainW, 8.5, muted, 4.25) + 4;

  y = section('Selected Projects', y);
  const projects = [
    ['Urban Innovate Website', 'HTML / CSS / JavaScript', 'A web platform concept for innovating urban areas through local issues, solutions, community events and interactive ideas.'],
    ['PROVENOM', 'Python / Termux / Security', 'A cybersecurity learning project focused on automating selected security-tool setup and workflows in Termux.'],
    ['Student Grade Management System', 'Java / OOP / Collections', 'Console application for academic tracking, student records, unique lookup and class-average monitoring.'],
    ['Warehouse Inventory System', 'Java / OOP / Collections', 'Menu-driven application for adding, removing, updating, searching and viewing warehouse stock.'],
    ['E-Commerce Website', 'Web / UI / JavaScript', 'Practical e-commerce project exploring product presentation, user experience and responsive web functionality.'],
    ['Digital Marketing & Meta Ads', 'Meta Ads / Lead Generation', 'Hands-on work with promotional creatives, audience targeting and lead-generation campaigns for technology education.']
  ];
  projects.forEach((p, idx) => {
    if (y > 264) {
      doc.addPage();
      doc.setFillColor(...navy); doc.rect(0,0,sidebar,H,'F');
      drawText('N. ABDUL FASITH', 11, 22, 11.5, white, 'bold');
      drawText('PORTFOLIO CV', 11, 28, 6.5, blue, 'bold');
      drawText('Selected Projects — Continued', mainX, 25, 16, ink, 'bold');
      doc.setDrawColor(...blue); doc.setLineWidth(1); doc.line(mainX, 32, W-marginR, 32);
      y = 45;
    }
    drawText(String(idx + 1).padStart(2,'0'), mainX, y, 7.5, blue, 'bold');
    drawText(p[0], mainX + 10, y, 9.3, ink, 'bold');
    drawText(p[1], mainX + 10, y + 4.5, 7.2, blue, 'bold');
    y = wrap(p[2], mainX + 10, y + 9, mainW - 10, 8.15, muted, 4.0) + 5;
  });

  if (y > 253) {
    doc.addPage();
    doc.setFillColor(...navy); doc.rect(0,0,sidebar,H,'F');
    drawText('N. ABDUL FASITH', 11, 22, 11.5, white, 'bold');
    drawText('PORTFOLIO CV', 11, 28, 6.5, blue, 'bold');
    y = 20;
  }
  y = section('Professional Interests', y + 2);
  y = bullet('Software development and problem solving');
  y = bullet('Cybersecurity learning and awareness');
  y = bullet('Technology education and community learning');
  y = bullet('Digital marketing and lead generation');
  y = bullet('Artificial intelligence and emerging technologies');

  // Footer on every page
  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page++) {
    doc.setPage(page);
    doc.setDrawColor(220, 228, 235);
    doc.setLineWidth(.3);
    doc.line(mainX, H - 12, W - marginR, H - 12);
    drawText('N. Abdul Fasith  |  Professional Portfolio CV', mainX, H - 6.5, 6.8, muted);
    drawText(`Page ${page} of ${pages}`, W - marginR, H - 6.5, 6.8, muted, 'normal', { align: 'right' });
  }

  doc.save('N_Abdul_Fasith_CV.pdf');
}
