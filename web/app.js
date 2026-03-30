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
    const bismillahEl = document.getElementById('modalBismillah');
    const chapter = CHAPTERS.find(ch => ch.id === chapterId);
    
    document.getElementById('modalChapterName').textContent = chapter.name;
    document.getElementById('modalChapterInfo').textContent = `${chapter.transliteration} • ${chapter.translation}`;
    
    // Show Bismillah except for Surah 1 and 9
    if (chapterId !== 1 && chapterId !== 9) {
        bismillahEl.style.display = 'block';
    } else {
        bismillahEl.style.display = 'none';
    }
    
    modal.classList.add('active');
    modalBody.innerHTML = '<div class="loading"><div class="spinner"></div>در حال بارگذاری...</div>';
    
    try {
        // Check if data is cached in localStorage
        const cachedData = localStorage.getItem('quran_surah_' + chapterId);
        let arabicVerses, persianVerses;
        
        if (cachedData) {
            const parsed = JSON.parse(cachedData);
            arabicVerses = parsed.arabic;
            persianVerses = parsed.persian;
        } else {
            // Get Arabic text with Persian translation from API
            const response = await fetch(`https://api.alquran.cloud/v1/surah/${chapterId}/editions/quran-uthmani,fa.fooladvand`);
            const data = await response.json();
            
            arabicVerses = data.data[0].ayahs;
            persianVerses = data.data[1].ayahs;
            
            // Cache the data for offline use
            localStorage.setItem('quran_surah_' + chapterId, JSON.stringify({
                arabic: arabicVerses,
                persian: persianVerses
            }));
        }
        
        const showTrans = localStorage.getItem('show_translation') === 'true';
        
        let html = '';
        let currentPage = null;
        let currentJuz = null;
        
        html += arabicVerses.map((verse, index) => {
            let markers = '';
            
            // Add page marker if page changed
            if (verse.page !== currentPage && currentPage !== null) {
                markers += `<div class="page-marker">صفحه ${verse.page}</div>`;
            }
            currentPage = verse.page;
            
            // Add juz marker if juz changed
            if (verse.juz !== currentJuz && currentJuz !== null) {
                markers += `<div class="juz-marker">جز ${verse.juz}</div>`;
            }
            currentJuz = verse.juz;
            
            // Remove Bismillah from first verse if it exists
            let verseText = verse.text;
            if (verse.numberInSurah === 1 && chapterId !== 1 && chapterId !== 9) {
                verseText = verseText.replace(/^بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ\s*/g, '');
                verseText = verseText.replace(/^بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\s*/g, '');
                verseText = verseText.replace(/^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s*/g, '');
            }
            
            return `
                ${markers}
                <div class="verse-item" data-page="${verse.page}" data-juz="${verse.juz}">
                    <span class="verse-number">${verse.numberInSurah}</span>
                    <span class="verse-text">${verseText}</span>
                    <div class="verse-trans ${showTrans ? '' : 'hidden'}">${persianVerses[index].text}</div>
                </div>
            `;
        }).join('');
        
        modalBody.innerHTML = html;
        
        // Update page/juz indicator on scroll
        const indicator = document.getElementById('pageJuzIndicator');
        if (indicator && arabicVerses.length > 0) {
            indicator.style.display = 'block';
            indicator.textContent = `صفحه: ${arabicVerses[0].page} | جز: ${arabicVerses[0].juz}`;
            
            modalBody.addEventListener('scroll', () => {
                const verses = modalBody.querySelectorAll('.verse-item');
                const scrollTop = modalBody.scrollTop;
                const modalTop = modalBody.getBoundingClientRect().top;
                
                for (let i = verses.length - 1; i >= 0; i--) {
                    const verse = verses[i];
                    const verseTop = verse.getBoundingClientRect().top - modalTop;
                    
                    if (verseTop <= 100) {
                        const page = verse.getAttribute('data-page');
                        const juz = verse.getAttribute('data-juz');
                        indicator.textContent = `صفحه: ${page} | جز: ${juz}`;
                        break;
                    }
                }
            });
        }
    } catch (error) {
        modalBody.innerHTML = '<div class="loading">خطا در بارگذاری - لطفا اتصال اینترنت را بررسی کنید</div>';
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

// Open juz - shows all surahs in that juz
async function openJuz(juzNumber) {
    const juz = JUZ_LIST.find(j => j.number === juzNumber);
    if (!juz) return;
    
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    
    document.getElementById('modalChapterName').textContent = `جز ${juzNumber}`;
    document.getElementById('modalChapterInfo').textContent = `سوره‌های ${juz.chapters[0]} تا ${juz.chapters[juz.chapters.length - 1]}`;
    
    modal.classList.add('active');
    modalBody.innerHTML = '<div class="loading"><div class="spinner"></div>در حال بارگذاری...</div>';
    
    try {
        const showTrans = localStorage.getItem('show_translation') === 'true';
        let html = '<div class="page-juz-indicator" id="pageJuzIndicator">صفحه: ... | جز: ' + juzNumber + '</div>';
        
        let currentPage = null;
        let currentJuz = null;
        
        for (const surahId of juz.chapters) {
            const chapter = CHAPTERS.find(ch => ch.id === surahId);
            
            // Check if data is cached
            const cachedData = localStorage.getItem('quran_surah_' + surahId);
            let arabicVerses, persianVerses;
            
            if (cachedData) {
                const parsed = JSON.parse(cachedData);
                arabicVerses = parsed.arabic;
                persianVerses = parsed.persian;
            } else {
                const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahId}/editions/quran-uthmani,fa.fooladvand`);
                const data = await response.json();
                
                arabicVerses = data.data[0].ayahs;
                persianVerses = data.data[1].ayahs;
                
                localStorage.setItem('quran_surah_' + surahId, JSON.stringify({
                    arabic: arabicVerses,
                    persian: persianVerses
                }));
            }
            
            // Add surah header
            html += `<div style="background: var(--bg-card); padding: 12px 16px; border-radius: 12px; margin: 16px 0; text-align: center;">
                <div style="font-size: 18px; font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">${chapter.name}</div>
                <div style="font-size: 12px; color: var(--text-secondary);">${chapter.transliteration} • ${chapter.translation}</div>
            </div>`;
            
            // Add Bismillah only at the beginning of surah header, not in verses
            if (surahId !== 1 && surahId !== 9) {
                html += '<div class="bismillah">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>';
            }
            
            // Add verses with page/juz markers
            arabicVerses.forEach((verse, index) => {
                let markers = '';
                
                // Add page marker if page changed
                if (verse.page !== currentPage && currentPage !== null) {
                    markers += `<div class="page-marker">صفحه ${verse.page}</div>`;
                }
                currentPage = verse.page;
                
                // Add juz marker if juz changed
                if (verse.juz !== currentJuz && currentJuz !== null) {
                    markers += `<div class="juz-marker">جز ${verse.juz}</div>`;
                }
                currentJuz = verse.juz;
                
                html += `
                    ${markers}
                    <div class="verse-item" data-page="${verse.page}" data-juz="${verse.juz}">
                        <span class="verse-number">${verse.numberInSurah}</span>
                        <span class="verse-text">${verse.text}</span>
                        <div class="verse-trans ${showTrans ? '' : 'hidden'}">${persianVerses[index].text}</div>
                    </div>
                `;
            });
        }
        
        modalBody.innerHTML = html;
        
        // Update page/juz indicator on scroll
        const indicator = document.getElementById('pageJuzIndicator');
        if (indicator) {
            modalBody.addEventListener('scroll', () => {
                const verses = modalBody.querySelectorAll('.verse-item');
                const scrollTop = modalBody.scrollTop;
                const modalTop = modalBody.getBoundingClientRect().top;
                
                for (let i = verses.length - 1; i >= 0; i--) {
                    const verse = verses[i];
                    const verseTop = verse.getBoundingClientRect().top - modalTop;
                    
                    if (verseTop <= 100) {
                        const page = verse.getAttribute('data-page');
                        const juz = verse.getAttribute('data-juz');
                        indicator.textContent = `صفحه: ${page} | جز: ${juz}`;
                        break;
                    }
                }
            });
        }
    } catch (error) {
        modalBody.innerHTML = '<div class="loading">خطا در بارگذاری - لطفا اتصال اینترنت را بررسی کنید</div>';
    }
}

// Page search functions
function openPageSearch() {
    document.getElementById('pageSearchModal').classList.add('active');
    setTimeout(() => {
        document.getElementById('pageNumberInput').focus();
    }, 100);
}

function closePageSearch(event) {
    if (!event || event.target.id === 'pageSearchModal') {
        document.getElementById('pageSearchModal').classList.remove('active');
    }
}

async function goToPage() {
    const pageNum = parseInt(document.getElementById('pageNumberInput').value);
    
    if (!pageNum || pageNum < 1 || pageNum > 604) {
        alert('لطفا شماره صفحه معتبر (1-604) وارد کنید');
        return;
    }
    
    closePageSearch();
    
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    
    document.getElementById('modalChapterName').textContent = `صفحه ${pageNum}`;
    document.getElementById('modalChapterInfo').textContent = 'در حال بارگذاری...';
    
    modal.classList.add('active');
    modalBody.innerHTML = '<div class="loading"><div class="spinner"></div>در حال بارگذاری صفحه...</div>';
    
    try {
        // Get page data from API
        const response = await fetch(`https://api.alquran.cloud/v1/page/${pageNum}/editions/quran-uthmani,fa.fooladvand`);
        const data = await response.json();
        
        if (data.code !== 200) {
            throw new Error('Page not found');
        }
        
        const arabicAyahs = data.data[0].ayahs;
        const persianAyahs = data.data[1].ayahs;
        
        // Get first ayah info for title
        const firstAyah = arabicAyahs[0];
        const chapter = CHAPTERS.find(ch => ch.id === firstAyah.surah.number);
        
        document.getElementById('modalChapterName').textContent = `صفحه ${pageNum}`;
        document.getElementById('modalChapterInfo').textContent = `${chapter.name} • آیه ${firstAyah.numberInSurah}`;
        
        const showTrans = localStorage.getItem('show_translation') === 'true';
        
        let html = `<div class="page-juz-indicator" id="pageJuzIndicator">صفحه: ${pageNum} | جز: ${firstAyah.juz}</div>`;
        let currentSurah = null;
        
        arabicAyahs.forEach((verse, index) => {
            // Add surah header if changed
            if (currentSurah !== verse.surah.number) {
                currentSurah = verse.surah.number;
                const ch = CHAPTERS.find(c => c.id === currentSurah);
                
                html += `<div style="background: var(--bg-card); padding: 12px 16px; border-radius: 12px; margin: 16px 0; text-align: center;">
                    <div style="font-size: 18px; font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">${ch.name}</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">${ch.transliteration} • ${ch.translation}</div>
                </div>`;
                
                // Add Bismillah only at surah header if it's the first ayah
                if (verse.numberInSurah === 1 && currentSurah !== 1 && currentSurah !== 9) {
                    html += '<div class="bismillah">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>';
                }
            }
            
            html += `
                <div class="verse-item" data-page="${verse.page}" data-juz="${verse.juz}">
                    <span class="verse-number">${verse.numberInSurah}</span>
                    <span class="verse-text">${verse.text}</span>
                    <div class="verse-trans ${showTrans ? '' : 'hidden'}">${persianAyahs[index].text}</div>
                </div>
            `;
        });
        
        modalBody.innerHTML = html;
    } catch (error) {
        modalBody.innerHTML = '<div class="loading">خطا در بارگذاری صفحه</div>';
    }
}

// Allow Enter key in page search
document.addEventListener('DOMContentLoaded', () => {
    const pageInput = document.getElementById('pageNumberInput');
    if (pageInput) {
        pageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                goToPage();
            }
        });
    }
});

