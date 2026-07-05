/* =========================================================
   KUSHARIA HIGH SCHOOL — script.js
   Demo data + interactions. Replace sample data / form
   handlers with real backend calls when ready.
   ========================================================= */

document.getElementById('year').textContent = new Date().getFullYear();

function banglaDigit(n){
  const map = {'0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯'};
  return String(n).split('').map(c => map[c] !== undefined ? map[c] : c).join('');
}
function toEnglishDigits(str){
  return String(str).replace(/[০-৯]/g, d => '০১২৩৪৫৬৭৮৯'.indexOf(d));
}
function todayBn(){
  const d = new Date();
  return `${banglaDigit(d.getDate())}/${banglaDigit(d.getMonth()+1)}/${banglaDigit(d.getFullYear())}`;
}

/* ---------------- Mobile nav ---------------- */
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
navToggle.addEventListener('click', () => mainNav.classList.toggle('open'));
mainNav.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => mainNav.classList.remove('open'));
});

/* Active nav link on scroll */
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
  document.getElementById('backToTop').classList.toggle('show', window.scrollY > 500);
});
document.getElementById('backToTop').addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

/* ---------------- Scroll reveal ---------------- */
document.querySelectorAll('.section').forEach(el => el.classList.add('reveal'));
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
}, {threshold:0.1});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* =========================================================
   NOTICE BOARD (fixed bottom ticker + modal)
   ========================================================= */
const notices = [
  {date:'০৫ জুলাই ২০২৬', text:'৯ম শ্রেণির নির্বাচনী পরীক্ষার রুটিন প্রকাশিত হয়েছে। বিস্তারিত নোটিশ বোর্ডে দেখুন।'},
  {date:'০১ জুলাই ২০২৬', text:'৬ষ্ঠ থেকে ১০ম শ্রেণি পর্যন্ত নতুন শিক্ষাবর্ষের ভর্তি কার্যক্রম চলছে।'},
  {date:'২৮ জুন ২০২৬', text:'আগামী ২০ জুলাই বার্ষিক ক্রীড়া প্রতিযোগিতা অনুষ্ঠিত হবে। সকল শিক্ষার্থীর অংশগ্রহণ বাধ্যতামূলক।'},
  {date:'২০ জুন ২০২৬', text:'অ্যালামনাই সদস্য নবায়নের শেষ তারিখ ৩১ জুলাই, দ্রুত চাঁদা পরিশোধ করুন।'},
  {date:'১৫ জুন ২০২৬', text:'অর্ধবার্ষিক পরীক্ষার ফলাফল ওয়েবসাইটের "ফলাফল" সেকশন থেকে দেখা যাবে।'},
  {date:'১০ জুন ২০২৬', text:'বৃত্তি পরীক্ষায় কৃতকার্য শিক্ষার্থীদের সংবর্ধনা আগামী শুক্রবার।'}
];
function renderNotices(){
  document.getElementById('tickerContent').innerHTML =
    notices.map(n => `<span>📌 ${n.text}</span>`).join('');
  document.getElementById('noticeList').innerHTML =
    notices.map(n => `<div class="notice-item"><span class="notice-date">${n.date}</span><span class="notice-text">${n.text}</span></div>`).join('');
}
renderNotices();

const noticeModalOverlay = document.getElementById('noticeModalOverlay');
function openNoticeBoard(){ noticeModalOverlay.classList.add('open'); }
document.getElementById('tickerBarBtn').addEventListener('click', openNoticeBoard);
document.getElementById('heroNoticeBtn').addEventListener('click', openNoticeBoard);
document.getElementById('noticeModalClose').addEventListener('click', () => noticeModalOverlay.classList.remove('open'));
noticeModalOverlay.addEventListener('click', (e) => { if (e.target === noticeModalOverlay) noticeModalOverlay.classList.remove('open'); });

/* =========================================================
   PRINT / "PDF DOWNLOAD" HELPER
   Uses the browser's native print-to-PDF so Bangla text
   renders correctly (Save as PDF in the print dialog).
   ========================================================= */
function printDocument(areaId){
  document.querySelectorAll('.print-area').forEach(el => el.classList.remove('active-print'));
  document.getElementById(areaId).classList.add('active-print');
  document.body.classList.add('printing');
  window.print();
  setTimeout(() => document.body.classList.remove('printing'), 300);
}
window.addEventListener('afterprint', () => document.body.classList.remove('printing'));

