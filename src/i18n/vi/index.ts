import adminStatic from "./admin-static";
import enExtracted from "../en/extracted";
import extracted from "./extracted";
import { createPlainTextTranslations } from "../plain-text";
import sspStatic from "./ssp-static";

const extractedPlainText = createPlainTextTranslations(enExtracted, extracted);

export default {
  // Auto-generated translations for extracted UI keys. Reviewed overrides live
  // in the structured namespaces below.
  ...extractedPlainText,
  ...extracted,
  ...adminStatic,
  ...sspStatic,
  common: {
    save: "Lưu",
    cancel: "Hủy",
    delete: "Xóa",
    edit: "Chỉnh sửa",
    close: "Đóng",
    refresh: "Làm mới",
    loading: "Đang tải...",
    confirm: "Xác nhận",
    yes: "Có",
    no: "Không",
    search: "Tìm kiếm",
  },
  language: {
    label: "Ngôn ngữ",
    english: "Tiếng Anh",
    russian: "Tiếng Nga",
    vietnamese: "Tiếng Việt",
  },
  devicemanagement: {
    bulkActions: {
      fullWipeAll: "Xóa sạch tất cả",
    },
  },
  layout: {
    outdatedBanner: "Bạn đang xem phiên bản cũ của trang này.",
    licenseInactive:
      "Giấy phép của bạn hiện không hoạt động, thường là do vấn đề thanh toán.",
    openMenu: "Mở menu",
    closeMenu: "Đóng menu",
    backToDashboard: "Quay lại bảng điều khiển",
    refreshDashboard: "Làm mới bảng điều khiển",
    documentation: "Tài liệu",
    preferences: "Tùy chọn",
    account: "Tài khoản",
    resetPassword: "Đặt lại mật khẩu",
    logout: "Đăng xuất",
  },
};
