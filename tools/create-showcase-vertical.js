const fs = require('fs');
const path = require('path');

console.log('Writing promo/showcase-vertical.html...');

// Read the original showcase.html to reuse the exact shader, audio, and themes
const src = fs.readFileSync(path.resolve(__dirname, '..', 'promo', 'showcase.html'), 'utf8');

// Extract WebGL shader code
const vsMatch = src.match(/const VS = `[\s\S]*?`;/);
const fsMatch = src.match(/const FS = `[\s\S]*?`;/);
const orbShaderCode = vsMatch[0] + '\n' + fsMatch[0];

// Extract Audio Engine code
const audioStart = src.indexOf('function initAudio()');
const audioEnd = src.indexOf('// ═══ STAGE SCALING');
const audioCode = src.substring(audioStart, audioEnd);

// Extract Themes definition
const themesStart = src.indexOf('const THEMES = [');
const themesEnd = src.indexOf('const SCENES = [');
const themesCode = src.substring(themesStart, themesEnd);

console.log('Extracted shader, audio, and themes successfully.');

// Construct complete 9:16 vertical showcase HTML
const verticalHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>FocusDot — Official Vertical Product Showcase (9:16)</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=JetBrains+Mono:wght@400;600;700;800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{background:#000;font-family:'Inter',sans-serif;overflow:hidden;color:#fff;height:100%}
  .font-mono{font-family:'JetBrains Mono',monospace;font-feature-settings:"tnum"1,"zero"1;font-variant-numeric:tabular-nums}

  /* ═══ 9:16 VERTICAL STAGE (1080 x 1920) ═══ */
  #stage-wrapper{
    position:fixed;top:0;left:0;right:0;bottom:52px;
    display:flex;align-items:center;justify-content:center;
    background:#000;
  }
  #stage{
    width:1080px;height:1920px;
    transform-origin:top left;
    position:absolute;
    background:#020407;
    overflow:hidden;
  }

  /* ═══ STUDIO CONTROLS ═══ */
  #controls{
    position:fixed;bottom:0;left:0;right:0;z-index:9999;height:52px;
    display:flex;align-items:center;gap:8px;
    padding:0 18px;background:rgba(4,6,10,0.96);
    border-top:1px solid rgba(255,255,255,0.08);
    backdrop-filter:blur(16px);
  }
  #controls button{
    padding:6px 13px;border-radius:8px;border:1px solid rgba(255,255,255,0.12);
    background:rgba(255,255,255,0.05);color:#fff;font-size:11.5px;cursor:pointer;
    font-family:'Inter',sans-serif;white-space:nowrap;transition:all 0.15s;
    display:inline-flex;align-items:center;gap:5px;
  }
  #controls button:hover{background:rgba(255,255,255,0.1);border-color:rgba(255,255,255,0.25)}
  #controls button.active-btn{background:#D2FF3A;color:#080A0F;border-color:#D2FF3A;font-weight:700}
  #controls input[type=range]{flex:1;accent-color:#D2FF3A;height:4px;cursor:pointer}
  #controls span{font-size:11px;color:#8E92A0;font-family:'JetBrains Mono',monospace;white-space:nowrap}
  .sep{width:1px;height:22px;background:rgba(255,255,255,0.1);flex-shrink:0}

  .scene-nav{display:flex;align-items:center;gap:4px}
  .scene-nav button{
    padding:4px 9px;font-size:10.5px;border-radius:6px;background:rgba(255,255,255,0.04);
    border:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.6);
  }
  .scene-nav button.cur-scene{
    background:rgba(210,255,58,0.12);border-color:rgba(210,255,58,0.4);color:#D2FF3A;font-weight:700;
  }

  /* ═══ BG LAYERS ═══ */
  #bg-canvas{position:absolute;inset:0;width:100%;height:100%;z-index:0}
  .vignette{
    position:absolute;inset:0;
    background:radial-gradient(ellipse at 50% 50%,transparent 35%,rgba(0,0,0,0.85) 100%);
    pointer-events:none;z-index:2;
  }
  .scanlines{
    position:absolute;inset:0;z-index:3;pointer-events:none;
    background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.035) 2px,rgba(0,0,0,0.035) 4px);
  }
  .cine-grid{
    position:absolute;inset:0;z-index:1;pointer-events:none;
    background-image:
      linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),
      linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px);
    background-size:68px 120px;
  }

  /* ═══ SCENES ═══ */
  .scene{position:absolute;inset:0;z-index:10;opacity:0;pointer-events:none;transition:opacity 0.65s cubic-bezier(0.4,0,0.2,1)}
  .scene.active{opacity:1;pointer-events:auto}

  /* Vertical Scene Container */
  .v-stage{
    position:absolute;inset:0;
    display:flex;flex-direction:column;align-items:center;justify-content:space-between;
    padding:70px 50px 80px;text-align:center;
  }

  /* Top HUD */
  .top-hud{
    display:flex;align-items:center;justify-content:space-between;width:100%;
    padding:0 10px;margin-bottom:20px;
  }
  .hud-badge{
    display:flex;align-items:center;gap:8px;padding:6px 14px;border-radius:999px;
    background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);
    font-size:12px;font-weight:700;color:#fff;
  }
  .hud-dot{width:7px;height:7px;border-radius:50%;background:#D2FF3A;box-shadow:0 0 10px #D2FF3A}
  .hud-time{font-family:'JetBrains Mono',monospace;font-size:12px;color:rgba(255,255,255,0.5)}

  /* Titles */
  .v-title-block{margin-bottom:20px;max-width:880px}
  .feature-pill{
    display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:999px;
    background:rgba(210,255,58,0.1);border:1px solid rgba(210,255,58,0.3);
    color:#D2FF3A;font-size:12px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:12px;
  }
  .v-title{font-size:44px;font-weight:900;letter-spacing:-0.03em;line-height:1.15;margin-bottom:10px}
  .v-title span{color:#D2FF3A}
  .v-sub{font-size:16px;color:rgba(255,255,255,0.6);line-height:1.5;max-width:720px;margin:0 auto}

  /* Device chassis in 1080x1920 */
  .device-v{
    position:relative;
    width:480px;height:1020px;
    background:#080A0F;
    border-radius:60px;
    border:11px solid #1A1E2A;
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.08),
      0 35px 90px rgba(0,0,0,0.95),
      0 0 70px rgba(210,255,58,0.08);
    overflow:hidden;
    display:flex;flex-direction:column;
    flex-shrink:0;
  }

  .dyn-island{
    position:absolute;top:14px;left:50%;transform:translateX(-50%);
    width:125px;height:34px;background:#000;border-radius:20px;z-index:50;
    display:flex;align-items:center;justify-content:center;gap:8px;
  }
  .dyn-camera{width:11px;height:11px;border-radius:50%;background:#1a1a1a;border:1px solid rgba(255,255,255,0.08)}
  .dyn-status-dot{width:8px;height:8px;border-radius:50%}

  .app-scroll{flex:1;display:flex;flex-direction:column;overflow:hidden;padding-top:54px}
  .app-header{
    padding:12px 22px;display:flex;align-items:center;justify-content:space-between;
    border-bottom:1px solid rgba(255,255,255,0.07);flex-shrink:0;
  }
  .app-logo{display:flex;align-items:center;gap:12px}
  .app-logo-icon{
    width:42px;height:42px;border-radius:14px;background:rgba(255,255,255,0.03);
    border:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;
    color:#D2FF3A;
  }
  .app-logo-text h2{font-size:22px;font-weight:900;letter-spacing:-0.03em;line-height:1}
  .app-logo-text p{font-size:10.5px;text-transform:uppercase;letter-spacing:0.14em;color:rgba(255,255,255,0.38);margin-top:2px}
  .deep-focus-pill{
    display:flex;align-items:center;gap:6px;padding:6px 13px;border-radius:999px;
    background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);
    font-size:11.5px;font-weight:600;color:rgba(255,255,255,0.8);
  }
  .dfp-dot{width:7px;height:7px;border-radius:50%;background:#D2FF3A;box-shadow:0 0 6px rgba(210,255,58,0.8)}

  /* Timer screen elements */
  .timer-screen{flex:1;padding:16px 20px;display:flex;flex-direction:column;gap:14px;overflow:hidden}
  .preset-pills{display:flex;gap:9px}
  .pill{padding:9px 18px;border-radius:999px;font-size:12.5px;font-weight:700;cursor:default;white-space:nowrap}
  .pill-active{background:#D2FF3A;color:#080A0F;box-shadow:0 0 14px rgba(210,255,58,0.3)}
  .pill-idle{background:#10131B;border:1px solid #1A1E2A;color:rgba(255,255,255,0.45)}

  .consistency-card{
    background:#10131B;border:1px solid rgba(255,255,255,0.07);border-radius:18px;
    padding:13px 16px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;
  }
  .cc-left{display:flex;align-items:center;gap:12px}
  .cc-flame{
    width:46px;height:46px;border-radius:13px;
    background:linear-gradient(135deg,rgba(210,255,58,0.18),rgba(16,185,129,0.08));
    border:1px solid rgba(210,255,58,0.28);display:flex;align-items:center;justify-content:center;
    color:#D2FF3A;
  }
  .cc-label{font-size:14px;font-weight:700;color:#fff}
  .streak-badge{
    display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:999px;
    background:rgba(210,255,58,0.08);border:1px solid rgba(210,255,58,0.22);
    color:#D2FF3A;font-size:11px;font-weight:700;margin-top:2px;
  }
  .mini-ring{position:relative;width:48px;height:48px;flex-shrink:0}
  .mini-ring svg{width:48px;height:48px;transform:rotate(-90deg)}
  .mini-ring span{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;font-family:'JetBrains Mono',monospace}

  /* Orb Frame */
  .orb-zone{display:flex;flex-direction:column;align-items:center;position:relative;flex-shrink:0;margin:6px 0}
  .orb-glow-bg{
    position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
    width:320px;height:320px;border-radius:50%;filter:blur(65px);opacity:0.45;
    transition:background 0.9s ease;pointer-events:none;z-index:0;
  }
  .orb-frame{position:relative;width:300px;height:300px;flex-shrink:0}
  .orb-svg-ring{position:absolute;inset:0;z-index:20;pointer-events:none}
  .orb-canvas-wrapper{
    position:absolute;inset:15px;border-radius:50%;overflow:hidden;
    background:#03060B;z-index:10;border:1px solid rgba(255,255,255,0.07);
  }
  .orb-glass{
    position:absolute;inset:0;border-radius:50%;z-index:30;
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    text-align:center;padding:16px;
    background:radial-gradient(circle at 50% 50%,rgba(6,8,14,0.72) 0%,rgba(6,8,14,0.4) 50%,transparent 78%);
  }
  .flow-status-pill{
    display:flex;align-items:center;gap:6px;padding:5px 12px;border-radius:999px;
    background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.14);
    font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#fff;
    margin-bottom:6px;
  }
  .flow-ping{width:7px;height:7px;border-radius:50%;background:#D2FF3A}
  .timer-digits{font-family:'JetBrains Mono',monospace;font-size:62px;font-weight:900;color:#fff;letter-spacing:-0.02em;line-height:1}
  .timer-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.6);margin-top:4px}
  .audio-pill{
    margin-top:8px;display:flex;align-items:center;gap:8px;
    padding:5px 14px;border-radius:999px;background:rgba(0,0,0,0.6);border:1px solid rgba(255,255,255,0.13);
  }
  .eq-bars{display:flex;align-items:flex-end;gap:3px;height:13px}
  .eq-bar{width:3px;border-radius:2px;background:#D2FF3A}
  .audio-label{font-size:11px;font-weight:700;color:rgba(255,255,255,0.88)}
  .orb-switcher{
    display:flex;align-items:center;gap:7px;padding:6px 14px;border-radius:999px;
    background:#0E1119;border:1px solid rgba(255,255,255,0.07);
    font-size:11px;color:rgba(255,255,255,0.6);margin-top:10px;
  }
  .orb-sw-dot{width:9px;height:9px;border-radius:50%}

  /* Soundscape */
  .soundscape-card{background:#0E1119;border:1px solid rgba(255,255,255,0.06);border-radius:18px;padding:13px 16px;flex-shrink:0}
  .sc-header{display:flex;align-items:center;justify-content:space-between;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,0.05)}
  .sc-track{display:flex;align-items:center;gap:10px}
  .sc-icon{width:36px;height:36px;border-radius:11px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
  .sc-name{font-size:13px;font-weight:600;color:#fff}
  .sc-desc{font-size:10px;color:rgba(255,255,255,0.38);margin-top:2px}
  .sc-chips{display:flex;gap:7px;margin-top:10px}
  .sc-chip{flex:1;padding:8px 6px;border-radius:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);display:flex;flex-direction:column;align-items:center;gap:3px;font-size:10.5px;color:rgba(255,255,255,0.5)}
  .sc-chip.chip-active{background:rgba(210,255,58,0.1);border-color:rgba(210,255,58,0.3);color:#D2FF3A;font-weight:700}

  /* Bottom stats grid */
  .v-stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;width:100%;max-width:880px;margin-top:20px}
  .v-stat-card{
    background:rgba(17,20,29,0.75);backdrop-filter:blur(20px);
    border:1px solid rgba(255,255,255,0.08);border-radius:18px;
    padding:16px 14px;display:flex;flex-direction:column;align-items:center;text-align:center;
  }
  .v-stat-num{font-size:24px;font-weight:900;color:#D2FF3A;font-family:'JetBrains Mono',monospace}
  .v-stat-label{font-size:12px;color:rgba(255,255,255,0.5);margin-top:4px;font-weight:600}

  /* Brand scene styles */
  .brand-beacon{
    width:20px;height:20px;border-radius:50%;background:#D2FF3A;
    box-shadow:0 0 35px #D2FF3A,0 0 80px rgba(210,255,58,0.6);margin-bottom:34px;
  }
  .brand-bolt{
    width:84px;height:84px;border-radius:24px;
    background:rgba(210,255,58,0.08);border:1px solid rgba(210,255,58,0.3);
    display:flex;align-items:center;justify-content:center;margin-bottom:28px;
  }
  .brand-title{
    font-size:96px;font-weight:900;letter-spacing:-0.04em;
    background:linear-gradient(135deg,#fff 0%,rgba(210,255,58,0.7) 100%);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  }
  .brand-sub{font-size:24px;font-weight:600;letter-spacing:0.25em;text-transform:uppercase;color:rgba(255,255,255,0.4);margin-top:16px}
  .brand-tagline{font-size:18px;color:rgba(255,255,255,0.3);margin-top:24px}

  /* Scene 3 Orb Hero */
  .orb-hero-frame{position:relative;width:520px;height:520px;display:flex;align-items:center;justify-content:center;margin:20px 0}
  .orb-hero-glow{position:absolute;width:640px;height:640px;border-radius:50%;filter:blur(85px);opacity:0.4;transition:background 0.9s ease}
  .orb-hero-canvas-wrap{position:absolute;inset:20px;border-radius:50%;overflow:hidden;background:#03060B;border:2px solid rgba(255,255,255,0.12)}
  .orb-hero-glass{position:absolute;inset:0;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px}

  .theme-chips-row{display:flex;gap:10px;justify-content:center;width:100%;max-width:880px;margin-top:14px;flex-wrap:wrap}
  .theme-chip{
    padding:10px 18px;border-radius:14px;background:rgba(255,255,255,0.03);
    border:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;
  }
  .theme-chip.active-theme-chip{background:rgba(255,255,255,0.09);border-color:rgba(255,255,255,0.3);color:#fff}
  .tc-dot{width:10px;height:10px;border-radius:50%}

  /* Bottom Watermark */
  .v-watermark{font-size:12px;color:rgba(255,255,255,0.4);font-family:'JetBrains Mono',monospace;margin-top:16px}
</style>
</head>
<body>

<div id="stage-wrapper">
  <div id="stage">
    <!-- Background Canvas -->
    <canvas id="bg-canvas" width="1080" height="1920"></canvas>
    <div class="vignette"></div>
    <div class="scanlines"></div>
    <div class="cine-grid"></div>

    <!-- ═══ SCENE 1: BRAND OPENING ═══ -->
    <div class="scene active" id="scene-1">
      <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:60px">
        <div class="brand-beacon"></div>
        <div class="brand-bolt">
          <span class="material-symbols-outlined" style="font-size:46px;color:#D2FF3A;font-variation-settings:'FILL' 1">bolt</span>
        </div>
        <h1 class="brand-title">FOCUSDOT</h1>
        <p class="brand-sub">DEEP FLOW MODE</p>
        <div style="width:140px;height:1px;background:linear-gradient(90deg,transparent,#D2FF3A,transparent);margin:32px 0"></div>
        <p class="brand-tagline">Your attention is your greatest asset.</p>
        <div class="v-watermark" style="position:absolute;bottom:40px">1080 × 1920  •  VERTICAL REEL</div>
      </div>
    </div>

    <!-- ═══ SCENE 2: TIMER SCREEN ═══ -->
    <div class="scene" id="scene-2">
      <div class="v-stage">
        <!-- Top HUD & Title -->
        <div>
          <div class="top-hud">
            <div class="hud-badge"><div class="hud-dot"></div><span>FOCUSDOT</span></div>
            <div class="hud-time" id="s2-time">00:08 / 00:58</div>
          </div>
          <div class="v-title-block">
            <div class="feature-pill"><span class="material-symbols-outlined" style="font-size:14px">hourglass_empty</span><span>COSMIC ORB ENGINE</span></div>
            <h2 class="v-title">Engineered for <span>pure attention.</span></h2>
            <p class="v-sub">A timer that guides your focus, not just counts it.</p>
          </div>
        </div>

        <!-- Center: Device Mockup -->
        <div class="device-v">
          <div class="dyn-island"><div class="dyn-camera"></div><div class="dyn-status-dot" style="background:#D2FF3A;box-shadow:0 0 8px #D2FF3A"></div></div>
          <div class="app-scroll">
            <div class="app-header">
              <div class="app-logo">
                <div class="app-logo-icon"><span class="material-symbols-outlined" style="font-size:22px;font-variation-settings:'FILL' 1">bolt</span></div>
                <div class="app-logo-text"><h2>FocusDot</h2><p>Deep Flow Mode</p></div>
              </div>
              <div class="deep-focus-pill"><div class="dfp-dot"></div>Deep Focus</div>
            </div>
            <div class="timer-screen">
              <div class="preset-pills">
                <div class="pill pill-active">25m Pomodoro</div>
                <div class="pill pill-idle">30m Deep Work</div>
                <div class="pill pill-idle">45m Exam Prep</div>
              </div>
              <div class="consistency-card">
                <div class="cc-left">
                  <div class="cc-flame"><span class="material-symbols-outlined" style="font-size:22px;font-variation-settings:'FILL' 1">local_fire_department</span></div>
                  <div>
                    <div class="cc-label">Daily Consistency</div>
                    <div class="streak-badge"><span class="material-symbols-outlined" style="font-size:11px">local_fire_department</span><span>14-Day Streak</span></div>
                  </div>
                </div>
                <div class="mini-ring">
                  <svg viewBox="0 0 36 36"><path stroke="#1E2330" stroke-width="3.5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/><path stroke="#D2FF3A" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="75, 100" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/></svg>
                  <span>3/4</span>
                </div>
              </div>
              <div class="orb-zone">
                <div class="orb-glow-bg" id="orb-glow-bg"></div>
                <div class="orb-frame">
                  <svg class="orb-svg-ring" viewBox="0 0 300 300"><circle cx="150" cy="150" r="138" stroke="#1A1E2A" stroke-width="7" fill="none"/><circle id="timer-ring-svg" cx="150" cy="150" r="138" stroke="#D2FF3A" stroke-width="7" stroke-linecap="round" fill="none" stroke-dasharray="867" stroke-dashoffset="180" style="transform:rotate(-90deg);transform-origin:50% 50%"/></svg>
                  <div class="orb-canvas-wrapper"><canvas id="orb-canvas" width="400" height="400" style="width:100%;height:100%"></canvas></div>
                  <div class="orb-glass">
                    <div class="flow-status-pill"><div class="flow-ping"></div><span>Flow Ready</span></div>
                    <div class="timer-digits" id="timer-display">25:00</div>
                    <div class="timer-label">Pomodoro Focus</div>
                    <div class="audio-pill"><div class="eq-bars"><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div></div><div class="audio-label">40Hz Gamma</div></div>
                  </div>
                </div>
                <div class="orb-switcher"><div class="orb-sw-dot" id="orb-sw-dot" style="background:#D2FF3A;box-shadow:0 0 8px #D2FF3A"></div><span>Focus Sphere:</span><strong id="orb-sw-label" style="color:#fff">Bioluminescent Flow</strong></div>
              </div>
              <div class="soundscape-card">
                <div class="sc-header">
                  <div class="sc-track"><div class="sc-icon">🧠</div><div><div class="sc-name">Binaural Beats (40Hz)</div><div class="sc-desc">Gamma wave focus • 40Hz acoustic sync</div></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Stats -->
        <div>
          <div class="v-stats-grid">
            <div class="v-stat-card"><div class="v-stat-num">40Hz</div><div class="v-stat-label">Audio Sync</div></div>
            <div class="v-stat-card"><div class="v-stat-num">25m</div><div class="v-stat-label">Deep Flow</div></div>
            <div class="v-stat-card"><div class="v-stat-num">5</div><div class="v-stat-label">Cosmic Themes</div></div>
          </div>
          <div class="v-watermark">focusdotflow.vercel.app</div>
        </div>
      </div>
    </div>

    <!-- ═══ SCENE 3: 5 COSMIC THEMES (HERO ORB) ═══ -->
    <div class="scene" id="scene-3">
      <div class="v-stage">
        <div>
          <div class="top-hud">
            <div class="hud-badge"><div class="hud-dot"></div><span>THEME GALLERY</span></div>
            <div class="hud-time">00:22 / 00:58</div>
          </div>
          <div class="v-title-block">
            <div class="feature-pill"><span class="material-symbols-outlined" style="font-size:14px">palette</span><span>5 VISUAL THEMES</span></div>
            <h2 class="v-title">Every session<br>feels <span>different.</span></h2>
            <p class="v-sub">5 scientifically tuned ambient themes matching your cognitive demand.</p>
          </div>
        </div>

        <!-- Large Hero Orb -->
        <div class="orb-hero-frame">
          <div class="orb-hero-glow" id="scene3-glow" style="background:radial-gradient(circle,#D2FF3A 0%,transparent 70%)"></div>
          <svg class="orb-svg-ring" viewBox="0 0 520 520"><circle cx="260" cy="260" r="240" stroke="#1A1E2A" stroke-width="8" fill="none"/><circle id="scene3-ring" cx="260" cy="260" r="240" stroke="#D2FF3A" stroke-width="8" stroke-linecap="round" fill="none" stroke-dasharray="1507" stroke-dashoffset="300" style="transform:rotate(-90deg);transform-origin:50% 50%"/></svg>
          <div class="orb-hero-canvas-wrap"><canvas id="orb-canvas-3" width="600" height="600" style="width:100%;height:100%"></canvas></div>
          <div class="orb-hero-glass">
            <div class="flow-status-pill"><div class="flow-ping"></div><span>Live Shader</span></div>
            <div class="timer-digits" id="s3-timer" style="font-size:80px">25:00</div>
            <div class="timer-label" id="s3-orb-name" style="font-size:14px;color:#D2FF3A;margin-top:6px">Bioluminescent Flow</div>
            <div class="audio-pill" style="margin-top:14px"><div class="eq-bars"><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div></div><div class="audio-label" id="s3-audio">40Hz Gamma</div></div>
          </div>
        </div>

        <!-- Theme Chips -->
        <div>
          <div class="theme-chips-row">
            <div class="theme-chip active-theme-chip" id="tc-0"><div class="tc-dot" style="background:#D2FF3A"></div><span>Bioluminescent</span></div>
            <div class="theme-chip" id="tc-1"><div class="tc-dot" style="background:#A855F7"></div><span>Cosmic Amethyst</span></div>
            <div class="theme-chip" id="tc-2"><div class="tc-dot" style="background:#FF2A55"></div><span>Crimson Flare</span></div>
            <div class="theme-chip" id="tc-3"><div class="tc-dot" style="background:#00F5FF"></div><span>Cyber Aurora</span></div>
            <div class="theme-chip" id="tc-4"><div class="tc-dot" style="background:#F59E0B"></div><span>Solar Gold</span></div>
          </div>
          <div class="v-watermark">Raymarched WebGL Simplex Shader</div>
        </div>
      </div>
    </div>

    <!-- ═══ SCENE 4: DAILY & COGNITIVE ═══ -->
    <div class="scene" id="scene-4">
      <div class="v-stage">
        <div>
          <div class="top-hud">
            <div class="hud-badge"><div class="hud-dot"></div><span>MENTAL CALIBRATION</span></div>
            <div class="hud-time">00:32 / 00:58</div>
          </div>
          <div class="v-title-block">
            <div class="feature-pill"><span class="material-symbols-outlined" style="font-size:14px">psychology</span><span>DAILY PLANNER</span></div>
            <h2 class="v-title">Know your <span>mental state.</span></h2>
            <p class="v-sub">Track cognitive clarity before you begin. Calibrate habits and sleep.</p>
          </div>
        </div>

        <!-- Center: Device Mockup -->
        <div class="device-v">
          <div class="dyn-island"><div class="dyn-camera"></div><div class="dyn-status-dot" style="background:#D2FF3A;box-shadow:0 0 8px #D2FF3A"></div></div>
          <div class="app-scroll">
            <div class="app-header">
              <div class="app-logo">
                <div class="app-logo-icon"><span class="material-symbols-outlined" style="font-size:22px;font-variation-settings:'FILL' 1">bolt</span></div>
                <div class="app-logo-text"><h2>FocusDot</h2><p>Deep Flow Mode</p></div>
              </div>
              <div class="deep-focus-pill"><div class="dfp-dot"></div>Deep Focus</div>
            </div>
            <!-- Planner Screen Content -->
            <div style="padding:16px 20px;display:flex;flex-direction:column;gap:14px">
              <div style="display:flex;align-items:center;justify-content:space-between">
                <div><div style="font-size:11px;color:#D2FF3A;font-weight:700">• FRIDAY, OCT 24</div><div style="font-size:24px;font-weight:900">Howdy, Swati!</div></div>
                <div style="text-align:right"><div style="font-size:11px;color:#D2FF3A;font-weight:700">Level 8 Flow</div><div style="width:70px;height:4px;background:#181C26;border-radius:2px;margin-top:4px"><div style="width:75%;height:100%;background:#D2FF3A;border-radius:2px"></div></div></div>
              </div>
              <!-- Weekly Calendar strip -->
              <div style="display:flex;gap:6px;justify-content:space-between;padding:10px 12px;background:#10131B;border-radius:14px;border:1px solid rgba(255,255,255,0.06)">
                <div style="text-align:center"><div style="font-size:9.5px;color:rgba(255,255,255,0.4)">Wed</div><div style="font-size:12px;font-weight:700">21</div></div>
                <div style="text-align:center"><div style="font-size:9.5px;color:rgba(255,255,255,0.4)">Thu</div><div style="font-size:12px;font-weight:700">22</div></div>
                <div style="text-align:center"><div style="font-size:9.5px;color:rgba(255,255,255,0.4)">Fri</div><div style="font-size:12px;font-weight:700">23</div></div>
                <div style="text-align:center"><div style="font-size:9.5px;color:rgba(255,255,255,0.4)">Sat</div><div style="font-size:12px;font-weight:700">24</div></div>
                <div style="text-align:center;background:#D2FF3A;color:#080A0F;padding:2px 8px;border-radius:8px"><div style="font-size:9.5px;font-weight:700">Sun</div><div style="font-size:13px;font-weight:900">25</div></div>
                <div style="text-align:center"><div style="font-size:9.5px;color:rgba(255,255,255,0.4)">Mon</div><div style="font-size:12px;font-weight:700">26</div></div>
              </div>
              <!-- Focus state chips -->
              <div style="background:#10131B;border-radius:14px;padding:12px;border:1px solid rgba(255,255,255,0.06)">
                <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.5);margin-bottom:8px">Cognitive Focus State</div>
                <div style="display:flex;gap:6px">
                  <div style="padding:6px 10px;border-radius:9px;background:rgba(255,255,255,0.04);font-size:11px">Brain Fog</div>
                  <div style="padding:6px 10px;border-radius:9px;background:rgba(255,255,255,0.04);font-size:11px">Restless</div>
                  <div style="padding:6px 10px;border-radius:9px;background:rgba(255,255,255,0.04);font-size:11px">Balanced</div>
                  <div style="padding:6px 10px;border-radius:9px;background:#D2FF3A;color:#080A0F;font-weight:700;font-size:11px">In Flow</div>
                  <div style="padding:6px 10px;border-radius:9px;background:rgba(255,255,255,0.04);font-size:11px">Peak</div>
                </div>
              </div>
              <!-- Trackers: Sleep & Hydration -->
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                <div style="background:#10131B;border-radius:14px;padding:12px;border:1px solid rgba(255,255,255,0.06);text-align:center">
                  <div style="font-size:11px;color:rgba(255,255,255,0.5)">🌙 Sleep Target</div>
                  <div style="font-size:20px;font-weight:900;color:#D2FF3A;margin:4px 0">6.5 / 8h</div>
                  <div style="font-size:9.5px;color:rgba(255,255,255,0.4)">6h 30m of 8h goal</div>
                </div>
                <div style="background:#10131B;border-radius:14px;padding:12px;border:1px solid rgba(255,255,255,0.06);text-align:center">
                  <div style="font-size:11px;color:rgba(255,255,255,0.5)">💧 Hydration</div>
                  <div style="font-size:20px;font-weight:900;color:#A855F7;margin:4px 0">5 / 8</div>
                  <div style="font-size:9.5px;color:rgba(255,255,255,0.4)">1,250ml logged</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Stats -->
        <div>
          <div class="v-stats-grid">
            <div class="v-stat-card"><div class="v-stat-num">In Flow</div><div class="v-stat-label">Cognitive State</div></div>
            <div class="v-stat-card"><div class="v-stat-num">6.5h</div><div class="v-stat-label">Sleep Logged</div></div>
            <div class="v-stat-card"><div class="v-stat-num">14-Day</div><div class="v-stat-label">Streak Active</div></div>
          </div>
          <div class="v-watermark">focusdotflow.vercel.app</div>
        </div>
      </div>
    </div>

    <!-- ═══ SCENE 5: INSIGHTS & PROGRESS ═══ -->
    <div class="scene" id="scene-5">
      <div class="v-stage">
        <div>
          <div class="top-hud">
            <div class="hud-badge"><div class="hud-dot"></div><span>STUDENT ANALYTICS</span></div>
            <div class="hud-time">00:42 / 00:58</div>
          </div>
          <div class="v-title-block">
            <div class="feature-pill"><span class="material-symbols-outlined" style="font-size:14px">insights</span><span>PROGRESS RADAR</span></div>
            <h2 class="v-title">See your <span>flow data.</span></h2>
            <p class="v-sub">Real-time metrics tracking session depth, consistency streaks, and daily hours.</p>
          </div>
        </div>

        <!-- Center: Device Mockup -->
        <div class="device-v">
          <div class="dyn-island"><div class="dyn-camera"></div><div class="dyn-status-dot" style="background:#D2FF3A;box-shadow:0 0 8px #D2FF3A"></div></div>
          <div class="app-scroll">
            <div class="app-header">
              <div class="app-logo">
                <div class="app-logo-icon"><span class="material-symbols-outlined" style="font-size:22px;font-variation-settings:'FILL' 1">bolt</span></div>
                <div class="app-logo-text"><h2>FocusDot</h2><p>Deep Flow Mode</p></div>
              </div>
              <div class="deep-focus-pill"><div class="dfp-dot"></div>Deep Focus</div>
            </div>
            <!-- Insights Content -->
            <div style="padding:20px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:16px">
              <div style="font-size:13px;font-weight:700;color:rgba(255,255,255,0.6)">Today's Focus Summary</div>
              <!-- Radial ring -->
              <div style="position:relative;width:240px;height:240px;display:flex;align-items:center;justify-content:center">
                <svg viewBox="0 0 100 100" style="width:100%;height:100%;transform:rotate(-90deg)"><circle cx="50" cy="50" r="40" stroke="#181C26" stroke-width="8" fill="none"/><circle cx="50" cy="50" r="40" stroke="#D2FF3A" stroke-width="8" stroke-linecap="round" fill="none" stroke-dasharray="251.2" stroke-dashoffset="62.8"/></svg>
                <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
                  <div style="font-size:36px;font-weight:900;font-family:'JetBrains Mono',monospace">3h 45m</div>
                  <div style="font-size:12px;color:rgba(255,255,255,0.5)">of 5h Daily Goal (75%)</div>
                </div>
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;width:100%">
                <div style="background:#10131B;border-radius:14px;padding:14px;border:1px solid rgba(255,255,255,0.06)">
                  <div style="font-size:11px;color:rgba(255,255,255,0.5)">Completed</div>
                  <div style="font-size:18px;font-weight:900;margin-top:2px">3 Sessions</div>
                </div>
                <div style="background:#10131B;border-radius:14px;padding:14px;border:1px solid rgba(255,255,255,0.06)">
                  <div style="font-size:11px;color:rgba(255,255,255,0.5)">Deep Flow Rate</div>
                  <div style="font-size:18px;font-weight:900;color:#D2FF3A;margin-top:2px">94%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Stats -->
        <div>
          <div class="v-stats-grid">
            <div class="v-stat-card"><div class="v-stat-num">94%</div><div class="v-stat-label">Flow Depth</div></div>
            <div class="v-stat-card"><div class="v-stat-num">3.8h</div><div class="v-stat-label">Daily Avg</div></div>
            <div class="v-stat-card"><div class="v-stat-num">14-Day</div><div class="v-stat-label">Streak Record</div></div>
          </div>
          <div class="v-watermark">focusdotflow.vercel.app</div>
        </div>
      </div>
    </div>

    <!-- ═══ SCENE 6: STUDY PLANNER ═══ -->
    <div class="scene" id="scene-6">
      <div class="v-stage">
        <div>
          <div class="top-hud">
            <div class="hud-badge"><div class="hud-dot"></div><span>CURRICULUM BLOCKS</span></div>
            <div class="hud-time">00:49 / 00:58</div>
          </div>
          <div class="v-title-block">
            <div class="feature-pill"><span class="material-symbols-outlined" style="font-size:14px">checklist</span><span>BLOCK EXECUTION</span></div>
            <h2 class="v-title">Every subject.<br>Every <span>block.</span></h2>
            <p class="v-sub">Organize your curriculum into high-yield study sessions with intelligent time blocks.</p>
          </div>
        </div>

        <!-- Center: Device Mockup -->
        <div class="device-v">
          <div class="dyn-island"><div class="dyn-camera"></div><div class="dyn-status-dot" style="background:#D2FF3A;box-shadow:0 0 8px #D2FF3A"></div></div>
          <div class="app-scroll">
            <div class="app-header">
              <div class="app-logo">
                <div class="app-logo-icon"><span class="material-symbols-outlined" style="font-size:22px;font-variation-settings:'FILL' 1">bolt</span></div>
                <div class="app-logo-text"><h2>FocusDot</h2><p>Deep Flow Mode</p></div>
              </div>
              <div class="deep-focus-pill"><div class="dfp-dot"></div>Deep Focus</div>
            </div>
            <!-- Study Plan Tasks -->
            <div style="padding:16px 20px;display:flex;flex-direction:column;gap:12px">
              <div style="display:flex;align-items:center;justify-content:space-between">
                <div><div style="font-size:14px;font-weight:700">Today's Study Plan</div><div style="font-size:11px;color:rgba(255,255,255,0.4)">0 of 3 tasks completed</div></div>
                <div style="font-size:11px;font-weight:700;color:#D2FF3A;padding:4px 8px;border-radius:6px;background:rgba(210,255,58,0.1)">+ Add Task</div>
              </div>
              <!-- Task 1 -->
              <div style="background:#10131B;border-radius:14px;padding:14px;border:1px solid rgba(255,255,255,0.06);display:flex;flex-direction:column;gap:6px">
                <div style="display:flex;align-items:center;justify-content:space-between">
                  <div style="font-size:13.5px;font-weight:700">Chemistry — Haloalkanes</div>
                  <div style="font-size:10px;padding:3px 8px;border-radius:999px;background:rgba(210,255,58,0.15);color:#D2FF3A;font-weight:700">In Progress</div>
                </div>
                <div style="font-size:11px;color:rgba(255,255,255,0.4)">SN1 and SN2 reaction mechanisms & practice sheet</div>
                <div style="font-size:10.5px;color:rgba(255,255,255,0.5)">7:00 PM – 7:45 PM  •  45 mins</div>
              </div>
              <!-- Task 2 -->
              <div style="background:#10131B;border-radius:14px;padding:14px;border:1px solid rgba(255,255,255,0.06);display:flex;flex-direction:column;gap:6px">
                <div style="display:flex;align-items:center;justify-content:space-between">
                  <div style="font-size:13.5px;font-weight:700">Mathematics — Vector Calculus</div>
                  <div style="font-size:10px;padding:3px 8px;border-radius:999px;background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.6)">Upcoming</div>
                </div>
                <div style="font-size:11px;color:rgba(255,255,255,0.4)">Surface integrals & Stokes' Theorem proofs</div>
                <div style="font-size:10.5px;color:rgba(255,255,255,0.5)">8:00 PM – 9:00 PM  •  60 mins</div>
              </div>
              <!-- Task 3 -->
              <div style="background:#10131B;border-radius:14px;padding:14px;border:1px solid rgba(255,255,255,0.06);display:flex;flex-direction:column;gap:6px">
                <div style="display:flex;align-items:center;justify-content:space-between">
                  <div style="font-size:13.5px;font-weight:700">Physics — Electromagnetism</div>
                  <div style="font-size:10px;padding:3px 8px;border-radius:999px;background:rgba(16,185,129,0.15);color:#10B981;font-weight:700">Completed</div>
                </div>
                <div style="font-size:11px;color:rgba(255,255,255,0.4)">Gauss' Law problem set #4 and dielectric spheres</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Stats -->
        <div>
          <div class="v-stats-grid">
            <div class="v-stat-card"><div class="v-stat-num">45m</div><div class="v-stat-label">Chemistry Block</div></div>
            <div class="v-stat-card"><div class="v-stat-num">60m</div><div class="v-stat-label">Maths Block</div></div>
            <div class="v-stat-card"><div class="v-stat-num">3</div><div class="v-stat-label">Daily Modules</div></div>
          </div>
          <div class="v-watermark">focusdotflow.vercel.app</div>
        </div>
      </div>
    </div>

    <!-- ═══ SCENE 7: BRAND FINALE ═══ -->
    <div class="scene" id="scene-7">
      <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:60px">
        <div class="brand-beacon"></div>
        <h1 class="brand-title">FOCUSDOT</h1>
        <p class="brand-sub">DEEP FLOW MODE</p>
        <p style="font-size:24px;font-style:italic;color:rgba(255,255,255,0.7);margin:24px 0">"Focus on what matters."</p>
        <div style="display:flex;gap:12px;margin:16px 0">
          <div style="padding:6px 16px;border-radius:999px;background:rgba(210,255,58,0.1);border:1px solid rgba(210,255,58,0.3);color:#D2FF3A;font-size:12px;font-weight:700">Standalone PWA</div>
          <div style="padding:6px 16px;border-radius:999px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);color:#fff;font-size:12px">Web Application</div>
        </div>
        <div style="font-size:20px;font-weight:900;color:#D2FF3A;margin-top:20px">focusdotflow.vercel.app</div>
        <div class="v-watermark" style="position:absolute;bottom:40px">OFFICIAL LAUNCH PRODUCTION</div>
      </div>
    </div>

  </div>
</div>

<!-- Studio Controls -->
<div id="controls">
  <button id="btn-play">▶ Play</button>
  <button id="btn-rewind">↺ Restart</button>
  <div class="sep"></div>
  <span id="time-display">00:00 / 00:58</span>
  <input type="range" id="scrubber" min="0" max="58000" value="0">
  <div class="sep"></div>
  <button id="btn-audio">🔊 Audio: On</button>
  <button id="btn-fs">⛶ Fullscreen</button>
  <div class="sep"></div>
  <div class="scene-nav">
    <button data-scene="0" class="cur-scene">S1</button>
    <button data-scene="1">S2</button>
    <button data-scene="2">S3</button>
    <button data-scene="3">S4</button>
    <button data-scene="4">S5</button>
    <button data-scene="5">S6</button>
    <button data-scene="6">S7</button>
  </div>
  <div class="sep"></div>
  <a href="/public/videos/focusdot-showcase-vertical.mp4" download="focusdot-showcase-vertical.mp4" style="text-decoration:none">
    <button style="background:#D2FF3A;color:#080A0F;font-weight:700;border-color:#D2FF3A">📥 Download 9:16 MP4</button>
  </a>
</div>

<script>
${audioCode}

  // ═══ STAGE SCALING (9:16) ═══
  const stage = document.getElementById('stage');
  function scaleStage() {
    const W = window.innerWidth, H = window.innerHeight - 52;
    const sx = W / 1080, sy = H / 1920;
    const s = Math.min(sx, sy);
    stage.style.transform = \`scale(\${s})\`;
    stage.style.left = \`\${(W - 1080 * s) / 2}px\`;
    stage.style.top = \`\${(H - 1920 * s) / 2}px\`;
  }
  window.addEventListener('resize', scaleStage);
  scaleStage();

  // ═══ BACKGROUND CANVAS ═══
  const bgCanvas = document.getElementById('bg-canvas');
  const bgCtx = bgCanvas.getContext('2d');
  const PARTICLES = Array.from({length:120}, (_,i) => ({
    x: Math.random() * 1080,
    y: Math.random() * 1920,
    r: 1 + Math.random() * 2.5,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
    phase: Math.random() * Math.PI * 2,
    baseR: 1 + Math.random() * 2.5
  }));

  function renderBg(t, themeName) {
    bgCtx.clearRect(0,0,1080,1920);
    const themes = {
      green:  [['#020508','#020b06','#010403'], [540,500], [540,1400]],
      purple: [['#05020a','#0e031a','#040106'], [540,500], [540,1400]],
      red:    [['#090203','#1a0305','#060102'], [540,500], [540,1400]],
      cyan:   [['#010609','#02131a','#010406'], [540,500], [540,1400]],
      gold:   [['#080501','#190e02','#050301'], [540,500], [540,1400]]
    };
    const th = themes[themeName] || themes['green'];
    const [cols, [ax,ay], [bx,by]] = th;
    const g1 = bgCtx.createRadialGradient(ax,ay,0,ax,ay,750);
    g1.addColorStop(0, cols[1]); g1.addColorStop(1, cols[0]);
    bgCtx.fillStyle = g1; bgCtx.fillRect(0,0,1080,1920);

    const g2 = bgCtx.createRadialGradient(bx,by,0,bx,by,650);
    g2.addColorStop(0, cols[2]); g2.addColorStop(1, 'transparent');
    bgCtx.fillStyle = g2; bgCtx.fillRect(0,0,1080,1920);

    for(let i=0; i<3; i++){
      const bx2 = 540 + Math.sin(t*0.00007+i*2.1)*260;
      const by2 = 960 + Math.cos(t*0.00005+i*1.7)*350;
      const r = 300 + i*60;
      const gb = bgCtx.createRadialGradient(bx2,by2,0,bx2,by2,r);
      const c = (themeName==='purple')?'rgba(168,85,247,0.06)':(themeName==='red')?'rgba(255,42,85,0.06)':(themeName==='cyan')?'rgba(0,245,255,0.06)':(themeName==='gold')?'rgba(245,158,11,0.06)':'rgba(210,255,58,0.06)';
      gb.addColorStop(0, c); gb.addColorStop(1, 'transparent');
      bgCtx.fillStyle = gb; bgCtx.fillRect(0,0,1080,1920);
    }

    for (let p of PARTICLES) {
      p.x = (p.x + p.vx + 1080) % 1080;
      p.y = (p.y + p.vy + 1920) % 1920;
      const alpha = 0.08 + 0.1 * Math.sin(p.phase + t*0.0007);
      bgCtx.beginPath();
      bgCtx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      bgCtx.fillStyle = \`rgba(210,255,58,\${Math.max(0,alpha)})\`;
      bgCtx.fill();
    }
  }

  // ═══ WEBGL RAYMARCHED ORB SHADER ═══
  ${orbShaderCode}

  function makeOrb(canvas) {
    const gl = canvas.getContext('webgl',{antialias:true,alpha:true,premultipliedAlpha:false});
    if(!gl) return null;
    function mkShader(type, src) {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src); gl.compileShader(sh);
      return sh;
    }
    const vs=mkShader(gl.VERTEX_SHADER,VS), fs=mkShader(gl.FRAGMENT_SHADER,FS);
    const prog=gl.createProgram();
    gl.attachShader(prog,vs); gl.attachShader(prog,fs); gl.linkProgram(prog);
    gl.useProgram(prog);
    const pa=gl.getAttribLocation(prog,'a_position');
    const uRes=gl.getUniformLocation(prog,'u_resolution');
    const uTime=gl.getUniformLocation(prog,'u_time');
    const uFlow=gl.getUniformLocation(prog,'u_flow_active');
    const uTheme=gl.getUniformLocation(prog,'u_theme');
    const buf=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buf);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
    gl.enableVertexAttribArray(pa);
    gl.vertexAttribPointer(pa,2,gl.FLOAT,false,0,0);
    const start=performance.now();
    function resize(){
      const dpr=Math.max(window.devicePixelRatio||1,2);
      const rect=canvas.getBoundingClientRect();
      const W=Math.round((rect.width||300)*dpr), H=Math.round((rect.height||300)*dpr);
      if(canvas.width!==W||canvas.height!==H){canvas.width=W;canvas.height=H;gl.viewport(0,0,W,H);}
    }
    resize();
    function draw(now){
      resize();
      const t=(now-start)/1000;
      gl.useProgram(prog);
      gl.uniform2f(uRes,canvas.width,canvas.height);
      gl.uniform1f(uTime,t);
      gl.uniform1f(uFlow,1.0);
      gl.uniform1i(uTheme,window.__activeThemeIdx||0);
      gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
    }
    return {draw};
  }

  const orb2 = makeOrb(document.getElementById('orb-canvas'));
  const orb3 = makeOrb(document.getElementById('orb-canvas-3'));

  ${themesCode}

  const SCENES = [
    { id:'scene-1', start:0,     end:7000,  label:'S1: Brand Opening' },
    { id:'scene-2', start:7000,  end:17500, label:'S2: The Timer & Orb' },
    { id:'scene-3', start:17500, end:28000, label:'S3: 5 Cosmic Themes' },
    { id:'scene-4', start:28000, end:37000, label:'S4: Daily & Cognitive' },
    { id:'scene-5', start:37000, end:46000, label:'S5: Insights & Progress' },
    { id:'scene-6', start:46000, end:53000, label:'S6: Study Planner' },
    { id:'scene-7', start:53000, end:58000, label:'S7: Brand Finale' },
  ];
  const TOTAL = 58000;

  let currentMs=0, isPlaying=true, lastTs=0, lastScene=-1, bgTheme='green';
  let themeRotMs=0, curThemeIdx=0;

  function fmtSecs(ms){
    const s=Math.floor(ms/1000);
    return \`\${String(Math.floor(s/60)).padStart(2,'0')}:\${String(s%60).padStart(2,'0')}\`;
  }

  function activateScene(idx){
    if(idx===lastScene) return;
    lastScene=idx;
    SCENES.forEach((s,i)=>{
      const el=document.getElementById(s.id);
      if(el) el.classList.toggle('active', i===idx);
      const b=document.querySelector(\`button[data-scene="\${i}"]\`);
      if(b) b.classList.toggle('cur-scene', i===idx);
    });
    if(idx===0) playBassWhoosh(55, 2.0);
    else if(idx===1) { playChime(587); playBassWhoosh(70, 1.2); }
    else if(idx===2) { playChime(659); }
    else if(idx===3) { playChime(784); playBassWhoosh(80, 1.0); }
    else if(idx===4) { playChime(880); }
    else if(idx===5) { playChime(988); playBassWhoosh(75, 1.1); }
    else if(idx===6) { playChime(1174); playBassWhoosh(50, 2.5); }
  }

  function renderFrame(ts){
    if(!lastTs) lastTs=ts;
    const delta=Math.min(ts-lastTs,100);
    lastTs=ts;
    if(isPlaying){
      currentMs+=delta;
      if(currentMs>=TOTAL) currentMs=0;
      document.getElementById('scrubber').value=currentMs;
      document.getElementById('time-display').textContent=\`\${fmtSecs(currentMs)} / 00:58\`;
    }

    let si=0;
    for(let i=0;i<SCENES.length;i++){
      if(currentMs>=SCENES[i].start) si=i;
    }
    activateScene(si);

    // Dynamic timer countdown
    const elapsed=(currentMs-SCENES[1].start)/1000;
    const secs=Math.max(0,1500-Math.floor(elapsed));
    const dStr=\`\${String(Math.floor(secs/60)).padStart(2,'0')}:\${String(secs%60).padStart(2,'0')}\`;
    const td=document.getElementById('timer-display'); if(td) td.textContent=dStr;
    const st=document.getElementById('s3-timer'); if(st) st.textContent=dStr;

    // Theme switching in Scene 3
    if(si===2 && isPlaying){
      themeRotMs+=delta;
      if(themeRotMs>=2000){
        themeRotMs=0;
        curThemeIdx=(curThemeIdx+1)%THEMES.length;
        window.__activeThemeIdx = curThemeIdx;
        applyTheme(curThemeIdx);
        for(let i=0;i<5;i++){
          const tc=document.getElementById(\`tc-\${i}\`);
          if(tc) tc.classList.toggle('active-theme-chip', i===curThemeIdx);
        }
      }
    } else if(si!==2){
      window.__activeThemeIdx=0;
      applyTheme(0);
    }

    renderBg(ts, bgTheme);
    if(orb2) orb2.draw(ts);
    if(orb3) orb3.draw(ts);
    requestAnimationFrame(renderFrame);
  }
  requestAnimationFrame(renderFrame);

  // Controls Handlers
  const btnPlay=document.getElementById('btn-play');
  btnPlay.addEventListener('click', ()=>{
    initAudio();
    isPlaying=!isPlaying;
    btnPlay.textContent=isPlaying?'⏸ Pause':'▶ Play';
  });

  const btnRewind=document.getElementById('btn-rewind');
  btnRewind.addEventListener('click', ()=>{
    currentMs=0;
    document.getElementById('scrubber').value=0;
  });

  const scrubber=document.getElementById('scrubber');
  scrubber.addEventListener('input', (e)=>{
    currentMs=parseInt(e.target.value);
    document.getElementById('time-display').textContent=\`\${fmtSecs(currentMs)} / 00:58\`;
  });

  document.querySelectorAll('.scene-nav button').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      initAudio();
      const sIdx=parseInt(btn.getAttribute('data-scene'));
      currentMs=SCENES[sIdx].start;
      document.getElementById('scrubber').value=currentMs;
      activateScene(sIdx);
    });
  });

  const btnAudio=document.getElementById('btn-audio');
  btnAudio.addEventListener('click', ()=>{
    initAudio();
    if(audioCtx){
      if(audioCtx.state==='suspended') audioCtx.resume();
      else if(audioCtx.state==='running') audioCtx.suspend();
      btnAudio.textContent=(audioCtx.state==='running')?'🔊 Audio: On':'🔇 Audio: Muted';
    }
  });

  const btnFs=document.getElementById('btn-fs');
  btnFs.addEventListener('click', ()=>{
    if(!document.fullscreenElement) document.documentElement.requestFullscreen().catch(()=>{});
    else document.exitFullscreen().catch(()=>{});
  });
</script>
</body>
</html>
`;

fs.writeFileSync(path.resolve(__dirname, '..', 'promo', 'showcase-vertical.html'), verticalHtml, 'utf8');
console.log('Successfully written promo/showcase-vertical.html (length:', verticalHtml.length, ')');
