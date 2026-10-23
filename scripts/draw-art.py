#!/usr/bin/env python3
"""
Draws ProfeGPT's illustrations into public/assets/art/.

    python3 scripts/draw-art.py [out_dir]

Flat shapes in Duolingo's house style: no outlines, no gradients, a darker
shade down the right/bottom side of every solid thing, flat tones only (no
translucent white highlight spots). Everything is generated so the geometry can be checked:
every shape passes through Art.add(), which works out where it lands on the
canvas (through any rotated or scaled groups) and refuses to write a drawing
with anything closer than MARGIN to the edge. Each drawing then asserts that
the parts which ought to touch do touch: towers on their facade,
drums stacked without gaps, sails on their hub, and so on.

Standard library only. The output is static SVG: no animation, no scripts,
no external references.
"""
import math
import os
import shutil
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'public', 'assets', 'art')
MARGIN = 4

# Duolingo's palette
GREEN, GREEN_D, GREEN_L = '#58CC02', '#58A700', '#89E219'   # the globe's land
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

SAND, SAND_D, SAND_DD = '#E8C48A', '#C9A066', '#A8824E'


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
# ------------------------------------------------------------------ the globe
# The home page's picture is an object, not a character: a desk globe. Its
# sphere is Duolingo's own earth, as on investors.duolingo.com: a pale
# sky-blue sea, lime land built from chunky rounded blocks that run off the
# edge, pale cloud pills over it, and no shading at all. A gold half-ring
# holds it on a tilted axis, over a short stem and a gold foot.
#
# It is drawn in its own units, the sphere centred on (0, 0), and placed by
# the caller: large on the home page; the logo is the sphere alone.
AX, AX_L = '#4B9AF3', '#A4CEFF'                     # the site's blue, and a pale tint
AX_D = '#3C81DB'                                    # its shade
SAY_INK = '#3C81DB'                                  # the greeting bubbles' lettering
# the same bubbles for the dark page (mascot-dark.svg): fill, edge, lettering
SAY_DARK = ('#202F36', '#37464F', '#78B0FC')
SQK = 0.74
GLOBE_R, TILT = 128, 22                              # the sphere's radius; the axis leans this far right
# traced in Duolingo's picture's pixels (its sphere centred on (196, 196), radius 148)
SEA, LAND, CLOUD = '#92E4FF', '#78C800', '#CCEFFF'
REF_C, REF_R = 196, 148
LAND_BLOCKS = (                                      # x0, y0, x1, y1, corner radius
    (88, 40, 182, 132, 46), (40, 96, 132, 196, 48),           # the top left
    (234, 96, 304, 154, 29), (262, 50, 360, 130, 40),         # the top right
    (188, 164, 326, 258, 47), (238, 214, 318, 300, 40),       # the right
    (36, 216, 144, 312, 48),                                  # the bottom left
)
CLOUDS = ((160, 73, 222, 112), (62, 99, 144, 138), (107, 125, 170, 164),
          (288, 229, 352, 268), (212, 282, 300, 320))


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


def say(art, x, y, w, h, s, tail_to, size=24, tilt=0, dark=False):
    """A white speech bubble with a light grey edge and lip, blue lettering,
    and a tail toward `tail_to`. All the hero's bubbles are this one colour.
    The tail's edge is the same tail grown by the edge's width, with no lip
    of its own, so it comes to one point."""
    cx, cy = x + w / 2, y + h / 2
    est = 0.62 * size * len(s.replace('¡', 'i'))
    assert est + 28 <= w, (s, 'bubble too tight for its word', est, w)
    if tilt:
        art.push(rotate(tilt, cx, cy))
    tx, ty = tail_to
    e, lip, rx = 2.5, 4.5, h / 2.3
    # the tail grows from the point inside the bubble nearest its target,
    # so it leaves whichever edge faces the mascot
    bx, by = min(max(tx, x + rx), x + w - rx), min(max(ty, y + 12), y + h - 12)
    L = math.dist((bx, by), (tx, ty))
    ux, uy = (tx - bx) / L, (ty - by) / L
    px, py = -uy, ux
    tail = [(bx + px * 14, by + py * 14), (bx - px * 14, by - py * 14), (tx, ty)]
    # the fill's tail: the edge's, pulled in by e all round
    k = 14 - e * 1.6
    inner = [(bx + px * k, by + py * k), (bx - px * k, by - py * k), (tx - ux * e * 2.6, ty - uy * e * 2.6)]
    fill, edge, ink = SAY_DARK if dark else (WHITE, GREY1, SAY_INK)
    art.rect(x - e, y - e, w + 2 * e, h + 2 * e + lip, edge, rx=rx + e, what='bubble edge')
    art.poly(tail, edge, r=[2, 2, 3.5], what='bubble tail edge')
    art.poly(inner, fill, r=[2, 2, 2.5], what='bubble tail')
    art.rect(x, y, w, h, fill, rx=rx, what='bubble')
    art.text(cx, cy + size * 0.36, s, size, ink)
    if tilt:
        art.pop()
    return (x - 8, y - 8, x + w + 8, y + h + 12)


