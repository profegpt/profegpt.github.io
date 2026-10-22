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
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'public', 'assets', 'art')
MARGIN = 4

# Duolingo's palette
GREEN, GREEN_D, GREEN_L = '#58CC02', '#58A700', '#89E219'
BLUE, BLUE_D = '#1CB0F6', '#1899D6'
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

    # every shape goes through here, with the points that bound it
    def add(self, svg, pts, what=''):
        m = self.stack[-1]
        for p in pts:
            x, y = apply(m, p)
            assert MARGIN - 1e-6 <= x <= self.w - MARGIN + 1e-6 and MARGIN - 1e-6 <= y <= self.h - MARGIN + 1e-6, \
                (self.name, what or svg[:60], 'outside the canvas margin', round(x, 1), round(y, 1))
        self.out.append(svg)

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
    cols = [BLUE, PURPLE, RED, GOLD, GREEN, ORANGE]
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
# scaled up for the hero. It is a chunky green speech bubble with a face,
# wearing a mortarboard: no beak, no feathers, no owl.
BODY = (7.5, 22, 47, 14)            # x, y, w, corner radius
LIP = (2.2, 2.6)                    # the darker copy behind, down and right


def mascot_head(art, bh=32, face_dy=0.0, eyes_dx=1.2):
    """The head, which is also the whole body: bh is its height (the hero
    is a little taller than the logo, to make room for the book)."""
    bx, by, bw, br = BODY
    lx, ly = LIP
    bot = by + bh
    tail = [(13, bot - 5), (10.5, bot + 3.2), (25, bot - 2)]
    tail_d = [(x + lx, y + ly) for x, y in tail]
    # the darker body behind, then the lit one
    art.poly(tail_d, GREEN_D, r=[3, 2.2, 3], what='tail shade')
    art.rect(bx + lx, by + ly, bw, bh, GREEN_D, rx=br, what='body shade')
    art.poly(tail, GREEN, r=[3, 2.2, 3], what='tail')
    art.rect(bx, by, bw, bh, GREEN, rx=br, what='body')
    # highlight pill on the lit upper left
    art.rect(bx + 3.6, by + 9, 3.6, 9, WHITE, rx=1.8, extra=HI, what='body pill')

    cx = bx + bw / 2
    ey = 38 + face_dy
    for ex in (cx - 8.4, cx + 8.4):
        art.circle(ex, ey, 7.8, WHITE, what='eye')
        art.circle(ex + eyes_dx, ey + 0.8, 4.6, INK_D, what='pupil')
        art.circle(ex + eyes_dx - 1.5, ey - 1.0, 1.7, WHITE, what='glint')
        assert bx < ex - 7.8 and ex + 7.8 < bx + bw and by < ey - 7.8, 'eye off the face'
    # a small open smile with a tongue
    my = ey + 9.6
    mw = 3.6
    art.path(f'M{f(cx - mw)} {f(my)}H{f(cx + mw)}A{f(mw)} {f(mw)} 0 0 1 {f(cx - mw)} {f(my)}Z',
             [(cx - mw, my), (cx + mw, my + mw)], INK_D, what='mouth')
    art.path(f'M{f(cx - 2.2)} {f(my + 2.9)}A{f(2.6)} {f(1.6)} 0 0 1 {f(cx + 2.2)} {f(my + 2.9)}A{f(mw)} {f(mw)} 0 0 1 {f(cx - 2.2)} {f(my + 2.9)}Z',
             [(cx - 2.2, my + 1.3), (cx + 2.2, my + mw)], RED, what='tongue')
    assert my + mw < bot - 1.5, 'mouth falls off the body'

    # the mortarboard: a skull cap sitting on the head, the board on top
    cap = [(cx - 13, 15.5), (cx + 13, 15.5), (cx + 11.5, by + 4.2), (cx - 11.5, by + 4.2)]
    assert cap[2][1] > by + 2, 'cap does not sit on the head'
    art.poly(cap, INK, r=2.5, what='cap')
    art.poly([(cx + 1, 15.5), (cx + 13, 15.5), (cx + 11.5, by + 4.2), (cx + 1, by + 4.2)], INK_D, r=[0, 2.5, 2.5, 0], what='cap shade')
    bc = (cx + 1, 13)
    board = [(bc[0], 4.6), (bc[0] + 27, bc[1]), (bc[0], 21.4), (bc[0] - 27, bc[1])]
    art.poly([(x, y + 2.4) for x, y in board], INK_D, r=3, what='board edge')
    art.poly(board, INK, r=3, what='board')
    art.rect(bc[0] - 16, bc[1] - 2.2, 9, 2.6, WHITE, rx=1.3, rot=(-17, bc[0] - 11.5, bc[1] - 1), extra='opacity=".22"', what='board pill')
    assert board[2][1] + 2.4 > cap[0][1], 'board does not meet the cap'
    # tassel: a button, a cord to the right corner and down, a gold tuft
    cord = [bc, (bc[0] + 21, bc[1] + 2), (bc[0] + 21, bc[1] + 14)]
    art.line(cord, GOLD_D, 2.0, what='cord')
    tx, ty = cord[-1]
    art.rect(tx - 2.6, ty - 1, 5.2, 9, GOLD, rx=2.2, what='tassel')
    art.rect(tx, ty - 1, 2.6, 9, GOLD_D, rx=1.3, what='tassel shade')
    art.circle(bc[0], bc[1], 2.3, GOLD, what='button')
    return cx


