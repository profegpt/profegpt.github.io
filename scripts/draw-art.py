#!/usr/bin/env python3
"""
Draws ProfeGPT's illustrations into public/assets/art/.

    python3 scripts/draw-art.py [out_dir]

Flat shapes in Duolingo's house style: no outlines, no gradients, a darker
shade down the right/bottom side of every solid thing, and a pale highlight
pill on the lit side. Everything is generated so the geometry can be checked:
every shape passes through Art.add(), which works out where it lands on the
canvas (through any rotated or scaled groups) and refuses to write a drawing
with anything closer than MARGIN to the edge. Each drawing then asserts that
the parts which ought to touch do touch: feet and towers on their grass,
drums stacked without gaps, sails on their hub, and so on.

Standard library only. The output is static SVG: no animation, no scripts,
no external references.
"""
import math
import os
import random
import shutil
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'public', 'assets', 'art')
MARGIN = 4

# Duolingo's palette
GREEN, GREEN_D, GREEN_L = '#58CC02', '#58A700', '#89E219'   # grass and trees only
BLUE, BLUE_D, BLUE_L, BLUE_W = '#1CB0F6', '#1899D6', '#84D8FF', '#DDF4FF'
BLUE_DD = '#0F7FB8'           # deep accent, for small details
GOLD, GOLD_D = '#FFC800', '#E5A400'
RED, RED_D = '#FF4B4B', '#EA2B2B'
ORANGE, ORANGE_D = '#FF9600', '#CD7900'
PURPLE, PURPLE_D = '#CE82FF', '#A568CC'
GREY1, GREY2, GREY3 = '#E5E5E5', '#AFAFAF', '#777777'
INK, INK_D = '#4B4B4B', '#3C3C3C'
WHITE = '#FFFFFF'
CREAM, CREAM_D = '#FFF5D6', '#E8D9A8'
BRONZE, BRONZE_D = '#E0853F', '#B8652B'
# a few in-between shades the palette doesn't name
CREAM_ARCH, CREAM_ARCH_D = '#D8C38A', '#C2AB6C'
BRONZE_DD = '#94501F'
WOOD, WOOD_D = '#B8652B', '#94501F'
SAND, SAND_D, SAND_DD = '#E8C48A', '#C9A066', '#A8824E'
HI = 'opacity=".35"'          # the highlight pill: white at 35%


def f(x):
    t = f'{x:.1f}'
    if t == '-0.0':
        t = '0.0'
    return t[:-2] if t.endswith('.0') else t


# ------------------------------------------------------------------ geometry
# Affine matrices as (a, b, c, d, e, f): x' = a x + c y + e, y' = b x + d y + f
ID = (1, 0, 0, 1, 0, 0)


def mul(m, n):
    a, b, c, d, e, f_ = m
    A, B, C, D, E, F = n
    return (a * A + c * B, b * A + d * B, a * C + c * D, b * C + d * D,
            a * E + c * F + e, b * E + d * F + f_)


def apply(m, p):
    a, b, c, d, e, f_ = m
    x, y = p
    return a * x + c * y + e, b * x + d * y + f_


def rotate(deg, cx=0, cy=0):
    r = math.radians(deg)
    co, si = math.cos(r), math.sin(r)
    m = mul((1, 0, 0, 1, cx, cy), mul((co, si, -si, co, 0, 0), (1, 0, 0, 1, -cx, -cy)))
    return f'rotate({f(deg)} {f(cx)} {f(cy)})', m


def translate(x, y):
    return f'translate({f(x)} {f(y)})', (1, 0, 0, 1, x, y)


def place(x, y, s):
    """translate then scale: local (0, 0) lands on (x, y), units scaled by s."""
    return f'translate({f(x)} {f(y)}) scale({s:g})', (s, 0, 0, s, x, y)


def bezier(p0, p1, p2, p3, n=16):
    out = []
    for i in range(1, n + 1):
        t = i / n
        u = 1 - t
        out.append((u**3 * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t**3 * p3[0],
                    u**3 * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t**3 * p3[1]))
    return out


def arc_pts(cx, cy, rx, ry, a0, a1, n=24):
    """Points on an ellipse from angle a0 to a1 (degrees, y down)."""
    return [(cx + rx * math.cos(math.radians(a0 + (a1 - a0) * i / n)),
             cy + ry * math.sin(math.radians(a0 + (a1 - a0) * i / n))) for i in range(n + 1)]


def clip_x(poly, x0, keep_right=True):
    """Sutherland-Hodgman against the vertical line x = x0."""
    def inside(p):
        return p[0] >= x0 if keep_right else p[0] <= x0
    out = []
    for i in range(len(poly)):
        cur, prev = poly[i], poly[i - 1]
        if inside(cur):
            if not inside(prev):
                out.append(_cross(prev, cur, x0))
            out.append(cur)
        elif inside(prev):
            out.append(_cross(prev, cur, x0))
    return out


def _cross(p, q, x0):
    t = (x0 - p[0]) / (q[0] - p[0])
    return x0, p[1] + t * (q[1] - p[1])


def poly_d(pts):
    return 'M' + 'L'.join(f'{f(x)} {f(y)}' for x, y in pts) + 'Z'


def rpoly_d(pts, r):
    """A closed polygon with every corner rounded (r a number or per corner)."""
    n = len(pts)
    d = []
    for i in range(n):
        p0, p1, p2 = pts[i - 1], pts[i], pts[(i + 1) % n]
        ri = r[i] if isinstance(r, (list, tuple)) else r
        l1 = math.dist(p0, p1)
        l2 = math.dist(p1, p2)
        k = min(ri, l1 / 2, l2 / 2)
        a = (p1[0] + (p0[0] - p1[0]) * k / l1, p1[1] + (p0[1] - p1[1]) * k / l1)
        b = (p1[0] + (p2[0] - p1[0]) * k / l2, p1[1] + (p2[1] - p1[1]) * k / l2)
        d.append(('M' if i == 0 else 'L') + f'{f(a[0])} {f(a[1])}')
        if k > 0:
            d.append(f'Q{f(p1[0])} {f(p1[1])} {f(b[0])} {f(b[1])}')
    return ''.join(d) + 'Z'


def ell_y(x, e, top=True):
    """The grass ellipse's top (or bottom) edge above x."""
    cx, cy, rx, ry = e
    dx = (x - cx) / rx
    if abs(dx) >= 1:
        return None
    h = ry * math.sqrt(1 - dx * dx)
    return cy - h if top else cy + h


def on_grass(x, y, e, inset=2, what='object'):
    t, b = ell_y(x, e, True), ell_y(x, e, False)
    assert t is not None and t + inset <= y <= b - inset, (what, 'not on the grass', x, y, t, b)


