const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const FFMPEG = 'C:\\Users\\swati\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.1-full_build\\bin\\ffmpeg.exe';
const FONT_BOLD = 'C\\:/Windows/Fonts/segoeuib.ttf';
const FONT_REG = 'C\\:/Windows/Fonts/segoeui.ttf';

const TEMP_DIR = path.resolve(__dirname, 'temp_reel');
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

const OUTPUT_MP4 = path.resolve(__dirname, '..', 'promo', 'FocusDot-Reel-9x16.mp4');

console.log('--- GENERATING FOCUSDOT 9:16 CINEMATIC REEL (1080 x 1920) ---');

function runFFmpeg(cmd, desc, outPath) {
  if (outPath && fs.existsSync(outPath) && fs.statSync(outPath).size > 1000) {
    console.log(`[i] Skipping ${desc} (already rendered).`);
    return;
  }
  console.log(`[+] Rendering: ${desc}...`);
  execSync(`"${FFMPEG}" -y ${cmd}`, { stdio: 'inherit' });
}

// ---------------------------------------------------------------------------
// SCENE 1: Intro Brand Opening (4.5s)
// ---------------------------------------------------------------------------
const s1Out = path.join(TEMP_DIR, 'scene1.mp4');
const s1Cmd = `-f lavfi -i "color=c=0x030508:s=1080x1920:d=4.5:r=30" -vf "` +
  `drawbox=x=0:y=0:w=1080:h=1920:color=0x080A0F@0.9:t=fill,` +
  `drawbox=x=140:y=680:w=800:h=460:color=0x11141D@0.7:t=fill,` +
  `drawbox=x=140:y=680:w=800:h=460:color=0xD2FF3A@0.25:t=2,` +
  `drawtext=fontfile='${FONT_BOLD}':text='F O C U S D O T':fontcolor=white:fontsize=84:x=(w-text_w)/2:y=760,` +
  `drawtext=fontfile='${FONT_BOLD}':text='DEEP FLOW MODE':fontcolor=0xD2FF3A:fontsize=32:x=(w-text_w)/2:y=870,` +
  `drawtext=fontfile='${FONT_REG}':text='THE ATTENTION CONTROL REVOLUTION':fontcolor=0x8E92A0:fontsize=22:x=(w-text_w)/2:y=940,` +
  `drawtext=fontfile='${FONT_BOLD}':text='STUDENT PRODUCTIVITY REDEFINED':fontcolor=white@0.9:fontsize=20:x=(w-text_w)/2:y=1010,` +
  `drawtext=fontfile='${FONT_BOLD}':text='• FOCUSDOT OFFICIAL SHOWCASE •':fontcolor=0xD2FF3A:fontsize=18:x=(w-text_w)/2:y=120,` +
  `drawtext=fontfile='${FONT_REG}':text='1080 x 1920  |  30 FPS  |  ULTRA HD':fontcolor=0x555A68:fontsize=16:x=(w-text_w)/2:y=1780` +
  `" -c:v libx264 -pix_fmt yuv420p "${s1Out}"`;
runFFmpeg(s1Cmd, 'Scene 1: Opening Title', s1Out);

// ---------------------------------------------------------------------------
// SCENE 2: Cosmic Orb Timer (5.5s)
// ---------------------------------------------------------------------------
const s2Out = path.join(TEMP_DIR, 'scene2.mp4');
const imgTimer = path.resolve(__dirname, '..', 'assets', 'screenshots', 'timer_screen.png').replace(/\\/g, '/');
const s2Cmd = `-f lavfi -i "color=c=0x030508:s=1080x1920:d=5.5:r=30" -i "${imgTimer}" -filter_complex "` +
  `[1:v]scale=720:1016:force_original_aspect_ratio=decrease,pad=740:1036:(ow-iw)/2:(oh-ih)/2:color=0x1E2330[phone];` +
  `[0:v][phone]overlay=(W-w)/2:320[bg];` +
  `[bg]drawbox=x=140:y=290:w=800:h=1096:color=0xD2FF3A@0.2:t=2,` +
  `drawtext=fontfile='${FONT_BOLD}':text='FOCUSDOT  •  DEEP FLOW MODE':fontcolor=0x8E92A0:fontsize=20:x=(w-text_w)/2:y=100,` +
  `drawtext=fontfile='${FONT_BOLD}':text='• 01 / 04 - 3D COSMIC TIMER •':fontcolor=0xD2FF3A:fontsize=22:x=(w-text_w)/2:y=200,` +
  `drawtext=fontfile='${FONT_BOLD}':text='Bioluminescent Flow Orb':fontcolor=white:fontsize=46:x=(w-text_w)/2:y=1460,` +
  `drawtext=fontfile='${FONT_BOLD}':text='Raymarched 3D Shader  •  25-00 Pomodoro Focus':fontcolor=0xD2FF3A:fontsize=25:x=(w-text_w)/2:y=1525,` +
  `drawtext=fontfile='${FONT_REG}':text='Integrated 40Hz acoustic Gamma waves & haptic pulse':fontcolor=0x8E92A0:fontsize=22:x=(w-text_w)/2:y=1575,` +
  `drawtext=fontfile='${FONT_BOLD}':text='focusdotflow.vercel.app':fontcolor=white@0.6:fontsize=20:x=(w-text_w)/2:y=1780` +
  `" -c:v libx264 -pix_fmt yuv420p "${s2Out}"`;
