/**
 * BytePilot搜索功能
 * 负责处理搜索和结果显示
 */

/**
 * 初始化搜索功能
 */
function initSearch() {
  const searchInput = document.getElementById('search-input');
  const toolsGrid = document.getElementById('tools-grid');
  
  if (!searchInput || !toolsGrid) return;
  
  // 添加搜索事件监听
  searchInput.addEventListener('input', debounce(function() {
    const searchTerm = this.value.toLowerCase().trim();
    
    // 如果搜索词为空，重置显示
    if (searchTerm === '') {
      resetSearch();
      return;
    }
    
    // 执行搜索
    performSearch(searchTerm);
  }, 300));
  
  // 添加搜索清除按钮
  addSearchClearButton(searchInput);
}

/**
 * 执行搜索
 * @param {string} searchTerm 搜索关键词
 */
function performSearch(searchTerm) {
  const toolCards = document.querySelectorAll('.tool-card');
  let hasResults = false;
  
  toolCards.forEach(card => {
    const toolName = card.querySelector('h3').textContent.toLowerCase();
    const toolDescription = card.querySelector('.tool-description').textContent.toLowerCase();
    const advantages = card.querySelector('.feature-value').textContent.toLowerCase();
    
    // 匹配名称、描述和优势
    const isMatch = toolName.includes(searchTerm) || 
                    toolDescription.includes(searchTerm) || 
                    advantages.includes(searchTerm);
    
    // 设置可见性
    card.style.display = isMatch ? '' : 'none';
    
    // 高亮匹配文本
    if (isMatch) {
      hasResults = true;
      highlightMatches(card, searchTerm);
    }
  });
  
  // 显示搜索结果状态
  updateSearchResultStatus(hasResults, searchTerm);
}

/**
 * 重置搜索，恢复原始显示
 */
function resetSearch() {
  // 恢复所有卡片显示
  const toolCards = document.querySelectorAll('.tool-card');
  toolCards.forEach(card => {
    card.style.display = '';
    
    // 移除高亮
    removeHighlights(card);
  });
  
  // 移除搜索结果状态
  const searchStatus = document.getElementById('search-status');
  if (searchStatus) {
    searchStatus.remove();
  }
  
  // 恢复当前选中的分类筛选
  const activeCategory = document.querySelector('.category-tabs button.active');
  if (activeCategory && activeCategory.dataset.category !== 'all') {
    const category = activeCategory.dataset.category;
    filterByCategory(category);
  }
}

/**
 * 高亮匹配文本
 * @param {HTMLElement} card 工具卡片元素
 * @param {string} term 搜索词
 */
function highlightMatches(card, term) {
  // 移除之前的高亮
  removeHighlights(card);
  
  // 高亮名称
  const nameElement = card.querySelector('h3');
  nameElement.innerHTML = highlightText(nameElement.textContent, term);
  
  // 高亮描述
  const descElement = card.querySelector('.tool-description');
  descElement.innerHTML = highlightText(descElement.textContent, term);
}

/**
 * 高亮文本中的匹配项
 * @param {string} text 原文本
 * @param {string} term 搜索词
 * @returns {string} 高亮后的HTML
 */
function highlightText(text, term) {
  if (!term) return text;
  
  const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi');
  return text.replace(regex, '<span class="highlight">$1</span>');
}

/**
 * 转义正则表达式特殊字符
 * @param {string} string 需要转义的字符串
 * @returns {string} 转义后的字符串
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 移除高亮
 * @param {HTMLElement} element 包含高亮的元素
 */
function removeHighlights(element) {
  const highlights = element.querySelectorAll('.highlight');
  highlights.forEach(highlight => {
    const parent = highlight.parentNode;
    parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
    // 合并相邻的文本节点
    parent.normalize();
  });
}

/**
 * 更新搜索结果状态
 * @param {boolean} hasResults 是否有结果
 * @param {string} searchTerm 搜索词
 */
function updateSearchResultStatus(hasResults, searchTerm) {
  // 移除旧状态
  const oldStatus = document.getElementById('search-status');
  if (oldStatus) {
    oldStatus.remove();
  }
  
  // 创建状态元素
  const statusElement = document.createElement('div');
  statusElement.id = 'search-status';
  statusElement.className = 'search-status';
  
  if (hasResults) {
    statusElement.textContent = `搜索结果: "${searchTerm}"`;
  } else {
    statusElement.textContent = `未找到与 "${searchTerm}" 相关的结果`;
    statusElement.classList.add('no-results');
  }
  
  // 添加到工具网格前
  const toolsGrid = document.getElementById('tools-grid');
  toolsGrid.parentNode.insertBefore(statusElement, toolsGrid);
}

/**
 * 按分类筛选
 * @param {string} category 分类ID
 */
function filterByCategory(category) {
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
 * 添加搜索清除按钮
 * @param {HTMLElement} searchInput 搜索输入框
 */
function addSearchClearButton(searchInput) {
  // 创建清除按钮
  const clearButton = document.createElement('button');
  clearButton.className = 'search-clear';
  clearButton.innerHTML = '&times;';
  clearButton.style.display = 'none';
  
  // 添加到搜索栏
  searchInput.parentNode.appendChild(clearButton);
  
  // 当有输入内容时显示清除按钮
  searchInput.addEventListener('input', () => {
    clearButton.style.display = searchInput.value.length > 0 ? 'block' : 'none';
  });
  
  // 清除按钮点击事件
  clearButton.addEventListener('click', () => {
    searchInput.value = '';
    clearButton.style.display = 'none';
    resetSearch();
    
    // 聚焦回搜索框
    searchInput.focus();
  });
}

/**
 * 防抖函数
 * @param {Function} func 需要防抖的函数
 * @param {number} wait 等待时间（毫秒）
 * @returns {Function} 防抖处理后的函数
 */
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

// 导出模块
export { initSearch, performSearch, resetSearch }; 