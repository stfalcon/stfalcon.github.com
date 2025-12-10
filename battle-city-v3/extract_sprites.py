#!/usr/bin/env python3
from PIL import Image
import os

# Відкриваємо спрайт-лист
sprite_path = 'images/sprite.png'
if not os.path.exists(sprite_path):
    print(f"Файл {sprite_path} не знайдено!")
    exit(1)

sprite = Image.open(sprite_path)
print(f"Розмір спрайта: {sprite.size}")

# Розмір одного танка у спрайт-листі
TANK_SIZE = 32

# Координати різних типів танків у спрайт-листі (рядок * 32)
tanks = [
    {'name': 'enemy_basic', 'row': 0, 'color': 'жовтий'},   # Жовті танки - перший рядок
    {'name': 'enemy_fast', 'row': 2, 'color': 'сірий'},     # Сірі танки - третій рядок  
    {'name': 'enemy_power', 'row': 4, 'color': 'зелений'},  # Зелені танки - п'ятий рядок
    {'name': 'enemy_bonus', 'row': 8, 'color': 'червоний'}  # Червоні танки - дев'ятий рядок
]

for tank in tanks:
    # Створюємо зображення 64x32 (2 кадри анімації)
    tank_img = Image.new('RGBA', (64, 32), (0, 0, 0, 0))
    
    # Вирізаємо два кадри анімації (танк вгору)
    y = tank['row'] * TANK_SIZE
    
    # Перший кадр (перша колонка)
    frame1 = sprite.crop((0, y, TANK_SIZE, y + TANK_SIZE))
    tank_img.paste(frame1, (0, 0))
    
    # Другий кадр (друга колонка)  
    frame2 = sprite.crop((TANK_SIZE, y, TANK_SIZE * 2, y + TANK_SIZE))
    tank_img.paste(frame2, (32, 0))
    
    # Зберігаємо
    output_path = f'images/{tank["name"]}.png'
    tank_img.save(output_path)
    print(f"Створено {output_path} ({tank['color']} танк)")

# Також створюємо повні спрайт-листи для кожного типу (всі 4 напрямки)
for tank in tanks:
    # 256x32 (8 кадрів: 2 анімації × 4 напрямки)
    full_sprite = Image.new('RGBA', (256, 32), (0, 0, 0, 0))
    
    y = tank['row'] * TANK_SIZE
    
    # Копіюємо всі 8 кадрів з рядка
    for i in range(8):
        x = i * TANK_SIZE
        frame = sprite.crop((x, y, x + TANK_SIZE, y + TANK_SIZE))
        full_sprite.paste(frame, (i * 32, 0))
    
    output_path = f'images/{tank["name"]}_full.png'
    full_sprite.save(output_path)
    print(f"Створено {output_path} (повний спрайт)")

print("\nГотово! Тепер можна використовувати нові спрайти в грі.")