runFFmpeg(s2Cmd, 'Scene 2: Cosmic Orb Timer', s2Out);

// ---------------------------------------------------------------------------
// SCENE 3: Daily Planner & Cognitive States (5.5s)
// ---------------------------------------------------------------------------
const s3Out = path.join(TEMP_DIR, 'scene3.mp4');
const imgPlanner = path.resolve(__dirname, '..', 'assets', 'screenshots', 'daily_planner.png').replace(/\\/g, '/');
const s3Cmd = `-f lavfi -i "color=c=0x030508:s=1080x1920:d=5.5:r=30" -i "${imgPlanner}" -filter_complex "` +
  `[1:v]scale=720:1016:force_original_aspect_ratio=decrease,pad=740:1036:(ow-iw)/2:(oh-ih)/2:color=0x1E2330[phone];` +
  `[0:v][phone]overlay=(W-w)/2:320[bg];` +
  `[bg]drawbox=x=140:y=290:w=800:h=1096:color=0xD2FF3A@0.2:t=2,` +
  `drawtext=fontfile='${FONT_BOLD}':text='FOCUSDOT  •  DEEP FLOW MODE':fontcolor=0x8E92A0:fontsize=20:x=(w-text_w)/2:y=100,` +
  `drawtext=fontfile='${FONT_BOLD}':text='• 02 / 04 - COGNITIVE FOCUS STATES •':fontcolor=0xD2FF3A:fontsize=22:x=(w-text_w)/2:y=200,` +
  `drawtext=fontfile='${FONT_BOLD}':text='Calibrate Your Mental Focus':fontcolor=white:fontsize=46:x=(w-text_w)/2:y=1460,` +
  `drawtext=fontfile='${FONT_BOLD}':text='Brain Fog  •  Restless  •  Balanced  •  In Flow  •  Peak':fontcolor=0xD2FF3A:fontsize=23:x=(w-text_w)/2:y=1525,` +
  `drawtext=fontfile='${FONT_REG}':text='14-Day Streak  •  Active Sleep (6.5/8h) & Hydration (5/8)':fontcolor=0x8E92A0:fontsize=22:x=(w-text_w)/2:y=1575,` +
  `drawtext=fontfile='${FONT_BOLD}':text='focusdotflow.vercel.app':fontcolor=white@0.6:fontsize=20:x=(w-text_w)/2:y=1780` +
  `" -c:v libx264 -pix_fmt yuv420p "${s3Out}"`;
runFFmpeg(s3Cmd, 'Scene 3: Daily Planner & Mental States', s3Out);

