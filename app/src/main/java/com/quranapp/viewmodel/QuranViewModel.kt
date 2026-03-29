package com.quranapp.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.quranapp.data.Chapter
import com.quranapp.network.QuranApi
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class QuranViewModel : ViewModel() {
    private val api = QuranApi.create()
    
    private val _chapters = MutableStateFlow<List<Chapter>>(emptyList())
    val chapters: StateFlow<List<Chapter>> = _chapters
    
    private val _isLoading = MutableStateFlow(true)
    val isLoading: StateFlow<Boolean> = _isLoading
    
    init {
        loadChapters()
    }
    
    private fun loadChapters() {
        viewModelScope.launch {
            try {
                val response = api.getChapters()
                _chapters.value = response.chapters
            } catch (e: Exception) {
                e.printStackTrace()
            } finally {
                _isLoading.value = false
            }
        }
    }
    
    fun getChaptersByRevelation(): List<Chapter> {
        return _chapters.value.sortedBy { it.revelation_order ?: it.id }
    }
    
    fun getChaptersByMushaf(): List<Chapter> {
        return _chapters.value.sortedBy { it.id }
    }
    
    fun getChaptersByType(): Map<String, List<Chapter>> {
        return _chapters.value.groupBy { it.type }
    }
}
