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
        self.clipped = 0
        self.ids = 0

    # shading: shapes drawn between clip_begin() and clip_end() only show
    # inside the outline d (whose points are checked like any other shape)
    def clip_begin(self, d, pts, what='clip'):
        self.ids += 1
        cid = f'{self.name[:2]}{self.ids}'
        self.add(f'<clipPath id="{cid}"><path d="{d}"/></clipPath>', pts, what)
        self.out.append(f'<g clip-path="url(#{cid})">')
        self.clipped += 1

    def clip_end(self):
        self.out.append('</g>')
        self.clipped -= 1

    # every shape goes through here, with the points that bound it
    def add(self, svg, pts, what=''):
        m = self.stack[-1]
        if self.clipped:
            # inside a clip: the clip's own outline has been checked already
            self.out.append(svg)
            return
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
# Profe is a blue axolotl in a little mortarboard, posed like the user's
# reference drawing (mirrored): a wide flat head on top with the big round
# eyes up on its corners, three gill fronds fanning out each side, small
# splayed hands held out, a slim body, and a long tail sweeping down to the
# lower right. Shaded the way Duolingo shades Duo: big flat shapes, a
# lighter face and belly, a darker crescent down the lower right, bold
# rounded highlights. No outlines, no gradients.
#
# It is drawn in its own units (the reference traced at 4x, so about 520
# units tall), with the head centred on (HX, HY), and placed by the caller.
AX, AX_L, AX_LL = '#4B9AF3', '#A4CEFF', '#CFE5FF'    # body, belly and face, highlights
AX_D, AX_DD = '#3C81DB', '#2F6AC0'                   # shade, deepest shade
GILL, GILL_L, GILL_LL = '#5B6FE8', '#7E8CF0', '#A9B3F7'   # gills: a violet-leaning blue
EYE_INK = '#22265A'
PINK = '#FF8FB5'
SAY_INK = '#3C81DB'                                  # the speech bubbles' lettering
# the same bubbles for the dark page (mascot-dark.svg): fill, edge and lip, lettering
SAY_DARK = ('#202F36', '#37464F', '#78B0FC')
HX, HY, HW, HH, SQK = 220, 128, 124, 74, 0.74        # the head
EYE_DX, EYE_Y, EYE_R, SOCKET_R = 68, 104, 31, 40     # eyes, and the bumps they sit in
HEAD_TILT = 4


def squircle_pts(hw, hh, k=SQK, cx=0, cy=0, n=16):
    """A squircle as points, clockwise from the top: four cubic arcs."""
    T, R, B, L = (cx, cy - hh), (cx + hw, cy), (cx, cy + hh), (cx - hw, cy)
    segs = [(T, (cx + k * hw, cy - hh), (cx + hw, cy - k * hh), R),
            (R, (cx + hw, cy + k * hh), (cx + k * hw, cy + hh), B),
            (B, (cx - k * hw, cy + hh), (cx - hw, cy + k * hh), L),
            (L, (cx - hw, cy - k * hh), (cx - k * hw, cy - hh), T)]
    d = f'M{f(T[0])} {f(T[1])}' + ''.join(
        f'C{f(a[0])} {f(a[1])} {f(b[0])} {f(b[1])} {f(c[0])} {f(c[1])}' for _, a, b, c in segs) + 'Z'
    return d, [T] + [p for s in segs for p in bezier(*s, n=n)]


def inside_poly(p, poly):
    x, y = p
    c = False
    for (x0, y0), (x1, y1) in zip(poly, poly[1:] + poly[:1]):
        if (y0 > y) != (y1 > y) and x < x0 + (y - y0) * (x1 - x0) / (y1 - y0):
            c = not c
    return c


def inside_any(p, shapes):
    return any(inside_poly(p, sp) for _, sp in shapes)


def clockwise(pts):
    """The same polygon, wound clockwise on screen."""
    a = sum(p[0] * q[1] - q[0] * p[1] for p, q in zip(pts, pts[1:] + pts[:1]))
    return pts if a > 0 else pts[::-1]


def disc(c, r, n=16):
    """A circle as a shape: (path, points). Every shape here is wound the
    same way (anticlockwise on screen), so several overlapping ones fill as
    one union under the nonzero rule."""
    x, y = c
    d = f'M{f(x + r)} {f(y)}A{f(r)} {f(r)} 0 1 0 {f(x - r)} {f(y)}A{f(r)} {f(r)} 0 1 0 {f(x + r)} {f(y)}Z'
    return d, arc_pts(x, y, r, r, 0, 360, n)[:-1]


def hull(p, r1, q, r2, n=10):
    """A tapered rounded limb from p (radius r1) to q (radius r2): the
    outline round two circles, as (path, points)."""
    L = math.dist(p, q)
    phi = math.atan2(q[1] - p[1], q[0] - p[0])
    al = math.acos(max(-1.0, min(1.0, (r1 - r2) / L)))

    def at(c, r, a):
        return c[0] + r * math.cos(a), c[1] + r * math.sin(a)
    a0, a1, b0, b1 = at(q, r2, phi + al), at(q, r2, phi - al), at(p, r1, phi - al), at(p, r1, phi + al)
    d = (f'M{f(a0[0])} {f(a0[1])}A{f(r2)} {f(r2)} 0 {int(2 * al > math.pi)} 0 {f(a1[0])} {f(a1[1])}'
         f'L{f(b0[0])} {f(b0[1])}A{f(r1)} {f(r1)} 0 {int(2 * al < math.pi)} 0 {f(b1[0])} {f(b1[1])}Z')
    pts = [at(q, r2, phi + al - 2 * al * i / n) for i in range(n + 1)]
    pts += [at(p, r1, phi - al - (2 * math.pi - 2 * al) * i / n) for i in range(n + 1)]
    return d, pts


