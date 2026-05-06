// ===== AUTH CHECK =====
let performanceData = [];

document.addEventListener('DOMContentLoaded', async () => {
    if (!AUTH.requireAuth(['teacher'])) return;
    const user = AUTH.getUser();
    if (user) {
        document.getElementById('teacherName').textContent = `${user.firstName} ${user.lastName}`;
        document.getElementById('profileUsername').value = user.username;
    }
    // Load school name
    const me = await AUTH.apiCall('/api/auth/me');
    if (!me.error && me.user && me.user.schoolId) {
        document.getElementById('teacherSchool').textContent = me.user.schoolId.name;
    }
    loadPending();
});

// ===== NAVIGATION =====
function showSection(name) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('section-' + name).classList.add('active');
    document.querySelector(`.nav-btn[data-section="${name}"]`).classList.add('active');
    if (name === 'pending') loadPending();
    else if (name === 'performance') loadPerformance();
    document.getElementById('sidebar').classList.remove('open');
}

function toggleSidebar() { document.getElementById('sidebar').classList.toggle('open'); }

// ===== TOAST =====
function showToast(msg, isError = false) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast show' + (isError ? ' error' : '');
    setTimeout(() => t.className = 'toast', 3000);
}

// ===== HELPERS =====
function fmtDate(d) { return d ? new Date(d).toLocaleDateString('fil-PH') : '-'; }
function fmtTime(seconds) {
    if (!seconds || seconds === 0) return '-';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
}

// ===== PENDING STUDENTS =====
async function loadPending() {
    const r = await AUTH.apiCall('/api/teacher/pending');
    if (r.error) return showToast(r.message, true);
    const tbody = document.getElementById('pendingBody');
    const countEl = document.getElementById('pendingCount');

    if (!r.students.length) {
        tbody.innerHTML = '<tr><td colspan="5" class="loading-cell">Walang naghihintay na estudyante. <i class="fas fa-star"></i></td></tr>';
        countEl.style.display = 'none';
        return;
    }

    countEl.textContent = r.students.length;
    countEl.style.display = 'inline';

    tbody.innerHTML = r.students.map(s => `<tr>
        <td>${s.firstName} ${s.lastName}</td>
        <td>${s.username}</td>
        <td>${fmtDate(s.createdAt)}</td>
        <td>
            <button class="tbl-btn tbl-btn-approve" onclick="approveStudent('${s._id}')"><i class="ri-check-line"></i> Aprubahan</button>
            <button class="tbl-btn tbl-btn-reject" onclick="rejectStudent('${s._id}')"><i class="ri-close-line"></i> Tanggihan</button>
        </td>
    </tr>`).join('');
}

async function approveStudent(id) {
    const r = await AUTH.apiCall(`/api/teacher/approve/${id}`, { method: 'PATCH' });
    if (r.error) return showToast(r.message, true);
    showToast(r.message);
    loadPending();
}

async function rejectStudent(id) {
    if (!confirm('Sigurado ka bang gusto mong tanggihan ang estudyanteng ito?')) return;
    const r = await AUTH.apiCall(`/api/teacher/reject/${id}`, { method: 'PATCH' });
    if (r.error) return showToast(r.message, true);
    showToast(r.message);
    loadPending();
}

// ===== PERFORMANCE =====
async function loadPerformance() {
    const quizStatus = document.getElementById('filterQuizStatus').value;

    let query = '?';
    if (quizStatus) query += `quizStatus=${encodeURIComponent(quizStatus)}&`;

    const r = await AUTH.apiCall(`/api/teacher/performance${query}`);
    if (r.error) return showToast(r.message, true);

    performanceData = r.performance;
    document.getElementById('perfSummary').textContent = `Kabuuang Estudyante: ${r.totalStudents}`;

    const tbody = document.getElementById('perfBody');
    if (!r.performance.length) {
        tbody.innerHTML = '<tr><td colspan="7" class="loading-cell">Walang datos.</td></tr>';
        return;
    }

    tbody.innerHTML = r.performance.map(p => {
        const preScore = p.paunangScore ? `${p.paunangScore.score}/${p.paunangScore.total} (${p.paunangScore.percentage.toFixed(1)}%)` : '-';
        const postScore = p.pangwakasScore ? `${p.pangwakasScore.score}/${p.pangwakasScore.total} (${p.pangwakasScore.percentage.toFixed(1)}%)` : '-';

        let improvementClass = 'improvement-neutral';
        let improvementText = '-';
        if (p.improvement !== null) {
            if (p.improvement > 0) { improvementClass = 'improvement-positive'; improvementText = `+${p.improvement.toFixed(1)}%`; }
            else if (p.improvement < 0) { improvementClass = 'improvement-negative'; improvementText = `${p.improvement.toFixed(1)}%`; }
            else { improvementText = '0%'; }
        }

        return `<tr>
            <td>${p.lastName}, ${p.firstName}</td>
            <td>${preScore}</td>
            <td>${postScore}</td>
            <td><span class="${improvementClass}">${improvementText}</span></td>
            <td>${p.lessonsCompleted}</td>
            <td>${fmtTime(p.totalTimeSpentSeconds)}</td>
        </tr>`;
    }).join('');
}