def logo():
    art = Art('logo.svg', 64, 64)
    mascot_head(art)
    return art


def say(art, x, y, w, h, s, fill, dark, ink, tail_to, size=28, tilt=0):
    """A speech bubble with a lip and a tail toward `tail_to`."""
    cx, cy = x + w / 2, y + h / 2
    if tilt:
        art.push(rotate(tilt, cx, cy))
    tx, ty = tail_to
    # the tail leaves the bubble's bottom edge, nearer the side it points to
    bx = cx + (w * 0.22 if tx > cx else -w * 0.22)
    tail = [(bx - 10, y + h - 6), (bx + 10, y + h - 6), (tx, ty)]
    art.poly([(px, py + 5) for px, py in tail], dark, r=[2, 2, 3], what='bubble tail lip')
    art.rect(x, y + 5, w, h, dark, rx=h / 2.4, what='bubble lip')
    art.poly(tail, fill, r=[2, 2, 3], what='bubble tail')
    art.rect(x, y, w, h, fill, rx=h / 2.4, what='bubble')
    art.rect(x + 9, y + 7, 14, 6, WHITE, rx=3, extra=HI, what='bubble pill')
    art.text(cx, cy + size * 0.36, s, size, ink)
    if tilt:
        art.pop()
    return (x - 4, y - 4, x + w + 4, y + h + 9)


