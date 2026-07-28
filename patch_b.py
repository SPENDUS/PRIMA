import re

with open('src/pages/Pelanggaran.tsx', 'r') as f:
    content = f.read()

content = content.replace('{ id: "B8", desc: "B8: Mengumpat atau berkata jorok/kotor atau menghina orang tua teman (5 poin)" }', '{ id: "B9", desc: "B9: Mengumpat atau berkata jorok/kotor atau menghina orang tua teman (5 poin)" }')
content = content.replace('{ id: "B9", desc: "B9: Bermain bola di dalam/di sekitar kelas (5 poin)" }', '{ id: "B10", desc: "B10: Bermain bola di dalam/di sekitar kelas (5 poin)" }')
content = content.replace('{ id: "B10", desc: "B10: Rambut panjang/tidak rapi(putra), rambut diwarna, kuku panjang, kuku diwarna (5 poin)" }', '{ id: "B11", desc: "B11: Rambut panjang/tidak rapi(putra), rambut diwarna, kuku panjang, kuku diwarna (5 poin)" }')
content = content.replace('{ id: "B11", desc: "B11: Mencoret-coret baju pada saat pengumuman kelulusan (5 poin)" }', '{ id: "B12", desc: "B12: Mencoret-coret baju pada saat pengumuman kelulusan (5 poin)" }')
content = content.replace('{ id: "B12", desc: "B12: Tidak mengikuti upacara tanpa ijin (3 poin)" }', '{ id: "B13", desc: "B13: Tidak mengikuti upacara tanpa ijin (3 poin)" }')
content = content.replace('{ id: "B13", desc: "B13: Berolahraga tidak menggunakan kaos/seragam olahraga (3 poin)" }', '{ id: "B14", desc: "B14: Berolahraga tidak menggunakan kaos/seragam olahraga (3 poin)" }')

with open('src/pages/Pelanggaran.tsx', 'w') as f:
    f.write(content)