def globe(art, stand=True):
    """The globe, in its own units. Returns its outline points."""
    R = GLOBE_R
    k = R / REF_R
    d, sphere = disc((0, 0), R, n=48)
    art.clip_begin(d, sphere, 'globe')
    art.rect(-R - 2, -R - 2, 2 * R + 4, 2 * R + 4, SEA, what='sea')
    for x0, y0, x1, y1, r in LAND_BLOCKS:
        art.rect((x0 - REF_C) * k, (y0 - REF_C) * k, (x1 - x0) * k, (y1 - y0) * k, LAND, rx=r * k, what='land')
    for x0, y0, x1, y1 in CLOUDS:
        h = (y1 - y0) * k
        art.rect((x0 - REF_C) * k, (y0 - REF_C) * k, (x1 - x0) * k, h, CLOUD, rx=h / 2, what='cloud')
    art.clip_end()
    out = list(sphere)
    if not stand:
        return out

    # the half-ring: from the north pivot round the right side to the south
    # pivot, on the tilted axis, the same distance from the sphere all round
    r0, r1 = R + 10, R + 24
    a0, a1 = -90 + TILT, 90 + TILT
    ring = arc_pts(0, 0, r1, r1, a0, a1, 40) + arc_pts(0, 0, r0, r0, a1, a0, 40)
    shade(art, [poly_shape(ring)], GOLD, GOLD_D, (-3, -4), 'ring')
    out += ring
    # pivots: a short axle into the sphere and a round cap at each end
    for a in (a0, a1):
        u = (math.cos(math.radians(a)), math.sin(math.radians(a)))
        art.capsule((u[0] * (R - 6), u[1] * (R - 6)), (u[0] * r0, u[1] * r0), 5, GOLD_D, what='axle')
        cx, cy = u[0] * (r0 + r1) / 2, u[1] * (r0 + r1) / 2
        art.circle(cx, cy, 11, GOLD_D, what='pivot')
        art.circle(cx - 1.5, cy - 2, 8.5, GOLD, what='pivot')
    # the stem from the ring's lowest point, and the foot
    assert a0 < 90 < a1, 'the ring does not pass under the sphere'
    top, foot = r1 - 4, r1 + 30
    art.rect(-10, top, 20, foot - top + 4, GOLD, rx=6, what='stem')
    art.rect(0, top, 10, foot - top + 4, GOLD_D, rx=5, what='stem shade')
    fw, fh, lip = 92, 22, 8
    art.rect(-fw, foot + lip, 2 * fw, fh, GOLD_D, rx=fh / 2, what='foot lip')
    art.rect(-fw, foot, 2 * fw, fh, GOLD, rx=fh / 2, what='foot')
    out += [(-fw, foot), (fw, foot + fh + lip)]
    return out


def logo():
    art = Art('logo.svg', 64, 64)
    S = 27 / GLOBE_R
    art.push(place(32, 32, S))
    art.begin_track()
    globe(art, stand=False)
    box = art.end_track()
    art.pop()
    art.assert_centred(box, 'logo', tol=1)
    return art


