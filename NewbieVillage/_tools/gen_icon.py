"""生成插件图标 icon.png（纯标准库，无 PIL 依赖）。

用法：python gen_icon.py <输出路径>
设计：深绿色圆角底 + 白色"翻开的书"造型（左右两页 + 书脊 + 页面阶梯）。
"""
import struct
import sys
import zlib

SIZE = 128
BG = (56, 142, 60)
FG = (255, 255, 255)
CORNER = 24

# 左页 / 右页 / 书脊（x0, y0, x1, y1）
PAGES = [(30, 42, 61, 92), (67, 42, 98, 92)]
SPINE = (61, 38, 67, 98)
# 左右页顶部的阶梯缺口（模拟翻开书页的斜边），逐行加宽：y 越大缺口越小
NOTCH_STEP = 3


def in_rounded_rect(x: int, y: int) -> bool:
    if CORNER <= x < SIZE - CORNER or CORNER <= y < SIZE - CORNER:
        return True
    cx = CORNER if x < CORNER else SIZE - CORNER - 1
    cy = CORNER if y < CORNER else SIZE - CORNER - 1
    return (x - cx) ** 2 + (y - cy) ** 2 <= CORNER ** 2


def page_color(x: int, y: int) -> bool:
    """该点是否属于白色书本图案。"""
    if SPINE[0] <= x < SPINE[2] and SPINE[1] <= y < SPINE[3]:
        return True
    for x0, y0, x1, y1 in PAGES:
        if not (x0 <= x < x1 and y0 <= y < y1):
            continue
        # 顶部斜边缺口：离书脊越远，顶部起点越低
        if x < SPINE[0]:
            dist = SPINE[0] - x
        else:
            dist = x - SPINE[2] + 1
        top = y0 + (dist // NOTCH_STEP) * 4
        return y >= top
    return False


def build_rows() -> bytes:
    rows = bytearray()
    for y in range(SIZE):
        rows.append(0)
        for x in range(SIZE):
            if in_rounded_rect(x, y) and page_color(x, y):
                rows.extend(FG + (255,))
            elif in_rounded_rect(x, y):
                rows.extend(BG + (255,))
            else:
                rows.extend((0, 0, 0, 0))
    return bytes(rows)


def chunk(tag: bytes, data: bytes) -> bytes:
    raw = tag + data
    return struct.pack(">I", len(data)) + raw + struct.pack(">I", zlib.crc32(raw) & 0xFFFFFFFF)


def main() -> None:
    ihdr = struct.pack(">IIBBBBB", SIZE, SIZE, 8, 6, 0, 0, 0)
    png = (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", ihdr)
        + chunk(b"IDAT", zlib.compress(build_rows()))
        + chunk(b"IEND", b"")
    )
    out = sys.argv[1] if len(sys.argv) > 1 else "icon.png"
    with open(out, "wb") as f:
        f.write(png)
    print(f"written {out} ({len(png)} bytes)")


if __name__ == "__main__":
    main()
