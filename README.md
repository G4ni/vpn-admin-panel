```markdown
# vpn-admin-panel

Frontend Admin Panel untuk mengelola user & session SoftEther VPN.  
Dibangun dengan **React + Vite**, terhubung ke `vpn-api`.

---

## 🚀 Fitur
- Dashboard (CPU, Memory, Disk, Uptime, Bandwidth)
- Manajemen VPN User (create, delete, set password)
- Monitoring Sessions (list, disconnect)
- Generate & Download OVPN

---

## 📦 Install

```bash
git clone https://github.com/G4ni/vpn-admin-panel.git
cd vpn-admin-panel
npm install
⚙️ Konfigurasi
Buat file .env:

ini
Salin kode
VITE_API_KEY=17AgustusTahun1945ItulahHariKemerdekaanKitaHariMerdekaNusaDanBangsa
▶️ Jalankan Dev Server
bash
Salin kode
npm run dev
Admin panel akan running di http://127.0.0.1:5173

📦 Build & Deploy
Build untuk production:

bash
Salin kode
npm run build
Hasil build ada di folder dist/.

Deploy dengan Nginx:

nginx
Salin kode
server {
  listen 80;
  server_name 103.49.239.230;

  root /opt/vpn-suite/vpn-admin-panel/dist;
  index index.html;

  location / {
    try_files $uri /index.html;
  }

  location /api/ {
    proxy_pass http://127.0.0.1:3000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
Reload nginx:

bash
Salin kode
sudo nginx -t
sudo systemctl reload nginx
🔗 Integrasi
vpn-api harus sudah running di 127.0.0.1:3000

vpn-admin-panel akan call API lewat /api/... (diterusin via nginx reverse proxy)