def poly_shape(pts):
    """A polygon as a shape, wound like the others."""
    pts = clockwise(pts)[::-1]
    return poly_d(pts), pts


def shade(art, shapes, base, dark, shift, what, extra=None):
    """Duolingo shading. Clipped to the shape (one or several overlapping
    (path, points) shapes): its dark tone, then its base tone shifted up and
    left, so a crescent of dark is left down the lower right. extra() draws
    more inside the same clip."""
    d = ''.join(sd for sd, _ in shapes)
    pts = [p for _, sp in shapes for p in sp]
    art.clip_begin(d, pts, what)
    x0, y0 = min(p[0] for p in pts), min(p[1] for p in pts)
    x1, y1 = max(p[0] for p in pts), max(p[1] for p in pts)
    art.rect(x0 - 2, y0 - 2, x1 - x0 + 4, y1 - y0 + 4, dark, what=what + ' shade')
    art.add(f'<path d="{d}" fill="{base}" transform="translate({f(shift[0])} {f(shift[1])})"/>', pts, what)
    if extra:
        extra()
    art.clip_end()


def hand(centre, r, ang, fingers=4, spread=110):
    """A chubby little hand: a round palm and round fingers fanned out
    along `ang` (degrees, y down)."""
    polys = [disc(centre, r)]
    for i in range(fingers):
        a = math.radians(ang - spread / 2 + spread * i / (fingers - 1))
        polys.append(disc((centre[0] + math.cos(a) * r * 1.05, centre[1] + math.sin(a) * r * 1.05), r * 0.46, n=10))
    return polys


def head_shape():
    """The head: a wide squircle with a round bump on each upper corner for
    the eyes to sit in."""
    head = poly_shape(squircle_pts(HW, HH, cx=HX, cy=HY)[1])
    sockets = [disc((HX + s * EYE_DX, EYE_Y), SOCKET_R) for s in (-1, 1)]
    return [head] + sockets


def frond(side, root, ang, length, r1, r2, lobes=True):
    """One gill frond: a plump leaf, narrow where it leaves the head,
    swelling past the middle and rounding off at the tip, with a frill of
    small round scallops down its lower edge."""
    a = math.radians(ang)
    ux, uy = side * math.cos(a), -math.sin(a)
    tip = (root[0] + ux * length, root[1] + uy * length)
    mid = (root[0] + ux * length * 0.62, root[1] + uy * length * 0.62)
    polys = [hull(root, r1, mid, r2), hull(mid, r2, tip, r2 * 0.72)]
    if lobes:
        # the lower edge is the one turned toward the body
        nx, ny = uy * side, -ux * side
        if ny < 0:
            nx, ny = -nx, -ny
        for t, r in ((0.42, r2 * 0.42), (0.68, r2 * 0.5), (0.9, r2 * 0.42)):
            c = (root[0] + ux * length * t, root[1] + uy * length * t)
            w = r1 + (r2 - r1) * min(1.0, t / 0.62) if t < 0.62 else r2 - (r2 * 0.28) * (t - 0.62) / 0.38
            polys.append(disc((c[0] + nx * (w - 1), c[1] + ny * (w - 1)), r, n=10))
    return polys, tip


# each gill: (root x offset from the eye, root y, angle from the outward
# horizontal, length) - fanning from straight up round to straight out
GILLS = ((22, 82, 74, 62), (40, 98, 38, 68), (48, 122, 4, 58))
# the logo's: fewer lobes, stubbier, swept a little more upward to fit
LOGO_GILLS = ((20, 84, 100, 60), (32, 98, 70, 54), (36, 120, 40, 38))


def gills(art, logo=False):
    tips, roots = [], []
    for side in (-1, 1):
        for dx, y, ang, L in (GILLS if not logo else LOGO_GILLS):
            x = HX + side * (EYE_DX + dx)
            r1, r2 = (7, 14) if not logo else (11, 17)
            polys, tip = frond(side, (x, y), ang, L, r1, r2, lobes=not logo)
            hi = None
            if not logo:
                hi = (lambda tip=tip, root=(x, y): art.circle(root[0] + (tip[0] - root[0]) * 0.62 - 4, root[1] + (tip[1] - root[1]) * 0.62 - 5, 4.5, GILL_LL, what='gill highlight'))
            shade(art, polys, GILL_L, GILL, (-4, -5), 'gill', hi)
            tips.append(tip)
            roots.append((x, y))
    return tips, roots


