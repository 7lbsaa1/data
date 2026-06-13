// 1. مصفوفة الطلاب الوهمية (Mock Data) للتبديل والتجربة
const students = [
    {
        id: 1,
        name: "أحمد محمد علي",
        major: "هندسة البرمجيات",
        image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150", // يوجد صورة
        email: "ahmed.medo@email.com",
        phone: "01012345678",
        city: "القاهرة",
        grade: "امتياز"
    },
    {
        id: 2,
        name: "سارة عبد الرحمن",
        major: "ذكاء اصطناعي",
        image: "", // لا توجد صورة (سيتم إخفاؤها وإظهار الحرف الأول)
        email: "sara.abdo@email.com",
        phone: "01288877766",
        city: "الجيزة",
        grade: "جيد جداً"
    },
    {
        id: 3,
        name: "عمر محمود حسن",
        major: "علوم الحاسب",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", // يوجد صورة
        email: "omar.hassan@email.com",
        phone: "01155544433",
        city: "الإسكندرية",
        grade: "إمتياز"
    },
    {
        id: 4,
        name: "فاطمة الزهراء خالد",
        major: "الأمن السيبراني",
        image: "", // لا توجد صورة
        email: "fatma.khaled@email.com",
        phone: "01599922211",
        city: "طنطا",
        grade: "جيد"
    }
];

// 2. عناصر الواجهة DOM
const studentsGrid = document.getElementById('studentsGrid');
const searchInput = document.getElementById('searchInput');
const studentModal = document.getElementById('studentModal');
const modalBody = document.getElementById('modalBody');
const closeModalBtn = document.getElementById('closeModalBtn');

// 3. دالة رندر وعرض بطاقات الطلاب بناءً على البيانات والمصفوفة
function displayStudents(studentsArray) {
    studentsGrid.innerHTML = ''; // تفريغ الشبكة أولاً
    
    if(studentsArray.length === 0) {
        studentsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #777; padding: 20px;">لا يوجد طلاب يطابقون بحثك..</p>`;
        return;
    }

    studentsArray.forEach(student => {
        // التحقق الذكي من وجود الصورة: إذا لم توجد نضع حرف الطالب الأول داخل أيقونة دائرية
        const avatarHTML = student.image 
            ? `<img src="${student.image}" alt="${student.name}" class="student-img">`
            : `<div class="no-img-avatar"><i class="fas fa-user"></i></div>`;

        const card = document.createElement('div');
        card.className = 'student-card';
        card.innerHTML = `
            <div class="card-decor"></div>
            <div class="avatar-container">
                ${avatarHTML}
            </div>
            <div class="student-info">
                <h3>${student.name}</h3>
                <p class="major">${student.major}</p>
                <button class="view-btn" onclick="openStudentDetails(${student.id})">عرض كامل البيانات</button>
            </div>
        `;
        studentsGrid.appendChild(card);
    });
}

// 4. دالة فتح الـ Modal وعرض البيانات الكاملة
function openStudentDetails(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;

    // إعداد الـ Avatar داخل المودال بنفس الطريقة الذكية
    const modalAvatarHTML = student.image 
        ? `<img src="${student.image}" alt="${student.name}" class="student-img modal-avatar">`
        : `<div class="no-img-avatar modal-avatar" style="margin: -65px auto 15px auto;"><i class="fas fa-user"></i></div>`;

    modalBody.innerHTML = `
        ${modalAvatarHTML}
        <h2>${student.name}</h2>
        <span class="modal-major">${student.major}</span>
        
        <div class="details-list">
            <div class="detail-item">
                <i class="fas fa-envelope"></i>
                <span><strong>البريد الإلكتروني:</strong> ${student.email}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-phone"></i>
                <span><strong>رقم الهاتف:</strong> ${student.phone}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-map-marker-alt"></i>
                <span><strong>المحافظة / العنوان:</strong> ${student.city}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-star"></i>
                <span><strong>التقدير العام:</strong> ${student.grade}</span>
            </div>
        </div>
    `;

    studentModal.classList.add('active');
}

// 5. إغلاق النافذة المنبثقة
closeModalBtn.addEventListener('click', () => {
    studentModal.classList.remove('active');
});

// إغلاق المودال عند الضغط في أي مكان خارج الكارد نفسه
window.addEventListener('click', (e) => {
    if (e.target === studentModal) {
        studentModal.classList.remove('active');
    }
});

// 6. ميزة البحث الذكي والفلترة الفورية (Event Listener للـ Input)
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();
    const filtered = students.filter(student => {
        return student.name.toLowerCase().includes(term) || 
               student.major.toLowerCase().includes(term);
    });
    displayStudents(filtered);
});

// تشغيل العرض الأولي عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    displayStudents(students);
});
