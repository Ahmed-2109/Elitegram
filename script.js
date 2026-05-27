let likedPosts = new Set();
let savedPosts = new Set();
let followedUsers = new Set();
let postsData = [];
let isDarkMode = localStorage.getItem('darkMode') === 'true';
let currentStoryIndex = 0;
let storyTimeout;

// ==================== DOM ELEMENTS ====================
const createBtn = document.getElementById('create-btn');
const commentsBtn = document.querySelectorAll('.comment-btn');
const likeButtons = document.querySelectorAll('.like-btn');
const saveButtons = document.querySelectorAll('.save-btn');
const followButtons = document.querySelectorAll('.follow-btn');
const createModal = document.getElementById('createModal');
const commentsModal = document.getElementById('commentsModal');
const profileModal = document.getElementById('profileModal');
const storyModal = document.getElementById('storyModal');
const exploreModal = document.getElementById('exploreModal');
const modalCloseButtons = document.querySelectorAll('.modal-close');
const createPostForm = document.getElementById('createPostForm');
const postCancelBtn = document.querySelector('.btn-cancel');
const logoutBtn = document.querySelector('.logout-btn');
const navIcons = document.querySelectorAll('.nav-icon');
const menuItems = document.querySelectorAll('.menu-item');
const switchBtn = document.querySelector('.switch-btn');
const searchInput = document.querySelector('.search-input');
const themeToggle = document.getElementById('theme-toggle');
const storyElements = document.querySelectorAll('.story[data-story-id]');
const addStoryBtn = document.getElementById('add-story-btn');
const profileMenuBtn = document.getElementById('profile-menu');
const exploreBtn = document.getElementById('explore-btn');
const postCaptionInput = document.getElementById('postCaption');
const charCountDisplay = document.getElementById('charCount');
const fabCreate = document.getElementById('fab-create');
const loadingSpinner = document.getElementById('loadingSpinner');

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeEventListeners();
    loadPostsData();
    setupAnimations();
    initializeScrollAnimations();
    console.log('%c👑 ELITEGRAM - Premium Social Experience Loaded!', 'font-size: 20px; color: #d4af37; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);');
    console.log('%c✨ Version: 3.0 ELITE | Glassmorphism + Premium Animations', 'font-size: 13px; color: #405de6;');
});

// ==================== THEME MANAGEMENT ====================
function initializeTheme() {
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        updateThemeIcon();
    }
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    updateThemeIcon();
    showNotification(isDarkMode ? '🌙 Elite Dark Mode Activated' : '☀️ Elite Light Mode Activated', 'success');
}

function updateThemeIcon() {
    const icon = themeToggle.querySelector('i');
    if (isDarkMode) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// ==================== EVENT LISTENERS ====================
function initializeEventListeners() {
    // Create Post Button
    if (createBtn) {
        createBtn.addEventListener('click', openCreateModal);
    }

    if (fabCreate) {
        fabCreate.addEventListener('click', openCreateModal);
    }

    // Modal Close Buttons
    modalCloseButtons.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    // Like Buttons
    likeButtons.forEach(btn => {
        btn.addEventListener('click', handleLike);
    });

    // Save Buttons
    saveButtons.forEach(btn => {
        btn.addEventListener('click', handleSave);
    });

    // Comment Buttons
    commentsBtn.forEach(btn => {
        btn.addEventListener('click', openCommentsModal);
    });

    // Follow Buttons
    followButtons.forEach(btn => {
        btn.addEventListener('click', handleFollow);
    });

    // Create Post Form
    if (createPostForm) {
        createPostForm.addEventListener('submit', handleCreatePost);
    }

    // Cancel Button
    if (postCancelBtn) {
        postCancelBtn.addEventListener('click', closeAllModals);
    }

    // Logout Button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Navigation Icons
    navIcons.forEach(icon => {
        icon.addEventListener('click', handleNavigation);
    });

    // Menu Items
    menuItems.forEach(item => {
        item.addEventListener('click', handleMenuClick);
    });

    // Switch Account Button
    if (switchBtn) {
        switchBtn.addEventListener('click', handleSwitchAccount);
    }

    // Search Input
    if (searchInput) {
        searchInput.addEventListener('focus', handleSearchFocus);
        searchInput.addEventListener('blur', handleSearchBlur);
        searchInput.addEventListener('input', handleSearch);
    }

    // Theme Toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Story Elements
    storyElements.forEach(story => {
        story.addEventListener('click', () => openStoryViewer(story.getAttribute('data-story-id')));
    });

    // Add Story Button
    if (addStoryBtn) {
        addStoryBtn.addEventListener('click', () => {
            showNotification('📸 Elite Story feature coming soon!', 'info');
        });
    }

    // Profile Menu
    if (profileMenuBtn) {
        profileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openProfileModal();
        });
    }

    // Explore Button
    if (exploreBtn) {
        exploreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openExploreModal();
        });
    }

    // Character Count
    if (postCaptionInput) {
        postCaptionInput.addEventListener('input', updateCharCount);
    }

    // Close modals when clicking outside
    window.addEventListener('click', closeModalOnOutsideClick);

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);

    // Story Navigation
    const storyPrevBtn = document.querySelector('.story-prev');
    const storyNextBtn = document.querySelector('.story-next');
    if (storyPrevBtn) storyPrevBtn.addEventListener('click', previousStory);
    if (storyNextBtn) storyNextBtn.addEventListener('click', nextStory);

    // Scroll events
    window.addEventListener('scroll', handleScroll);
}

