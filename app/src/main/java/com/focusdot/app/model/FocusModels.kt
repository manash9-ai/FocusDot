package com.focusdot.app.model

data class TimerPreset(
    val id: String,
    val name: String,
    val durationMinutes: Int,
    val isDefault: Boolean = false
)

data class FocusSession(
    val id: String,
    val title: String,
    val category: String,
    val durationMinutes: Int,
    val timestamp: Long = System.currentTimeMillis()
)

data class Soundscape(
    val id: String,
    val title: String,
    val subtitle: String,
    val iconEmoji: String
)

data class DayConsistency(
    val dayLabel: String,
    val activeMinutes: Int,
    val isCompleted: Boolean,
    val isToday: Boolean = false
)

val defaultPresets = listOf(
    TimerPreset("pomodoro", "25m Pomodoro", 25, isDefault = true),
    TimerPreset("deep_work", "30m Deep Work", 30),
    TimerPreset("exam_prep", "45m Exam Prep", 45),
    TimerPreset("power_sprint", "15m Power Sprint", 15)
)

val defaultSoundscapes = listOf(
    Soundscape("none", "Silent Focus", "Zero distractions", "🔇"),
    Soundscape("binaural", "Binaural Beats", "40Hz Gamma wave deep state", "🧠"),
    Soundscape("rain", "Rain & Thunder", "Cozy cabin background drizzle", "🌧️"),
    Soundscape("cafe", "Cyber Cafe", "Warm ambient chatter & espresso", "☕"),
    Soundscape("lofi", "Lo-Fi Waves", "Mellow analog beats", "🎧")
)
