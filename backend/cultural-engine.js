// COMPLETE CULTURAL ENGINE FOR RESEARCH
// Enhanced hierarchical responses with comprehensive campus scenarios

const hierarchyResponses = {
  'student-to-staff': {
    casual: {
      complaint: "Maaf ya kak, ada masalah nih. Bisa bantu cariin solusinya? 😔",
      inquiry: "Hai kak! Ini info yang kamu butuhkan tentang",
      praise: "Makasih banyak kak! Helpful banget, appreciate it! 😊",
      greeting: "Hai kak! Ada yang bisa dibantu hari ini?",
      farewell: "Oke kak, semoga membantu ya! Kalau ada yang lain, tinggal chat lagi 😊"
    },
    formal: {
      complaint: "Mohon maaf mengganggu waktu Bapak/Ibu. Ada kendala yang perlu bantuan untuk diselesaikan.",
      inquiry: "Baik, berikut informasi yang Anda butuhkan mengenai",
      praise: "Terima kasih banyak atas bantuan Bapak/Ibu. Sangat membantu sekali.",
      greeting: "Selamat pagi/siang Bapak/Ibu. Ada yang bisa saya bantu?",
      farewell: "Terima kasih atas waktunya. Semoga informasi ini bermanfaat."
    }
  },
  
  'student-to-dosen': {
    casual: {
      complaint: "Maaf Pak/Bu, ada kendala nih dengan proses ini. Mohon bimbingannya 🙏",
      inquiry: "Baik Pak/Bu, ini penjelasan tentang",
      praise: "Terima kasih banyak atas bimbingan Bapak/Ibu. Sangat berharga sekali 🙏",
      greeting: "Selamat pagi/siang Pak/Bu. Mohon izin untuk bertanya.",
      farewell: "Terima kasih atas waktu dan bimbingannya, Pak/Bu."
    },
    formal: {
      complaint: "Dengan hormat Bapak/Ibu Dosen. Saya mengalami kendala dan mohon arahan dari Bapak/Ibu.",
      inquiry: "Dengan hormat, berikut penjelasan mengenai",
      praise: "Terima kasih yang sebesar-besarnya atas bimbingan dan ilmu yang Bapak/Ibu berikan. Sangat bermanfaat.",
      greeting: "Dengan hormat Bapak/Ibu Dosen. Perkenalkan saya [nama], mohon izin untuk berkonsultasi.",
      farewell: "Sekali lagi terima kasih atas bimbingan Bapak/Ibu. Salam hormat."
    }
  },
  
  'peer-to-peer': {
    casual: {
      complaint: "Wah, ada masalah nih guys. Ada yang pernah ngalamin atau tau solusinya?",
      inquiry: "Nih info yang lu cari tentang",
      praise: "Thanks banget ya bro/sis! Lu helpful sekali 😄",
      greeting: "Hai guys! Ada yang online? Need help nih 😅",
      farewell: "Oke thanks ya! See you around 👋"
    },
    formal: {
      complaint: "Permisi teman-teman, ada yang bisa bantu dengan masalah ini?",
      inquiry: "Baik, ini informasi yang dibutuhkan tentang",
      praise: "Terima kasih teman-teman atas bantuannya. Sangat membantu!",
      greeting: "Halo semuanya, ada yang bisa membantu dengan pertanyaan saya?",
      farewell: "Terima kasih atas bantuannya. Sampai jumpa!"
    }
  }
};

