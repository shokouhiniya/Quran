// Quran page to surah/ayah mapping
// This will be populated by fetching from API or using pre-built data
const QURAN_PAGES = {
    1: { surah: 1, ayah: 1 },
    2: { surah: 2, ayah: 1 },
    3: { surah: 2, ayah: 6 },
    4: { surah: 2, ayah: 17 },
    5: { surah: 2, ayah: 25 },
    6: { surah: 2, ayah: 30 },
    7: { surah: 2, ayah: 38 },
    8: { surah: 2, ayah: 49 },
    9: { surah: 2, ayah: 58 },
    10: { surah: 2, ayah: 62 },
    11: { surah: 2, ayah: 70 },
    12: { surah: 2, ayah: 77 },
    13: { surah: 2, ayah: 84 },
    14: { surah: 2, ayah: 89 },
    15: { surah: 2, ayah: 94 },
    16: { surah: 2, ayah: 102 },
    17: { surah: 2, ayah: 106 },
    18: { surah: 2, ayah: 113 },
    19: { surah: 2, ayah: 120 },
    20: { surah: 2, ayah: 127 },
    21: { surah: 2, ayah: 135 },
    22: { surah: 2, ayah: 142 },
    23: { surah: 2, ayah: 146 },
    24: { surah: 2, ayah: 154 },
    25: { surah: 2, ayah: 164 },
    26: { surah: 2, ayah: 170 },
    27: { surah: 2, ayah: 177 },
    28: { surah: 2, ayah: 182 },
    29: { surah: 2, ayah: 187 },
    30: { surah: 2, ayah: 191 },
    31: { surah: 2, ayah: 197 },
    32: { surah: 2, ayah: 203 },
    33: { surah: 2, ayah: 211 },
    34: { surah: 2, ayah: 216 },
    35: { surah: 2, ayah: 220 },
    36: { surah: 2, ayah: 225 },
    37: { surah: 2, ayah: 231 },
    38: { surah: 2, ayah: 234 },
    39: { surah: 2, ayah: 238 },
    40: { surah: 2, ayah: 246 },
    41: { surah: 2, ayah: 249 },
    42: { surah: 2, ayah: 253 },
    43: { surah: 2, ayah: 257 },
    44: { surah: 2, ayah: 260 },
    45: { surah: 2, ayah: 265 },
    46: { surah: 2, ayah: 270 },
    47: { surah: 2, ayah: 275 },
    48: { surah: 2, ayah: 282 },
    49: { surah: 2, ayah: 283 },
    50: { surah: 3, ayah: 1 },
    // ... این فقط نمونه است
    // برای دقیق بودن، باید تمام 604 صفحه رو از API بگیریم
};

// Function to get page info from API
async function getPageInfo(pageNumber) {
    try {
        const response = await fetch(`https://api.alquran.cloud/v1/page/${pageNumber}`);
        const data = await response.json();
        if (data.code === 200 && data.data.ayahs.length > 0) {
            const firstAyah = data.data.ayahs[0];
            return {
                surah: firstAyah.surah.number,
                ayah: firstAyah.numberInSurah
            };
        }
    } catch (error) {
        console.error('Error fetching page info:', error);
    }
    return null;
}
