package com.quran.app.ui

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.quran.app.data.Juz
import com.quran.app.databinding.ItemJuzBinding

class JuzAdapter(
    private val onItemClick: (Juz) -> Unit
) : ListAdapter<Juz, JuzAdapter.ViewHolder>(JuzDiffCallback()) {
    
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemJuzBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }
    
    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(getItem(position))
    }
    
    inner class ViewHolder(private val binding: ItemJuzBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(juz: Juz) {
            binding.juzNumber.text = "جز ${juz.number}"
            binding.juzInfo.text = "سوره‌های ${juz.chapters.first()} تا ${juz.chapters.last()}"
            binding.root.setOnClickListener { onItemClick(juz) }
        }
    }
    
    class JuzDiffCallback : DiffUtil.ItemCallback<Juz>() {
        override fun areItemsTheSame(oldItem: Juz, newItem: Juz) = oldItem.number == newItem.number
        override fun areContentsTheSame(oldItem: Juz, newItem: Juz) = oldItem == newItem
    }
}
