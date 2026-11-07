package com.focusdot.app.ui.timer

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Bolt
import androidx.compose.material.icons.filled.Headphones
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PictureInPictureAlt
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.rotate
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.focusdot.app.ui.theme.NeonLime
import com.focusdot.app.ui.theme.NeonLimeDark
import com.focusdot.app.ui.theme.NeonLimeGlow
import com.focusdot.app.ui.theme.OutlineDark
import com.focusdot.app.ui.theme.SurfaceContainer
import com.focusdot.app.ui.theme.SurfaceContainerHigh
import com.focusdot.app.ui.theme.SurfaceContainerLow
import com.focusdot.app.ui.theme.SurfaceDark
import com.focusdot.app.ui.theme.TextMuted
import com.focusdot.app.ui.theme.TextWhite

@Composable
fun TimerScreen(
    viewModel: TimerViewModel,
    modifier: Modifier = Modifier
) {
    val state by viewModel.uiState.collectAsState()
    val scrollState = rememberScrollState()

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(SurfaceDark)
            .padding(horizontal = 20.dp)
            .verticalScroll(scrollState),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(modifier = Modifier.height(16.dp))

        // Top App Bar
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(38.dp)
                        .clip(CircleShape)
                        .background(SurfaceContainerHigh)
                        .border(1.dp, OutlineDark, CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Bolt,
                        contentDescription = "FocusDot Bolt",
                        tint = NeonLime,
                        modifier = Modifier.size(20.dp)
                    )
                }
                Spacer(modifier = Modifier.width(10.dp))
                Column {
                    Text(
                        text = "FocusDot",
                        fontWeight = FontWeight.Bold,
                        fontSize = 19.sp,
                        color = TextWhite,
                        letterSpacing = (-0.5).sp
                    )
                    Text(
                        text = "DEEP FLOW MODE",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Medium,
                        color = TextMuted,
                        letterSpacing = 1.2.sp
                    )
                }
            }

            // iOS Dynamic Island Focus Capsule & Mini-Player
            Row(
                modifier = Modifier
                    .clip(RoundedCornerShape(20.dp))
                    .background(SurfaceContainer)
                    .border(1.dp, OutlineDark, RoundedCornerShape(20.dp))
                    .clickable { viewModel.toggleBubbleMode() }
                    .padding(horizontal = 12.dp, vertical = 7.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(7.dp)
                        .clip(CircleShape)
                        .background(if (state.isRunning) NeonLime else Color(0xFF10B981))
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = if (state.isRunning) "Deep Focus" else "Focus Idle",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = TextWhite
                )
                Spacer(modifier = Modifier.width(8.dp))
                Box(
                    modifier = Modifier
                        .width(1.dp)
                        .height(12.dp)
                        .background(OutlineDark)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Icon(
                    imageVector = Icons.Default.PictureInPictureAlt,
                    contentDescription = "Floating Bubble Mode",
                    tint = if (state.isBubbleModeEnabled) NeonLime else TextMuted,
                    modifier = Modifier.size(16.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Preset Chips Scrollable Row
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState()),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            state.presets.forEach { preset ->
                val isSelected = preset.id == state.selectedPreset.id
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(20.dp))
                        .background(if (isSelected) NeonLime else SurfaceContainer)
                        .border(
                            1.dp,
                            if (isSelected) NeonLime else OutlineDark,
                            RoundedCornerShape(20.dp)
                        )
                        .clickable { viewModel.selectPreset(preset) }
                        .padding(horizontal = 16.dp, vertical = 9.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        if (isSelected) {
                            Box(
                                modifier = Modifier
                                .size(6.dp)
                                .clip(CircleShape)
                                .background(SurfaceDark)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                        }
                        Text(
                            text = preset.name,
                            fontSize = 12.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                            color = if (isSelected) SurfaceDark else TextMuted
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(18.dp))

        // Daily Consistency Banner (Clean, non-AI styling)
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(16.dp))
                .background(SurfaceContainer)
                .border(1.dp, OutlineDark, RoundedCornerShape(16.dp))
                .padding(14.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(text = "🔥", fontSize = 20.sp)
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Text(
                            text = "Daily Consistency",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextWhite
                        )
                        Text(
                            text = "${state.todayCompletedMinutes}m focused today • Goal ${state.dailyGoalMinutes}m",
                            fontSize = 11.sp,
                            color = TextMuted
                        )
                    }
                }
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(NeonLimeGlow)
                        .border(1.dp, NeonLime.copy(alpha = 0.3f), RoundedCornerShape(12.dp))
                        .padding(horizontal = 10.dp, vertical = 4.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(6.dp)
                                .clip(CircleShape)
                                .background(NeonLime)
                        )
                        Spacer(modifier = Modifier.width(5.dp))
                        Text(
                            text = "${state.streakDays}-Day Streak",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = NeonLime
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(30.dp))

        // Circular Neon Countdown Timer
        val animatedProgress by animateFloatAsState(
            targetValue = state.progress,
            animationSpec = tween(durationMillis = 600),
            label = "ProgressAnimation"
        )

        Box(
            modifier = Modifier.size(280.dp),
            contentAlignment = Alignment.Center
        ) {
            // Stationary 3D Cosmic Aurora Iridescent Glass Sphere
            CosmicAuroraSphere(
                modifier = Modifier
                    .size(236.dp)
                    .clip(CircleShape),
                isRunning = state.isRunning
            )

            Canvas(modifier = Modifier.size(260.dp)) {
                val strokeWidth = 12.dp.toPx()
                // Track
                drawCircle(
                    color = SurfaceContainerHigh,
                    radius = (size.minDimension - strokeWidth) / 2,
                    style = Stroke(width = strokeWidth)
                )
                // Active arc
                drawArc(
                    brush = Brush.sweepGradient(listOf(NeonLime, NeonLimeDark, NeonLime)),
                    startAngle = -90f,
                    sweepAngle = 360f * (1f - animatedProgress),
                    useCenter = false,
                    style = Stroke(width = strokeWidth, cap = StrokeCap.Round)
                )
            }

            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                // Dynamic Creative Focus Capsule with Live Indicator
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(14.dp))
                        .background(Color(0xE604060B))
                        .border(1.dp, NeonLime.copy(alpha = 0.35f), RoundedCornerShape(14.dp))
                        .padding(horizontal = 12.dp, vertical = 5.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(7.dp)
                                .clip(CircleShape)
                                .background(if (state.isRunning) NeonLime else Color(0xFF10B981))
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = if (state.isRunning) "DEEP FLOW ACTIVE" else "FLOW READY",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextWhite,
                            letterSpacing = 0.8.sp
                        )
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                Text(
                    text = state.formattedTime,
                    fontSize = 50.sp,
                    fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace,
                    fontWeight = FontWeight.Bold,
                    color = TextWhite,
                    letterSpacing = (-1.5).sp
                )

                Spacer(modifier = Modifier.height(6.dp))

                Text(
                    text = state.selectedPreset.name,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Medium,
                    color = TextMuted
                )
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Soundscape Chip
        Box(
            modifier = Modifier
                .clip(RoundedCornerShape(14.dp))
                .background(SurfaceContainer)
                .border(1.dp, OutlineDark, RoundedCornerShape(14.dp))
                .clickable {
                    // Cycle soundscape
                    val nextIndex = (state.soundscapes.indexOf(state.selectedSoundscape) + 1) % state.soundscapes.size
                    viewModel.selectSoundscape(state.soundscapes[nextIndex])
                }
                .padding(horizontal = 14.dp, vertical = 10.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(text = state.selectedSoundscape.iconEmoji, fontSize = 16.sp)
                Spacer(modifier = Modifier.width(8.dp))
                Column {
                    Text(
                        text = state.selectedSoundscape.title,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = TextWhite,
                        letterSpacing = (-0.2).sp
                    )
                    Text(
                        text = state.selectedSoundscape.subtitle,
                        fontSize = 11.sp,
                        color = TextMuted
                    )
                }
                Spacer(modifier = Modifier.width(12.dp))
                Icon(
                    imageVector = Icons.Default.Headphones,
                    contentDescription = null,
                    tint = NeonLime,
                    modifier = Modifier.size(16.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(30.dp))

        // Controls Bar (Play/Pause, Reset, +5m)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceEvenly,
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Reset Button
            IconButton(
                onClick = { viewModel.resetTimer() },
                modifier = Modifier
                    .size(52.dp)
                    .clip(CircleShape)
                    .background(SurfaceContainer)
                    .border(1.dp, OutlineDark, CircleShape)
            ) {
                Icon(
                    imageVector = Icons.Default.Refresh,
                    contentDescription = "Reset Timer",
                    tint = TextMuted
                )
            }

            // Main Play / Pause Button with Neon Glow
            Box(
                modifier = Modifier
                    .size(76.dp)
                    .shadow(elevation = 20.dp, shape = CircleShape, spotColor = NeonLime)
                    .clip(CircleShape)
                    .background(NeonLime)
                    .clickable {
                        if (state.isRunning && !state.isPaused) {
                            viewModel.pauseTimer()
                        } else {
                            viewModel.startTimer()
                        }
                    },
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = if (state.isRunning && !state.isPaused) Icons.Default.Pause else Icons.Default.PlayArrow,
                    contentDescription = if (state.isRunning) "Pause" else "Play",
                    tint = SurfaceDark,
                    modifier = Modifier.size(36.dp)
                )
            }

            // +5 Min Button
            IconButton(
                onClick = { viewModel.addMinutes(5) },
                modifier = Modifier
                    .size(52.dp)
                    .clip(CircleShape)
                    .background(SurfaceContainer)
                    .border(1.dp, OutlineDark, CircleShape)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Add,
                        contentDescription = "Add 5 Minutes",
                        tint = NeonLime,
                        modifier = Modifier.size(14.dp)
                    )
                    Text(
                        text = "5m",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = NeonLime
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(36.dp))
    }
}

/**
 * High-fidelity 3D Iridescent Glass Sphere ("Bioluminescent Study Flow")
 * Centerpiece background element for dark-mode focus timer.
 * Completely stationary at [0,0,0] with continuous orbital fluid vorticity.
 * Palette: Deep Midnight Obsidian, Bioluminescent Emerald (#10B981), Electric Neon Lime (#D2FF3A), and Cyber Cyan (#00F5FF).
 */
@Composable
fun CosmicAuroraSphere(
    modifier: Modifier = Modifier,
    isRunning: Boolean = false
) {
    val infiniteTransition = rememberInfiniteTransition(label = "CosmicOrbit")
    val cycleAngle by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = if (isRunning) 5500 else 7000, easing = LinearEasing)
        ),
        label = "OrbitAngle"
    )

    Box(
        modifier = modifier
            .background(Color(0xFF04060B), CircleShape),
        contentAlignment = Alignment.Center
    ) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            val center = Offset(size.width / 2f, size.height / 2f)
            val radius = size.minDimension / 2f * 0.98f

            // 1. Deep Midnight Obsidian & Emerald Core
            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(
                        Color(0xFF04060B),
                        Color(0xFF06231C),
                        Color(0xFF0D3B2E)
                    ),
                    center = center,
                    radius = radius
                ),
                radius = radius,
                center = center
            )

            // 2. Swirling Volumetric Ribbons (Bioluminescent Emerald, Electric Lime, Cyber Cyan)
            // Tilted along 22.5 degree orbital axis
            rotate(degrees = cycleAngle + 22.5f, pivot = center) {
                drawCircle(
                    brush = Brush.sweepGradient(
                        colors = listOf(
                            Color(0x00000000),
                            Color(0xAAD2FF3A), // Electric Neon Lime (#D2FF3A)
                            Color(0x00000000),
                            Color(0xCC10B981), // Bioluminescent Emerald (#10B981)
                            Color(0x8800F5FF), // Cyber Cyan (#00F5FF)
                            Color(0x00000000)
                        ),
                        center = center
                    ),
                    radius = radius * 0.94f,
                    center = center
                )
            }

            // 3. Refined Optical Glass Rim (Emerald & Neon Lime Dispersion)
            drawCircle(
                brush = Brush.radialGradient(
                    0.0f to Color.Transparent,
                    0.72f to Color.Transparent,
                    0.84f to Color(0x3310B981), // Subdued emerald
                    0.92f to Color(0x55D2FF3A), // Neon lime sheen
                    0.97f to Color(0x77E4FF70), // Golden lime fringe
                    1.0f to Color(0x66FFFFFF)   // Pure crisp glass edge
                ),
                radius = radius,
                center = center
            )

            // 4. Studio Softbox Dual-Specular Highlight (Top Rim Reflection)
            val pillTop = Offset(center.x, center.y - radius * 0.52f)
            drawOval(
                brush = Brush.radialGradient(
                    colors = listOf(Color.White.copy(alpha = 0.90f), Color(0x66D2FF3A), Color.Transparent),
                    center = pillTop,
                    radius = radius * 0.40f
                ),
                topLeft = Offset(center.x - radius * 0.38f, center.y - radius * 0.72f),
                size = Size(radius * 0.76f, radius * 0.32f)
            )

            // 5. Golden-Lime Caustic Bounce (Bottom Rim)
            val causticBottom = Offset(center.x, center.y + radius * 0.65f)
            drawOval(
                brush = Brush.radialGradient(
                    colors = listOf(Color(0x44D2FF3A), Color.Transparent),
                    center = causticBottom,
                    radius = radius * 0.35f
                ),
                topLeft = Offset(center.x - radius * 0.35f, center.y + radius * 0.52f),
                size = Size(radius * 0.70f, radius * 0.26f)
            )

            // 6. Center Obsidian Glass Shield (Ensures 100% legibility of white clock text)
            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(
                        Color(0xD904060B),
                        Color(0xAA04060B),
                        Color.Transparent
                    ),
                    center = center,
                    radius = radius * 0.65f
                ),
                radius = radius * 0.65f,
                center = center
            )
        }
    }
}