def head(art, logo=False):
    """The head, face and mortarboard (gills drawn first, behind). Returns
    the head's shapes and the board's outline."""
    shapes = head_shape()
    hpts = shapes[0][1]

    def inner():
        # the paler face below the eyes
        art.ellipse(HX, HY + 54, 98, 46, AX_L, what='face')
        if not logo:
            art.ellipse(HX - 104, HY + 6, 10, 20, AX_LL, rot=12, what='highlight')
            art.circle(HX - 108, HY + 38, 6.5, AX_LL, what='highlight')
    shade(art, shapes, AX, AX_D, (-22, -14), 'head', inner)

    # cheeks, under and outside the eyes
    for s in (-1, 1):
        art.ellipse(HX + s * 84, HY + 30, 15, 9, PINK, extra='opacity=".75"', what='cheek')

    # eyes: big whites in their bumps, big dark pupils looking out at us,
    # two catchlights each
    er = EYE_R if not logo else 34
    for s in (-1, 1):
        ex, ey = HX + s * EYE_DX, EYE_Y
        art.circle(ex, ey, er, WHITE, what='eye')
        pr = er * 0.7
        px, py = ex - s * 2, ey + 3
        assert math.hypot(px - ex, py - ey) + pr < er - 2, 'pupil falls out of the eye'
        art.ellipse(px, py, pr, pr * 1.06, EYE_INK, what='pupil')
        art.circle(px - pr * 0.34, py - pr * 0.38, pr * 0.4, WHITE, what='catchlight')
        if not logo:
            art.circle(px + pr * 0.42, py + pr * 0.42, pr * 0.16, WHITE, what='catchlight')
        for a in range(0, 360, 20):
            q = (ex + er * math.cos(math.radians(a)), ey + er * math.sin(math.radians(a)))
            assert inside_any(q, shapes), 'eye off the head'
        assert inside_poly((ex, ey), hpts), 'eye not on the head'

    # the mouth: a sweet little open smile with a pink tongue
    mx, my, mw, md = HX, HY + 40, 24, 16
    if logo:
        mw, md = 26, 18
    mouth = (f'M{f(mx - mw)} {f(my)}Q{f(mx)} {f(my + 6)} {f(mx + mw)} {f(my)}'
             f'C{f(mx + mw)} {f(my + md * 0.8)} {f(mx + mw * 0.5)} {f(my + md)} {f(mx)} {f(my + md)}'
             f'C{f(mx - mw * 0.5)} {f(my + md)} {f(mx - mw)} {f(my + md * 0.8)} {f(mx - mw)} {f(my)}Z')
    mpts = [(mx - mw, my), (mx + mw, my), (mx, my + md)]
    art.clip_begin(mouth, mpts, 'mouth')
    art.path(mouth, mpts, EYE_INK, what='mouth')
    art.ellipse(mx + 2, my + md + 1, mw * 0.6, md * 0.5, PINK, what='tongue')
    art.clip_end()
    assert my > EYE_Y + er - 4, 'mouth runs into the eyes'
    assert inside_poly((mx, my + md + 8), hpts), 'mouth off the face'

    # the mortarboard, small, sat on the crown between the eye bumps: a
    # skull cap that sinks into the head, the board on top of it
    top = HY - HH
    cw, cb, ct = (38, top + 16, top - 6) if not logo else (46, top + 18, top - 8)
    capp = [(HX - cw, cb), (HX - cw - 2, ct), (HX + cw + 2, ct), (HX + cw, cb)]
    # the cap's lower edge bows down a little, round the head
    capp = capp[:1] + capp[1:3] + [capp[3]] + [(HX, cb + 6)]
    shade(art, [poly_shape(capp)], INK, INK_D, (-8, -3), 'cap')
    for x, y in (capp[0], capp[3], capp[4]):
        assert inside_any((x, y + 2), shapes), 'the cap does not sit down into the head'
    for s in (-1, 1):
        sx = HX + s * EYE_DX
        assert math.dist((HX + s * cw, cb), (sx, EYE_Y)) > er + 4, 'the cap covers an eye'
    bw, bh, bt = (66, 18, 7) if not logo else (80, 22, 9)
    by = ct - 2
    board = [(HX - bw, by), (HX, by - bh), (HX + bw, by), (HX, by + bh)]
    art.poly([(x, y + bt) for x, y in board], INK_D, r=6, what='board edge')
    art.poly(board, INK, r=6, what='board')
    art.poly([(HX, by - bh), (HX + bw, by), (HX, by + bh)], '#444444', r=6, what='board shade')
    if not logo:
        art.rect(HX - bw + 22, by - 8, 26, 7, WHITE, rx=3.5, rot=(-14, HX - bw + 35, by - 4.5), extra='opacity=".22"', what='board highlight')
    # no bald gap: the board's underside reaches down past the cap's top
    assert by + bh + bt > ct + 8, 'gap between the board and the cap'
    for s in (-1, 1):
        assert by + bt < EYE_Y - er, 'the board hides an eye'
    # the tassel: a short one off the left corner, dangling just above the eye
    tx = HX - bw + 8
    hang = by + (12 if not logo else 8)
    art.line([(HX, by), (tx, by + 1), (tx, hang)], GOLD_D if not logo else GOLD, 4 if not logo else 8, what='cord')
    tw, th = (11, 15) if not logo else (18, 14)
    art.rect(tx - tw / 2, hang - 3, tw, th, GOLD, rx=tw / 2, what='tassel')
    art.rect(tx, hang - 3, tw / 2, th, GOLD_D, rx=tw / 4, what='tassel shade')
    art.circle(HX, by, 6 if not logo else 10, GOLD, what='button')
    ex = HX - EYE_DX
    assert abs(tx - ex) > er + tw / 2 or hang - 3 + th < EYE_Y - er - 2, 'tassel over the eye'
    return shapes, board


def logo():
    art = Art('logo.svg', 64, 64)
    art.push(place(32, 33, 0.186))
    art.push(translate(-HX, -(HY - 8)))
    art.begin_track()
    tips, roots = gills(art, logo=True)
    shapes, _ = head(art, logo=True)
    for r in roots:
        assert inside_any(r, shapes), 'gill not attached to the head'
    art.assert_centred(art.end_track(), 'logo', tol=1.5)
    art.pop()
    art.pop()
    return art


