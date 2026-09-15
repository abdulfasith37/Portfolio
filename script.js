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


const cvButton = document.getElementById('download-cv');
if (cvButton) {
  cvButton.addEventListener('click', async () => {
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) { window.print(); return; }
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const navy = [7, 17, 31], cyan = [32, 214, 255], gray = [91, 108, 125];
    const pageW = 210, margin = 18;
    let y = 20;
    doc.setFillColor(...navy); doc.rect(0, 0, pageW, 34, 'F');
    doc.setTextColor(255,255,255); doc.setFont('helvetica','bold'); doc.setFontSize(23); doc.text('N. Abdul Fasith', margin, y+2);
    doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.setTextColor(190,225,235); doc.text('Founder | IT Undergraduate | Cybersecurity Enthusiast', margin, y+9);
    doc.setFontSize(8); doc.text('Trincomalee, Sri Lanka  |  +94 70 244 8089  |  abdulfasith373@gmail.com', margin, y+16);
    doc.setTextColor(...navy); y=46;
    const section=(title)=>{ doc.setTextColor(...cyan); doc.setFont('helvetica','bold'); doc.setFontSize(10); doc.text(title.toUpperCase(),margin,y); doc.setDrawColor(...cyan); doc.line(margin,y+2,192,y+2); y+=9; };
    const para=(text,size=9)=>{ doc.setTextColor(...gray); doc.setFont('helvetica','normal'); doc.setFontSize(size); const lines=doc.splitTextToSize(text,174); doc.text(lines,margin,y,{lineHeightFactor:1.45}); y+=lines.length*size*.42+5; };
    section('Professional Profile');
    para('Information Technology undergraduate, technology entrepreneur and cybersecurity enthusiast with practical interests across software development, web technologies, digital marketing and AI tools. Founder and CEO of Global Cybersecurity and Software Technologies (Pvt) Ltd (GCSST), focused on technology education and practical digital solutions.');
    section('Education');
    doc.setTextColor(...navy); doc.setFont('helvetica','bold'); doc.setFontSize(10); doc.text('B.Sc. in Information Technology',margin,y); y+=5;
    doc.setTextColor(...gray); doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.text('University of Vavuniya',margin,y); y+=9;
    section('Experience & Leadership');
    doc.setTextColor(...navy); doc.setFont('helvetica','bold'); doc.setFontSize(10); doc.text('Founder & CEO — GCSST',margin,y); y+=5;
    para('Building a technology and education initiative spanning cybersecurity, software technologies, IT training, digital promotion and practical technology projects.');
    section('Technical Skills');
    para('C • C++ • Python • Java • JavaScript • PHP • HTML/CSS • Cybersecurity • Digital Marketing • AI Tools • Management • Leadership • UI/UX');
    section('Languages');
    doc.setTextColor(...navy); doc.setFont('helvetica','bold'); doc.setFontSize(9); doc.text('English',margin,y); doc.setFont('helvetica','normal'); doc.text('Intermediate',70,y); y+=6; doc.setFont('helvetica','bold'); doc.text('Tamil',margin,y); doc.setFont('helvetica','normal'); doc.text('Native',70,y); y+=9;
    section('Selected Projects');
    const projects=[['Urban Innovate Website','HTML / CSS / JavaScript — urban innovation platform.'],['PROVENOM','Python / Termux — cybersecurity learning automation project.'],['Student Grade Management System','Java / OOP / Collections — academic tracking application.'],['Warehouse Inventory System','Java / OOP / Collections — menu-driven inventory application.'],['E-Commerce Website','Web / UI / JavaScript — e-commerce website project.'],['Digital Marketing & Meta Ads','Digital Marketing — promotion and lead-generation experience.']];
    for (const [name,desc] of projects) { doc.setTextColor(...navy); doc.setFont('helvetica','bold'); doc.setFontSize(9); doc.text(name,margin,y); y+=4; para(desc,8.5); if(y>270){doc.addPage();y=20;} }
    section('Online');
    doc.setTextColor(...gray); doc.setFont('helvetica','normal'); doc.setFontSize(8.5); doc.text('LinkedIn: linkedin.com/in/abdulfasith',margin,y); y+=5; doc.text('GitHub: github.com/abdulfasith37',margin,y); y+=8;
    doc.setFontSize(7); doc.setTextColor(140,150,160); doc.text('Generated from abdulfasith37 portfolio',margin,288); doc.text('N. Abdul Fasith',170,288);
    doc.save('N_Abdul_Fasith_CV.pdf');
  });
}