# ------------------------------------------------------------------ the canvas
class Art:
    def __init__(self, name, w, h):
        self.name, self.w, self.h = name, w, h
        self.out = []
        self.stack = [ID]
        self.track = None

    # every shape goes through here, with the points that bound it
    def add(self, svg, pts, what=''):
        m = self.stack[-1]
        for p in pts:
            x, y = apply(m, p)
            assert MARGIN - 1e-6 <= x <= self.w - MARGIN + 1e-6 and MARGIN - 1e-6 <= y <= self.h - MARGIN + 1e-6, \
                (self.name, what or svg[:60], 'outside the canvas margin', round(x, 1), round(y, 1))
            if self.track is not None:
                self.track.append((x, y))
        self.out.append(svg)

    # the canvas box of everything drawn between begin_track() and end_track()
    def begin_track(self):
        self.track = []

    def end_track(self):
        xs, ys = [p[0] for p in self.track], [p[1] for p in self.track]
        self.track = None
        return min(xs), min(ys), max(xs), max(ys)

    def assert_centred(self, box, what, tol=12):
        mid = (box[0] + box[2]) / 2
        assert abs(mid - self.w / 2) <= tol, (self.name, what, 'not centred', round(mid, 1))
        return mid

    def world(self, p):
        return apply(self.stack[-1], p)

    def push(self, tf):
        s, m = tf
        self.out.append(f'<g transform="{s}">')
        self.stack.append(mul(self.stack[-1], m))

    def pop(self):
        self.out.append('</g>')
        self.stack.pop()

    # primitives -------------------------------------------------------------
    def rect(self, x, y, w, h, fill, rx=0, rot=None, extra='', what=''):
        tf, pts = '', [(x, y), (x + w, y), (x + w, y + h), (x, y + h)]
        if rot is not None:
            deg, cx, cy = rot
            s, m = rotate(deg, cx, cy)
            tf = f' transform="{s}"'
            pts = [apply(m, p) for p in pts]
        r = f' rx="{f(rx)}"' if rx else ''
        self.add(f'<rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(h)}"{r} fill="{fill}"{tf}{" " + extra if extra else ""}/>', pts, what)

    def circle(self, cx, cy, r, fill, extra='', what=''):
        self.add(f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r)}" fill="{fill}"{" " + extra if extra else ""}/>',
                 arc_pts(cx, cy, r, r, 0, 360, 16), what)

    def ellipse(self, cx, cy, rx, ry, fill, extra='', rot=None, what=''):
        tf, pts = '', arc_pts(cx, cy, rx, ry, 0, 360, 24)
        if rot is not None:
            s, m = rotate(rot, cx, cy)
            tf = f' transform="{s}"'
            pts = [apply(m, p) for p in pts]
        self.add(f'<ellipse cx="{f(cx)}" cy="{f(cy)}" rx="{f(rx)}" ry="{f(ry)}" fill="{fill}"{tf}{" " + extra if extra else ""}/>', pts, what)

    def poly(self, pts, fill, r=0, extra='', what=''):
        d = rpoly_d(pts, r) if r else poly_d(pts)
        self.add(f'<path d="{d}" fill="{fill}"{" " + extra if extra else ""}/>', pts, what)

    def path(self, d, pts, fill, extra='', what=''):
        self.add(f'<path d="{d}" fill="{fill}"{" " + extra if extra else ""}/>', pts, what)

    def line(self, pts, stroke, width, extra='', what=''):
        """Thin details only (lattice, cords): never an outline round a shape."""
        pad = width / 2
        box = [(x + dx, y + dy) for x, y in pts for dx in (-pad, pad) for dy in (-pad, pad)]
        self.add(f'<path d="M' + 'L'.join(f'{f(x)} {f(y)}' for x, y in pts) +
                 f'" fill="none" stroke="{stroke}" stroke-width="{f(width)}" stroke-linecap="round" stroke-linejoin="round"'
                 f'{" " + extra if extra else ""}/>', box, what)

    def text(self, x, y, s, size, fill, what=''):
        # bbox estimate: a rounded bold face runs about 0.6 em per character
        w = 0.6 * size * len(s)
        self.add(f'<text x="{f(x)}" y="{f(y)}" font-family="Fredoka, Nunito, sans-serif" font-weight="700" '
                 f'font-size="{f(size)}" text-anchor="middle" fill="{fill}">{s}</text>',
                 [(x - w / 2, y - size * 0.8), (x + w / 2, y + size * 0.25)], what or s)

    def capsule(self, p, q, r, fill, what=''):
        """A rounded bar from p to q, r its half thickness."""
        ang = math.degrees(math.atan2(q[1] - p[1], q[0] - p[0]))
        L = math.dist(p, q)
        self.rect(p[0] - r, p[1] - r, L + 2 * r, 2 * r, fill, rx=r, rot=(ang, p[0], p[1]), what=what)

    def save(self):
        body = ''.join(self.out)
        assert '<animate' not in body and '<script' not in body and 'href' not in body
        svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {self.w} {self.h}" '
               f'width="{self.w}" height="{self.h}">{body}</svg>\n')
        with open(os.path.join(OUT, self.name), 'w', encoding='utf-8') as fh:
            fh.write(svg)
        return len(svg)


# ------------------------------------------------------------------ shared bits
def confetti(art, seed, box, n, avoid, size=1.0, spacing=30):
    """Duolingo confetti: small rotated rounded bars, kept out of `avoid`."""
    rnd = random.Random(seed)
    cols = [BLUE, PURPLE, RED, GOLD, BLUE_L, ORANGE]
    placed, tries = [], 0
    x0, y0, x1, y1 = box
    w, h = 14 * size, 8 * size
    while len(placed) < n and tries < 20000:
        tries += 1
        x, y = rnd.uniform(x0, x1), rnd.uniform(y0, y1)
        if any(ax0 - w < x < ax1 + w and ay0 - w < y < ay1 + w for ax0, ay0, ax1, ay1 in avoid):
            continue
        if any(math.dist((x, y), p) < spacing for p in placed):
            continue
        placed.append((x, y))
        c = cols[len(placed) % len(cols)]
        art.rect(x - w / 2, y - h / 2, w, h, c, rx=3 * size, rot=(rnd.uniform(0, 180), x, y), what='confetti')
    assert len(placed) == n, (art.name, 'could not place all the confetti', len(placed))


def grass(art, e, lip=8, pill=None, light=False):
    """A grass disc with a darker front lip, like a pressed button. The
    light one is for the green mascot, which would vanish into green grass."""
    cx, cy, rx, ry = e
    art.ellipse(cx, cy + lip, rx, ry, GREEN if light else GREEN_D, what='grass lip')
    art.ellipse(cx, cy, rx, ry, GREEN_L if light else GREEN, what='grass')
    if pill:
        x, y, w = pill
        assert ell_y(x, e) + 4 < y and y + 6 < ell_y(x + w, e, False) - 2, 'grass pill off the grass'
        art.rect(x, y, w, 6, WHITE, rx=3, extra=HI, what='grass pill')


def round_tree(art, x, base, e, s=1.0):
    """A lollipop tree: trunk, a ball of leaves shaded on the right."""
    on_grass(x - 6 * s, base, e, what='tree trunk')
    on_grass(x + 6 * s, base, e, what='tree trunk')
    art.rect(x - 6 * s, base - 44 * s, 12 * s, 44 * s, WOOD, rx=6 * s, what='trunk')
    art.rect(x, base - 44 * s, 6 * s, 44 * s, WOOD_D, rx=3 * s, what='trunk shade')
    cy, r = base - 70 * s, 36 * s
    assert cy + r > base - 44 * s + 6, 'crown does not reach the trunk'
    art.circle(x, cy, r, GREEN_D, what='crown shade')
    art.circle(x - 5 * s, cy - 4 * s, r - 5 * s, GREEN, what='crown')
    art.rect(x - 22 * s, cy - 18 * s, 8 * s, 18 * s, WHITE, rx=4 * s, rot=(25, x - 18 * s, cy - 9 * s), extra=HI, what='crown pill')


def cypress(art, x, base, e, s=1.0):
    """A cypress: a tall flame of green, its right half in shade."""
    on_grass(x - 4 * s, base, e, what='cypress')
    on_grass(x + 4 * s, base, e, what='cypress')
    hgt, wid = 170 * s, 46 * s
    art.rect(x - 5 * s, base - 22 * s, 10 * s, 22 * s, WOOD, rx=5 * s, what='cypress trunk')
    top, bot = (x, base - hgt), (x, base - 14 * s)
    right = bezier(top, (x + wid * 0.78, base - hgt * 0.55), (x + wid * 0.62, base - 14 * s), bot)
    left = bezier(bot, (x - wid * 0.62, base - 14 * s), (x - wid * 0.78, base - hgt * 0.55), top)
    full = (f'M{f(x)} {f(top[1])}C{f(x + wid * 0.78)} {f(base - hgt * 0.55)} {f(x + wid * 0.62)} {f(bot[1])} {f(x)} {f(bot[1])}'
            f'C{f(x - wid * 0.62)} {f(bot[1])} {f(x - wid * 0.78)} {f(base - hgt * 0.55)} {f(x)} {f(top[1])}Z')
    half = (f'M{f(x)} {f(top[1])}C{f(x + wid * 0.78)} {f(base - hgt * 0.55)} {f(x + wid * 0.62)} {f(bot[1])} {f(x)} {f(bot[1])}Z')
    art.path(full, [top] + right + left, GREEN, what='cypress')
    art.path(half, [top] + right, GREEN_D, what='cypress shade')
    art.rect(x - wid * 0.3, base - hgt * 0.62, wid * 0.14, hgt * 0.22, WHITE, rx=wid * 0.07, extra=HI, what='cypress pill')