def hero():
    art = Art('mascot.svg', 560, 480)
    S = 4.6
    BH = 37
    ox, oy = 280 - 32 * S, 92
    ground = (280, 404, 196, 30)
    grass(art, ground, pill=(130, 410, 46), light=True)
    art.ellipse(286, 400, 96, 11, GREEN, what='mascot shadow')

    art.push(place(ox, oy, S))
    bx, by, bw, br = BODY
    bot = by + BH
    # feet, behind the body, standing in the grass
    for fx in (23, 39):
        art.ellipse(fx + 1, bot + 4.6, 6.6, 4.0, GREEN_D, what='foot')
        art.ellipse(fx, bot + 3.9, 5.8, 3.3, GREEN, what='foot')
        assert bot + 4.6 - 4 < bot + LIP[1], 'foot does not meet the body'
        for dx in (-4, 5):
            wx, wy = art.world((fx + 1 + dx, bot + 4.6 + 3))
            on_grass(wx, wy, ground, what='foot')
    # the waving arm, behind the body, raised on the right
    sh = (51.5, 37)
    hand = (62.5, 25)
    art.capsule(sh, hand, 2.9, GREEN_D, what='arm')
    art.capsule(sh, (hand[0] - 0.6, hand[1] - 0.6), 2.3, GREEN, what='arm')
    art.circle(hand[0], hand[1], 4.1, GREEN_D, what='hand')
    art.circle(hand[0] - 0.7, hand[1] - 0.7, 3.4, GREEN, what='hand')
    art.rect(hand[0] - 2.8, hand[1] - 2.8, 1.6, 3.2, WHITE, rx=0.8, extra=HI, what='hand pill')
    assert bx + bw - 6 < sh[0], 'arm does not meet the body'

    cx = mascot_head(art, bh=BH, face_dy=-0.4, eyes_dx=0.4)

    # an open book held in front of the tummy, a hand on each side
    bt, bb = 52.6, 62.6            # top and bottom of the cover at its middle
    bl, br = cx - 14.5, cx + 14.5
    sag = 1.6
    cover = [(bl, bt - sag + 0.4), (cx, bt + 0.6), (br, bt - sag + 0.4), (br, bb - sag), (cx, bb), (bl, bb - sag)]
    art.poly([(x + 0.8, y + 1.4) for x, y in cover], '#1482B8', r=1.4, what='book cover shade')
    art.poly(cover, BLUE_D, r=1.4, what='book cover')
    lpage = [(bl + 1.2, bt - sag - 0.6), (cx - 0.3, bt), (cx - 0.3, bb - 1.6), (bl + 1.2, bb - sag - 1.8)]
    rpage = [(cx + 0.3, bt), (br - 1.2, bt - sag - 0.6), (br - 1.2, bb - sag - 1.8), (cx + 0.3, bb - 1.6)]
    art.poly(lpage, WHITE, r=1.0, what='left page')
    art.poly(rpage, GREY1, r=1.0, what='right page')
    for i in range(3):
        y0 = bt + 1.6 + i * 2.2
        art.line([(bl + 3.6, y0 - sag * 0.75), (cx - 3, y0 + 0.2)], GREY1, 0.9, what='text line')
        art.line([(cx + 3, y0 + 0.2), (br - 3.6 - (3 if i == 2 else 0), y0 - sag * 0.75)], GREY2, 0.9, what='text line')
    art.line([(cx, bt + 0.4), (cx, bb - 1.2)], GREY2, 0.8, what='spine crease')
    for hx in (bl + 0.6, br - 0.6):
        art.circle(hx + 0.6, bb - 5.2, 3.6, GREEN_D, what='book hand')
        art.circle(hx, bb - 5.8, 3.0, GREEN, what='book hand')
    my = 38 - 0.4 + 9.6 + 3.6
    assert my < bt - sag, 'the book hides the smile'
    assert bt - sag < bot and bb > bot, 'book is not held in front of the body'
    art.pop()

    # three speech bubbles, saying hello in each language
    boxes = []
    boxes.append(say(art, 24, 36, 128, 54, '¡Hola!', GOLD, GOLD_D, RED_D, (128, 118), size=28, tilt=-6))
    boxes.append(say(art, 392, 34, 148, 54, 'Bonjour', BLUE, BLUE_D, WHITE, (430, 124), size=27, tilt=5))
    boxes.append(say(art, 22, 214, 108, 52, 'Ciao', GREEN, GREEN_D, WHITE, (128, 296), size=28, tilt=4))
    # keep the bubbles clear of the mascot
    m_box = (ox + 2 * S, oy + 2 * S, ox + 67 * S, oy + 67 * S)
    for b in boxes:
        assert b[2] < m_box[0] or b[0] > m_box[2] or b[3] < m_box[1], ('bubble on the mascot', b)

    confetti(art, 11, (14, 14, 546, 380), 16, [m_box, *boxes], size=1.0, spacing=44)
    return art


