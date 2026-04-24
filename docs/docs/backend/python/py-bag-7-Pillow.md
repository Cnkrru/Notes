---
title: "Python Pillow包"

description: "Python Pillow包相关知识。"

date: "2026-04-21"

tags: [Python, Pillow]

sidebar: auto

---


## Py-Pillow

## 2. 常用函数

# Python Pillow包常用函数参考

| 函数/类名 | 必选参数 | 作用 |
|----------|---------|------|
| `PIL.Image.open(fp, mode='r')` | fp | 打开图像文件 |
| `PIL.Image.new(mode, size, color=0)` | mode, size | 创建新图像 |
| `PIL.Image.save(fp, format=None, **params)` | fp | 保存图像 |
| `PIL.Image.convert(mode=None, matrix=None, dither=None, palette=Palette.WEB, colors=256)` | mode（可选） | 转换图像模式 |
| `PIL.Image.resize(size, resample=Resampling.BICUBIC, box=None, reducing_gap=None)` | size | 调整图像大小 |
| `PIL.Image.crop(box=None)` | box（可选） | 裁剪图像 |
| `PIL.Image.rotate(angle, resample=Resampling.NEAREST, expand=0, center=None, translate=None, fillcolor=None)` | angle | 旋转图像 |
| `PIL.Image.filter(filter)` | filter | 应用滤镜 |
| `PIL.Image.blur(radius=2)` | radius | 模糊图像 |
| `PIL.Image.thumbnail(size, resample=Resampling.BICUBIC)` | size | 创建缩略图 |
| `PIL.ImageDraw.Draw(image)` | image | 创建绘图对象 |

## 常用参数说明

### Image.open参数
| 参数名 | 类型 | 作用 |
|-------|------|------|
| `fp` | str/bytes | 文件路径或文件对象 |
| `mode` | str | 打开模式（默认'r'） |

### Image.new参数
| 参数名 | 类型 | 作用 |
|-------|------|------|
| `mode` | str | 图像模式（如'RGB', 'L', 'RGBA'等） |
| `size` | tuple | 图像尺寸 (width, height) |
| `color` | str/tuple | 填充颜色 |

### Image.save参数
| 参数名 | 类型 | 作用 |
|-------|------|------|
| `fp` | str/object | 保存路径或文件对象 |
| `format` | str | 保存格式（如'JPEG', 'PNG'等） |
| `quality` | int | 保存质量（1-95） |
| `optimize` | bool | 是否优化保存 |
| `progressive` | bool | 是否创建渐进式JPEG |

### Image.resize参数
| 参数名 | 类型 | 作用 |
|-------|------|------|
| `size` | tuple | 目标尺寸 (width, height) |
| `resample` | int | 重采样方法（BICUBIC, LANCZOS等） |
| `box` | tuple | 裁剪区域 |
| `reducing_gap` | float | 缩小差距 |

## 常用图像模式
| 模式 | 描述 |
|------|------|
| `1` | 1位像素，黑白 |
| `L` | 8位像素，灰度 |
| `P` | 8位像素，调色板 |
| `RGB` | 3x8位像素，真彩色 |
| `RGBA` | 4x8位像素，带透明度 |
| `CMYK` | 4x8位像素，印刷四色 |
| `YCbCr` | 3x8位像素，彩色视频格式 |
| `LAB` | 3x8位像素，L*a*b*颜色空间 |
| `HSV` | 3x8位像素，色相饱和度值 |

## 示例用法

### 基本操作
```python
from PIL import Image

# 打开图像
img = Image.open('example.jpg')
print(f'图像格式: {img.format}')
print(f'图像尺寸: {img.size}')
print(f'图像模式: {img.mode}')

# 显示图像
img.show()

# 保存图像
img.save('output.png', format='PNG')

# 转换模式
gray_img = img.convert('L')
gray_img.save('gray_output.jpg')

# 调整大小
resized_img = img.resize((800, 600))
resized_img.save('resized_output.jpg')

# 裁剪图像
cropped_img = img.crop((100, 100, 500, 500))  # (left, top, right, bottom)
cropped_img.save('cropped_output.jpg')

# 旋转图像
rotated_img = img.rotate(45, expand=True)
rotated_img.save('rotated_output.jpg')

# 创建缩略图
img.thumbnail((200, 200))
img.save('thumbnail_output.jpg')
```

### 图像处理
```python
from PIL import Image, ImageFilter, ImageEnhance

# 打开图像
img = Image.open('example.jpg')

# 应用滤镜
blurred_img = img.filter(ImageFilter.BLUR)
blurred_img.save('blurred.jpg')

sharpened_img = img.filter(ImageFilter.SHARPEN)
sharpened_img.save('sharpened.jpg')

edge_img = img.filter(ImageFilter.FIND_EDGES)
edge_img.save('edges.jpg')

# 图像增强
enhancer = ImageEnhance.Brightness(img)
bright_img = enhancer.enhance(1.5)  # 增加亮度50%
bright_img.save('brightened.jpg')

contrast_enhancer = ImageEnhance.Contrast(img)
contrast_img = contrast_enhancer.enhance(1.3)  # 增加对比度30%
contrast_img.save('high_contrast.jpg')

color_enhancer = ImageEnhance.Color(img)
colorful_img = color_enhancer.enhance(1.2)  # 增加色彩饱和度20%
colorful_img.save('colorful.jpg')
```