def say(art, x, y, w, h, s, tail_to, size=28, tilt=0, dark=False):
    """A white speech bubble with a light grey edge and lip, blue lettering,
    and a tail toward `tail_to`. All the hero's bubbles are this one colour."""
    cx, cy = x + w / 2, y + h / 2
    est = 0.62 * size * len(s.replace('¡', 'i'))
    assert est + 28 <= w, (s, 'bubble too tight for its word', est, w)
    if tilt:
        art.push(rotate(tilt, cx, cy))
    tx, ty = tail_to
    e, lip, rx = 2.5, 4.5, h / 2.3
    # the tail grows from the point inside the bubble nearest its target,
    # so it leaves whichever edge faces the axolotl
    bx, by = min(max(tx, x + rx), x + w - rx), min(max(ty, y + 12), y + h - 12)
    L = math.dist((bx, by), (tx, ty))
    px, py = -(ty - by) / L, (tx - bx) / L
    tail = [(bx + px * 14, by + py * 14), (bx - px * 14, by - py * 14), (tx, ty)]
    k = 14 - e * 1.4
    inner = [(bx + px * k, by + py * k), (bx - px * k, by - py * k),
             (tx + (bx - tx) * 2.2 * e / L, ty + (by - ty) * 2.2 * e / L)]
    fill, edge, ink = SAY_DARK if dark else (WHITE, GREY1, SAY_INK)
    art.poly([(px, py + lip) for px, py in tail], edge, r=[2, 2, 3], what='bubble tail lip')
    art.rect(x - e, y - e, w + 2 * e, h + 2 * e + lip, edge, rx=rx + e, what='bubble edge')
    art.poly(inner, fill, r=[2, 2, 2.5], what='bubble tail')
    art.rect(x, y, w, h, fill, rx=rx, what='bubble')
    art.text(cx, cy + size * 0.36, s, size, ink)
    if tilt:
        art.pop()
    return (x - 8, y - 8, x + w + 8, y + h + 12)


def tail_shape(p0, p1, p2, p3, w0, w1, n=28, bulge=0.25):
    """A tapering tail along a cubic centre line, w0 wide at the root and w1
    at the rounded tip."""
    c = [p0] + bezier(p0, p1, p2, p3, n)
    left, right = [], []
    for i, p in enumerate(c):
        q = c[min(i + 1, n)]
        o = c[max(i - 1, 0)]
        t = math.hypot(q[0] - o[0], q[1] - o[1]) or 1
        nx, ny = -(q[1] - o[1]) / t, (q[0] - o[0]) / t
        t = i / n
        w = w0 + (w1 - w0) * t + w0 * bulge * math.sin(math.pi * t)
        left.append((p[0] + nx * w, p[1] + ny * w))
        right.append((p[0] - nx * w, p[1] - ny * w))
    return [poly_shape(left + right[::-1]), disc(p3, w1)], c


def dots(art, seed, box, n, avoid, spacing=60):
    """The reference's confetti: round dots of a few sizes, and the odd
    small rounded square."""
    rnd = random.Random(seed)
    cols = [AX, GOLD, PINK, GILL_L, ORANGE, AX_L]
    placed, tries = [], 0
    x0, y0, x1, y1 = box
    while len(placed) < n and tries < 20000:
        tries += 1
        x, y = rnd.uniform(x0, x1), rnd.uniform(y0, y1)
        r = rnd.choice((6, 8, 11, 15))
        if any(ax0 - r - 8 < x < ax1 + r + 8 and ay0 - r - 8 < y < ay1 + r + 8 for ax0, ay0, ax1, ay1 in avoid):
            continue
        if any(math.dist((x, y), p) < spacing for p in placed):
            continue
        placed.append((x, y))
        c = cols[len(placed) % len(cols)]
        if len(placed) % 4 == 0:
            art.rect(x - r * 0.8, y - r * 0.8, r * 1.6, r * 1.6, c, rx=r * 0.4, rot=(rnd.uniform(0, 90), x, y), what='confetti')
        else:
            art.circle(x, y, r, c, what='confetti')
    assert len(placed) == n, (art.name, 'could not place all the confetti', len(placed))


def hero(dark=False):
    """The home page's mascot; dark=True is the same drawing with the speech
    bubbles in dark-theme colours, for the dark page."""
    art = Art('mascot-dark.svg' if dark else 'mascot.svg', 560, 480)
    S = 0.84
    OX, OY = 276 - 232 * S, 236 - 262 * S          # local (232, 262) to just left of centre
    M = place(OX, OY, S)[1]
    art.push(place(OX, OY, S))
    art.begin_track()

    # the body: a slim, slightly pear-shaped trunk under the head, leaning
    # a touch to the right as it goes down
    body = [hull((224, 206), 46, (242, 282), 50), disc((246, 300), 38)]
    # the tail: straight down from the hips, sweeping out to the lower right
    tail, spine = tail_shape((244, 296), (232, 384), (356, 382), (384, 476), 25, 6)
    fin, _ = tail_shape((236, 310), (220, 392), (344, 398), (374, 478), 27, 10)
    shade(art, fin, AX_L, AX_LL, (0, 0), 'tail fin')
    shade(art, tail, AX, AX_D, (-9, -9), 'tail',
          lambda: art.ellipse(296, 392, 22, 8, AX_LL, rot=24, what='tail highlight'))
    assert inside_any((244, 300), body), 'tail not attached to the body'
    # little back legs, splayed at the hips
    legs = [((216, 304), 13, (180, 324), 11, 160), ((274, 300), 13, (310, 318), 11, 20)]
    for p, r1, q, r2, toe in legs:
        shade(art, [hull(p, r1, q, r2)] + hand(q, r2, toe, fingers=3, spread=90), AX, AX_D, (-4, -5), 'leg')
        assert inside_any(p, body), 'leg not attached to the body'
        assert not inside_any(q, body), 'foot inside the body'
    # arms held out to the sides, small splayed hands
    arms = [((204, 228), 18, (138, 250), 14, 190), ((252, 230), 18, (318, 258), 14, 10)]
    for p, r1, q, r2, fan in arms:
        shade(art, [hull(p, r1, q, r2)] + hand(q, r2, fan), AX, AX_D, (-4, -5), 'arm')
        assert inside_any(p, body), 'arm not attached to the body'
        assert not inside_any(q, body), 'hand inside the body'

    def belly():
        art.ellipse(236, 270, 30, 40, AX_L, rot=-8, what='belly')
        art.ellipse(206, 250, 8, 16, AX_LL, rot=10, what='highlight')
    shade(art, body, AX, AX_D, (-16, -8), 'body', belly)

    # the head, tilted a little toward the tail
    art.push(rotate(HEAD_TILT, 228, 206))
    tips, roots = gills(art)
    shapes, board = head(art)
    for r in roots:
        assert inside_any(r, shapes), 'gill not attached to the head'
    Mh = mul(M, rotate(HEAD_TILT, 228, 206)[1])
    keep = [apply(Mh, p) for _, sp in shapes for p in sp] + [apply(Mh, p) for p in board + tips]
    # the chin sits down over the body
    assert inside_any(apply(rotate(HEAD_TILT, 228, 206)[1], (HX, HY + HH - 4)), body), 'head not on the body'
    art.pop()
    m_box = art.end_track()
    art.pop()
    keep += [apply(M, p) for p in spine]
    keep += [apply(M, q) for _, _, q, _, _ in arms + legs]
    assert abs((m_box[0] + m_box[2]) / 2 - 280) <= 24, ('mascot not centred', m_box)

    # three speech bubbles, saying hello in each language, all the same colour
    boxes = []
    boxes.append(say(art, 10, 146, 126, 56, '¡Hola!', (166, 158), size=26, tilt=-4, dark=dark))
    boxes.append(say(art, 410, 196, 142, 56, 'Bonjour', (394, 178), size=26, tilt=3, dark=dark))
    boxes.append(say(art, 22, 360, 114, 56, 'Ciao', (150, 336), size=26, tilt=-4, dark=dark))
    for b in boxes:
        for x, y in keep:
            assert not (b[0] < x < b[2] and b[1] < y < b[3]), ('bubble on the mascot', b, round(x), round(y))

    dots(art, 7, (14, 14, 546, 466), 7, [m_box, *boxes], spacing=70)
    return art


