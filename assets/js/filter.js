/**
 * BytePilot筛选功能
 * 负责处理分类和标签筛选
 */

/**
 * 初始化筛选功能
 * @param {Array} categories 分类数据
 */
function initFilters(categories) {
  // 如果URL中包含分类参数，自动选择对应分类
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');
  
  if (categoryParam) {
    // 找到对应分类按钮并触发点击
    const categoryButton = document.querySelector(`.category-tabs button[data-category="${categoryParam}"]`);
    if (categoryButton) {
      categoryButton.click();
    }
  }
  
  // 添加URL参数更新
  const filterButtons = document.querySelectorAll('.category-tabs button');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.category;
      
      // 更新URL参数，但不刷新页面
      if (category === 'all') {
        history.pushState({}, '', window.location.pathname);
      } else {
        history.pushState({}, '', `${window.location.pathname}?category=${category}`);
      }
    });
  });
}

/**
 * 高级筛选功能
 * @param {Object} filters 筛选条件对象
 */
function advancedFilter(filters) {
  const toolCards = document.querySelectorAll('.tool-card');
  
  toolCards.forEach(card => {
    let isVisible = true;
    
    // 分类筛选
    if (filters.category && filters.category !== 'all') {
      isVisible = isVisible && card.dataset.category === filters.category;
    }
    
    // 关键词筛选
    if (filters.keyword && filters.keyword.length > 0) {
      const toolName = card.querySelector('h3').textContent.toLowerCase();
      const toolDescription = card.querySelector('.tool-description').textContent.toLowerCase();
      const keyword = filters.keyword.toLowerCase();
      
      isVisible = isVisible && (toolName.includes(keyword) || toolDescription.includes(keyword));
    }
    
    // 设置可见性
    card.style.display = isVisible ? '' : 'none';
  });
}

/**
 * 组合筛选功能
 * 支持同时按多种条件筛选
 */
function initCombinedFilters() {
  // 获取分类和搜索框
  const categoryButtons = document.querySelectorAll('.category-tabs button');
  const searchInput = document.getElementById('search-input');
  
  // 当前筛选状态
  const filterState = {
    category: 'all',
    keyword: ''
  };
  
  // 分类筛选事件
  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterState.category = button.dataset.category;
      advancedFilter(filterState);
    });
  });
  
  // 搜索筛选事件
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      filterState.keyword = searchInput.value.trim();
      advancedFilter(filterState);
    });
  }
}

// 导出模块
export { initFilters, advancedFilter, initCombinedFilters }; 