// ==================== LIKE FUNCTIONALITY ====================
function handleLike(e) {
    const btn = e.currentTarget;
    const postId = btn.getAttribute('data-post');
    const icon = btn.querySelector('i');
    const likesCountElement = document.getElementById(`likes-count-${postId}`);

    if (likedPosts.has(postId)) {
        likedPosts.delete(postId);
        btn.classList.remove('liked', 'animate');
        icon.classList.remove('fas');
        icon.classList.add('far');
        if (likesCountElement) {
            let currentLikes = parseInt(likesCountElement.textContent.replace(/,/g, ''));
            likesCountElement.textContent = (currentLikes - 1).toLocaleString();
        }
    } else {
        likedPosts.add(postId);
        btn.classList.add('liked', 'animate');
        icon.classList.remove('far');
        icon.classList.add('fas');
        if (likesCountElement) {
            let currentLikes = parseInt(likesCountElement.textContent.replace(/,/g, ''));
            likesCountElement.textContent = (currentLikes + 1).toLocaleString();
        }
        showNotification('❤️ Elite Post Liked!', 'success');
        createParticles(e.clientX, e.clientY);
    }
}

// ==================== SAVE FUNCTIONALITY ====================
function handleSave(e) {
    const btn = e.currentTarget;
    const postId = btn.closest('.post').querySelector('.like-btn').getAttribute('data-post');
    const icon = btn.querySelector('i');

    if (savedPosts.has(postId)) {
        savedPosts.delete(postId);
        btn.classList.remove('saved');
        icon.classList.remove('fas');
        icon.classList.add('far');
        showNotification('📌 Post removed from elite collection', 'info');
    } else {
        savedPosts.add(postId);
        btn.classList.add('saved');
        icon.classList.remove('far');
        icon.classList.add('fas');
        showNotification('📌 Added to elite collection!', 'success');
    }
}

// ==================== FOLLOW FUNCTIONALITY ====================
function handleFollow(e) {
    const btn = e.currentTarget;
    const userName = btn.closest('.suggestion-item').querySelector('h5').textContent;

    if (followedUsers.has(userName)) {
        followedUsers.delete(userName);
        btn.classList.remove('following');
        btn.textContent = 'Follow';
        showNotification(`👋 Unfollowed ${userName}`, 'info');
    } else {
        followedUsers.add(userName);
        btn.classList.add('following');
        btn.textContent = 'Following';
        showNotification(`👥 Now following ${userName}!`, 'success');
    }
}

// ==================== MODAL FUNCTIONS ====================
function openCreateModal() {
    createModal.classList.add('active');
    document.body.classList.add('no-scroll');
    showNotification('✍️ Create your elite post', 'info');
}

function openCommentsModal(e) {
    commentsModal.classList.add('active');
    document.body.classList.add('no-scroll');
}

function openProfileModal() {
    profileModal.classList.add('active');
    document.body.classList.add('no-scroll');
}

function openExploreModal() {
    exploreModal.classList.add('active');
    document.body.classList.add('no-scroll');
}

