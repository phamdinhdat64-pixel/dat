/**
 * LEO ĐỈNH BÀN CỜ (PEAK CLIMBER)
 * Logic chính của trò chơi dựa trên GAME_SPEC.md:
 * - 20 câu hỏi trắc nghiệm đặc thù về Đại học Bách khoa - Đại học Đà Nẵng (DUT).
 * - Di chuyển qua/dẫm vào các mốc 10, 20, 30, 40 kích hoạt Popup trắc nghiệm.
 * - Đúng: Giữ vị trí, thông báo & qua lượt.
 * - Sai: Lùi lại 5 bước (Math.max(0, position - 5)), thông báo & qua lượt.
 * - Mỗi mốc CHỈ kích hoạt 1 lần duy nhất cho mỗi người chơi.
 * - Không bao giờ trùng lặp lại câu hỏi đã xuất hiện trước đó.
 */

// ==========================================================================
// 1. Dữ liệu 20 Câu Hỏi Trắc Nghiệm: ĐẠI HỌC BÁCH KHOA - ĐẠI HỌC ĐÀ NẴNG (DUT)
// ==========================================================================
const BOARD_LENGTH = 50;
const MILESTONES = [10, 20, 30, 40];

const QUIZ_QUESTIONS = [
    {
        id: 1,
        question: "Trường Đại học Bách khoa - Đại học Đà Nẵng tọa lạc tại số mấy đường Nguyễn Lương Bằng?",
        options: ["Số 54 Nguyễn Lương Bằng", "Số 100 Nguyễn Lương Bằng", "Số 28 Nguyễn Lương Bằng", "Số 45 Nguyễn Lương Bằng"],
        correctIndex: 0
    },
    {
        id: 2,
        question: "Tên viết tắt tiếng Anh chính thức của Trường Đại học Bách khoa - ĐH Đà Nẵng là gì?",
        options: ["BKDN", "DUT", "DUST", "DNTU"],
        correctIndex: 1
    },
    {
        id: 3,
        question: "Tiền thân của Trường Đại học Bách khoa - ĐH Đà Nẵng được thành lập vào năm nào?",
        options: ["Năm 1985", "Năm 1994", "Năm 1975", "Năm 2000"],
        correctIndex: 2
    },
    {
        id: 4,
        question: "Trường Đại học Bách khoa - ĐH Đà Nẵng là trường đại học thành viên trực thuộc đơn vị nào?",
        options: ["Đại học Huế", "Đại học Quốc gia TP.HCM", "Đại học Thái Nguyên", "Đại học Đà Nẵng"],
        correctIndex: 3
    },
    {
        id: 5,
        question: "Chương trình đào tạo Kỹ sư Chất lượng cao hợp tác với Cộng hòa Pháp tại DUT có tên viết tắt là gì?",
        options: ["PFIEV", "AUN-QA", "ABET", "CTTT"],
        correctIndex: 0
    },
    {
        id: 6,
        question: "Khu giảng đường nào tại DUT nổi tiếng với Hội trường lớn và Trung tâm Thông tin học liệu?",
        options: ["Khu A", "Khu B", "Khu F", "Khu C"],
        correctIndex: 2
    },
    {
        id: 7,
        question: "Màu sắc nhận diện truyền thống và chủ đạo trên logo của ĐH Bách khoa - ĐH Đà Nẵng là màu gì?",
        options: ["Màu Xanh dương", "Màu Đỏ cam", "Màu Vàng đồng", "Màu Xanh lá cây"],
        correctIndex: 0
    },
    {
        id: 8,
        question: "Biểu tượng nào xuất hiện nổi bật và trang trọng trong logo của ĐH Bách khoa Đà Nẵng?",
        options: ["Ngọn hải đăng và cánh buồm", "Bánh răng kỹ thuật và ngọn đuốc tri thức", "Chim lạc và trống đồng", "Cây bút lông và bình mực"],
        correctIndex: 1
    },
    {
        id: 9,
        question: "Trường Đại học Bách khoa - ĐH Đà Nẵng toạ lạc trên địa bàn quận nào của TP. Đà Nẵng?",
        options: ["Quận Hải Châu", "Quận Thanh Khê", "Quận Sơn Trà", "Quận Liên Chiểu"],
        correctIndex: 3
    },
    {
        id: 10,
        question: "Khoa nào tại DUT chịu trách nhiệm đào tạo ngành Công nghệ thông tin và Kỹ thuật phần mềm?",
        options: ["Khoa Công nghệ Thông tin", "Khoa Điện tử - Viễn thông", "Khoa Cơ khí", "Khoa Quản lý Dự án"],
        correctIndex: 0
    },
    {
        id: 11,
        question: "ĐH Bách khoa - ĐH Đà Nẵng đạt chuẩn kiểm định cơ sở giáo dục đại học của tổ chức Châu Âu nào?",
        options: ["ABET", "HCERES (Pháp)", "ASIIN", "FIBAA"],
        correctIndex: 1
    },
    {
        id: 12,
        question: "Chuẩn kiểm định chất lượng đào tạo kỹ thuật uy tín khu vực Đông Nam Á mà nhiều ngành DUT đạt được là gì?",
        options: ["AUN-QA", "ISO 9001", "QS Stars", "THE Ranking"],
        correctIndex: 0
    },
    {
        id: 13,
        question: "CTI là chuẩn kiểm định kỹ sư danh giá của quốc gia nào mà chương trình PFIEV của DUT đạt được?",
        options: ["Hoa Kỳ", "Nhật Bản", "Cộng hòa Pháp", "Hàn Quốc"],
        correctIndex: 2
    },
    {
        id: 14,
        question: "Địa điểm nào trong khuôn viên trường là nơi diễn ra các giải bóng đá và sự kiện thể thao lớn của sinh viên DUT?",
        options: ["Sân vận động Bách khoa", "Hội trường F", "Khu nhà A", "Cung Thể thao Tiên Sơn"],
        correctIndex: 0
    },
    {
        id: 15,
        question: "Sân chơi sáng tạo khoa học kỹ thuật nào sinh viên Bách khoa Đà Nẵng từng nhiều lần vô địch toàn quốc?",
        options: ["RoboCar", "Robocon", "Maker Faire", "FPT Techday"],
        correctIndex: 1
    },
    {
        id: 16,
        question: "Triết lý giáo dục của Trường Đại học Bách khoa - ĐH Đà Nẵng nhấn mạnh vào 3 giá trị cốt lõi nào?",
        options: ["Chăm chỉ, Thật thà, Dũng cảm", "Kỷ luật, Đoàn kết, Tiên phong", "Tư duy, Sáng tạo, Cống hiến", "Độc lập, Tự do, Hạnh phúc"],
        correctIndex: 2
    },
    {
        id: 17,
        question: "Sinh viên tốt nghiệp khối ngành kỹ thuật tại ĐH Bách khoa - ĐH Đà Nẵng được trao bằng danh xưng nào?",
        options: ["Kỹ sư", "Bác sĩ", "Cử nhân kinh tế", "Chuyên viên kỹ thuật"],
        correctIndex: 0
    },
    {
        id: 18,
        question: "Sự kiện ngày hội việc làm và giao lưu doanh nghiệp thường niên lớn nhất tại DUT có tên là gì?",
        options: ["DUT Career Fair", "DUT Job Fair", "BKDN Job Day", "Danang Tech Expo"],
        correctIndex: 1
    },
    {
        id: 19,
        question: "Khuôn viên trường ĐH Bách khoa Đà Nẵng nằm gần bãi biển nổi tiếng nào ở khu vực Tây Bắc thành phố?",
        options: ["Bãi biển Mỹ Khê", "Bãi biển Non Nước", "Bãi biển Tiên Sa", "Bãi biển Xuân Thiều (Vịnh Đà Nẵng)"],
        correctIndex: 3
    },
    {
        id: 20,
        question: "Cổng phụ phía sau của Trường ĐH Bách khoa Đà Nẵng nằm trên tuyến đường nào?",
        options: ["Đường Ngô Thì Nhậm", "Đường Tôn Đức Thắng", "Đường Phạm Như Xương", "Đường Âu Cơ"],
        correctIndex: 0
    }
];

