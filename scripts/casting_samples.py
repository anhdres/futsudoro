#!/usr/bin/env python3
"""
Futsudoro PA — casting samples.

Genera múltiples variantes por idioma con la voz del momento (la que usamos)
+ alternativas del catálogo MiniMax, todas diciendo "Próxima estación: [nombre]"
(en el idioma local).

Output: workspace/projects/Futsudoro/pa-sample/casting/{lang}_{voice-slug}.wav

Filter chain v5 aplicado.
"""
import os
import sys
import subprocess
import shutil
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from pa_sample_pilot import PA_FILTER  # noqa: E402

MODEL = "minimax/speech-2.8-hd"
OUT_DIR = Path.home() / ".openclaw/workspace/projects/Futsudoro/pa-sample/casting"
OUT_DIR.mkdir(parents=True, exist_ok=True)
CACHE_DIR = Path("/tmp/futsudoro-casting")
CACHE_DIR.mkdir(parents=True, exist_ok=True)

# Voz actualmente en uso (la baseline contra la que comparar)
# + alternativas del catálogo MiniMax por idioma.
# "auto" → va a probar todas las voces y fallar silenciosamente las que no existan.
CASTING = {
    "es": {
        "label": "Departing próxima estación, ES",
        "voices": [
            ("current", "Spanish_SereneWoman"),
            ("try", "Spanish_SereneElder"),
            ("try", "Spanish_ConfidentWoman"),
            ("try", "Spanish_SophisticatedLady"),
            ("try", "Spanish_ThoughtfulLady"),
            ("try", "Spanish_WiseLady"),
            ("try", "Spanish_Kind-heartedGirl"),
        ],
        "sample_station": "Federico Lacroze",
        "text_template": "Próxima estación: {name}",
    },
    "en": {
        "label": "Departing next station, EN",
        "voices": [
            ("current", "English_SereneWoman"),
            ("try", "English_CalmWoman"),
            ("try", "English_GracefulLady"),
            ("try", "English_Soft-SpokenGirl"),
            ("try", "English_SereneWoman"),
        ],
        "sample_station": "North Station",
        "text_template": "Next station: {name}",
    },
    "ja": {
        "label": "Departing 次の駅, JA",
        "voices": [
            ("current", "Japanese_CalmLady"),
            ("try", "Japanese_GracefulMaiden"),
            ("try", "Japanese_DependableWoman"),
            ("try", "Japanese_KindLady"),
            ("try", "Japanese_CalmLady"),
        ],
        "sample_station": "Shibuya",
        "text_template": "次は、{name}",
    },
    "fr": {
        "label": "Departing prochaine gare, FR",
        "voices": [
            ("current", "French_FemaleAnchor"),
            ("try", "French_FemaleAnchor"),
            ("try", "French_MovieLeadFemale"),
            ("try", "French_Female News Anchor"),
        ],
        "sample_station": "Paris Austerlitz",
        "text_template": "Prochaine gare: {name}",
    },
    "de": {
        "label": "Departing nächster Halt, DE",
        "voices": [
            ("current", "German_SweetLady"),
            ("try", "German_SweetLady"),
            ("try", "German_FriendlyMan"),
            ("try", "German_PlayfulMan"),
        ],
        "sample_station": "Freiburg",
        "text_template": "Nächster Halt: {name}",
    },
    "it": {
        "label": "Departing prossima fermata, IT",
        "voices": [
            ("current", "Italian_BraveHeroine"),
            ("try", "Italian_BraveHeroine"),
            ("try", "Italian_Narrator"),
            ("try", "Italian_DiligentLeader"),
            ("try", "Italian_WanderingSorcerer"),
        ],
        "sample_station": "Como San Giovanni",
        "text_template": "Prossima fermata: {name}",
    },
    "sv": {
        "label": "Departing nästa station, SV (fallback voice)",
        "voices": [
            ("current", "English_SereneWoman"),
            ("try", "English_SereneWoman"),
            ("try", "Finnish_female_4_v1"),
        ],
        "sample_station": "Stockholm",
        "text_template": "Nästa station: {name}",
    },
    "zh": {
        "label": "Departing 下一站, ZH",
        "voices": [
            ("current", "Chinese (Mandarin)_Soft_Girl"),
            ("try", "Chinese (Mandarin)_Warm_Girl"),
            ("try", "Chinese (Mandarin)_Lively_Girl"),
            ("try", "Chinese (Mandarin)_Sweet_Lady"),
            ("try", "Chinese (Mandarin)_Wise_Women"),
        ],
        "sample_station": "北京站",
        "text_template": "下一站：{name}",
    },
    "hi": {
        "label": "Departing अगला स्टेशन, HI",
        "voices": [
            ("current", "hindi_female_2_v1"),
            ("try", "hindi_female_2_v1"),
            ("try", "hindi_female_1_v2"),
        ],
        "sample_station": "Roha",
        "text_template": "अगला स्टेशन: {name}",
    },
}


def slugify(name: str) -> str:
    return (
        name.lower()
        .replace(" ", "_")
        .replace("(", "")
        .replace(")", "")
        .replace(",", "")
    )


def tts_generate(text: str, voice_id: str, output_path: Path) -> bool:
    cmd = [
        "openclaw", "capability", "tts", "convert",
        "--model", MODEL,
        "--voice", voice_id,
        "--text", text,
        "--output", str(output_path),
    ]
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
    if r.returncode != 0 or not output_path.exists():
        return False
    return True


def apply_pa(mp3_path: Path, out_wav: Path) -> bool:
    cmd = [
        "ffmpeg", "-y", "-loglevel", "error",
        "-i", str(mp3_path),
        "-af", PA_FILTER,
        "-ar", "32000",
        "-ac", "1",
        str(out_wav),
    ]
    r = subprocess.run(cmd, capture_output=True, text=True)
    return r.returncode == 0


def main():
    if not shutil.which("openclaw") or not shutil.which("ffmpeg"):
        print("Error: openclaw y ffmpeg necesarios")
        sys.exit(1)

    summary = []
    for lang, spec in CASTING.items():
        print(f"\n=== {lang.upper()} — {spec['label']} ===")
        text = spec["text_template"].format(name=spec["sample_station"])
        for tag, voice in spec["voices"]:
            slug = slugify(voice)
            tag_suffix = "" if tag == "current" else f"_{tag}"
            out_name = f"{lang}_{slug}{tag_suffix}.wav"
            out_path = OUT_DIR / out_name
            if out_path.exists():
                print(f"  {out_name} (cached)")
                continue
            print(f"  {voice} → {text!r}")
            mp3_path = CACHE_DIR / f"{lang}_{slug}.mp3"
            ok = tts_generate(text, voice, mp3_path)
            if not ok:
                print(f"    [skip — voz no existe o error]")
                continue
            if not apply_pa(mp3_path, out_path):
                print(f"    [skip — ffmpeg error]")
                continue
            print(f"    → {out_name} ({out_path.stat().st_size // 1024} KB)")
            summary.append((lang, voice, out_name))

    print(f"\n✓ Total: {len(summary)} samples en {OUT_DIR}/")
    print("\nResumen por idioma:")
    for lang in CASTING:
        count = sum(1 for s in summary if s[0] == lang)
        print(f"  {lang}: {count} samples")


if __name__ == "__main__":
    main()