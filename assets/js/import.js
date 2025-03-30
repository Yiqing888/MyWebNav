document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('excelFile');
    const fileName = document.getElementById('file-name');
    const importButton = document.getElementById('import-button');
    const importResults = document.getElementById('import-results');
    const resultsMessage = document.getElementById('results-message');
    
    let excelData = null;
    
    // 文件选择处理
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            fileName.textContent = file.name;
            importButton.disabled = false;
            
            // 读取Excel文件
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    excelData = XLSX.utils.sheet_to_json(worksheet);
                    
                    // 允许导入
                    importButton.disabled = false;
                } catch (error) {
                    showError('无法解析Excel文件，请确保格式正确。');
                    importButton.disabled = true;
                }
            };
            reader.readAsArrayBuffer(file);
        } else {
            fileName.textContent = '或将文件拖放到此处';
            importButton.disabled = true;
        }
    });
    
    // 拖放功能
    const dropArea = document.querySelector('.file-upload');
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        dropArea.classList.add('highlight');
    }
    
    function unhighlight() {
        dropArea.classList.remove('highlight');
    }
    
    dropArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const file = dt.files[0];
        fileInput.files = dt.files;
        
        if (file) {
            fileName.textContent = file.name;
            
            // 触发change事件
            const event = new Event('change');
            fileInput.dispatchEvent(event);
        }
    }
    
    // 导入按钮点击事件
    importButton.addEventListener('click', function() {
        if (!excelData || excelData.length === 0) {
            showError('没有可导入的数据');
            return;
        }
        
        importButton.disabled = true;
        importButton.textContent = '导入中...';
        
        // 获取现有工具数据
        fetch('../data/tools.json')
            .then(response => response.json())
            .then(existingTools => {
                // 获取分类数据
                return fetch('../data/categories.json')
                    .then(response => response.json())
                    .then(categories => {
                        return { existingTools, categories };
                    });
            })
            .then(({ existingTools, categories }) => {
                // 处理导入数据
                const newTools = processExcelData(excelData, existingTools, categories);
                
                // 保存数据
                return saveToolsData(newTools);
            })
            .then(result => {
                showSuccess(`成功导入 ${result.count} 个网址工具`);
                importButton.textContent = '导入完成';
            })
            .catch(error => {
                showError('导入失败: ' + error.message);
                importButton.textContent = '开始导入';
                importButton.disabled = false;
            });
    });
    
    // 处理Excel数据
    function processExcelData(excelData, existingTools, categories) {
        const newTools = [...existingTools];
        const importedCount = { count: 0 };
        
        // 确保categories是数组
        const categoryList = Array.isArray(categories) ? categories : [];
        
        excelData.forEach((row, index) => {
            // 跳过空行或无效数据
            if (!row.name && !row.url) return;
            
            // 基本验证
            const name = row.name || row.title || row.网站名称 || '未命名网站';
            const url = row.url || row.链接 || row.网址 || '#';
            
            // 检查URL是否已存在
            const urlExists = existingTools.some(tool => tool.url === url);
            if (urlExists) return;
            
            // 处理分类
            let categoryId = 'other';
            let tagName = '其他';
            
            const categoryName = row.category || row.分类 || row.类别 || '其他';
            
            // 查找匹配的分类
            const matchedCategory = categoryList.find(cat => 
                cat.name === categoryName || 
                (cat.aliases && cat.aliases.includes(categoryName))
            );
            
            if (matchedCategory) {
                categoryId = matchedCategory.id;
                tagName = matchedCategory.name;
            }
            
            // 创建新工具项
            const newTool = {
                id: `tool-${Date.now()}-${index}`,
                name: name,
                url: url,
                category: categoryId,
                tagName: tagName,
                description: row.description || row.描述 || `${name}是一个实用的在线工具`,
                advantages: row.advantages || row.优点 || row.优势 || '暂无数据',
                disadvantages: row.disadvantages || row.缺点 || row.不足 || '暂无数据',
                iconBgColor: getRandomColor(),
                iconSvg: getIconSvg(categoryId)
            };
            
            newTools.push(newTool);
            importedCount.count++;
        });
        
        return { tools: newTools, count: importedCount.count };
    }
    
    // 保存工具数据
    function saveToolsData(data) {
        // 在实际应用中，这里应该是一个AJAX请求到后端保存数据
        // 由于前端无法直接写文件，这里模拟一个成功的响应
        
        // 模拟保存成功
        return new Promise((resolve) => {
            // 在真实环境中，这里应该发送数据到服务器
            console.log('将保存以下数据:', data.tools);
            
            // 等待2秒模拟网络请求
            setTimeout(() => {
                localStorage.setItem('importedTools', JSON.stringify(data.tools));
                resolve({ count: data.count });
            }, 2000);
        });
    }
    
    // 显示成功消息
    function showSuccess(message) {
        importResults.className = 'import-results import-success';
        resultsMessage.textContent = message;
        importResults.style.display = 'block';
    }
    
    // 显示错误消息
    function showError(message) {
        importResults.className = 'import-results import-error';
        resultsMessage.textContent = message;
        importResults.style.display = 'block';
    }
    
    // 获取随机颜色
    function getRandomColor() {
        const colors = [
            "rgba(0, 122, 255, 0.1)",
            "rgba(52, 199, 89, 0.1)",
            "rgba(255, 149, 0, 0.1)",
            "rgba(255, 45, 85, 0.1)",
            "rgba(175, 82, 222, 0.1)",
            "rgba(90, 200, 250, 0.1)",
            "rgba(255, 204, 0, 0.1)",
            "rgba(88, 86, 214, 0.1)"
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // 根据分类获取图标
    function getIconSvg(category) {
        const icons = {
            'hosting': '<path d="M12 2L22 19H2L12 2Z" fill="#000000"/>',
            'backend': '<path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#34D399"/>',
            'seo': '<path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" fill="#FF9500"/>',
            'ai': '<path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#6366F1"/>',
            'cdn': '<path d="M12 3L4 15H20L12 3Z" fill="#F47F2A"/>',
            'code': '<path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12C2 16.418 4.865 20.166 8.839 21.489C9.339 21.581 9.521 21.28 9.521 21.017C9.521 20.781 9.513 20.032 9.508 19.203C6.726 19.795 6.139 17.88 6.139 17.88C5.684 16.735 5.032 16.435 5.032 16.435C4.12 15.809 5.097 15.822 5.097 15.822C6.101 15.889 6.629 16.846 6.629 16.846C7.521 18.39 8.97 17.927 9.539 17.672C9.631 17.042 9.889 16.579 10.175 16.319C7.954 16.056 5.62 15.206 5.62 11.429C5.62 10.339 6.01 9.446 6.649 8.747C6.546 8.494 6.203 7.587 6.747 6.195C6.747 6.195 7.587 5.927 9.497 7.236C10.295 7.015 11.15 6.904 12 6.9C12.85 6.904 13.705 7.015 14.503 7.236C16.413 5.927 17.253 6.195 17.253 6.195C17.797 7.587 17.454 8.494 17.351 8.747C17.991 9.446 18.38 10.339 18.38 11.429C18.38 15.216 16.041 16.054 13.813 16.312C14.172 16.633 14.492 17.269 14.492 18.241C14.492 19.629 14.479 20.689 14.479 21.017C14.479 21.282 14.659 21.585 15.167 21.487C19.138 20.161 22 16.416 22 12C22 6.477 17.523 2 12 2Z" fill="#000000"/>',
            'analytics': '<path d="M12 2V8L17 12L12 16V22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" fill="#EA580C"/><path d="M12 22V16L7 12L12 8V2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#FACC15"/>',
            'domain': '<path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM4 12C4 11.39 4.08 10.79 4.21 10.22L8 14V15C8 16.1 8.9 17 10 17V20.93C6.53 20.13 4 16.39 4 12ZM16.67 19.66C16.52 19.53 16.25 19.25 16.04 18.8L15.71 18.13C15.4 17.52 14.81 17.1 14.13 17.01L12.47 16.8C12.03 16.74 11.61 16.54 11.27 16.25L10.95 15.97C10.39 15.47 9.57 15.47 9 15.96C8.75 16.19 8.42 16.31 8.06 16.31H7V14.25L9.45 11.8C9.6 11.65 9.8 11.56 10 11.56C10.55 11.56 11 12.01 11 12.56V13.5C11.41 13.5 11.8 13.59 12.16 13.75L13.06 14.21C13.33 14.32 13.63 14.38 13.94 14.38C14.59 14.38 15.18 14.06 15.5 13.5L16.19 12.16C16.29 11.97 16.44 11.82 16.6 11.73L18.77 10.5H19C19.55 10.5 20 10.95 20 11.5C20 11.95 19.5 12.33 19.5 12.38L19.41 12.47L18.41 13.47C18.14 13.74 18 14.12 18 14.5V15.69C18 16.08 17.86 16.45 17.59 16.72L16.3 18C16.7 18.41 16.83 18.67 16.97 19C16.24 19.46 15.4 19.77 14.5 19.91V19.83C14.5 19.37 14.71 18.94 15.07 18.67L16.67 19.66Z" fill="#5856D6"/>',
            'other': '<rect width="18" height="18" x="3" y="3" rx="5" stroke="#007AFF" stroke-width="2"/>'
        };
        
        return icons[category] || icons['other'];
    }
}); 