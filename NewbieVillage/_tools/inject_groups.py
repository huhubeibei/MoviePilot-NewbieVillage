"""按 term → group 映射为词典词条注入 group 字段（幂等，可重复执行）。"""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DICT_DIR = ROOT / "data" / "dict"

VIDEO_GROUPS = {
    "2160p": "分辨率",
    "1080p": "分辨率",
    "720p": "分辨率",
    "WEB-DL": "来源",
    "WEBRip": "来源",
    "HDTV": "来源",
    "BluRay": "来源",
    "BDMV": "来源",
    "REMUX": "来源",
    "DVDRip": "来源",
    "H.265 / HEVC": "视频编码",
    "H.264 / AVC": "视频编码",
    "AV1": "视频编码",
    "10bit": "视频编码",
    "DDP / DD+": "音轨",
    "TrueHD": "音轨",
    "DTS-HD MA": "音轨",
    "DD / AC3": "音轨",
    "杜比全景声 Atmos": "音轨",
    "AAC 音轨": "音轨",
    "双音轨": "音轨",
    "杜比视界 Dolby Vision": "HDR/制式",
    "HDR10+": "HDR/制式",
    "HDR": "HDR/制式",
    "SDR": "HDR/制式",
    "PROPER / REPACK": "版本",
    "IMAX Enhanced": "版本",
    "Hybrid": "版本",
    "Remastered": "版本",
    "简繁双语字幕 (CHS/CHT)": "字幕",
    "内封字幕与外挂字幕": "字幕",
    "S01E01 季集标记": "季集与识别",
    "全季包 Season Pack": "季集与识别",
    "TS / M2TS 封装": "封装与识别",
}

MUSIC_GROUPS = {
    "FLAC": "格式",
    "APE": "格式",
    "ALAC": "格式",
    "DSF / DSD": "格式",
    "WAV": "格式",
    "MP3": "格式",
    "AAC / M4A": "格式",
    "Opus": "格式",
    "WV / WavPack": "格式",
    "AIFF": "格式",
    "16bit / 24bit": "规格",
    "采样率 (44.1kHz~192kHz)": "规格",
    "Hi-Res": "规格",
    "无损与有损": "规格",
    "MQA": "规格",
    "母带 (Master)": "规格",
    "分轨": "发行形态",
    "整轨": "发行形态",
    "CUE": "发行形态",
    "Album / EP / Single": "发行形态",
    "Bonus Track": "发行形态",
    "Vinyl Rip 黑胶转录": "来源",
    "音乐标签 (ID3/Vorbis)": "工具与概念",
    "Transcode 频谱检测": "工具与概念",
    "发行平台标记": "来源",
}

MAPPINGS = {"video.json": VIDEO_GROUPS, "music.json": MUSIC_GROUPS}


def main() -> None:
    for filename, mapping in MAPPINGS.items():
        path = DICT_DIR / filename
        data = json.loads(path.read_text(encoding="utf-8"))
        missing, assigned = [], 0
        for term in data["terms"]:
            group = mapping.get(term["term"])
            if group is None:
                missing.append(term["term"])
            else:
                term["group"] = group
                assigned += 1
        path.write_text(
            json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        print(f"{filename}: assigned {assigned}, missing {missing}")


if __name__ == "__main__":
    main()