def hero(dark=False):
    """The home page's picture; dark=True is the same drawing with the
    greeting bubbles in dark-theme colours, for the dark page."""
    art = Art('mascot-dark.svg' if dark else 'mascot.svg', 560, 480)
    S, CX, CY = 0.92, 272, 206
    art.push(place(CX, CY, S))
    M = place(CX, CY, S)[1]
    art.begin_track()
    outline = globe(art)
    m_box = art.end_track()
    art.pop()
    keep = [apply(M, p) for p in outline]
    assert abs((m_box[0] + m_box[2]) / 2 - 280) <= 24, ('globe not centred', m_box)

    # three greeting bubbles, one per language, all the same colour
    boxes = []
    boxes.append(say(art, 14, 84, 122, 54, '¡Hola!', (150, 128), tilt=-4, dark=dark))
    boxes.append(say(art, 412, 44, 136, 54, 'Bonjour', (396, 100), tilt=3, dark=dark))
    boxes.append(say(art, 22, 300, 108, 54, 'Ciao', (156, 280), tilt=-3, dark=dark))
    for b in boxes:
        for x, y in keep:
            assert not (b[0] < x < b[2] and b[1] < y < b[3]), ('bubble on the globe', b, round(x), round(y))

    return art


# ------------------------------------------------------------------ the country pictures
# Small Duolingo vocabulary pictures set against each landmark, overlapping it
# at the lower right the way Duolingo's own pictures overlap:
# a croissant for France, a wine bottle and glass for Spain, a bowl of
# pasta for Italy. Each is drawn in its own units, centred on (0, 0) at its
# foot, and placed by the caller.
def croissant(art):
    """Five plump segments fanned in a crescent: the big middle one darker,
    the pair beside it lighter, two small round tips lower down, each with
    a darker lip along its bottom."""
    C, C_L, C_D = '#E5A157', '#F0B46E', '#CF8A43'
    for sx in (-1, 1):
        art.circle(sx * 90, -24, 22, C_D, what='croissant tip lip')
        art.circle(sx * 90, -28, 21, C, what='croissant tip')
    for sx in (-1, 1):
        side = [(sx * 22, -84), (sx * 58, -70), (sx * 86, -40), (sx * 74, -10), (sx * 24, -8)]
        art.poly([(x, y + 6) for x, y in side], C_D, r=[16, 26, 18, 12, 6], what='croissant side lip')
        art.poly(side, C_L, r=[16, 26, 18, 12, 6], what='croissant side')
    mid = [(-42, -100), (42, -100), (24, -4), (-24, -4)]
    art.poly([(x, y + 6) for x, y in mid], C_D, r=[22, 22, 12, 12], what='croissant middle lip')
    art.poly(mid, C, r=[22, 22, 12, 12], what='croissant middle')
    return [(-112, -100), (112, 2)]


