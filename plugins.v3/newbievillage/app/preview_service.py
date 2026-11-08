"""
联动预告服务：解析结果 + 用户真实配置 → "这个文件会被整理到哪"。

只读模拟，绝不写任何配置。诚实的边界：
- 目录匹配复用 MP 的判据语义（类型过滤 + 优先级），数据源是真实的
  SystemConfigKey.Directories 配置；
- 二级分类规则依赖 TMDB 识别后的字段（genre_keys/language/countries），
  文件名级预告无法诚实评估，因此输出该类型的候选分类清单并明确标注
  "最终分类由识别结果决定"。
"""

from typing import Any, Dict, List, Optional

# 解析 kind → MP 媒体类型（与 TransferDirectoryConf.media_type 的取值一致）。
MEDIA_TYPE_MAP = {"music": "音乐"}
VIDEO_TYPE_MAP = {"episode": "电视剧"}


class PreviewService:
    """目录与分类联动模拟。"""

    def __init__(self, systemconfig: Any):
        self._systemconfig = systemconfig

    def preview(self, parse_result: Dict[str, Any]) -> Dict[str, Any]:
        media_type = self._guess_media_type(parse_result)
        directories = self._get_directories()
        matched, alternatives = self._match_directory(directories, media_type)

        result: Dict[str, Any] = {
            "media_type": media_type,
            "media_type_source": self._media_type_source(parse_result),
            "directory": self._directory_summary(matched) if matched else None,
            "alternatives": [self._directory_summary(d) for d in alternatives],
            "path_guess": self._path_guess(matched, media_type) if matched else None,
            "classification": self._classification_preview(media_type),
            "warnings": self._warnings(matched, directories, media_type),
            "limitations": [
                "预告基于文件名解析与当前目录配置的模拟匹配，实际整理以 MP 识别结果为准",
                "二级分类的最终归属由媒体识别（TMDB）决定，此处仅列出候选",
            ],
        }
        return result

    # ---------- 媒体类型推测 ----------

    @staticmethod
    def _guess_media_type(parse_result: Dict[str, Any]) -> str:
        kind = parse_result.get("kind") or "video"
        if MEDIA_TYPE_MAP.get(kind):
            return MEDIA_TYPE_MAP[kind]
        dims = parse_result.get("dims") or {}
        if dims.get("episode"):
            return VIDEO_TYPE_MAP.get("episode", "电视剧")
        return "电影"

    @staticmethod
    def _media_type_source(parse_result: Dict[str, Any]) -> str:
        kind = parse_result.get("kind") or "video"
        if kind == "music":
            return "解析到音乐格式标记，推测为音乐"
        if (parse_result.get("dims") or {}).get("episode"):
            return "解析到季集标记，推测为电视剧"
        return "未解析到剧集标记，默认按电影推测"

    # ---------- 目录匹配 ----------

    def _get_directories(self) -> List[Dict[str, Any]]:
        try:
            from app.schemas.types import SystemConfigKey

            dirs = self._systemconfig.get(SystemConfigKey.Directories)
        except Exception:
            dirs = None
        return [d for d in (dirs or []) if isinstance(d, dict)]

    @staticmethod
    def _match_directory(
        directories: List[Dict[str, Any]], media_type: str
    ) -> tuple[Optional[Dict[str, Any]], List[Dict[str, Any]]]:
        """类型匹配 + priority 升序（同 MP 的目录选择语义）。"""
        matched = [
            d for d in directories
            if not d.get("media_type") or d.get("media_type") == media_type
        ]
        matched.sort(key=lambda d: (d.get("priority") or 0,))
        if not matched:
            return None, []
        return matched[0], matched[1:3]

    @staticmethod
    def _directory_summary(directory: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "name": directory.get("name"),
            "media_type": directory.get("media_type") or "全部类型",
            "download_path": directory.get("download_path"),
            "library_path": directory.get("library_path"),
            "transfer_type": directory.get("transfer_type"),
            "monitor_type": directory.get("monitor_type"),
            "renaming": bool(directory.get("renaming")),
            "scraping": bool(directory.get("scraping")),
        }

    @staticmethod
    def _path_guess(directory: Dict[str, Any], media_type: str) -> str:
        """预测入库路径（不含最终识别生成的详细目录名）。"""
        parts = [str(directory.get("library_path") or "").rstrip("/")]
        if directory.get("library_type_folder"):
            parts.append(media_type)
        guess = "/".join(p for p in parts if p)
        tail = ""
        if directory.get("library_category_folder"):
            tail = "/<分类子目录，由识别结果决定>"
        return guess + tail if guess else "(目录配置缺少媒体库路径)"

    # ---------- 分类预览 ----------

    def _classification_preview(self, media_type: str) -> Dict[str, Any]:
        try:
            policy = self._systemconfig.get("MediaClassificationPolicy") or {}
        except Exception:
            policy = {}
        active = policy.get("active") or {}
        categories = [
            {"name": c.get("name"), "path": c.get("path")}
            for c in (active.get("categories") or [])
            if isinstance(c, dict)
            and c.get("enabled", True)
            and c.get("media_type") == media_type
        ]
        return {
            "mode": active.get("mode") or "first_match",
            "candidates": categories,
            "note": "最终分类由媒体识别（TMDB）结果按策略规则决定",
        }

    # ---------- 警告 ----------

    @staticmethod
    def _warnings(
        matched: Optional[Dict[str, Any]],
        directories: List[Dict[str, Any]],
        media_type: str,
    ) -> List[str]:
        warnings: List[str] = []
        if not directories:
            warnings.append("尚未配置任何目录映射，下载完成后 MP 无法整理文件")
            return warnings
        if matched is None:
            warnings.append(
                f"没有适用于「{media_type}」的目录配置，请检查目录映射的适用媒体类型"
            )
            return warnings
        transfer = (matched.get("transfer_type") or "").lower()
        if transfer == "link":
            download_root = (matched.get("download_path") or "/").strip("/").split("/")[0]
            library_root = (matched.get("library_path") or "/").strip("/").split("/")[0]
            if download_root != library_root:
                warnings.append(
                    "下载目录与媒体库目录疑似不在同一存储根下，硬链接可能退化为复制（占双倍空间）"
                )
        return warnings
