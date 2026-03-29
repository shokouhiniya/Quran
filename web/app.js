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
        const response = await fetch(`https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/chapters/${chapterId}.json`);
        const data = await response.json();
        
        modalBody.innerHTML = data.verses.map(verse => `
            <div class="verse-item">
                <div class="verse-number">${verse.id}</div>
                <div class="verse-text">${verse.text}</div>
                ${verse.transliteration ? `<div class="verse-trans">${verse.transliteration}</div>` : ''}
            </div>
        `).join('');
    } catch (error) {
        modalBody.innerHTML = '<div class="loading">خطا در بارگذاری</div>';
    }
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

// Initial render
renderAll();
