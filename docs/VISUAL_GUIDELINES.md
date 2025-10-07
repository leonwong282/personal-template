# GitHub开源项目配图规范 / Visual Content Guidelines

本文档总结了GitHub开源项目中普遍认可的配图规范，帮助项目创建专业、一致的视觉展示效果。

## 📋 目录

- [核心原则](#核心原则)
- [图片类型与用途](#图片类型与用途)
- [技术规格](#技术规格)
- [设计标准](#设计标准)
- [文件管理](#文件管理)
- [内容要求](#内容要求)
- [平台适配](#平台适配)
- [最佳实践](#最佳实践)

## 🎯 核心原则

### 1. 专业性 (Professionalism)
- 高质量的视觉效果
- 一致的设计风格
- 清晰的信息传达
- 避免业余或随意的外观

### 2. 可访问性 (Accessibility)
- 高对比度，确保可读性
- 支持色盲用户的色彩选择
- 清晰的字体和适当的字号
- 简洁明了的界面布局

### 3. 一致性 (Consistency)
- 统一的配色方案
- 相同的尺寸和格式
- 一致的截图风格
- 标准化的命名规则

### 4. 国际化 (Internationalization)
- 英文界面优先（国际受众）
- 避免文化特定的元素
- 通用的图标和符号
- 简洁的视觉语言

## 📸 图片类型与用途

### 1. README 展示图片

#### Hero Image / 封面图
```
- 用途: README顶部展示，项目第一印象
- 尺寸: 1200x630 (GitHub Social Preview标准)
- 格式: PNG/JPG
- 内容: 项目Logo + 简洁描述 + 核心功能展示
- 位置: README.md 顶部
```

#### Feature Showcase / 功能展示
```
- 用途: 展示主要功能和特性
- 尺寸: 1280x720 (16:9比例)
- 格式: PNG/WebP
- 内容: 功能界面截图或功能示意图
- 数量: 3-5张，覆盖核心功能
```

#### Demo GIF / 演示动画
```
- 用途: 展示交互流程和使用方法
- 尺寸: 800x600 (最大)
- 格式: GIF/WebP动画
- 文件大小: <3MB
- 时长: 5-15秒
- 帧率: 10-15 FPS
```

### 2. 文档配图

#### Installation Screenshots / 安装截图
```
- 用途: 展示安装过程和步骤
- 尺寸: 原始界面尺寸 (保持真实比例)
- 格式: PNG
- 标注: 清晰的步骤标记
```

#### Tutorial Images / 教程图片
```
- 用途: 使用教程和说明文档
- 尺寸: 适合文档展示
- 格式: PNG
- 要求: 清晰的操作指示
```

### 3. Release Assets / 发布资源

#### App Store Screenshots / 应用商店截图
```
- 用途: 插件/应用商店展示
- 尺寸: 根据平台要求 (通常1280x720+)
- 格式: PNG/JPG
- 质量: 最高质量，无压缩损失
```

## ⚙️ 技术规格

### 图片格式选择

| 用途 | 推荐格式 | 备选格式 | 说明 |
|------|----------|----------|------|
| 截图 | PNG | WebP | 无损质量，支持透明度 |
| 照片 | JPG | WebP | 适合复杂色彩，文件较小 |
| 图标 | SVG | PNG | 矢量格式，可缩放 |
| 动画 | GIF | WebP | 兼容性好，文件大小适中 |

### 尺寸标准

#### 响应式尺寸体系
```
- 超大屏: 1920x1080 (桌面显示器)
- 大屏: 1280x720 (标准展示)
- 中屏: 800x450 (文档嵌入)
- 小屏: 400x225 (缩略图)

宽高比优先选择:
- 16:9 (通用)
- 4:3 (传统)
- 1:1 (头像/图标)
- 自定义 (保持原始比例)
```

#### 文件大小限制
```
- 单张图片: <5MB (推荐<2MB)
- GIF动画: <3MB (推荐<1MB)
- README总图片: <20MB
- 头像/Logo: <500KB
```

### 分辨率要求
```
- 最小分辨率: 72 DPI (网页显示)
- 推荐分辨率: 144 DPI (高清显示)
- 打印质量: 300 DPI (如需打印)
- 色彩空间: sRGB (网页标准)
```

## 🎨 设计标准

### 1. 色彩规范

#### GitHub深色主题适配
```css
/* 主色调 */
--bg-primary: #0d1117;     /* GitHub深色背景 */
--bg-secondary: #161b22;   /* 次要背景 */
--text-primary: #f0f6fc;   /* 主要文字 */
--text-secondary: #8b949e; /* 次要文字 */
--accent: #238636;         /* 强调色(绿色) */
--border: #30363d;         /* 边框色 */
```

#### 通用色彩建议
```
- 使用高对比度配色
- 避免纯黑(#000000)和纯白(#ffffff)
- 主色调不超过3种
- 保持品牌色的一致性
- 考虑色盲友好的配色
```

### 2. 字体规范

#### 推荐字体
```
英文: 
- 无衬线: Inter, Roboto, Source Sans Pro
- 等宽: JetBrains Mono, Fira Code, Monaco

中文:
- 无衬线: 思源黑体, 苹方, 微软雅黑
- 等宽: Source Han Mono, 等距更纱黑体
```

#### 字号标准
```
- 标题: 24px+ (清晰可读)
- 正文: 16px+ (舒适阅读)
- 说明: 14px+ (最小可读)
- 代码: 14px+ (等宽字体)
```

### 3. 布局原则

#### 网格系统
```
- 使用8px基础网格
- 保持元素对齐
- 适当的留白空间
- 层次分明的信息架构
```

#### 构图技巧
```
- 三分法则构图
- 黄金比例分割
- 对称或平衡布局
- 引导线和焦点设计
```

## 📁 文件管理

### 目录结构
```
project-root/
├── .github/
│   └── images/           # GitHub专用图片
│       ├── hero.png     # 社交媒体预览图
│       └── logo.svg     # 项目Logo
├── docs/
│   └── images/          # 文档配图
│       ├── installation/
│       ├── tutorials/
│       └── screenshots/
├── assets/              # 通用资源
│   ├── icons/          # 图标文件
│   ├── screenshots/    # 应用截图
│   └── demos/          # 演示文件
└── README.md
```

### 命名规范

#### 文件命名模式
```bash
# 功能型命名
feature_[功能名称]_[状态].[扩展名]
# 示例: feature_stitching_result.png

# 序号型命名
[序号]_[描述].[扩展名]
# 示例: 01_main_interface.png

# 语义型命名
[用途]_[详细描述].[扩展名]
# 示例: hero_banner_dark_theme.png
```

#### 命名最佳实践
```
✅ 推荐:
- installation_step_1.png
- demo_video_editing.gif
- icon_app_logo.svg
- screenshot_main_ui.png

❌ 避免:
- 屏幕截图2023.png
- IMG_001.jpg
- 图片1.png
- Untitled.png
```

## 📝 内容要求

### 1. 隐私和安全

#### 敏感信息处理
```
需要避免或模糊处理:
- 个人姓名和联系方式
- 真实的邮箱地址
- API密钥和令牌
- 私人文件路径
- 敏感的业务数据
```

#### 示例数据使用
```
推荐使用:
- Lorem ipsum文本
- 示例邮箱 (example@example.com)
- 虚构的公司名称
- 开源或免费的示例图片
- 测试用户名 (testuser, demo, etc.)
```

### 2. 版权合规

#### 图片使用准则
```
✅ 安全使用:
- 自己创建的原创内容
- CC0许可的免费图片
- 开源项目的官方素材
- 购买的商业授权图片

❌ 避免使用:
- 网络随意下载的图片
- 有版权争议的内容
- 他人项目的截图 (未授权)
- 商业软件的界面 (未授权)
```

#### 素材来源推荐
```
免费图片:
- Unsplash (unsplash.com)
- Pexels (pexels.com)
- Pixabay (pixabay.com)

图标资源:
- Feather Icons (feathericons.com)
- Heroicons (heroicons.com)
- Tabler Icons (tabler-icons.io)

字体资源:
- Google Fonts (fonts.google.com)
- Adobe Fonts (fonts.adobe.com)
```

### 3. 内容质量

#### 界面截图要求
```
✅ 高质量截图:
- 完整的功能界面
- 清晰的文字和图标
- 真实的使用场景
- 合理的数据展示
- 统一的界面状态

❌ 低质量截图:
- 模糊不清的画面
- 不完整的界面
- 空白或无内容界面
- 错误状态的界面
- 开发者工具痕迹
```

## 🌐 平台适配

### 1. GitHub平台优化

#### Social Preview优化

```
尺寸: 1200x630
格式: PNG/JPG
要求:
- 清晰的项目标题
- 简洁的功能描述
- 吸引人的视觉设计
- 品牌元素展示
```

#### README显示优化
```
- 使用相对路径引用图片
- 提供高清和普通两个版本
- 考虑深色主题的显示效果
- 优化移动端显示效果
```

### 2. 多平台考虑

#### 插件/应用商店
```
VS Code Marketplace:
- 推荐: 1376x768
- 最小: 1200x600
- 格式: PNG
- 质量: 高质量无损
```

#### 社交媒体分享
```
Twitter: 1200x675 (16:9)
LinkedIn: 1200x627
Facebook: 1200x630
Reddit: 1200x630
```

## 🏆 最佳实践

### 1. 截图技巧

#### 准备工作
```bash
# 1. 环境准备
- 使用高分辨率显示器 (2K/4K)
- 设置100%缩放比例
- 关闭不相关应用程序
- 清理桌面和任务栏

# 2. 浏览器设置
- 使用无痕模式
- 禁用扩展程序
- 设置标准窗口大小
- 隐藏开发者工具
```

#### 截图工具推荐
```
macOS:
- 系统自带截图 (Cmd+Shift+4)
- CleanShot X (专业工具)
- Skitch (带标注功能)

Windows:
- 系统截图工具 (Win+Shift+S)
- Greenshot (开源免费)
- Snagit (专业工具)

跨平台:
- LightShot
- Flameshot (开源)
```

### 2. 图片优化技巧

#### 压缩优化

```bash
# ImageOptim (macOS)
imageoptim *.png

# TinyPNG (在线)
# 访问 tinypng.com

# 命令行工具
# PNG优化
pngquant --quality=65-80 input.png
optipng -o7 input.png

# JPG优化
jpegoptim --max=85 input.jpg

# WebP转换
cwebp -q 80 input.png -o output.webp
```

#### 批量处理
```bash
# 批量调整尺寸
mogrify -resize 1280x720 *.png

# 批量格式转换
for file in *.png; do
    cwebp -q 80 "$file" -o "${file%.png}.webp"
done

# 批量重命名
rename 's/Screenshot/screenshot/' *.png
```

### 3. 可访问性优化

#### Alt Text编写

```markdown
<!-- ✅ 好的Alt Text -->
![Main interface showing image stitching parameters with crop settings at 20% top and 15% bottom](screenshots/main_interface.png)

<!-- ❌ 差的Alt Text -->
![screenshot](screenshots/main_interface.png)
```

#### 响应式显示
```html
<!-- 提供多尺寸版本 -->
<picture>
  <source media="(max-width: 600px)" srcset="screenshot_mobile.png">
  <source media="(max-width: 1200px)" srcset="screenshot_tablet.png">
  <img src="screenshot_desktop.png" alt="Description">
</picture>
```

### 4. 版本控制

#### Git LFS使用
```bash
# 初始化LFS
git lfs install

# 跟踪大文件
git lfs track "*.png"
git lfs track "*.gif"
git lfs track "*.jpg"

# 提交LFS配置
git add .gitattributes
git commit -m "Add LFS tracking for images"
```

#### .gitignore配置
```gitignore
# 忽略临时图片文件
*.tmp
*_temp.*
*_backup.*

# 忽略原始高清文件 (如果有压缩版本)
*_original.*
*_hd.*

# 忽略系统生成的缩略图
Thumbs.db
.DS_Store
```

## 📊 质量检查清单

### 发布前检查
```markdown
## 技术质量
- [ ] 图片格式正确 (PNG/JPG/WebP/SVG)
- [ ] 文件大小合理 (<2MB普通图片, <3MB动画)
- [ ] 分辨率足够 (最小800px宽度)
- [ ] 色彩空间正确 (sRGB)

## 视觉质量
- [ ] 图片清晰，无模糊
- [ ] 色彩饱和，对比度适中
- [ ] 构图合理，重点突出
- [ ] 风格统一，专业美观

## 内容质量
- [ ] 界面完整，功能清晰
- [ ] 文字可读，信息准确
- [ ] 无敏感信息泄露
- [ ] 使用合规的示例内容

## 功能完整性
- [ ] 覆盖主要功能点
- [ ] 展示核心价值主张
- [ ] 包含使用场景演示
- [ ] 提供操作流程指引

## 国际化考虑
- [ ] 使用英文界面 (如果多语言)
- [ ] 避免文化特定元素
- [ ] 图标含义通用明确
- [ ] Alt text描述准确
```

## 📚 参考资源

### 设计灵感
- [GitHub Explore](https://github.com/explore) - 优秀开源项目
- [Product Hunt](https://producthunt.com) - 产品展示案例
- [Dribbble](https://dribbble.com) - UI设计作品
- [Behance](https://behance.net) - 品牌设计案例

### 工具推荐
- **设计工具**: Figma, Sketch, Adobe XD
- **截图工具**: CleanShot X, Greenshot, Flameshot
- **优化工具**: ImageOptim, TinyPNG, Squoosh
- **动画制作**: LICEcap, GIPHY Capture, ScreenToGif

### 学习资源

- [GitHub Docs - Social Preview](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview)
- [Material Design Guidelines](https://material.io/design)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
