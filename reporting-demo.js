const reportingApp = document.querySelector("#reportingDemoApp");
const reportingContent = document.querySelector("#reportingDemoContent");

const rpState = {
  view: "home",
  lastList: "penugasan",
  monitoringMonth: 5,
  openGroups: new Set(["kegiatan", "tim", "admin"]),
  penugasan: [
    {
      id: "ST-001",
      title: "Pendampingan Saksi Sidang Tindak Pidana",
      unit: "Biro Pemenuhan Hak Saksi",
      date: "2026-05-01",
      endDate: "2026-05-05",
      deadline: "2026-05-07",
      status: "done",
      reporter: "rafi",
      location: "Jakarta",
      tone: "done",
      lane: 0,
    },
    {
      id: "ST-002",
      title: "Verifikasi Perlindungan Korban",
      unit: "Biro Penelaahan Permohonan",
      date: "2026-05-08",
      endDate: "2026-05-12",
      deadline: "2026-05-15",
      status: "pending",
      reporter: "rafi",
      location: "Bogor",
      tone: "pending",
      lane: 0,
    },
    {
      id: "ST-003",
      title: "Koordinasi Layanan Darurat",
      unit: "Biro Keamanan dan Pengawalan",
      date: "2026-05-15",
      endDate: "2026-05-19",
      deadline: "2026-05-18",
      status: "overdue",
      reporter: "rafi",
      location: "Depok",
      tone: "overdue",
      lane: 0,
    },
    {
      id: "ST-004",
      title: "Monitoring Layanan Perlindungan Terpadu",
      unit: "Biro Perencanaan dan TI",
      date: "2026-05-22",
      endDate: "2026-05-26",
      deadline: "2026-05-29",
      status: "pending",
      reporter: "rafi",
      location: "Bekasi",
      tone: "pending",
      lane: 0,
    },
    {
      id: "ST-005",
      title: "Koordinasi Perlindungan Saksi Wilayah Barat",
      unit: "Biro Pemenuhan Hak Saksi",
      date: "2026-06-01",
      endDate: "2026-06-05",
      deadline: "2026-06-09",
      status: "done",
      reporter: "rafi",
      location: "Jakarta",
      tone: "done",
      lane: 0,
    },
    {
      id: "ST-006",
      title: "Verifikasi Lapangan Permohonan Perlindungan",
      unit: "Biro Penelaahan Permohonan",
      date: "2026-06-08",
      endDate: "2026-06-12",
      deadline: "2026-06-17",
      status: "pending",
      reporter: "rafi",
      location: "Tangerang",
      tone: "pending",
      lane: 0,
    },
    {
      id: "ST-007",
      title: "Pendampingan Layanan Perlindungan Darurat",
      unit: "Biro Keamanan dan Pengawalan",
      date: "2026-06-15",
      endDate: "2026-06-19",
      deadline: "2026-06-18",
      status: "overdue",
      reporter: "rafi",
      location: "Bekasi",
      tone: "overdue",
      lane: 0,
    },
  ],
  penetapan: [
    {
      id: "SK-001",
      title: "Penetapan Tim Verifikasi Permohonan",
      unit: "Biro Hukum",
      date: "2026-05-09",
      endDate: "2026-05-13",
      deadline: "2026-05-15",
      status: "done",
      reporter: "rafi",
      location: "Jakarta",
    },
    {
      id: "SK-002",
      title: "Penetapan Tim Monitoring Layanan",
      unit: "Biro Umum",
      date: "2026-05-22",
      endDate: "2026-05-26",
      deadline: "2026-05-29",
      status: "pending",
      reporter: "rafi",
      location: "Bogor",
    },
  ],
};

const statusLabel = {
  done: "Sudah Dilaporkan",
  pending: "Belum Dilaporkan",
  overdue: "Melewati Batas Waktu",
};

const deadlineLabel = {
  done: "Sudah Dilaporkan",
  pending: "Masih Batas Waktu",
  overdue: "Lewat Batas Waktu",
};

const fmtDate = (value) => {
  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
};

const dayNumber = (value) => Number(value.slice(-2));

const monthNumber = (value) => Number(value.slice(5, 7));

const monthNames = {
  5: "Mei",
  6: "Juni",
};

const monthDays = {
  5: 31,
  6: 30,
};

