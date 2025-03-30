# BytePilot - 网络工具精选平台

BytePilot是一个精心设计的网络工具集合平台，为开发者提供优质网络工具的聚合和推荐，帮助用户发现提升数字工作流的最佳工具。

![BytePilot 预览](assets/images/bytepilot-preview.png)

## 项目简介

BytePilot专注于收集和推荐高质量的网络工具，涵盖多个关键类别：

- 🚀 **托管与部署** - Vercel、Netlify等云服务平台
- 🔗 **后端服务** - Supabase、Firebase等数据库和后端解决方案
- 📊 **SEO与分析** - 关键词分析、网站性能追踪工具
- 🤖 **AI工具** - 人工智能驱动的创意和自动化工具
- 🌐 **CDN服务** - 内容分发网络加速服务
- 📝 **代码工具** - 版本控制、协作平台
- 🔍 **分析工具** - 用户行为分析、数据可视化
- 🏷️ **域名服务** - 域名注册和管理

## 技术特点

项目采用轻量级前端技术栈构建，确保易于理解和使用：

- **纯HTML/CSS/JavaScript** - 无需复杂框架，容易上手
- **响应式设计** - 自适应各种设备屏幕尺寸
- **模块化结构** - 组件化设计，便于维护和扩展
- **苹果风格UI** - 简洁、优雅的用户界面，遵循苹果设计理念
- **流畅动画效果** - 使用CSS动画和JavaScript提升用户体验
- **毛玻璃效果** - 现代毛玻璃界面设计，带来科技感
- **交互光影** - 鼠标跟随光影效果，提升用户体验
- **3D倾斜效果** - 卡片悬停时的立体感交互

## 项目结构

```
bytepilot/
├── assets/              # 静态资源
│   ├── css/             # 样式文件
│   │   ├── base.css        # 基础样式
│   │   ├── layout.css      # 布局样式
│   │   ├── components.css  # 组件样式
│   │   ├── animations.css  # 动画效果
│   │   └── techvisual.css  # 科技视觉效果
│   ├── js/              # JavaScript文件
│   │   └── main.js         # 主要功能脚本
│   └── images/          # 图片资源
├── data/                # 数据文件
│   ├── tools.json       # 工具数据
│   └── categories.json  # 分类数据
├── pages/               # 网站其他页面
│   └── import.html      # 导入页面
├── index.html           # 主页（入口文件）
└── README.md            # 项目文档
```

## 主要功能

- **工具展示** - 以卡片形式展示各类工具，包含名称、描述、优缺点等信息
- **分类筛选** - 按类别过滤显示工具
- **搜索功能** - 快速查找特定工具
- **响应式布局** - 在不同设备上提供最佳浏览体验
- **动画效果** - 流畅的交互动画提升用户体验
- **科技视觉** - 毛玻璃效果、光影效果、3D交互等现代视觉设计

## 本地部署说明

### 重要提示：使用本地服务器

由于浏览器的安全限制，直接打开HTML文件（使用file://协议）可能导致JavaScript无法正常加载JSON数据。**强烈建议**使用本地服务器运行此项目。

1. 克隆项目到本地：
```bash
git clone https://github.com/yourusername/bytepilot.git
```

2. 启动本地服务器（选择其中一种方式）：

   **使用Python（推荐）**：
   ```bash
   cd bytepilot
   python -m http.server
   ```
   然后访问 `http://localhost:8000`

   **使用Node.js**：
   ```bash
   npm install -g http-server
   cd bytepilot
   http-server
   ```
   然后访问 `http://localhost:8080`

   **使用VS Code的Live Server插件**：
   安装Live Server插件，右键点击index.html选择"使用Live Server打开"

## 常见问题

1. **工具列表不显示**
   - 请确保使用HTTP服务器运行项目，而不是直接打开HTML文件
   - 检查浏览器控制台是否有错误信息
   - 验证tools.json文件格式是否正确

2. **图标不显示**
   - 确保SVG图标代码格式正确
   - 检查iconBgColor属性是否为有效的颜色值

## 自定义工具

要添加新的工具，请编辑 `data/tools.json` 文件，遵循以下格式：

```json
{
  "id": "工具唯一ID",
  "name": "工具名称",
  "url": "工具官网链接",
  "category": "所属类别ID",
  "tagName": "标签名称",
  "description": "工具简要描述",
  "advantages": "工具优势",
  "disadvantages": "工具不足",
  "iconBgColor": "图标背景色（如#ff5500）",
  "iconSvg": "SVG图标代码"
}
```

## 未来计划

- [ ] 添加用户评分和评论功能
- [ ] 实现工具比较功能
- [ ] 增加更多工具分类
- [ ] 优化移动端体验
- [ ] 添加暗色模式支持
- [ ] 支持工具收藏功能
- [ ] 添加工具使用统计

## 贡献指南

欢迎贡献新的工具或功能改进！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件 