def wine(art):
    """A dark bottle with a red capsule and label, and a pale glass of red
    wine in front of it to the right."""
    B, B_D, W, W_D = '#4B4B4B', '#3A3A3A', '#D93A5E', '#B92A4C'
    GL, GL_D = '#C8F0FF', '#9FDDF5'
    # the bottle
    bx = -34
    art.rect(bx - 34, -150, 68, 150, B, rx=18, what='bottle')
    art.rect(bx + 6, -150, 28, 150, B_D, rx=14, what='bottle shade')
    art.rect(bx + 6, -150, 14, 150, B_D, what='bottle shade')
    art.path(f'M{f(bx - 34)} {f(-128)}C{f(bx - 34)} {f(-168)} {f(bx - 14)} {f(-172)} {f(bx - 13)} {f(-196)}'
             f'L{f(bx + 13)} {f(-196)}C{f(bx + 14)} {f(-172)} {f(bx + 34)} {f(-168)} {f(bx + 34)} {f(-128)}Z',
             [(bx - 34, -196), (bx + 34, -128)], B, what='shoulder')
    art.rect(bx - 15, -232, 30, 40, W, rx=6, what='capsule')
    art.rect(bx + 3, -232, 12, 40, W_D, rx=5, what='capsule shade')
    art.rect(bx - 18, -236, 36, 10, W, rx=5, what='capsule lip')
    art.rect(bx - 34, -110, 68, 62, W, rx=4, what='label')
    art.rect(bx + 10, -110, 24, 62, W_D, rx=4, what='label shade')
    # the glass: a round bowl, the wine in its lower half, a stem and foot
    gx, gy, gw = 48, -128, 40
    bowl = (f'M{f(gx - gw)} {f(gy - 40)}L{f(gx + gw)} {f(gy - 40)}'
            f'C{f(gx + gw + 4)} {f(gy + 10)} {f(gx + 26)} {f(gy + 40)} {f(gx)} {f(gy + 40)}'
            f'C{f(gx - 26)} {f(gy + 40)} {f(gx - gw - 4)} {f(gy + 10)} {f(gx - gw)} {f(gy - 40)}Z')
    bpts = [(gx - gw - 4, gy - 40), (gx + gw + 4, gy + 40)]
    art.clip_begin(bowl, bpts, 'glass')
    art.rect(gx - gw - 6, gy - 42, 2 * gw + 12, 84, GL, what='glass')
    art.rect(gx + gw * 0.4, gy - 42, gw, 84, GL_D, what='glass shade')
    art.rect(gx - gw - 6, gy - 2, 2 * gw + 12, 44, W, what='wine')
    art.rect(gx + gw * 0.4, gy - 2, gw, 44, W_D, what='wine shade')
    art.clip_end()
    art.rect(gx - 5, gy + 36, 10, 82, GL, rx=4, what='stem')
    art.rect(gx - 30, -12, 60, 12, GL, rx=6, what='foot')
    art.rect(gx + 4, -12, 26, 12, GL_D, rx=6, what='foot shade')
    return [(bx - 34, -236), (gx + gw + 4, 0)]


def pasta(art):
    """A pale bowl heaped with golden spaghetti, a strand over the rim."""
    BW_, BW_D = '#E8EEF3', '#C9D4DC'
    rim = -60
    # the heap: overlapping round mounds, curls of darker noodle on them
    mounds = [(-52, rim + 4, 34), (-14, rim - 18, 40), (30, rim - 12, 38), (62, rim + 4, 30)]
    for mx, my, r in mounds:
        art.circle(mx, my, r, GOLD, what='pasta')
    for mx, my, r in mounds:
        art.line(arc_pts(mx + 2, my + 2, r * 0.55, r * 0.5, 200, 340, 10), GOLD_D, 6, what='noodle')
    art.line([(18, rim - 4), (16, rim + 24), (22, rim + 40)], GOLD_D, 7, what='strand')
    # the bowl: a flat rim, a deep round body, a small foot
    body = (f'M{f(-100)} {f(rim)}L{f(100)} {f(rim)}C{f(100)} {f(rim + 50)} {f(56)} {f(-10)} {f(0)} {f(-10)}'
            f'C{f(-56)} {f(-10)} {f(-100)} {f(rim + 50)} {f(-100)} {f(rim)}Z')
    bpts = [(-100, rim), (100, -10)]
    art.clip_begin(body, bpts, 'bowl')
    art.rect(-102, rim - 2, 204, 54, BW_, what='bowl')
    art.rect(30, rim - 2, 74, 54, BW_D, what='bowl shade')
    art.clip_end()
    art.line([(18, rim), (22, rim + 26)], GOLD, 7, what='strand over the rim')
    art.rect(-30, -12, 60, 12, BW_D, rx=5, what='bowl foot')
    return [(-100, rim - 58), (100, 0)]


# ------------------------------------------------------------------ Spain
# The Sagrada Familia, Nativity side: four spindle bell towers with mosaic
# finials (the inner pair taller), the tall central tower behind, the gable
# with a small gold-tipped spindle, and the facade with its three parabolic portals.
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
    tip = finial(art, cx, neck + 2 * s, s, col, col_d)
    return w, tip