// COMPREHENSIVE CAMPUS INFORMATION DATABASE
const campusInfo = {
  // ACADEMIC AFFAIRS
  'daftar ulang': {
    info: 'Untuk daftar ulang semester: (1) Login SIAKAD dengan username/password, (2) Isi KRS (Kartu Rencana Studi), (3) Bayar SPP sesuai tagihan, (4) Print KTM (Kartu Tanda Mahasiswa). Deadline biasanya 2 minggu setelah semester dimulai. Kalau telat, kena denda Rp 50.000.',
    category: 'academic'
  },
  'krs': {
    info: 'KRS (Kartu Rencana Studi) diisi online di SIAKAD. Maksimal 24 SKS per semester (20 SKS kalau IP < 2.75). Bisa add/drop mata kuliah dalam 2 minggu pertama kuliah. Konsultasi dosen wali wajib sebelum finalisasi KRS.',
    category: 'academic'
  },
  'transkrip': {
    info: 'Transkrip nilai bisa diambil di bagian akademik lantai 2 gedung rektorat. Syarat: fotokopi KTM, biaya Rp 25.000. Kalau online, bisa download di SIAKAD menu "Transkrip" (tersedia 1 minggu setelah nilai keluar).',
    category: 'academic'
  },
  'wisuda': {
    info: 'Pendaftaran wisuda: (1) Sudah lulus semua mata kuliah, (2) IPK minimal 2.00, (3) Tidak ada tunggakan SPP, (4) Daftar online di SIAKAD, (5) Bayar biaya wisuda Rp 500.000. Deadline pendaftaran 2 bulan sebelum acara wisuda.',
    category: 'academic'
  },

  // FINANCIAL
  'spp': {
    info: 'Pembayaran SPP bisa melalui: (1) Bank BNI, BRI, Mandiri dengan kode billing dari SIAKAD, (2) Internet banking, (3) Kasir kampus (lantai 1 gedung rektorat, jam 08:00-15:00). Deadline tanggal 25 setiap bulan, telat kena denda 2% per bulan.',
    category: 'financial'
  },
  'beasiswa': {
    info: 'Jenis beasiswa: (1) Beasiswa PPA (IPK min 3.00), (2) Beasiswa Bidikmisi, (3) Beasiswa prestasi. Info lengkap di website kampus bagian kemahasiswaan atau datang ke lantai 3 gedung rektorat. Pendaftaran biasanya semester ganjil (Agustus-September).',
    category: 'financial'
  },
  'cicilan': {
    info: 'SPP bisa dicicil 2x per semester dengan syarat: (1) Mengajukan surat permohonan ke bagian keuangan, (2) Ada persetujuan orang tua/wali, (3) Cicilan 1: 60% di awal semester, Cicilan 2: 40% sebelum UTS. Biaya admin Rp 50.000 per cicilan.',
    category: 'financial'
  },

  // FACILITIES & SERVICES  
  'wifi': {
    info: 'WiFi kampus: SSID "KAMPUS-WIFI", password "kampus2024" (berubah setiap semester). Kalau koneksi lemot: (1) Restart device, (2) Pindah lokasi (hotspot terbaik: perpustakaan, lobby utama), (3) Lapor ke IT Support lantai 1 kalau masih bermasalah.',
    category: 'facilities'
  },
  'perpustakaan': {
    info: 'Perpustakaan buka Senin-Jumat 07:00-21:00, Sabtu 08:00-17:00. Fasilitas: ruang baca, komputer, WiFi, AC. Peminjaman buku: maksimal 3 buku, 7 hari. Denda telat Rp 1.000/hari/buku. Akses e-journal tersedia 24/7 via website perpustakaan.',
    category: 'facilities'
  },
  'lab': {
    info: 'Lab komputer tersedia di gedung C lantai 2-3. Booking online di website atau langsung ke petugas lab. Jam operasional: 08:00-16:00 (hari kerja). Software tersedia: Office, Visual Studio, Photoshop, AutoCAD. Print/scan: Rp 500/lembar.',
    category: 'facilities'
  },
  'parkir': {
    info: 'Area parkir: (1) Motor: area belakang gedung A, B, C (gratis), (2) Mobil: depan gedung rektorat (Rp 5.000/hari). Jam buka 06:00-22:00. Wajib pakai helm, kunci motor, dan simpan STNK. Keamanan 24 jam.',
    category: 'facilities'
  },

  // STUDENT SERVICES
  'ktm': {
    info: 'KTM (Kartu Tanda Mahasiswa) dibuat saat daftar ulang. Kalau hilang: (1) Lapor ke bagian kemahasiswaan, (2) Buat surat keterangan hilang, (3) Bayar biaya penggantian Rp 25.000, (4) Foto 3x4 background merah, (5) Tunggu 3-5 hari kerja.',
    category: 'services'
  },
  'surat': {
    info: 'Jenis surat yang bisa diurus: (1) Surat keterangan mahasiswa aktif, (2) Surat keterangan kelakuan baik, (3) Surat rekomendasi. Syarat: KTM, biaya Rp 10.000-25.000. Proses 2-3 hari kerja. Ambil di bagian kemahasiswaan lantai 3.',
    category: 'services'
  },
  'skripsi': {
    info: 'Proses skripsi: (1) Seminar proposal (semester 7), (2) Penelitian & bimbingan, (3) Seminar hasil, (4) Sidang skripsi. Syarat sidang: min 140 SKS, IPK 2.00, bebas tunggakan. Bimbingan minimal 8x dengan dosen pembimbing. Deadline upload ke repository 1 minggu setelah sidang.',
    category: 'academic'
  },

  // SCHEDULE & EVENTS
  'jadwal': {
    info: 'Jadwal kuliah bisa dilihat di: (1) SIAKAD menu "Jadwal Kuliah", (2) Papan pengumuman fakultas, (3) WhatsApp grup kelas. Kalau ada perubahan jadwal, akan diumumkan H-1. Jam kuliah: 07:00-18:00 (8 slot waktu @90 menit).',
    category: 'academic'
  },
  'libur': {
    info: 'Kalender akademik: (1) Libur semester: Januari & Juli, (2) Libur nasional sesuai pemerintah, (3) Libur Dies Natalis kampus (Mei), (4) Cuti bersama (biasanya lebaran & tahun baru). Cek website resmi untuk update kalender akademik.',
    category: 'general'
  },

  // HEALTH & COUNSELING
  'kesehatan': {
    info: 'Poliklinik kampus (gedung D lantai 1): Senin-Jumat 08:00-15:00. Fasilitas: pemeriksaan umum, P3K, obat-obatan dasar. Gratis untuk mahasiswa (tunjukkan KTM). Kalau sakit serius, ada rujukan ke RS terdekat dengan surat pengantar.',
    category: 'services'
  },
  'konseling': {
    info: 'Layanan konseling psikologi tersedia di gedung rektorat lantai 3. Gratis dan rahasia untuk mahasiswa. Konsultasi: masalah akademik, personal, karir. Buat janji via WhatsApp atau datang langsung. Konselor tersedia Senin, Rabu, Jumat (09:00-15:00).',
    category: 'services'
  }
};