// ---------------------------------------------------------------------------
// SCENE 4: Curriculum Study Scheduling (5.5s)
// ---------------------------------------------------------------------------
const s4Out = path.join(TEMP_DIR, 'scene4.mp4');
const imgStudy = path.resolve(__dirname, '..', 'assets', 'screenshots', 'study_plan.png').replace(/\\/g, '/');
const s4Cmd = `-f lavfi -i "color=c=0x030508:s=1080x1920:d=5.5:r=30" -i "${imgStudy}" -filter_complex "` +
  `[1:v]scale=720:1016:force_original_aspect_ratio=decrease,pad=740:1036:(ow-iw)/2:(oh-ih)/2:color=0x1E2330[phone];` +
  `[0:v][phone]overlay=(W-w)/2:320[bg];` +
  `[bg]drawbox=x=140:y=290:w=800:h=1096:color=0xD2FF3A@0.2:t=2,` +
  `drawtext=fontfile='${FONT_BOLD}':text='FOCUSDOT  •  DEEP FLOW MODE':fontcolor=0x8E92A0:fontsize=20:x=(w-text_w)/2:y=100,` +
  `drawtext=fontfile='${FONT_BOLD}':text='• 03 / 04 - CURRICULUM TASK BLOCKS •':fontcolor=0xD2FF3A:fontsize=22:x=(w-text_w)/2:y=200,` +
  `drawtext=fontfile='${FONT_BOLD}':text='Structured Session Architecture':fontcolor=white:fontsize=46:x=(w-text_w)/2:y=1460,` +
  `drawtext=fontfile='${FONT_BOLD}':text='Chemistry  •  Mathematics  •  Physics Study Modules':fontcolor=0xD2FF3A:fontsize=24:x=(w-text_w)/2:y=1525,` +
  `drawtext=fontfile='${FONT_REG}':text='Automated task timing, completion tags & topic progress':fontcolor=0x8E92A0:fontsize=22:x=(w-text_w)/2:y=1575,` +
  `drawtext=fontfile='${FONT_BOLD}':text='focusdotflow.vercel.app':fontcolor=white@0.6:fontsize=20:x=(w-text_w)/2:y=1780` +
  `" -c:v libx264 -pix_fmt yuv420p "${s4Out}"`;
runFFmpeg(s4Cmd, 'Scene 4: Curriculum Tasks', s4Out);

// ---------------------------------------------------------------------------
// SCENE 5: Acoustic Deck & Themes (5.5s)
// ---------------------------------------------------------------------------
const s5Out = path.join(TEMP_DIR, 'scene5.mp4');
const imgSound = path.resolve(__dirname, '..', 'assets', 'screenshots', 'soundscape_deck.png').replace(/\\/g, '/');
const s5Cmd = `-f lavfi -i "color=c=0x030508:s=1080x1920:d=5.5:r=30" -i "${imgSound}" -filter_complex "` +
  `[1:v]scale=740:560:force_original_aspect_ratio=decrease,pad=760:580:(ow-iw)/2:(oh-ih)/2:color=0x1E2330[sound];` +
  `[0:v][sound]overlay=(W-w)/2:540[bg];` +
  `[bg]drawbox=x=140:y=510:w=800:h=640:color=0xD2FF3A@0.2:t=2,` +
  `drawtext=fontfile='${FONT_BOLD}':text='FOCUSDOT  •  DEEP FLOW MODE':fontcolor=0x8E92A0:fontsize=20:x=(w-text_w)/2:y=100,` +
  `drawtext=fontfile='${FONT_BOLD}':text='• 04 / 04 - ACOUSTIC SYNCHRONIZATION •':fontcolor=0xD2FF3A:fontsize=22:x=(w-text_w)/2:y=200,` +
  `drawtext=fontfile='${FONT_BOLD}':text='40Hz Binaural Beats Deck':fontcolor=white:fontsize=46:x=(w-text_w)/2:y=1380,` +
  `drawtext=fontfile='${FONT_BOLD}':text='Gamma Wave Focus  •  Rain Calm  •  Deep Drone':fontcolor=0xD2FF3A:fontsize=24:x=(w-text_w)/2:y=1445,` +
  `drawtext=fontfile='${FONT_REG}':text='5 Sphere Themes - Bioluminescent, Cosmic Amethyst & Crimson':fontcolor=0x8E92A0:fontsize=22:x=(w-text_w)/2:y=1500,` +
  `drawtext=fontfile='${FONT_BOLD}':text='focusdotflow.vercel.app':fontcolor=white@0.6:fontsize=20:x=(w-text_w)/2:y=1780` +
  `" -c:v libx264 -pix_fmt yuv420p "${s5Out}"`;
runFFmpeg(s5Cmd, 'Scene 5: Acoustic Soundscapes', s5Out);

