// Danh sách ứng dụng do Bảo Hân Quân Company quản lý.
// Thêm một ứng dụng mới = thêm một object vào mảng `apps`.
export type App = {
  slug: string;
  name: string;
  /** Website của sản phẩm (bỏ trống nếu không có, ví dụ game offline) */
  url?: string;
  domain?: string;
  category: string;
  tagline: string;
  description: string;
  features: string[];
  platforms: string[];
  /** Ký tự / biểu tượng hiển thị trên thẻ */
  mark: string;
  /** Màu nhấn riêng của sản phẩm */
  accent: string;
  status: "live" | "beta" | "coming-soon";
  /** Link tải ứng dụng trên các kho */
  stores?: { label: string; url: string }[];
  /** Pháp nhân trực tiếp cung cấp dịch vụ / nhà phát triển trên store (nếu khác Bảo Hân Quân Company) */
  operator?: string;
  /** Tên tiếng Anh của pháp nhân trên, đúng như tên nhà phát triển hiển thị trên App Store */
  operatorEn?: string;
  /** Màn hình minh hoạ trên điện thoại trong khối giới thiệu ở trang chủ */
  showcase: {
    art: "hexagram" | "maze";
    /** Dòng chữ nhỏ dưới tên app */
    hint: string;
    /** Nút trên màn hình */
    cta: string;
    /** 8 ký hiệu xếp vòng quanh điện thoại */
    ring: string[];
  };
  /**
   * false = chưa công bố: không hiện ở trang chủ, footer, sitemap; trang sản phẩm vẫn truy cập được
   * bằng link (dùng khi cần URL chính sách để nộp lên kho ứng dụng trước ngày ra mắt).
   */
  listed?: boolean;
};

export const statusLabel: Record<App["status"], string> = {
  live: "Đang hoạt động",
  beta: "Beta",
  "coming-soon": "Sắp ra mắt",
};

/** Sản phẩm đã công bố (hiện ở trang chủ, footer, sitemap) */
export const isListed = (app: App) => app.listed !== false;

/** Trang riêng của sản phẩm trên bhqcompany.com */
export const appPath = (slug: string) => `/san-pham/${slug}/`;

export const apps: App[] = [
  {
    slug: "thien-minh-dich",
    name: "Thiên Minh Dịch",
    url: "https://thienminhdich.com",
    domain: "thienminhdich.com",
    category: "Văn hoá · Chiêm nghiệm",
    tagline: "Gieo một quẻ, soi một đường.",
    description:
      "Ứng dụng gieo quẻ Lục Hào & Mai Hoa Dịch, kết hợp tinh hoa Kinh Dịch với công nghệ luận giải hiện đại — một khoảng lặng để nhìn rõ điều đang nghĩ.",
    features: [
      "Gieo quẻ Lục Hào: quẻ chủ & quẻ biến",
      "Mai Hoa Dịch từ số, thời gian, chữ hoặc sự việc",
      "Hỏi tiếp cùng “Thầy Quẻ” theo ngữ cảnh",
      "Lưu lịch sử & nhật ký riêng tư",
    ],
    platforms: ["Web", "iOS", "Android"],
    mark: "☯",
    accent: "#b0472f",
    status: "live",
    stores: [
      { label: "App Store", url: "https://apps.apple.com/vn/app/thi%C3%AAn-minh-d%E1%BB%8Bch/id6745871721?l=vi" },
      { label: "Google Play", url: "https://play.google.com/store/apps/details?id=com.thienminhdich.app&hl=vi" },
    ],
    operator: "Công ty TNHH Thiên Minh Dịch",
    operatorEn: "Thiên Minh Dịch Company Limited",
    showcase: {
      art: "hexagram",
      hint: "Một khoảng lặng để nhìn rõ điều đang nghĩ",
      cta: "Gieo quẻ",
      ring: ["☰", "☱", "☲", "☳", "☴", "☵", "☶", "☷"],
    },
  },
  {
    slug: "maze-memory",
    name: "Maze Memory",
    category: "Game · Offline",
    tagline: "Tìm đường ra khỏi mê cung.",
    description: "Game mê cung chơi offline, không cần kết nối mạng hay tài khoản.",
    features: [
      "Chơi offline, không cần kết nối mạng",
      "Không cần tài khoản",
      "Lời nhắc chơi tuỳ chọn, tắt được bất cứ lúc nào",
      "Nhiều ngôn ngữ",
    ],
    platforms: ["iOS", "Android"],
    mark: "▦",
    accent: "#3d7be0",
    status: "coming-soon",
    // Phát hành trên store bằng tài khoản nhà phát triển của Công ty TNHH Thiên Minh Dịch
    operator: "Công ty TNHH Thiên Minh Dịch",
    operatorEn: "Thiên Minh Dịch Company Limited",
    showcase: {
      art: "maze",
      hint: "Chơi mọi lúc, không cần mạng",
      cta: "Chơi",
      ring: ["↑", "→", "↓", "←", "↑", "→", "↓", "←"],
    },
  },
];