# ------------------------------------------------------------------ Spain
def windmill(art, cx, base, s, ground_fn, sail_rot=18, far=False):
    """
    A La Mancha windmill, its foot at (cx, base): a whitewashed round tower
    with blue trim, a dark conical cap, four lattice sails on a hub at the
    front of the cap. ground_fn(x) gives the hill's surface, so the tower's
    foot can be checked against it.
    """
    wb, wt, ht = 46 * s, 36 * s, 150 * s             # half widths, height
    top = base - ht
    for x in (cx - wb, cx + wb):
        g = ground_fn(x)
        assert g is not None and g <= base + 0.5, ('windmill foot floats', x, base, g)

    # contact shadow on the grass
    art.ellipse(cx + 4 * s, base + 2 * s, wb + 10 * s, 8 * s, GREEN_D, what='windmill shadow')
    # tower: lit, then its shaded right side, following the taper
    tower = [(cx - wb, base), (cx - wt, top), (cx + wt, top), (cx + wb, base)]
    # the far mill is a shade greyer, as distance would make it, which also
    # keeps its lit side from vanishing into a white page
    wall, wall_d, foot, foot_d = (GREY1, '#CDCDCD', '#CDCDCD', GREY2) if far else (WHITE, GREY1, GREY1, GREY2)
    art.poly(tower, wall, r=[6 * s, 3 * s, 3 * s, 6 * s], what='tower')
    k = 0.36
    shade = [(cx + wb * k, base), (cx + wt * k, top), (cx + wt, top), (cx + wb, base)]
    art.poly(shade, wall_d, r=[0, 0, 3 * s, 6 * s], what='tower shade')
    # a soft band at the foot, so the white doesn't vanish into a white page
    art.poly([(cx - wb, base), (cx - wb * 0.97 - 0.3, base - 10 * s), (cx + wb * 0.97 + 0.3, base - 10 * s), (cx + wb, base)],
             foot, r=[6 * s, 0, 0, 6 * s], what='tower foot')
    art.poly([(cx + wb * k, base), (cx + wb * k, base - 10 * s), (cx + wb * 0.97 + 0.3, base - 10 * s), (cx + wb, base)],
             foot_d, r=[0, 0, 0, 6 * s], what='tower foot shade')
    # door and a window, in La Mancha blue
    dw, dh = 22 * s, 38 * s
    art.path(f'M{f(cx - dw / 2)} {f(base - 10 * s)}V{f(base - 10 * s - dh + dw / 2)}A{f(dw / 2)} {f(dw / 2)} 0 0 1 {f(cx + dw / 2)} {f(base - 10 * s - dh + dw / 2)}V{f(base - 10 * s)}Z',
             [(cx - dw / 2, base - 10 * s - dh), (cx + dw / 2, base - 10 * s)], BLUE_D, what='door')
    art.rect(cx - 2 * s, base - 10 * s - dh + 4 * s, 4 * s, dh - 8 * s, BLUE, rx=2 * s, extra='opacity=".6"', what='door line')
    art.rect(cx - 7 * s, top + 52 * s, 14 * s, 18 * s, BLUE_D, rx=7 * s, what='window')
    # cap: a dark cone with a rounded tip, its right half darker
    cb, ch = top + 6 * s, 58 * s
    cone = [(cx - wt - 8 * s, cb), (cx, cb - ch), (cx + wt + 8 * s, cb)]
    art.poly(cone, INK, r=[5 * s, 9 * s, 5 * s], what='cap')
    art.poly([(cx, cb - ch + 6 * s), (cx + wt + 8 * s, cb), (cx, cb)], INK_D, r=[0, 5 * s, 0], what='cap shade')
    art.rect(cx - wt - 10 * s, cb - 3 * s, 2 * (wt + 10 * s), 9 * s, INK, rx=4.5 * s, what='cap rim')
    art.rect(cx, cb - 3 * s, wt + 10 * s, 9 * s, INK_D, rx=4.5 * s, what='cap rim shade')
    art.rect(cx - 16 * s, cb - 30 * s, 12 * s, 6 * s, WHITE, rx=3 * s, rot=(-52, cx - 10 * s, cb - 27 * s), extra='opacity=".22"', what='cap pill')
    assert cb + 6 * s > top, 'cap does not sit on the tower'

    # sails, on a hub at the front of the cap
    hub = (cx + 2 * s, cb - 14 * s)
    L, w0 = 128 * s, 26 * s
    for k in range(4):
        a = sail_rot + 90 * k
        art.push(rotate(a, hub[0], hub[1]))
        # the spar runs out from the hub; the lattice hangs to one side of it
        art.rect(hub[0] - 3.2 * s, hub[1] - L, 6.4 * s, L, WOOD, rx=3.2 * s, what='spar')
        px, py, pw, ph = hub[0] + 2 * s, hub[1] - L + 2 * s, w0, L - 34 * s
        art.rect(px, py, pw, ph, WOOD, rx=3 * s, what='sail frame')
        cols, rows = 2, 5
        gap = 3.2 * s
        cw = (pw - gap * (cols + 1)) / cols
        chh = (ph - gap * (rows + 1)) / rows
        for i in range(cols):
            for j in range(rows):
                art.rect(px + gap + i * (cw + gap), py + gap + j * (chh + gap), cw, chh,
                         CREAM if i == 0 else CREAM_D, rx=1.6 * s, what='sail cell')
        assert py + ph > hub[1] - L and px <= hub[0] + 3.2 * s, 'sail does not meet its spar'
        assert 9 * s > 3.2 * s, 'hub does not cover the spar root'
        art.pop()
    art.circle(hub[0] + 1.2 * s, hub[1] + 1.2 * s, 10 * s, WOOD_D, what='hub shade')
    art.circle(hub[0], hub[1], 9 * s, WOOD, what='hub')
    art.circle(hub[0], hub[1], 3.6 * s, GOLD, what='hub pin')
    return hub


