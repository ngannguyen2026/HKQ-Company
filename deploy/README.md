# Deploy — bhqcompany.com

Site được build thành file tĩnh (`dist/`) và phục vụ bằng **nginx** trên VPS, phía trước là **Cloudflare**.

```
Merge PR vào main
   └─► GitHub Actions (.github/workflows/deploy.yml)
         1. npm ci && npm run build
         2. rsync dist/ → server:/var/www/bhqcompany/releases/<thời-gian>-<sha>/
         3. đổi symlink current → release mới (không downtime)
         4. xoá bớt, chỉ giữ 5 release gần nhất
         5. gọi https://bhqcompany.com/release.txt để xác nhận đúng bản mới
```

Mỗi Pull Request còn được kiểm tra build bởi `.github/workflows/ci.yml` trước khi merge.

## Quy trình hằng ngày

1. Tạo branch, sửa code, mở Pull Request vào `main`.
2. Chờ check **CI / build** xanh.
3. Merge PR → workflow **Deploy** tự chạy, khoảng 1 phút sau site cập nhật.

Theo dõi ở tab **Actions** của repo. Muốn deploy lại mà không cần commit mới: Actions → **Deploy** → **Run workflow**.

## Rollback

SSH vào server rồi chạy:

```bash
sudo -u deploy /var/www/bhqcompany/rollback.sh            # về bản ngay trước
sudo -u deploy /var/www/bhqcompany/rollback.sh <release>  # về bản cụ thể
ls /var/www/bhqcompany/releases                           # xem các bản đang giữ
```

Hoặc revert commit lỗi trên GitHub và merge — pipeline sẽ deploy lại bản đúng.

## GitHub Secrets

Đặt ở **Settings → Secrets and variables → Actions**:

| Secret | Giá trị |
| --- | --- |
| `DEPLOY_HOST` | IP của server (không dùng domain vì domain đi qua Cloudflare) |
| `DEPLOY_USER` | `deploy` |
| `DEPLOY_SSH_KEY` | Private key SSH (ed25519) có quyền đăng nhập user `deploy` |
| `DEPLOY_KNOWN_HOSTS` | Kết quả `ssh-keyscan -t ed25519 <IP server>` |

## Thiết lập server lần đầu

Đã thực hiện trên server hiện tại; ghi lại để dựng server mới khi cần (Ubuntu 24.04, chạy bằng root).

```bash
# 1. Phần mềm
curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
apt-get install -y nodejs nginx rsync certbot python3-certbot-nginx

# 2. User deploy + thư mục release
useradd -m -s /bin/bash deploy
mkdir -p /var/www/bhqcompany/releases
cp deploy/rollback.sh /var/www/bhqcompany/rollback.sh
chown -R deploy:deploy /var/www/bhqcompany

# 3. SSH key cho GitHub Actions
ssh-keygen -t ed25519 -N '' -C github-actions-deploy -f ./gha_deploy
install -d -m 700 -o deploy -g deploy /home/deploy/.ssh
echo "restrict $(cat gha_deploy.pub)" > /home/deploy/.ssh/authorized_keys
chown deploy:deploy /home/deploy/.ssh/authorized_keys && chmod 600 /home/deploy/.ssh/authorized_keys
# → nội dung gha_deploy đưa vào secret DEPLOY_SSH_KEY, sau đó xoá file gha_deploy

# 4. Nginx
cp deploy/nginx/bhqcompany.com.conf /etc/nginx/sites-available/
ln -s /etc/nginx/sites-available/bhqcompany.com.conf /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# 5. Chứng chỉ SSL cho origin (tự gia hạn qua certbot.timer)
certbot --nginx -d bhqcompany.com -d www.bhqcompany.com --no-redirect
```

Sau đó chạy workflow **Deploy** một lần (Run workflow) để có release đầu tiên.

## Cloudflare

- DNS: bản ghi `A` cho `bhqcompany.com` và `www` trỏ về IP server, bật proxy (mây cam).
- **SSL/TLS → Overview → chọn _Full (strict)_**: server đã có chứng chỉ Let's Encrypt hợp lệ,
  nên kết nối Cloudflare → server cũng được mã hoá. (Chế độ _Flexible_ gửi dữ liệu không mã hoá về server.)
- **SSL/TLS → Edge Certificates → bật _Always Use HTTPS_** để chuyển http → https ở Cloudflare.
  Không bật redirect ở nginx khi còn để Flexible, sẽ gây vòng lặp redirect.
- HTML trả về `Cache-Control: no-cache` nên bản mới hiển thị ngay sau deploy, không cần purge cache.