def sun(art, cx, cy, r):
    art.circle(cx, cy, r, GOLD, what='sun')
    art.path(f'M{f(cx)} {f(cy - r)}A{f(r)} {f(r)} 0 0 1 {f(cx)} {f(cy + r)}Z',
             arc_pts(cx, cy, r, r, -90, 90), GOLD_D, extra='opacity=".45"', what='sun shade')
    art.rect(cx - r * 0.62, cy - r * 0.55, r * 0.42, r * 0.2, WHITE, rx=r * 0.1,
             rot=(-40, cx - r * 0.41, cy - r * 0.45), extra=HI, what='sun pill')


# ------------------------------------------------------------------ the mascot
# The mascot is drawn in a 64-unit box (the logo's own coordinates) and
# scaled up for the hero. It is a chunky blue speech bubble with a face and a
# bubble's tail at its lower left, wearing a mortarboard: no beak, no
# feathers, no owl. The body is a squircle, so it reads as soft but solid.
HEAD = (32, 38.5, 24, 19.5)          # centre x, centre y, half width, half height
SQ = 0.66                            # squircle handle length (0.55 is a circle)
SHADE = (1.3, 1.7)                   # how far the lit body sits in from the right and bottom
EYE_DX, EYE_Y, EYE_RX, EYE_RY = 8.8, 40.2, 6.3, 7.3
MOUTH_Y, MOUTH_W, MOUTH_D = 48.4, 5.0, 4.9
CAP_CUT, CAP_SAG = 25.6, 1.8         # where the cap ends on the brow, and how much it dips in front
BOARD_Y, BOARD_W, BOARD_H, BOARD_T = 12.6, 26, 7.2, 2.6
TASSEL_DX = 21


def blob(cx, cy, hw, hh, k=SQ, n=16):
    """A squircle: four cubic arcs through the top, right, bottom and left
    points. Returns the path and points along it (top, clockwise)."""
    T, R, B, L = (cx, cy - hh), (cx + hw, cy), (cx, cy + hh), (cx - hw, cy)
    segs = [(T, (cx + k * hw, cy - hh), (cx + hw, cy - k * hh), R),
            (R, (cx + hw, cy + k * hh), (cx + k * hw, cy + hh), B),
            (B, (cx - k * hw, cy + hh), (cx - hw, cy + k * hh), L),
            (L, (cx - hw, cy - k * hh), (cx - k * hw, cy - hh), T)]
    d = f'M{f(T[0])} {f(T[1])}' + ''.join(
        f'C{f(a[0])} {f(a[1])} {f(b[0])} {f(b[1])} {f(c[0])} {f(c[1])}' for _, a, b, c in segs) + 'Z'
    pts = [T] + [p for s in segs for p in bezier(*s, n=n)]
    return d, pts


def blob_x(cx, cy, hw, hh, y, k=SQ, side=1):
    """Where the squircle's side crosses height y (side -1 left, 1 right)."""
    _, pts = blob(cx, cy, hw, hh, k, n=60)
    best = None
    for p, q in zip(pts, pts[1:]):
        if (p[1] - y) * (q[1] - y) <= 0 and p[1] != q[1] and (p[0] - cx) * side >= 0:
            t = (y - p[1]) / (q[1] - p[1])
            x = p[0] + t * (q[0] - p[0])
            best = x if best is None or (x - cx) * side > (best - cx) * side else best
    return best


def cap_shape(cx, cy, hw, hh):
    """The mortarboard's skull cap: the crown of the head above a cut that
    dips a little at the front, so the cap's edge wraps round the head."""
    n = 40
    _, pts = blob(cx, cy, hw, hh, n=n)
    crown = [pts[3 * n]] + pts[3 * n + 1:4 * n + 1] + pts[1:n + 1]     # left, over the top, to the right

    def cut(x):
        return CAP_CUT + CAP_SAG * max(0.0, 1 - ((x - cx) / hw) ** 2)
    out = []
    for p, q in zip(crown, crown[1:]):
        ip, iq = p[1] < cut(p[0]), q[1] < cut(q[0])
        if ip:
            out.append(p)
        if ip != iq:
            fp, fq = p[1] - cut(p[0]), q[1] - cut(q[0])
            t = fp / (fp - fq)
            out.append((p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])))
    xr, xl = out[-1][0], out[0][0]
    edge = [(xr + (xl - xr) * i / 20, cut(xr + (xl - xr) * i / 20)) for i in range(1, 20)]
    return out + edge, cut


def tail_shape(root_a, root_b, tip, bend=0.15):
    """A speech bubble's tail: two concave sides from the body to the tip."""
    (ax, ay), (bx, by), (tx, ty) = root_a, root_b, tip
    # control points pulled in toward the root's midpoint, so the sides curve inward
    mx, my = (ax + bx) / 2, (ay + by) / 2
    c1 = (ax + (tx - ax) * 0.55 + (mx - ax) * bend * 0.5, ay + (ty - ay) * 0.55 + (my - ay) * bend * 0.5)
    c2 = (bx + (tx - bx) * 0.55 + (mx - bx) * bend * 0.5, by + (ty - by) * 0.55 + (my - by) * bend * 0.5)
    d = (f'M{f(ax)} {f(ay)}Q{f(c1[0])} {f(c1[1])} {f(tx)} {f(ty)}'
         f'Q{f(c2[0])} {f(c2[1])} {f(bx)} {f(by)}Z')
    pts = [root_a, root_b, tip]
    for t in (0.25, 0.5, 0.75):
        for c, e0 in ((c1, root_a), (c2, root_b)):
            u = 1 - t
            pts.append((u * u * e0[0] + 2 * u * t * c[0] + t * t * tx, u * u * e0[1] + 2 * u * t * c[1] + t * t * ty))
    return d, pts