def spain():
    art = Art('es.svg', 560, 480)
    # the sun sits low behind the big mill, so its white wall has something
    # to stand against on a white page
    sun(art, 208, 216, 104)
    ground = (280, 414, 250, 40)

    def hump(x0, x1, top, base, n=40):
        """The upper half of an ellipse standing on y = base."""
        cxh, rx = (x0 + x1) / 2, (x1 - x0) / 2
        pts = arc_pts(cxh, base, rx, base - top, 180, 360, n)

        def surface(x):
            dx = (x - cxh) / rx
            return None if abs(dx) >= 1 else base - (base - top) * math.sqrt(1 - dx * dx)
        return pts, surface

    def hill(x0, x1, top, base, lit, dark, what):
        """A hump with a crescent of shade down its right side: the dark hump,
        then a narrower lit one over it, sharing the left foot."""
        pts, surface = hump(x0, x1, top, base)
        art.poly(pts, dark, what=what + ' shade')
        lit_pts, _ = hump(x0, x1 - (x1 - x0) * 0.16, top + 3, base)
        art.poly(lit_pts, lit, what=what)
        for x in (x0, x1):
            assert ell_y(x, ground) < base - 3, (what, 'foot not on the grass', x)
        return surface

    back_surf = hill(334, 516, 292, 410, GREEN_L, '#6FC014', 'back hill')
    grass(art, ground, pill=(400, 428, 40))
    main_surf = hill(60, 430, 318, 414, GREEN, GREEN_D, 'hill')
    art.rect(104, 368, 36, 7, WHITE, rx=3.5, rot=(-30, 122, 371), extra=HI, what='hill pill')

    # the little mill first, on the back hill
    bx = 470
    sb = max(back_surf(bx - 46 * 0.5), back_surf(bx + 46 * 0.5)) + 3
    windmill(art, bx, sb, 0.5, back_surf, sail_rot=40, far=True)
    # the big mill, on the main hill's crown
    mx = 236
    mb = max(main_surf(mx - 46), main_surf(mx + 46)) + 4
    windmill(art, mx, mb, 1.0, main_surf, sail_rot=16)

    confetti(art, 3, (16, 16, 544, 300), 7, [(70, 30, 400, 360), (400, 180, 544, 420), (90, 80, 320, 310)], spacing=50)
    return art


