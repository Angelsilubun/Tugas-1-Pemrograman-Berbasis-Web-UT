// Satu file JS buat semua halaman. Halaman dibedain pakai data-page di <body>.
const $ = (s, r = document) => r.querySelector(s);
const page = document.body.dataset.page;
const getUser = () => JSON.parse(sessionStorage.getItem("user") || "null");

function h(tag, cls, text) {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  if (text !== undefined) el.textContent = text;
  return el;
}

function greeting() {
  const jam = new Date().getHours();
  if (jam < 11) return "Selamat pagi";
  if (jam < 15) return "Selamat siang";
  if (jam < 18) return "Selamat sore";
  return "Selamat malam";
}

function openModal(id) {
  $("#" + id).classList.add("show");
  const f = $("#" + id + " input");
  if (f) f.focus();
}
function closeModal(id) {
  $("#" + id).classList.remove("show");
}
function initModals() {
  document
    .querySelectorAll("[data-open]")
    .forEach((b) =>
      b.addEventListener("click", () => openModal(b.dataset.open)),
    );
  document
    .querySelectorAll("[data-close]")
    .forEach((b) =>
      b.addEventListener("click", () => closeModal(b.dataset.close)),
    );
  document.querySelectorAll(".modal").forEach((m) =>
    m.addEventListener("click", (e) => {
      if (e.target === m) m.classList.remove("show");
    }),
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape")
      document
        .querySelectorAll(".modal.show")
        .forEach((m) => m.classList.remove("show"));
  });
}

function renderNav() {
  const u = getUser();
  const file = location.pathname.split("/").pop();
  $("#nav").innerHTML = `
    <nav class="nav" aria-label="Menu utama">
      <a class="brand" href="dashboard.html"><img src="assets/logo-ut.png" alt="" onerror="this.remove()">SITTA</a>
      <ul>
        <li><a href="stok.html">Informasi Bahan Ajar</a></li>
        <li><a href="tracking.html">Tracking Pengiriman</a></li>
        <li class="dd"><button type="button" aria-expanded="false">Laporan <span class="caret">&#9662;</span></button>
          <ul class="sub">
            <li><a href="#" data-soon>Monitoring Progress DO Bahan Ajar</a></li>
            <li><a href="#" data-soon>Rekap Bahan Ajar</a></li>
          </ul></li>
        <li><a href="#" data-soon>Histori Transaksi Bahan Ajar</a></li>
      </ul>
      <div class="who"><span>${u.nama}</span><button class="btn" id="logout" type="button">Keluar</button></div>
    </nav>`;
  document.querySelectorAll(".nav a[href]").forEach((a) => {
    if (a.getAttribute("href") === file) a.classList.add("active");
  });
  const dd = $(".dd"),
    btn = $(".dd > button");
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const o = dd.classList.toggle("open");
    btn.setAttribute("aria-expanded", o);
  });
  const tutup = () => {
    dd.classList.remove("open");
    btn.setAttribute("aria-expanded", false);
  };
  document.addEventListener("click", tutup);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") tutup();
  });
  document.querySelectorAll("[data-soon]").forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Menu ini belum tersedia pada Tugas Praktik 1.");
    }),
  );
  $("#logout").addEventListener("click", () => {
    if (confirm("Keluar dari SITTA?")) {
      sessionStorage.removeItem("user");
      location.href = "index.html";
    }
  });
}

function guard() {
  if (!getUser()) {
    alert("Silakan login terlebih dahulu.");
    location.href = "index.html";
    return false;
  }
  renderNav();
  return true;
}