def mascot(art, full=False):
    """The head, which is also the whole body. full adds the waving arm and
    the feet for the hero; the logo is the head alone."""
    cx, cy, hw, hh = HEAD
    sx, sy = SHADE
    bot = cy + hh

    # the tail of the speech bubble, lower left
    tail = ((cx - hw + 3.2, cy + 7.5), (cx - hw + 14, bot - 1.6), (cx - hw - 3.2, bot + 0.6))
    assert tail[2][1] + sy * 0.8 <= 60, 'the tail runs off the logo'

    if full:
        # feet, behind the body: little dark pads with a lit top
        for fx in (cx - 9.5, cx + 9.5):
            art.ellipse(fx, bot + 0.4, 5.6, 4.4, BLUE_D, what='foot')
            art.ellipse(fx - 0.7, bot - 0.3, 4.6, 3.5, BLUE, what='foot')
            assert bot + 0.4 - 4.4 < bot - 2, 'foot does not meet the body'
        # the waving arm, raised on the right, from behind the body
        sh, hand = (cx + hw - 3, cy + 6), (cx + hw + 7.2, cy - 6.5)
        art.capsule(sh, hand, 2.7, BLUE_D, what='arm')
        art.capsule(sh, (hand[0] - 0.5, hand[1] - 0.4), 2.0, BLUE, what='arm')
        art.circle(hand[0], hand[1], 4.4, BLUE_D, what='hand')
        art.circle(hand[0] - 0.6, hand[1] - 0.7, 3.6, BLUE, what='hand')
        # a thumb, up and in
        art.ellipse(hand[0] - 3.6, hand[1] - 1.6, 1.7, 2.3, BLUE, rot=-30, what='thumb')
        art.rect(hand[0] - 2.1, hand[1] - 3.4, 1.5, 2.8, WHITE, rx=0.75, rot=(-20, hand[0] - 1.35, hand[1] - 2), extra=HI, what='hand pill')
        sx_in = blob_x(cx, cy, hw, hh, sh[1], side=1)
        assert sh[0] < sx_in - 1, 'arm does not meet the body'
        # two little motion strokes beside the hand
        for i, r in enumerate((7.2, 10.0)):
            pts = arc_pts(hand[0], hand[1], r, r, -62 + i * 4, -18 - i * 4, 6)
            art.line(pts, BLUE_L, 1.3, what='wave')

    # dark body and tail first, then the lit ones over them: a crescent of
    # shade is left down the right and along the bottom
    d_dark, pts_dark = blob(cx, cy, hw, hh)
    t_dark, tpts_dark = tail_shape(*[(x + sx * 0.6, y + sy * 0.8) for x, y in tail])
    art.path(t_dark, tpts_dark, BLUE_D, what='tail shade')
    art.path(d_dark, pts_dark, BLUE_D, what='body shade')
    t_lit, tpts_lit = tail_shape(*tail)
    art.path(t_lit, tpts_lit, BLUE, what='tail')
    d_lit, pts_lit = blob(cx - sx, cy - sy, hw - sx, hh - sy)
    art.path(d_lit, pts_lit, BLUE, what='body')
    for p in tail[:2]:
        assert blob_x(cx, cy, hw, hh, p[1], side=-1) < p[0], 'tail root is not in the body'
    # highlight pill on the lit upper left, leaning with the curve
    px, py = cx - hw + 4.6, cy - 4.2
    art.rect(px - 1.7, py - 4.6, 3.4, 9.2, WHITE, rx=1.7, rot=(14, px, py), extra=HI, what='body pill')
    assert blob_x(cx - sx, cy - sy, hw - sx, hh - sy, py - 4.6, side=-1) < px - 2.6, 'pill off the body'

    # eyes: big whites, dark pupils looking at you, two catchlights each
    for side in (-1, 1):
        ex = cx + side * EYE_DX
        art.ellipse(ex, EYE_Y, EYE_RX, EYE_RY, WHITE, what='eye')
        px, py = ex - side * 0.5, EYE_Y + 0.9
        art.ellipse(px, py, 4.3, 4.7, INK_D, what='pupil')
        art.circle(px - 1.5, py - 1.7, 1.65, WHITE, what='catchlight')
        art.circle(px + 1.6, py + 1.6, 0.75, WHITE, what='catchlight')
        # brows: short arched bars, the outer end a touch lower
        by = EYE_Y - EYE_RY - 2.5
        art.line([(ex - 3.6 + side * 0.4, by + 0.7 * (1 if side < 0 else 0.2)), (ex + side * 0.3, by - 0.5),
                  (ex + 3.6 + side * 0.4, by + 0.7 * (0.2 if side < 0 else 1))], INK_D, 1.7, what='brow')
        assert cx - hw + 3 < ex - EYE_RX and ex + EYE_RX < cx + hw - 3, 'eye off the face'
        assert by - 1.5 > CAP_CUT + CAP_SAG - 0.5, 'brow under the cap'
        assert abs(ex - cx) > EYE_RX, 'eyes overlap'

    # cheeks
    for side in (-1, 1):
        art.ellipse(cx + side * 16.2, MOUTH_Y + 0.6, 2.7, 1.6, '#FF8FB5', extra='opacity=".75"', what='cheek')

    # an open smile, flat on top and round below, with a tongue
    mx, my, mw, md = cx, MOUTH_Y, MOUTH_W, MOUTH_D
    art.path(f'M{f(mx - mw + 1)} {f(my)}H{f(mx + mw - 1)}Q{f(mx + mw)} {f(my)} {f(mx + mw)} {f(my + 1)}'
             f'A{f(mw)} {f(md - 1)} 0 0 1 {f(mx - mw)} {f(my + 1)}Q{f(mx - mw)} {f(my)} {f(mx - mw + 1)} {f(my)}Z',
             [(mx - mw, my), (mx + mw, my + md)], INK_D, what='mouth')
    ty = my + md * 0.58
    a = mw * math.sqrt(max(0.0, 1 - ((ty - my - 1) / (md - 1)) ** 2)) - 0.2
    art.path(f'M{f(mx - a)} {f(ty)}Q{f(mx)} {f(ty - 2)} {f(mx + a)} {f(ty)}A{f(mw)} {f(md - 1)} 0 0 1 {f(mx - a)} {f(ty)}Z',
             [(mx - a, ty - 1), (mx + a, my + md)], RED, what='tongue')
    assert my + md < bot - sy - 1.5, 'mouth falls off the body'
    assert my > EYE_Y + EYE_RY - 0.5, 'mouth runs into the eyes'

    # the mortarboard: the skull cap wraps the crown, the board sits on it
    cap, cut = cap_shape(cx, cy, hw + 0.4, hh + 0.4)
    art.poly(cap, INK, what='cap')
    art.poly(clip_x(cap, cx + 5), INK_D, what='cap shade')
    by_, bw, bh, bt = BOARD_Y, BOARD_W, BOARD_H, BOARD_T
    board = [(cx - bw, by_), (cx, by_ - bh), (cx + bw, by_), (cx, by_ + bh)]
    art.poly([(x, y + bt) for x, y in board], INK_D, r=3, what='board edge')
    art.poly(board, INK, r=3, what='board')
    art.rect(cx - 15, by_ - 2.6, 9, 2.4, WHITE, rx=1.2, rot=(-15.5, cx - 10.5, by_ - 1.4), extra='opacity=".22"', what='board pill')
    # the board must hide the top of the cap, and the cap must reach the board
    assert by_ + bh + bt > cy - hh + 1.5, 'board does not cover the crown'
    for x, y in cap:
        dx = abs(x - cx)
        if dx < bw - 3:
            assert y > by_ - bh * (1 - dx / bw) + 1, 'cap pokes out above the board'
    assert cut(cx) > by_ + bh + bt + 3, 'no cap shows under the board'
    # the tassel: a button, a cord over the board to the front-right edge,
    # hanging down beside the face
    edge_y = by_ + bh * (TASSEL_DX / bw)
    cord = [(cx, by_), (cx + TASSEL_DX, edge_y + 0.4), (cx + TASSEL_DX + 0.3, cut(cx + TASSEL_DX) - 1)]
    art.line(cord, GOLD_D, 1.7, what='cord')
    tx, ty = cord[-1]
    art.rect(tx - 2.4, ty - 1.4, 4.8, 8.4, GOLD, rx=2.2, what='tassel')
    art.rect(tx + 0.2, ty - 1.4, 2.2, 8.4, GOLD_D, rx=1.1, what='tassel shade')
    art.rect(tx - 2.8, ty - 1.8, 5.6, 2.4, GOLD_D, rx=1.2, what='tassel knot')
    art.circle(cx, by_, 2.3, GOLD, what='button')
    assert tx - 2.4 > cx + EYE_DX + EYE_RX + 0.8, 'tassel over the eye'
    assert tx + 2.4 < cx + hw, 'tassel hangs off the head'
    # the outline, for keeping other things clear of the mascot
    keep = pts_dark + board + list(tail)
    if full:
        keep += arc_pts(hand[0], hand[1], 10, 10, 0, 360, 16)
    return keep


def logo():
    art = Art('logo.svg', 64, 64)
    mascot(art)
    return art


