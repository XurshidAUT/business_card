// ===== Данные контакта (vCard 3.0) =====
// Поля задаются на странице через window.CARD; ниже — запасные значения.
const CARD = window.CARD || {
    family: "Boymirzayev",
    given:  "Islomjon",
    fn:     "Islomjon Boymirzayev",
    org:    "Bizning Gosht",
    title:  "Founder & CEO",
    tel:    "+998946666664",
    email:  "ceo@bizninggosht.uz",
    url:    "https://t.me/MBimporteRs",
    file:   "Islomjon_Boymirzayev.vcf",
};

const VCARD = (() => {
    const lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${CARD.family};${CARD.given};;;`,
        `FN:${CARD.fn}`,
        `ORG:${CARD.org}`,
        `TITLE:${CARD.title}`,
        `TEL;TYPE=CELL:${CARD.tel}`,
        `EMAIL;TYPE=INTERNET:${CARD.email}`,
        `URL:${CARD.url}`,
    ];
    if (Array.isArray(CARD.extra)) lines.push(...CARD.extra);
    lines.push("END:VCARD");
    return lines.join("\r\n") + "\r\n";
})();

// ===== Переводы интерфейса (RU / EN / 中文) =====
const I18N = {
    ru: {
        flipFront: "Нажмите, чтобы открыть контакты",
        contacts:  "Контакты",
        lblPhone:  "Телефон",
        lblEmail:  "Email",
        lblTelegram: "Telegram",
        lblWebsite: "Сайт",
        addr:      "Ташкент · Ойбек 50/54 · Пн–Сб 9:00–22:00",
        qrCap:     "Наведите камеру — контакт сохранится сам",
        save:      "Сохранить контакт",
        saved:     "Контакт сохранён",
        back:      "Назад",
    },
    en: {
        flipFront: "Tap to open contacts",
        contacts:  "Contacts",
        lblPhone:  "Phone",
        lblEmail:  "Email",
        lblTelegram: "Telegram",
        lblWebsite: "Website",
        addr:      "Tashkent · Oybek 50/54 · Mon–Sat 9:00–22:00",
        qrCap:     "Point your camera — the contact saves itself",
        save:      "Save contact",
        saved:     "Contact saved",
        back:      "Back",
    },
    zh: {
        flipFront: "点击查看联系方式",
        contacts:  "联系方式",
        lblPhone:  "电话",
        lblEmail:  "邮箱",
        lblTelegram: "Telegram",
        lblWebsite: "网站",
        addr:      "塔什干 · Oybek 50/54 · 周一至周六 9:00–22:00",
        qrCap:     "用相机扫一扫，自动保存联系人",
        save:      "保存联系人",
        saved:     "已保存联系人",
        back:      "返回",
    },
};

const card    = document.getElementById("card");
const saveBtn = document.querySelector(".save-btn");
const saveTxt = saveBtn.querySelector(".save-btn__txt");

// ===== Язык: определение, применение, сохранение =====
function detectLang() {
    try {
        const saved = localStorage.getItem("cardLang");
        if (saved && I18N[saved]) return saved;
    } catch (_) { /* localStorage может быть недоступен */ }

    const n = (navigator.language || "ru").toLowerCase();
    if (n.startsWith("zh")) return "zh";
    if (n.startsWith("en")) return "en";
    if (n.startsWith("ru")) return "ru";
    return "ru";
}

function currentLang() {
    const l = document.documentElement.lang;
    return I18N[l] ? l : "ru";
}

function applyLang(lang) {
    if (!I18N[lang]) lang = "ru";
    const dict = I18N[lang];

    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        if (dict[key] != null) el.textContent = dict[key];
    });
    document.querySelectorAll(".lang__btn").forEach((b) => {
        const on = b.dataset.lang === lang;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
    });

    try { localStorage.setItem("cardLang", lang); } catch (_) { /* не критично */ }
}

document.querySelectorAll(".lang__btn").forEach((b) => {
    b.addEventListener("click", (e) => {
        e.stopPropagation();
        applyLang(b.dataset.lang);
    });
});

applyLang(detectLang());

// ===== Скачивание контакта на телефон =====
function downloadVCard() {
    const blob = new Blob([VCARD], { type: "text/vcard;charset=utf-8" });
    const url  = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = CARD.file || "contact.vcf";
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 4000);
}

// ===== Переворот карточки =====
function flip(toBack) {
    const goBack = toBack ?? !card.classList.contains("is-flipped");
    card.classList.toggle("is-flipped", goBack);
}

card.addEventListener("click", (e) => {
    // Клик по ссылке/кнопке не переворачивает карточку
    if (e.target.closest("[data-noflip]")) return;
    flip();
});

card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        flip();
    }
});

// ===== Кнопка «Сохранить контакт» =====
let saveResetTimer;
saveBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    downloadVCard();

    const dict = I18N[currentLang()];
    saveBtn.classList.add("is-done");
    saveTxt.textContent = dict.saved;

    clearTimeout(saveResetTimer);
    saveResetTimer = setTimeout(() => {
        saveBtn.classList.remove("is-done");
        saveTxt.textContent = I18N[currentLang()].save;
    }, 2600);
});

// ===== При открытии: показать лицо, затем открыть контакты и скачать =====
window.addEventListener("load", () => {
    setTimeout(() => flip(true), 2000);

    // Попытка автоскачивания (на части мобильных браузеров требуется
    // действие пользователя — для этого есть кнопка и QR-код).
    setTimeout(() => {
        try { downloadVCard(); } catch (_) { /* запасной путь: кнопка / QR */ }
    }, 2600);
});