# ------------------------------------------------------------------ France
def france():
    art = Art('fr.svg', 560, 480)
    mid = 280
    ground = (280, 410, 236, 40)
    grass(art, ground, pill=(110, 424, 40))
    round_tree(art, 84, 414, ground, 1.0)
    round_tree(art, 482, 404, ground, 0.82)

    def section(y_bot, y_top, w_bot, w_top, arch=None, power=2.0, n=24):
        """A tapering section of the tower, as a polygon. `arch` = (half
        width at the foot, apex height) cuts an arch up from its foot."""
        def w(y):
            t = (y_bot - y) / (y_bot - y_top)
            return w_top + (w_bot - w_top) * (1 - t) ** power
        left = [(mid - w(y_bot - (y_bot - y_top) * i / n), y_bot - (y_bot - y_top) * i / n) for i in range(n + 1)]
        right = [(mid + x - mid + 2 * (mid - x) + 0, y) for x, y in reversed(left)]
        right = [(2 * mid - x, y) for x, y in reversed(left)]
        pts = left + right
        if arch:
            aw, apex = arch
            pts += arc_pts(mid, y_bot, aw, y_bot - apex, 0, -180, 30)
        return pts, w

    def shaded(pts, lit, dark, what):
        art.poly(pts, lit, what=what)
        art.poly(clip_x(pts, mid), dark, what=what + ' shade')

    def slab(y, h, hw, what):
        art.rect(mid - hw, y, 2 * hw, h, BRONZE, rx=h / 2.2, what=what)
        art.poly([(mid, y), (mid + hw, y), (mid + hw, y + h), (mid, y + h)], BRONZE_D, r=[0, h / 2.2, h / 2.2, 0], what=what + ' shade')
        # a row of little windows along the gallery
        n = max(2, int(hw / 13))
        n -= n % 2                  # an even number, so none straddles the shade line
        for i in range(n):
            x = mid - hw + 10 + i * (2 * hw - 20) / (n - 1)
            art.rect(x - 3, y + h * 0.3, 6, h * 0.4, BRONZE_DD if x > mid else BRONZE_D, rx=2, what=what + ' window')

    FOOT = 404
    # contact shadow under the legs
    art.ellipse(mid + 6, FOOT + 2, 132, 13, GREEN_D, what='tower shadow')
    legs, w_leg = section(FOOT, 300, 120, 74, arch=(58, 338), power=2.2)
    shaded(legs, BRONZE, BRONZE_D, 'legs')
    mid_s, w_mid = section(296, 192, 66, 36, arch=(25, 254), power=1.6)
    shaded(mid_s, BRONZE, BRONZE_D, 'middle')
    up, w_up = section(196, 84, 31, 11, power=1.7)
    shaded(up, BRONZE, BRONZE_D, 'upper')
    # lattice: a zig-zag up the spire, thin, darker again on the shaded half
    zig = []
    for i in range(8):
        y = 182 - i * 12
        zig.append((mid + (-1 if i % 2 == 0 else 1) * w_up(y) * 0.6, y))
    for p, q in zip(zig, zig[1:]):
        t = (mid - p[0]) / (q[0] - p[0])
        m = (mid, p[1] + t * (q[1] - p[1]))
        for u, v in ((p, m), (m, q)):
            right = u[0] + v[0] > 2 * mid
            art.line([u, v], BRONZE_DD if right else BRONZE_D, 3, what='spire lattice')
    # the middle storey gets a cross-brace either side of its arch
    for sgn in (-1, 1):
        col = BRONZE_DD if sgn > 0 else BRONZE_D
        art.line([(mid + sgn * (w_mid(280) - 9), 280), (mid + sgn * 30, 214)], col, 3, what='middle brace')
    # platforms, overlapping the sections above and below them
    # each floor must cover the top of the section under it and the foot of
    # the one above, so no seam shows
    for (y, h, hw, what), below_top, above_bot in (((290, 20, 96, 'first floor'), 300, 296),
                                                   ((186, 16, 52, 'second floor'), 192, 196),
                                                   ((78, 12, 21, 'top floor'), 84, 84)):
        assert y < below_top < y + h and y < above_bot < y + h, (what, 'leaves a gap')
        slab(y, h, hw, what)
    assert w_leg(300) < 96 and w_mid(296) < 96 and w_mid(192) < 52 and w_up(196) < 52 and w_up(84) < 21, 'floor narrower than its section'
    # the lantern and the mast
    art.rect(mid - 10, 56, 20, 24, BRONZE, rx=5, what='lantern')
    art.rect(mid, 56, 10, 24, BRONZE_D, rx=5, what='lantern shade')
    art.rect(mid - 3, 26, 6, 32, BRONZE_D, rx=3, what='mast')
    art.circle(mid, 26, 5, GOLD, what='mast ball')
    # feet: pads where the legs meet the ground
    for sgn in (-1, 1):
        x0 = mid + sgn * w_leg(FOOT)
        x1 = mid + sgn * 60
        lo, hi = min(x0, x1) - 4, max(x0, x1) + 4
        art.rect(lo, FOOT - 10, hi - lo, 14, BRONZE_D if sgn > 0 else BRONZE, rx=6, what='foot pad')
        for x in (lo, hi):
            on_grass(x, FOOT + 4, ground, what='tower foot')
    lx = mid - w_leg(350) + 15
    art.rect(lx - 4, 332, 8, 36, WHITE, rx=4, rot=(24, lx, 350), extra=HI, what='leg pill')
    sx = mid - w_up(150) + 5
    art.rect(sx - 2.5, 134, 5, 32, WHITE, rx=2.5, rot=(8, sx, 150), extra=HI, what='spire pill')
    for x, y in ((lx, 350), (sx, 150)):
        assert mid - (w_leg if y > 300 else w_up)(y) < x - 4, 'highlight pill off the tower'

    confetti(art, 5, (16, 16, 544, 300), 9, [(150, 20, 410, 420), (30, 290, 140, 420), (420, 300, 540, 420)], spacing=54)
    return art


