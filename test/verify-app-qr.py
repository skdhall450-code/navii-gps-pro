"""Decode the committed app QR SVG at native and displayed sizes.
Dependencies for this test only: Pillow 11.3.0, zxing-cpp 2.3.0.
The SVG was generated locally with qrcode 8.2, ECC M, four-module quiet zone.
"""
from pathlib import Path
import re
import xml.etree.ElementTree as ET
from PIL import Image, ImageDraw
import zxingcpp

expected = "https://play.google.com/store/apps/details?id=com.naviigps.customer"
root = ET.fromstring(Path("public/assets/software/mobile/navii-gps-customer-qr.svg").read_text())
assert root.attrib["viewBox"] == "0 0 45 45"
assert root.attrib["shape-rendering"] == "crispEdges"
rect, path = list(root)
assert rect.attrib["fill"] == "white" and path.attrib["fill"] == "black"
commands = re.findall(r"M(\d+) (\d+)h1v1h-1z", path.attrib["d"])
assert commands
assert path.attrib["d"] == " ".join(f"M{x} {y}h1v1h-1z" for x, y in commands)
image = Image.new("RGB", (360, 360), "white")
draw = ImageDraw.Draw(image)
for x, y in commands:
    x, y = int(x), int(y)
    assert 4 <= x < 41 and 4 <= y < 41, "Four-module quiet zone must stay white"
    draw.rectangle((x*8, y*8, x*8+7, y*8+7), fill="black")
for size in (360, 224, 200):
    decoded = zxingcpp.read_barcode(image.resize((size, size)))
    assert decoded and decoded.text == expected, f"Exact customer app QR decode at {size}px"
print("PASS: committed SVG QR decodes to the exact customer Play URL at 360, 224, 200 px.")
