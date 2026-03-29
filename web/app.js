// Persian/Hijri date utilities
function toJalaali(gy, gm, gd) {
    const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    const jy = (gy <= 1600) ? 0 : 979;
    gy -= (gy <= 1600) ? 621 : 1600;
    const gy2 = (gm > 2) ? (gy + 1) : gy;
    let days = (365 * gy) + (Math.floor((gy2 + 3) / 4)) - (Math.floor((gy2 + 99) / 100)) + (Math.floor((gy2 + 399) / 400)) - 80 + gd + g_d_m[gm - 1];
    const jy2 = jy + 33 * Math.floor(days / 12053);
    days %= 12053;
    let jy3 = jy2 + 4 * Math.floor(days / 1461);
    days %= 1461;
    jy3 += Math.floor((days - 1) / 365);
    if (days > 365) days = (days - 1) % 365;
    const jm = (days < 186) ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
    const jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));
    return [jy3, jm, jd];
}

function toHijri(date) {
    const gYear = date.getFullYear();
    const gMonth = date.getMonth() + 1;
    const gDay = date.getDate();
    
    let iy = gYear;
    let im = gMonth;
    let id = gDay;
    
    let iTotal = (iy - 1) * 365 + Math.floor((iy - 1) / 4) - Math.floor((iy - 1) / 100) + Math.floor((iy - 1) / 400);
    const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    for (let i = 0; i < im - 1; i++) {
        iTotal += monthDays[i];
    }
    
    if (im > 2 && ((iy % 4 === 0 && iy % 100 !== 0) || (iy % 400 === 0))) {
        iTotal++;
    }
    
    iTotal += id;
    
    const hTotal = iTotal - 227015;
    const hYear = Math.floor((30 * hTotal + 10646) / 10631);
    const hMonth = Math.ceil((hTotal - (Math.floor((hYear * 10631 - 10646) / 30))) / 29.5);
    const hDay = hTotal - Math.floor((hYear * 10631 - 10646) / 30) - Math.floor((hMonth - 1) * 29.5) + 1;
    
    return [Math.floor(hYear), Math.floor(hMonth), Math.floor(hDay)];
}

const persianMonths = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
const hijriMonths = ['محرم', 'صفر', 'ربیع‌الاول', 'ربیع‌الثانی', 'جمادی‌الاول', 'جمادی‌الثانی', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذی‌القعده', 'ذی‌الحجه'];
const persianDays = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];

function updateDateTime() {
    const now = new Date();
    
    // Shamsi date
    const [jy, jm, jd] = toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
    document.getElementById('shamsiDate').textContent = `${jd} ${persianMonths[jm - 1]} ${jy}`;
    
    // Hijri date
    const [hy, hm, hd] = toHijri(now);
    document.getElementById('qamariDate').textContent = `${hd} ${hijriMonths[hm - 1]} ${hy}`;
    
    // Clock
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}`;
    
    // Day of week
    document.getElementById('dayOfWeek').textContent = persianDays[now.getDay()];
}

// Load bookmarks from localStorage
function getBookmarks() {
    const saved = localStorage.getItem('quran_bookmarks');
    return saved ? JSON.parse(saved) : [];
}

function saveBookmarks(bookmarks) {
    localStorage.setItem('quran_bookmarks', JSON.stringify(bookmarks));
}

function toggleBookmark(chapterId, event) {
    event.stopPropagation();
    let bookmarks = getBookmarks();
    const index = bookmarks.indexOf(chapterId);
    
    if (index > -1) {
        bookmarks.splice(index, 1);
    } else {
        bookmarks.push(chapterId);
    }
    
    saveBookmarks(bookmarks);
    renderAll();
}

function isBookmarked(chapterId) {
    return getBookmarks().includes(chapterId);
}

function showTab(index) {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.content');
    
    tabs.forEach((tab, i) => {
        tab.classList.toggle('active', i === index);
    });
    
    contents.forEach((content, i) => {
        content.classList.toggle('active', i === index);
    });
}

async function openChapter(chapterId) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    const chapter = CHAPTERS.find(ch => ch.id === chapterId);
    
    document.getElementById('modalChapterName').textContent = chapter.name;
    document.getElementById('modalChapterInfo').textContent = `${chapter.transliteration} • ${chapter.translation}`;
    
    modal.classList.add('active');
    modalBody.innerHTML = '<div class="loading"><div class="spinner"></div>در حال بارگذاری...</div>';
    
    try {
        // Get Arabic text with Persian translation
        const response = await fetch(`https://api.alquran.cloud/v1/surah/${chapterId}/editions/quran-uthmani,fa.fooladvand`);
        const data = await response.json();
        
        const arabicVerses = data.data[0].ayahs;
        const persianVerses = data.data[1].ayahs;
        
        const showTrans = localStorage.getItem('show_translation') !== 'false';
        
        modalBody.innerHTML = arabicVerses.map((verse, index) => `
            <div class="verse-item">
                <div class="verse-number">${verse.numberInSurah}</div>
                <div class="verse-text">${verse.text}</div>
                <div class="verse-trans ${showTrans ? '' : 'hidden'}">${persianVerses[index].text}</div>
            </div>
        `).join('');
    } catch (error) {
        modalBody.innerHTML = '<div class="loading">خطا در بارگذاری</div>';
    }
}

