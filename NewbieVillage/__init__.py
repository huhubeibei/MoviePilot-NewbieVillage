"""
影音新手村插件入口。

面向影视/音乐新手的术语词典、命名解析与联动预告。
M1（当前）：骨架 + 词典 + 案例 + 每日一词卡片 + 远端词典刷新。
M2 预留：命名解析器与联动预告；M4 预留：LLM 兜底。见 docs/实现方案共识.md。
"""

import time
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from fastapi import Query

from app import schemas
from app.api.endpoints.plugin import register_plugin_api
from app.plugins import _PluginBase
from app.sdk.events import Event, eventmanager
from app.sdk.logging import logger
from app.schemas.types import EventType

from .app.case_service import CaseService
from .app.dict_service import DictService
from .app.parse_engine import ParseEngine
from .app.preview_service import PreviewService
from .app.remote_dict import fetch_remote_dict, save_remote_dict, validate_remote_dict

# 配置默认值集中定义，init_plugin 规范化与前端默认表单共用。
DEFAULT_CONFIG: Dict[str, Any] = {
    "enabled": False,
    "show_sidebar": True,
    # 远端词典 JSON 地址，M3 发布词典仓库后填入；留空表示未启用远端刷新。
    "remote_dict_url": "",
    "auto_refresh_days": 7,
    "llm_fallback": False,
}


