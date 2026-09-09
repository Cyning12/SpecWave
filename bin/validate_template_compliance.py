#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AICoding 架构专家团 · 模板合规自动校验器
=========================================

用途：在 G1~G5 阶段门处校验 `.workbuddy/output/` 下的产物文档是否严格遵循
      `aicoding-team-bootstrap/templates/` 中的模板章节骨架。

用法：
    python3 bin/validate_template_compliance.py --output-dir .workbuddy/output
    python3 bin/validate_template_compliance.py --output-dir .workbuddy/output --filter 高层架构设计.md
    python3 bin/validate_template_compliance.py --output-dir .workbuddy/output --json

退出码：0 = 全部通过；1 = 存在 FAIL；2 = 参数/环境错误。
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from typing import Dict, List, Tuple

# 模板目录：优先环境变量，其次专家包内标准位置
TEMPLATE_DIR_ENV = "AICODING_TEMPLATE_DIR"
DEFAULT_TEMPLATE_DIRS = [
    os.path.expanduser(
        "~/.workbuddy/plugins/cache/experts/aicoding-architecture-expert-team/1.0.0"
        "/skills/aicoding-team-bootstrap/templates"
    ),
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "templates"),
]

# 产物文件名 -> 模板文件名（同名的可省略，此处显式声明以保证可追溯）
DOC_TEMPLATE_MAP = {
    "material_digest.md": "material_digest.md",
    "research_report.md": "research_report.md",
    "高层架构设计.md": "高层架构设计.md",
    "系统设计.md": "系统设计.md",
    "UserStory.md": "UserStory.md",
    "部署设计.md": "部署设计.md",
    "安全设计.md": "安全设计.md",
}

# 模板中的"模板使用说明（必读）"与"附录：生成流程"属于模板自身的元说明，
# 产物中不需要照抄，仅作为写作纪律存在 —— 列入豁免名单。
EXEMPT_HEADING_PATTERNS = [
    r"^模版使用说明",
    r"^模板使用说明",
    r"^附录\s*A：生成流程",
    r"^附录\s*B：解析\s*Skill",
    r"^附录\s*B：配套工具清单",
    r"^附录：配套工具",
    r"^附录：生成流程",
]

# 残留占位符：出现即判 FAIL（说明章节没真写）
# 注意：只匹配"真实残留的占位标记"，不匹配"讨论占位符这件事的说明文字"
PLACEHOLDER_PATTERNS = [
    r"<<[^>\n]*>>",               # <<占位>>
    r"<请[^>\n]*>",                # <请填写>
    r"<待[^>\n]*>",                # <待补充>
    r"<[Yy][Yy][Yy][Yy]-[Mm][Mm]-[Dd][Dd]>",  # <YYYY-MM-DD>
    r"(?m)^\s*(TODO|TBD|FIXME)\s*[:：]",
    r"^\s*[-*|]?\s*(TODO|TBD)\s*$",
]

# 低信息量填充词：单独成段出现即判 WARN
THIN_FILLER = {"无", "待定", "同左", "同上", "略", "-", "—", "n/a", "N/A"}

HEADING_RE = re.compile(r"^(#{1,4})\s+(.+?)\s*$")


class Finding:
    def __init__(self, level: str, code: str, message: str):
        self.level = level  # FAIL | WARN | INFO
        self.code = code
        self.message = message

    def as_dict(self) -> Dict[str, str]:
        return {"level": self.level, "code": self.code, "message": self.message}


def resolve_template_dir(explicit: str | None) -> str:
    candidates: List[str] = []
    if explicit:
        candidates.append(explicit)
    env = os.environ.get(TEMPLATE_DIR_ENV)
    if env:
        candidates.append(env)
    candidates.extend(DEFAULT_TEMPLATE_DIRS)
    for c in candidates:
        if c and os.path.isdir(c):
            return os.path.abspath(c)
    sys.stderr.write(
        "[FATAL] 未找到模板目录。请通过 --template-dir 或环境变量 "
        f"{TEMPLATE_DIR_ENV} 指定。\n"
    )
    sys.exit(2)


def read_lines(path: str) -> List[str]:
    with open(path, "r", encoding="utf-8") as f:
        return f.read().splitlines()


def extract_headings(lines: List[str]) -> List[Tuple[int, str]]:
    """返回 [(level, text)]，跳过代码块（``` 围栏）内的伪标题。"""
    out: List[Tuple[int, str]] = []
    in_fence = False
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("```"):
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        m = HEADING_RE.match(line)
        if m:
            out.append((len(m.group(1)), m.group(2).strip()))
    return out