// Tập hợp theo dõi các câu hỏi đã xuất hiện để không bao giờ bị trùng lặp
const usedQuestionIds = new Set();

// ==========================================================================
// 2. Hệ Thống Âm Thanh Web Audio Tự Tổng Hợp
// ==========================================================================
let audioCtx = null;
let soundEnabled = true;

function initAudio() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

const AudioSFX = {
    playRoll() {
        if (!soundEnabled || !audioCtx) return;
        const now = audioCtx.currentTime;
        for (let i = 0; i < 10; i++) {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(240 + Math.random() * 320, now + i * 0.055);
            gain.gain.setValueAtTime(0.14, now + i * 0.055);
            gain.gain.exponentialRampToValueAtTime(0.01, now + (i + 1) * 0.055);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now + i * 0.055);
            osc.stop(now + (i + 1) * 0.055);
        }
    },

    playDiceImpact() {
        if (!soundEnabled || !audioCtx) return;
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.1);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
    },

    playStep() {
        if (!soundEnabled || !audioCtx) return;
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.08);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
    },

    playMilestoneAlert() {
        if (!soundEnabled || !audioCtx) return;
        const notes = [330, 440, 550, 660];
        notes.forEach((freq, i) => {
            const now = audioCtx.currentTime + i * 0.08;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, now);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.12);
        });
    },

    playCorrect() {
        if (!soundEnabled || !audioCtx) return;
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, i) => {
            const now = audioCtx.currentTime + i * 0.09;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now);
            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.14);
        });
    },

    playWrong() {
        if (!soundEnabled || !audioCtx) return;
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(70, now + 0.35);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
    },

    playVictory() {
        if (!soundEnabled || !audioCtx) return;
        const notes = [440, 440, 440, 587.33, 659.25, 880];
        notes.forEach((freq, i) => {
            const now = audioCtx.currentTime + i * 0.14;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.22);
        });
    }
};

// ==========================================================================
// 3. Trạng Thái Toàn Cục (GameState)
// ==========================================================================
const DEFAULT_PRESETS = [
    { name: "BKDN Tân Binh", color: "#ef476f", avatarIcon: "🧗‍♂️", isBot: false },
    { name: "Kỹ Sư CNTT", color: "#00f0ff", avatarIcon: "🧙‍♂️", isBot: true },
    { name: "Kỹ Sư Cơ Khí", color: "#06d6a0", avatarIcon: "🏹", isBot: true },
    { name: "Kỹ Sư Xây Dựng", color: "#ffd166", avatarIcon: "👑", isBot: true }
];

let gameState = {
    players: [],
    currentRound: 1,
    turnOrder: [],
    currentTurnIndex: 0,
    activePlayerId: null,
    phase: 'SETUP',
    lastDiceRoll: null,
    isAnimatingMove: false,
    quizTimerInterval: null,
    quizTimeLeft: 15,
    winner: null
};

// ==========================================================================
// 4. Cache DOM Elements
// ==========================================================================
const dom = {
    canvas: document.getElementById('boardCanvas'),
    currentRoundDisplay: document.getElementById('currentRoundDisplay'),
    turnOrderList: document.getElementById('turnOrderList'),
    gameBanner: document.getElementById('gameBanner'),
    bannerText: document.getElementById('bannerText'),

    // Control Sidebar
    activePlayerAvatar: document.getElementById('activePlayerAvatar'),
    activePlayerName: document.getElementById('activePlayerName'),
    activePlayerPos: document.getElementById('activePlayerPos'),
    activePlayerNextMilestone: document.getElementById('activePlayerNextMilestone'),
    btnRollDice: document.getElementById('btnRollDice'),
    playerProgressList: document.getElementById('playerProgressList'),
    logContent: document.getElementById('logContent'),

    // True 3D Cube Dice Roll Overlay
    diceOverlay: document.getElementById('diceOverlay'),
    dicePlayerPill: document.getElementById('dicePlayerPill'),
    dicePlayerDot: document.getElementById('dicePlayerDot'),
    dicePlayerName: document.getElementById('dicePlayerName'),
    diceActionTitle: document.getElementById('diceActionTitle'),
    diceScene: document.getElementById('diceScene'),
    diceBouncer: document.getElementById('diceBouncer'),
    diceCube: document.getElementById('diceCube'),
    diceGroundShadow: document.getElementById('diceGroundShadow'),
    diceOutcomeBadge: document.getElementById('diceOutcomeBadge'),
    diceOutcomeText: document.getElementById('diceOutcomeText'),

    // Top action buttons
    btnSound: document.getElementById('btnSound'),
    soundIcon: document.getElementById('soundIcon'),
    btnRules: document.getElementById('btnRules'),
    btnRestart: document.getElementById('btnRestart'),

    // Setup Modal
    setupModal: document.getElementById('setupModal'),
    playerCountGroup: document.getElementById('playerCountGroup'),
    playerInputsContainer: document.getElementById('playerInputsContainer'),
    btnStartGame: document.getElementById('btnStartGame'),

    // Quiz Modal
    quizModal: document.getElementById('quizModal'),
    quizMilestoneBadge: document.getElementById('quizMilestoneBadge'),
    quizTimerText: document.getElementById('quizTimerText'),
    quizProgressBar: document.getElementById('quizProgressBar'),
    quizQuestionText: document.getElementById('quizQuestionText'),
    quizOptionsGrid: document.getElementById('quizOptionsGrid'),

    // Victory Modal
    victoryModal: document.getElementById('victoryModal'),
    winnerSubtitle: document.getElementById('winnerSubtitle'),
    victoryStatsContainer: document.getElementById('victoryStatsContainer'),
    btnPlayAgain: document.getElementById('btnPlayAgain'),

    // Rules Modal
    rulesModal: document.getElementById('rulesModal'),
    btnCloseRules: document.getElementById('btnCloseRules')
};

const ctx = dom.canvas.getContext('2d');
const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 600;
dom.canvas.width = CANVAS_WIDTH;
dom.canvas.height = CANVAS_HEIGHT;

// ==========================================================================
// 5. Toạ Độ Bàn Cờ 50 Ô Ziczac 5 Tầng Đèo Sơn Trà (Mỗi tầng 10 ô)
// ==========================================================================
const SONTRA_TIERS = [
    { tier: 1, name: "TẦNG 1: CHÂN NÚI SƠN TRÀ • BÃI BỤT (Ô 0 ➔ 10)", startIdx: 0, endIdx: 10, y: 515 },
    { tier: 2, name: "TẦNG 2: ĐÈO LINH ỨNG TỰ (Ô 11 ➔ 20)", startIdx: 11, endIdx: 20, y: 425 },
    { tier: 3, name: "TẦNG 3: ĐÈO CÂY ĐA DI SẢN NGÀN NĂM (Ô 21 ➔ 30)", startIdx: 21, endIdx: 30, y: 335 },
    { tier: 4, name: "TẦNG 4: TRẠM RA-ĐA MẮT THẦN ĐÔNG DƯƠNG (Ô 31 ➔ 40)", startIdx: 31, endIdx: 40, y: 245 },
    { tier: 5, name: "TẦNG 5: ĐỈNH BÀN CỜ • TIÊN ÔNG ĐÁNH CỜ (Ô 41 ➔ 50)", startIdx: 41, endIdx: 50, y: 140 }
];

