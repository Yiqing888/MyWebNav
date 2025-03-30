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

  // 初始化页脚动画
  initFooterAnimations();

  // 添加动画监测
  observeElements();
});

/**
 * 加载并渲染工具数据
 */
async function initTools() {
  try {
    // 根据当前路径判断是在根目录还是pages目录
    const pathPrefix = window.location.pathname.includes('/pages/') ? '../' : '';
    const response = await fetch(`${pathPrefix}data/tools.json`);
    const tools = await response.json();
    
    // 获取工具列表容器
    const toolsContainer = document.getElementById('tools-grid');
    if (!toolsContainer) return;
    
    // 清空容器并隐藏加载状态
    toolsContainer.innerHTML = '';
    
    // 遍历并渲染每个工具，添加延迟以实现交错动画
    tools.forEach((tool, index) => {
      const toolCard = createToolCard(tool);
      toolsContainer.appendChild(toolCard);

      // 添加动画
      setTimeout(() => {
        toolCard.classList.add('appear');
      }, 50 * index); // 交错出现动画
    });
  } catch (error) {
    console.error('加载工具数据失败:', error);
    
    // 显示错误信息
    const toolsContainer = document.getElementById('tools-grid');
    if (toolsContainer) {
      toolsContainer.innerHTML = `
        <div class="error-message">
          <p>抱歉，加载工具数据失败。请刷新页面重试。</p>
        </div>
      `;
    }
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
  let visibleCount = 0;
  
  toolCards.forEach((card, index) => {
    const shouldShow = category === 'all' || card.dataset.category === category;
    
    // 重置动画类
    card.classList.remove('appear');
    
    if (shouldShow) {
      card.style.display = '';
      visibleCount++;
      
      // 重新添加出现动画，带有交错效果
      setTimeout(() => {
        card.classList.add('appear');
      }, 50 * index);
    } else {
      card.style.display = 'none';
    }
  });
  
  // 显示无结果提示
  const toolsContainer = document.getElementById('tools-grid');
  const noResultsElement = document.querySelector('.no-results');
  
  if (visibleCount === 0) {
    if (!noResultsElement) {
      const noResults = document.createElement('div');
      noResults.className = 'no-results fade-in';
      noResults.innerHTML = `
        <p>该分类下暂无工具，请选择其他分类查看。</p>
      `;
      toolsContainer.appendChild(noResults);
    }
  } else if (noResultsElement) {
    noResultsElement.remove();
  }
}

/**
 * 初始化搜索功能
 */
function initSearch() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;
  
  // 使用防抖函数优化输入事件
  const debouncedSearch = debounce((searchTerm) => {
    searchTools(searchTerm);
  }, 300);
  
  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase().trim();
    debouncedSearch(searchTerm);
  });
}

/**
 * 防抖函数 - 优化性能
 * @param {Function} func 要执行的函数
 * @param {number} wait 等待时间(毫秒)
 * @returns {Function} 防抖处理后的函数
 */
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

/**
 * 根据关键词搜索工具
 * @param {string} searchTerm 搜索关键词
 */
function searchTools(searchTerm) {
  const toolCards = document.querySelectorAll('.tool-card');
  let visibleCount = 0;
  
  // 重置分类按钮状态
  if (searchTerm) {
    document.querySelectorAll('.category-tabs button').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.category-tabs button[data-category="all"]').classList.add('active');
  }
  
  toolCards.forEach((card, index) => {
    const toolName = card.querySelector('h3').textContent.toLowerCase();
    const toolDescription = card.querySelector('.tool-description').textContent.toLowerCase();
    const advantages = card.querySelector('.feature-value').textContent.toLowerCase();
    
    const shouldShow = toolName.includes(searchTerm) || 
                        toolDescription.includes(searchTerm) || 
                        advantages.includes(searchTerm);
    
    // 重置动画类
    card.classList.remove('appear');
    
    if (shouldShow) {
      card.style.display = '';
      visibleCount++;
      
      // 重新添加出现动画，带有交错效果
      setTimeout(() => {
        card.classList.add('appear');
      }, 50 * index);
    } else {
      card.style.display = 'none';
    }
  });
  
  // 显示无结果提示
  const toolsContainer = document.getElementById('tools-grid');
  const noResultsElement = document.querySelector('.no-results');
  
  if (visibleCount === 0 && searchTerm) {
    if (!noResultsElement) {
      const noResults = document.createElement('div');
      noResults.className = 'no-results fade-in';
      noResults.innerHTML = `
        <p>未找到与"${searchTerm}"相关的工具，请尝试其他关键词。</p>
      `;
      toolsContainer.appendChild(noResults);
    }
  } else if (noResultsElement) {
    noResultsElement.remove();
  }
}

/**
 * 初始化页脚的交错出现动画
 */
function initFooterAnimations() {
  const staggerItems = document.querySelectorAll('.stagger-item');
  
  staggerItems.forEach((item, index) => {
    setTimeout(() => {
      item.classList.add('stagger-appear');
    }, 100 * index + 500); // 延迟开始，并添加交错效果
  });
}

/**
 * 初始化交叉观察器以监测元素进入视口
 */
function observeElements() {
  // 如果浏览器不支持IntersectionObserver，则直接返回
  if (!('IntersectionObserver' in window)) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target); // 只需要触发一次
      }
    });
  }, {
    threshold: 0.1 // 至少10%进入视口才触发
  });
  
  // 观察需要动画的元素
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
} 