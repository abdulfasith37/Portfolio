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

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const glow = document.querySelector('.cursor-glow');
if (glow) document.addEventListener('pointermove', e => {
  glow.style.left = `${e.clientX}px`;
  glow.style.top = `${e.clientY}px`;
});

function wrap(doc, text, x, y, width, size = 9, color = [70, 80, 92], lineHeight = 4.4, font = 'normal') {
  doc.setFont('helvetica', font);
  doc.setFontSize(size);
  doc.setTextColor(...color);
  const lines = doc.splitTextToSize(text, width);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

function cvSection(doc, title, x, y, width, accent) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...accent);
  doc.text(title.toUpperCase(), x, y);
  doc.setDrawColor(216, 224, 230);
  doc.setLineWidth(.35);
  doc.line(x, y + 2.8, x + width, y + 2.8);
  return y + 11;
}

function cvFooter(doc, page, accent) {
  doc.setDrawColor(220, 226, 232);
  doc.setLineWidth(.3);
  doc.line(16, 284, 194, 284);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(125, 135, 145);
  doc.text('N. Abdul Fasith  |  Portfolio CV', 16, 289);
  doc.setTextColor(...accent);
  doc.setFont('helvetica', 'bold');
  doc.text(String(page).padStart(2, '0'), 194, 289, { align: 'right' });
}

function cvPill(doc, text, x, y, maxWidth = 52) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  const w = Math.min(maxWidth, doc.getTextWidth(text) + 8);
  doc.setFillColor(239, 248, 252);
  doc.setDrawColor(205, 229, 240);
  doc.roundedRect(x, y - 5, w, 7.4, 1.8, 1.8, 'FD');
  doc.setTextColor(20, 105, 151);
  doc.text(text, x + 4, y);
  return x + w + 3;
}