// ---------------------------------------------------------------------------
// SCENE 6: Outro & Call to Action (4.5s)
// ---------------------------------------------------------------------------
const s6Out = path.join(TEMP_DIR, 'scene6.mp4');
const s6Cmd = `-f lavfi -i "color=c=0x030508:s=1080x1920:d=4.5:r=30" -vf "` +
  `drawbox=x=120:y=620:w=840:h=680:color=0x11141D@0.8:t=fill,` +
  `drawbox=x=120:y=620:w=840:h=680:color=0xD2FF3A@0.35:t=3,` +
  `drawtext=fontfile='${FONT_BOLD}':text='F O C U S D O T':fontcolor=white:fontsize=84:x=(w-text_w)/2:y=710,` +
  `drawtext=fontfile='${FONT_BOLD}':text='DEEP FLOW MODE':fontcolor=0xD2FF3A:fontsize=32:x=(w-text_w)/2:y=810,` +
  `drawtext=fontfile='${FONT_BOLD}':text='Focus on what matters.':fontcolor=white@0.9:fontsize=32:x=(w-text_w)/2:y=890,` +
  `drawbox=x=220:y=980:w=640:h=70:color=0xD2FF3A:t=fill,` +
  `drawtext=fontfile='${FONT_BOLD}':text='LAUNCH LIVE APPLICATION':fontcolor=0x080A0F:fontsize=26:x=(w-text_w)/2:y=1000,` +
  `drawtext=fontfile='${FONT_BOLD}':text='focusdotflow.vercel.app':fontcolor=white:fontsize=30:x=(w-text_w)/2:y=1110,` +
  `drawtext=fontfile='${FONT_REG}':text='Install as Standalone PWA  •  Zero Setup Required':fontcolor=0x8E92A0:fontsize=22:x=(w-text_w)/2:y=1180,` +
  `drawtext=fontfile='${FONT_BOLD}':text='• READY TO MASTER YOUR ATTENTION? •':fontcolor=0xD2FF3A:fontsize=20:x=(w-text_w)/2:y=120` +
  `" -c:v libx264 -pix_fmt yuv420p "${s6Out}"`;
runFFmpeg(s6Cmd, 'Scene 6: Outro Brand Reveal', s6Out);

// ---------------------------------------------------------------------------
// CONCATENATE ALL SCENES WITH BINAURAL PROCEDURAL SOUNDTRACK
// ---------------------------------------------------------------------------
console.log('[+] Generating concat list...');
const concatListPath = path.join(TEMP_DIR, 'concat.txt');
const listContent = [
  `file '${s1Out.replace(/\\/g, '/')}'`,
  `file '${s2Out.replace(/\\/g, '/')}'`,
  `file '${s3Out.replace(/\\/g, '/')}'`,
  `file '${s4Out.replace(/\\/g, '/')}'`,
  `file '${s5Out.replace(/\\/g, '/')}'`,
  `file '${s6Out.replace(/\\/g, '/')}'`
].join('\n');
fs.writeFileSync(concatListPath, listContent, 'utf8');

// Combine video + Generate 31s 40Hz binaural soundtrack (200Hz + 240Hz) with sub-bass drone
console.log('[+] Rendering final 9:16 master MP4 with stereo binaural soundscape...');
const totalDuration = 31.0;
const finalCmd = `-f concat -safe 0 -i "${concatListPath}" ` +
  `-f lavfi -i "anoisesrc=d=${totalDuration}:c=pink:r=48000:a=0.015" ` +
  `-f lavfi -i "sine=frequency=200:duration=${totalDuration}" ` +
  `-f lavfi -i "sine=frequency=240:duration=${totalDuration}" ` +
  `-f lavfi -i "sine=frequency=55:duration=${totalDuration}" ` +
  `-filter_complex "` +
  `[2:a]volume=0.18[left];` +
  `[3:a]volume=0.18[right];` +
  `[left][right]join=inputs=2:channel_layout=stereo[binaural];` +
  `[4:a]volume=0.25,lowpass=f=120[subbass];` +
  `[1:a][binaural][subbass]amix=inputs=3:duration=first:dropout_transition=2[audio_mix];` +
  `[audio_mix]afade=t=in:ss=0:d=1.5,afade=t=out:st=28.5:d=2.5[aout]` +
  `" ` +
  `-map 0:v -map "[aout]" ` +
  `-c:v copy ` +
  `-c:a aac -b:a 192k -ar 48000 ` +
  `-movflags +faststart ` +
  `"${OUTPUT_MP4}"`;

runFFmpeg(finalCmd, 'Final 9:16 Video Master Export');

console.log('-------------------------------------------------------------');
console.log('SUCCESS! Video file generated at:');
console.log(OUTPUT_MP4);
console.log('Size:', fs.statSync(OUTPUT_MP4).size, 'bytes');
console.log('-------------------------------------------------------------');
