package com.quran.app.ui

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import com.quran.app.databinding.FragmentListBinding

class BookmarksFragment : Fragment() {
    private var _binding: FragmentListBinding? = null
    private val binding get() = _binding!!
    private lateinit var viewModel: QuranViewModel
    private lateinit var adapter: ChapterAdapter
    
    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentListBinding.inflate(inflater, container, false)
        return binding.root
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        viewModel = ViewModelProvider(requireActivity())[QuranViewModel::class.java]
        adapter = ChapterAdapter(
            onItemClick = { },
            onBookmarkClick = { chapter -> viewModel.toggleBookmark(chapter.id) }
        )
        
        binding.recyclerView.layoutManager = LinearLayoutManager(context)
        binding.recyclerView.adapter = adapter
        
        viewModel.bookmarkedChapters.observe(viewLifecycleOwner) { chapters ->
            adapter.submitList(chapters)
            binding.emptyText.visibility = if (chapters.isEmpty()) View.VISIBLE else View.GONE
        }
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