const rangeDate = (item) => `${fmtDate(item.date)} - ${fmtDate(item.endDate || item.date)}`;

const findItem = (type, id) => {
  const source = type === "penugasan" ? rpState.penugasan : rpState.penetapan;
  return source.find((item) => item.id === id);
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
  const iconHtml = {
    success: '<i class="fa-solid fa-check"></i>',
    warning: '<i class="fa-solid fa-exclamation"></i>',
    trash: '<i class="fa-solid fa-trash-can"></i>',
  }[icon];

  backdrop.innerHTML = `
    <div class="rp-alert-card" role="dialog" aria-modal="true" aria-label="${title}">
      <div class="rp-alert-icon ${icon}">${iconHtml}</div>
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

const homeView = () => `
  <section class="rp-page rp-welcome">
    <div class="rp-home-hero">
      <div class="rp-home-copy">
        <div class="rp-home-kicker">
          <span class="rp-live-dot"></span>
          Dashboard Pelaporan Internal LPSK
        </div>
        <h3>Selamat Datang, <span>Rafi</span></h3>
        <p>
          Demo ini menampilkan alur pelaporan berbasis web untuk monitoring surat tugas, penetapan tim,
          arsip laporan, dan pengelolaan admin dalam satu tampilan interaktif.
        </p>
        <div class="rp-home-actions">
          <button type="button" data-view="monitoring-st">
            <i class="fa-solid fa-calendar-days"></i>
            Monitoring ST
          </button>
          <button type="button" data-view="penugasan">
            <i class="fa-solid fa-file-circle-plus"></i>
            Submit Penugasan
          </button>
        </div>
      </div>

      <div class="rp-home-orbit" aria-hidden="true">
        <span class="rp-orbit-ring ring-a"></span>
        <span class="rp-orbit-ring ring-b"></span>
        <div class="rp-home-logo">
          <img src="assets/icons/logo-lpsk-ui.png" alt="">
        </div>
        <div class="rp-home-status status-green">
          <span>2</span>
          Sudah Dilaporkan
        </div>
        <div class="rp-home-status status-red">
          <span>5</span>
          Belum Dilaporkan
        </div>
      </div>
    </div>

    <div class="rp-home-metrics">
      <article>
        <span>Total ST</span>
        <strong>7</strong>
        <small>Data dummy aktif</small>
      </article>
      <article>
        <span>Monitoring</span>
        <strong>Mei & Juni 2026</strong>
        <small>Kalender laporan</small>
      </article>
      <article>
        <span>Akses</span>
        <strong>Admin</strong>
        <small>Semua menu terbuka</small>
      </article>
    </div>
  </section>
`;

const monitoringStView = () => {
  const selectedMonth = rpState.monitoringMonth;
  const monthLabel = monthNames[selectedMonth] || "Mei";
  const monthTotalDays = monthDays[selectedMonth] || 31;
  const monthItems = rpState.penugasan.filter((item) => monthNumber(item.date) === selectedMonth);
  const totalDone = monthItems.filter((item) => item.status === "done").length;
  const totalPending = monthItems.filter((item) => item.status === "pending").length;
  const totalOverdue = monthItems.filter((item) => item.status === "overdue").length;
  const days = Array.from({ length: 35 }, (_, index) => index + 1);
  const barsByWeek = [0, 1, 2, 3, 4].map((weekIndex) => {
    const weekStart = weekIndex * 7 + 1;
    const weekEnd = weekStart + 6;

    return monthItems.flatMap((item) => {
      const start = dayNumber(item.date);
      const end = dayNumber(item.endDate || item.date);
      const segStart = Math.max(start, weekStart);
      const segEnd = Math.min(end, weekEnd);
      if (segStart > segEnd) return [];

      const left = ((segStart - weekStart) / 7) * 100;
      const width = ((segEnd - segStart + 1) / 7) * 100;
      return [{
        ...item,
        key: `${item.id}-${weekIndex}`,
        left,
        width,
        top: 34 + (item.lane || 0) * 26,
      }];
    });
  });

  return `
    <section class="rp-page mst-wrap">
      <div class="mst-topbar mst-topbar-with-unit">
        <div class="mst-title-wrap">
          <div class="mst-title">${monthLabel} 2026</div>
          <div class="mst-subtitle">Kalender Monitoring ST - deadline laporan hari kerja</div>
        </div>
        <div class="mst-filter-row mst-filter-with-unit">
          <div class="mst-pill mst-pill-unit"><div class="mst-pill-inner"><select><option>Semua Unit Kerja</option><option>Biro Pemenuhan Hak Saksi</option></select><span class="mst-pill-icon"><i class="fa-solid fa-chevron-down"></i></span></div></div>
          <div class="mst-pill"><div class="mst-pill-inner"><select data-rp-monitor-month><option value="5" ${selectedMonth === 5 ? "selected" : ""}>Mei</option><option value="6" ${selectedMonth === 6 ? "selected" : ""}>Juni</option></select><span class="mst-pill-icon"><i class="fa-solid fa-chevron-down"></i></span></div></div>
          <div class="mst-pill"><div class="mst-pill-inner"><select><option>2026</option></select><span class="mst-pill-icon"><i class="fa-solid fa-chevron-down"></i></span></div></div>
          <div class="mst-pill mst-pill-sm"><div class="mst-pill-inner"><select><option>Semua Deadline</option><option>Countdown Aktif</option><option>Melewati Batas Waktu</option></select><span class="mst-pill-icon"><i class="fa-solid fa-chevron-down"></i></span></div></div>
        </div>
      </div>
      <div class="mst-kpi-row">
        <div class="mst-kpi"><div class="mst-kpi-label">Total Kegiatan</div><div class="mst-kpi-value">${monthItems.length}</div></div>
        <div class="mst-kpi"><div class="mst-kpi-label">Countdown Aktif</div><div class="mst-kpi-value">${totalPending + totalOverdue}</div></div>
        <div class="mst-kpi"><div class="mst-kpi-label">Sudah Dilaporkan</div><div class="mst-kpi-value" style="color:#15803d">${totalDone}</div></div>
        <div class="mst-kpi"><div class="mst-kpi-label">Belum Dilaporkan<br>Masih Batas Waktu</div><div class="mst-kpi-value" style="color:#dc2626">${totalPending}</div></div>
        <div class="mst-kpi"><div class="mst-kpi-label">Melewati Batas Waktu</div><div class="mst-kpi-value" style="color:#b91c1c">${totalOverdue}</div></div>
      </div>
      <div class="mst-weekdays">
        <div class="mst-weekday">Senin</div><div class="mst-weekday">Selasa</div><div class="mst-weekday">Rabu</div><div class="mst-weekday">Kamis</div><div class="mst-weekday">Jumat</div><div class="mst-weekday">Sabtu</div><div class="mst-weekday">Minggu</div>
      </div>
      <div class="mst-calendar">
        ${[0, 1, 2, 3, 4].map((week) => `
          <div class="mst-week">
            ${days.slice(week * 7, week * 7 + 7).map((day, index) => `
              <div class="mst-day ${(week + index) % 2 === 0 ? "mst-check-a" : "mst-check-b"} ${day === 27 ? "mst-today" : ""}">
                <div class="mst-day-num">${day <= monthTotalDays ? day : ""}</div>
              </div>
            `).join("")}
            <div class="mst-bars">
              ${barsByWeek[week].map((item) => {
                const color = item.status === "done" ? "#16a34a" : "#dc2626";
                const running = item.status === "overdue";
                const label = `${item.id} - ${item.title}`;
                return `
                  <button class="mst-bar ${item.status === "overdue" ? "mst-bar-overdue" : ""}"
                    style="left:${item.left + 0.45}%; width:calc(${item.width}% - 8px); top:${item.top}px; height:24px; background:${color}; --mst-marquee-duration:9s;"
                    data-rp-detail="penugasan:${item.id}"
                    data-rp-return="monitoring-st"
                    data-mst-tip="${item.id}"
                    aria-label="${label}">
                    <span class="mst-bar-label-shell">
                      ${running ? `<span class="mst-bar-label-track"><span class="mst-bar-label-copy">${label}</span><span class="mst-bar-label-copy" aria-hidden="true">${label}</span><span class="mst-bar-label-copy" aria-hidden="true">${label}</span></span>` : `<span class="mst-bar-label">${label}</span>`}
                    </span>
                    <span class="mst-inline-badge">${deadlineLabel[item.tone] || "Status Laporan"}</span>
                  </button>
                `;
              }).join("")}
            </div>
          </div>
        `).join("")}
      </div>
      <div class="mst-panel">
        <div class="mst-legend">
          <span class="mst-legend-item"><span class="mst-legend-dot" style="background:#dc2626"></span>Belum dilaporkan</span>
          <span class="mst-legend-item"><span class="mst-legend-dot" style="background:#16a34a"></span>Sudah dilaporkan</span>
          <span class="mst-legend-item"><span class="mst-legend-dot" style="background:#b91c1c"></span>Melewati Batas Waktu</span>
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
        <div class="msk-select-wrap"><select class="msk-select"><option>Unit Kerja Saya (Default)</option></select><div class="msk-select-btn"><i class="fa-solid fa-chevron-down"></i></div></div>
        <div class="msk-select-wrap"><select class="msk-select"><option>2026</option></select><div class="msk-select-btn"><i class="fa-solid fa-chevron-down"></i></div></div>
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

const tableFilters = (isPenugasan) => {
  const type = isPenugasan ? "penugasan" : "penetapan";
  return `
    <div class="sp-toolbar">
      <button class="sp-btn sp-btn-blue" data-rp-form="${type}:create"><i class="fa-solid fa-plus"></i><span>Tambah</span></button>
      <select class="sp-select is-empty"><option>Pilih bulan kegiatan</option><option>Mei</option><option>Juni</option></select>
      <select class="sp-select is-empty"><option>Pilih tahun kegiatan</option><option>2026</option></select>
      <div class="sp-search-wrap">
        <input class="sp-search-input" placeholder="Cari nomor/judul ${isPenugasan ? "surat tugas" : "penetapan"}...">
        <button class="sp-search-btn" data-rp-toast="Pencarian diterapkan." aria-label="Cari"><i class="fa-solid fa-magnifying-glass"></i></button>
      </div>
    </div>
  `;
};

const tableView = (type, archived = false) => {
  const isPenugasan = type === "penugasan";
  const items = isPenugasan ? rpState.penugasan : rpState.penetapan;
  const title = archived
    ? `Arsip Laporan ${isPenugasan ? "Penugasan" : "Penetapan"}`
    : `Daftar ${isPenugasan ? "Penugasan" : "Penetapan"}`;
  const code = isPenugasan ? "ST" : "SK";
  const rows = archived ? items.filter((item) => item.status === "done") : items;

  return `
    <section class="rp-page app-kegiatan-shell">
      <div class="sp-title">${title}</div>
      ${!archived ? tableFilters(isPenugasan) : `<div class="sp-toolbar"><div class="sp-search-wrap"><input class="sp-search-input" placeholder="Cari arsip laporan..."><button class="sp-search-btn" data-rp-toast="Pencarian arsip diterapkan." aria-label="Cari"><i class="fa-solid fa-magnifying-glass"></i></button></div></div>`}
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
                  <td><span class="sp-date-stack"><span class="sp-date-line">${rangeDate(item)}</span></span></td>
                  <td>${item.reporter}</td>
                  <td><span class="sp-pill ${item.status === "done" ? "sp-setuju" : "sp-belum"}">${statusLabel[item.status]}</span></td>
                  <td>
                    <div class="sp-act">
                      <button class="sp-act-btn sp-act-eye" data-rp-form="${type}:detail:${item.id}" title="Detail"><i class="fa-solid fa-circle-info"></i></button>
                      <button class="sp-act-btn sp-act-report" data-rp-form="${type}:report:${item.id}" title="Input Laporan"><i class="fa-solid fa-file-circle-plus"></i></button>
                      <button class="sp-act-btn sp-act-edit" data-rp-form="${type}:edit:${item.id}" title="Edit"><i class="fa-regular fa-pen-to-square"></i></button>
                      <button class="sp-act-btn sp-act-del" data-rp-delete="${item.id}" title="Hapus"><i class="fa-solid fa-trash-can"></i></button>
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

const formField = (label, value = "", type = "text", readonly = false) => `
  <label class="rp-form-field">
    <span>${label}</span>
    <input type="${type}" value="${value}" ${readonly ? "readonly" : ""}>
  </label>
`;

const formTextarea = (label, value = "", readonly = false) => `
  <label class="rp-form-field full">
    <span>${label}</span>
    <textarea rows="4" ${readonly ? "readonly" : ""}>${value}</textarea>
  </label>
`;

const workflowFormView = (type, mode, id = "", returnView = "") => {
  const isPenugasan = type === "penugasan";
  const code = isPenugasan ? "ST" : "SK";
  const source = isPenugasan ? rpState.penugasan : rpState.penetapan;
  const fallback = {
    id: `${code}-BARU`,
    title: isPenugasan ? "Kegiatan baru LPSK" : "Penetapan tim baru",
    unit: "Biro Perencanaan dan Teknologi Informasi",
    date: "2026-05-27",
    endDate: "2026-05-30",
    deadline: "2026-06-03",
    status: "pending",
    reporter: "rafi",
    location: "Jakarta",
  };
  const item = findItem(type, id) || fallback;
  const readonly = mode === "detail";
  const modeLabel = {
    create: `Tambah ${isPenugasan ? "Penugasan" : "Penetapan"}`,
    detail: `Detail ${isPenugasan ? "Penugasan" : "Penetapan"}`,
    edit: `Edit ${isPenugasan ? "Penugasan" : "Penetapan"}`,
    report: `Input Laporan ${isPenugasan ? "Penugasan" : "Penetapan"}`,
  }[mode];
  const listView = returnView || (isPenugasan ? "penugasan" : "penetapan");
  const backLabel = mode === "detail" ? "Kembali" : "Batal";
  const finalButton = mode === "detail" ? "" : `<button class="rp-btn green" type="button" data-rp-demo-save="${modeLabel}">Simpan</button>`;

  return `
    <section class="rp-page rp-workflow-page">
      <div class="rp-workflow-card">
        <div class="rp-workflow-head">
          <div>
            <button class="rp-back-link" type="button" data-view="${listView}"><i class="fa-solid fa-arrow-left"></i> Kembali</button>
            <h3>${modeLabel}</h3>
          </div>
          <span class="rp-workflow-badge">${code}</span>
        </div>
        <div class="rp-form-grid native">
          ${formField(`Nomor ${code}`, item.id, "text", mode !== "create")}
          ${formField("Pengaju", item.reporter, "text", readonly)}
          ${formField(isPenugasan ? "Judul Kegiatan" : "Judul Penetapan", item.title, "text", readonly)}
          ${formField("Unit Kerja", item.unit, "text", readonly)}
          ${formField("Tanggal Mulai", item.date, "date", readonly)}
          ${formField("Tanggal Selesai", item.endDate || item.date, "date", readonly)}
          ${formField("Deadline Laporan", item.deadline, "date", readonly)}
          ${formField("Lokasi", item.location || "Jakarta", "text", readonly)}
          ${mode === "report"
            ? `${formTextarea("Uraian Laporan", "Kegiatan telah dilaksanakan sesuai arahan dan dokumen pendukung dilampirkan.", false)}
               ${formField("Upload Dokumen", "laporan-demo.pdf", "text", true)}`
            : formTextarea("Catatan", "Halaman ini dibuat statis mengikuti alur aplikasi pelaporan asli untuk kebutuhan portfolio.", readonly)}
        </div>
        <div class="rp-workflow-actions">
          <button class="rp-btn gray" type="button" data-view="${listView}">${backLabel}</button>
          ${finalButton}
        </div>
      </div>
      <div class="rp-workflow-note">Data pada halaman ini hanya simulasi dan tidak tersimpan ke database.</div>
    </section>
  `;
};

const adminUsersView = () => `
  <section class="rp-page rp-admin-native">
    <h3>Daftar Pengguna</h3>
    <div class="rp-admin-toolbar">
      <button class="sp-btn sp-btn-blue" data-rp-toast="Form tambah pengguna dibuka."><i class="fa-solid fa-plus"></i> Tambah</button>
      <div class="rp-admin-filters">
        <select class="rp-admin-select"><option>Filter status akun...</option><option>Aktif</option><option>Nonaktif</option></select>
        <select class="rp-admin-select"><option>Filter unit kerja...</option><option>Biro Umum</option><option>Biro Hukum</option></select>
        <input class="rp-admin-search" type="text" placeholder="Cari nama/username...">
      </div>
    </div>
    <div class="rp-native-table">
      <table>
        <thead><tr><th style="width:56px;text-align:center;">No.</th><th>Nama</th><th>Username</th><th>Unit Kerja</th><th style="text-align:center;">Status</th><th style="text-align:center;">Role</th><th style="text-align:center;">Aksi</th></tr></thead>
        <tbody>
          <tr><td style="text-align:center;">1.</td><td>Rafi Yulian</td><td>rafi</td><td>Biro Perencanaan dan Teknologi Informasi</td><td style="text-align:center;">Aktif</td><td style="text-align:center;">admin</td><td><div class="rp-native-actions"><button class="info" data-rp-toast="Detail pengguna rafi dibuka."><i class="fa-solid fa-circle-info"></i></button><button class="edit" data-rp-toast="Edit pengguna rafi dibuka."><i class="fa-regular fa-pen-to-square"></i></button><button class="delete" data-rp-delete="rafi"><i class="fa-solid fa-trash-can"></i></button></div></td></tr>
          <tr><td style="text-align:center;">2.</td><td>Admin LPSK</td><td>admin</td><td>Sekretariat Jenderal</td><td style="text-align:center;">Aktif</td><td style="text-align:center;">admin</td><td><div class="rp-native-actions"><button class="info" data-rp-toast="Detail pengguna admin dibuka."><i class="fa-solid fa-circle-info"></i></button><button class="edit" data-rp-toast="Edit pengguna admin dibuka."><i class="fa-regular fa-pen-to-square"></i></button><button class="delete" data-rp-delete="admin"><i class="fa-solid fa-trash-can"></i></button></div></td></tr>
        </tbody>
      </table>
    </div>
  </section>
`;

const adminRolesView = () => `
  <section class="rp-page rp-admin-native">
    <h3>Daftar Role</h3>
    <div class="rp-admin-toolbar">
      <button class="sp-btn sp-btn-blue" data-rp-toast="Form tambah role dibuka."><i class="fa-solid fa-plus"></i> Tambah</button>
      <div class="rp-admin-filters"><input class="rp-admin-search" type="text" placeholder="Cari nama role..."></div>
    </div>
    <div class="rp-native-table">
      <table>
        <thead><tr><th style="width:56px;text-align:center;">No.</th><th>Nama Role</th><th>Jumlah Permission</th><th style="width:150px;text-align:center;">Aksi</th></tr></thead>
        <tbody>
          ${["admin", "user", "atasan"].map((role, index) => `<tr><td style="text-align:center;">${index + 1}.</td><td>${role}</td><td><span class="rp-badge">${role === "admin" ? 24 : role === "user" ? 12 : 10} Akses</span></td><td><div class="rp-native-actions"><button class="info" data-rp-toast="Detail role ${role} dibuka."><i class="fa-solid fa-circle-info"></i></button><button class="edit" data-rp-toast="Edit role ${role} dibuka."><i class="fa-regular fa-pen-to-square"></i></button><button class="delete" data-rp-delete="role ${role}"><i class="fa-solid fa-trash-can"></i></button></div></td></tr>`).join("")}
        </tbody>
      </table>
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
    users: adminUsersView,
    roles: adminRolesView,
  };

  reportingContent.innerHTML = (views[rpState.view] || views.home)();
  reportingContent.focus({ preventScroll: true });
};