function renderChapter(chapter, showBookmark = true) {
    const bookmarked = isBookmarked(chapter.id);
    const downloaded = localStorage.getItem('quran_surah_' + chapter.id) ? true : false;
    return `
        <div class="chapter-item" onclick="openChapter(${chapter.id})">
            <div class="chapter-number">${chapter.id}</div>
            <div class="chapter-info">
                <div class="chapter-name">${chapter.name}</div>
                <div class="chapter-trans">${chapter.transliteration}</div>
                <div class="chapter-meta">${chapter.translation} • ${chapter.total_verses} آیه</div>
            </div>
            ${showBookmark ? `
                <button class="download-btn ${downloaded ? 'downloaded' : ''}" onclick="downloadSingleSurah(${chapter.id}, event)" title="${downloaded ? 'دانلود شده' : 'دانلود سوره'}">
                    ${downloaded ? '✓' : '⬇'}
                </button>
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
    container.innerHTML = JUZ_LIST.map(juz => {
        const downloaded = juz.chapters.every(chId => localStorage.getItem('quran_surah_' + chId));
        return `
            <div class="juz-item" onclick="openJuz(${juz.number})">
                <div class="chapter-number">${juz.number}</div>
                <div class="chapter-info">
                    <div class="juz-number">جز ${juz.number}</div>
                    <div class="juz-info">سوره‌های ${juz.chapters[0]} تا ${juz.chapters[juz.chapters.length - 1]}</div>
                </div>
                <button class="download-btn ${downloaded ? 'downloaded' : ''}" onclick="downloadJuz(${juz.number}, event)" title="${downloaded ? 'دانلود شده' : 'دانلود جز'}">
                    ${downloaded ? '✓' : '⬇'}
                </button>
            </div>
        `;
    }).join('');
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
    const showTrans = localStorage.getItem('show_translation') === 'true';
    const switchEl = document.getElementById('translationSwitch');
    if (!showTrans) {
        switchEl.classList.remove('active');
    }
});

