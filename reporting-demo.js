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
  overdue: "Melewati Batas Waktu",
};

const fmtDate = (value) => {
  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
};

const showPelaporanAlert = (message, type = "success") => {
  let backdrop = document.querySelector(".rp-alert-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.className = "rp-alert-backdrop";
    document.body.appendChild(backdrop);
  }

  const icon = type === "delete" ? "trash" : type === "warning" ? "warning" : "success";
  const title = type === "warning" ? "Perhatian" : type === "delete" ? "Konfirmasi Data" : "Berhasil";

  backdrop.innerHTML = `
    <div class="rp-alert-card" role="dialog" aria-modal="true" aria-label="${title}">
      <div class="rp-alert-icon ${icon}">${icon === "success" ? "✓" : icon === "warning" ? "!" : "⌫"}</div>
      <h3>${title}</h3>
      <p>${message}</p>
      <div class="rp-alert-actions">
        <button class="rp-alert-btn ${icon === "trash" ? "red" : "green"}" type="button" data-rp-alert-close>OK</button>
      </div>
    </div>
  `;

  backdrop.classList.add("open");
  backdrop.querySelector("[data-rp-alert-close]").addEventListener("click", () => backdrop.classList.remove("open"));
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) backdrop.classList.remove("open");
  }, { once: true });
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
          <span class="project-category">Aplikasi Pelaporan</span>
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

const findItem = (type, id) => {
  const source = type === "penugasan" ? rpState.penugasan : rpState.penetapan;
  return source.find((item) => item.id === id);
};

const detailBody = (item, type) => `
  <div class="rp-form-grid">
    <div class="rp-field"><label>Nomor ${type}</label><input value="${item.id}" readonly></div>
    <div class="rp-field"><label>Status</label><input value="${statusLabel[item.status]}" readonly></div>
    <div class="rp-field full"><label>Judul</label><input value="${item.title}" readonly></div>
    <div class="rp-field"><label>Unit Kerja</label><input value="${item.unit}" readonly></div>
    <div class="rp-field"><label>Tanggal</label><input value="${fmtDate(item.date)}" readonly></div>
    <div class="rp-field"><label>Pelapor</label><input value="${item.reporter}" readonly></div>
    <div class="rp-field full"><label>Catatan</label><textarea rows="4" readonly>Tampilan ini mengikuti alur aplikasi pelaporan untuk kebutuhan preview portfolio.</textarea></div>
  </div>
`;

