// ===== Данные контакта (vCard 3.0) — совпадают с QR-кодом =====
const VCARD = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "N:Boymirzayev;Islomjon;;;",
    "FN:Islomjon Boymirzayev",
    "ORG:Bizning Gosht",
    "TITLE:Founder & CEO",
    "TEL;TYPE=CELL:+998946666664",
    "EMAIL;TYPE=INTERNET:ceo@bizninggosht.uz",
    "URL:https://t.me/MBimporteRs",
    "END:VCARD"
].join("\r\n") + "\r\n";

const card    = document.getElementById("card");
const saveBtn = document.querySelector(".save-btn");

// ===== Скачивание контакта на телефон =====
function downloadVCard() {
    const blob = new Blob([VCARD], { type: "text/vcard;charset=utf-8" });
    const url  = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "Islomjon_Boymirzayev.vcf";
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
saveBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    downloadVCard();

    saveBtn.classList.add("is-done");
    const original = saveBtn.innerHTML;
    saveBtn.innerHTML =
        '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">' +
        '<path fill="currentColor" d="M9.6 16.2 4.8 11.4l1.4-1.4 3.4 3.4 8-8L19 6.8z"/></svg>' +
        "Контакт сохранён";

    setTimeout(() => {
        saveBtn.classList.remove("is-done");
        saveBtn.innerHTML = original;
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