const MILESTONE_THEMES = {
    10: {
        color: '#06d6a0', // Xanh ngọc Linh Ứng
        glow: 'rgba(6, 214, 160, 0.85)',
        badge: 'CHÙA LINH ỨNG',
        icon: '🚩',
        radius: 22
    },
    20: {
        color: '#ffb703', // Vàng hổ phách Cây Đa Di Sản
        glow: 'rgba(255, 183, 3, 0.85)',
        badge: 'CÂY ĐA DI SẢN',
        icon: '🚩',
        radius: 22
    },
    30: {
        color: '#9d4edd', // Tím thạch anh Ra-đa Mắt Thần
        glow: 'rgba(157, 78, 221, 0.85)',
        badge: 'MẮT THẦN',
        icon: '🚩',
        radius: 22
    },
    40: {
        color: '#f72585', // Đỏ hồng Ruby Đèo Gió
        glow: 'rgba(247, 37, 133, 0.85)',
        badge: 'ĐÈO GIÓ',
        icon: '🚩',
        radius: 22
    },
    50: {
        color: '#ffd166', // Hoàng kim Đỉnh Bàn Cờ
        glow: 'rgba(255, 209, 102, 0.95)',
        badge: 'ĐỈNH BÀN CỜ',
        icon: '👑',
        radius: 30
    }
};

const TILE_COORDINATES = [];

function generateBoardPath() {
    TILE_COORDINATES.length = 0;
    const marginX = 85;
    const usableWidth = CANVAS_WIDTH - marginX * 2; // 730px

    // Tầng 1: 0 đến 10 (11 ô: 0 -> 10) Trái sang Phải
    for (let i = 0; i <= 10; i++) {
        const x = marginX + (i / 10) * usableWidth;
        TILE_COORDINATES.push({ index: i, x, y: 515, tier: 1 });
    }

    // Tầng 2: 11 đến 20 (10 ô) Phải sang Trái
    for (let i = 11; i <= 20; i++) {
        const frac = 1 - ((i - 10) / 10);
        const x = marginX + frac * usableWidth;
        TILE_COORDINATES.push({ index: i, x, y: 425, tier: 2 });
    }

    // Tầng 3: 21 đến 30 (10 ô) Trái sang Phải
    for (let i = 21; i <= 30; i++) {
        const frac = (i - 20) / 10;
        const x = marginX + frac * usableWidth;
        TILE_COORDINATES.push({ index: i, x, y: 335, tier: 3 });
    }

    // Tầng 4: 31 đến 40 (10 ô) Phải sang Trái
    for (let i = 31; i <= 40; i++) {
        const frac = 1 - ((i - 30) / 10);
        const x = marginX + frac * usableWidth;
        TILE_COORDINATES.push({ index: i, x, y: 245, tier: 4 });
    }

    // Tầng 5: 41 đến 50 (10 ô) Trái sang Phải lên Đỉnh
    for (let i = 41; i <= 50; i++) {
        const frac = (i - 40) / 10;
        const x = marginX + frac * usableWidth;
        TILE_COORDINATES.push({ index: i, x, y: 140, tier: 5 });
    }
}
generateBoardPath();

// ==========================================================================
// 6. Màn Hình Setup: Chọn 2 - 4 người chơi & Nhập tên
// ==========================================================================
let currentSelectedCount = 2;

function renderSetupInputs(count) {
    dom.playerInputsContainer.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const preset = DEFAULT_PRESETS[i];
        const row = document.createElement('div');
        row.className = 'player-input-row';
        row.innerHTML = `
            <div class="color-indicator" style="background-color: ${preset.color}; box-shadow: 0 0 8px ${preset.color};"></div>
            <input type="text" class="player-name-input" id="inputPlayerName_${i}" value="${preset.name}" placeholder="Nhập tên người chơi ${i + 1}" maxlength="20">
            <button type="button" class="bot-toggle ${preset.isBot ? 'active' : ''}" id="btnBotToggle_${i}" title="Chuyển đổi Người / Bot">
                ${preset.isBot ? '🤖 Bot AI' : '👤 Người'}
            </button>
        `;
        dom.playerInputsContainer.appendChild(row);

        const botBtn = row.querySelector(`#btnBotToggle_${i}`);
        botBtn.addEventListener('click', () => {
            preset.isBot = !preset.isBot;
            botBtn.classList.toggle('active', preset.isBot);
            botBtn.textContent = preset.isBot ? '🤖 Bot AI' : '👤 Người';
        });
    }
}

dom.playerCountGroup.querySelectorAll('.btn-select').forEach(btn => {
    btn.addEventListener('click', () => {
        dom.playerCountGroup.querySelectorAll('.btn-select').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentSelectedCount = parseInt(btn.getAttribute('data-count'), 10);
        renderSetupInputs(currentSelectedCount);
    });
});

// Khởi tạo ngay danh sách người chơi mặc định
renderSetupInputs(currentSelectedCount);

dom.btnStartGame.addEventListener('click', () => {
    initAudio();
    const players = [];

    for (let i = 0; i < currentSelectedCount; i++) {
        const nameInput = document.getElementById(`inputPlayerName_${i}`);
        const preset = DEFAULT_PRESETS[i];
        const enteredName = nameInput ? nameInput.value.trim() : '';

        players.push({
            id: `player_${i + 1}`,
            name: enteredName || preset.name,
            color: preset.color,
            avatarIcon: preset.avatarIcon || '🧗‍♂️',
            position: 0,
            visualPos: 0,
            isBot: preset.isBot,
            clearedMilestones: [], // MỖI MỐC CHỈ KÍCH HOẠT 1 LẦN DUY NHẤT CHO NGƯỜI NÀY
            stats: { correctAnswers: 0, totalRolls: 0 }
        });
    }

    usedQuestionIds.clear(); // Reset lịch sử câu hỏi cho ván mới
    gameState.players = players;
    gameState.currentRound = 1;
    gameState.phase = 'ROUND_START';
    gameState.winner = null;

    dom.setupModal.classList.add('hidden');
    dom.logContent.innerHTML = '';
    addGameLog(`🎉 <strong>Ván đấu Bách Khoa Đà Nẵng khởi tranh!</strong> Số người chơi: ${players.length}. Chinh phục đỉnh 50.`);

    startNewRound();
});

