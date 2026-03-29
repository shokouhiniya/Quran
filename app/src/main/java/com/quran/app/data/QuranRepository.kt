package com.quran.app.data

import android.content.Context
import android.content.SharedPreferences
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class QuranRepository(private val context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("quran_prefs", Context.MODE_PRIVATE)
    private val gson = Gson()
    
    suspend fun getChapters(): List<Chapter> = withContext(Dispatchers.IO) {
        val json = context.assets.open("chapters.json").bufferedReader().use { it.readText() }
        val chapters: List<Chapter> = gson.fromJson(json, object : TypeToken<List<Chapter>>() {}.type)
        chapters.map { chapter ->
            chapter.copy(isBookmarked = isBookmarked(chapter.id))
        }
    }
    
    suspend fun getChapter(number: Int): ChapterDetail = withContext(Dispatchers.IO) {
        val chapters = getChapters()
        val chapter = chapters.find { it.id == number } ?: throw Exception("Chapter not found")
        ChapterDetail(
            id = chapter.id,
            name = chapter.name,
            transliteration = chapter.transliteration,
            translation = chapter.translation,
            type = chapter.type,
            total_verses = chapter.total_verses,
            verses = emptyList()
        )
    }
    
    fun toggleBookmark(chapterId: Int) {
        val bookmarks = getBookmarks().toMutableSet()
        if (bookmarks.contains(chapterId)) {
            bookmarks.remove(chapterId)
        } else {
            bookmarks.add(chapterId)
        }
        prefs.edit().putStringSet("bookmarks", bookmarks.map { it.toString() }.toSet()).apply()
    }
    
    fun isBookmarked(chapterId: Int): Boolean {
        return getBookmarks().contains(chapterId)
    }
    
    private fun getBookmarks(): Set<Int> {
        return prefs.getStringSet("bookmarks", emptySet())?.map { it.toInt() }?.toSet() ?: emptySet()
    }
    
    fun getJuzList(): List<Juz> {
        return listOf(
            Juz(1, listOf(1, 2)), Juz(2, listOf(2)), Juz(3, listOf(2, 3)),
            Juz(4, listOf(3, 4)), Juz(5, listOf(4)), Juz(6, listOf(4, 5)),
            Juz(7, listOf(5, 6)), Juz(8, listOf(6, 7)), Juz(9, listOf(7, 8)),
            Juz(10, listOf(8, 9)), Juz(11, listOf(9, 10, 11)), Juz(12, listOf(11, 12)),
            Juz(13, listOf(12, 13, 14, 15)), Juz(14, listOf(15, 16)), Juz(15, listOf(17, 18)),
            Juz(16, listOf(18, 19, 20)), Juz(17, listOf(21, 22)), Juz(18, listOf(23, 24, 25)),
            Juz(19, listOf(25, 26, 27)), Juz(20, listOf(27, 28, 29)), Juz(21, listOf(29, 30, 31, 32, 33)),
            Juz(22, listOf(33, 34, 35, 36)), Juz(23, listOf(36, 37, 38, 39)), Juz(24, listOf(39, 40, 41)),
            Juz(25, listOf(41, 42, 43, 44, 45)), Juz(26, listOf(46, 47, 48, 49, 50, 51)),
            Juz(27, listOf(51, 52, 53, 54, 55, 56, 57)), Juz(28, listOf(58, 59, 60, 61, 62, 63, 64, 65, 66)),
            Juz(29, listOf(67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77)), Juz(30, listOf(78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114))
        )
    }
}