def say(art, x, y, w, h, s, tail_to, size=28, tilt=0):
    """A white speech bubble with a light grey edge and lip, blue lettering,
    and a tail toward `tail_to`. All the hero's bubbles are this one colour."""
    cx, cy = x + w / 2, y + h / 2
    est = 0.62 * size * len(s.replace('¡', 'i'))
    assert est + 28 <= w, (s, 'bubble too tight for its word', est, w)
    if tilt:
        art.push(rotate(tilt, cx, cy))
    tx, ty = tail_to
    e, lip, rx = 2.5, 4.5, h / 2.3
    # the tail leaves the bubble's bottom edge, nearer the side it points to
    bx = cx + (w * 0.2 if tx > cx else -w * 0.2)
    tail = [(bx - 11, y + h - 10), (bx + 11, y + h - 10), (tx, ty)]
    inner = [(bx - 11 + e * 1.4, y + h - 10), (bx + 11 - e * 1.4, y + h - 10), (tx + (bx - tx) * 0.09, ty - e * 1.6)]
    art.poly([(px, py + lip) for px, py in tail], GREY1, r=[2, 2, 3], what='bubble tail lip')
    art.rect(x - e, y - e, w + 2 * e, h + 2 * e + lip, GREY1, rx=rx + e, what='bubble edge')
    art.poly(inner, WHITE, r=[2, 2, 2.5], what='bubble tail')
    art.rect(x, y, w, h, WHITE, rx=rx, what='bubble')
    art.text(cx, cy + size * 0.36, s, size, BLUE_D)
    if tilt:
        art.pop()
    return (x - 8, y - 8, x + w + 8, y + h + 12)


def hero():
    art = Art('mascot.svg', 560, 480)
    S = 5.0
    ox, oy = 280 - 32 * S - 14, 100
    art.push(place(ox, oy, S))
    art.begin_track()
    keep = [art.world(p) for p in mascot(art, full=True)]
    m_box = art.end_track()
    art.pop()
    # the body (not the waving hand) is what the eye centres on
    body_mid = ox + HEAD[0] * S
    assert abs(body_mid - 280) <= 14 and abs((m_box[0] + m_box[2]) / 2 - 280) <= 24, ('mascot not centred', body_mid, m_box)

    # three speech bubbles, saying hello in each language, all the same colour
    boxes = []
    boxes.append(say(art, 24, 66, 150, 62, '¡Hola!', (146, 160), size=30, tilt=-5))
    boxes.append(say(art, 380, 34, 166, 62, 'Bonjour', (414, 126), size=30, tilt=4))
    boxes.append(say(art, 420, 318, 122, 60, 'Ciao', (404, 300), size=30, tilt=5))
    for b in boxes:
        for x, y in keep:
            assert not (b[0] < x < b[2] and b[1] < y < b[3]), ('bubble on the mascot', b, round(x), round(y))

    confetti(art, 11, (14, 14, 546, 440), 9, [m_box, *boxes], size=0.9, spacing=70)
    return art


# ------------------------------------------------------------------ Spain
def finial(art, cx, y, s, col, col_d):
    """The mosaic pinnacle on a Sagrada Familia tower, standing on (cx, y):
    a coloured knob, a gold cross, white balls at the cross's ends."""
    art.rect(cx - 3 * s, y - 8 * s, 6 * s, 10 * s, SAND_D, rx=2 * s, what='finial stem')
    ky = y - 16 * s
    art.ellipse(cx, ky, 8 * s, 10 * s, col, what='finial knob')
    art.path(f'M{f(cx + 2.5 * s)} {f(ky - 9.6 * s)}A{f(8 * s)} {f(10 * s)} 0 0 1 {f(cx + 2.5 * s)} {f(ky + 9.6 * s)}Z',
             [(cx, ky - 10 * s), (cx + 8 * s, ky + 10 * s)], col_d, what='finial shade')
    art.circle(cx - 3.2 * s, ky - 3 * s, 1.7 * s, WHITE, what='mosaic')
    art.circle(cx + 1.2 * s, ky + 4 * s, 1.5 * s, GOLD, what='mosaic')
    art.circle(cx - 2.6 * s, ky + 4.6 * s, 1.2 * s, WHITE, extra='opacity=".7"', what='mosaic')
    art.rect(cx - 8 * s, ky + 5.8 * s, 16 * s, 3.2 * s, GOLD, rx=1.6 * s, what='finial band')
    top = ky - 10 * s
    art.rect(cx - 1.6 * s, top - 13 * s, 3.2 * s, 14 * s, GOLD, rx=1.6 * s, what='cross')
    art.rect(cx - 6.4 * s, top - 9.6 * s, 12.8 * s, 3.2 * s, GOLD, rx=1.6 * s, what='cross')
    for bx, by in ((cx, top - 13 * s), (cx - 6.4 * s, top - 8 * s), (cx + 6.4 * s, top - 8 * s)):
        art.circle(bx, by, 2.4 * s, WHITE, what='cross ball')
    return top - 15.4 * s


def spindle(art, cx, base, top, hw, col, col_d, s=1.0, slots=7, phase=0.0, stone=(SAND, SAND_D)):
    """One of the Sagrada Familia's bell towers: a tall spindle, straight
    at the foot and closing to a rounded point, with a spiral of slots up
    it and a mosaic finial on top. Returns its half width at height y."""
    n = 16
    H = base - top

    def w(y):
        t = min(1.0, max(0.0, (base - y) / H))
        return hw * (1 - t ** 2.4) ** 0.55
    neck = top + H * 0.035
    left = [(cx - max(w(base - (base - neck) * i / n), 3.5 * s), base - (base - neck) * i / n) for i in range(n + 1)]
    pts = left + [(2 * cx - x, y) for x, y in reversed(left)]
    art.poly(pts, stone[0], what='tower')
    art.poly(clip_x(pts, cx + hw * 0.28), stone[1], what='tower shade')
    # the spiral of slots: two columns, staggered, smaller as the tower closes
    for i in range(slots):
        t = 0.1 + 0.62 * i / (slots - 1)
        y = base - H * t
        ww = w(y)
        sw, sh = 4.6 * s * (1 - t * 0.35), 11 * s * (1 - t * 0.3)
        for j in (0, 1):
            off = math.sin(phase + i * 0.9 + j * math.pi) * ww * 0.42
            if abs(off) + sw / 2 > ww - 5 * s:
                continue
            art.rect(cx + off - sw / 2, y - sh / 2, sw, sh, SAND_DD, rx=sw / 2, what='tower slot')
    # a highlight pill on the lit side
    art.rect(cx - hw * 0.62, base - H * 0.42, 4.5 * s, H * 0.24, WHITE, rx=2.25 * s, extra=HI, what='tower pill')
    tip = finial(art, cx, neck + 2 * s, s, col, col_d)
    return w, tip


