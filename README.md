# Bảo Hân Quân — Portfolio

Trang chủ giới thiệu Công ty Bảo Hân Quân và các ứng dụng do Bảo Hân Quân phát triển & vận hành (ví dụ: [Thiên Minh Dịch](https://thienminhdich.com)).

Xây dựng bằng [Astro](https://astro.build), xuất ra site tĩnh — deploy được lên Vercel, Netlify, Cloudflare Pages…

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
| `src/data/apps.ts` | Danh sách ứng dụng — thêm app mới bằng cách thêm 1 object |
| `src/pages/index.astro` | Trang chủ: Hero, Giới thiệu, Sản phẩm, Giá trị, Liên hệ |
| `src/components/AppCard.astro` | Thẻ hiển thị một ứng dụng |
