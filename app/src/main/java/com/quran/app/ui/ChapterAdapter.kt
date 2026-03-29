package com.quran.app.ui

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.quran.app.R
import com.quran.app.data.Chapter
import com.quran.app.databinding.ItemChapterBinding

class ChapterAdapter(
    private val onItemClick: (Chapter) -> Unit,
    private val onBookmarkClick: (Chapter) -> Unit
) : ListAdapter<Chapter, ChapterAdapter.ViewHolder>(ChapterDiffCallback()) {
    
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemChapterBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }
    
    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(getItem(position))
    }
    
    inner class ViewHolder(private val binding: ItemChapterBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(chapter: Chapter) {
            binding.chapterNumber.text = chapter.id.toString()
            binding.chapterName.text = chapter.name
            binding.chapterTransliteration.text = chapter.transliteration
            binding.chapterInfo.text = "${chapter.translation} • ${chapter.total_verses} آیه"
            binding.bookmarkIcon.setImageResource(
                if (chapter.isBookmarked) R.drawable.ic_bookmark_filled else R.drawable.ic_bookmark_outline
            )
            
            binding.root.setOnClickListener { onItemClick(chapter) }
            binding.bookmarkIcon.setOnClickListener { onBookmarkClick(chapter) }
        }
    }
    
    class ChapterDiffCallback : DiffUtil.ItemCallback<Chapter>() {
        override fun areItemsTheSame(oldItem: Chapter, newItem: Chapter) = oldItem.id == newItem.id
        override fun areContentsTheSame(oldItem: Chapter, newItem: Chapter) = oldItem == newItem
    }
}
