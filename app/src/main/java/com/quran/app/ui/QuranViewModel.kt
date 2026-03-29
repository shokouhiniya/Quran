package com.quran.app.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.quran.app.data.Chapter
import com.quran.app.data.Juz
import com.quran.app.data.QuranRepository
import kotlinx.coroutines.launch

class QuranViewModel(application: Application) : AndroidViewModel(application) {
    private val repository = QuranRepository(application)
    
    private val _chapters = MutableLiveData<List<Chapter>>()
    val chapters: LiveData<List<Chapter>> = _chapters
    
    private val _bookmarkedChapters = MutableLiveData<List<Chapter>>()
    val bookmarkedChapters: LiveData<List<Chapter>> = _bookmarkedChapters
    
    private val _juzList = MutableLiveData<List<Juz>>()
    val juzList: LiveData<List<Juz>> = _juzList
    
    init {
        loadChapters()
        loadJuzList()
    }
    
    private fun loadChapters() {
        viewModelScope.launch {
            try {
                val chapters = repository.getChapters()
                _chapters.value = chapters
                updateBookmarkedChapters(chapters)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
    
    private fun loadJuzList() {
        _juzList.value = repository.getJuzList()
    }
    
    fun toggleBookmark(chapterId: Int) {
        repository.toggleBookmark(chapterId)
        _chapters.value?.let { chapters ->
            val updated = chapters.map { 
                if (it.id == chapterId) it.copy(isBookmarked = !it.isBookmarked) else it 
            }
            _chapters.value = updated
            updateBookmarkedChapters(updated)
        }
    }
    
    private fun updateBookmarkedChapters(chapters: List<Chapter>) {
        _bookmarkedChapters.value = chapters.filter { it.isBookmarked }
    }
}