def spain():
    art = Art('es.svg', 560, 480)
    sun(art, 128, 132, 64)
    ground = (280, 414, 240, 38)
    grass(art, ground, pill=(380, 430, 40))
    round_tree(art, 74, 418, ground, 0.95)
    round_tree(art, 488, 410, ground, 0.8)

    mid = 280
    BODY_T, BODY_B = 318, 408
    art.begin_track()
    art.ellipse(mid + 6, BODY_B + 1, 140, 12, GREEN_D, what='basilica shadow')
    # the tall central tower, behind
    w_c, tip_c = spindle(art, mid, 330, 72, 25, GOLD, GOLD_D, s=1.15, slots=0, stone=('#F3DDB4', '#DDBF8C'))
    # the four Nativity towers: the inner pair taller
    towers = []
    for x, top, hw, col, col_d, ph in ((180, 160, 19, RED, RED_D, 0.4), (380, 160, 19, RED, RED_D, 1.6),
                                      (232, 118, 21.5, ORANGE, ORANGE_D, 2.2), (328, 118, 21.5, ORANGE, ORANGE_D, 0.9)):
        tb = BODY_T + 6
        w, tip = spindle(art, x, tb, top, hw, col, col_d, s=0.85 if hw < 20 else 0.95, slots=8, phase=ph)
        towers.append((x, tb, hw))
        assert BODY_T < tb, 'tower floats above the body'
    # the central gable over the main portal, with Gaudi's green cypress on top
    g = [(mid - 46, BODY_T + 4), (mid - 30, 282), (mid, 248), (mid + 30, 282), (mid + 46, BODY_T + 4)]
    art.poly(g, SAND, r=[0, 10, 8, 10, 0], what='gable')
    art.poly(clip_x(g, mid + 16), SAND_D, r=0, what='gable shade')
    cyp = [(mid - 15, 256), (mid, 196), (mid + 15, 256)]
    art.poly(cyp, GREEN, r=[5, 6, 5], what='cypress spire')
    art.poly([(mid, 200), (mid + 15, 256), (mid + 2, 256)], GREEN_D, r=[3, 5, 0], what='cypress spire shade')
    for dx, dy in ((-4, 232), (3, 218), (-1, 246)):
        art.circle(mid + dx, dy, 2.4, WHITE, what='dove')
    assert cyp[0][1] > 248 + 2, 'the cypress does not stand on the gable'
    # the facade body, with three parabolic portals
    art.rect(150, BODY_T, 260, BODY_B - BODY_T, SAND, rx=12, what='facade')
    art.rect(352, BODY_T, 58, BODY_B - BODY_T, SAND_D, rx=12, what='facade shade')
    art.rect(352, BODY_T, 14, BODY_B - BODY_T, SAND_D, what='facade shade')
    # a crest of rounded knobs along the top, Gaudi's soft battlements
    for x in (156, 206, 256, 304, 354, 404):
        col = SAND_D if x > 352 else SAND
        art.path(f'M{f(x - 7)} {f(BODY_T + 4)}A7 9 0 0 1 {f(x + 7)} {f(BODY_T + 4)}Z',
                 [(x - 7, BODY_T - 5), (x + 7, BODY_T + 4)], col, what='crest')
    art.rect(150, BODY_B - 14, 260, 14, SAND_D, rx=7, what='plinth')
    art.rect(352, BODY_B - 14, 58, 14, SAND_DD, rx=7, what='plinth shade')

    def portal(x, w, top, col, inner=None):
        pts = [(x - w / 2, BODY_B - 10)] + arc_pts(x, top + w * 0.62, w / 2, w * 0.62, 180, 360, 16)[1:-1] + [(x + w / 2, BODY_B - 10)]
        art.poly(pts, col, what='portal')
        if inner:
            iw = w - 12
            ip = [(x - iw / 2, BODY_B - 10)] + arc_pts(x, top + 8 + iw * 0.62, iw / 2, iw * 0.62, 180, 360, 16)[1:-1] + [(x + iw / 2, BODY_B - 10)]
            art.poly(ip, inner, what='portal door')
    portal(mid, 48, 334, SAND_D, SAND_DD)
    portal(204, 30, 354, SAND_DD)
    portal(356, 30, 354, SAND_DD)
    # a frieze of small round windows over the side portals
    for x in (190, 204, 218, 342, 356, 370):
        art.circle(x, 336, 3.6, SAND_DD, what='frieze')
    art.rect(162, 328, 5, 50, WHITE, rx=2.5, extra=HI, what='facade pill')
    box = art.end_track()
    art.assert_centred(box, 'basilica')
    for x in (150 + 8, 410 - 8):
        on_grass(x, BODY_B, ground, what='facade')
    for x, tb, hw in towers:
        assert 150 <= x - hw and x + hw <= 410, 'tower hangs off the facade'

    confetti(art, 3, (16, 16, 544, 300), 5, [(130, 20, 430, 420), (40, 50, 200, 210), (40, 300, 130, 430), (440, 300, 540, 430)], spacing=60)
    return art


# ------------------------------------------------------------------ France
def france():
    art = Art('fr.svg', 560, 480)
    mid = 280
    ground = (280, 410, 236, 40)
    grass(art, ground, pill=(110, 424, 40))
    round_tree(art, 82, 414, ground, 1.0)
    round_tree(art, 478, 412, ground, 0.86)

    # the real tower's proportions: height from the ground to the tip of the
    # mast, platforms at 19%, 38% and ~87% of it
    FOOT, TIP = 404, 24
    H = FOOT - TIP
    BASE = 112                              # half width at the foot
    Y1, Y2, Y3 = FOOT - 0.19 * H, FOOT - 0.38 * H, FOOT - 0.87 * H
    P1, P2, P3 = 70, 28, 11                 # platform half widths

    def profile(y_bot, y_top, w_bot, w_top, power):
        def w(y):
            t = (y_bot - y) / (y_bot - y_top)
            return w_top + (w_bot - w_top) * (1 - t) ** power
        return w

    def edges(w, y_bot, y_top, n=24):
        left = [(mid - w(y_bot - (y_bot - y_top) * i / n), y_bot - (y_bot - y_top) * i / n) for i in range(n + 1)]
        right = [(2 * mid - x, y) for x, y in reversed(left)]
        return left, right

    def shaded(pts, what):
        art.poly(pts, BRONZE, what=what)
        art.poly(clip_x(pts, mid), BRONZE_D, what=what + ' shade')

    art.begin_track()
    art.ellipse(mid + 6, FOOT + 2, 136, 13, GREEN_D, what='tower shadow')
    # legs: four splayed trusses (two seen) curving in to the first platform,
    # the great arch between them
    l_top = Y1 + 2
    w_leg = profile(FOOT, l_top, BASE, 58, 2.1)
    TH = 30                                 # leg thickness at the foot
    SPRING, APEX = FOOT - 34, Y1 + 13       # where the arch leaves the legs, and its crown

    def inner(y):
        t = (FOOT - y) / (FOOT - SPRING)
        return w_leg(y) - (TH + 6 * t)
    left, right = edges(w_leg, FOOT, l_top)
    a_s = inner(SPRING)
    inner_r = [(mid + inner(FOOT - (FOOT - SPRING) * i / 10), FOOT - (FOOT - SPRING) * i / 10) for i in range(11)]
    arch = arc_pts(mid, SPRING, a_s, SPRING - APEX, 0, -180, 24)[1:-1]
    inner_l = [(2 * mid - x, y) for x, y in reversed(inner_r)]
    # outline: up the left outside, down the right outside, up the right
    # inside to the arch, over it, down the left inside
    legs = left + right + list(inner_r) + arch + list(inner_l)
    shaded(legs, 'legs')
    assert inner(FOOT) < BASE - 24 and a_s > 30, 'legs too thin or arch too small'
    assert 2 * inner(FOOT) > 1.2 * BASE, 'the arch does not span most of the base'

    # the middle storey, narrowing to the second platform, a smaller arch in it
    m_bot, m_top = Y1 + 2, Y2 + 2
    w_mid = profile(m_bot, m_top, 54, 22, 1.5)
    left, right = edges(w_mid, m_bot, m_top)
    marc = arc_pts(mid, m_bot, 24, m_bot - (Y2 + 34), 0, -180, 20)
    shaded(left + right + marc, 'middle')

    # the long slender shaft to the top platform
    s_bot, s_top = Y2 + 2, Y3 + 2
    w_up = profile(s_bot, s_top, 20, 6.5, 1.7)
    left, right = edges(w_up, s_bot, s_top)
    shaded(left + right, 'shaft')

    # lattice: a few cut-out diamonds up the shaft and the middle storey
    def diamond(y, r, what='lattice'):
        art.poly([(mid - r, y), (mid, y - r * 1.5), (mid, y + r * 1.5)], BRONZE_D, r=r * 0.25, what=what)
        art.poly([(mid, y - r * 1.5), (mid + r, y), (mid, y + r * 1.5)], BRONZE_DD, r=r * 0.25, what=what)
    for y in (232, 194, 158, 124):
        r = w_up(y) * 0.5
        diamond(y, r)
        assert r * 1.5 < 40 and r < w_up(y) - 3, 'lattice off the shaft'
    # an X on each leg
    for sgn in (-1, 1):
        col = BRONZE_DD if sgn > 0 else BRONZE_D
        ya, yb = Y1 + 24, SPRING + 4
        xa = lambda y: mid + sgn * (w_leg(y) + inner(y)) / 2
        span = lambda y: (w_leg(y) - inner(y)) / 2 - 7
        art.line([(xa(ya) - span(ya), ya), (xa(yb) + span(yb), yb)], col, 3.2, what='leg brace')
        art.line([(xa(ya) + span(ya), ya), (xa(yb) - span(yb), yb)], col, 3.2, what='leg brace')

    def slab(yc, h, hw, what):
        y = yc - h / 2
        art.rect(mid - hw, y, 2 * hw, h, BRONZE, rx=h / 2.2, what=what)
        art.poly([(mid, y), (mid + hw, y), (mid + hw, y + h), (mid, y + h)], BRONZE_D, r=[0, h / 2.2, h / 2.2, 0], what=what + ' shade')
        n = max(2, int(hw / 12))
        n -= n % 2
        if hw > 20:
            for i in range(n):
                x = mid - hw + 9 + i * (2 * hw - 18) / (n - 1)
                art.rect(x - 2.6, y + h * 0.3, 5.2, h * 0.4, BRONZE_DD if x > mid else BRONZE_D, rx=2, what=what + ' window')
    # each platform covers the top of the section under it and the foot of
    # the one above, so no seam shows
    for yc, h, hw, below_top, above_bot, below_w, above_w, what in (
            (Y1, 18, P1, l_top, m_bot, w_leg(l_top), w_mid(m_bot), 'first platform'),
            (Y2, 13, P2, m_top, s_bot, w_mid(m_top), w_up(s_bot), 'second platform'),
            (Y3, 10, P3, s_top, None, w_up(s_top), 0, 'top platform')):
        assert yc - h / 2 < below_top < yc + h / 2, (what, 'leaves a gap below')
        assert above_bot is None or yc - h / 2 < above_bot < yc + h / 2, (what, 'leaves a gap above')
        assert below_w < hw and above_w < hw, (what, 'narrower than its section')
        slab(yc, h, hw, what)
    assert abs(P2 / P1 - 0.4) < 0.03, 'second platform should be ~40% of the first'
    # the lantern and the mast
    lt = Y3 - 5 - 18
    art.rect(mid - 6.5, lt, 13, 20, BRONZE, rx=4, what='lantern')
    art.rect(mid, lt, 6.5, 20, BRONZE_D, rx=3, what='lantern shade')
    art.rect(mid - 2.5, TIP + 4, 5, lt - TIP - 2, BRONZE_D, rx=2.5, what='mast')
    art.circle(mid, TIP + 4, 4, GOLD, what='mast ball')
    # feet: pads where the legs meet the ground
    for sgn in (-1, 1):
        x0, x1 = mid + sgn * w_leg(FOOT), mid + sgn * inner(FOOT)
        lo, hi = min(x0, x1) - 4, max(x0, x1) + 4
        art.rect(lo, FOOT - 10, hi - lo, 14, BRONZE_D if sgn > 0 else BRONZE, rx=6, what='foot pad')
        for x in (lo, hi):
            on_grass(x, FOOT + 4, ground, what='tower foot')
    lx = mid - w_leg(372) + 9
    art.rect(lx - 3.5, 352, 7, 34, WHITE, rx=3.5, rot=(26, lx, 369), extra=HI, what='leg pill')
    sx = mid - w_up(190) + 4
    art.rect(sx - 2, 172, 4, 34, WHITE, rx=2, rot=(5, sx, 189), extra=HI, what='shaft pill')
    box = art.end_track()
    art.assert_centred(box, 'Eiffel Tower')
    height, width = FOOT + 4 - box[1], 2 * (w_leg(FOOT) + 4)
    assert 1.6 <= height / width <= 1.8, ('Eiffel Tower proportions off', round(height / width, 2))

    confetti(art, 5, (16, 16, 544, 300), 7, [(150, 14, 410, 420), (30, 290, 140, 420), (420, 300, 540, 420)], spacing=60)
    return art


