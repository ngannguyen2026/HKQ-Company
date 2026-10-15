import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Mỗi file nằm trong thư mục mang slug của sản phẩm (xem src/data/apps.ts):
//   src/content/policies/<slug-sản-phẩm>/<slug-chính-sách>.md
//   src/content/announcements/<slug-sản-phẩm>/<yyyy-mm-dd>-<slug-thông-báo>.md

const policies = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/policies" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    updated: z.coerce.date(),
    /** Thứ tự hiển thị trong danh sách chính sách của sản phẩm */
    order: z.number().default(100),
    /** Bản gốc công bố trên website của sản phẩm (nếu có) */
    source: z.url().optional(),
    /** Bản nháp: hiện nhãn "Bản nháp" và không cho công cụ tìm kiếm lập chỉ mục */
    draft: z.boolean().default(false),
  }),
});

const announcements = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/announcements" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    tag: z.enum(["Cập nhật", "Tính năng", "Bảo trì", "Sự kiện", "Quan trọng"]).default("Cập nhật"),
    /** Ghim lên đầu danh sách */
    pinned: z.boolean().default(false),
  }),
});

export const collections = { policies, announcements };
