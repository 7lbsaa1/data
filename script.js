import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCk9l8XNO4y-6qnaOqKsfAKQPbaemOOHrU",
  authDomain: "students-d06e7.firebaseapp.com",
  projectId: "students-d06e7",
  storageBucket: "students-d06e7.firebasestorage.app",
  messagingSenderId: "932035308750",
  appId: "1:932035308750:web:781364ca90256bca80749f",
  measurementId: "G-6VBEFTCHVG"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let students = [];

const studentsGrid = document.getElementById('studentsGrid');
const searchInput = document.getElementById('searchInput');
const studentModal = document.getElementById('studentModal');
const modalBody = document.getElementById('modalBody');
const closeModalBtn = document.getElementById('closeModalBtn');

// استماع فوري لقاعدة البيانات مع تفعيل رندر الحركات
onSnapshot(collection(db, "students"), (snapshot) => {
    students = [];
    snapshot.forEach((doc) => {
        students.push({ id: doc.id, ...doc.data() });
    });
    displayStudents(students);
});

function displayStudents(studentsArray) {
    studentsGrid.innerHTML = ''; 
    
    if(studentsArray.length === 0) {
        studentsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #7f8c8d; padding: 30px; font-weight: 600;">لا يوجد طلاب يطابقون محددات البحث حالياً..</p>`;
        return;
    }

    studentsArray.forEach((student, index) => {
        const avatarHTML = (student.image && student.image.trim() !== "") 
            ? `<img src="${student.image}" alt="${student.name}" class="student-img">`
            : `<div class="no-img-avatar"><i class="fas fa-user"></i></div>`;

        const card = document.createElement('div');
        card.className = 'student-card';
        // إضافة تأخير بسيط لكل كارد ليظهر الواحد تلو الآخر بشكل جمالي متتابع
        card.style.animationDelay = `${index * 0.05}s`;
        
        card.innerHTML = `
            <div class="card-decor"></div>
            <div class="avatar-container">
                ${avatarHTML}
            </div>
            <div class="student-info">
                <h3>${student.name}</h3>
                <p class="major">${student.major}</p>
                <button class="view-btn" data-id="${student.id}">عرض كامل البيانات</button>
            </div>
        `;
        studentsGrid.appendChild(card);
    });

    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => openStudentDetails(btn.getAttribute('data-id')));
    });
}

function openStudentDetails(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;

    const modalAvatarHTML = (student.image && student.image.trim() !== "") 
        ? `<img src="${student.image}" alt="${student.name}" class="student-img modal-avatar">`
        : `<div class="no-img-avatar modal-avatar" style="margin: -75px auto 15px auto;"><i class="fas fa-user"></i></div>`;

    modalBody.innerHTML = `
        ${modalAvatarHTML}
        <h2>${student.name}</h2>
        <span class="modal-major">${student.major}</span>
        
        <div class="details-list">
            <div class="detail-item">
                <i class="fas fa-envelope"></i>
                <span><strong>البريد الإلكتروني:</strong> ${student.email || 'غير مسجل'}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-phone"></i>
                <span><strong>رقم الهاتف:</strong> ${student.phone || 'غير مسجل'}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-map-marker-alt"></i>
                <span><strong>المحافظة / العنوان:</strong> ${student.city || 'غير مسجل'}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-star"></i>
                <span><strong>التقدير العام:</strong> ${student.grade || 'غير مسجل'}</span>
            </div>
        </div>
    `;

    studentModal.classList.add('active');
}

closeModalBtn.addEventListener('click', () => studentModal.classList.remove('active'));
window.addEventListener('click', (e) => { if (e.target === studentModal) studentModal.classList.remove('active'); });

searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();
    const filtered = students.filter(student => {
        return student.name.toLowerCase().includes(term) || 
               student.major.toLowerCase().includes(term);
    });
    displayStudents(filtered);
});