/* ---------- Login ---------- */
function initLogin() {
  initModals();
  const f = $("#formLogin"),
    err = $("#loginErr");
  f.addEventListener("submit", (e) => {
    e.preventDefault();
    err.textContent = "";
    const email = f.email.value.trim().toLowerCase(),
      pw = f.password.value;
    if (!email || !pw) {
      err.textContent = "Email dan password wajib diisi.";
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      err.textContent = "Format email tidak valid.";
      return;
    }
    const u = dataPengguna.find((x) => x.email === email && x.password === pw);
    if (!u) {
      alert("email/password yang anda masukkan salah");
      return;
    }
    sessionStorage.setItem("user", JSON.stringify(u));
    location.href = "dashboard.html";
  });

  $("#formLupa").addEventListener("submit", (e) => {
    e.preventDefault();
    const m = $("#lupaMsg"),
      email = e.target.email.value.trim().toLowerCase();
    m.className = "err";
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      m.textContent = "Masukkan email yang valid.";
      return;
    }
    if (!dataPengguna.some((x) => x.email === email)) {
      m.textContent = "Email belum terdaftar.";
      return;
    }
    m.className = "err ok";
    m.textContent =
      "Tautan reset password telah dikirim ke " + email + " (simulasi).";
  });

  $("#formDaftar").addEventListener("submit", (e) => {
    e.preventDefault();
    const f2 = e.target,
      m = $("#daftarMsg");
    const nama = f2.nama.value.trim(),
      email = f2.email.value.trim().toLowerCase(),
      pw = f2.password.value;
    m.className = "err";
    if (!nama || !email || !pw) {
      m.textContent = "Semua kolom wajib diisi.";
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      m.textContent = "Format email tidak valid.";
      return;
    }
    if (pw.length < 6) {
      m.textContent = "Password minimal 6 karakter.";
      return;
    }
    if (pw !== f2.konfirmasi.value) {
      m.textContent = "Konfirmasi password tidak sama.";
      return;
    }
    if (dataPengguna.some((x) => x.email === email)) {
      m.textContent = "Email sudah terdaftar.";
      return;
    }
    dataPengguna.push({
      id: dataPengguna.length + 1,
      nama,
      email,
      password: pw,
      role: "UPBJJ-UT",
      lokasi: "-",
    });
    alert(
      "Pendaftaran berhasil. Silakan login (data hanya tersimpan selama halaman terbuka).",
    );
    f2.reset();
    closeModal("modalDaftar");
  });
}

/* ---------- Dashboard ---------- */
function initDashboard() {
  const u = getUser();
  $("#greet").textContent = `${greeting()}, ${u.nama}`;
  $("#role").textContent = `${u.role} - ${u.lokasi}`;
  $("#tanggal").textContent = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  $("#sJudul").textContent = dataBahanAjar.length;
  $("#sStok").textContent = dataBahanAjar
    .reduce((a, b) => a + b.stok, 0)
    .toLocaleString("id-ID");
  $("#sDO").textContent = Object.keys(dataTracking).length;
}

/* ---------- Tracking ---------- */
function initTracking() {
  const f = $("#formCari"),
    err = $("#cariErr"),
    out = $("#hasil");
  f.addEventListener("submit", (e) => {
    e.preventDefault();
    err.textContent = "";
    out.replaceChildren();
    const no = f.nomorDO.value.trim();
    if (!no) {
      err.textContent = "Nomor Delivery Order wajib diisi.";
      return;
    }
    if (!/^\d+$/.test(no)) {
      err.textContent = "Nomor DO hanya boleh berisi angka.";
      return;
    }
    const d = dataTracking[no];
    if (!d) {
      alert("Nomor DO " + no + " tidak ditemukan.");
      return;
    }

    const steps = [...d.perjalanan].sort((a, b) =>
      b.waktu.localeCompare(a.waktu),
    );
    const selesai = steps[0].keterangan.startsWith("Selesai");
    const pct = selesai ? 100 : Math.min(85, 20 + d.perjalanan.length * 15);

    const head = h("section", "result-head");
    head.append(
      h("h2", "", d.nama),
      h("span", "tag", selesai ? "Selesai diantar" : d.status),
    );
    const bar = h("div", "bar");
    bar.setAttribute("role", "progressbar");
    bar.setAttribute("aria-valuenow", pct);
    const fill = h("span");
    fill.style.width = "0";
    bar.append(fill);
    const dl = h("dl");
    [
      ["No. DO", d.nomorDO],
      ["Ekspedisi", d.ekspedisi],
      ["Tanggal kirim", d.tanggalKirim],
      ["Jenis paket", d.paket],
      ["Total pembayaran", d.total],
    ].forEach(([k, v]) => dl.append(h("dt", "", k), h("dd", "", v)));
    head.append(bar, h("small", "", "Progres pengiriman " + pct + "%"), dl);

    const trip = h("section", "panel");
    trip.append(h("h3", "", "Perjalanan paket"));
    const ul = h("ol", "timeline");
    steps.forEach((s) => {
      const li = h("li");
      const t = h("time", "", s.waktu);
      t.dateTime = s.waktu.replace(" ", "T");
      li.append(t, h("span", "", s.keterangan));
      ul.append(li);
    });
    trip.append(ul);
    out.append(head, trip);
    requestAnimationFrame(() => {
      fill.style.width = pct + "%";
    });
  });
}

