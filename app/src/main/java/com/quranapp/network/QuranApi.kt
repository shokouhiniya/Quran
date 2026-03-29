package com.quranapp.network

import com.quranapp.data.ChaptersResponse
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.GET

interface QuranApi {
    @GET("dist/chapters/index.json")
    suspend fun getChapters(): ChaptersResponse

    companion object {
        private const val BASE_URL = "https://cdn.jsdelivr.net/npm/quran-json@3.1.2/"

        fun create(): QuranApi {
            return Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
                .create(QuranApi::class.java)
        }
    }
}