class NewbieVillage(_PluginBase):
    """
    影音新手村：词典 | 解析 | 案例 | 体检（v2.0）。
    """

    plugin_name = "影音新手村"
    plugin_desc = "影视/音乐新手词典、命名解析与联动预告，新手村通关手册。"
    plugin_icon = "icon.png"
    plugin_version = "1.0.1"
    plugin_author = "jinyu"
    plugin_order = 60

    def __init__(self):
        super().__init__()
        self._config: Dict[str, Any] = dict(DEFAULT_CONFIG)
        self._dict_service: Optional[DictService] = None
        self._case_service: Optional[CaseService] = None
        self._parse_engine: Optional[ParseEngine] = None
        self._preview_service: Optional[PreviewService] = None

    # ---------- 配置 ----------

    def init_plugin(self, config: dict = None) -> None:
        """读取并规范化配置；首载或字段缺失时回写默认值。"""
        raw = config or {}
        merged = dict(DEFAULT_CONFIG)
        merged.update({k: v for k, v in raw.items() if k in DEFAULT_CONFIG})
        try:
            days = int(merged.get("auto_refresh_days", DEFAULT_CONFIG["auto_refresh_days"]))
        except (TypeError, ValueError):
            days = DEFAULT_CONFIG["auto_refresh_days"]
        merged["auto_refresh_days"] = min(max(days, 0), 365)
        self._config = merged
        if raw != merged:
            self.update_config(merged)

    def _current_config(self) -> Dict[str, Any]:
        return dict(self._config)

    def get_state(self) -> bool:
        return bool(self._config.get("enabled"))

    # ---------- 服务对象 ----------

    def _builtin_dir(self) -> Path:
        return Path(__file__).parent / "data" / "dict"

    def _cases_dir(self) -> Path:
        return Path(__file__).parent / "data" / "cases"

    def _remote_dir(self) -> Path:
        return Path(self.get_data_path()) / "dict"

    @property
    def dict_service(self) -> DictService:
        if self._dict_service is None:
            self._dict_service = DictService(
                builtin_dir=self._builtin_dir(), remote_dir=self._remote_dir()
            )
        return self._dict_service

    @property
    def case_service(self) -> CaseService:
        if self._case_service is None:
            self._case_service = CaseService(self._cases_dir())
        return self._case_service

    def _parser_dir(self) -> Path:
        return Path(__file__).parent / "data" / "parser"

    @property
    def parse_engine(self) -> ParseEngine:
        if self._parse_engine is None:
            self._parse_engine = ParseEngine([self._parser_dir()])
        return self._parse_engine

    @property
    def preview_service(self) -> PreviewService:
        if self._preview_service is None:
            self._preview_service = PreviewService(self.systemconfig)
        return self._preview_service

    # ---------- 渲染与导航 ----------

    @staticmethod
    def get_render_mode() -> Tuple[str, str]:
        """vue 联邦模式：侧栏页面 / 仪表盘 / 配置 / 详情全部由前端组件提供。"""
        return "vue", "dist/assets"

    def get_sidebar_nav(self) -> List[Dict[str, Any]]:
        if not self.get_state() or not self._config.get("show_sidebar", True):
            return []
        return [
            {
                "nav_key": "main",
                "title": "影音新手村",
                "icon": "mdi-school",
                "section": "organize",
                "permission": "manage",
                "order": 60,
            }
        ]

    def get_form(self) -> Tuple[List[dict], Dict[str, Any]]:
        """vue 模式：vuetify 表单为空，Config 组件自行渲染并保存。"""
        return [], self._current_config()

    def get_page(self) -> List[dict]:
        """vue 模式：详情页由联邦 Page 组件提供。"""
        return []

    # ---------- 仪表盘 ----------

    def get_dashboard_meta(self) -> List[Dict[str, str]]:
        return [{"key": "daily", "name": "每日一词"}]

    def get_dashboard(
        self, key: str = "", **kwargs: Any
    ) -> Optional[Tuple[Dict[str, Any], Dict[str, Any], None]]:
        """vue 模式第三元素传 None，宿主自动加载联邦 Dashboard 组件。"""
        if key not in ("", "daily"):
            return None
        cols = {"cols": 12, "md": 6, "sm": 12}
        attrs = {"border": True, "title": "每日一词", "subtitle": "影音新手村"}
        return cols, attrs, None

    # ---------- API ----------

    def get_api(self) -> List[Dict[str, Any]]:
        return [
            {"path": "/dict", "endpoint": self.api_dict, "methods": ["GET"],
             "auth": "bear", "summary": "获取词典"},
            {"path": "/dict/daily", "endpoint": self.api_daily, "methods": ["GET"],
             "auth": "bear", "summary": "获取每日一词"},
            {"path": "/dict/status", "endpoint": self.api_dict_status, "methods": ["GET"],
             "auth": "bear", "summary": "获取词典版本状态"},
            {"path": "/dict/refresh", "endpoint": self.api_dict_refresh, "methods": ["POST"],
             "auth": "bear", "summary": "立即刷新远端词典"},
            {"path": "/parse", "endpoint": self.api_parse, "methods": ["POST"],
             "auth": "bear", "summary": "解析文件名"},
            {"path": "/parse/preview", "endpoint": self.api_parse_preview, "methods": ["POST"],
             "auth": "bear", "summary": "解析文件名并联动预告整理去向"},
            {"path": "/cases", "endpoint": self.api_cases, "methods": ["GET"],
             "auth": "bear", "summary": "获取案例列表"},
            {"path": "/cases/{case_id}", "endpoint": self.api_case_detail, "methods": ["GET"],
             "auth": "bear", "summary": "获取案例详情"},
            {"path": "/config", "endpoint": self.api_update_config, "methods": ["POST"],
             "auth": "bear", "summary": "保存插件配置"},
        ]

    def api_dict(
        self, domain: Optional[str] = Query(None), q: Optional[str] = Query(None)
    ) -> schemas.Response:
        try:
            return schemas.Response(success=True, data=self.dict_service.list_terms(domain=domain, q=q))
        except Exception as err:
            logger.error(f"影音新手村获取词典失败：{err}")
            return schemas.Response(success=False, message=f"获取词典失败：{err}")

    def api_daily(self) -> schemas.Response:
        try:
            return schemas.Response(success=True, data=self.dict_service.daily_term())
        except Exception as err:
            logger.error(f"影音新手村获取每日一词失败：{err}")
            return schemas.Response(success=False, message=f"获取每日一词失败：{err}")

    def api_dict_status(self) -> schemas.Response:
        try:
            return schemas.Response(success=True, data=self.dict_service.status())
        except Exception as err:
            logger.error(f"影音新手村获取词典状态失败：{err}")
            return schemas.Response(success=False, message=f"获取词典状态失败：{err}")

    def api_dict_refresh(self) -> schemas.Response:
        """手动刷新远端词典；未配置或校验失败时明确报错，不影响现有词典。"""
        url = str(self._config.get("remote_dict_url") or "").strip()
        if not url:
            return schemas.Response(success=False, message="未配置远端词典 URL，请在插件配置中填写")
        try:
            data, err = fetch_remote_dict(url)
            if err:
                return schemas.Response(success=False, message=err)
            current = self.dict_service.active_version()
            err = validate_remote_dict(data, current)
            if err:
                return schemas.Response(success=False, message=err)
            meta = save_remote_dict(self._remote_dir(), data, url)
            self.dict_service.invalidate()
            return schemas.Response(success=True, data=meta, message="远端词典刷新成功")
        except Exception as err:
            logger.error(f"影音新手村刷新远端词典失败：{err}")
            return schemas.Response(success=False, message=f"刷新失败：{err}")

    def api_parse(self, payload: Optional[dict] = None) -> schemas.Response:
        """纯规则解析：text 必填，kind 可选 auto/video/music。"""
        try:
            text = str((payload or {}).get("text") or "")
            kind = str((payload or {}).get("kind") or "auto")
            return schemas.Response(success=True, data=self.parse_engine.parse(text, kind=kind))
        except Exception as err:
            logger.error(f"影音新手村解析失败：{err}")
            return schemas.Response(success=False, message=f"解析失败：{err}")

    def api_parse_preview(self, payload: Optional[dict] = None) -> schemas.Response:
        """规则解析 + 联动预告（读取真实目录配置与分类策略模拟，只读）。"""
        try:
            text = str((payload or {}).get("text") or "")
            kind = str((payload or {}).get("kind") or "auto")
            parsed = self.parse_engine.parse(text, kind=kind)
            preview = self.preview_service.preview(parsed)
            return schemas.Response(success=True, data={"parse": parsed, "preview": preview})
        except Exception as err:
            logger.error(f"影音新手村联动预告失败：{err}")
            return schemas.Response(success=False, message=f"联动预告失败：{err}")

    def api_cases(self) -> schemas.Response:
        try:
            return schemas.Response(success=True, data=self.case_service.list_cases())
        except Exception as err:
            logger.error(f"影音新手村获取案例列表失败：{err}")
            return schemas.Response(success=False, message=f"获取案例列表失败：{err}")

    def api_case_detail(self, case_id: str) -> schemas.Response:
        try:
            case = self.case_service.get_case(case_id)
            if not case:
                return schemas.Response(success=False, message=f"案例不存在：{case_id}")
            return schemas.Response(success=True, data=case)
        except Exception as err:
            logger.error(f"影音新手村获取案例详情失败：{err}")
            return schemas.Response(success=False, message=f"获取案例详情失败：{err}")

    def api_update_config(self, payload: Optional[dict] = None) -> schemas.Response:
        """保存配置并即时生效（前端 Config 组件调用）。"""
        try:
            incoming = payload or {}
            merged = dict(self._config)
            merged.update({k: v for k, v in incoming.items() if k in DEFAULT_CONFIG})
            self.init_plugin(merged)
            return schemas.Response(success=True, data=self._current_config(), message="配置已保存")
        except Exception as err:
            logger.error(f"影音新手村保存配置失败：{err}")
            return schemas.Response(success=False, message=f"保存配置失败：{err}")

    # ---------- 定时服务 ----------

    def get_service(self) -> List[Dict[str, Any]]:
        """词典远端刷新检查：每天 04:30 检查，按 auto_refresh_days 决定是否实际拉取。"""
        if not self.get_state() or int(self._config.get("auto_refresh_days") or 0) <= 0:
            return []
        return [
            {
                "id": "NewbieVillageDictRefresh",
                "name": "词典远端刷新检查",
                "trigger": "cron",
                "func": self.check_remote_dict,
                "kwargs": {"hour": 4, "minute": 30},
            }
        ]

    def check_remote_dict(self) -> None:
        """按周期拉取远端词典；任何失败只记日志，不影响现有词典。"""
        url = str(self._config.get("remote_dict_url") or "").strip()
        if not url:
            return
        meta = self.dict_service.remote_meta()
        if meta:
            fetched = meta.get("fetched_ts") or 0
            days = int(self._config.get("auto_refresh_days") or 7)
            if fetched and time.time() - float(fetched) < days * 86400:
                return
        data, err = fetch_remote_dict(url)
        if err:
            logger.warning(f"影音新手村远端词典检查失败：{err}")
            return
        err = validate_remote_dict(data, self.dict_service.active_version())
        if err:
            logger.warning(f"影音新手村远端词典校验未通过：{err}")
            return
        save_remote_dict(self._remote_dir(), data, url)
        self.dict_service.invalidate()
        logger.info(f"影音新手村远端词典已自动更新至 v{data.get('version')}")

    # ---------- 生命周期 ----------

    @eventmanager.register(EventType.PluginReload)
    def reload(self, event: Event) -> None:
        """插件重载后重新注册动态 API 与定时任务（对齐 brushflow 约定）。"""
        if event and event.event_data.get("plugin_id") == self.__class__.__name__:
            register_plugin_api(plugin_id=self.__class__.__name__)

    def stop_service(self) -> None:
        pass