/* =========================================================
   ADMISSION — class info + form
   ========================================================= */
const classSeatData = {
  '৬ষ্ঠ': {seats:60, filled:42, subjects:['বাংলা','ইংরেজি','গণিত','বিজ্ঞান','সমাজ বিজ্ঞান','ধর্ম শিক্ষা','কৃষি শিক্ষা']},
  '৭ম':  {seats:60, filled:55, subjects:['বাংলা','ইংরেজি','গণিত','বিজ্ঞান','সমাজ বিজ্ঞান','ধর্ম শিক্ষা','তথ্য ও যোগাযোগ প্রযুক্তি']},
  '৮ম':  {seats:60, filled:58, subjects:['বাংলা','ইংরেজি','গণিত','বিজ্ঞান','বাংলাদেশ ও বিশ্বপরিচয়','ধর্ম শিক্ষা','শারীরিক শিক্ষা']},
  '৯ম':  {seats:120, filled:96, subjects:['বিজ্ঞান / মানবিক / ব্যবসায় শিক্ষা শাখা','উচ্চতর গণিত','পদার্থবিজ্ঞান','রসায়ন','জীববিজ্ঞান / অর্থনীতি / হিসাববিজ্ঞান']},
  '১০ম': {seats:110, filled:104, subjects:['বিজ্ঞান / মানবিক / ব্যবসায় শিক্ষা শাখা','এসএসসি নির্বাচনী প্রস্তুতি','ব্যবহারিক ক্লাস','মডেল টেস্ট']}
};

function renderClassInfo(cls){
  const d = classSeatData[cls];
  const remaining = d.seats - d.filled;
  document.getElementById('classInfoCard').innerHTML = `
    <h4>${cls} শ্রেণি — ভর্তি তথ্য</h4>
    <p>মোট আসন: <strong>${d.seats}</strong> &nbsp;|&nbsp; পূরণকৃত: <strong>${d.filled}</strong> &nbsp;|&nbsp; <span class="seats">খালি আসন: ${remaining}</span></p>
    <p style="margin-top:12px; font-weight:600; color:var(--green-deep);">এই শ্রেণিতে পাঠদান করা বিষয়সমূহ:</p>
    <ul>${d.subjects.map(s => `<li>${s}</li>`).join('')}</ul>
  `;
}
document.querySelectorAll('.class-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.class-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderClassInfo(tab.dataset.class);
    document.getElementById('stClass').value = tab.dataset.class;
  });
});
renderClassInfo('৬ষ্ঠ');

/* Admission form */
function loadAdmissions(){
  return JSON.parse(localStorage.getItem('kus_admissions') || '[]');
}
function renderAdmissionList(){
  const list = loadAdmissions();
  const wrap = document.getElementById('admissionList');
  if (!list.length){ wrap.innerHTML = '<p class="admission-empty">এখনো কোনো আবেদন জমা পড়েনি।</p>'; return; }
  wrap.innerHTML = list.slice(-5).reverse().map(a => `
    <div class="admission-item">
      <span><strong>${a.name}</strong> — ${a.cls} শ্রেণি</span>
      <span>অভিভাবকের নম্বর: ${a.phone}</span>
    </div>
  `).join('');
}
renderAdmissionList();

let lastAdmission = null;
document.getElementById('admissionForm').addEventListener('submit', function(e){
  e.preventDefault();
  const data = {
    name: document.getElementById('stName').value.trim(),
    cls: document.getElementById('stClass').value,
    father: document.getElementById('fatherName').value.trim(),
    mother: document.getElementById('motherName').value.trim(),
    dob: document.getElementById('dob').value,
    gender: document.getElementById('gender').value,
    phone: document.getElementById('phone').value.trim(),
    prevSchool: document.getElementById('prevSchool').value.trim() || 'উল্লেখ নেই',
    address: document.getElementById('address').value.trim(),
    time: new Date().toISOString(),
    track: 'KUS-ADM-' + Date.now().toString().slice(-8)
  };
  const list = loadAdmissions();
  list.push(data);
  localStorage.setItem('kus_admissions', JSON.stringify(list));
  lastAdmission = data;

  const msg = document.getElementById('admissionMsg');
  msg.textContent = `✅ ধন্যবাদ ${data.name}! আপনার ভর্তির আবেদন সফলভাবে জমা হয়েছে (ট্র্যাকিং নম্বর: ${data.track})। নিচের বাটনে ক্লিক করে স্লিপ ডাউনলোড করুন।`;
  msg.className = 'form-msg success';
  document.getElementById('downloadSlipBtn').style.display = 'inline-block';
  this.reset();
  renderAdmissionList();
});