const setActiveNav = (nav) => {
  reportingApp.querySelectorAll(".rp-nav").forEach((button) => {
    button.classList.toggle("active", button === nav);
  });
};

const showMonitoringTooltip = (item, event) => {
  let tip = document.querySelector(".mst-tip");
  if (!tip) {
    tip = document.createElement("div");
    tip.className = "mst-tip";
    document.body.appendChild(tip);
  }

  const tone = item.tone || "safe";
  tip.innerHTML = `
    <div class="mst-tip-head">
      <div class="mst-tip-no">${item.id}</div>
      <span class="mst-tip-chip ${tone}">${deadlineLabel[tone] || "Status Laporan"}</span>
    </div>
    <div class="mst-tip-judul">${item.title}</div>
    <div class="mst-tip-status"><span class="mst-tip-dot" style="background:${item.status === "done" ? "#16a34a" : "#dc2626"}"></span>Status Pelaporan ${statusLabel[item.status]}</div>
    <div class="mst-tip-list">
      <div class="mst-tip-row"><span class="mst-tip-k">Deadline</span><span class="mst-tip-v">${fmtDate(item.deadline)}</span></div>
      <div class="mst-tip-row"><span class="mst-tip-k">Rentang</span><span class="mst-tip-v">${rangeDate(item)}</span></div>
      <div class="mst-tip-row"><span class="mst-tip-k">Unit</span><span class="mst-tip-v">${item.unit}</span></div>
    </div>
  `;
  tip.classList.add("show");
  moveMonitoringTooltip(event);
};

