package com.quranapp.data

data class Chapter(
    val id: Int,
    val name: String,
    val transliteration: String,
    val translation: String,
    val type: String,
    val total_verses: Int,
    val revelation_order: Int? = null
)

data class ChaptersResponse(
    val chapters: List<Chapter>
)
