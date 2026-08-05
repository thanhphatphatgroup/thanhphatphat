# 📦 HỆ THỐNG QUẢN LÝ ẢNH & SẢN PHẨM NỔI BẬT - THÀNH PHÁT PHÁT PLASTIC

Tài liệu hướng dẫn nhanh cách vận hành hệ thống website, tối ưu ảnh và quản lý sản phẩm nổi bật trang chủ.

---

## 📂 Cấu trúc thư mục chính
- `images/products/`: Chứa toàn bộ ảnh sản phẩm được phân chia theo danh mục (`khan-giay/`, `ly-giay/`, `ly-nhua/`, `tho-giay/`, `tui-bao-bi/`, `tem/`, `raider/`).
- `featured.json`: File lưu trữ danh sách 12 ảnh nổi bật của từng danh mục phục vụ cho trang chủ.
- `quan_ly_san_pham.py`: Tool GUI Local chạy trên trình duyệt để chọn và kéo thả sắp xếp ảnh nổi bật.
- `update-gallery.py` / `.bat`: Script tự động nén ảnh sang `.webp` và dọn dẹp file gốc.

---

## 🚀 1. Quy trình thêm ảnh sản phẩm mới
Khi bro có ảnh sản phẩm mới (chụp hoặc thiết kế):
1. Ném thẳng các file ảnh (`.png`, `.jpg`, `.jpeg`, `.webp`) vào thư mục danh mục tương ứng trong `images/products/<ten-danh-muc>/`.
2. Nhấp đúp chạy file **`update-gallery.bat`** (hoặc `update-gallery_2.bat`).
   * *Hệ thống sẽ tự động:*
     * Chuyển toàn bộ ảnh mới sang định dạng chuẩn web `.webp` (chất lượng 80%)[cite: 2].
     * Xóa sạch file gốc (`.png`, `.jpg`...) để giải phóng dung lượng[cite: 2].
     * Cập nhật lại file `gallery.json` của danh mục đó với bộ ảnh mới được đôn lên đầu[cite: 2].

---

## 🎨 2. Quản lý sản phẩm nổi bật trên Trang Chủ (Tool Local)
Để chọn và sắp xếp tối đa 12 sản phẩm nổi bật hiển thị ở slider trang chủ cho từng danh mục:
1. Mở Terminal / CMD tại thư mục gốc và chạy lệnh khởi động tool:
   ```bash
   python quan_ly_san_pham.py