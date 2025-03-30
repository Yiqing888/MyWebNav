/**
 * BytePilot主要JavaScript文件
 * 负责初始化网站功能和加载工具数据
 */

document.addEventListener('DOMContentLoaded', () => {
  // 初始化工具数据
  initTools();
  
  // 初始化分类筛选功能
  initCategoryFilters();
  
  // 初始化搜索功能
  initSearch();
});

/**
 * 加载并渲染工具数据
 */
async function initTools() {
  try {
    const response = await fetch('data/tools.json');
    const tools = await response.json();
    
    // 获取工具列表容器
    const toolsContainer = document.getElementById('tools-grid');
    if (!toolsContainer) return;
    
    // 清空容器
    toolsContainer.innerHTML = '';
    
    // 遍历并渲染每个工具
    tools.forEach(tool => {
      const toolCard = createToolCard(tool);
      toolsContainer.appendChild(toolCard);
    });
  } catch (error) {
    console.error('加载工具数据失败:', error);
  }
}

/**
 * 创建工具卡片元素
 * @param {Object} tool 工具数据
 * @returns {HTMLElement} 工具卡片DOM元素
 */
function createToolCard(tool) {
  const card = document.createElement('div');
  card.className = 'tool-card';
  card.dataset.category = tool.category;
  
  card.innerHTML = `
    <div class="tool-header">
      <div class="tool-icon" style="background-color: ${tool.iconBgColor};">
        ${tool.iconSvg}
      </div>
      <div class="tool-title">
        <h3>${tool.name}</h3>
        <span class="tag ${tool.category}">${tool.tagName}</span>
      </div>
    </div>
    <p class="tool-description">${tool.description}</p>
    <div class="tool-features">
      <div class="feature">
        <span class="feature-label">优势</span>
        <span class="feature-value">${tool.advantages}</span>
      </div>
      <div class="feature">
        <span class="feature-label">不足</span>
        <span class="feature-value">${tool.disadvantages}</span>
      </div>
    </div>
    <a href="${tool.url}" class="tool-link" target="_blank">
      <span>Visit Website</span>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.33337 12.6666L12.6667 3.33331M12.6667 3.33331H5.33337M12.6667 3.33331V10.6666" stroke="#007AFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </a>
  `;
  
  return card;
}

/**
 * 初始化分类筛选功能
 */
function initCategoryFilters() {
  const filterButtons = document.querySelectorAll('.category-tabs button');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // 移除所有按钮的active类
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // 添加当前按钮的active类
      button.classList.add('active');
      
      // 获取分类ID
      const category = button.dataset.category;
      
      // 筛选工具
      filterTools(category);
    });
  });
}

/**
 * 根据分类筛选工具
 * @param {string} category 分类ID
 */
function filterTools(category) {
  const toolCards = document.querySelectorAll('.tool-card');
  
  toolCards.forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

/**
 * 初始化搜索功能
 */
function initSearch() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;
  
  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase().trim();
    searchTools(searchTerm);
  });
}

/**
 * 根据关键词搜索工具
 * @param {string} searchTerm 搜索关键词
 */
function searchTools(searchTerm) {
  const toolCards = document.querySelectorAll('.tool-card');
  
  toolCards.forEach(card => {
    const toolName = card.querySelector('h3').textContent.toLowerCase();
    const toolDescription = card.querySelector('.tool-description').textContent.toLowerCase();
    
    if (toolName.includes(searchTerm) || toolDescription.includes(searchTerm)) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
} 