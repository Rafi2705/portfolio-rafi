const reportingApp = document.querySelector("#reportingDemoApp");
const reportingContent = document.querySelector("#reportingDemoContent");

const rpState = {
  view: "home",
  penugasan: [
    {
      id: "ST-001",
      title: "Pendampingan Saksi Sidang Tindak Pidana",
      unit: "Biro Pemenuhan Hak Saksi",
      date: "2026-05-06",
      deadline: "2026-05-10",
      status: "done",
      reporter: "rafi",
      location: "Jakarta",
    },
    {
      id: "ST-002",
      title: "Verifikasi Perlindungan Korban",
      unit: "Biro Penelaahan Permohonan",
      date: "2026-05-16",
      deadline: "2026-05-28",
      status: "pending",
      reporter: "rafi",
      location: "Bogor",
    },
    {
      id: "ST-003",
      title: "Koordinasi Layanan Darurat",
      unit: "Biro Keamanan dan Pengawalan",
      date: "2026-05-03",
      deadline: "2026-05-08",
      status: "overdue",
      reporter: "rafi",
      location: "Depok",
    },
  ],
  penetapan: [
    {
      id: "SK-001",
      title: "Penetapan Tim Verifikasi Permohonan",
      unit: "Biro Hukum",
      date: "2026-05-09",
      status: "done",
      reporter: "rafi",
    },
    {
      id: "SK-002",
      title: "Penetapan Tim Monitoring Layanan",
      unit: "Biro Umum",
      date: "2026-05-22",
      status: "pending",
      reporter: "rafi",
    },
  ],
};

const statusLabel = {
  done: "Sudah Dilaporkan",
  pending: "Belum Dilaporkan",
  overdue: "Lewat Batas Waktu",
  gray: "Draft",
};

const fmtDate = (value) => {
  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
};

const badge = (status) => `<span class="rp-badge ${status}">${statusLabel[status]}</span>`;

const toast = (message) => {
  let el = document.querySelector(".rp-toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "rp-toast";
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(window.__rpToastTimer);
  window.__rpToastTimer = setTimeout(() => el.classList.remove("show"), 2600);
};

const openModal = (title, body, actions = "") => {
  let backdrop = document.querySelector(".rp-modal-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.className = "rp-modal-backdrop";
    document.body.appendChild(backdrop);
  }

  backdrop.innerHTML = `
    <div class="rp-modal" role="dialog" aria-modal="true" aria-label="${title}">
      <div class="rp-modal-head">
        <div>
          <span class="project-category">Demo Pelaporan</span>
          <h3>${title}</h3>
        </div>
        <button class="rp-modal-close" type="button" data-rp-close>×</button>
      </div>
      ${body}
      <div class="rp-actions" style="margin-top:18px; justify-content:flex-end;">
        ${actions}
        <button class="rp-btn gray" type="button" data-rp-close>Tutup</button>
      </div>
    </div>
  `;

  backdrop.classList.add("open");
  backdrop.querySelectorAll("[data-rp-close]").forEach((button) => {
    button.addEventListener("click", () => backdrop.classList.remove("open"));
  });
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) backdrop.classList.remove("open");
  }, { once: true });
};

const detailBody = (item, type) => `
  <div class="rp-form-grid">
    <div class="rp-field"><label>Nomor ${type}</label><input value="${item.id}" readonly></div>
    <div class="rp-field"><label>Status</label><input value="${statusLabel[item.status]}" readonly></div>
    <div class="rp-field full"><label>Judul</label><input value="${item.title}" readonly></div>
    <div class="rp-field"><label>Unit Kerja</label><input value="${item.unit}" readonly></div>
    <div class="rp-field"><label>Tanggal</label><input value="${fmtDate(item.date)}" readonly></div>
    <div class="rp-field"><label>Pelapor</label><input value="${item.reporter}" readonly></div>
    <div class="rp-field"><label>Lokasi</label><input value="${item.location || "Jakarta"}" readonly></div>
    <div class="rp-field full"><label>Catatan Demo</label><textarea rows="4" readonly>Ini adalah data dummy untuk portfolio. Tombol dan modal aktif untuk memperlihatkan alur aplikasi, tetapi tidak menyimpan data permanen.</textarea></div>
  </div>
`;

