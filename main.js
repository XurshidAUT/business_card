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
        addr:      "Ташкент · Ойбек 50/57 · Пн–Сб 9:00–22:00",
        qrCap:     "Наведите камеру — контакт сохранится сам",
        save:      "Сохранить контакт",
        saved:     "Контакт сохранён",
        back:      "Назад",
        aboutKicker: "О компании",
        aboutLead: "Bizning Gosht — один из крупнейших поставщиков мяса в Средней Азии. Мы работаем напрямую, с первых рук: без посредников и наценок — честная цена и неизменно свежее мясо.",
        f1t: "Один из крупнейших в Средней Азии",
        f1d: "Масштаб поставок и стабильные объёмы круглый год.",
        f2t: "С первых рук — без наценки",
        f2d: "Прямые поставки от производителя, без посредников.",
        f3t: "100% халяль, проверено",
        f3d: "Вся продукция сертифицирована и проходит контроль качества.",
        f4t: "Эксклюзивные контракты",
        f4d: "Прямые договоры на поставку мяса с компаниями.",
        f5t: "Всегда свежее",
        f5d: "Холодовая цепь и быстрая отгрузка — мясо приходит свежим.",
        aboutTagline: "Ваше спокойствие — наша миссия",
        aboutCta: "Подробнее на сайте",
    },
    en: {
        flipFront: "Tap to open contacts",
        contacts:  "Contacts",
        lblPhone:  "Phone",
        lblEmail:  "Email",
        lblTelegram: "Telegram",
        lblWebsite: "Website",
        addr:      "Tashkent · Oybek 50/57 · Mon–Sat 9:00–22:00",
        qrCap:     "Point your camera — the contact saves itself",
        save:      "Save contact",
        saved:     "Contact saved",
        back:      "Back",
        aboutKicker: "About the company",
        aboutLead: "Bizning Gosht is one of the largest meat suppliers in Central Asia. We work directly, first-hand — no middlemen, no markups — a fair price and consistently fresh meat.",
        f1t: "Among the largest in Central Asia",
        f1d: "Supply scale and stable volumes all year round.",
        f2t: "First-hand — no markup",
        f2d: "Direct supply from the producer, no middlemen.",
        f3t: "100% halal, verified",
        f3d: "Every product is certified and quality-controlled.",
        f4t: "Exclusive contracts",
        f4d: "Direct meat-supply agreements with companies.",
        f5t: "Always fresh",
        f5d: "Cold chain and fast dispatch keep the meat fresh.",
        aboutTagline: "Your peace of mind is our mission",
        aboutCta: "More on our website",
    },
    zh: {
        flipFront: "点击查看联系方式",
        contacts:  "联系方式",
        lblPhone:  "电话",
        lblEmail:  "邮箱",
        lblTelegram: "Telegram",
        lblWebsite: "网站",
        addr:      "塔什干 · Oybek 50/57 · 周一至周六 9:00–22:00",
        qrCap:     "用相机扫一扫，自动保存联系人",
        save:      "保存联系人",
        saved:     "已保存联系人",
        back:      "返回",
        aboutKicker: "关于公司",
        aboutLead: "Bizning Gosht 是中亚最大的肉类供应商之一。我们直接第一手采购，没有中间商，不加价 —— 价格公道，肉品始终新鲜。",
        f1t: "中亚规模最大的供应商之一",
        f1d: "全年稳定的供应规模与货量。",
        f2t: "第一手货源 — 不加价",
        f2d: "由生产方直供，没有中间商。",
        f3t: "100% 清真，经过认证",
        f3d: "所有产品均经认证并严格质检。",
        f4t: "独家供应合同",
        f4d: "与企业签订直接的肉类供应协议。",
        f5t: "始终新鲜",
        f5d: "冷链运输与快速发货，保证新鲜。",
        aboutTagline: "您的安心，是我们的使命",
        aboutCta: "了解更多",
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

// ===== Блок «О компании» (общий для всех визиток) =====
function buildAbout() {
    const scene = document.querySelector(".scene");

    // Подсказка прокрутки внизу первого экрана
    const cue = document.createElement("div");
    cue.className = "scroll-cue";
    cue.setAttribute("aria-hidden", "true");
    cue.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
        'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M6 9l6 6 6-6"/></svg>';
    if (scene) scene.appendChild(cue);

    const feats = ["f1", "f2", "f3", "f4", "f5"].map((k) =>
        '<li class="feat"><span class="feat__mk" aria-hidden="true"></span>' +
        '<span class="feat__txt"><b data-i18n="' + k + 't"></b>' +
        '<span data-i18n="' + k + 'd"></span></span></li>'
    ).join("");

    const about = document.createElement("section");
    about.className = "about";
    about.setAttribute("aria-label", "Bizning Gosht");
    about.innerHTML =
        '<div class="about__kicker">' +
            '<span class="about__rule" aria-hidden="true"></span>' +
            '<span data-i18n="aboutKicker">О компании</span>' +
            '<span class="about__rule" aria-hidden="true"></span>' +
        '</div>' +
        '<figure class="about__hero">' +
            '<img src="img/hero1.jpg" alt="Bizning Gosht" loading="lazy">' +
            '<figcaption class="about__heroCap" data-i18n="aboutTagline"></figcaption>' +
        '</figure>' +
        '<p class="about__lead" data-i18n="aboutLead"></p>' +
        '<ul class="about__list">' + feats + '</ul>' +
        '<div class="about__gallery">' +
            '<img src="img/hero2.jpg" alt="" loading="lazy">' +
            '<img src="img/photo1.jpg" alt="" loading="lazy">' +
        '</div>' +
        '<a class="about__cta" href="https://bizninggosht.uz" ' +
        'target="_blank" rel="noopener" data-i18n="aboutCta"></a>';

    if (scene && scene.parentNode) {
        scene.parentNode.insertBefore(about, scene.nextSibling);
    } else {
        document.body.appendChild(about);
    }
}

buildAbout();
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
