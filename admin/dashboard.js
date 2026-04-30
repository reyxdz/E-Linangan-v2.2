// ===== AUTH CHECK =====
document.addEventListener('DOMContentLoaded', () => {
    if (!AUTH.requireAuth(['admin'])) return;
    const user = AUTH.getUser();
    if (user) document.getElementById('adminName').textContent = `${user.firstName} ${user.lastName}`;
    loadStats();
});

// ===== NAVIGATION =====
function showSection(name) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('section-' + name).classList.add('active');
    document.querySelector(`.nav-btn[data-section="${name}"]`).classList.add('active');
    // Load data for each section
    if (name === 'stats') loadStats();
    else if (name === 'schools') loadSchools();
    else if (name === 'teachers') { loadTeachers(); loadPendingTeachers(); }
    else if (name === 'students') loadStudents();
    else if (name === 'admins') loadAdmins();
    // Close mobile sidebar
    document.getElementById('sidebar').classList.remove('open');
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

// ===== TOAST =====
function showToast(msg, isError = false) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast show' + (isError ? ' error' : '');
    setTimeout(() => t.className = 'toast', 3000);
}

// ===== MODAL =====
function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

// ===== HELPERS =====
function fmtDate(d) { return d ? new Date(d).toLocaleDateString('fil-PH') : '-'; }

// ===== STATS =====
async function loadStats() {
    const r = await AUTH.apiCall('/api/admin/stats');
    if (r.error) return showToast(r.message, true);
    document.getElementById('statSchools').textContent = r.totalSchools;
    document.getElementById('statTeachers').textContent = r.totalTeachers;
    document.getElementById('statStudents').textContent = r.totalStudents;
    document.getElementById('statPendingStudents').textContent = r.pendingStudents;
    document.getElementById('statPendingTeachers').textContent = r.pendingTeachers;
    document.getElementById('statAdmins').textContent = r.totalAdmins;
}

// ===== SCHOOLS =====
let schoolsList = [];

async function loadSchools() {
    const r = await AUTH.apiCall('/api/admin/schools');
    if (r.error) return showToast(r.message, true);
    schoolsList = r.schools;
    const tbody = document.getElementById('schoolsBody');
    if (!r.schools.length) { tbody.innerHTML = '<tr><td colspan="4" class="loading-cell">Walang paaralan.</td></tr>'; return; }
    tbody.innerHTML = r.schools.map(s => `<tr>
        <td>${s.schoolId}</td><td>${s.name}</td><td>${fmtDate(s.createdAt)}</td>
        <td><button class="tbl-btn tbl-btn-edit" onclick="editSchool('${s._id}')"><i class="ri-edit-line"></i></button>
            <button class="tbl-btn tbl-btn-delete" onclick="deleteSchool('${s._id}','${s.name}')"><i class="ri-delete-bin-line"></i></button></td>
    </tr>`).join('');
}

function editSchool(id) {
    const s = schoolsList.find(x => x._id === id);
    if (!s) return;
    document.getElementById('schoolEditId').value = id;
    document.getElementById('schoolIdInput').value = s.schoolId;
    document.getElementById('schoolNameInput').value = s.name;
    document.getElementById('schoolModalTitle').textContent = 'I-edit ang Paaralan';
    openModal('schoolModal');
}

async function handleSchoolSubmit(e) {
    e.preventDefault();
    const editId = document.getElementById('schoolEditId').value;
    const data = { schoolId: document.getElementById('schoolIdInput').value.trim(), name: document.getElementById('schoolNameInput').value.trim() };
    const r = editId
        ? await AUTH.apiCall(`/api/admin/schools/${editId}`, { method: 'PATCH', body: JSON.stringify(data) })
        : await AUTH.apiCall('/api/admin/schools', { method: 'POST', body: JSON.stringify(data) });
    if (r.error) return showToast(r.message, true);
    showToast(r.message);
    closeModal('schoolModal');
    document.getElementById('schoolForm').reset();
    document.getElementById('schoolEditId').value = '';
    document.getElementById('schoolModalTitle').textContent = 'Magdagdag ng Paaralan';
    loadSchools();
}

async function deleteSchool(id, name) {
    if (!confirm(`Sigurado ka bang gusto mong burahin ang "${name}"?`)) return;
    const r = await AUTH.apiCall(`/api/admin/schools/${id}`, { method: 'DELETE' });
    if (r.error) return showToast(r.message, true);
    showToast(r.message);
    loadSchools();
}

// ===== TEACHERS =====
let teachersList = [];

async function loadSchoolOptions(selectId) {
    const r = await AUTH.apiCall('/api/admin/schools');
    if (r.error) return;
    const sel = document.getElementById(selectId);
    sel.innerHTML = '<option value="">Pumili ng paaralan...</option>';
    r.schools.forEach(s => { sel.innerHTML += `<option value="${s._id}">${s.name} (${s.schoolId})</option>`; });
}