const moveMonitoringTooltip = (event) => {
  const tip = document.querySelector(".mst-tip");
  if (!tip) return;
  const left = Math.min(event.clientX + 16, window.innerWidth - tip.offsetWidth - 12);
  const top = Math.min(event.clientY + 16, window.innerHeight - tip.offsetHeight - 12);
  tip.style.left = `${Math.max(12, left)}px`;
  tip.style.top = `${Math.max(12, top)}px`;
};

const hideMonitoringTooltip = () => {
  document.querySelector(".mst-tip")?.classList.remove("show");
};

if (reportingApp && reportingContent) {
  reportingApp.addEventListener("click", (event) => {
    const nav = event.target.closest("[data-view]");
    const groupTitle = event.target.closest(".rp-group-title");
    const detailButton = event.target.closest("[data-rp-detail]");
    const formButton = event.target.closest("[data-rp-form]");
    const toastButton = event.target.closest("[data-rp-toast]");
    const deleteButton = event.target.closest("[data-rp-delete]");
    const saveButton = event.target.closest("[data-rp-demo-save]");
    const sidebarClose = event.target.closest(".rp-sidebar-close");
    const sidebarOpen = event.target.closest(".rp-sidebar-open");

    if (sidebarClose) {
      reportingApp.classList.add("sidebar-collapsed");
      return;
    }

    if (sidebarOpen) {
      reportingApp.classList.remove("sidebar-collapsed");
      return;
    }

    if (groupTitle) {
      const group = groupTitle.closest(".rp-group");
      group?.classList.toggle("open");
      return;
    }

    if (detailButton) {
      const [type, id] = detailButton.dataset.rpDetail.split(":");
      rpState.lastList = type;
      reportingContent.innerHTML = workflowFormView(type, "detail", id, detailButton.dataset.rpReturn || "");
      reportingContent.focus({ preventScroll: true });
      return;
    }

    if (nav) {
      rpState.view = nav.dataset.view;
      if (["penugasan", "penetapan"].includes(rpState.view)) rpState.lastList = rpState.view;
      const targetNav = nav.classList.contains("rp-nav")
        ? nav
        : reportingApp.querySelector(`.rp-nav[data-view="${rpState.view}"]`);
      setActiveNav(targetNav);
      render();
      return;
    }

    if (formButton) {
      const [type, mode, id] = formButton.dataset.rpForm.split(":");
      rpState.lastList = type;
      reportingContent.innerHTML = workflowFormView(type, mode, id);
      reportingContent.focus({ preventScroll: true });
      return;
    }

    if (saveButton) {
      showPelaporanAlert(`${saveButton.dataset.rpDemoSave} berhasil diproses pada mode demo. Data tidak disimpan permanen.`, "success");
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

  reportingApp.addEventListener("change", (event) => {
    const monthSelect = event.target.closest("[data-rp-monitor-month]");
    if (!monthSelect) return;
    rpState.monitoringMonth = Number(monthSelect.value) || 5;
    rpState.view = "monitoring-st";
    render();
  });

  reportingApp.addEventListener("mouseover", (event) => {
    const bar = event.target.closest("[data-mst-tip]");
    if (!bar) return;
    const item = findItem("penugasan", bar.dataset.mstTip);
    if (item) showMonitoringTooltip(item, event);
  });

  reportingApp.addEventListener("mousemove", (event) => {
    if (event.target.closest("[data-mst-tip]")) moveMonitoringTooltip(event);
  });

  reportingApp.addEventListener("mouseout", (event) => {
    const bar = event.target.closest("[data-mst-tip]");
    if (!bar) return;
    if (event.relatedTarget && bar.contains(event.relatedTarget)) return;
    hideMonitoringTooltip();
  });

  render();
}