// ==========================================================================
// 7. Hàm shuffleTurns() - Tráo ngẫu nhiên thứ tự lượt mỗi vòng
// ==========================================================================
function shuffleTurns() {
    const ids = gameState.players.map(p => p.id);
    for (let i = ids.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    gameState.turnOrder = ids;
    gameState.currentTurnIndex = 0;
    return gameState.turnOrder;
}

function startNewRound() {
    dom.currentRoundDisplay.textContent = gameState.currentRound;

    shuffleTurns();
    renderTurnPills();
    updateProgressList();

    const orderNames = gameState.turnOrder
        .map(id => gameState.players.find(p => p.id === id).name)
        .join(' ➔ ');

    showBanner(`VÒNG ${gameState.currentRound}: ĐÃ TRÁO THỨ TỰ LƯỢT!`);
    addGameLog(`🔀 <strong>[ĐẦU VÒNG ${gameState.currentRound}]</strong> Thứ tự lượt mới: <strong>${orderNames}</strong>.`);

    setupCurrentTurn();
}

function renderTurnPills() {
    dom.turnOrderList.innerHTML = '';
    gameState.turnOrder.forEach((id, index) => {
        const player = gameState.players.find(p => p.id === id);
        const pill = document.createElement('div');
        pill.className = `turn-pill ${index === gameState.currentTurnIndex ? 'active' : ''}`;
        pill.style.setProperty('--pill-color', player.color);
        pill.innerHTML = `
            <div class="pill-dot"></div>
            <span>${player.name}${player.isBot ? ' 🤖' : ''}</span>
        `;
        dom.turnOrderList.appendChild(pill);
    });
}

function setupCurrentTurn() {
    if (gameState.phase === 'GAME_OVER') return;

    const activeId = gameState.turnOrder[gameState.currentTurnIndex];
    gameState.activePlayerId = activeId;
    const player = gameState.players.find(p => p.id === activeId);

    dom.activePlayerAvatar.style.backgroundColor = player.color;
    dom.activePlayerAvatar.style.boxShadow = `0 0 15px ${player.color}`;
    dom.activePlayerName.textContent = `${player.name}${player.isBot ? ' 🤖' : ''}`;
    dom.activePlayerPos.textContent = `${player.position} / ${BOARD_LENGTH}`;

    // Tìm mốc chưa hoàn thành tiếp theo
    const nextM = MILESTONES.find(m => m > player.position && !player.clearedMilestones.includes(m));
    dom.activePlayerNextMilestone.textContent = nextM ? `Mốc ${nextM}` : 'ĐỈNH 50';

    renderTurnPills();
    updateProgressList();

    gameState.phase = 'WAITING_ROLL';
    dom.btnRollDice.disabled = player.isBot;
    dom.btnRollDice.querySelector('.roll-text').textContent = player.isBot
        ? `${player.name.toUpperCase()} ĐANG TUNG...`
        : 'TUNG XÚC XẮC';

    if (player.isBot) {
        setTimeout(() => {
            if (gameState.phase === 'WAITING_ROLL' && gameState.activePlayerId === player.id) {
                rollDice();
            }
        }, 1100);
    }
}

function nextTurn() {
    if (gameState.phase === 'GAME_OVER') return;

    gameState.currentTurnIndex++;
    if (gameState.currentTurnIndex >= gameState.turnOrder.length) {
        gameState.currentRound++;
        startNewRound();
    } else {
        setupCurrentTurn();
    }
}

// ==========================================================================
// 8. Khối Lập Phương True 3D Cube & Hoạt Ảnh Tung Xúc Xắc 3D Sống Động
// ==========================================================================
const DICE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

/**
 * Toạ độ góc xoay cơ sở để từng mặt của khối hộp hướng thẳng về camera
 * - Mặt 1 (Front): rotateY(0deg)
 * - Mặt 2 (Right): rotateY(-90deg)
 * - Mặt 3 (Bottom): rotateX(90deg)
 * - Mặt 4 (Top): rotateX(-90deg)
 * - Mặt 5 (Left): rotateY(90deg)
 * - Mặt 6 (Back): rotateY(180deg)
 */
const BASE_FACE_ANGLES = {
    1: { x: 0,   y: 0 },
    2: { x: 0,   y: -90 },
    3: { x: 90,  y: 0 },
    4: { x: -90, y: 0 },
    5: { x: 0,   y: 90 },
    6: { x: 0,   y: 180 }
};

let currentCubeRotX = 0;
let currentCubeRotY = 0;
let currentCubeRotZ = 0;
let diceAnimationId = null;

function animate3DDiceRoll(diceResult, onComplete) {
    if (diceAnimationId) {
        cancelAnimationFrame(diceAnimationId);
        diceAnimationId = null;
    }

    AudioSFX.playRoll();

    const targetBase = BASE_FACE_ANGLES[diceResult];

    // Góc xuất phát
    const startX = currentCubeRotX;
    const startY = currentCubeRotY;
    const startZ = currentCubeRotZ;

    // Số vòng xoay nhào lộn trên không (X: 4 vòng 1440deg, Y: 3 vòng 1080deg, Z: 2 vòng 720deg)
    const turnsX = 4 * 360;
    const turnsY = 3 * 360;
    const turnsZ = 2 * 360;

    // Góc đích khớp chính xác với mặt xúc xắc trúng, luôn tiến về phía trước
    const targetX = Math.ceil((startX + turnsX) / 360) * 360 + targetBase.x;
    const targetY = Math.ceil((startY + turnsY) / 360) * 360 + targetBase.y;
    const targetZ = Math.ceil((startZ + turnsZ) / 360) * 360;

    const duration = 1350; // 1.35 giây nhào lộn và nảy tiếp đất
    const startTime = performance.now();
    let hasPlayedImpact1 = false;
    let hasPlayedImpact2 = false;

    if (dom.diceCube) dom.diceCube.style.transition = 'none';
    if (dom.diceBouncer) dom.diceBouncer.style.transition = 'none';

    function renderFrame(now) {
        const elapsed = now - startTime;
        const p = Math.min(1, elapsed / duration);

        // Hàm giảm tốc mượt mà Quartic Ease Out
        const ease = 1 - Math.pow(1 - p, 4);

        // Góc xoay hiện tại tại frame này (quay đồng thời cả 3 trục X, Y, Z tạo khối 3D nhào lộn chân thực)
        const curX = startX + (targetX - startX) * ease;
        const curY = startY + (targetY - startY) * ease;
        const curZ = startZ + (targetZ - startZ) * ease;

        // Quỹ đạo nảy tiếp đất của bouncer (Y position)
        let posY = 0;
        if (p < 0.60) {
            // Giai đoạn 1: Tung bổng lên không trung (-110px) rồi rơi nhanh xuống đất
            const t1 = p / 0.60;
            posY = -110 * Math.sin(Math.PI * t1);
        } else if (p < 0.85) {
            // Giai đoạn 2: Nảy nấc 1 (-32px)
            const t2 = (p - 0.60) / 0.25;
            posY = -32 * Math.sin(Math.PI * t2);
            if (!hasPlayedImpact1) {
                hasPlayedImpact1 = true;
                AudioSFX.playDiceImpact();
            }
        } else {
            // Giai đoạn 3: Nảy nhẹ nấc 2 (-8px) rồi tiếp đất êm ái
            const t3 = (p - 0.85) / 0.15;
            posY = -8 * Math.sin(Math.PI * t3);
            if (!hasPlayedImpact2) {
                hasPlayedImpact2 = true;
                AudioSFX.playDiceImpact();
            }
        }

        // Cập nhật góc nhào lộn của khối lập phương 3D
        if (dom.diceCube) {
            dom.diceCube.style.transform = `rotateX(${curX.toFixed(2)}deg) rotateY(${curY.toFixed(2)}deg) rotateZ(${curZ.toFixed(2)}deg)`;
        }

        // Cập nhật vị trí nảy tung bổng của bouncer
        if (dom.diceBouncer) {
            dom.diceBouncer.style.transform = `translateY(${posY.toFixed(2)}px)`;
        }

        // Cập nhật bóng tiếp đất tương ứng với độ cao
        if (dom.diceGroundShadow) {
            const heightFactor = Math.min(1, Math.abs(posY) / 110);
            const shadowScale = (1 + heightFactor * 0.45).toFixed(2);
            const shadowOpacity = Math.max(0.2, 0.75 - heightFactor * 0.45).toFixed(2);
            const shadowBlur = (3 + heightFactor * 10).toFixed(1);
            dom.diceGroundShadow.style.transform = `translateX(-50%) scale(${shadowScale})`;
            dom.diceGroundShadow.style.opacity = shadowOpacity;
            dom.diceGroundShadow.style.filter = `blur(${shadowBlur}px)`;
        }

        if (p < 1) {
            diceAnimationId = requestAnimationFrame(renderFrame);
        } else {
            // Kết thúc hoạt ảnh
            currentCubeRotX = targetX;
            currentCubeRotY = targetY;
            currentCubeRotZ = 0;
            diceAnimationId = null;

            if (dom.diceBouncer) {
                dom.diceBouncer.style.transform = 'translateY(0px)';
            }
            if (dom.diceGroundShadow) {
                dom.diceGroundShadow.style.transform = 'translateX(-50%) scale(1)';
                dom.diceGroundShadow.style.opacity = '0.8';
                dom.diceGroundShadow.style.filter = 'blur(3px)';
            }

            // Hiệu ứng scale bounce nhẹ khi dừng hẳn
            if (dom.diceCube) {
                dom.diceCube.style.transition = 'transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)';
                dom.diceCube.style.transform = `rotateX(${targetX}deg) rotateY(${targetY}deg) rotateZ(0deg) scale(1.06)`;
                setTimeout(() => {
                    if (dom.diceCube) {
                        dom.diceCube.style.transform = `rotateX(${targetX}deg) rotateY(${targetY}deg) rotateZ(0deg) scale(1)`;
                    }
                }, 140);
            }

            setTimeout(onComplete, 220);
        }
    }

    diceAnimationId = requestAnimationFrame(renderFrame);
}

function rollDice() {
    if (gameState.phase !== 'WAITING_ROLL' || gameState.isAnimatingMove) return;

    initAudio();
    gameState.phase = 'MOVING';
    dom.btnRollDice.disabled = true;

    const player = gameState.players.find(p => p.id === gameState.activePlayerId);

    // 1. Cấu hình thông tin người chơi trên Overlay
    if (dom.dicePlayerDot) {
        dom.dicePlayerDot.style.backgroundColor = player.color;
        dom.dicePlayerDot.style.boxShadow = `0 0 10px ${player.color}`;
    }
    if (dom.dicePlayerName) {
        dom.dicePlayerName.textContent = player.name + (player.isBot ? ' 🤖' : '');
    }
    if (dom.diceActionTitle) {
        dom.diceActionTitle.textContent = `${player.name} đang tung xúc xắc 3D...`;
    }
    if (dom.diceOutcomeBadge) {
        dom.diceOutcomeBadge.classList.add('hidden');
    }

    // 2. Mở Overlay làm mờ nhẹ màn hình
    dom.diceOverlay.classList.remove('hidden');

    // 3. Quyết định kết quả ngẫu nhiên (1 đến 6)
    const diceResult = Math.floor(Math.random() * 6) + 1;
    gameState.lastDiceRoll = diceResult;

    // 4. Khởi chạy hoạt ảnh tung xúc xắc 3D nhào lộn & nảy tiếp đất
    animate3DDiceRoll(diceResult, () => {
        AudioSFX.playCorrect();

        if (dom.diceActionTitle) {
            dom.diceActionTitle.textContent = `${player.name} tung được ${diceResult} chấm!`;
        }
        if (dom.diceOutcomeText) {
            dom.diceOutcomeText.textContent = `+${diceResult} BƯỚC`;
        }
        if (dom.diceOutcomeBadge) {
            dom.diceOutcomeBadge.classList.remove('hidden');
        }

        // 5. Giữ nguyên trên màn hình đúng 0.8 giây để người chơi nhìn rõ số chấm
        setTimeout(() => {
            dom.diceOverlay.style.transition = 'opacity 0.22s ease';
            dom.diceOverlay.style.opacity = '0';

            setTimeout(() => {
                dom.diceOverlay.classList.add('hidden');
                dom.diceOverlay.style.opacity = '';

                // Bắt đầu di chuyển quân cờ trên bản đồ
                processPlayerMove(diceResult);
            }, 220);
        }, 800);
    });
}

dom.btnRollDice.addEventListener('click', rollDice);

function processPlayerMove(steps) {
    const player = gameState.players.find(p => p.id === gameState.activePlayerId);
    player.stats.totalRolls++;

    const initialPos = player.position;
    let targetPos = Math.min(BOARD_LENGTH, initialPos + steps);

    // KIỂM TRA MỐC: Chỉ kích hoạt nếu người chơi CHƯA TỪNG hoàn thành mốc này
    let hitMilestone = null;
    for (const m of MILESTONES) {
        if (!player.clearedMilestones.includes(m) && initialPos < m && targetPos >= m) {
            hitMilestone = m;
            targetPos = m; // Bị chặn dừng chân ngay tại ô mốc để trả lời câu hỏi
            break;
        }
    }

    addGameLog(
        `🎲 <strong>[Lượt của ${player.name}]</strong> ` +
        `Tung ra <strong>${steps} chấm (${DICE_FACES[steps - 1]})</strong>. ` +
        `Di chuyển từ ô ${initialPos} ➔ Đang đứng ở <strong>ô số ${targetPos}</strong>.`
    );

    animateStepMovement(player, targetPos, () => {
        player.position = targetPos;
        dom.activePlayerPos.textContent = `${player.position} / ${BOARD_LENGTH}`;
        updateProgressList();

        // 1. Kiểm tra Mốc thử thách trắc nghiệm
        if (hitMilestone !== null) {
            triggerMilestoneQuiz(player, hitMilestone);
            return;
        }

        // 2. Kiểm tra Điều kiện thắng (position >= 50)
        if (player.position >= BOARD_LENGTH) {
            triggerVictory(player);
            return;
        }

        // 3. Chuyển lượt sau 0.5s
        setTimeout(nextTurn, 500);
    });
}

function animateStepMovement(player, targetPos, onComplete) {
    gameState.isAnimatingMove = true;

    const stepInterval = setInterval(() => {
        if (player.visualPos < targetPos) {
            player.visualPos++;
            AudioSFX.playStep();
        } else if (player.visualPos > targetPos) {
            player.visualPos--;
            AudioSFX.playStep();
        } else {
            clearInterval(stepInterval);
            gameState.isAnimatingMove = false;
            onComplete();
        }
    }, 180);
}

function addGameLog(htmlMessage) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = htmlMessage;
    dom.logContent.appendChild(entry);
    dom.logContent.scrollTop = dom.logContent.scrollHeight;
}