const reportFormBody = (item, type) => `
  <div class="rp-form-grid">
    <div class="rp-field"><label>Nomor ${type}</label><input value="${item.id}" readonly></div>
    <div class="rp-field"><label>Tanggal Laporan</label><input value="26 Mei 2026" readonly></div>
    <div class="rp-field full"><label>Judul Kegiatan</label><input value="${item.title}" readonly></div>
    <div class="rp-field full"><label>Uraian Laporan</label><textarea rows="5">Kegiatan telah dilaksanakan sesuai surat tugas/penetapan. Dokumentasi dan ringkasan hasil kegiatan dicatat pada demo ini.</textarea></div>
    <div class="rp-field"><label>Upload Dokumen</label><input value="dokumen-demo.pdf" readonly></div>
    <div class="rp-field"><label>Status Submit</label><select><option>Sudah Dilaporkan</option><option>Draft</option></select></div>
  </div>
`;

const homeView = () => `
  <section class="rp-page rp-welcome">
    <div class="rp-welcome-card">
      <h3>Selamat Datang di Aplikasi Pelaporan,<br><u>RAFI</u>!</h3>
    </div>
  </section>
`;

const statCards = () => {
  const done = rpState.penugasan.filter((item) => item.status === "done").length;
  const pending = rpState.penugasan.filter((item) => item.status === "pending").length;
  const overdue = rpState.penugasan.filter((item) => item.status === "overdue").length;
  return `
    <div class="rp-card-grid">
      <article class="rp-stat"><span>Total ST</span><strong>${rpState.penugasan.length}</strong></article>
      <article class="rp-stat"><span>Sudah Dilaporkan</span><strong>${done}</strong></article>
      <article class="rp-stat"><span>Belum Dilaporkan</span><strong>${pending}</strong></article>
      <article class="rp-stat"><span>Lewat Batas</span><strong>${overdue}</strong></article>
    </div>
  `;
};

const monitoringView = (kind) => {
  const isSt = kind === "st";
  const items = isSt ? rpState.penugasan : rpState.penetapan;
  const title = isSt ? "Monitoring ST" : "Monitoring SK";
  const subtitle = isSt ? "Kalender Monitoring ST - deadline laporan hari kerja" : "Kalender Monitoring SK - pemantauan laporan penetapan";

  const days = Array.from({ length: 35 }, (_, index) => index + 1);
  const events = new Map(items.map((item) => [Number(item.date.slice(-2)), item]));

  return `
    <section class="rp-page">
      <div class="rp-page-head">
        <div>
          <h3>${title}</h3>
          <p>${subtitle}</p>
        </div>
        <div class="rp-actions">
          <button class="rp-btn orange" data-rp-toast="Filter bulan Mei 2026 aktif.">Mei 2026</button>
          <button class="rp-btn" data-rp-toast="Data monitoring dummy berhasil dimuat.">Refresh</button>
        </div>
      </div>
      ${isSt ? statCards() : ""}
      <div class="rp-calendar-wrap">
        <div class="rp-calendar">
          <div class="rp-calendar-head">
            <div>Sen</div><div>Sel</div><div>Rab</div><div>Kam</div><div>Jum</div><div>Sab</div><div>Ming</div>
          </div>
          <div class="rp-calendar-grid">
            ${days.map((day) => {
              const item = events.get(day);
              return `
                <div class="rp-day">
                  <span class="rp-date">${day <= 31 ? day : ""}</span>
                  ${item ? `<div class="rp-event ${item.status}" data-rp-detail="${isSt ? "penugasan" : "penetapan"}:${item.id}">
                    ${item.status === "overdue" ? `<span class="rp-running"><span>${item.title} - belum dilaporkan lewat batas waktu</span></span>` : item.title}
                  </div>` : ""}
                </div>
              `;
            }).join("")}
          </div>
        </div>
      </div>
    </section>
  `;
};