def is_exempt(text: str) -> bool:
    return any(re.match(p, text) for p in EXEMPT_HEADING_PATTERNS)


def normalize(text: str) -> str:
    """归一化标题文本：去掉反引号、多余空白、全角/半角差异。"""
    t = text.replace("`", "")
    t = re.sub(r"\s+", "", t)
    t = t.replace("（", "(").replace("）", ")")
    t = t.replace("：", ":").replace("，", ",")
    return t


def is_pattern_heading(text: str) -> bool:
    """模板里的参数化/可重复标题，产物只需出现同层同级同类即可。"""
    return ("<" in text and ">" in text) or "~" in text or "结构同" in text


def pattern_prefix(text: str) -> str:
    """取参数化标题的固定前缀（第一个 < 或 ~ 之前的部分）。"""
    idx = len(text)
    for ch in ("<", "~"):
        p = text.find(ch)
        if p != -1:
            idx = min(idx, p)
    return normalize(text[:idx])


def section_body(lines: List[str], start_idx: int, end_idx: int) -> str:
    body = "\n".join(lines[start_idx:end_idx])
    # 去掉围栏代码块后统计有效字符
    body = re.sub(r"```.*?```", "", body, flags=re.S)
    return body.strip()


def validate_one(doc_path: str, template_dir: str) -> Tuple[List[Finding], Dict]:
    findings: List[Finding] = []
    doc_name = os.path.basename(doc_path)
    tpl_name = DOC_TEMPLATE_MAP.get(doc_name, doc_name)
    tpl_path = os.path.join(template_dir, tpl_name)

    if not os.path.isfile(doc_path):
        return [Finding("FAIL", "E-MISSING-DOC", f"产物文件不存在：{doc_path}")], {
            "doc": doc_name
        }
    if not os.path.isfile(tpl_path):
        return [Finding("FAIL", "E-MISSING-TPL", f"模板文件不存在：{tpl_path}")], {
            "doc": doc_name
        }

    doc_lines = read_lines(doc_path)
    tpl_lines = read_lines(tpl_path)
    doc_h = extract_headings(doc_lines)
    tpl_h = extract_headings(tpl_lines)

    # 1) 必填章节覆盖检查
    required = [(lv, tx) for lv, tx in tpl_h if not is_exempt(tx)]
    doc_norm = [(lv, normalize(tx)) for lv, tx in doc_h]

    # 声明式裁剪：解析 §0 修订记录中的「未启用：§x.x（理由：...）」声明
    # 依据：模板《模版使用约定（按需裁剪）》允许整节略过，但要求显式声明。
    # 主理人补充裁定：允许略过，但**禁止序号顺延**，以保持跨文档引用与交叉 diff 稳定。
    declared_omissions: set = set()
    for line in doc_lines:
        for m in re.finditer(r"未启用\s*[:：]\s*§?\s*(\d+(?:\.\d+)*)", line):
            declared_omissions.add(m.group(1))

    def sec_number(text: str) -> str:
        m = re.match(r"^(\d+(?:\.\d+)*)", text.strip())
        return m.group(1) if m else ""

    missing: List[str] = []
    declared: List[str] = []
    matched_doc_idx = set()
    for lv, tx in required:
        if is_pattern_heading(tx):
            prefix = pattern_prefix(tx)
            hit = False
            for i, (dlv, dnorm) in enumerate(doc_norm):
                if dlv == lv and prefix and dnorm.startswith(prefix) and i not in matched_doc_idx:
                    hit = True
                    matched_doc_idx.add(i)
                    break
            if not hit:
                missing.append(f"L{lv} {tx}  (参数化章节：需至少 1 个同类章节)")
            continue
        target = normalize(tx)
        hit = False
        for i, (dlv, dnorm) in enumerate(doc_norm):
            if dlv == lv and dnorm == target and i not in matched_doc_idx:
                hit = True
                matched_doc_idx.add(i)
                break
        if not hit:
            missing.append(f"L{lv} {tx}")

    for m in missing:
        # 从 "L3 4.4 缓存与 Key 规范" 中取出 "4.4"
        title = re.sub(r"^L\d+\s+", "", m)
        num = sec_number(title)
        # 层级继承：声明 §4.4 即覆盖 §4.4 及其全部子节（§4.4.1 / §4.4.2 / ...）
        covered = num and any(
            num == d or num.startswith(d + ".") for d in declared_omissions
        )
        if covered:
            declared.append(title)
            findings.append(
                Finding(
                    "INFO",
                    "I-DECLARED-OMISSION",
                    f"按模板《按需裁剪》约定豁免（已在 §0 修订记录声明未启用）：{title}",
                )
            )
        else:
            findings.append(
                Finding(
                    "FAIL",
                    "E-MISSING-SECTION",
                    f"缺失模板章节：{m}"
                    + (
                        ""
                        if not num
                        else f"　→ 若确实不适用，须在 §0 修订记录声明「未启用：§{num}（理由：...）」方可豁免"
                    ),
                )
            )

    # 2.5) 序号顺延检测（主理人裁定禁止顺延，避免跨文档引用错位）
    tpl_num_titles: Dict[str, str] = {}
    for lv, tx in required:
        n = sec_number(tx)
        if n:
            tpl_num_titles.setdefault(n, normalize(tx))
    for lv, tx in doc_h:
        n = sec_number(tx)
        if not n or n not in tpl_num_titles:
            continue
        if normalize(tx) != tpl_num_titles[n] and not tpl_num_titles[n].startswith(normalize(tx)[:0] or "\0"):
            findings.append(
                Finding(
                    "WARN",
                    "W-NUMBER-REUSE",
                    f"疑似序号顺延：文档 §{n} 标题为「{tx}」，模板 §{n} 为「{tpl_num_titles[n]}」"
                    f"　→ 裁定：保留原编号、允许不连续，禁止顺延",
                )
            )

    # 2) 章节顺序检查（以模板中出现的相对顺序为基线）
    tpl_seq = [
        (normalize(tx) if not is_pattern_heading(tx) else pattern_prefix(tx), lv, tx)
        for lv, tx in required
    ]
    doc_norms = [(i, lv, normalize(tx)) for i, (lv, tx) in enumerate(doc_h)]

    cursor = -1
    for key, lv, tx in tpl_seq:
        if not key:
            continue
        # 参数化标题用前缀匹配，普通标题用精确匹配；只接受层次一致的命中
        is_param = is_pattern_heading(tx)
        cands = [
            i
            for i, dlv, dnorm in doc_norms
            if i > cursor
            and dlv == lv
            and (dnorm.startswith(key) if is_param else dnorm == key)
        ]
        if not cands:
            findings.append(
                Finding("WARN", "W-SECTION-ORDER", f"章节顺序与模板不一致或缺失：{tx}")
            )
        else:
            cursor = cands[0]

    # 3) 空章节检查（跳过模板元说明区与代码块）
    heading_line_idx: List[int] = []
    in_fence = False
    for i, line in enumerate(doc_lines):
        if line.strip().startswith("```"):
            in_fence = not in_fence
            continue
        if not in_fence and HEADING_RE.match(line):
            heading_line_idx.append(i)
    heading_line_idx.append(len(doc_lines))

    # 元说明区（模版使用说明 / 附录·生成流程 等）内的行不做内容类检查
    exempt_ranges: List[Tuple[int, int]] = []
    for k in range(len(heading_line_idx) - 1):
        s = heading_line_idx[k]
        e = heading_line_idx[k + 1]
        title = doc_lines[s].lstrip("#").strip()
        if is_exempt(title):
            exempt_ranges.append((s, e))

    def in_exempt(lineno: int) -> bool:
        return any(a <= lineno < b for a, b in exempt_ranges)

    empty_sections: List[str] = []
    for k in range(len(heading_line_idx) - 1):
        s = heading_line_idx[k]
        e = heading_line_idx[k + 1]
        title = doc_lines[s].lstrip("#").strip()
        if is_exempt(title):
            continue
        body = section_body(doc_lines, s + 1, e)
        if len(body) < 20:
            level = len(doc_lines[s]) - len(doc_lines[s].lstrip("#"))
            empty_sections.append(f"L{level} {title}")

    for es in empty_sections:
        findings.append(Finding("WARN", "W-EMPTY-SECTION", f"章节内容过短（<20 有效字符）：{es}"))

    # 4) 残留占位符（跳过代码块与元说明区）
    fence = False
    for i, line in enumerate(doc_lines):
        if line.strip().startswith("```"):
            fence = not fence
            continue
        if fence or in_exempt(i):
            continue
        for p in PLACEHOLDER_PATTERNS:
            if re.search(p, line):
                findings.append(
                    Finding("FAIL", "E-PLACEHOLDER", f"第 {i + 1} 行残留占位符：{line.strip()[:80]}")
                )
                break

    # 5) 规模硬指标：产物正文应显著展开，而非仅保留骨架
    total_chars = len("\n".join(doc_lines))
    if total_chars < 3000:
        findings.append(
            Finding("WARN", "W-TOO-SHORT", f"全文仅 {total_chars} 字符，疑似未充分展开（建议 ≥ 8000）")
        )

    # 6) 特定文档的硬指标章节
    if doc_name in ("material_digest.md", "research_report.md"):
        hard_idx = [i for i, (lv, tx) in enumerate(doc_h) if "硬指标" in tx]
        if not hard_idx:
            findings.append(
                Finding("FAIL", "E-MISSING-HARD-METRICS", f"{doc_name} 必须保留「硬指标清单」章节")
            )

    summary = {
        "doc": doc_name,
        "template": tpl_name,
        "chars": total_chars,
        "doc_headings": len(doc_h),
        "template_required_headings": len(required),
        "missing_sections": len(missing) - len(declared),
        "declared_omissions": len(declared),
        "empty_sections": len(empty_sections),
        "fail": sum(1 for f in findings if f.level == "FAIL"),
        "warn": sum(1 for f in findings if f.level == "WARN"),
    }
    return findings, summary