const reportFormBody = (item, type) => `
  <div class="rp-form-grid">
    <div class="rp-field"><label>Nomor ${type}</label><input value="${item.id}" readonly></div>
    <div class="rp-field"><label>Tanggal Laporan</label><input value="26 Mei 2026" readonly></div>
    <div class="rp-field full"><label>Judul</label><input value="${item.title}" readonly></div>
    <div class="rp-field full"><label>Uraian Laporan</label><textarea rows="5">Kegiatan telah dilaksanakan sesuai surat tugas/penetapan. Ringkasan hasil kegiatan dicatat pada formulir ini.</textarea></div>
    <div class="rp-field"><label>Upload Dokumen</label><input value="dokumen-laporan.pdf" readonly></div>
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

const monitoringStView = () => {
  const days = Array.from({ length: 35 }, (_, index) => index + 1);
  const events = new Map(rpState.penugasan.map((item) => [Number(item.date.slice(-2)), item]));

  return `
    <section class="rp-page mst-wrap">
      <div class="mst-topbar mst-topbar-with-unit">
        <div class="mst-title-wrap">
          <div class="mst-title">Mei 2026</div>
          <div class="mst-subtitle">Kalender Monitoring ST - deadline laporan hari kerja</div>
        </div>
        <div class="mst-filter-row mst-filter-with-unit">
          <div class="mst-pill mst-pill-unit"><div class="mst-pill-inner"><select><option>Semua Unit Kerja</option><option>Biro Pemenuhan Hak Saksi</option></select><span class="mst-pill-icon">v</span></div></div>
          <div class="mst-pill"><div class="mst-pill-inner"><select><option>Mei</option></select><span class="mst-pill-icon">v</span></div></div>
          <div class="mst-pill"><div class="mst-pill-inner"><select><option>2026</option></select><span class="mst-pill-icon">v</span></div></div>
          <div class="mst-pill mst-pill-sm"><div class="mst-pill-inner"><select><option>Semua Deadline</option><option>Melewati Batas Waktu</option></select><span class="mst-pill-icon">v</span></div></div>
        </div>
      </div>
      <div class="mst-kpi-row">
        <div class="mst-kpi"><div class="mst-kpi-label">Total Kegiatan</div><div class="mst-kpi-value">3</div></div>
        <div class="mst-kpi"><div class="mst-kpi-label">Countdown Aktif</div><div class="mst-kpi-value">2</div></div>
        <div class="mst-kpi"><div class="mst-kpi-label">Aman</div><div class="mst-kpi-value" style="color:#15803d">1</div></div>
        <div class="mst-kpi"><div class="mst-kpi-label">Mendekati Batas Waktu<br>/Hari Ini</div><div class="mst-kpi-value" style="color:#b45309">1</div></div>
        <div class="mst-kpi"><div class="mst-kpi-label">Melewati Batas Waktu</div><div class="mst-kpi-value" style="color:#b91c1c">1</div></div>
      </div>
      <div class="mst-weekdays">
        <div class="mst-weekday">Senin</div><div class="mst-weekday">Selasa</div><div class="mst-weekday">Rabu</div><div class="mst-weekday">Kamis</div><div class="mst-weekday">Jumat</div><div class="mst-weekday">Sabtu</div><div class="mst-weekday">Minggu</div>
      </div>
      <div class="mst-calendar">
        ${[0, 1, 2, 3, 4].map((week) => `
          <div class="mst-week">
            ${days.slice(week * 7, week * 7 + 7).map((day, index) => {
              const item = events.get(day);
              const label = item?.status === "overdue" ? `${item.title} - Melewati Batas Waktu` : item?.title;
              return `<div class="mst-day ${(week + index) % 2 === 0 ? "mst-check-a" : "mst-check-b"} ${day === 26 ? "mst-today" : ""}">
                <div class="mst-day-num">${day <= 31 ? day : ""}</div>
                ${item ? `<div class="mst-bar ${item.status === "overdue" ? "mst-bar-overdue" : ""}" style="left:8px;right:8px;top:${36 + (index % 2) * 28}px;height:24px;background:${item.status === "done" ? "#16a34a" : "#dc2626"}" data-rp-detail="penugasan:${item.id}">
                  <div class="mst-bar-label-shell">
                    ${item.status === "overdue" ? `<div class="mst-bar-label-track"><span class="mst-bar-label-copy">${label}</span><span class="mst-bar-label-copy">${label}</span><span class="mst-bar-label-copy">${label}</span></div>` : `<span class="mst-bar-label">${label}</span>`}
                  </div>
                </div>` : ""}
              </div>`;
            }).join("")}
          </div>
        `).join("")}
      </div>
      <div class="mst-panel">
        <div class="mst-legend">
          <span class="mst-legend-item"><span class="mst-legend-dot" style="background:#dc2626"></span>Belum dilaporkan</span>
          <span class="mst-legend-item"><span class="mst-legend-dot" style="background:#16a34a"></span>Sudah dilaporkan</span>
          <span class="mst-legend-item"><span class="mst-legend-dot" style="background:#b91c1c"></span>Melewati Batas Waktu</span>
          <span class="mst-legend-item"><span class="mst-legend-dot" style="background:#d97706"></span>Mendekati Batas Waktu</span>
        </div>
        <div class="mst-legend-note">Countdown hanya aktif untuk status <span class="mst-note-belum">Belum dilaporkan</span>.</div>
      </div>
    </section>
  `;
};

const monitoringSkView = () => `
  <section class="rp-page msk-wrap">
    <div class="msk-header">
      <div class="msk-year-title">2026</div>
      <div class="msk-controls">
        <div class="msk-select-wrap"><select class="msk-select"><option>Unit Kerja Saya (Default)</option></select><div class="msk-select-btn">v</div></div>
        <div class="msk-select-wrap"><select class="msk-select"><option>2026</option></select><div class="msk-select-btn">v</div></div>
      </div>
    </div>
    <div class="msk-calendar">
      ${[["Januari","Februari","Maret","April"],["Mei","Juni","Juli","Agustus"],["September","Oktober","November","Desember"]].map((months, rowIndex) => `
        <div class="msk-row">
          ${months.map((month, index) => `<div class="msk-cell" style="background:${index % 2 === 0 ? "#F3F4F6" : "#FFFFFF"}"><div class="msk-cell-label">${month}</div></div>`).join("")}
          <div class="msk-row-overlay">
            ${rowIndex === 1 ? rpState.penetapan.map((item, index) => `
              <div class="msk-span-bar" style="left:${8 + index * 32}%;top:${54 + index * 34}px;width:30%;background:${item.status === "done" ? "#16a34a" : "#dc2626"}" data-rp-detail="penetapan:${item.id}">
                <span>${item.title}</span>
              </div>
            `).join("") : ""}
          </div>
        </div>
      `).join("")}
    </div>
  </section>
`;

const tableFilters = (isPenugasan) => `
  <div class="sp-toolbar">
    <button class="sp-btn sp-btn-blue" data-rp-toast="Form tambah ${isPenugasan ? "penugasan" : "penetapan"} siap digunakan."><span class="sp-plus">+</span><span>Tambah</span></button>
    <select class="sp-select is-empty"><option>Pilih bulan kegiatan</option><option>Mei</option></select>
    <select class="sp-select is-empty"><option>Pilih tahun kegiatan</option><option>2026</option></select>
    <div class="sp-search-wrap">
      <input class="sp-search-input" placeholder="Cari nomor/judul ${isPenugasan ? "surat tugas" : "penetapan"}...">
      <button class="sp-search-btn" data-rp-toast="Pencarian diterapkan.">Cari</button>
    </div>
  </div>
`;

const tableView = (type, archived = false) => {
  const isPenugasan = type === "penugasan";
  const items = isPenugasan ? rpState.penugasan : rpState.penetapan;
  const title = archived
    ? `Arsip ${isPenugasan ? "Penugasan" : "Penetapan"}`
    : `Daftar ${isPenugasan ? "Penugasan" : "Penetapan"}`;
  const code = isPenugasan ? "ST" : "SK";
  const rows = archived ? items.filter((item) => item.status === "done") : items;

  return `
    <section class="rp-page app-kegiatan-shell">
      <div class="sp-title">${title}</div>
      ${!archived ? tableFilters(isPenugasan) : `<div class="sp-toolbar"><div class="sp-search-wrap"><input class="sp-search-input" placeholder="Cari arsip laporan..."><button class="sp-search-btn" data-rp-toast="Pencarian arsip diterapkan.">Cari</button></div></div>`}
      <div class="sp-card">
        <div class="sp-table-scroll">
          <table class="sp-table">
            <thead>
              <tr class="sp-th">
                <th>No.</th><th>Nomor ${code}</th><th>${isPenugasan ? "Judul Kegiatan" : "Judul Penetapan"}</th><th>Tanggal<br>Pelaksanaan</th><th>Pengaju</th><th>Status<br>Pelaporan</th><th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map((item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.id}</td>
                  <td>${item.title}</td>
                  <td><span class="sp-date-stack"><span class="sp-date-line">${fmtDate(item.date)}</span></span></td>
                  <td>${item.reporter}</td>
                  <td><span class="sp-pill ${item.status === "done" ? "sp-setuju" : "sp-belum"}">${statusLabel[item.status]}</span></td>
                  <td>
                    <div class="sp-act">
                      <button class="sp-act-btn sp-act-eye" data-rp-detail="${type}:${item.id}" title="Detail">Lihat</button>
                      <button class="sp-act-btn sp-act-report" data-rp-report="${type}:${item.id}" title="Input Laporan">Lap</button>
                      <button class="sp-act-btn sp-act-edit" data-rp-toast="Mode edit ${item.id} dibuka.">Edit</button>
                      <button class="sp-act-btn sp-act-del" data-rp-delete="${item.id}">Del</button>
                    </div>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
        <div class="sp-pager"><button class="sp-pager-btn" disabled>Sebelumnya</button><button class="sp-pager-num active">1</button><button class="sp-pager-btn" disabled>Selanjutnya</button></div>
      </div>
    </section>
  `;
};

const adminView = () => `
  <section class="rp-page app-kegiatan-shell">
    <div class="sp-title">Tampilan Admin</div>
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
    "monitoring-st": monitoringStView,
    penugasan: () => tableView("penugasan"),
    "arsip-penugasan": () => tableView("penugasan", true),
    "monitoring-sk": monitoringSkView,
    penetapan: () => tableView("penetapan"),
    "arsip-penetapan": () => tableView("penetapan", true),
    admin: adminView,
  };

  reportingContent.innerHTML = (views[rpState.view] || views.home)();
  reportingContent.focus({ preventScroll: true });
};

if (reportingApp && reportingContent) {
  reportingApp.addEventListener("click", (event) => {
    const nav = event.target.closest("[data-view]");
    const detail = event.target.closest("[data-rp-detail]");
    const report = event.target.closest("[data-rp-report]");
    const toastButton = event.target.closest("[data-rp-toast]");
    const deleteButton = event.target.closest("[data-rp-delete]");

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
          `<button class="rp-btn green" type="button" data-rp-close data-rp-save>Simpan</button>`
        );
        document.querySelector("[data-rp-save]")?.addEventListener("click", () => {
          showPelaporanAlert("Laporan berhasil disimpan pada sesi preview.", "success");
        });
      }
      return;
    }

    if (deleteButton) {
      showPelaporanAlert(`Data ${deleteButton.dataset.rpDelete} tidak dihapus permanen pada mode preview.`, "delete");
      return;
    }

    if (toastButton) {
      showPelaporanAlert(toastButton.dataset.rpToast, "success");
    }
  });

  render();
}
