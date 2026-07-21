#!/usr/bin/env python3
"""
Futsudoro PA station announcement pilot — MiniMax TTS via openclaw CLI.

Wrapper sobre `openclaw capability tts convert` que:
1. Genera el wav con MiniMax TTS (modelo speech-2.8-hd)
2. Aplica filter chain PA v3 con ffmpeg
3. Cachea los wavs para reuso

Sample piloto: 3 líneas contraste (Yamanote JP / Urquiza ES / Commuter EN)
× 3 momentos × 3-4 estaciones cada una.
"""
import os
import sys
import json
import subprocess
import shutil
from pathlib import Path

# ── Config ──────────────────────────────────────────────────────────────
MODEL = "minimax/speech-2.8-hd"
OUT_DIR = Path("/tmp/futsudoro-pa-sample")
OUT_DIR.mkdir(parents=True, exist_ok=True)
WORKSPACE_DIR = Path.home() / ".openclaw/workspace/projects/Futsudoro/pa-sample"
WORKSPACE_DIR.mkdir(parents=True, exist_ok=True)

# Filter chain PA v4 — más crunch sutil, reverb más corto
# Andrés feedback (2026-07-21 12:34): "más crunch y reverb más corto, ahora parece eco"
# - highpass 80Hz: dejar algo de cuerpo
# - lowpass 8kHz: PA speakers reales
# - mid bump 2kHz +1dB Q=1: intelligibility
# - compressor -16dB ratio 2: nivel parejo sin aplastar
# - aecho 30ms decay 0.2: reverb corto tipo PA, sin eco de catedral
# - acrusher bits=12 level_in=1: crunch sutil sin ruido digital
# - volume boost final x1.5
PA_FILTER = (
    "highpass=f=80,"
    "lowpass=f=8000,"
    "equalizer=f=2000:width_type=q:w=1:g=1,"
    "acompressor=threshold=-16dB:ratio=2:attack=20:release=200,"
    "aecho=0.3:0.7:30:0.2,"
    "acrusher=level_in=1:level_out=0.5:bits=12:mode=lin:aa=0.5,"
    "volume=1.5"
)

# Líneas con sus voces MiniMax (gentle mujer local, criterio Andrés)
LINES = {
    "yamanote": {
        "name": "Yamanote (Tokyo)",
        "lang": "ja",
        "voice_id": "Japanese_CalmLady",
        "stations": [
            {"name": "Shinjuku", "romaji": "Shinjuku"},
            {"name": "Shibuya",  "romaji": "Shibuya"},
            {"name": "Tokyo",    "romaji": "Tokyo"},
            {"name": "Ueno",     "romaji": "Ueno"},
        ],
        "templates": {
            "arriving": "{name}",
            "approaching": "まもなく、{name}",
            "departing": "次は、{next_name}",
        }
    },
    "urquiza": {
        "name": "Urquiza (Buenos Aires)",
        "lang": "es",
        "voice_id": "Spanish_SereneWoman",
        "stations": [
            {"name": "Federico Lacroce", "romaji": None},
            {"name": "Martín Coronado",  "romaji": None},
            {"name": "Tropezón",         "romaji": None},
        ],
        "templates": {
            "arriving": "Estación {name}",
            "approaching": "Llegando a: {name}",
            "departing": "Próxima estación: {next_name}",
        }
    },
    "commuter": {
        "name": "Commuter (Massachusetts)",
        "lang": "en",
        "voice_id": "English_SereneWoman",
        "stations": [
            {"name": "North Station", "romaji": None},
            {"name": "Lynn",          "romaji": None},
            {"name": "Salem",         "romaji": None},
        ],
        "templates": {
            "arriving": "{name}",
            "approaching": "Arriving at: {name}",
            "departing": "Next station: {next_name}",
        }
    },
}


def tts_generate(text: str, voice_id: str, output_path: Path) -> bool:
    """Llama a `openclaw capability tts convert` y guarda el mp3 en output_path."""
    cmd = [
        "openclaw", "capability", "tts", "convert",
        "--model", MODEL,
        "--voice", voice_id,
        "--text", text,
        "--output", str(output_path),
    ]
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
    if r.returncode != 0 or not output_path.exists():
        print(f"  TTS error (voice={voice_id}): {r.stderr[-300:]}", file=sys.stderr)
        return False
    return True


def apply_pa(mp3_path: Path, name: str) -> Path:
    """Aplica filter chain PA v3 al mp3 y devuelve el wav final."""
    pa_path = WORKSPACE_DIR / f"{name}_pa.wav"
    cmd = [
        "ffmpeg", "-y", "-loglevel", "error",
        "-i", str(mp3_path),
        "-af", PA_FILTER,
        "-ar", "32000",
        "-ac", "1",
        str(pa_path),
    ]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(f"  ffmpeg error: {r.stderr[-300:]}", file=sys.stderr)
        return None
    return pa_path


def generate_line(line_id: str):
    line = LINES[line_id]
    stations = line["stations"]
    print(f"\n=== {line['name']} ({line['lang']}, voice={line['voice_id']}) ===")

    for i, st in enumerate(stations):
        next_st = stations[(i + 1) % len(stations)]
        for moment in ("arriving", "approaching", "departing"):
            tmpl = line["templates"][moment]
            text = tmpl.format(name=st["name"], next_name=next_st["name"])
            fname = f"{line_id}_{st['name'].replace(' ', '_').lower()}_{moment}"
            mp3_path = OUT_DIR / f"{fname}.mp3"
            print(f"  [{moment}] {text}")
            ok = tts_generate(text, line["voice_id"], mp3_path)
            if not ok:
                continue
            pa = apply_pa(mp3_path, fname)
            if pa:
                print(f"    → {pa.name} ({pa.stat().st_size // 1024} KB)")


def main():
    targets = sys.argv[1:] if len(sys.argv) > 1 else ["yamanote", "urquiza", "commuter"]
    if not shutil.which("openclaw"):
        print("Error: openclaw CLI no está en PATH")
        sys.exit(1)
    if not shutil.which("ffmpeg"):
        print("Error: ffmpeg no está instalado")
        sys.exit(1)

    for line_id in targets:
        if line_id not in LINES:
            print(f"Línea desconocida: {line_id}. Opciones: {list(LINES.keys())}")
            continue
        generate_line(line_id)

    print(f"\n✓ Wavs en {WORKSPACE_DIR}/")
    print(f"  Filter chain: {PA_FILTER}")


if __name__ == "__main__":
    main()
