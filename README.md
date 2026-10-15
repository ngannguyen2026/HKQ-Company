# Bảo Hân Quân Company — bhqcompany.com

Website giới thiệu Bảo Hân Quân Company và các ứng dụng do Bảo Hân Quân Company phát triển & vận hành (ví dụ: [Thiên Minh Dịch](https://thienminhdich.com)).

Xây dựng bằng [Astro](https://astro.build), xuất ra site tĩnh. Production: **https://bhqcompany.com** — tự động deploy mỗi khi merge PR vào `main` (xem [deploy/README.md](deploy/README.md)).

## Chạy dự án

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # xuất ra thư mục dist/
```

## Cấu trúc

| File | Nội dung |
| --- | --- |
| `src/data/site.ts` | Thông tin công ty: tên, slogan, email, địa chỉ |
| `src/data/apps.ts` | Danh sách sản phẩm — thêm sản phẩm mới bằng cách thêm 1 object |
| `src/content/policies/<sản-phẩm>/*.md` | Chính sách của từng sản phẩm |
| `src/content/announcements/<sản-phẩm>/*.md` | Thông báo của từng sản phẩm |
| `src/pages/index.astro` | Trang chủ: Hero, Giới thiệu, Sản phẩm, Giá trị, Liên hệ |
| `src/pages/san-pham/[slug]/` | Trang riêng của sản phẩm, trang chính sách, trang thông báo |
| `src/components/AppShowcase.astro` | Khối giới thiệu một sản phẩm trên trang chủ |

## Trang riêng của sản phẩm

Mỗi sản phẩm trong `src/data/apps.ts` tự có các trang:

| URL | Nội dung |
| --- | --- |
| `/san-pham/<slug>/` | Tổng quan, danh sách thông báo và chính sách |
| `/san-pham/<slug>/chinh-sach/<tên-file>/` | Một chính sách |
| `/san-pham/<slug>/thong-bao/<tên-file>/` | Một thông báo |

Tên thư mục trong `src/content/` phải trùng `slug` của sản phẩm (ví dụ `thien-minh-dich`).

### Thêm / sửa chính sách

Tạo hoặc sửa file `src/content/policies/<slug>/<tên-chính-sách>.md`:

```md
---
title: "Chính sách bảo mật"
description: "Một câu tóm tắt, hiện trên thẻ chính sách và đầu trang."
updated: 2026-07-31          # ngày cập nhật lần cuối
order: 2                     # thứ tự trong danh sách (nhỏ đứng trước)
source: "https://..."        # tuỳ chọn: link bản gốc
---

## 1. Phạm vi áp dụng

Nội dung viết bằng Markdown. Mỗi tiêu đề `##` tự thành một mục trong mục lục.
```

Ngoài Markdown thường, có thể dùng khối nhấn mạnh `<div class="callout">…</div>` (thêm `warning` để có màu cảnh báo) và bảng 2 cột `<table class="data-table">…</table>`.

> Chính sách của Thiên Minh Dịch được sao chép từ thienminhdich.com (link `source` trong từng file).
> Khi bản trên thienminhdich.com thay đổi, cần cập nhật lại file tương ứng ở đây.

### Đăng thông báo

Tạo file `src/content/announcements/<slug>/<yyyy-mm-dd>-<tên-ngắn>.md` (tiền tố ngày không xuất hiện trên URL):

```md
---
title: "Bảo trì hệ thống ngày 20/10"
summary: "Một câu tóm tắt hiện trong danh sách thông báo."
date: 2026-10-20
tag: "Bảo trì"               # Cập nhật | Tính năng | Bảo trì | Sự kiện | Quan trọng
pinned: false                # true để ghim lên đầu
---

Nội dung thông báo…
```

Mở PR → merge → site tự deploy (xem [deploy/README.md](deploy/README.md)).
