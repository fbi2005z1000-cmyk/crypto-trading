const fs = require("fs");

const path = "e:\\trading-game\\app.js";
let content = fs.readFileSync(path, "utf8");

const tipPool = `const tipPool = [
  "Luôn đặt stop-loss trước khi vào lệnh.",
  "Không all-in khi thị trường biến động mạnh.",
  "Hãy ưu tiên quản lý rủi ro hơn là lợi nhuận.",
  "Đòn bẩy cao đi kèm rủi ro cao.",
  "Chỉ vào lệnh khi có kế hoạch rõ ràng.",
  "Giữ kỷ luật chốt lời theo mục tiêu.",
  "Đừng FOMO khi giá đã chạy mạnh.",
  "Tránh giao dịch khi tâm lý đang căng thẳng.",
  "Kiểm tra khối lượng trước khi vào lệnh.",
  "Ghi chú lại lệnh để rút kinh nghiệm."
];
`;
content = content.replace(/const tipPool = \[[\s\S]*?\];/, tipPool);

const tipChips = `const TIP_VIDEO_URL = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
const TIP_CHIPS = {
  candle: {
    title: "Nến là gì?",
    text: "Đọc thân nến, râu nến và ý nghĩa của mỗi phần.",
    duration: 12,
    video: TIP_VIDEO_URL
  },
  trend: {
    title: "Xác định xu hướng",
    text: "Đỉnh sau cao hơn đỉnh trước thì xu hướng tăng.",
    duration: 14,
    video: TIP_VIDEO_URL
  },
  "sl-tp": {
    title: "SL/TP cơ bản",
    text: "Đặt SL 1-2%, TP 2-3% để bảo vệ tài khoản.",
    duration: 10,
    video: TIP_VIDEO_URL
  },
  risk: {
    title: "Quản lý rủi ro",
    text: "Không all-in, vào 10-20% vốn mỗi lệnh.",
    duration: 15,
    video: TIP_VIDEO_URL
  }
};
`;
content = content.replace(/const TIP_CHIPS = \{[\s\S]*?\};/, tipChips);

const tipQuiz = `const TIP_QUIZ = {
  candle: [
    {
      q: "Thân nến thể hiện điều gì?",
      options: ["Giá mở và đóng cửa", "Độ biến động giá", "Khối lượng", "Thông tin SL"],
      correct: 0
    },
    {
      q: "Râu nến dùng để nhận biết?",
      options: ["Độ rung", "Điểm cao/thấp trong kỳ", "Phí giao dịch", "Lệnh chờ"],
      correct: 1
    }
  ],
  trend: [
    {
      q: "Đỉnh sau cao hơn đỉnh trước là xu hướng?",
      options: ["Giảm", "Tăng", "Sideway", "Không rõ"],
      correct: 1
    },
    {
      q: "Trong xu hướng tăng, ưu tiên?",
      options: ["Bán", "Mua", "All-in", "Bỏ qua SL"],
      correct: 1
    }
  ],
  "sl-tp": [
    {
      q: "SL dùng để?",
      options: ["Nhầm lệnh", "Cắt lỗ", "Tăng đòn bẩy", "Giảm phí"],
      correct: 1
    },
    {
      q: "TP dùng để?",
      options: ["Cắt lỗ", "Chốt lời", "Giảm rủi ro", "An toàn hơn"],
      correct: 1
    }
  ],
  risk: [
    {
      q: "Quản lý rủi ro đúng là?",
      options: ["All-in", "Vào 10-20% vốn", "Không cần SL", "Tăng đòn bẩy max"],
      correct: 1
    },
    {
      q: "Nếu thua liên tục nên?",
      options: ["Giao dịch tiếp", "Nghỉ và xem lại", "Tăng vốn", "Bỏ SL"],
      correct: 1
    }
  ]
};
`;
content = content.replace(/const TIP_QUIZ = \{[\s\S]*?\};/, tipQuiz);

content = content.replace(
  /els\.tipVideo\.src = tip\.video;\s*/g,
  "els.tipVideo.src = tip.video;\\n      if (typeof els.tipVideo.load === \"function\") els.tipVideo.load();\\n      "
);

fs.writeFileSync(path, content, "utf8");