def spain():
    art = Art('es.svg', 560, 480)

    mid = 280
    BODY_T, BODY_B = 318, 408
    art.begin_track()
    # the tall central tower, behind
    w_c, tip_c = spindle(art, mid, 330, 72, 25, GOLD, GOLD_D, s=1.15, slots=0, stone=('#F3DDB4', '#DDBF8C'))
    # the four Nativity towers: the inner pair taller
    towers = []
    for x, top, hw, col, col_d, ph in ((180, 160, 19, RED, RED_D, 0.4), (380, 160, 19, RED, RED_D, 1.6),
                                      (232, 118, 21.5, ORANGE, ORANGE_D, 2.2), (328, 118, 21.5, ORANGE, ORANGE_D, 0.9)):
        tb = BODY_T + 6
        w, tip = spindle(art, x, tb, top, hw, col, col_d, s=0.85 if hw < 20 else 0.95, slots=0, phase=ph)
        towers.append((x, tb, hw))
        assert BODY_T < tb, 'tower floats above the body'
    # the central gable over the main portal, with a small gold-tipped
    # spindle standing on its point
    g = [(mid - 46, BODY_T + 4), (mid - 30, 282), (mid, 248), (mid + 30, 282), (mid + 46, BODY_T + 4)]
    art.poly(g, SAND, r=[0, 10, 8, 10, 0], what='gable')
    art.poly(clip_x(g, mid + 16), SAND_D, r=0, what='gable shade')
    spindle(art, mid, 262, 214, 11, GOLD, GOLD_D, s=0.55, slots=0)
    assert 262 > 248 + 2, 'the small spindle does not stand on the gable'
    # the facade body, with three parabolic portals
    art.rect(150, BODY_T, 260, BODY_B - BODY_T, SAND, rx=12, what='facade')
    art.rect(352, BODY_T, 58, BODY_B - BODY_T, SAND_D, rx=12, what='facade shade')
    art.rect(352, BODY_T, 14, BODY_B - BODY_T, SAND_D, what='facade shade')
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
    box = art.end_track()
    art.assert_centred(box, 'basilica')
    for x, tb, hw in towers:
        assert 150 <= x - hw and x + hw <= 410, 'tower hangs off the facade'

    # Spanish wine, in front at the lower right
    art.push(place(424, 414, 0.86))
    wine(art)
    art.pop()
    return art


# ------------------------------------------------------------------ France
def france():
    art = Art('fr.svg', 560, 480)
    mid = 280

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
    EI, EI_L, EI_D, EI_DD = '#D39A62', '#E9BC88', '#B47A45', '#9C6436'

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
        """A storey: base tone, its right half in shade, clipped to the
        outline. Plain: no bracing, no bands."""
        art.clip_begin(poly_d(pts), pts, what)
        x0, x1 = min(p[0] for p in pts), max(p[0] for p in pts)
        art.rect(x0 - 2, y_top - 2, x1 - x0 + 4, y_bot - y_top + 4, EI, what=what)
        art.rect(mid, y_top - 2, x1 - mid + 2, y_bot - y_top + 4, EI_D, what=what + ' shade')
        if extra:
            extra()
        art.clip_end()

    art.begin_track()

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
                     what=what + ' railing')
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

    box = art.end_track()
    art.assert_centred(box, 'Eiffel Tower')
    height, width = FOOT - (TIP - 1), 2 * BASE
    assert 1.8 <= height / width <= 1.9, ('Eiffel Tower proportions off', round(height / width, 2))
    assert 370 <= height <= 395, ('Eiffel Tower should stand about 380 tall', round(height))

    # a croissant, in front at the lower right
    art.push(place(408, 446, 1.0))
    croissant(art)
    art.pop()
    return art


# ------------------------------------------------------------------ Italy
def italy():
    art = Art('it.svg', 560, 480)

    # the tower stands upright, centred
    cx, base = 280, 404
    art.begin_track()

    R = 60                           # drum radius
    drums = []                       # (bottom, top, half width)
    y = base
    drums.append((y + 8, y - 60, R)); y -= 60          # ground floor, its plinth below
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
    box = art.end_track()
    art.assert_centred(box, 'Tower of Pisa')

    # a bowl of pasta, in front at the lower right
    art.push(place(392, 416, 1.08))
    pasta(art)
    art.pop()
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