# ------------------------------------------------------------------ Italy
def italy():
    art = Art('it.svg', 560, 480)
    # an afternoon sun behind the tower's lit side, so its cream wall has
    # something to stand against on a white page
    sun(art, 226, 186, 92)
    ground = (280, 414, 240, 38)
    grass(art, ground, pill=(370, 430, 40))
    cypress(art, 92, 418, ground, 1.0)
    cypress(art, 138, 410, ground, 0.72)
    cypress(art, 420, 410, ground, 0.68)
    round_tree(art, 476, 416, ground, 0.84)

    # the tower leans right about its foot, so its foot sits left of centre
    # by about half the lean
    cx, base = 266, 404
    LEAN = 5
    art.begin_track()
    art.ellipse(cx + 12, base + 2, 92, 13, GREEN_D, what='tower shadow')
    art.push(rotate(LEAN, cx, base))

    R = 60                           # drum radius
    drums = []                       # (bottom, top, half width)
    y = base
    drums.append((y + 8, y - 60, R)); y -= 60          # ground floor (runs into the grass)
    for _ in range(6):
        drums.append((y, y - 31, R)); y -= 31
    bell_r = 40
    drums.append((y, y - 36, bell_r)); y -= 36
    TOP = y
    for (b0, t0, _), (b1, t1, _) in zip(drums, drums[1:]):
        assert b1 >= t0, ('gap between drums', t0, b1)

    def drum(b, t, r, n_arch, arch_w, inset_top, inset_bot, blind=False):
        art.rect(cx - r, t, 2 * r, b - t, CREAM, what='drum')
        art.rect(cx + r * 0.38, t, r * 0.62, b - t, CREAM_D, what='drum shade')
        # arcade on the curve: arches at equal angles, narrower to the sides
        for k in range(n_arch):
            phi = math.radians(-62 + 124 * k / (n_arch - 1))
            ax = cx + r * math.sin(phi)
            aw = arch_w * math.cos(phi) ** 0.8
            if aw < 3.5:
                continue
            at, ab = t + inset_top, b - inset_bot
            dark = ax > cx + r * 0.38
            col = (CREAM_D if not dark else CREAM_ARCH) if blind else (CREAM_ARCH if not dark else CREAM_ARCH_D)
            rr = aw / 2
            art.path(f'M{f(ax - rr)} {f(ab)}V{f(at + rr)}A{f(rr)} {f(rr)} 0 0 1 {f(ax + rr)} {f(at + rr)}V{f(ab)}Z',
                     [(ax - rr, at), (ax + rr, ab)], col, what='arch')
            assert cx - r < ax - rr and ax + rr < cx + r, 'arch off its drum'

    def ledge(y, r, h=8):
        art.rect(cx - r - 6, y - h / 2, 2 * r + 12, h, CREAM, rx=h / 2, what='ledge')
        art.rect(cx + r * 0.38, y - h / 2, r * 0.62 + 6, h, CREAM_D, rx=h / 2, what='ledge shade')
        art.rect(cx + r * 0.38, y - h / 2, h, h, CREAM_D, what='ledge shade')

    b, t, r = drums[0]
    art.rect(cx - r - 8, b - 14, 2 * r + 16, 14, CREAM_D, rx=6, what='plinth')
    art.rect(cx + r * 0.38, b - 14, r * 0.62 + 8, 14, CREAM_ARCH, rx=6, what='plinth shade')
    drum(b - 12, t, r, 7, 18, 10, 6, blind=True)
    for b, t, r in drums[1:-1]:
        drum(b, t, r, 9, 13, 6, 3)
    b, t, r = drums[-1]
    drum(b, t, r, 7, 13, 8, 4)
    # ledges at every joint, covering the seams
    for (b0, t0, r0), (b1, t1, r1) in zip(drums, drums[1:]):
        ledge(t0, max(r0, r1), 8 if r1 == r0 else 10)
    ledge(drums[0][1] + 0, R)
    ledge(TOP, bell_r + 2, 9)
    art.path(f'M{f(cx - bell_r + 6)} {f(TOP - 4)}A{f(bell_r - 6)} 13 0 0 1 {f(cx + bell_r - 6)} {f(TOP - 4)}Z',
             [(cx - bell_r + 6, TOP - 17), (cx + bell_r - 6, TOP - 4)], CREAM_D, what='roof')
    b0, t0, _ = drums[0]
    art.rect(cx - R + 2.5, t0 + 10, 4.5, b0 - t0 - 26, WHITE, rx=2.25, extra='opacity=".8"', what='tower pill')
    art.rect(cx - bell_r + 14, TOP - 12, 12, 4.5, WHITE, rx=2.25, rot=(-10, cx - bell_r + 20, TOP - 10), extra='opacity=".6"', what='roof pill')
    # the base corners, after the lean, sit in the grass
    for x in (cx - R - 8, cx + R + 8):
        wx, wy = art.world((x, drums[0][0]))
        on_grass(wx, wy, ground, what='tower base')
    art.pop()
    box = art.end_track()
    # centre the tower itself, not its shadow
    tower_box = box
    art.assert_centred(tower_box, 'Leaning Tower')

    confetti(art, 9, (16, 16, 544, 330), 9, [(140, 90, 420, 430), (60, 150, 200, 430)], spacing=54)
    return art


