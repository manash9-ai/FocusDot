package com.focusdot.app.ui.timer

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.focusdot.app.model.DayConsistency
import com.focusdot.app.model.FocusSession
import com.focusdot.app.model.Soundscape
import com.focusdot.app.model.TimerPreset
import com.focusdot.app.model.defaultPresets
import com.focusdot.app.model.defaultSoundscapes
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class TimerUiState(
    val presets: List<TimerPreset> = defaultPresets,
    val selectedPreset: TimerPreset = defaultPresets.first(),
    val totalSeconds: Long = defaultPresets.first().durationMinutes * 60L,
    val remainingSeconds: Long = defaultPresets.first().durationMinutes * 60L,
    val isRunning: Boolean = false,
    val isPaused: Boolean = false,
    val streakDays: Int = 14,
    val todayCompletedMinutes: Int = 225,
    val dailyGoalMinutes: Int = 300,
    val soundscapes: List<Soundscape> = defaultSoundscapes,
    val selectedSoundscape: Soundscape = defaultSoundscapes[1], // Binaural beats by default
    val isBubbleModeEnabled: Boolean = false,
    val recentSessions: List<FocusSession> = listOf(
        FocusSession("1", "Architecture Review", "Deep Work", 45),
        FocusSession("2", "Kotlin Jetpack Compose", "Coding", 30),
        FocusSession("3", "System Design Notes", "Reading", 25)
    ),
    val weekConsistency: List<DayConsistency> = listOf(
        DayConsistency("M", 50, isCompleted = true),
        DayConsistency("T", 65, isCompleted = true),
        DayConsistency("W", 45, isCompleted = true),
        DayConsistency("T", 60, isCompleted = true),
        DayConsistency("F", 75, isCompleted = true, isToday = true),
        DayConsistency("S", 20, isCompleted = false),
        DayConsistency("S", 0, isCompleted = false)
    )
) {
    val progress: Float
        get() = if (totalSeconds > 0) 1f - (remainingSeconds.toFloat() / totalSeconds.toFloat()) else 0f

    val formattedTime: String
        get() {
            val minutes = remainingSeconds / 60
            val seconds = remainingSeconds % 60
            return "%02d:%02d".format(minutes, seconds)
        }
}

class TimerViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(TimerUiState())
    val uiState: StateFlow<TimerUiState> = _uiState.asStateFlow()

    private var timerJob: Job? = null

    fun selectPreset(preset: TimerPreset) {
        timerJob?.cancel()
        val seconds = preset.durationMinutes * 60L
        _uiState.update {
            it.copy(
                selectedPreset = preset,
                totalSeconds = seconds,
                remainingSeconds = seconds,
                isRunning = false,
                isPaused = false
            )
        }
    }

    fun startTimer() {
        if (_uiState.value.isRunning && !_uiState.value.isPaused) return
        _uiState.update { it.copy(isRunning = true, isPaused = false) }

        timerJob?.cancel()
        timerJob = viewModelScope.launch {
            while (_uiState.value.remainingSeconds > 0) {
                delay(1000L)
                _uiState.update { state ->
                    val newRemaining = state.remainingSeconds - 1
                    if (newRemaining <= 0) {
                        onTimerFinished(state)
                        state.copy(
                            remainingSeconds = 0,
                            isRunning = false,
                            isPaused = false
                        )
                    } else {
                        state.copy(remainingSeconds = newRemaining)
                    }
                }
            }
        }
    }

    private fun onTimerFinished(state: TimerUiState) {
        val completedSession = FocusSession(
            id = System.currentTimeMillis().toString(),
            title = state.selectedPreset.name,
            category = "Deep Work",
            durationMinutes = state.selectedPreset.durationMinutes
        )
        _uiState.update {
            it.copy(
                todayCompletedMinutes = it.todayCompletedMinutes + it.selectedPreset.durationMinutes,
                recentSessions = listOf(completedSession) + it.recentSessions
            )
        }
    }

    fun pauseTimer() {
        timerJob?.cancel()
        _uiState.update { it.copy(isPaused = true) }
    }

    fun resumeTimer() {
        startTimer()
    }

    fun resetTimer() {
        timerJob?.cancel()
        val seconds = _uiState.value.selectedPreset.durationMinutes * 60L
        _uiState.update {
            it.copy(
                remainingSeconds = seconds,
                totalSeconds = seconds,
                isRunning = false,
                isPaused = false
            )
        }
    }

    fun addMinutes(minutes: Int) {
        val additionalSeconds = minutes * 60L
        _uiState.update {
            it.copy(
                remainingSeconds = it.remainingSeconds + additionalSeconds,
                totalSeconds = it.totalSeconds + additionalSeconds
            )
        }
    }

    fun selectSoundscape(soundscape: Soundscape) {
        _uiState.update { it.copy(selectedSoundscape = soundscape) }
    }

    fun toggleBubbleMode() {
        _uiState.update { it.copy(isBubbleModeEnabled = !it.isBubbleModeEnabled) }
    }

    override fun onCleared() {
        super.onCleared()
        timerJob?.cancel()
    }
}