async function loadTeachers() {
    const r = await AUTH.apiCall('/api/admin/teachers?status=approved');
    if (r.error) return showToast(r.message, true);
    teachersList = r.teachers;
    const tbody = document.getElementById('teachersBody');
    if (!r.teachers.length) { tbody.innerHTML = '<tr><td colspan="5" class="loading-cell">Walang guro.</td></tr>'; return; }
    tbody.innerHTML = r.teachers.map(t => `<tr>
        <td>${t.firstName} ${t.lastName}</td><td>${t.username}</td>
        <td>${t.schoolId ? t.schoolId.name : '-'}</td><td>${fmtDate(t.createdAt)}</td>
        <td><button class="tbl-btn tbl-btn-edit" onclick="editTeacher('${t._id}')"><i class="ri-edit-line"></i></button>
            <button class="tbl-btn tbl-btn-delete" onclick="deleteTeacher('${t._id}','${t.firstName}')"><i class="ri-delete-bin-line"></i></button></td>
    </tr>`).join('');
}

async function loadPendingTeachers() {
    const r = await AUTH.apiCall('/api/admin/teachers/pending');
    if (r.error) return;
    const section = document.getElementById('pendingTeachersSection');
    const tbody = document.getElementById('pendingTeachersBody');
    if (!r.teachers.length) { section.style.display = 'none'; return; }
    section.style.display = 'block';
    tbody.innerHTML = r.teachers.map(t => `<tr>
        <td>${t.firstName} ${t.lastName}</td><td>${t.username}</td>
        <td>${t.schoolId ? t.schoolId.name : '-'}</td>
        <td><button class="tbl-btn tbl-btn-approve" onclick="approveTeacher('${t._id}')"><i class="ri-check-line"></i> Aprubahan</button>
            <button class="tbl-btn tbl-btn-reject" onclick="rejectTeacher('${t._id}')"><i class="ri-close-line"></i> Tanggihan</button></td>
    </tr>`).join('');
}

async function approveTeacher(id) {
    const r = await AUTH.apiCall(`/api/admin/teachers/${id}/approve`, { method: 'PATCH' });
    if (r.error) return showToast(r.message, true);
    showToast(r.message);
    loadPendingTeachers();
    loadTeachers();
    loadStats();
}

async function rejectTeacher(id) {
    if (!confirm('Sigurado ka bang gusto mong tanggihan ang gurong ito?')) return;
    const r = await AUTH.apiCall(`/api/admin/teachers/${id}/reject`, { method: 'PATCH' });
    if (r.error) return showToast(r.message, true);
    showToast(r.message);
    loadPendingTeachers();
}

function editTeacher(id) {
    const t = teachersList.find(x => x._id === id);
    if (!t) return;
    loadSchoolOptions('teacherSchool').then(() => {
        document.getElementById('teacherSchool').value = t.schoolId ? t.schoolId._id : '';
    });
    document.getElementById('teacherEditId').value = id;
    document.getElementById('teacherFirstName').value = t.firstName;
    document.getElementById('teacherLastName').value = t.lastName;
    document.getElementById('teacherUsername').value = t.username;
    document.getElementById('teacherPassword').value = '';
    document.getElementById('teacherPassword').removeAttribute('required');
    document.getElementById('teacherPasswordHint').style.display = 'block';
    document.getElementById('teacherModalTitle').textContent = 'I-edit ang Guro';
    openModal('teacherModal');
}

async function handleTeacherSubmit(e) {
    e.preventDefault();
    const editId = document.getElementById('teacherEditId').value;
    const data = {
        firstName: document.getElementById('teacherFirstName').value.trim(),
        lastName: document.getElementById('teacherLastName').value.trim(),
        username: document.getElementById('teacherUsername').value.trim(),
        schoolId: document.getElementById('teacherSchool').value
    };
    const pw = document.getElementById('teacherPassword').value;
    if (pw) data.password = pw;
    if (!editId && !pw) { showToast('Kailangan ang password.', true); return; }

    const r = editId
        ? await AUTH.apiCall(`/api/admin/teachers/${editId}`, { method: 'PATCH', body: JSON.stringify(data) })
        : await AUTH.apiCall('/api/admin/teachers', { method: 'POST', body: JSON.stringify({ ...data, password: pw }) });
    if (r.error) return showToast(r.message, true);
    showToast(r.message);
    closeModal('teacherModal');
    resetTeacherForm();
    loadTeachers();
}

function resetTeacherForm() {
    document.getElementById('teacherForm').reset();
    document.getElementById('teacherEditId').value = '';
    document.getElementById('teacherPassword').setAttribute('required', '');
    document.getElementById('teacherPasswordHint').style.display = 'none';
    document.getElementById('teacherModalTitle').textContent = 'Magdagdag ng Guro';
}

async function deleteTeacher(id, name) {
    if (!confirm(`Sigurado ka bang gusto mong burahin si "${name}"?`)) return;
    const r = await AUTH.apiCall(`/api/admin/teachers/${id}`, { method: 'DELETE' });
    if (r.error) return showToast(r.message, true);
    showToast(r.message);
    loadTeachers();
}