# ------------------------------------------------------------------ feature icons (96)
def card_lip(art, x, y, w, h, rx, fill, dark, lip=4):
    art.rect(x, y + lip, w, h, dark, rx=rx)
    art.rect(x, y, w, h, fill, rx=rx)


def bubble_shape(x, y, w, h, tail_left=True):
    tx = x + (14 if tail_left else w - 14)
    tail = [(tx - 7, y + h - 4), (tx + 7, y + h - 4), (tx - (6 if tail_left else -6), y + h + 11)]
    return tail


def translator():
    art = Art('translator.svg', 96, 96)
    # blue bubble, behind, up and left
    art.push(rotate(-8, 36, 34))
    x, y, w, h = 8, 10, 52, 38
    tail = bubble_shape(x, y, w, h, True)
    art.poly([(a, b + 4) for a, b in tail], BLUE_D, r=[2, 2, 2.5])
    card_lip(art, x, y, w, h, 13, BLUE, BLUE_D)
    art.poly(tail, BLUE, r=[2, 2, 2.5])
    art.rect(x + 7, y + 6, 10, 5, WHITE, rx=2.5, extra=HI)
    # an "A" built from bars
    art.line([(26.5, 39), (34, 19), (41.5, 39)], WHITE, 5)
    art.line([(29.5, 32), (38.5, 32)], WHITE, 4.5)
    art.pop()
    # green bubble, in front, down and right
    art.push(rotate(7, 62, 56))
    x, y, w, h = 36, 36, 52, 36
    tail = bubble_shape(x, y, w, h, False)
    art.poly([(a, b + 4) for a, b in tail], GREEN_D, r=[2, 2, 2.5])
    card_lip(art, x, y, w, h, 13, GREEN, GREEN_D)
    art.poly(tail, GREEN, r=[2, 2, 2.5])
    art.rect(x + 7, y + 6, 10, 5, WHITE, rx=2.5, extra=HI)
    # swap arrows: right along the top, left along the bottom
    art.line([(49, 49), (73, 49)], WHITE, 4.5)
    art.poly([(70, 43), (78, 49), (70, 55)], WHITE, r=1.5)
    art.line([(75, 61), (52, 61)], WHITE, 4.5)
    art.poly([(53, 55), (45, 61), (53, 67)], WHITE, r=1.5)
    art.pop()
    return art


def conjugator():
    art = Art('conjugator.svg', 96, 96)
    w, h = 42, 56
    for col, dark, ang, dx in ((RED, RED_D, -15, -8), (ORANGE, ORANGE_D, -2, 0), (GOLD, GOLD_D, 12, 8)):
        cx, cy = 46 + dx, 44
        art.push(rotate(ang, cx, cy + 22))
        card_lip(art, cx - w / 2, cy - h / 2, w, h, 9, col, dark, lip=5)
        art.pop()
    cx, cy = 54, 44
    art.push(rotate(12, cx, cy + 22))
    x0, y0 = cx - w / 2, cy - h / 2
    art.rect(x0 + 6, y0 + 7, 9, 4.5, WHITE, rx=2.25, extra=HI)
    for i, bw in enumerate((26, 18, 24, 14)):
        art.rect(x0 + 8, y0 + 17 + i * 8.5, bw, 5, WHITE if i == 0 else GOLD_D, rx=2.5)
    art.pop()
    return art


def dictionary():
    art = Art('dictionary.svg', 96, 96)
    art.push(rotate(-10, 48, 50))
    x, y, w, h = 20, 12, 54, 70
    # the page block shows along the right and bottom, under the cover
    art.rect(x + 6, y + 6, w, h, GREY2, rx=8)
    art.rect(x + 4, y + 3, w, h - 1, WHITE, rx=8)
    for i in range(4):
        art.rect(x + w - 3, y + 14 + i * 13, 6, 2.2, GREY1, rx=1.1)
    art.rect(x + 10, y + h - 0.5, w - 16, 2.2, GREY1, rx=1.1)
    # cover, spine darker on the left edge
    art.rect(x, y, w, h - 4, BLUE, rx=8)
    art.rect(x, y, 12, h - 4, BLUE_D, rx=6)
    art.rect(x + 8, y, 4, h - 4, BLUE_D)
    # title label and a ribbon
    art.rect(x + 19, y + 14, 28, 18, WHITE, rx=5)
    art.rect(x + 24, y + 19, 18, 3.4, BLUE, rx=1.7)
    art.rect(x + 24, y + 25, 12, 3.4, BLUE, rx=1.7)
    art.rect(x + 16, y + 40, 4, 16, WHITE, rx=2, extra=HI)
    art.poly([(x + 36, y + h - 6), (x + 44, y + h - 6), (x + 44, y + h + 10), (x + 40, y + h + 6), (x + 36, y + h + 10)], RED, r=[0, 0, 1, 1, 1])
    art.pop()
    return art


def chat():
    art = Art('chat.svg', 96, 96)
    art.push(rotate(-6, 48, 46))
    x, y, w, h = 12, 18, 72, 52
    tail = [(x + 14, y + h - 4), (x + 30, y + h - 4), (x + 12, y + h + 14)]
    art.poly([(a, b + 5) for a, b in tail], PURPLE_D, r=[2, 2, 3])
    card_lip(art, x, y, w, h, 18, PURPLE, PURPLE_D, lip=5)
    art.poly(tail, PURPLE, r=[2, 2, 3])
    art.rect(x + 10, y + 7, 14, 6, WHITE, rx=3, extra=HI)
    for i in range(3):
        art.circle(x + 20 + i * 16, y + h / 2 + 2, 5.5, WHITE)
    art.pop()
    return art


def soon():
    art = Art('soon.svg', 96, 96)
    cx, cy, r = 44, 44, 34
    art.circle(cx + 2.5, cy + 3, r, GREY2)
    art.circle(cx, cy, r, GREY1)
    land = '#CDCDCD'
    # continents, flat blobs
    art.poly([(24, 30), (38, 22), (48, 26), (44, 36), (34, 40), (30, 50), (22, 44)], land, r=5)
    art.poly([(50, 46), (62, 42), (70, 50), (62, 66), (52, 62)], land, r=5)
    art.poly([(56, 20), (66, 18), (72, 28), (62, 28)], land, r=3)
    art.rect(cx - 24, cy - 26, 6, 14, WHITE, rx=3, rot=(35, cx - 21, cy - 19), extra='opacity=".6"')
    # the gold plus badge
    bx, by, br = 68, 68, 17
    art.circle(bx + 1.5, by + 2.5, br, GOLD_D)
    art.circle(bx, by, br, GOLD)
    art.rect(bx - 2.75, by - 9, 5.5, 18, WHITE, rx=2.75)
    art.rect(bx - 9, by - 2.75, 18, 5.5, WHITE, rx=2.75)
    return art



def main():
    os.makedirs(OUT, exist_ok=True)
    for fn in (logo, hero, spain, france, italy, translator, conjugator, dictionary, chat, soon):
        art = fn()
        n = art.save()
        print(f'{art.name:18s} {n:6d} bytes')
        if art.w >= 400:
            assert n < 25000, (art.name, 'too big')
    # the favicon is the logo, byte for byte
    if OUT == os.path.join(ROOT, 'public', 'assets', 'art'):
        shutil.copyfile(os.path.join(OUT, 'logo.svg'), os.path.join(ROOT, 'public', 'favicon.svg'))
        print('favicon.svg        copied from logo.svg')


if __name__ == '__main__':
    main()
