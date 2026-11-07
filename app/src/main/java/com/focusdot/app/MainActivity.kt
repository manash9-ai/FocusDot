package com.focusdot.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.focusdot.app.ui.FocusDotApp
import com.focusdot.app.ui.theme.FocusDotTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            FocusDotTheme {
                FocusDotApp()
            }
        }
    }
}