# ------------------------------------------------------------------ Spain
# The Sagrada Familia's Passion facade, front on, traced from the user's
# reference drawing: four slender spires (the inner pair tallest), a pointed
# gable between them, the big pediment porch with its leaning columns, two
# lower wings with pinnacles, a stepped plinth. Drawn in the reference's own
# pixels (its centre line at x = 450, the plinth's foot at y = 812) and
# scaled onto the canvas.
SG, SG_L, SG_D, SG_DD, SG_GOLD, SG_GOLD_D = '#D9B07A', '#E8C795', '#B98A55', '#8E6438', '#D9963A', '#B87A26'


def sg_shaded(art, pts, cx, lit=SG, dark=SG_D, r=0, what='stone'):
    """A stone face, its part right of cx in shade."""
    art.poly(pts, lit, r=r, what=what)
    half = clip_x(pts, cx)
    if len(half) > 2:
        art.poly(half, dark, what=what + ' shade')


def sg_finial(art, cx, y, s=1.0):
    """A gold cross-flower finial standing on (cx, y): a short stem and four
    round petals round a round centre."""
    art.rect(cx - 2.5 * s, y - 14 * s, 5 * s, 16 * s, SG_GOLD_D, rx=2.5 * s, what='finial stem')
    c = y - 22 * s
    for dx, dy in ((0, -7), (7, 0), (0, 7), (-7, 0)):
        art.circle(cx + dx * s, c + dy * s, 5 * s, SG_GOLD if dx <= 0 else SG_GOLD_D, what='finial petal')
    art.circle(cx, c, 4.5 * s, SG_GOLD, what='finial heart')
    return c - 12 * s


def sg_spire(art, cx, tip, band, base, hw):
    """A spire: a slotted shaft up to a band, then a long cone to the
    finial. Returns the finial's top."""
    shaft = [(cx - hw, base), (cx - hw * 0.86, band), (cx + hw * 0.86, band), (cx + hw, base)]
    sg_shaded(art, shaft, cx + hw * 0.3, what='spire')
    cone = [(cx - hw * 0.66, band), (cx - 3, tip), (cx + 3, tip), (cx + hw * 0.66, band)]
    sg_shaded(art, cone, cx + hw * 0.22, lit=SG_L, dark=SG, r=[0, 3, 3, 0], what='spire cone')
    # bands round the spire
    for y, k in ((band, 1.0), (band + (base - band) * 0.42, 1.04)):
        w = hw * (0.86 + 0.14 * (y - band) / (base - band)) * k + 3
        art.rect(cx - w, y - 5, 2 * w, 10, SG_L, rx=4, what='spire band')
        art.rect(cx + hw * 0.3, y - 5, w - hw * 0.3, 10, SG, rx=4, what='spire band shade')
    # rows of small dark slot windows down the shaft, and up the cone
    y = band + 22
    while y < base - 18:
        if abs(y - (band + (base - band) * 0.42)) > 16:
            for dx in (-0.5, 0, 0.5):
                art.rect(cx + dx * hw - 2.6, y - 7, 5.2, 14, SG_DD, rx=2.6, what='spire slot')
        y += 26
    for i in range(3):
        y = band - 24 - i * 30
        w = hw * 0.66 * (y - tip) / (band - tip)
        if w > 9:
            for dx in (-0.36, 0.36):
                art.rect(cx + dx * w - 2, y - 5, 4, 10, SG_D, rx=2, what='cone slot')
    art.ellipse(cx - hw * 0.55, band + (base - band) * 0.22, 4.5, 26, WHITE, extra=HI, what='spire highlight')
    top = sg_finial(art, cx, tip + 4)
    return top