// ==========================================================================
// 9. MODAL CÂU HỎI TRẮC NGHIỆM (DUT Quiz Modal)
// - Mỗi mốc kích hoạt 1 lần duy nhất cho mỗi người chơi
// - Không bao giờ trùng lặp câu hỏi đã ra trước đó
// ==========================================================================
let currentActiveQuiz = null;

function triggerMilestoneQuiz(player, milestone) {
    gameState.phase = 'MILESTONE_QUIZ';
    AudioSFX.playMilestoneAlert();

    // Đánh dấu mốc này đã kích hoạt cho người chơi hiện tại
    if (!player.clearedMilestones.includes(milestone)) {
        player.clearedMilestones.push(milestone);
    }

    // Chọn ngẫu nhiên câu hỏi CHƯA TỪNG XUẤT HIỆN
    let availableQuestions = QUIZ_QUESTIONS.filter(q => !usedQuestionIds.has(q.id));
    if (availableQuestions.length === 0) {
        // Nếu đã dùng hết toàn bộ 20 câu thì làm mới kho
        usedQuestionIds.clear();
        availableQuestions = QUIZ_QUESTIONS;
    }

    currentActiveQuiz = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    usedQuestionIds.add(currentActiveQuiz.id); // Đánh dấu đã dùng

    showBanner(`TRẠM GÁC MỐC ${milestone}!`);
    addGameLog(`🚩 <strong>[MỐC ${milestone}]</strong> ${player.name} chạm trạm kiểm soát! Câu hỏi DUT #${currentActiveQuiz.id} được kích hoạt.`);

    dom.quizMilestoneBadge.textContent = `TRẠM GÁC MỐC ${milestone} • ĐH BÁCH KHOA ĐÀ NẴNG (DUT)`;
    dom.quizQuestionText.textContent = currentActiveQuiz.question;
    dom.quizOptionsGrid.innerHTML = '';

    const letters = ['A', 'B', 'C', 'D'];
    currentActiveQuiz.options.forEach((optText, idx) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option-btn';
        btn.innerHTML = `
            <span class="option-prefix">${letters[idx]}</span>
            <span>${optText}</span>
        `;
        btn.addEventListener('click', () => handleQuizAnswer(player, milestone, idx));
        dom.quizOptionsGrid.appendChild(btn);
    });

    dom.quizModal.classList.remove('hidden');

    // Bộ đếm thời gian 15s
    gameState.quizTimeLeft = 15;
    dom.quizTimerText.textContent = '15s';
    dom.quizProgressBar.style.width = '100%';

    clearInterval(gameState.quizTimerInterval);
    const totalTime = 15;
    gameState.quizTimerInterval = setInterval(() => {
        gameState.quizTimeLeft -= 0.1;
        const percent = Math.max(0, (gameState.quizTimeLeft / totalTime) * 100);
        dom.quizProgressBar.style.width = `${percent}%`;
        dom.quizTimerText.textContent = `${Math.ceil(gameState.quizTimeLeft)}s`;

        if (gameState.quizTimeLeft <= 0) {
            clearInterval(gameState.quizTimerInterval);
            handleQuizAnswer(player, milestone, -1); // Hết giờ = Sai
        }
    }, 100);

    // Bot AI trả lời tự động sau 2s
    if (player.isBot) {
        dom.quizOptionsGrid.querySelectorAll('.quiz-option-btn').forEach(b => b.disabled = true);
        setTimeout(() => {
            if (gameState.phase === 'MILESTONE_QUIZ') {
                const willBeCorrect = Math.random() < 0.8;
                const botChoice = willBeCorrect
                    ? currentActiveQuiz.correctIndex
                    : (currentActiveQuiz.correctIndex + 1) % 4;
                handleQuizAnswer(player, milestone, botChoice);
            }
        }, 2000);
    }
}

