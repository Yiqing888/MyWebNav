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
  
  // 初始化光影效果
  initHoverEffects();
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
    const toolsContainer = document.getElementById('tools-container');
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
    const toolsContainer = document.getElementById('tools-container');
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
  card.className = 'tool-card hover-glow';
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
      <span>访问网站</span>
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
async function initCategoryFilters() {
  try {
    // 获取分类数据
    const pathPrefix = window.location.pathname.includes('/pages/') ? '../' : '';
    const response = await fetch(`${pathPrefix}data/categories.json`);
    const categories = await response.json();
    
    // 获取分类过滤器容器
    const filterContainer = document.getElementById('category-filters');
    if (!filterContainer) return;
    
    // 确保"全部"按钮存在
    const allButton = filterContainer.querySelector('button[data-category="all"]');
    if (!allButton) {
      const allBtn = document.createElement('button');
      allBtn.classList.add('active', 'hover-glow');
      allBtn.dataset.category = 'all';
      allBtn.textContent = '全部';
      filterContainer.appendChild(allBtn);
    }
    
    // 添加分类按钮
    categories.forEach(category => {
      // 检查是否已存在
      if (!filterContainer.querySelector(`button[data-category="${category.id}"]`)) {
        const button = document.createElement('button');
        button.classList.add('hover-glow');
        button.dataset.category = category.id;
        button.textContent = category.name;
        filterContainer.appendChild(button);
      }
    });
    
    // 添加事件监听器
    const filterButtons = filterContainer.querySelectorAll('button');
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
  } catch (error) {
    console.error('加载分类数据失败:', error);
  }
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
  const toolsContainer = document.getElementById('tools-container');
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
  
  // 添加搜索框焦点效果
  searchInput.addEventListener('focus', () => {
    searchInput.parentElement.classList.add('focus');
  });
  
  searchInput.addEventListener('blur', () => {
    searchInput.parentElement.classList.remove('focus');
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
  const toolsContainer = document.getElementById('tools-container');
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

/**
 * 初始化悬停光影效果
 */
function initHoverEffects() {
  // 为所有带有hover-glow类的元素添加鼠标跟踪效果
  const hoverElements = document.querySelectorAll('.hover-glow');
  
  hoverElements.forEach(el => {
    el.addEventListener('mousemove', e => {
      // 计算鼠标在元素内的相对位置(百分比)
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      // 设置CSS变量用于光影效果定位
      el.style.setProperty('--x', `${x}%`);
      el.style.setProperty('--y', `${y}%`);
    });
    
    // 鼠标离开时重置位置
    el.addEventListener('mouseleave', () => {
      el.style.setProperty('--x', '50%');
      el.style.setProperty('--y', '50%');
    });
  });
  
  // 为工具卡片添加悬停时的3D倾斜效果
  const toolCards = document.querySelectorAll('.tool-card');
  
  toolCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // 计算倾斜角度(最大±5度)
      const tiltX = ((y / rect.height) * 10) - 5;
      const tiltY = ((x / rect.width) * 10) - 5;
      
      // 应用3D变换
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-15px) scale(1.03)`;
    });
    
    // 鼠标离开时重置
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
} 