def spain():
    art = Art('es.svg', 560, 480)
    sun(art, 478, 96, 38)
    ground = (280, 436, 238, 24)
    grass(art, ground, pill=(132, 446, 34))
    round_tree(art, 64, 432, ground, 0.72)
    round_tree(art, 498, 430, ground, 0.66)

    s = 0.56
    art.push(place(280 - 450 * s, 437 - 812 * s, s))
    art.begin_track()
    C = 450
    art.ellipse(C + 8, 812, 300, 16, GREEN_D, what='basilica shadow')

    # the four spires, the inner pair tallest
    tops = []
    for dx, tip, band, hw in ((-107, 186, 330, 25), (107, 186, 330, 25), (-48, 150, 296, 24), (48, 150, 296, 24)):
        tops.append(sg_spire(art, C + dx, tip, band, 560, hw))
    assert tops[2] < tops[0] - 20, 'the inner spires should stand taller'

    # the pointed gable rising between the inner spires, a round window and
    # a small cross-topped gable in it
    gable = [(C - 26, 560), (C - 26, 300), (C, 214), (C + 26, 300), (C + 26, 560)]
    sg_shaded(art, gable, C + 8, r=[0, 6, 4, 6, 0], what='gable')
    art.ellipse(C, 352, 10, 14, SG_DD, what='rose window')
    for y in (392, 420):
        for dx in (-10, 10):
            art.rect(C + dx - 2.5, y - 8, 5, 16, SG_DD, rx=2.5, what='gable slot')
    small = [(C - 22, 520), (C - 22, 470), (C, 440), (C + 22, 470), (C + 22, 520)]
    sg_shaded(art, small, C + 6, lit=SG_L, dark=SG, r=[0, 4, 3, 4, 0], what='small gable')
    art.rect(C - 2, 452, 4, 26, SG_DD, rx=2, what='cross')
    art.rect(C - 9, 459, 18, 4, SG_DD, rx=2, what='cross')
    assert 214 > tops[2], 'gable taller than the spires'

    # the ribbed mass behind the porch, between the spires and the wings
    art.rect(C - 232, 512, 464, 94, SG_D, rx=6, what='upper mass')
    art.rect(C + 60, 512, 172, 94, SG_DD, rx=6, extra='opacity=".45"', what='upper mass shade')
    for x in range(int(C - 224), int(C + 230), 16):
        art.rect(x, 518, 6, 82, SG_L if x < C else SG, rx=3, what='rib')

    # the wings, with a row of small pointed pinnacles along each roof
    for side in (-1, 1):
        x0, x1 = (C - 232, C - 150) if side < 0 else (C + 150, C + 232)
        for i in range(4):
            px = x0 + 10 + i * (x1 - x0 - 20) / 3
            ph = 92 if i % 2 == 0 else 74
            pin = [(px - 10, 600), (px - 2, 600 - ph), (px + 2, 600 - ph), (px + 10, 600)]
            sg_shaded(art, pin, px + 2, lit=SG_L, dark=SG, what='pinnacle')
        lit, dark = (SG, SG_D) if side < 0 else (SG_D, SG_D)
        art.rect(x0, 604, x1 - x0, 176, lit, what='wing')
        if side > 0:
            art.rect(x0, 604, 10, 176, SG, what='wing edge')
        art.rect(x0 - 6, 594, x1 - x0 + 12, 16, SG_L if side < 0 else SG, rx=5, what='cornice')
        for r in range(3):
            for k in range(4):
                wx = x0 + 12 + k * (x1 - x0 - 24) / 3
                art.rect(wx - 4, 626 + r * 50, 8, 34, SG_DD, rx=4, what='wing window')
    art.ellipse(C - 214, 690, 5, 30, WHITE, extra=HI, what='wing highlight')

    # the porch: a dark recess, a row of leaning columns, the pointed central
    # door, the chevron of the lower gable and the big pediment over it all
    art.rect(C - 150, 600, 300, 176, SG_DD, what='porch recess')
    for side in (-1, 1):
        for k, bx in enumerate((136, 100, 64)):
            b, t = C + side * bx, C + side * (bx + 10 + 4 * k)
            col = [(b - 9, 776), (t - 7, 640), (t + 7, 640), (b + 9, 776)]
            sg_shaded(art, col, (b + t) / 2 + 3, what='column')
    door = [(C - 40, 776), (C - 40, 652)] + bezier((C - 40, 652), (C - 40, 624), (C - 14, 606), (C, 598), 6) + \
        bezier((C, 598), (C + 14, 606), (C + 40, 624), (C + 40, 652), 6) + [(C + 40, 776)]
    art.poly(door, SG_D, what='doorway')
    wall = [(p[0] * 0.78 + C * 0.22, p[1] + (8 if p[1] < 776 else 0)) for p in door]
    art.poly(wall, SG, what='doorway wall')
    for dx in (-9, 9):
        art.rect(C + dx - 5, 650, 10, 28, SG_DD, rx=5, what='doorway window')
    inner = [(C - 17, 776), (C - 17, 730), (C, 712), (C + 17, 730), (C + 17, 776)]
    art.poly(inner, SG_DD, r=[0, 8, 6, 8, 0], what='door')
    chev = [(C - 160, 664), (C, 562), (C + 160, 664), (C + 140, 664), (C, 586), (C - 140, 664)]
    sg_shaded(art, chev, C, lit=SG_L, dark=SG, what='lower gable')
    ped = [(C - 168, 608), (C, 486), (C + 168, 608)]
    sg_shaded(art, ped, C, lit=SG_L, dark=SG, r=[4, 8, 4], what='pediment')
    for x in range(int(C - 132), int(C + 140), 18):
        yt = 486 + abs(x - C) / 168 * 122 + 16
        if 600 - yt > 14:
            art.rect(x - 4, yt, 8, 598 - yt, SG_DD if x < C else SG_DD, rx=4, extra='opacity=".75"', what='pediment slot')
    art.rect(C - 172, 600, 344, 12, SG_L, rx=5, what='pediment sill')
    art.rect(C, 600, 172, 12, SG, rx=5, what='pediment sill shade')
    art.ellipse(C - 96, 572, 5, 16, WHITE, rot=-50, extra=HI, what='pediment highlight')

    # the stepped plinth and the stairs up to the porch
    art.rect(C - 272, 784, 544, 28, SG, rx=4, what='plinth')
    art.rect(C + 60, 784, 212, 28, SG_D, rx=4, what='plinth shade')
    art.rect(C - 180, 772, 360, 40, SG_L, rx=3, what='stairs')
    art.rect(C + 40, 772, 140, 40, SG, rx=3, what='stairs shade')
    for y in (784, 796):
        art.rect(C - 176, y, 352, 3, SG_D, rx=1.5, what='step')
    box = art.end_track()
    art.pop()
    M = place(280 - 450 * s, 437 - 812 * s, s)[1]
    x0, y0, x1, y1 = box                   # tracked on the canvas already
    art.assert_centred((x0, y0, x1, y1), 'basilica')
    for x in (C - 272, C + 272):
        X, Y = apply(M, (x, 812))
        on_grass(X, Y, ground, what='plinth')
    assert 380 <= y1 - y0 <= 420, ('basilica height', round(y1 - y0))

    confetti(art, 3, (16, 16, 544, 300), 5, [(x0 - 10, y0 - 10, x1 + 10, y1), (40, 50, 200, 210), (24, 300, 120, 430), (440, 50, 530, 150), (450, 300, 540, 430)], spacing=60)
    return art