// ENHANCED CONTEXT DETECTION
function detectContext(message) {
  const lowerMsg = message.toLowerCase();
  
  // Enhanced keyword detection with Indonesian variations
  const complaintKeywords = [
    'marah', 'kesal', 'buruk', 'lemot', 'lambat', 'error', 'rusak', 
    'gak bisa', 'tidak bisa', 'ga bisa', 'bermasalah', 'jelek', 'payah',
    'susah', 'ribet', 'males', 'bingung banget', 'pusing', 'stress',
    'menyebalkan', 'kesel banget', 'cape', 'capek'
  ];
  
  const praiseKeywords = [
    'terima kasih', 'makasih', 'thanks', 'bagus', 'mantap', 'keren', 
    'hebat', 'membantu', 'baik', 'top', 'oke banget', 'perfect',
    'helpful', 'appreciate', 'grateful', 'nice', 'good job'
  ];

  const greetingKeywords = [
    'halo', 'hai', 'hi', 'hello', 'selamat pagi', 'selamat siang', 
    'selamat sore', 'selamat malam', 'pagi', 'siang', 'sore', 'malam'
  ];

  const farewellKeywords = [
    'bye', 'dadah', 'sampai jumpa', 'see you', 'terima kasih', 
    'sudah cukup', 'selesai', 'oke thanks', 'ok thx'
  ];
  
  if (greetingKeywords.some(keyword => lowerMsg.includes(keyword))) {
    return 'greeting';
  }
  
  if (farewellKeywords.some(keyword => lowerMsg.includes(keyword))) {
    return 'farewell';
  }
  
  if (complaintKeywords.some(keyword => lowerMsg.includes(keyword))) {
    return 'complaint';
  }
  
  if (praiseKeywords.some(keyword => lowerMsg.includes(keyword))) {
    return 'praise';
  }
  
  return 'inquiry';
}