function handleQuizAnswer(player, milestone, chosenIndex) {
    clearInterval(gameState.quizTimerInterval);
    const isCorrect = (chosenIndex === currentActiveQuiz.correctIndex);

    const buttons = dom.quizOptionsGrid.querySelectorAll('.quiz-option-btn');
    buttons.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === currentActiveQuiz.correctIndex) {
            btn.classList.add('correct');
        } else if (idx === chosenIndex && !isCorrect) {
            btn.classList.add('wrong');
        }
    });

    if (isCorrect) {
        AudioSFX.playCorrect();
        player.stats.correctAnswers++;
        addGameLog(`✅ <strong>[Kết quả Mốc ${milestone}]</strong> ${player.name} trả lời <strong style="color:var(--color-success)">ĐÚNG</strong>! ➔ <em>Giữ nguyên vị trí ở ô ${milestone} & Chuyển lượt</em>.`);
        showBanner(`CHÍNH XÁC! GIỮ VỊ TRÍ.`);
    } else {
        AudioSFX.playWrong();
        const penaltyPos = Math.max(0, milestone - 5);
        addGameLog(`❌ <strong>[Kết quả Mốc ${milestone}]</strong> ${player.name} trả lời <strong style="color:var(--color-danger)">SAI</strong>! ➔ <em>Bị phạt lùi 5 bước (về ô ${penaltyPos}) & Chuyển lượt</em>.`);
        showBanner(`SAI RỒI! BỊ PHẠT LÙI 5 BƯỚC.`);
    }

    setTimeout(() => {
        dom.quizModal.classList.add('hidden');

        if (isCorrect) {
            // Đúng: Giữ nguyên vị trí tại mốc và chuyển lượt
            nextTurn();
        } else {
            // Sai: Lùi lại 5 bước và chuyển lượt
            const penaltyTarget = Math.max(0, milestone - 5);
            animateStepMovement(player, penaltyTarget, () => {
                player.position = penaltyTarget;
                dom.activePlayerPos.textContent = `${player.position} / ${BOARD_LENGTH}`;
                updateProgressList();
                setTimeout(nextTurn, 500);
            });
        }
    }, 1600);
}

// ==========================================================================
// 10. Điều Kiện Thắng (position >= 50)
// ==========================================================================
let confettiParticles = [];

function triggerVictory(player) {
    gameState.phase = 'GAME_OVER';
    gameState.winner = player;
    AudioSFX.playVictory();

    addGameLog(`🏆🎉 <strong>[CHIẾN THẮNG CHUNG CUỘC]</strong> Chúc mừng <strong>${player.name}</strong> đã chạm đỉnh 50 đầu tiên và trở thành Nhà Vô Địch Bách Khoa!`);
    showBanner(`CHIẾN THẮNG: ${player.name.toUpperCase()}!`);

    initConfetti();

    dom.winnerSubtitle.innerHTML = `<strong>${player.name}</strong> đã xuất sắc trả lời các câu hỏi về ĐH Bách khoa Đà Nẵng và chạm đỉnh 50 đầu tiên!`;
    dom.victoryStatsContainer.innerHTML = `
        <div>Vòng đấu hoàn thành: <strong>${gameState.currentRound}</strong></div>
        <div>Tổng số lần đổ xúc xắc: <strong>${player.stats.totalRolls}</strong></div>
        <div>Câu trắc nghiệm trả lời đúng: <strong>${player.stats.correctAnswers}</strong></div>
        <div>Vị trí chung cuộc: <strong>${player.position} / 50</strong></div>
    `;

    setTimeout(() => {
        dom.victoryModal.classList.remove('hidden');
    }, 1200);
}

dom.btnPlayAgain.addEventListener('click', () => {
    gameState.phase = 'SETUP';
    fireworksRockets = [];
    fireworksSparks = [];
    dom.victoryModal.classList.add('hidden');
    dom.setupModal.classList.remove('hidden');
});

// ==========================================================================
// 11. UI Phụ Trợ, Banner, Phím Tắt
// ==========================================================================
function updateProgressList() {
    dom.playerProgressList.innerHTML = '';
    const sorted = [...gameState.players].sort((a, b) => b.position - a.position);

    sorted.forEach((p, rank) => {
        const percent = Math.min(100, (p.position / BOARD_LENGTH) * 100);
        const card = document.createElement('div');
        card.className = `progress-card ${p.id === gameState.activePlayerId ? 'active-player' : ''}`;
        card.innerHTML = `
            <div class="progress-header">
                <span style="color: ${p.color};">#${rank + 1} ${p.name}${p.isBot ? ' 🤖' : ''}</span>
                <span>Ô ${p.position} / 50</span>
            </div>
            <div class="progress-track">
                <div class="progress-fill" style="width: ${percent}%; background-color: ${p.color};"></div>
            </div>
        `;
        dom.playerProgressList.appendChild(card);
    });
}

function showBanner(text) {
    dom.bannerText.textContent = text;
    dom.gameBanner.classList.remove('hidden');
    setTimeout(() => {
        dom.gameBanner.classList.add('hidden');
    }, 2400);
}

dom.btnSound.addEventListener('click', () => {
    initAudio();
    soundEnabled = !soundEnabled;
    dom.soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
    dom.btnSound.title = soundEnabled ? 'Tắt âm thanh (M)' : 'Bật âm thanh (M)';
});

window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyM') dom.btnSound.click();

    if (e.code === 'Space') {
        if (gameState.phase === 'WAITING_ROLL' && !dom.btnRollDice.disabled) {
            rollDice();
        }
    }

    // Phím tắt trả lời trắc nghiệm: 1, 2, 3, 4 hoặc A, B, C, D
    if (gameState.phase === 'MILESTONE_QUIZ') {
        const optionButtons = dom.quizOptionsGrid.querySelectorAll('.quiz-option-btn');
        let selectedIdx = -1;
        if (e.code === 'Digit1' || e.code === 'KeyA') selectedIdx = 0;
        else if (e.code === 'Digit2' || e.code === 'KeyB') selectedIdx = 1;
        else if (e.code === 'Digit3' || e.code === 'KeyC') selectedIdx = 2;
        else if (e.code === 'Digit4' || e.code === 'KeyD') selectedIdx = 3;

        if (selectedIdx !== -1 && optionButtons[selectedIdx] && !optionButtons[selectedIdx].disabled) {
            optionButtons[selectedIdx].click();
        }
    }
});

dom.btnRules.addEventListener('click', () => dom.rulesModal.classList.remove('hidden'));
dom.btnCloseRules.addEventListener('click', () => dom.rulesModal.classList.add('hidden'));

dom.btnRestart.addEventListener('click', () => {
    if (confirm('Bạn có chắc muốn làm mới ván đấu và quay về phòng chờ?')) {
        gameState.phase = 'SETUP';
        fireworksRockets = [];
        fireworksSparks = [];
        dom.setupModal.classList.remove('hidden');
        dom.victoryModal.classList.add('hidden');
        dom.quizModal.classList.add('hidden');
        dom.diceOverlay.classList.add('hidden');
    }
});

