import { getCollection, type CollectionEntry } from "astro:content";

export type Policy = CollectionEntry<"policies">;
export type Announcement = CollectionEntry<"announcements">;

// id của entry có dạng "<slug-sản-phẩm>/<tên-file>"
export const productOf = (id: string) => id.split("/")[0];
const fileOf = (id: string) => id.split("/").slice(1).join("/");

/** Slug trên URL: tên file, bỏ tiền tố ngày "yyyy-mm-dd-" của thông báo */
export const entrySlug = (id: string) => fileOf(id).replace(/^\d{4}-\d{2}-\d{2}-/, "");

export const policyPath = (p: Policy) => `/san-pham/${productOf(p.id)}/chinh-sach/${entrySlug(p.id)}/`;
export const announcementPath = (a: Announcement) => `/san-pham/${productOf(a.id)}/thong-bao/${entrySlug(a.id)}/`;

export async function getPolicies(product?: string) {
  const all = await getCollection("policies", (p) => !product || productOf(p.id) === product);
  return all.sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title, "vi"));
}

/** Thông báo mới nhất trước, bài ghim luôn đứng đầu */
export async function getAnnouncements(product?: string) {
  const all = await getCollection("announcements", (a) => !product || productOf(a.id) === product);
  return all.sort(
    (a, b) => Number(b.data.pinned) - Number(a.data.pinned) || b.data.date.getTime() - a.data.date.getTime(),
  );
}

export const formatDate = (d: Date) =>
  new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }).format(d);