function openStoryViewer(storyId) {
    storyModal.classList.add('active');
    document.body.classList.add('no-scroll');
    currentStoryIndex = parseInt(storyId);
    loadStoryContent(currentStoryIndex);
    startStoryProgress();
}

function closeAllModals() {
    createModal.classList.remove('active');
    commentsModal.classList.remove('active');
    profileModal.classList.remove('active');
    exploreModal.classList.remove('active');
    storyModal.classList.remove('active');
    document.body.classList.remove('no-scroll');
    clearTimeout(storyTimeout);
}

function closeModalOnOutsideClick(e) {
    if (e.target === createModal || e.target === commentsModal || 
        e.target === profileModal || e.target === exploreModal || 
        e.target === storyModal) {
        closeAllModals();
    }
}

// ==================== STORY VIEWER ====================
function loadStoryContent(storyId) {
    const stories = [
        { id: 1, user: 'john_elite', avatar: 'https://i.pravatar.cc/40?img=2', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop', time: '2 hours ago' },
        { id: 2, user: 'jane_premium', avatar: 'https://i.pravatar.cc/40?img=3', image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&h=500&fit=crop', time: '4 hours ago' },
        { id: 3, user: 'alex_elite', avatar: 'https://i.pravatar.cc/40?img=4', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=500&fit=crop', time: '6 hours ago' },
        { id: 4, user: 'sarah_elite', avatar: 'https://i.pravatar.cc/40?img=5', image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=500&h=500&fit=crop', time: '8 hours ago' },
        { id: 5, user: 'mike_elite', avatar: 'https://i.pravatar.cc/40?img=6', image: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=500&h=500&fit=crop', time: '10 hours ago' }
    ];

    const story = stories[storyId - 1];
    if (story) {
        document.getElementById('storyImage').src = story.image;
        document.getElementById('storyUserAvatar').src = story.avatar;
        document.getElementById('storyUsername').textContent = story.user;
        document.getElementById('storyTime').textContent = story.time;
    }
}

function startStoryProgress() {
    const progressBar = document.querySelector('.progress-bar');
    progressBar.style.animation = 'none';
    setTimeout(() => {
        progressBar.style.animation = 'progressBar 5s linear forwards';
    }, 10);

    storyTimeout = setTimeout(() => {
        nextStory();
    }, 5000);
}

function previousStory() {
    clearTimeout(storyTimeout);
    currentStoryIndex = currentStoryIndex > 1 ? currentStoryIndex - 1 : 5;
    loadStoryContent(currentStoryIndex);
    startStoryProgress();
}

function nextStory() {
    clearTimeout(storyTimeout);
    currentStoryIndex = currentStoryIndex < 5 ? currentStoryIndex + 1 : 1;
    if (currentStoryIndex === 1) {
        closeAllModals();
    } else {
        loadStoryContent(currentStoryIndex);
        startStoryProgress();
    }
}

// ==================== CREATE POST ====================
function handleCreatePost(e) {
    e.preventDefault();
    const caption = document.getElementById('postCaption').value;
    const location = document.getElementById('postLocation').value;
    const imageInput = document.getElementById('postImage');

    if (!caption.trim() && !imageInput.files.length) {
        showNotification('❌ Add a caption or image for your elite post', 'error');
        return;
    }

    if (caption.trim()) {
        showLoadingSpinner(true);
        setTimeout(() => {
            showLoadingSpinner(false);
            showNotification('✅ Elite Post Published!', 'success');
            createPostForm.reset();
            charCountDisplay.textContent = '0';
            closeAllModals();
            addNewPostToFeed(caption, location, imageInput.files[0]);
        }, 800);
    }
}

function updateCharCount() {
    const count = postCaptionInput.value.length;
    charCountDisplay.textContent = count;
    if (count > 2000) {
        postCaptionInput.value = postCaptionInput.value.substring(0, 2200);
    }
}

function addNewPostToFeed(caption, location, imageFile) {
    const postsSection = document.querySelector('.posts-section');
    const newPost = document.createElement('article');
    newPost.className = 'post glass-effect premium-post';
    
    let imageUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop';
    if (imageFile) {
        imageUrl = URL.createObjectURL(imageFile);
    }

    newPost.innerHTML = `
        <div class="post-header">
            <div class="post-user">
                <img src="https://i.pravatar.cc/40?img=1" alt="User" class="post-avatar">
                <div class="post-user-info">
                    <h3>elite_user</h3>
                    <span class="post-time">just now</span>
                </div>
                <span class="elite-badge"><i class="fas fa-star"></i> Elite</span>
            </div>
            <button class="post-menu-btn">
                <i class="fas fa-ellipsis-h"></i>
            </button>
        </div>
        <div class="post-image premium-image">
            <img src="${imageUrl}" alt="Post">
            <div class="image-overlay"></div>
        </div>
        <div class="post-actions">
            <button class="action-btn like-btn" data-post="new">
                <i class="far fa-heart"></i>
            </button>
            <button class="action-btn comment-btn">
                <i class="far fa-comment"></i>
            </button>
            <button class="action-btn share-btn">
                <i class="far fa-paper-plane"></i>
            </button>
            <button class="action-btn save-btn">
                <i class="far fa-bookmark"></i>
            </button>
        </div>
        <div class="post-likes">
            <strong id="likes-count-new">0</strong> likes
        </div>
        <div class="post-caption">
            <strong>elite_user</strong> ${caption}
            ${location ? `<br><span style="color: var(--text-secondary); font-size: 12px;">📍 ${location}</span>` : ''}
        </div>
        <div class="post-comments">
            <a href="#">View all 0 comments</a>
        </div>
    `;

    postsSection.insertBefore(newPost, postsSection.firstChild);
    
    const newLikeBtn = newPost.querySelector('.like-btn');
    const newCommentBtn = newPost.querySelector('.comment-btn');
    const newSaveBtn = newPost.querySelector('.save-btn');

    newLikeBtn.addEventListener('click', handleLike);
    newCommentBtn.addEventListener('click', openCommentsModal);
    newSaveBtn.addEventListener('click', handleSave);
}

// ==================== NAVIGATION ====================
function handleNavigation(e) {
    const btn = e.currentTarget;
    const btnId = btn.id;

    navIcons.forEach(icon => icon.classList.remove('active'));
    btn.classList.add('active');

    switch(btnId) {
        case 'home-btn':
            showNotification('🏠 Welcome to Elite Home', 'info');
            break;
        case 'explore-btn':
            openExploreModal();
            break;
        case 'reels-btn':
            showNotification('🎬 Elite Reels (Coming Soon)', 'info');
            break;
        case 'create-btn':
            openCreateModal();
            break;
        case 'likes-btn':
            showNotification('❤️ You have 7 elite likes', 'info');
            break;
        case 'messages-btn':
            showNotification('💬 3 new elite messages', 'info');
            break;
        case 'profile-btn':
            openProfileModal();
            break;
    }
}

function handleMenuClick(e) {
    e.preventDefault();
    const menuText = e.currentTarget.querySelector('span').textContent;
    
    menuItems.forEach(item => item.classList.remove('active'));
    e.currentTarget.classList.add('active');

    showNotification(`👑 ${menuText}`, 'info');
}

// ==================== ACCOUNT FUNCTIONS ====================
function handleSwitchAccount() {
    showNotification('👤 Switch elite account (Coming Soon)', 'info');
}

function handleLogout() {
    if (confirm('Are you sure you want to logout from Elitegram?')) {
        showLoadingSpinner(true);
        setTimeout(() => {
            showLoadingSpinner(false);
            showNotification('👋 Logged out successfully!', 'success');
        }, 1000);
    }
}

// ==================== SEARCH FUNCTIONALITY ====================
function handleSearchFocus() {
    searchInput.style.backgroundColor = '#fff';
    showNotification('🔍 Search elite posts, users, tags...', 'info');
}

function handleSearchBlur() {
    if (!searchInput.value) {
        searchInput.style.backgroundColor = isDarkMode ? '#262626' : '#f0f0f0';
    }
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    if (query.length > 0) {
        console.log('Searching elite content:', query);
    }
}

// ==================== KEYBOARD SHORTCUTS ====================
function handleKeyboardShortcuts(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }

    if (e.key === 'Escape') {
        closeAllModals();
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && createModal.classList.contains('active')) {
        createPostForm.dispatchEvent(new Event('submit'));
    }

    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        toggleTheme();
    }
}

// ==================== NOTIFICATION SYSTEM ====================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 14px 24px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 600;
        z-index: 3000;
       animation: slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        max-width: 320px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
    `;

    switch(type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            notification.style.color = '#fff';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #f44336, #da190b)';
            notification.style.color = '#fff';
            break;
        case 'info':
            notification.style.background = 'linear-gradient(135deg, #2196F3, #0b7dda)';
            notification.style.color = '#fff';
            break;
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        setTimeout(() => notification.remove(), 400);
    }, 3500);
}

// ==================== LOADING SPINNER ====================
function showLoadingSpinner(show) {
    if (show) {
        loadingSpinner.classList.add('active');
    } else {
        loadingSpinner.classList.remove('active');
    }
}

// ==================== PARTICLE EFFECTS ====================
function createParticles(x, y) {
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 10px;
            height: 10px;
            background: linear-gradient(135deg, #d4af37, #e1306c);
            border-radius: 50%;
            pointer-events: none;
            animation: particleFloat 1s ease-out forwards;
            z-index: 2000;
        `;
        
        const angle = (Math.PI * 2 * i) / 6;
        const distance = 80;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
    }
}

// ==================== ANIMATIONS ====================
function setupAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        @keyframes particleFloat {
            0% {
                transform: translate(0, 0) scale(1);
                opacity: 1;
            }
            100% {
                transform: translate(var(--tx), var(--ty)) scale(0);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    observePostsForAnimation();
}

function observePostsForAnimation() {
    const posts = document.querySelectorAll('.post');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.6s ease';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    posts.forEach(post => observer.observe(post));
}

// ==================== SCROLL ANIMATIONS ====================
function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.post, .suggestion-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        observer.observe(el);
    });
}

function handleScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 10) {
        navbar.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.2)';
    } else {
        navbar.style.boxShadow = 'var(--shadow)';
    }
}

// ==================== DATA MANAGEMENT ====================
function loadPostsData() {
    postsData = [
        { id: 1, author: 'john_elite', avatar: 'https://i.pravatar.cc/40?img=2', likes: 1234, comments: 45, timestamp: '2 hours ago' },
        { id: 2, author: 'jane_premium', avatar: 'https://i.pravatar.cc/40?img=3', likes: 2567, comments: 89, timestamp: '4 hours ago' },
        { id: 3, author: 'alex_elite', avatar: 'https://i.pravatar.cc/40?img=4', likes: 3891, comments: 156, timestamp: '6 hours ago' },
        { id: 4, author: 'sarah_elite', avatar: 'https://i.pravatar.cc/40?img=5', likes: 4123, comments: 234, timestamp: '8 hours ago' }
    ];

    console.log('Elite Posts Loaded:', postsData);
}

// ==================== DOUBLE TAP TO LIKE ==================== 
document.addEventListener('dblclick', function(e) {
    if (e.target.closest('.post-image')) {
        const likeBtn = e.target.closest('.post').querySelector('.like-btn');
        if (likeBtn && !likedPosts.has(likeBtn.getAttribute('data-post'))) {
            likeBtn.click();
            showHeartAnimation(e);
        }
    }
});

function showHeartAnimation(e) {
    const heart = document.createElement('div');
    heart.innerHTML = '<i class="fas fa-heart"></i>';
    heart.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        color: #e1306c;
        font-size: 80px;
        pointer-events: none;
        animation: floatUp 1.2s ease-out forwards;
        z-index: 2000;
        text-shadow: 0 0 20px rgba(225, 48, 108, 0.5);
    `;

    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatUp {
            0% {
                transform: translate(-50%, -50%) scale(0.5);
                opacity: 1;
            }
            100% {
                transform: translate(-50%, -200px) scale(0.2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 1200);
}

// ==================== CONSOLE MESSAGES ====================
console.log('%c🏆 ELITEGRAM - Premium Social Experience', 'font-size: 22px; color: #d4af37; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);');
console.log('%c✨ Version 3.0 | Glassmorphism + Advanced Animations', 'font-size: 13px; color: #405de6; font-weight: bold;');
console.log('%c🎯 Keyboard Shortcuts:', 'font-size: 12px; color: #d4af37; font-weight: bold;');
console.log('%cCtrl/Cmd + K: Search | Esc: Close Modals | Ctrl/Cmd + Shift + D: Dark Mode | Double-Click: Like', 'font-size: 11px; color: #666;');