### 图像创建和绘制
```python
from PIL import Image, ImageDraw, ImageFont

# 创建新图像
img = Image.new('RGB', (800, 600), color='white')
draw = ImageDraw.Draw(img)

# 绘制文本
try:
    font = ImageFont.truetype('arial.ttf', 36)
except IOError:
    font = ImageFont.load_default()

draw.text((100, 100), 'Hello Pillow!', fill='black', font=font)

# 绘制矩形
draw.rectangle([(200, 200), (400, 400)], outline='red', fill='lightblue')

# 绘制圆形
draw.ellipse([(500, 100), (700, 300)], outline='green', fill='yellow')

# 绘制线条
draw.line([(100, 500), (700, 500)], fill='blue', width=5)

# 绘制多边形
draw.polygon([(100, 400), (200, 300), (300, 400)], outline='purple', fill='pink')

# 保存图像
img.save('drawing_output.jpg')
```

### 高级操作
```python
from PIL import Image, ImageOps

# 打开图像
img = Image.open('example.jpg')

# 镜像操作
mirror_img = ImageOps.mirror(img)
mirror_img.save('mirror.jpg')

flip_img = ImageOps.flip(img)
flip_img.save('flip.jpg')

# 自动对比度
auto_contrast_img = ImageOps.autocontrast(img)
auto_contrast_img.save('auto_contrast.jpg')

# 灰度化
gray_img = ImageOps.grayscale(img)
gray_img.save('grayscale.jpg')

# 调整大小并保持 aspect ratio
resized = ImageOps.fit(img, (400, 400), method=Image.Resampling.LANCZOS)
resized.save('fit_resized.jpg')

# 图像混合
img1 = Image.open('image1.jpg').resize((400, 400))
img2 = Image.open('image2.jpg').resize((400, 400))
blended = Image.blend(img1, img2, alpha=0.5)  # 50% 混合
blended.save('blended.jpg')
```

### 实际应用
```python
from PIL import Image, ImageDraw, ImageFont
import os

def create_thumbnail(input_path, output_dir, size=(200, 200)):
    """创建图像缩略图"""
    os.makedirs(output_dir, exist_ok=True)
    
    try:
        # 打开图像
        img = Image.open(input_path)
        
        # 创建缩略图
        img.thumbnail(size)
        
        # 保存
        output_path = os.path.join(output_dir, f'thumbnail_{os.path.basename(input_path)}')
        img.save(output_path)
        print(f'缩略图已保存: {output_path}')
        
    except Exception as e:
        print(f'处理图像时出错: {e}')

def add_watermark(input_path, output_path, watermark_text):
    """为图像添加水印"""
    try:
        # 打开图像
        img = Image.open(input_path).convert('RGBA')
        
        # 创建水印层
        watermark = Image.new('RGBA', img.size, (255, 255, 255, 0))
        draw = ImageDraw.Draw(watermark)
        
        # 尝试加载字体
        try:
            font = ImageFont.truetype('arial.ttf', 36)
        except IOError:
            font = ImageFont.load_default()
        
        # 计算文本位置（右下角）
        text_bbox = draw.textbbox((0, 0), watermark_text, font=font)
        text_width = text_bbox[2] - text_bbox[0]
        text_height = text_bbox[3] - text_bbox[1]
        
        x = img.width - text_width - 20
        y = img.height - text_height - 20
        
        # 绘制水印文本
        draw.text((x, y), watermark_text, font=font, fill=(255, 255, 255, 128))
        
        # 合并图像
        watermarked = Image.alpha_composite(img, watermark)
        watermarked = watermarked.convert('RGB')
        
        # 保存
        watermarked.save(output_path)
        print(f'水印已添加并保存: {output_path}')
        
    except Exception as e:
        print(f'添加水印时出错: {e}')

# 使用示例
if __name__ == '__main__':
    # 创建缩略图
    create_thumbnail('original.jpg', 'thumbnails')
    
    # 添加水印
    add_watermark('original.jpg', 'watermarked.jpg', '© 2024')
    
    print('图像处理完成！')
```

### 图像格式转换
```python
from PIL import Image
import os

def convert_images(input_dir, output_dir, output_format):
    """批量转换图像格式"""
    os.makedirs(output_dir, exist_ok=True)
    
    for filename in os.listdir(input_dir):
        if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp', '.gif')):
            input_path = os.path.join(input_dir, filename)
            output_filename = os.path.splitext(filename)[0] + f'.{output_format.lower()}'
            output_path = os.path.join(output_dir, output_filename)
            
            try:
                img = Image.open(input_path)
                img.save(output_path, format=output_format)
                print(f'已转换: {filename} → {output_filename}')
            except Exception as e:
                print(f'转换 {filename} 时出错: {e}')

# 使用示例
convert_images('input_images', 'output_images', 'PNG')
```