function toggleTranslation() {
    const switchEl = document.getElementById('translationSwitch');
    const isActive = switchEl.classList.toggle('active');
    
    localStorage.setItem('show_translation', isActive);
    
    document.querySelectorAll('.verse-trans').forEach(el => {
        el.classList.toggle('hidden', !isActive);
    });
}

function closeModal(event) {
    if (!event || event.target.id === 'modal') {
        document.getElementById('modal').classList.remove('active');
    }
}

function renderChapter(chapter, showBookmark = true) {
    const bookmarked = isBookmarked(chapter.id);
    return `
        <div class="chapter-item" onclick="openChapter(${chapter.id})">
            <div class="chapter-number">${chapter.id}</div>
            <div class="chapter-info">
                <div class="chapter-name">${chapter.name}</div>
                <div class="chapter-trans">${chapter.transliteration}</div>
                <div class="chapter-meta">${chapter.translation} • ${chapter.total_verses} آیه</div>
            </div>
            ${showBookmark ? `
                <button class="bookmark-btn ${bookmarked ? 'active' : ''}" onclick="toggleBookmark(${chapter.id}, event)">
                    ${bookmarked ? '⭐' : '☆'}
                </button>
            ` : ''}
        </div>
    `;
}

function renderBookmarks() {
    const container = document.getElementById('bookmarks');
    const bookmarks = getBookmarks();
    
    if (bookmarks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📌</div>
                <div class="empty-state-text">هنوز سوره‌ای نشان نکرده‌اید</div>
            </div>
        `;
        return;
    }
    
    const bookmarkedChapters = CHAPTERS.filter(ch => bookmarks.includes(ch.id));
    container.innerHTML = bookmarkedChapters.map(ch => renderChapter(ch)).join('');
}

function renderChapters() {
    const container = document.getElementById('chapters');
    container.innerHTML = CHAPTERS.map(ch => renderChapter(ch)).join('');
}

function renderJuz() {
    const container = document.getElementById('juz');
    container.innerHTML = JUZ_LIST.map(juz => `
        <div class="juz-item">
            <div class="chapter-number">${juz.number}</div>
            <div class="chapter-info">
                <div class="juz-number">جز ${juz.number}</div>
                <div class="juz-info">سوره‌های ${juz.chapters[0]} تا ${juz.chapters[juz.chapters.length - 1]}</div>
            </div>
        </div>
    `).join('');
}

function renderAll() {
    renderBookmarks();
    renderChapters();
    renderJuz();
}

// Register service worker for offline support
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// Initialize translation switch state
document.addEventListener('DOMContentLoaded', () => {
    const showTrans = localStorage.getItem('show_translation') !== 'false';
    const switchEl = document.getElementById('translationSwitch');
    if (switchEl && !showTrans) {
        switchEl.classList.remove('active');
    }
});

// Update date and time
updateDateTime();
setInterval(updateDateTime, 60000); // Update every minute

// Initial render
renderAll();