// ENHANCED TOPIC DETECTION
function detectTopic(message) {
  const lowerMsg = message.toLowerCase();
  
  // Match exact topics
  for (const [topic, data] of Object.entries(campusInfo)) {
    if (lowerMsg.includes(topic)) {
      return { topic, ...data };
    }
  }
  
  // Match related keywords
  const topicKeywords = {
    'nilai': ['grade', 'ip', 'ipk', 'hasil', 'score'],
    'dosen': ['profesor', 'guru', 'pengajar', 'lecturer', 'pembimbing'],
    'ujian': ['uts', 'uas', 'quiz', 'test', 'exam', 'kuis'],
    'mata kuliah': ['matkul', 'course', 'subject', 'pelajaran'],
    'semester': ['sem', 'catur wulan'],
    'kampus': ['universitas', 'college', 'univ'],
    'administrasi': ['admin', 'surat', 'berkas', 'dokumen']
  };
  
  for (const [mainTopic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some(keyword => lowerMsg.includes(keyword))) {
      return { 
        topic: mainTopic, 
        info: `Untuk informasi tentang ${mainTopic}, silakan sebutkan lebih spesifik apa yang ingin ditanyakan.`,
        category: 'general'
      };
    }
  }
  
  return { topic: 'general', info: '', category: 'general' };
}

// ENHANCED RESPONSE GENERATION
function generateCulturalResponse(message, hierarchy = 'student-to-staff', formality = 'casual') {
  const context = detectContext(message);
  const { topic, info, category } = detectTopic(message);
  
  console.log(`📨 Message: "${message}"`);
  console.log(`🏛️ Hierarchy: ${hierarchy}, 📝 Formality: ${formality}`);
  console.log(`🎯 Context: ${context}, 📚 Topic: ${topic}, 🏷️ Category: ${category}`);
  
  // Get base response based on hierarchy, formality, and context
  const baseResponse = hierarchyResponses[hierarchy]?.[formality]?.[context] 
    || hierarchyResponses['student-to-staff']['casual'][context];
  
  // Handle different contexts
  switch (context) {
    case 'greeting':
    case 'farewell':
      return baseResponse;
      
    case 'praise':
      return baseResponse;
      
    case 'complaint':
      if (topic !== 'general' && info) {
        return `${baseResponse}\n\nTentang ${topic}: ${info}`;
      }
      return `${baseResponse} Bisa ceritain lebih detail masalahnya?`;
      
    case 'inquiry':
    default:
      if (info) {
        return `${baseResponse} ${topic}:\n\n${info}`;
      } else {
        return `${baseResponse} hal tersebut. Bisa lebih spesifik pertanyaannya? Misalnya: daftar ulang, SPP, beasiswa, jadwal, dll.`;
      }
  }
}

// ANALYTICS FUNCTIONS
function getResponseMetrics(message, response, hierarchy, formality, context) {
  return {
    messageLength: message.length,
    responseLength: response.length,
    hierarchy: hierarchy,
    formality: formality,
    detectedContext: context,
    timestamp: new Date().toISOString(),
    hasSpecificInfo: response.includes(':'),
    culturalElements: {
      respectLevel: formality === 'formal' ? 'high' : 'medium',
      hierarchyAware: hierarchy !== 'peer-to-peer',
      indonesianContext: true
    }
  };
}

module.exports = { 
  generateCulturalResponse, 
  detectContext, 
  detectTopic,
  getResponseMetrics,
  campusInfo,
  hierarchyResponses
};