// Update date and time
updateDateTime();
setInterval(updateDateTime, 60000); // Update every minute

// Dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('dark_mode', isDark);
    document.querySelector('.dark-mode-toggle').textContent = isDark ? '☀️' : '🌙';
}

// Load dark mode preference
if (localStorage.getItem('dark_mode') === 'true') {
    document.body.classList.add('dark-mode');
    document.querySelector('.dark-mode-toggle').textContent = '☀️';
}

// Download single surah
async function downloadSingleSurah(surahId, event) {
    if (event) event.stopPropagation();
    
    const btn = event.target;
    if (btn.classList.contains('downloading')) return;
    
    // Check if already downloaded
    if (localStorage.getItem('quran_surah_' + surahId)) {
        return;
    }
    
    btn.classList.add('downloading');
    btn.textContent = '⏳';
    
    try {
        const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahId}/editions/quran-uthmani,fa.fooladvand`);
        const data = await response.json();
        
        const arabicVerses = data.data[0].ayahs;
        const persianVerses = data.data[1].ayahs;
        
        localStorage.setItem('quran_surah_' + surahId, JSON.stringify({
            arabic: arabicVerses,
            persian: persianVerses
        }));
        
        btn.classList.remove('downloading');
        btn.classList.add('downloaded');
        btn.textContent = '✓';
        
        updateDownloadButton();
    } catch (error) {
        btn.classList.remove('downloading');
        btn.textContent = '⬇';
        alert('خطا در دانلود. لطفا دوباره تلاش کنید.');
    }
}

// Download entire juz
async function downloadJuz(juzNumber, event) {
    if (event) event.stopPropagation();
    
    const btn = event.target;
    if (btn.classList.contains('downloading')) return;
    
    const juz = JUZ_LIST.find(j => j.number === juzNumber);
    if (!juz) return;
    
    // Check if all surahs in juz are already downloaded
    const allDownloaded = juz.chapters.every(chId => localStorage.getItem('quran_surah_' + chId));
    if (allDownloaded) return;
    
    btn.classList.add('downloading');
    btn.textContent = '⏳';
    
    for (const surahId of juz.chapters) {
        // Skip if already downloaded
        if (localStorage.getItem('quran_surah_' + surahId)) continue;
        
        try {
            const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahId}/editions/quran-uthmani,fa.fooladvand`);
            const data = await response.json();
            
            const arabicVerses = data.data[0].ayahs;
            const persianVerses = data.data[1].ayahs;
            
            localStorage.setItem('quran_surah_' + surahId, JSON.stringify({
                arabic: arabicVerses,
                persian: persianVerses
            }));
            
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 300));
        } catch (error) {
            console.error('Error downloading surah ' + surahId, error);
        }
    }
    
    btn.classList.remove('downloading');
    btn.classList.add('downloaded');
    btn.textContent = '✓';
    
    updateDownloadButton();
}