/* ---------- Stok ---------- */
/* ---------- Stok ---------- */
function buatCover(item) {
  const kosong = () => h("div", "thumb kosong", "No cover");
  if (!item.cover) return kosong();
  const img = h("img", "thumb");
  img.src = item.cover;
  img.alt = "Cover " + item.namaBarang;
  img.addEventListener("error", () => img.replaceWith(kosong()));
  return img;
}

function tampilDetail(item) {
  const img = $("#coverDetail");
  if (item.cover) {
    img.src = item.cover;
    img.alt = "Cover " + item.namaBarang;
    img.hidden = false;
    img.onerror = () => {
      img.hidden = true;
    };
  } else {
    img.hidden = true;
  }

  const dl = $("#isiDetail");
  dl.replaceChildren();
  [
    ["Kode lokasi", item.kodeLokasi],
    ["Kode barang", item.kodeBarang],
    ["Nama barang", item.namaBarang],
    ["Jenis barang", item.jenisBarang],
    ["Edisi", item.edisi],
    ["Stok", item.stok],
    ["Status stok", item.stok < 200 ? "Menipis" : "Aman"],
  ].forEach(([k, v]) => dl.append(h("dt", "", k), h("dd", "", v)));

  openModal("modalDetail");
}

function tambahBaris(item, baru) {
  const tr = h("tr", baru ? "new" : "");

  const tdCover = h("td");
  tdCover.append(buatCover(item));
  tr.append(tdCover);

  [
    item.kodeLokasi,
    item.kodeBarang,
    item.namaBarang,
    item.jenisBarang,
    item.edisi,
  ].forEach((v) => tr.append(h("td", "", v)));

  const tdStok = h("td");
  tdStok.append(
    h(
      "span",
      "tag" + (item.stok < 200 ? " low" : ""),
      item.stok + (item.stok < 200 ? " (menipis)" : ""),
    ),
  );
  tr.append(tdStok);

  const aksi = h("td");
  const btn = h("button", "btn ghost", "Detail");
  btn.type = "button";
  btn.addEventListener("click", () => tampilDetail(item));
  aksi.append(btn);
  tr.append(aksi);

  $("#tbStok").append(tr);
}

function bacaGambar(file) {
  return new Promise((resolve) => {
    if (!file) return resolve("");
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

function initStok() {
  initModals();
  dataBahanAjar.forEach((i) => tambahBaris(i, false));
  const f = $("#formStok"),
    err = $("#stokErr");
  const hitung = () => {
    $("#jumlah").textContent = dataBahanAjar.length + " judul";
  };
  hitung();

  f.addEventListener("submit", async (e) => {
    e.preventDefault();
    err.textContent = "";
    const v = (n) => f[n].value.trim();
    const item = {
      kodeLokasi: v("kodeLokasi").toUpperCase(),
      kodeBarang: v("kodeBarang").toUpperCase(),
      namaBarang: v("namaBarang"),
      jenisBarang: v("jenisBarang"),
      edisi: v("edisi"),
      stok: Number(v("stok")),
      cover: "",
    };

    if (
      !item.kodeLokasi ||
      !item.kodeBarang ||
      !item.namaBarang ||
      !item.edisi ||
      v("stok") === ""
    ) {
      err.textContent = "Semua kolom wajib diisi.";
      return;
    }
    if (!Number.isInteger(item.stok) || item.stok < 0) {
      err.textContent = "Stok harus berupa bilangan bulat 0 atau lebih.";
      return;
    }
    if (
      dataBahanAjar.some(
        (b) =>
          b.kodeBarang === item.kodeBarang && b.kodeLokasi === item.kodeLokasi,
      )
    ) {
      err.textContent = "Kode barang ini sudah ada di lokasi tersebut.";
      return;
    }

    const file = f.cover.files[0];
    if (file && !file.type.startsWith("image/")) {
      err.textContent = "File harus berupa gambar.";
      return;
    }
    if (file && file.size > 2 * 1024 * 1024) {
      err.textContent = "Ukuran gambar maksimal 2 MB.";
      return;
    }

    item.cover = await bacaGambar(file);
    dataBahanAjar.push(item);
    tambahBaris(item, true);
    f.reset();
    hitung();
  });
}

/* ---------- Router ---------- */
document.addEventListener("DOMContentLoaded", () => {
  if (page === "login") return initLogin();
  if (!guard()) return;
  ({ dashboard: initDashboard, tracking: initTracking, stok: initStok })[
    page
  ]();
});