async function generateCV() {
  if (!window.jspdf) { alert('CV generator is loading. Please try again in a moment.'); return; }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit:'mm', format:'a4', compress:true });
  const W=210, H=297;
  const navy=[7,17,31], accent=[32,214,255], blue=[55,125,255], ink=[20,31,43], muted=[91,105,118], soft=[244,248,251], line=[218,226,232], white=[255,255,255];
  const margin=17;
  const text=(t,x,y,size=9,color=ink,font='normal',align='left')=>{doc.setFont('helvetica',font);doc.setFontSize(size);doc.setTextColor(...color);doc.text(t,x,y,{align});};
  const para=(t,x,y,w,size=8.5,color=muted,lh=4.3)=>{doc.setFont('helvetica','normal');doc.setFontSize(size);doc.setTextColor(...color);const lines=doc.splitTextToSize(t,w);doc.text(lines,x,y);return y+lines.length*lh;};
  const section=(t,x,y,w)=>{text(t.toUpperCase(),x,y,7.2,accent,'bold');doc.setDrawColor(...line);doc.setLineWidth(.35);doc.line(x,y+3,x+w,y+3);return y+12;};
  const footer=(n)=>{doc.setDrawColor(...line);doc.line(margin,284,W-margin,284);text('N. Abdul Fasith  •  Portfolio CV',margin,290,6.5,[120,132,142]);text(String(n).padStart(2,'0'),W-margin,290,6.5,accent,'bold','right');};
  const tag=(t,x,y)=>{doc.setFont('helvetica','bold');doc.setFontSize(6.7);const w=doc.getTextWidth(t)+8;doc.setFillColor(...soft);doc.setDrawColor(...line);doc.roundedRect(x,y-5,w,7,1.5,1.5,'FD');text(t,x+4,y,6.7,[48,68,83],'bold');return x+w+3;};
  const project=(name,tech,desc,x,y,w)=>{doc.setFillColor(250,252,253);doc.setDrawColor(...line);const lines=doc.splitTextToSize(desc,w-16);const h=23+lines.length*3.5;doc.roundedRect(x,y-4,w,h,3,3,'FD');doc.setFillColor(...accent);doc.roundedRect(x,y-4,2.5,h,1.2,1.2,'F');text(name,x+9,y+4,9.2,ink,'bold');text(tech,x+9,y+10,6.5,[13,104,150],'bold');doc.setFont('helvetica','normal');doc.setFontSize(7.1);doc.setTextColor(...muted);doc.text(lines,x+9,y+16);return y+h+5;};

  // PAGE 1 — executive profile
  doc.setFillColor(...navy);doc.rect(0,0,W,61,'F');
  doc.setFillColor(...accent);doc.rect(0,58,W,3,'F');
  doc.setFillColor(...accent);doc.roundedRect(17,15,14,14,3,3,'F');
  text('</>',24,24.5,7.5,navy,'bold','center');
  text('N. ABDUL FASITH',39,24,24,white,'bold');
  text('FOUNDER  •  IT UNDERGRADUATE  •  CYBERSECURITY ENTHUSIAST',39,33,8.2,[174,224,243],'bold');
  text('Trincomalee, Sri Lanka  •  +94 70 244 8089  •  abdulfasith373@gmail.com',39,43,7.2,[229,237,242]);
  text('linkedin.com/in/abdulfasith  •  github.com/abdulfasith37',39,51,7.2,[169,211,229]);

  // left column
  doc.setFillColor(247,249,251);doc.rect(0,61,65,223,'F');
  let y=76; y=section('Core Skills',12,y,41);
  let tx=12,ty=y; ['C','C++','Python','Java','PHP','JavaScript','HTML / CSS','Cybersecurity','Digital Marketing','AI Tools','Management','Leadership'].forEach(t=>{doc.setFont('helvetica','bold');doc.setFontSize(6.5);const w=doc.getTextWidth(t)+7;if(tx+w>57){tx=12;ty+=9;}tag(t,tx,ty);tx+=doc.getTextWidth(t)+10;});
  y=ty+14; y=section('Languages',12,y,41);
  [['English','Intermediate',65],['Tamil','Native',100]].forEach(a=>{text(a[0],12,y,7.8,ink,'bold');text(a[1],53,y,6.7,muted,'normal','right');doc.setFillColor(220,228,234);doc.roundedRect(12,y+5,41,2.2,1,1,'F');doc.setFillColor(...accent);doc.roundedRect(12,y+5,41*a[2]/100,2.2,1,1,'F');y+=15;});
  y+=2;y=section('Education',12,y,41);y=para('B.Sc. in Information Technology',12,y,41,7.5,ink,3.8)+2;y=para('University of Vavuniya',12,y,41,7,muted,3.6)+1;text('UNDERGRADUATE',12,y,6.3,[13,104,150],'bold');
  y+=14;y=section('Focus',12,y,41);['Software Development','Cybersecurity','Technology Education','Digital Marketing','AI & Emerging Tools'].forEach(t=>{text('• '+t,12,y,6.7,ink,'bold');y+=9;});

  // right column
  const x=75,w=118; y=76; let yy=y;
  yy=section('Professional Profile',x,yy,w);
  yy=para('Information Technology undergraduate and technology entrepreneur with hands-on experience across programming, web development, cybersecurity learning, digital marketing and emerging AI tools. Founder and CEO of Global Cybersecurity and Software Technologies (Pvt) Ltd (GCSST), with an interest in practical technology education and digital solutions.',x,yy,w,8.4,muted,4.25)+8;
  yy=section('GCSST — Leadership',x,yy,w);
  text('Founder & CEO',x,yy,11,ink,'bold');text('Global Cybersecurity and Software Technologies (Pvt) Ltd',x,yy+7,7,[13,104,150],'bold');
  yy=para('Leading an IT and education initiative involving cybersecurity awareness, software development, IT training, digital promotion and practical technology projects.',x,yy+14,w,7.8,muted,4)+8;
  yy=section('Knowledge Areas',x,yy,w);
  [['Programming',80],['Web Development',70],['Cybersecurity',50],['Digital & AI',90]].forEach(a=>{text(a[0],x,yy,7.8,ink,'bold');text(a[1]+'%',x+w,yy,7.2,[13,104,150],'bold','right');doc.setFillColor(226,232,236);doc.roundedRect(x,yy+5,w,2.6,1.2,1.2,'F');doc.setFillColor(...accent);doc.roundedRect(x,yy+5,w*a[1]/100,2.6,1.2,1.2,'F');yy+=14;});
  yy+=3; yy=section('Selected Projects',x,yy,w);
  yy=project('Urban Innovate Website','HTML • CSS • JavaScript','Urban-focused web platform exploring local issues, solutions, community events and interactive engagement.',x,yy,w);
  yy=project('PROVENOM','Python • Termux • Security','Cybersecurity learning project exploring automation and selected command-line security workflows.',x,yy,w);
  footer(1);

  // PAGE 2 — selected work and competencies, no repeated sections
  doc.addPage();doc.setFillColor(...navy);doc.rect(0,0,W,28,'F');doc.setFillColor(...accent);doc.rect(0,26,W,2,'F');text('N. ABDUL FASITH',17,17,14,white,'bold');text('PROJECTS  •  COMPETENCIES  •  PROFESSIONAL PROFILE',193,17,6.7,[174,224,243],'bold','right');
  let p2=43;p2=section('Selected Projects',17,p2,176);
  const ps=[
    ['Student Grade Management System','Java • OOP • Collections','Console application for academic tracking, unique-key student lookup and class-average monitoring.'],
    ['Warehouse Inventory System','Java • OOP • Collections','Menu-driven inventory application for adding, removing, updating, searching and viewing warehouse stock.'],
    ['E-Commerce Website','HTML • CSS • JavaScript','Web project focused on product presentation, responsive interfaces and practical e-commerce functionality.'],
    ['Digital Marketing & Meta Ads','Digital Marketing','Practical work with digital promotion, Meta advertising, lead generation and campaign-oriented growth.']
  ];
  ps.forEach(a=>{p2=project(a[0],a[1],a[2],17,p2,176);});
  p2+=2;p2=section('Technical Competencies',17,p2,176);
  const comps=[['Programming','C, C++, Python, Java, PHP, JavaScript'],['Web Development','HTML/CSS, responsive interfaces, JavaScript and e-commerce concepts'],['Cybersecurity','Security learning, Termux workflows and ethical-security concepts'],['Digital & AI','Digital marketing, Meta Ads, lead generation and AI tools'],['Professional','Management, leadership, communication and problem solving']];
  comps.forEach(a=>{text(a[0],17,p2,8,ink,'bold');p2=para(a[1],62,p2,131,7.6,muted,3.8)+5;});
  if(p2>252){doc.addPage();p2=28;}
  p2+=3;p2=section('Education & Professional Direction',17,p2,176);
  text('B.Sc. in Information Technology',17,p2,10,ink,'bold');text('University of Vavuniya  •  Undergraduate',17,p2+7,7.2,muted);p2+=19;
  p2=para('Building practical skills through projects, technology education and continuous learning, with a strong interest in software development, cybersecurity, digital innovation and emerging AI technologies.',17,p2,176,8.3,muted,4.2)+9;
  doc.setFillColor(...navy);doc.roundedRect(17,p2-3,176,28,4,4,'F');text('CONTACT',25,p2+7,6.8,[132,211,245],'bold');text('abdulfasith373@gmail.com',25,p2+15,8.2,white,'bold');text('+94 70 244 8089  •  Trincomalee, Sri Lanka',25,p2+22,7,[210,222,230]);
  footer(2);
  doc.save('N_Abdul_Fasith_CV.pdf');
}


document.querySelectorAll('.cv-download').forEach(function(button) {
  button.addEventListener('click', function() {
    const link = document.createElement('a');
    link.href = 'assets/N_Abdul_Fasith_CV.pdf';
    link.download = 'N_Abdul_Fasith_CV.pdf';
    document.body.appendChild(link);
    link.click();
    link.remove();
  });
});