# ------------------------------------------------------------------ France
def france():
    art = Art('fr.svg', 560, 480)
    mid = 280
    ground = (280, 440, 238, 26)
    grass(art, ground, pill=(96, 448, 40))
    round_tree(art, 92, 446, ground, 0.9)
    round_tree(art, 470, 444, ground, 0.8)

    # proportions traced from the reference drawing: 1.85 times as tall as
    # it is wide at the foot; the first deck at 22% of the height and 56% of
    # the base wide, the great arch's crown at 14%, the second deck at 42%
    # and 58% as wide as the first, the top platform at 87%
    FOOT, TIP = 438, 58
    H = FOOT - TIP
    BASE = round(H / 1.85 / 2)              # half width at the foot
    Y1, Y2, Y3 = FOOT - 0.22 * H, FOOT - 0.42 * H, FOOT - 0.87 * H
    APEX = FOOT - 0.14 * H
    P1 = 0.56 * BASE                        # deck half widths
    P2 = 0.58 * P1
    D1, D2 = 22, 15                         # deck thicknesses
    EI, EI_L, EI_D, EI_DD = '#C8814A', '#DDA06A', '#9E5A2E', '#7E4522'
    LATTICE = 'opacity=".55"'               # the bracing: deep brown, see-through

    def profile(y_bot, y_top, w_bot, w_top, power):
        def w(y):
            t = (y_bot - y) / (y_bot - y_top)
            return w_top + (w_bot - w_top) * (1 - t) ** power
        return w

    def edges(w, y_bot, y_top, n=24):
        left = [(mid - w(y_bot - (y_bot - y_top) * i / n), y_bot - (y_bot - y_top) * i / n) for i in range(n + 1)]
        right = [(2 * mid - x, y) for x, y in reversed(left)]
        return left, right

    def section(pts, what, w, y_bot, y_top, rows, extra=None):
        """A storey: base tone, its right half in shade, then chunky X
        bracing in bands, all clipped to the outline."""
        art.clip_begin(poly_d(pts), pts, what)
        x0, x1 = min(p[0] for p in pts), max(p[0] for p in pts)
        art.rect(x0 - 2, y_top - 2, x1 - x0 + 4, y_bot - y_top + 4, EI, what=what)
        art.rect(mid, y_top - 2, x1 - mid + 2, y_bot - y_top + 4, EI_D, what=what + ' shade')
        if extra:
            extra()
        lw = max(3.4, min(6.5, w(y_bot) * 0.13))
        ys = [y_bot - (y_bot - y_top) * i / rows for i in range(rows + 1)]
        for ya, yb in zip(ys, ys[1:]):
            wa, wb = w(ya), w(yb)
            art.line([(mid - wa, ya), (mid + wa, ya)], EI_DD, lw * 1.2, extra=LATTICE, what='brace')
            # an X across each half, so the bracing follows the splay
            for s in (-1, 1):
                art.line([(mid + s * wa, ya), (mid, yb)], EI_DD, lw, extra=LATTICE, what='brace')
                art.line([(mid, ya), (mid + s * wb, yb)], EI_DD, lw, extra=LATTICE, what='brace')
        art.clip_end()

    art.begin_track()
    art.ellipse(mid + 6, FOOT + 2, BASE + 26, 10, GREEN_D, what='tower shadow')

    # the legs: one splayed trapezoid to the first deck, the great round
    # arch cut out of it
    l_top = Y1 + D1 / 2 - 2
    w_leg = profile(FOOT, l_top, BASE, P1 - 4, 1.35)
    TH = 0.21 * 2 * BASE                    # each leg's width at the foot
    SPRING = FOOT - 10
    a_s = BASE - TH
    left, right = edges(w_leg, FOOT, l_top)
    arch = arc_pts(mid, SPRING, a_s, SPRING - APEX, 0, -180, 28)
    legs = left + right + [(mid + a_s, FOOT)] + arch + [(mid - a_s, FOOT)]

    def intrados():
        # the arch's underside: a band of deep shade just inside it
        art.line(arc_pts(mid, SPRING, a_s + 5, SPRING - APEX + 5, 0, -180, 28), EI_DD, 10, what='arch underside')
    section(legs, 'legs', w_leg, FOOT, l_top, 3, intrados)
    assert 2 * a_s > 1.1 * BASE, 'the arch does not span most of the base'
    assert abs((FOOT - APEX) / H - 0.14) < 0.01

    # the middle storey: a trapezoid with a tall, narrow round-topped
    # opening up its middle
    m_bot, m_top = Y1 - D1 / 2 + 2, Y2 + D2 / 2 - 2
    w_mid = profile(m_bot, m_top, 0.8 * P1, P2 - 6, 1.0)
    left, right = edges(w_mid, m_bot, m_top)
    o_w, o_top = 0.28 * P1, m_top + 0.24 * (m_bot - m_top)
    o_t = o_w * 0.66                        # it narrows a little to a flat top
    opening = [(mid + o_w, m_bot)] + arc_pts(mid + o_t - 4, o_top + 4, 4, 4, 0, -90, 4) + \
        arc_pts(mid - o_t + 4, o_top + 4, 4, 4, -90, -180, 4) + [(mid - o_w, m_bot)]
    section(left + right + opening, 'middle', w_mid, m_bot, m_top, 2)
    assert o_top - m_top > 10 and o_w < w_mid(m_bot) / 2, 'opening breaks the middle storey'

    # the long shaft to the top platform
    s_bot, s_top = Y2 - D2 / 2 + 2, Y3 + 4
    w_up = profile(s_bot, s_top, P2 - 10, 8.5, 1.5)
    left, right = edges(w_up, s_bot, s_top)
    section(left + right, 'shaft', w_up, s_bot, s_top, 6)

    def deck(yc, h, hw, what):
        """A two-band deck: a plain top band and a railing band of little
        dark openings below it, the right half in shade."""
        y = yc - h / 2
        top_h = h * 0.42
        art.rect(mid - hw, y + top_h - 1, 2 * hw, h - top_h + 1, EI, rx=4, what=what)
        art.rect(mid, y + top_h - 1, hw, h - top_h + 1, EI_D, rx=4, what=what + ' shade')
        n = max(4, int(hw / 9))
        n += n % 2
        gap = 2 * hw / n
        for i in range(n):
            x = mid - hw + gap * (i + 0.5)
            art.rect(x - gap * 0.26, y + top_h + 3, gap * 0.52, h - top_h - 7, EI_DD, rx=gap * 0.2,
                     extra='opacity=".7"', what=what + ' railing')
        art.rect(mid - hw - 4, y, 2 * hw + 8, top_h, EI_L, rx=top_h / 2, what=what + ' top')
        art.rect(mid, y, hw + 4, top_h, EI, rx=top_h / 2, what=what + ' top shade')
    for yc, h, hw, below_top, above_bot, below_w, above_w, what in (
            (Y1, D1, P1, l_top, m_bot, w_leg(l_top), w_mid(m_bot), 'first deck'),
            (Y2, D2, P2, m_top, s_bot, w_mid(m_top), w_up(s_bot), 'second deck')):
        assert yc - h / 2 < below_top < yc + h / 2, (what, 'leaves a gap below')
        assert yc - h / 2 < above_bot < yc + h / 2, (what, 'leaves a gap above')
        assert below_w < hw and above_w < hw, (what, 'narrower than its storey')
        deck(yc, h, hw, what)
    assert abs(P1 / BASE - 0.56) < 0.01 and abs(P2 / P1 - 0.58) < 0.01, 'deck widths off'

    # the top: a stacked little cap, a short mast, a ball on the tip
    caps = [(Y3 + 4, 9, 15), (Y3 - 6, 8, 11), (Y3 - 15, 9, 7)]
    for yc, h, hw in caps:
        art.rect(mid - hw, yc - h / 2, 2 * hw, h, EI_L if hw > 8 else EI, rx=3, what='lantern')
        art.rect(mid, yc - h / 2, hw, h, EI_D, rx=3, what='lantern shade')
    assert caps[0][0] - caps[0][1] / 2 < s_top < caps[0][0] + caps[0][1] / 2, 'top platform floats off the shaft'
    m_top = caps[-1][0] - caps[-1][1] / 2
    art.rect(mid - 3, TIP + 4, 6, m_top - TIP - 3, EI_D, rx=3, what='mast')
    art.circle(mid, TIP + 4, 5, EI_L, what='mast ball')
    assert abs((FOOT - Y3) / H - 0.87) < 0.01

    # feet: pads where the legs meet the ground
    for sgn in (-1, 1):
        x0, x1 = mid + sgn * w_leg(FOOT), mid + sgn * a_s
        lo, hi = min(x0, x1) - 4, max(x0, x1) + 4
        art.rect(lo, FOOT - 9, hi - lo, 13, EI_D if sgn > 0 else EI_L, rx=6, what='foot pad')
        for x in (lo, hi):
            on_grass(x, FOOT + 4, ground, what='tower foot')

    # bold rounded highlights on the lit left side
    ly = (Y1 + FOOT) / 2 + 6
    lx = mid - (w_leg(ly) + a_s) / 2 - 6
    art.ellipse(lx, ly, 7, 20, WHITE, rot=28, extra=HI, what='leg highlight')
    sy = Y2 - (Y2 - Y3) * 0.28
    art.ellipse(mid - w_up(sy) * 0.55, sy, 4.5, 26, WHITE, rot=5, extra=HI, what='shaft highlight')
    my_ = (m_bot + m_top) / 2
    art.ellipse(mid - w_mid(my_) * 0.62, my_, 5.5, 14, WHITE, rot=16, extra=HI, what='middle highlight')
    box = art.end_track()
    art.assert_centred(box, 'Eiffel Tower')
    height, width = FOOT - (TIP - 1), 2 * BASE
    assert 1.8 <= height / width <= 1.9, ('Eiffel Tower proportions off', round(height / width, 2))
    assert 370 <= height <= 395, ('Eiffel Tower should stand about 380 tall', round(height))

    confetti(art, 5, (16, 16, 544, 330), 8, [(160, 40, 400, 470), (30, 320, 150, 470), (410, 320, 540, 470)], spacing=60)
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
    art.rect(cx - R + 2.5, t0 + 10, 6, b0 - t0 - 26, WHITE, rx=3, extra='opacity=".8"', what='tower highlight')
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
    for fn in (logo, hero, lambda: hero(dark=True), spain, france, italy, translator, conjugator, dictionary, chat, soon):
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