// ==========================================================================
// 12. Hệ Thống Đồ Hoạ Thiên Nhiên Sơn Trà: Mây Trắng, Đàn Chim, Núi Xanh & Pháo Hoa
// ==========================================================================
let fireworksRockets = [];
let fireworksSparks = [];
let lastRocketSpawn = 0;

// Hệ thống Đám mây trắng bồng bềnh
const clouds = [
    { x: 30, y: 35, speed: 0.22, scale: 1.1, opacity: 0.88 },
    { x: 260, y: 65, speed: 0.32, scale: 0.85, opacity: 0.82 },
    { x: 520, y: 28, speed: 0.18, scale: 1.3, opacity: 0.9 },
    { x: 740, y: 60, speed: 0.28, scale: 0.95, opacity: 0.85 }
];

function drawFluffyCloud(ctx, x, y, scale, opacity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.arc(16, -8, 22, 0, Math.PI * 2);
    ctx.arc(38, -5, 18, 0, Math.PI * 2);
    ctx.arc(52, 4, 15, 0, Math.PI * 2);
    ctx.arc(26, 6, 18, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

// Hệ thống Đàn chim hải âu chao lượn trên bầu trời Sơn Trà
const birds = [
    { x: 80, y: 55, speed: 1.05, scale: 0.75, phase: 0 },
    { x: 105, y: 68, speed: 1.05, scale: 0.65, phase: 0.7 },
    { x: 130, y: 58, speed: 1.1, scale: 0.7, phase: 1.4 },
    { x: 360, y: 38, speed: 0.9, scale: 0.85, phase: 2.1 },
    { x: 390, y: 48, speed: 0.9, scale: 0.7, phase: 2.8 },
    { x: 670, y: 80, speed: 1.2, scale: 0.8, phase: 0.5 },
    { x: 700, y: 92, speed: 1.15, scale: 0.65, phase: 1.2 }
];

function drawBird(ctx, x, y, scale, wingOffset) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.strokeStyle = '#102a43';
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    // Cánh trái vỗ
    ctx.moveTo(-13, wingOffset);
    ctx.quadraticCurveTo(-6, -wingOffset * 1.6, 0, 0);
    // Cánh phải vỗ
    ctx.quadraticCurveTo(6, -wingOffset * 1.6, 13, wingOffset);
    ctx.stroke();
    ctx.restore();
}

function spawnFireworkRocket() {
    const colors = ['#ffd166', '#ef476f', '#06d6a0', '#00f0ff', '#f72585', '#a06cd5', '#ffffff'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const startX = 120 + Math.random() * (CANVAS_WIDTH - 240);
    const targetY = 70 + Math.random() * 180;

    fireworksRockets.push({
        x: startX,
        y: CANVAS_HEIGHT + 10,
        vx: (Math.random() - 0.5) * 2,
        vy: -9 - Math.random() * 4,
        targetY: targetY,
        color: color
    });
}

function explodeRocket(x, y, color) {
    const count = 55 + Math.floor(Math.random() * 30);
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.2 + Math.random() * 6.5;
        fireworksSparks.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1.0,
            decay: 0.012 + Math.random() * 0.018,
            gravity: 0.12,
            size: 2.5 + Math.random() * 3.5,
            color: color
        });
    }
}

function initConfetti() {
    fireworksRockets = [];
    fireworksSparks = [];
    for (let i = 0; i < 4; i++) {
        setTimeout(spawnFireworkRocket, i * 250);
    }
}