document.getElementById('downloadSlipBtn').addEventListener('click', () => {
  if (!lastAdmission) return;
  const a = lastAdmission;
  document.getElementById('pSlipTrack').textContent = a.track;
  document.getElementById('pSlipDate').textContent = todayBn();
  document.getElementById('pSlipName').textContent = a.name;
  document.getElementById('pSlipClass').textContent = a.cls + ' শ্রেণি';
  document.getElementById('pSlipFather').textContent = a.father;
  document.getElementById('pSlipMother').textContent = a.mother;
  document.getElementById('pSlipDob').textContent = a.dob || 'উল্লেখ নেই';
  document.getElementById('pSlipGender').textContent = a.gender;
  document.getElementById('pSlipPhone').textContent = a.phone;
  document.getElementById('pSlipPrevSchool').textContent = a.prevSchool;
  document.getElementById('pSlipAddress').textContent = a.address;
  printDocument('printSlip');
});

/* =========================================================
   RESULTS + PROGRESS (ledger sheet)
   ========================================================= */
const subjectsBySubjectSet = ['বাংলা','ইংরেজি','গণিত','বিজ্ঞান','সমাজবিজ্ঞান'];
function seededResult(cls, roll){
  const seed = (cls.length * 7 + Number(roll || 0) * 13) % 100;
  const marks = subjectsBySubjectSet.map((s, i) => {
    const base = 55 + ((seed + i * 17) % 40);
    return {subject: s, marks: base};
  });
  const total = marks.reduce((a,b) => a + b.marks, 0);
  const prevMarks = marks.map(m => ({subject: m.subject, marks: Math.max(35, m.marks - (5 + (seed % 15)))}));
  const prevTotal = prevMarks.reduce((a,b)=>a+b.marks,0);
  let grade = 'A+';
  const pct = total / marks.length;
  if (pct < 40) grade='F'; else if (pct<50) grade='C'; else if (pct<60) grade='B'; else if (pct<70) grade='A-'; else if (pct<80) grade='A'; else grade='A+';
  return {marks, total, prevMarks, prevTotal, grade};
}
let lastResult = null;
document.getElementById('resultSearchBtn').addEventListener('click', () => {
  const cls = document.getElementById('resultClass').value;
  const rollInput = document.getElementById('resultRoll').value.trim();
  const roll = toEnglishDigits(rollInput);
  const sheet = document.getElementById('resultSheet');
  if (!roll || isNaN(roll) || Number(roll) < 1){
    sheet.innerHTML = '<p class="ledger-empty">সঠিক রোল নম্বর দিন (যেমন: ৫)।</p>';
    return;
  }
  const r = seededResult(cls, roll);
  lastResult = {cls, roll, r};
  sheet.innerHTML = `
    <div class="ledger-head">
      <h4>${cls} শ্রেণি — রোল ${banglaDigit(roll)}</h4>
      <span class="badge">গ্রেড: ${r.grade}</span>
    </div>
    <table class="result-table">
      <thead><tr><th>বিষয়</th><th>বর্তমান প্রাপ্ত নম্বর</th><th>বিগত পরীক্ষার নম্বর</th></tr></thead>
      <tbody>
        ${r.marks.map((m,i)=>`<tr><td>${m.subject}</td><td>${banglaDigit(m.marks)}</td><td>${banglaDigit(r.prevMarks[i].marks)}</td></tr>`).join('')}
        <tr><td>মোট নম্বর</td><td>${banglaDigit(r.total)}</td><td>${banglaDigit(r.prevTotal)}</td></tr>
      </tbody>
    </table>
    <div class="progress-compare">
      <h5>বিগত পরীক্ষার সাথে অগ্রগতি তুলনা</h5>
      ${r.marks.map((m,i)=>`
        <div class="progress-row">
          <span class="p-label">${m.subject}</span>
          <div class="progress-bars">
            <div class="p-bar-track"><div class="p-bar-fill prev" style="width:${(r.prevMarks[i].marks/100)*100}%"></div></div>
            <div class="p-bar-track"><div class="p-bar-fill curr" style="width:${(m.marks/100)*100}%"></div></div>
          </div>
        </div>
      `).join('')}
      <div class="progress-legend">
        <span><span class="legend-dot" style="background:#c9b98a"></span>বিগত পরীক্ষা</span>
        <span><span class="legend-dot" style="background:var(--green-deep)"></span>বর্তমান পরীক্ষা</span>
      </div>
    </div>
    <div class="ledger-actions">
      <button type="button" class="btn btn-primary" id="downloadResultBtn">📄 ফলাফল পিডিএফ ডাউনলোড করুন</button>
    </div>
  `;
  document.getElementById('downloadResultBtn').addEventListener('click', downloadResultPdf);
});