# ------------------------------------------------------------------ Italy
def italy():
    art = Art('it.svg', 560, 480)
    # an afternoon sun behind the tower's lit side, so its cream wall has
    # something to stand against on a white page
    sun(art, 236, 196, 92)
    ground = (280, 414, 236, 38)
    grass(art, ground, pill=(360, 428, 40))
    cypress(art, 108, 418, ground, 1.0)
    cypress(art, 152, 408, ground, 0.72)
    round_tree(art, 470, 412, ground, 0.78)

    cx, base = 286, 404
    LEAN = 5
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
    # green bubble, behind, up and left
    art.push(rotate(-8, 36, 34))
    x, y, w, h = 8, 10, 52, 38
    tail = bubble_shape(x, y, w, h, True)
    art.poly([(a, b + 4) for a, b in tail], GREEN_D, r=[2, 2, 2.5])
    card_lip(art, x, y, w, h, 13, GREEN, GREEN_D)
    art.poly(tail, GREEN, r=[2, 2, 2.5])
    art.rect(x + 7, y + 6, 10, 5, WHITE, rx=2.5, extra=HI)
    # an "A" built from bars
    art.line([(26.5, 39), (34, 19), (41.5, 39)], WHITE, 5)
    art.line([(29.5, 32), (38.5, 32)], WHITE, 4.5)
    art.pop()
    # blue bubble, in front, down and right
    art.push(rotate(7, 62, 56))
    x, y, w, h = 36, 36, 52, 36
    tail = bubble_shape(x, y, w, h, False)
    art.poly([(a, b + 4) for a, b in tail], BLUE_D, r=[2, 2, 2.5])
    card_lip(art, x, y, w, h, 13, BLUE, BLUE_D)
    art.poly(tail, BLUE, r=[2, 2, 2.5])
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


