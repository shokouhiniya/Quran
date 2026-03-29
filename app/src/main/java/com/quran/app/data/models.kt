package com.quran.app.data

data class Chapter(
    val id: Int,
    val name: String,
    val transliteration: String,
    val translation: String,
    val type: String,
    val total_verses: Int,
    val juz: Int,
    var isBookmarked: Boolean = false
)

data class Verse(
    val id: Int,
    val text: String,
    val transliteration: String?,
    val translation: String?
)

data class ChapterDetail(
    val id: Int,
    val name: String,
    val transliteration: String,
    val translation: String,
    val type: String,
    val total_verses: Int,
    val verses: List<Verse>
)

data class Juz(
    val number: Int,
    val chapters: List<Int>
)