function downloadResultPdf(){
  if (!lastResult) return;
  const {cls, roll, r} = lastResult;
  document.getElementById('pResClass').textContent = cls + ' শ্রেণি';
  document.getElementById('pResRoll').textContent = banglaDigit(roll);
  document.getElementById('pResGrade').textContent = r.grade;
  document.getElementById('pResDate').textContent = todayBn();
  const rows = [`<tr><th>বিষয়</th><th>বর্তমান প্রাপ্ত নম্বর</th><th>বিগত পরীক্ষার নম্বর</th></tr>`]
    .concat(r.marks.map((m,i)=>`<tr><td>${m.subject}</td><td>${banglaDigit(m.marks)}</td><td>${banglaDigit(r.prevMarks[i].marks)}</td></tr>`))
    .concat([`<tr><th>মোট নম্বর</th><td>${banglaDigit(r.total)}</td><td>${banglaDigit(r.prevTotal)}</td></tr>`]);
  document.getElementById('pResTable').innerHTML = rows.join('');
  printDocument('printResult');
}

/* =========================================================
   ATTENDANCE
   ========================================================= */
const months = ['জানু','ফেব্রু','মার্চ','এপ্রিল','মে','জুন'];
document.getElementById('attSearchBtn').addEventListener('click', () => {
  const cls = document.getElementById('attClass').value;
  const rollInput = document.getElementById('attRoll').value.trim();
  const roll = toEnglishDigits(rollInput);
  const box = document.getElementById('attendanceResult');
  if (!roll || isNaN(roll) || Number(roll) < 1){
    box.innerHTML = '<p class="ledger-empty">সঠিক রোল নম্বর দিন।</p>';
    return;
  }
  const seed = (cls.length * 5 + Number(roll) * 11) % 100;
  const monthPct = months.map((m,i) => 78 + ((seed + i*9) % 20));
  const avg = Math.round(monthPct.reduce((a,b)=>a+b,0)/monthPct.length);
  const color = avg >= 90 ? '#0B5D3B' : avg >= 75 ? '#E8A93A' : '#A6321E';
  box.innerHTML = `
    <div class="att-card">
      <div class="att-ring-wrap">
        <div class="att-ring" style="background:conic-gradient(${color} ${avg*3.6}deg, var(--paper-dark) 0deg)">
          <div class="att-ring-inner">
            <span class="att-ring-pct">${banglaDigit(avg)}%</span>
            <span class="att-ring-label">গড় উপস্থিতি</span>
          </div>
        </div>
        <p style="margin-top:10px; font-weight:700; color:var(--green-deep);">${cls} শ্রেণি — রোল ${banglaDigit(roll)}</p>
      </div>
      <div class="att-months">
        <h5 style="font-family:var(--font-display); color:var(--green-deep); margin:0 0 12px;">মাসভিত্তিক উপস্থিতির হার</h5>
        ${months.map((m,i)=>`
          <div class="att-month-row">
            <span class="m-label">${m}</span>
            <div class="m-track"><div class="m-fill" style="width:${monthPct[i]}%"></div></div>
            <span class="m-val">${banglaDigit(monthPct[i])}%</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
});

/* =========================================================
   CERTIFICATE (প্রত্যয়ন পত্র) — fill form, auto-download PDF
   ========================================================= */
