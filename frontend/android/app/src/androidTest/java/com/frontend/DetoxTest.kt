package com.frontend

import com.wix.detox.Detox
import com.wix.detox.config.DetoxConfig
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.filters.LargeTest
import androidx.test.rule.ActivityTestRule

@RunWith(AndroidJUnit4::class)
@LargeTest
class DetoxTest {
    @get:Rule
    val activityRule = ActivityTestRule(MainActivity::class.java, false, false)

    @Test
    fun runDetoxTests() {
        DetoxConfig.override(
            DetoxConfig.Builder()
                .setIdlePolicyConfig(DetoxConfig.IdlePolicyConfig.dynamicWithTimeout(2000))
        )
        Detox.runTests(activityRule)
    }
}