const tableView = (type, archived = false) => {
  const isPenugasan = type === "penugasan";
  const items = isPenugasan ? rpState.penugasan : rpState.penetapan;
  const title = archived
    ? `Arsip ${isPenugasan ? "Penugasan" : "Penetapan"}`
    : `Daftar ${isPenugasan ? "Penugasan" : "Penetapan"}`;
  const code = isPenugasan ? "ST" : "SK";
  const rows = (archived ? items.filter((item) => item.status === "done") : items);

  return `
    <section class="rp-page">
      <div class="rp-page-head">
        <div>
          <h3>${title}</h3>
          <p>${archived ? "Data laporan yang sudah masuk arsip." : "Data dummy aktif untuk preview flow aplikasi."}</p>
        </div>
        <div class="rp-actions">
          <button class="rp-btn" data-rp-toast="Form tambah ${isPenugasan ? "penugasan" : "penetapan"} dibuka sebagai demo.">+ Tambah ${code}</button>
          <button class="rp-btn orange" data-rp-toast="Filter dan pencarian aktif sebagai demo.">Cari / Filter</button>
        </div>
      </div>
      <div class="rp-table-wrap">
        <table class="rp-table">
          <thead>
            <tr>
              <th>No</th><th>Nomor ${code}</th><th>Judul</th><th>Unit Kerja</th><th>Tanggal</th><th>Status</th><th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map((item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td><strong>${item.id}</strong></td>
                <td>${item.title}</td>
                <td>${item.unit}</td>
                <td>${fmtDate(item.date)}</td>
                <td>${badge(item.status)}</td>
                <td>
                  <div class="rp-row-actions">
                    <button class="rp-icon-btn" data-rp-detail="${type}:${item.id}" title="Detail">👁</button>
                    <button class="rp-icon-btn report" data-rp-report="${type}:${item.id}" title="Input laporan">✓</button>
                    <button class="rp-icon-btn edit" data-rp-toast="Mode edit demo untuk ${item.id} aktif.">✎</button>
                    <button class="rp-icon-btn delete" data-rp-toast="Data dummy tidak dihapus permanen.">×</button>
                  </div>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
};

const adminView = () => `
  <section class="rp-page">
    <div class="rp-page-head">
      <div>
        <h3>Tampilan Admin</h3>
        <p>Semua menu terbuka untuk akun demo <strong>rafi</strong>.</p>
      </div>
      <div class="rp-actions">
        <button class="rp-btn" data-rp-toast="Pengaturan role demo dibuka.">Kelola Role</button>
        <button class="rp-btn orange" data-rp-toast="Pengaturan pengguna demo dibuka.">Kelola Pengguna</button>
      </div>
    </div>
    <div class="rp-admin-panel">
      <div class="rp-admin-grid">
        <article class="rp-admin-card">
          <h4>Akun Demo</h4>
          <p><strong>Nama:</strong> rafi</p>
          <p><strong>Role:</strong> Admin, User, Atasan</p>
          <p><strong>Status:</strong> Semua menu terbuka</p>
        </article>
        <article class="rp-admin-card">
          <h4>Hak Akses</h4>
          <div class="rp-permission-list">
            <span>monitoring.penugasan</span><span>laporan.penugasan.create</span><span>penugasan.arsip</span>
            <span>monitoring.penetapan</span><span>laporan.penetapan.create</span><span>penetapan.arsip</span>
            <span>admin.users</span><span>admin.roles</span>
          </div>
        </article>
      </div>
    </div>
  </section>
`;

const render = () => {
  const views = {
    home: homeView,
    "monitoring-st": () => monitoringView("st"),
    penugasan: () => tableView("penugasan"),
    "arsip-penugasan": () => tableView("penugasan", true),
    "monitoring-sk": () => monitoringView("sk"),
    penetapan: () => tableView("penetapan"),
    "arsip-penetapan": () => tableView("penetapan", true),
    admin: adminView,
  };

  reportingContent.innerHTML = (views[rpState.view] || views.home)();
  reportingContent.focus({ preventScroll: true });
};

const findItem = (type, id) => {
  const source = type === "penugasan" ? rpState.penugasan : rpState.penetapan;
  return source.find((item) => item.id === id);
};

if (reportingApp && reportingContent) {
  reportingApp.addEventListener("click", (event) => {
    const nav = event.target.closest("[data-view]");
    const detail = event.target.closest("[data-rp-detail]");
    const report = event.target.closest("[data-rp-report]");
    const toastButton = event.target.closest("[data-rp-toast]");

    if (nav) {
      rpState.view = nav.dataset.view;
      reportingApp.querySelectorAll(".rp-nav").forEach((button) => {
        button.classList.toggle("active", button === nav);
      });
      render();
      return;
    }

    if (detail) {
      const [type, id] = detail.dataset.rpDetail.split(":");
      const item = findItem(type, id);
      if (item) openModal(`Detail ${type === "penugasan" ? "Penugasan" : "Penetapan"}`, detailBody(item, type === "penugasan" ? "ST" : "SK"));
      return;
    }

    if (report) {
      const [type, id] = report.dataset.rpReport.split(":");
      const item = findItem(type, id);
      if (item) {
        openModal(
          `Input Laporan ${type === "penugasan" ? "Penugasan" : "Penetapan"}`,
          reportFormBody(item, type === "penugasan" ? "ST" : "SK"),
          `<button class="rp-btn green" type="button" data-rp-close data-rp-toast-save>Simpan Demo</button>`
        );
        document.querySelector("[data-rp-toast-save]")?.addEventListener("click", () => {
          toast("Laporan demo dicatat sementara. Tidak ada data permanen yang disimpan.");
        });
      }
      return;
    }

    if (toastButton) {
      toast(toastButton.dataset.rpToast);
    }
  });

  render();
}