def main() -> int:
    ap = argparse.ArgumentParser(description="AICoding 架构文档模板合规校验器")
    ap.add_argument("--output-dir", default=".workbuddy/output", help="产物目录")
    ap.add_argument("--filter", default=None, help="只校验指定文件名（可逗号分隔）")
    ap.add_argument("--template-dir", default=None, help="模板目录")
    ap.add_argument("--json", action="store_true", help="输出 JSON")
    args = ap.parse_args()

    template_dir = resolve_template_dir(args.template_dir)
    output_dir = os.path.abspath(args.output_dir)

    if not os.path.isdir(output_dir):
        sys.stderr.write(f"[FATAL] 产物目录不存在：{output_dir}\n")
        return 2

    targets = [d for d in DOC_TEMPLATE_MAP if os.path.isfile(os.path.join(output_dir, d))]
    if args.filter:
        wanted = [x.strip() for x in args.filter.split(",") if x.strip()]
        targets = [d for d in (wanted if wanted else []) ]
        for w in wanted:
            if not os.path.isfile(os.path.join(output_dir, w)):
                sys.stderr.write(f"[FATAL] --filter 指定的文件不存在：{w}\n")
                return 2
    if not targets:
        sys.stderr.write(f"[FATAL] {output_dir} 下没有可校验的产物文档\n")
        return 2

    all_findings: Dict[str, List[Finding]] = {}
    summaries: List[Dict] = []
    for name in targets:
        findings, summary = validate_one(os.path.join(output_dir, name), template_dir)
        all_findings[name] = findings
        summaries.append(summary)

    total_fail = sum(s["fail"] for s in summaries)
    total_warn = sum(s["warn"] for s in summaries)

    if args.json:
        print(
            json.dumps(
                {
                    "output_dir": output_dir,
                    "template_dir": template_dir,
                    "total_fail": total_fail,
                    "total_warn": total_warn,
                    "summaries": summaries,
                    "findings": {k: [f.as_dict() for f in v] for k, v in all_findings.items()},
                },
                ensure_ascii=False,
                indent=2,
            )
        )
        return 0 if total_fail == 0 else 1

    print("=" * 78)
    print("AICoding 架构文档 · 模板合规校验报告")
    print("=" * 78)
    print(f"产物目录 : {output_dir}")
    print(f"模板目录 : {template_dir}")
    print(f"校验文档 : {len(targets)} 份")
    print("-" * 78)
    for s in summaries:
        verdict = "PASS" if s["fail"] == 0 else "FAIL"
        print(
            f"[{verdict}] {s['doc']:<20} 字符={s['chars']:<6} "
            f"章节 {s['doc_headings']}/{s['template_required_headings']} "
            f"缺章={s['missing_sections']} 声明豁免={s['declared_omissions']} "
            f"空章={s['empty_sections']} "
            f"FAIL={s['fail']} WARN={s['warn']}"
        )
    print("-" * 78)
    for name in targets:
        fs = all_findings[name]
        if not fs:
            continue
        print(f"\n■ {name}")
        for f in fs:
            print(f"  [{f.level:<4}] {f.code}: {f.message}")
    print("-" * 78)
    print(f"合计：FAIL={total_fail}  WARN={total_warn}")
    print("结论：" + ("自动校验通过，可进入人工审核。" if total_fail == 0 else "自动校验未通过，禁止进入人工审核。"))
    print("=" * 78)
    return 0 if total_fail == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