// ===== EXPORT PDF =====
function exportPDF() {
    if (!performanceData.length) return showToast('Walang datos na mai-export.', true);

    if (!window.jspdf) return showToast('PDF library hindi pa na-load. Subukan muli.', true);

    // Ensure autotable plugin can find jsPDF
    if (!window.jsPDF) window.jsPDF = window.jspdf.jsPDF;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape');

    if (typeof doc.autoTable !== 'function') {
        return showToast('PDF table plugin hindi na-load. I-refresh ang page at subukan muli.', true);
    }

    // Title
    doc.setFontSize(16);
    doc.text('E-Linangan — Performance Report', 14, 15);
    doc.setFontSize(9);
    doc.text(`Petsa: ${new Date().toLocaleDateString('fil-PH')}`, 14, 22);

    const user = AUTH.getUser();
    if (user) doc.text(`Guro: ${user.firstName} ${user.lastName}`, 14, 27);

    // Table data
    const headers = [['Pangalan', 'Paunang Pagsusulit', 'Pangwakas', 'Improvement', 'Aralin', 'Oras']];
    const rows = performanceData.map(p => [
        `${p.lastName}, ${p.firstName}`,
        p.paunangScore ? `${p.paunangScore.score}/${p.paunangScore.total} (${p.paunangScore.percentage.toFixed(1)}%)` : '-',
        p.pangwakasScore ? `${p.pangwakasScore.score}/${p.pangwakasScore.total} (${p.pangwakasScore.percentage.toFixed(1)}%)` : '-',
        p.improvement !== null ? `${p.improvement > 0 ? '+' : ''}${p.improvement.toFixed(1)}%` : '-',
        p.lessonsCompleted,
        fmtTime(p.totalTimeSpentSeconds)
    ]);

    doc.autoTable({
        head: headers,
        body: rows,
        startY: 32,
        styles: { fontSize: 8, font: 'helvetica' },
        headStyles: { fillColor: [212, 175, 55], textColor: [0, 0, 0], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    doc.save(`E-Linangan_Performance_${new Date().toISOString().slice(0, 10)}.pdf`);
    showToast('Na-download ang PDF.');
}

// ===== EXPORT EXCEL =====
function exportExcel() {
    if (!performanceData.length) return showToast('Walang datos na mai-export.', true);

    const rows = performanceData.map(p => ({
        'Pangalan': `${p.lastName}, ${p.firstName}`,
        'Paunang Score': p.paunangScore ? p.paunangScore.score : '-',
        'Paunang Total': p.paunangScore ? p.paunangScore.total : '-',
        'Paunang %': p.paunangScore ? p.paunangScore.percentage.toFixed(1) + '%' : '-',
        'Pangwakas Score': p.pangwakasScore ? p.pangwakasScore.score : '-',
        'Pangwakas Total': p.pangwakasScore ? p.pangwakasScore.total : '-',
        'Pangwakas %': p.pangwakasScore ? p.pangwakasScore.percentage.toFixed(1) + '%' : '-',
        'Improvement': p.improvement !== null ? p.improvement.toFixed(1) + '%' : '-',
        'Aralin Completed': p.lessonsCompleted,
        'Oras (seconds)': p.totalTimeSpentSeconds
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Performance');

    // Auto column widths
    const colWidths = Object.keys(rows[0]).map(key => ({ wch: Math.max(key.length + 2, 12) }));
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, `E-Linangan_Performance_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showToast('Na-download ang Excel file.');
}

// ===== PROFILE UPDATE =====
async function handleProfileUpdate(e) {
    e.preventDefault();

    const username = document.getElementById('profileUsername').value.trim();
    const currentPassword = document.getElementById('profileCurrentPw').value;
    const newPassword = document.getElementById('profileNewPw').value;

    const data = {};
    const user = AUTH.getUser();

    if (username && username !== user.username) data.username = username;
    if (newPassword) {
        if (!currentPassword) return showToast('Kailangan ang kasalukuyang password.', true);
        data.currentPassword = currentPassword;
        data.newPassword = newPassword;
    }

    if (Object.keys(data).length === 0) return showToast('Walang binago.', true);

    const r = await AUTH.apiCall('/api/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify(data)
    });

    if (r.error) return showToast(r.message, true);

    // Update stored token and user
    if (r.token) AUTH.setToken(r.token);
    if (r.user) AUTH.setUser(r.user);

    showToast(r.message);
    document.getElementById('profileCurrentPw').value = '';
    document.getElementById('profileNewPw').value = '';

    // Update sidebar name
    const updatedUser = AUTH.getUser();
    document.getElementById('teacherName').textContent = `${updatedUser.firstName} ${updatedUser.lastName}`;
}