document.getElementById('certificateForm').addEventListener('submit', function(e){
  e.preventDefault();
  const name = document.getElementById('certName').value.trim();
  const father = document.getElementById('certFather').value.trim();
  const cls = document.getElementById('certClass').value;
  const roll = document.getElementById('certRoll').value.trim();
  const session = document.getElementById('certSession').value.trim();
  const purpose = document.getElementById('certPurpose').value;
  const track = 'KUS-CERT-' + Date.now().toString().slice(-8);

  const bodyText = `এই মর্মে প্রত্যয়ন করা যাইতেছে যে, ${name}, পিতা: ${father}, কুশারিয়া উচ্চ বিদ্যালয়ের ${cls} শ্রেণির একজন নিয়মিত ছাত্র/ছাত্রী। তাহার রোল নম্বর ${banglaDigit(toEnglishDigits(roll))}, শিক্ষাবর্ষ/সেশন: ${session}। বিদ্যালয়ের রেকর্ড অনুযায়ী তাহার সার্বিক আচরণ, নৈতিক চরিত্র ও উপস্থিতি সন্তোষজনক। তাহাকে "${purpose}" এই প্রয়োজনে এই প্রত্যয়ন পত্র প্রদান করা হইলো। তাহার আগামী জীবন সুন্দর ও সাফল্যমণ্ডিত হউক — এই কামনা করি।`;

  document.getElementById('pCertBody').textContent = bodyText;
  document.getElementById('pCertTrack').textContent = track;
  document.getElementById('pCertDate').textContent = todayBn();

  const msg = document.getElementById('certificateMsg');
  msg.textContent = `✅ আপনার প্রত্যয়ন পত্র তৈরি হয়েছে (স্মারক নম্বর: ${track})। প্রিন্ট ডায়ালগ থেকে "Save as PDF" নির্বাচন করে ডাউনলোড করুন।`;
  msg.className = 'form-msg success';

  printDocument('printCertificate');
  this.reset();
});

/* =========================================================
   TEACHERS
   ========================================================= */
const teachers = [
  {name:'জনাব মোঃ আব্দুল হালিম', subject:'প্রধান শিক্ষক / বাংলা', qualification:'এম.এ (বাংলা), বি.এড', experience:'২৮ বছর', phone:'01711-000001', email:'halim.hs@kushariahs.edu.bd', photo:'https://picsum.photos/seed/teacher1/300/300'},
  {name:'জনাবা রোকেয়া বেগম', subject:'সহকারী প্রধান শিক্ষক / ইংরেজি', qualification:'এম.এ (ইংরেজি), বি.এড', experience:'২৪ বছর', phone:'01711-000002', email:'rokeya.hs@kushariahs.edu.bd', photo:'https://picsum.photos/seed/teacher2/300/300'},
  {name:'জনাব সাইফুল ইসলাম', subject:'গণিত', qualification:'এম.এসসি (গণিত), বি.এড', experience:'১৮ বছর', phone:'01711-000003', email:'saiful.hs@kushariahs.edu.bd', photo:'https://picsum.photos/seed/teacher3/300/300'},
  {name:'জনাবা নাসরিন সুলতানা', subject:'বিজ্ঞান (পদার্থ ও রসায়ন)', qualification:'এম.এসসি (পদার্থবিজ্ঞান)', experience:'১৫ বছর', phone:'01711-000004', email:'nasrin.hs@kushariahs.edu.bd', photo:'https://picsum.photos/seed/teacher4/300/300'},
  {name:'জনাব রফিকুল ইসলাম', subject:'জীববিজ্ঞান', qualification:'এম.এসসি (উদ্ভিদবিজ্ঞান), বি.এড', experience:'১৬ বছর', phone:'01711-000005', email:'rafiqul.hs@kushariahs.edu.bd', photo:'https://picsum.photos/seed/teacher5/300/300'},
  {name:'জনাবা ফারজানা আক্তার', subject:'সমাজবিজ্ঞান ও ইতিহাস', qualification:'এম.এ (ইতিহাস)', experience:'১২ বছর', phone:'01711-000006', email:'farzana.hs@kushariahs.edu.bd', photo:'https://picsum.photos/seed/teacher6/300/300'},
  {name:'জনাব মোখলেছুর রহমান', subject:'তথ্য ও যোগাযোগ প্রযুক্তি', qualification:'বি.এসসি (কম্পিউটার সায়েন্স)', experience:'৯ বছর', phone:'01711-000007', email:'mokhlesur.hs@kushariahs.edu.bd', photo:'https://picsum.photos/seed/teacher7/300/300'},
  {name:'জনাবা শাহনাজ পারভীন', subject:'ধর্ম শিক্ষা', qualification:'কামিল (হাদিস), বি.এড', experience:'২০ বছর', phone:'01711-000008', email:'shahnaz.hs@kushariahs.edu.bd', photo:'https://picsum.photos/seed/teacher8/300/300'}
];
const teacherGrid = document.getElementById('teacherGrid');
teachers.forEach((t, idx) => {
  const card = document.createElement('div');
  card.className = 'teacher-card';
  card.innerHTML = `
    <img class="teacher-photo" src="${t.photo}" alt="${t.name}">
    <h4 class="teacher-name">${t.name}</h4>
    <p class="teacher-subject">${t.subject}</p>
  `;
  card.addEventListener('click', () => openTeacherModal(idx));
  teacherGrid.appendChild(card);
});
const teacherModalOverlay = document.getElementById('teacherModalOverlay');
function openTeacherModal(idx){
  const t = teachers[idx];
  document.getElementById('teacherModalContent').innerHTML = `
    <img class="modal-teacher-photo" src="${t.photo}" alt="${t.name}">
    <h3 class="modal-teacher-name">${t.name}</h3>
    <p class="modal-teacher-subject">${t.subject}</p>
    <p class="modal-teacher-detail"><b>শিক্ষাগত যোগ্যতা:</b> ${t.qualification}</p>
    <p class="modal-teacher-detail"><b>অভিজ্ঞতা:</b> ${t.experience}</p>
    <p class="modal-teacher-detail"><b>মোবাইল নম্বর:</b> ${t.phone}</p>
    <p class="modal-teacher-detail"><b>ইমেইল:</b> ${t.email}</p>
  `;
  teacherModalOverlay.classList.add('open');
}
document.getElementById('teacherModalClose').addEventListener('click', () => teacherModalOverlay.classList.remove('open'));
teacherModalOverlay.addEventListener('click', (e) => { if (e.target === teacherModalOverlay) teacherModalOverlay.classList.remove('open'); });

