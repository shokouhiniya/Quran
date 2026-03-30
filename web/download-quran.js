// Script to download all Quran data for offline use
const fs = require('fs');
const https = require('https');

async function downloadSurah(id) {
    return new Promise((resolve, reject) => {
        const url = `https://api.alquran.cloud/v1/surah/${id}/editions/quran-uthmani,fa.fooladvand`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    const arabicVerses = json.data[0].ayahs;
                    const persianVerses = json.data[1].ayahs;
                    
                    resolve({
                        id: id,
                        verses: arabicVerses.map((verse, index) => ({
                            number: verse.numberInSurah,
                            arabic: verse.text,
                            persian: persianVerses[index].text
                        }))
                    });
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function downloadAll() {
    const allSurahs = {};
    
    for (let i = 1; i <= 114; i++) {
        console.log(`Downloading Surah ${i}...`);
        try {
            const surah = await downloadSurah(i);
            allSurahs[i] = surah.verses;
            // Wait a bit to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (e) {
            console.error(`Error downloading Surah ${i}:`, e);
        }
    }
    
    fs.writeFileSync('quran-text.json', JSON.stringify(allSurahs, null, 2));
    console.log('Done! Saved to quran-text.json');
}

downloadAll();