// Open teacher modal with school options loaded
document.querySelector('[onclick="openModal(\'teacherModal\')"]').addEventListener('click', () => {
    resetTeacherForm();
    loadSchoolOptions('teacherSchool');
}, true);

// ===== STUDENTS =====
async function loadStudents() {
    const r = await AUTH.apiCall('/api/admin/students');
    if (r.error) return showToast(r.message, true);
    const tbody = document.getElementById('studentsBody');
    if (!r.students.length) { tbody.innerHTML = '<tr><td colspan="6" class="loading-cell">Walang estudyante.</td></tr>'; return; }
    tbody.innerHTML = r.students.map(s => `<tr>
        <td>${s.firstName} ${s.lastName}</td><td>${s.username}</td>
        <td>${s.schoolId ? s.schoolId.name : '-'}</td>
        <td><span class="status-badge status-${s.status}">${s.status}</span></td>
        <td><button class="tbl-btn tbl-btn-delete" onclick="deleteStudent('${s._id}','${s.firstName}')"><i class="ri-delete-bin-line"></i></button></td>
    </tr>`).join('');
}

async function deleteStudent(id, name) {
    if (!confirm(`Sigurado ka bang gusto mong burahin si "${name}" at lahat ng kanyang datos?`)) return;
    const r = await AUTH.apiCall(`/api/admin/students/${id}`, { method: 'DELETE' });
    if (r.error) return showToast(r.message, true);
    showToast(r.message);
    loadStudents();
}

// ===== ADMINS =====
let adminsList = [];

async function loadAdmins() {
    const r = await AUTH.apiCall('/api/admin/admins');
    if (r.error) return showToast(r.message, true);
    adminsList = r.admins;
    const tbody = document.getElementById('adminsBody');
    const currentUser = AUTH.getUser();
    if (!r.admins.length) { tbody.innerHTML = '<tr><td colspan="4" class="loading-cell">Walang admin.</td></tr>'; return; }
    tbody.innerHTML = r.admins.map(a => `<tr>
        <td>${a.firstName} ${a.lastName} ${a._id === currentUser._id ? '<span class="status-badge status-approved">Ikaw</span>' : ''}</td>
        <td>${a.username}</td><td>${fmtDate(a.createdAt)}</td>
        <td>${a._id !== currentUser._id ? `<button class="tbl-btn tbl-btn-edit" onclick="editAdmin('${a._id}')"><i class="ri-edit-line"></i></button>
            <button class="tbl-btn tbl-btn-delete" onclick="deleteAdmin('${a._id}','${a.firstName}')"><i class="ri-delete-bin-line"></i></button>` : '-'}</td>
    </tr>`).join('');
}

function editAdmin(id) {
    const a = adminsList.find(x => x._id === id);
    if (!a) return;
    document.getElementById('adminEditId').value = id;
    document.getElementById('adminFirstName').value = a.firstName;
    document.getElementById('adminLastName').value = a.lastName;
    document.getElementById('adminUsername').value = a.username;
    document.getElementById('adminPassword').value = '';
    document.getElementById('adminPassword').removeAttribute('required');
    document.getElementById('adminPasswordHint').style.display = 'block';
    document.getElementById('adminModalTitle').textContent = 'I-edit ang Admin';
    openModal('adminModal');
}

async function handleAdminSubmit(e) {
    e.preventDefault();
    const editId = document.getElementById('adminEditId').value;
    const data = {
        firstName: document.getElementById('adminFirstName').value.trim(),
        lastName: document.getElementById('adminLastName').value.trim(),
        username: document.getElementById('adminUsername').value.trim()
    };
    const pw = document.getElementById('adminPassword').value;
    if (pw) data.password = pw;
    if (!editId && !pw) { showToast('Kailangan ang password.', true); return; }

    const r = editId
        ? await AUTH.apiCall(`/api/admin/admins/${editId}`, { method: 'PATCH', body: JSON.stringify(data) })
        : await AUTH.apiCall('/api/admin/admins', { method: 'POST', body: JSON.stringify({ ...data, password: pw }) });
    if (r.error) return showToast(r.message, true);
    showToast(r.message);
    closeModal('adminModal');
    resetAdminForm();
    loadAdmins();
}

function resetAdminForm() {
    document.getElementById('adminForm').reset();
    document.getElementById('adminEditId').value = '';
    document.getElementById('adminPassword').setAttribute('required', '');
    document.getElementById('adminPasswordHint').style.display = 'none';
    document.getElementById('adminModalTitle').textContent = 'Magdagdag ng Admin';
}

async function deleteAdmin(id, name) {
    if (!confirm(`Sigurado ka bang gusto mong burahin si "${name}"?`)) return;
    const r = await AUTH.apiCall(`/api/admin/admins/${id}`, { method: 'DELETE' });
    if (r.error) return showToast(r.message, true);
    showToast(r.message);
    loadAdmins();
}

// Open admin modal reset
document.querySelector('[onclick="openModal(\'adminModal\')"]').addEventListener('click', () => resetAdminForm(), true);