// ==========================================================================
// 12. Render Bàn Cờ Đèo Núi Sơn Trà & Hiệu Ứng Pháo Hoa Đỉnh Bàn Cờ
// ==========================================================================
function drawBoard() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 1. Hoạt Ảnh Thiên Nhiên Sơn Trà: Mây Trắng & Đàn Chim Hải Âu Chao Lượn
    // Đám mây trắng trôi bồng bềnh trên bầu trời
    clouds.forEach(c => {
        c.x += c.speed;
        if (c.x > CANVAS_WIDTH + 60) c.x = -80;
        drawFluffyCloud(ctx, c.x, c.y, c.scale, c.opacity);
    });

    // Đàn chim hải âu chao lượn trên bầu trời xanh
    const time = performance.now() * 0.005;
    birds.forEach(b => {
        b.x += b.speed;
        if (b.x > CANVAS_WIDTH + 50) b.x = -50;
        const wing = Math.sin(time * 3 + b.phase) * 6;
        drawBird(ctx, b.x, b.y, b.scale, wing);
    });

    // 2. Vẽ 5 Tầng Đèo Núi Sơn Trà (Mỗi tầng 10 ô) với nền tương phản cao
    SONTRA_TIERS.forEach(t => {
        ctx.save();
        // Thanh nền bán trong suốt bảo đảm chữ luôn đọc rõ ràng trên nền đồi xanh
        ctx.fillStyle = 'rgba(4, 18, 36, 0.45)';
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(40, t.y - 28, 410, 22, 6);
        else ctx.rect(40, t.y - 28, 410, 22);
        ctx.fill();

        ctx.fillStyle = '#ffd166';
        ctx.font = 'bold 10px "Bungee", sans-serif';
        ctx.textAlign = 'left';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 4;
        ctx.fillText(t.name, 48, t.y - 13);
        ctx.restore();
    });

    // 3. Đường Đèo Ziczac Cầu Thang Lên Tầng (Tương phản cao trên đồi núi xanh)
    ctx.save();
    // Lớp viền tối đậm tạo khối tương phản nổi bật trên nền đồi xanh
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(4, 18, 34, 0.85)';
    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (let i = 0; i < TILE_COORDINATES.length; i++) {
        const pt = TILE_COORDINATES[i];
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
    }
    ctx.stroke();

    // Mặt đường lát đá sáng màu
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = 11;
    for (let i = 0; i < TILE_COORDINATES.length; i++) {
        const pt = TILE_COORDINATES[i];
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
    }
    ctx.stroke();

    // Vạch tim đường đứt đoạn màu vàng kim nổi bật
    ctx.beginPath();
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([8, 8]);
    for (let i = 0; i < TILE_COORDINATES.length; i++) {
        const pt = TILE_COORDINATES[i];
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // 4. Vẽ Từng Ô Trên Bàn Cờ (Màu sắc riêng biệt cho Mốc 10, 20, 30, 40 và Đỉnh 50)
    for (let i = 0; i < TILE_COORDINATES.length; i++) {
        const pt = TILE_COORDINATES[i];
        const isMilestone = MILESTONES.includes(i);
        const isStart = (i === 0);
        const isSummit = (i === BOARD_LENGTH);
        const mTheme = MILESTONE_THEMES[i];

        ctx.save();
        ctx.translate(pt.x, pt.y);

        if (isSummit) {
            // Ô 50: ĐỈNH BÀN CỜ TIÊN ÔNG HOÀNG KIM
            const sTheme = MILESTONE_THEMES[50];
            ctx.shadowBlur = 25;
            ctx.shadowColor = 'rgba(255, 209, 102, 0.9)';

            const sunburst = ctx.createRadialGradient(0, 0, 8, 0, 0, sTheme.radius);
            sunburst.addColorStop(0, '#ffffff');
            sunburst.addColorStop(0.4, '#ffd166');
            sunburst.addColorStop(1, '#ff9f1c');
            ctx.fillStyle = sunburst;
            ctx.beginPath();
            ctx.arc(0, 0, sTheme.radius, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = '#041224';
            ctx.lineWidth = 3.5;
            ctx.stroke();

            // Vương miện hoàng kim
            ctx.fillStyle = '#121624';
            ctx.font = '22px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('👑', 0, -3);

            ctx.font = 'bold 11px "Bungee", sans-serif';
            ctx.fillText('50', 0, 18);

            // Bảng tên ĐỈNH BÀN CỜ nền tối chống loá trên nền đồi xanh
            ctx.fillStyle = 'rgba(4, 18, 36, 0.92)';
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(-46, -48, 92, 19, 8);
            else ctx.rect(-46, -48, 92, 19);
            ctx.fill();
            ctx.strokeStyle = '#ffd166';
            ctx.lineWidth = 1.4;
            ctx.stroke();

            ctx.font = 'bold 8.5px "Be Vietnam Pro", sans-serif';
            ctx.fillStyle = '#ffd166';
            ctx.fillText('ĐỈNH BÀN CỜ', 0, -39);

        } else if (isMilestone) {
            // MỐC 10, 20, 30, 40: MÀU RIÊNG BIỆT NỔI BẬT TƯƠNG PHẢN CAO
            ctx.shadowBlur = 18;
            ctx.shadowColor = mTheme.color;
            ctx.fillStyle = '#071526';
            ctx.strokeStyle = mTheme.color;
            ctx.lineWidth = 3.5;

            ctx.beginPath();
            ctx.arc(0, 0, mTheme.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = mTheme.color;
            ctx.beginPath();
            ctx.arc(0, 0, 10, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 11px "Bungee", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowBlur = 4;
            ctx.shadowColor = '#000000';
            ctx.fillText(String(i), 0, 0);

            ctx.font = '12px sans-serif';
            ctx.fillText(mTheme.icon, 0, -25);

            // Thẻ badge tên mốc nền tối chống loá
            ctx.fillStyle = 'rgba(4, 18, 36, 0.92)';
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(-42, 18, 84, 18, 8);
            else ctx.rect(-42, 18, 84, 18);
            ctx.fill();
            ctx.strokeStyle = mTheme.color;
            ctx.lineWidth = 1.2;
            ctx.stroke();

            ctx.font = 'bold 8px "Be Vietnam Pro", sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(mTheme.badge, 0, 27);

        } else if (isStart) {
            // Ô 0: Vạch Xuất Phát Chân Núi
            ctx.shadowBlur = 16;
            ctx.shadowColor = '#10b981';
            ctx.fillStyle = '#10b981';
            ctx.beginPath();
            ctx.arc(0, 0, 18, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2.5;
            ctx.stroke();

            ctx.fillStyle = '#041224';
            ctx.font = 'bold 10px "Bungee", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('START', 0, 0);

        } else {
            // Ô Thường: Nền xanh đen sâu, viền trắng sắc nét, chữ trắng tương phản cao
            ctx.shadowBlur = 6;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
            ctx.fillStyle = (i % 2 === 0) ? '#08172c' : '#0c223f';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;

            ctx.beginPath();
            ctx.arc(0, 0, 14, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 10px "Be Vietnam Pro", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowBlur = 3;
            ctx.shadowColor = '#000000';
            ctx.fillText(String(i), 0, 0.5);
        }

        ctx.restore();
    }

    // 5. Vẽ Quân Cờ / Avatar Từng Người Chơi (Hiệu Ứng Nhảy Tưng Tưng Mượt Mà)
    if (gameState.players.length > 0) {
        const tileOccupants = {};
        gameState.players.forEach(p => {
            const posFloor = Math.round(p.visualPos);
            if (!tileOccupants[posFloor]) tileOccupants[posFloor] = [];
            tileOccupants[posFloor].push(p);
        });

        gameState.players.forEach(p => {
            const currentTileIdx = Math.min(BOARD_LENGTH, Math.max(0, Math.round(p.visualPos)));
            const baseCoord = TILE_COORDINATES[currentTileIdx] || TILE_COORDINATES[0];

            const occupants = tileOccupants[currentTileIdx] || [p];
            const occupantIdx = occupants.indexOf(p);
            const totalOnTile = occupants.length;

            // Độ giãn toạ độ khi nhiều người cùng đứng 1 ô
            let offsetX = 0;
            let offsetY = 0;
            if (totalOnTile > 1) {
                const angle = (occupantIdx / totalOnTile) * Math.PI * 2;
                offsetX = Math.cos(angle) * 14;
                offsetY = Math.sin(angle) * 14;
            }

            // Hoạt ảnh nhảy nảy (Hop Parabola) khi đang bước đi
            const hopHeight = Math.abs(Math.sin((p.visualPos % 1) * Math.PI)) * 16;
            const tokenX = baseCoord.x + offsetX;
            const tokenY = baseCoord.y + offsetY - hopHeight;

            // 5.1 Bóng đổ dưới đất
            ctx.save();
            ctx.translate(baseCoord.x + offsetX, baseCoord.y + offsetY + 7);
            ctx.scale(Math.max(0.4, 1 - hopHeight / 24), 0.35);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
            ctx.beginPath();
            ctx.arc(0, 0, 13, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // 5.2 Thân quân cờ Avatar 3D
            ctx.save();
            ctx.translate(tokenX, tokenY);

            ctx.shadowBlur = 18;
            ctx.shadowColor = p.color;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(0, 0, 15, 0, Math.PI * 2);
            ctx.fill();

            const grad = ctx.createLinearGradient(-12, -12, 12, 12);
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(0.3, p.color);
            grad.addColorStop(1, '#090e1a');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(0, 0, 13, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2.4;
            ctx.stroke();

            // Avatar Icon riêng biệt (🧗‍♂️, 🧙‍♂️, 🏹, 👑)
            ctx.font = '14px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(p.avatarIcon || '🧗‍♂️', 0, 0);

            // Thẻ tên người chơi với nền tối chống chìm màu
            const shortName = p.name.split(' ').pop();
            ctx.font = 'bold 9px "Be Vietnam Pro", sans-serif';
            const nameWidth = ctx.measureText(shortName).width;

            ctx.fillStyle = 'rgba(4, 18, 36, 0.88)';
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(-nameWidth / 2 - 5, 13, nameWidth + 10, 14, 4);
            else ctx.rect(-nameWidth / 2 - 5, 13, nameWidth + 10, 14);
            ctx.fill();
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 4;
            ctx.shadowColor = '#000000';
            ctx.fillText(shortName, 0, 20);

            ctx.restore();
        });
    }

    // 6. Hiệu Ứng Pháo Hoa Rực Rỡ Khi Có Người Lên Đỉnh 50 (GAME OVER)
    if (gameState.phase === 'GAME_OVER') {
        const now = performance.now();
        if (now - lastRocketSpawn > 650) {
            spawnFireworkRocket();
            lastRocketSpawn = now;
        }

        // Tên Lửa Pháo Hoa (Rockets)
        for (let i = fireworksRockets.length - 1; i >= 0; i--) {
            const r = fireworksRockets[i];
            r.x += r.vx;
            r.y += r.vy;

            ctx.save();
            ctx.fillStyle = r.color;
            ctx.shadowBlur = 12;
            ctx.shadowColor = r.color;
            ctx.beginPath();
            ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            if (r.y <= r.targetY || r.vy >= 0) {
                explodeRocket(r.x, r.y, r.color);
                fireworksRockets.splice(i, 1);
            }
        }

        // Tia Sáng Pháo Hoa (Sparks)
        for (let i = fireworksSparks.length - 1; i >= 0; i--) {
            const sp = fireworksSparks[i];
            sp.x += sp.vx;
            sp.y += sp.vy;
            sp.vy += sp.gravity;
            sp.vx *= 0.98;
            sp.alpha -= sp.decay;

            if (sp.alpha <= 0) {
                fireworksSparks.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.globalAlpha = Math.max(0, sp.alpha);
            ctx.fillStyle = sp.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = sp.color;
            ctx.beginPath();
            ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    requestAnimationFrame(drawBoard);
}

// ==========================================================================
// 13. Khởi Chạy Ban Đầu
// ==========================================================================
function initGame() {
    renderSetupInputs(currentSelectedCount);
    if (dom.diceCube) {
        dom.diceCube.style.transform = 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)';
    }
    requestAnimationFrame(drawBoard);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}
