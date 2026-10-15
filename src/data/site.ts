// Thông tin chung của công ty — cập nhật tại đây.
// TODO: thay các giá trị placeholder (email, địa chỉ, domain, số liệu) bằng thông tin thật.
export const company = {
  name: "Bảo Hân Quân",
  fullName: "Công ty Bảo Hân Quân",
  tagline: "Xây dựng sản phẩm số mang giá trị Việt",
  description:
    "Bảo Hân Quân phát triển và vận hành các ứng dụng web & di động, kết hợp tri thức truyền thống với công nghệ hiện đại để tạo ra trải nghiệm hữu ích cho người Việt.",
  email: "contact@hkq.vn",
  address: "Việt Nam",
  year: new Date().getFullYear(),
  // Thông tin pháp lý — chỉ hiển thị ở footer khi có giá trị.
  legalName: "", // VD: "CÔNG TY TNHH BẢO HÂN QUÂN"
  taxId: "", // Mã số thuế
  phone: "",
  socials: [] as { label: string; url: string }[], // VD: { label: "Facebook", url: "https://..." }
};

export const capabilities = [
  {
    title: "Thiết kế sản phẩm",
    text: "Nghiên cứu người dùng, thiết kế trải nghiệm và giao diện, xây dựng nhận diện cho từng thương hiệu.",
    tags: ["UX/UI", "Branding", "Prototype"],
  },
  {
    title: "Phát triển Web",
    text: "Website và ứng dụng web tốc độ cao, chuẩn SEO, hiển thị tốt trên mọi thiết bị.",
    tags: ["Web app", "SEO", "Performance"],
  },
  {
    title: "Ứng dụng di động",
    text: "Ứng dụng iOS và Android với trải nghiệm đồng bộ cùng nền tảng web.",
    tags: ["iOS", "Android", "Đồng bộ đa nền tảng"],
  },
  {
    title: "Vận hành & tăng trưởng",
    text: "Hạ tầng ổn định, bảo mật dữ liệu, chăm sóc người dùng và cải tiến sản phẩm liên tục.",
    tags: ["Cloud", "Bảo mật", "Chăm sóc khách hàng"],
  },
];

export const marquee = [
  "Sản phẩm số",
  "Web & Mobile",
  "Văn hoá Việt",
  "Thiết kế tinh gọn",
  "Công nghệ hiện đại",
  "Vận hành bền vững",
];

export const values = [
  {
    no: "01",
    title: "Lấy người dùng làm gốc",
    text: "Mỗi sản phẩm bắt đầu từ một nhu cầu thật của người Việt, được thiết kế đơn giản, dễ dùng và tôn trọng quyền riêng tư.",
  },
  {
    no: "02",
    title: "Truyền thống gặp công nghệ",
    text: "Chúng tôi trân trọng tri thức văn hoá phương Đông và mang chúng đến gần hơn bằng công nghệ hiện đại.",
  },
  {
    no: "03",
    title: "Vận hành bền vững",
    text: "Bảo Hân Quân trực tiếp phát triển, vận hành và chăm sóc từng ứng dụng lâu dài trên web, iOS và Android.",
  },
];

export const process = [
  { title: "Khám phá", text: "Lắng nghe người dùng, tìm ra vấn đề đáng giải quyết." },
  { title: "Thiết kế", text: "Phác thảo trải nghiệm tinh gọn, nhất quán, có bản sắc." },
  { title: "Phát triển", text: "Xây dựng trên web, iOS và Android với nền tảng kỹ thuật vững chắc." },
  { title: "Vận hành", text: "Đo lường, lắng nghe phản hồi và cải tiến liên tục." },
];