// Download all surahs for offline use
let isDownloading = false;

async function downloadAllSurahs() {
    if (isDownloading) return;
    
    const btn = document.getElementById('downloadAllBtn');
    const alreadyDownloaded = checkOfflineStatus();
    
    if (alreadyDownloaded === 114) {
        if (confirm('تمام سوره‌ها قبلا دانلود شده‌اند. آیا می‌خواهید دوباره دانلود کنید؟')) {
            // Clear cache
            for (let i = 1; i <= 114; i++) {
                localStorage.removeItem('quran_surah_' + i);
            }
        } else {
            return;
        }
    }
    
    isDownloading = true;
    btn.classList.add('downloading');
    btn.textContent = '0%';
    
    let downloaded = 0;
    
    for (let i = 1; i <= 114; i++) {
        // Skip if already cached
        if (localStorage.getItem('quran_surah_' + i)) {
            downloaded++;
            btn.textContent = Math.round((downloaded / 114) * 100) + '%';
            continue;
        }
        
        try {
            const response = await fetch(`https://api.alquran.cloud/v1/surah/${i}/editions/quran-uthmani,fa.fooladvand`);
            const data = await response.json();
            
            const arabicVerses = data.data[0].ayahs;
            const persianVerses = data.data[1].ayahs;
            
            localStorage.setItem('quran_surah_' + i, JSON.stringify({
                arabic: arabicVerses,
                persian: persianVerses
            }));
            
            downloaded++;
            btn.textContent = Math.round((downloaded / 114) * 100) + '%';
            
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 300));
        } catch (error) {
            console.error('Error downloading surah ' + i, error);
        }
    }
    
    isDownloading = false;
    btn.classList.remove('downloading');
    btn.classList.add('completed');
    btn.textContent = '✓';
    
    setTimeout(() => {
        btn.classList.remove('completed');
        updateDownloadButton();
    }, 2000);
}

function checkOfflineStatus() {
    let count = 0;
    for (let i = 1; i <= 114; i++) {
        if (localStorage.getItem('quran_surah_' + i)) {
            count++;
        }
    }
    return count;
}

function updateDownloadButton() {
    const btn = document.getElementById('downloadAllBtn');
    if (!btn) return;
    
    const downloaded = checkOfflineStatus();
    if (downloaded === 114) {
        btn.textContent = '✓';
        btn.title = 'تمام سوره‌ها دانلود شده';
    } else if (downloaded > 0) {
        btn.textContent = '📥';
        btn.title = `${downloaded} از 114 سوره دانلود شده`;
    } else {
        btn.textContent = '📥';
        btn.title = 'دانلود برای استفاده آفلاین';
    }
}

// Initial render
renderAll();
updateDownloadButton();
