import adminStatic from "./admin-static";
import enExtracted from "../en/extracted";
import extracted from "./extracted";
import lightStatic from "./light-static";
import { createPlainTextTranslations } from "../plain-text";
import sspStatic from "./ssp-static";

const extractedPlainText = createPlainTextTranslations(enExtracted, extracted);

export default {
  // Auto-generated translations for extracted UI keys. Reviewed overrides live
  // in the structured namespaces below.
  ...extractedPlainText,
  ...extracted,
  ...adminStatic,
  ...lightStatic,
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
  branding: {
    systemName: "Hệ thống quản lý nghiệp vụ Cơ yếu trên nền tảng Windows",
    systemTitle: "Laborato MDM Light",
  },
  auth: {
    signInTitle: "Đăng nhập",
    username: "Tên tài khoản",
    password: "Mật khẩu",
    rememberMe: "Nhớ tài khoản",
    forgotPassword: "Quên mật khẩu",
    signInAction: "Đăng nhập",
    securePlatform: "Hệ thống bảo mật",
  },
  dataGuard: {
    tabLabel: "Secure Container",
    policyTitle: "Bảo vệ dữ liệu Secure Container",
    policyDescription:
      "DataGuard ngăn dữ liệu thuần được ghi ra ổ đĩa cục bộ, thư mục mạng, thư mục đám mây hoặc thiết bị USB. Người dùng vẫn có thể xuất gói .lsc đã mã hóa bằng Protected Export.",
    enableEnforcement: "Bật cơ chế bảo vệ DataGuard",
    enforcementMode: "Chế độ bảo vệ",
    auditWarning:
      "Chế độ kiểm tra ghi nhận các lần thử xuất dữ liệu nhưng không ngăn chặn.",
    failClosed:
      "Từ chối truy cập khi Broker hoặc trình điều khiển không khả dụng",
    failClosedHelp:
      "Khuyến nghị cho môi trường vận hành. Trình chỉnh sửa được bảo vệ sẽ không khởi chạy nếu cơ chế bảo vệ ở mức nhân chưa hoạt động.",
    minutes: "phút",
    maximumSession: "Thời lượng tối đa của phiên chỉnh sửa",
    approvedEditors: "Trình chỉnh sửa bên ngoài được phê duyệt",
    approvedEditorsHelp:
      "Để trống nếu chỉ cho phép trình xem và chỉnh sửa tích hợp.",
    addEditorPreset: "Thêm cấu hình trình chỉnh sửa",
    addCustomEditor: "Thêm trình chỉnh sửa tùy chỉnh được phê duyệt",
    editorIntegrityRequired:
      "Mỗi trình chỉnh sửa được phê duyệt phải có chủ thể chữ ký hoặc mã SHA-256.",
    executablePath: "Đường dẫn tệp thực thi",
    signerSubject: "Chủ thể chữ ký bắt buộc",
    sha256Optional: "SHA-256 (không bắt buộc)",
    launchArguments: "Các tham số khởi chạy cô lập",
    workspaceRoots: "Thư mục gốc của vùng làm việc được bảo vệ",
    workspaceRootsHelp:
      "Nâng cao: khi kết hợp chính sách, chỉ giữ các thư mục gốc có trong mọi chính sách",
    absoluteWindowsPath: "Đường dẫn Windows tuyệt đối",
    addWorkspaceRoot: "Thêm thư mục gốc",
    workspaceRootRequired:
      "Cơ chế bảo vệ DataGuard yêu cầu một thư mục gốc được bảo vệ.",
    modeAudit: "Chỉ kiểm tra",
    modeBlockPlaintext: "Chặn xuất dữ liệu thuần",
    modeProtectedExport: "Chỉ cho phép xuất dữ liệu được bảo vệ",
    editorWord: "Microsoft Word (đã ký)",
    editorLibreOffice: "LibreOffice Writer (đã ký)",
    editorNotepad: "Windows Notepad (đã ký)",
    argumentValidation:
      "Dùng đúng một {document}; tùy chọn: {workspace}, {workspaceUri}",
    healthTab: "DataGuard",
    healthTitle: "Cơ chế bảo vệ Secure Container",
    healthDescription:
      "Trạng thái trực tiếp của Broker và minifilter do các thiết bị Windows báo cáo.",
    noHealthReported:
      "Chưa có thiết bị nào báo cáo trạng thái DataGuard. Phiên chỉnh sửa bên ngoài được bảo vệ sẽ không khả dụng cho đến khi Broker và trình điều khiển hoạt động bình thường.",
    protected: "Được bảo vệ",
    unknown: "Không xác định",
    columnAgent: "Agent",
    columnProtection: "Bảo vệ",
    columnDriver: "Trình điều khiển",
    columnBroker: "Broker",
    columnProtocol: "Giao thức",
    columnSessions: "Phiên",
    columnQueued: "Đang chờ",
    columnDetail: "Chi tiết",
    columnReported: "Thời điểm báo cáo",
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