/* =========================================================
   GALLERY
   ========================================================= */
const galleryItems = [
  {cat:'ক্রীড়া', img:'https://picsum.photos/seed/sports1/500/650', caption:'বার্ষিক ক্রীড়া প্রতিযোগিতা ২০২৫'},
  {cat:'সাংস্কৃতিক', img:'https://picsum.photos/seed/cultural1/500/400', caption:'বসন্ত উৎসব সাংস্কৃতিক অনুষ্ঠান'},
  {cat:'বার্ষিক', img:'https://picsum.photos/seed/annual1/500/620', caption:'বার্ষিক পুনর্মিলনী অনুষ্ঠান'},
  {cat:'পুরস্কার', img:'https://picsum.photos/seed/prize1/500/400', caption:'শ্রেষ্ঠ শিক্ষার্থী পুরস্কার বিতরণী'},
  {cat:'ক্রীড়া', img:'https://picsum.photos/seed/sports2/500/500', caption:'আন্তঃশ্রেণি ফুটবল প্রতিযোগিতা'},
  {cat:'সাংস্কৃতিক', img:'https://picsum.photos/seed/cultural2/500/650', caption:'একুশে ফেব্রুয়ারি অনুষ্ঠান'},
  {cat:'বার্ষিক', img:'https://picsum.photos/seed/annual2/500/400', caption:'বিদ্যালয় বার্ষিকী উদযাপন'},
  {cat:'পুরস্কার', img:'https://picsum.photos/seed/prize2/500/560', caption:'জেএসসি কৃতি শিক্ষার্থী সংবর্ধনা'},
];
const galleryGrid = document.getElementById('galleryGrid');
function renderGallery(filter){
  galleryGrid.innerHTML = '';
  galleryItems
    .filter(g => filter === 'সব' || g.cat === filter)
    .forEach(g => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.innerHTML = `<img src="${g.img}" alt="${g.caption}"><div class="gallery-caption">${g.caption}</div>`;
      item.addEventListener('click', () => openLightbox(g.img, g.caption));
      galleryGrid.appendChild(item);
    });
}
renderGallery('সব');
document.querySelectorAll('.gallery-filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.gallery-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderGallery(btn.dataset.cat);
  });
});
const lightboxOverlay = document.getElementById('lightboxOverlay');
function openLightbox(src, caption){
  document.getElementById('lightboxImg').src = src;
  document.getElementById('lightboxCaption').textContent = caption;
  lightboxOverlay.classList.add('open');
}
document.getElementById('lightboxClose').addEventListener('click', () => lightboxOverlay.classList.remove('open'));
lightboxOverlay.addEventListener('click', (e) => { if (e.target === lightboxOverlay) lightboxOverlay.classList.remove('open'); });