# ------------------------------------------------------------------ celebrate
def celebrate():
    art = Art('celebrate.svg', 400, 320)
    mid = 200
    # handles, behind the cup
    for sgn in (-1, 1):
        hx, hy = mid + sgn * 62, 112
        col = GOLD if sgn < 0 else GOLD_D
        art.path(f'M{f(hx - 30)} {f(hy)}a30 30 0 1 0 60 0a30 30 0 1 0 -60 0Z'
                 f'M{f(hx - 16)} {f(hy)}a16 16 0 1 1 32 0a16 16 0 1 1 -32 0Z',
                 [(hx - 30, hy - 30), (hx + 30, hy + 30)], col, extra='fill-rule="evenodd"', what='handle')
    # the cup
    top, bot = 66, 186
    cup = [(mid - 60, top)] + [(mid + 60, top)] + \
        [(mid + 60, top + 26)] + bezier((mid + 60, top + 26), (mid + 60, top + 86), (mid + 38, bot), (mid, bot), 20)[0:] + \
        bezier((mid, bot), (mid - 38, bot), (mid - 60, top + 86), (mid - 60, top + 26), 20)
    art.poly(cup, GOLD, what='cup')
    art.poly(clip_x(cup, mid + 12), GOLD_D, what='cup shade')
    art.rect(mid - 70, top - 12, 140, 22, GOLD, rx=11, what='rim')
    art.rect(mid + 12, top - 12, 58, 22, GOLD_D, rx=11, what='rim shade')
    art.rect(mid + 12, top - 12, 12, 22, GOLD_D, what='rim shade')
    art.rect(mid - 46, top + 22, 12, 46, WHITE, rx=6, extra=HI, what='cup pill')
    # a star on the cup
    star = []
    for i in range(10):
        a = math.radians(-90 + 36 * i)
        rr = 22 if i % 2 == 0 else 10
        star.append((mid + rr * math.cos(a), 120 + rr * math.sin(a)))
    art.poly(star, WHITE, r=2.5, extra='opacity=".5"', what='star')
    # stem, knot and base
    art.rect(mid - 13, bot - 6, 26, 44, GOLD, what='stem')
    art.rect(mid + 4, bot - 6, 9, 44, GOLD_D, what='stem shade')
    art.rect(mid - 30, 220, 60, 14, GOLD, rx=7, what='knot')
    art.rect(mid + 4, 220, 26, 14, GOLD_D, rx=7, what='knot')
    art.rect(mid + 4, 220, 8, 14, GOLD_D, what='knot')
    assert bot - 6 < bot and 220 < bot - 6 + 44 and 232 < 234, 'stem, knot and base must overlap'
    art.rect(mid - 56, 232, 112, 46, ORANGE, rx=10, what='base')
    art.rect(mid + 18, 232, 38, 46, ORANGE_D, rx=10, what='base shade')
    art.rect(mid + 18, 232, 12, 46, ORANGE_D, what='base shade')
    art.rect(mid - 32, 246, 64, 18, GOLD, rx=5, what='plate')
    art.rect(mid - 20, 253, 40, 4, GOLD_D, rx=2, what='plate line')
    art.rect(mid - 48, 240, 6, 24, WHITE, rx=3, extra=HI, what='base pill')
    # sparkles
    def sparkle(x, y, s, c):
        pts = []
        for i in range(8):
            a = math.radians(-90 + 45 * i)
            rr = s if i % 2 == 0 else s * 0.32
            pts.append((x + rr * math.cos(a), y + rr * math.sin(a)))
        art.poly(pts, c, r=1.5, what='sparkle')
    sparkle(92, 70, 15, GOLD)
    sparkle(318, 196, 12, BLUE)
    sparkle(306, 54, 10, GOLD)
    sparkle(86, 214, 9, PURPLE)
    confetti(art, 21, (14, 14, 386, 306), 16, [(120, 40, 280, 290), (78, 56, 106, 84), (304, 182, 332, 210), (294, 42, 318, 66), (76, 204, 96, 224)], spacing=40)
    return art


def main():
    os.makedirs(OUT, exist_ok=True)
    for fn in (logo, hero, spain, france, italy, translator, conjugator, dictionary, chat, soon, celebrate):
        art = fn()
        n = art.save()
        print(f'{art.name:18s} {n:6d} bytes')
        if art.w >= 400:
            assert n < 25000, (art.name, 'too big')


if __name__ == '__main__':
    main()