/* =========================================================
   ALUMNI — membership + fee
   ========================================================= */
document.getElementById('alumniMemberForm').addEventListener('submit', function(e){
  e.preventDefault();
  const name = document.getElementById('alName').value.trim();
  const msg = document.getElementById('alumniMemberMsg');
  msg.textContent = `✅ ধন্যবাদ ${name}! আপনার অ্যালামনাই সদস্যপদের আবেদন গৃহীত হয়েছে। কমিটি যাচাই করে শীঘ্রই যোগাযোগ করবে।`;
  msg.className = 'form-msg success';
  this.reset();
});

let feeAmount = 200, feePeriod = 'মাসিক';
document.querySelectorAll('.fee-toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.fee-toggle-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    feeAmount = Number(btn.dataset.amt);
    feePeriod = btn.dataset.period;
    document.getElementById('feeAmountText').textContent = `${banglaDigit(feeAmount)} ৳ (${feePeriod})`;
  });
});
document.getElementById('alumniFeeForm').addEventListener('submit', function(e){
  e.preventDefault();
  const name = document.getElementById('feeName').value.trim();
  const txn = document.getElementById('feeTxn').value.trim();
  const method = document.getElementById('feeMethod').value;
  const record = {name, txn, method, amount: feeAmount, period: feePeriod, time: new Date().toISOString()};
  const list = JSON.parse(localStorage.getItem('kus_alumni_fees') || '[]');
  list.push(record);
  localStorage.setItem('kus_alumni_fees', JSON.stringify(list));
  const msg = document.getElementById('alumniFeeMsg');
  msg.textContent = `✅ ${banglaDigit(feeAmount)} ৳ (${feePeriod}) চাঁদা জমার তথ্য গৃহীত হয়েছে। ট্রানজেকশন আইডি: ${txn}। ধন্যবাদ, ${name}!`;
  msg.className = 'form-msg success';
  this.reset();
  document.querySelector('.fee-toggle-btn.active').click();
});

/* =========================================================
   NOTABLE / ACHIEVER STUDENTS
   ========================================================= */
const achievers = [
  {name:'তানভীর আহমেদ', uni:'ঢাকা বিশ্ববিদ্যালয় — অর্থনীতি বিভাগ', year:'২০১৮', photo:'https://picsum.photos/seed/ach1/400/300'},
  {name:'সুমাইয়া আক্তার', uni:'বুয়েট — তড়িৎ ও ইলেকট্রনিক প্রকৌশল', year:'২০১৯', photo:'https://picsum.photos/seed/ach2/400/300'},
  {name:'মেহেদী হাসান', uni:'রাজশাহী বিশ্ববিদ্যালয় — পদার্থবিজ্ঞান', year:'২০২০', photo:'https://picsum.photos/seed/ach3/400/300'},
  {name:'নুসরাত জাহান', uni:'জাহাঙ্গীরনগর বিশ্ববিদ্যালয় — আইন বিভাগ', year:'২০২১', photo:'https://picsum.photos/seed/ach4/400/300'},
  {name:'রাকিবুল ইসলাম', uni:'ঢাকা মেডিকেল কলেজ — এমবিবিএস', year:'২০২২', photo:'https://picsum.photos/seed/ach5/400/300'},
  {name:'ফাহমিদা ইয়াসমিন', uni:'চট্টগ্রাম বিশ্ববিদ্যালয় — ইংরেজি বিভাগ', year:'২০২৩', photo:'https://picsum.photos/seed/ach6/400/300'},
];
const achieverGrid = document.getElementById('achieverGrid');
achievers.forEach(a => {
  const card = document.createElement('div');
  card.className = 'achiever-card';
  card.innerHTML = `
    <img class="achiever-photo" src="${a.photo}" alt="${a.name}">
    <h4 class="achiever-name">${a.name}</h4>
    <p class="achiever-uni">${a.uni}</p>
    <span class="achiever-year">ভর্তি সাল: ${a.year}</span>
  `;
  achieverGrid.appendChild(card);
});

/* =========================================================
   CONTACT FORM
   ========================================================= */
document.getElementById('contactForm').addEventListener('submit', function(e){
  e.preventDefault();
  const msg = document.getElementById('contactMsg');
  msg.textContent = '✅ আপনার বার্তা পাঠানো হয়েছে। ধন্যবাদ!';
  msg.className = 'form-msg success';
  this.reset();
});
