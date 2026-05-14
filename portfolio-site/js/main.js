/**
 * 包豪斯风格个人作品集网站 - 主脚本
 * Bauhaus Portfolio Website - Main Script
 */

/**
 * 详情页视频播放器控制
 */
function initDetailVideoPlayer() {
    const players = document.querySelectorAll('.detail-video-player');
    if (players.length === 0) return;

    players.forEach(player => {
        const video = player.querySelector('video');
        const playBtn = player.querySelector('.detail-play-btn');
        const ctrlPlayBtn = player.querySelector('.ctrl-play-btn');
        const progressBar = player.querySelector('.ctrl-progress-bar');
        const progressWrap = player.querySelector('.ctrl-progress');
        const timeDisplay = player.querySelector('.ctrl-time');
        const fullscreenBtn = player.querySelector('.ctrl-fullscreen');

        if (!video) return;

        // 格式化时间
        function formatTime(seconds) {
            if (isNaN(seconds)) return '0:00';
            const m = Math.floor(seconds / 60);
            const s = Math.floor(seconds % 60);
            return m + ':' + (s < 10 ? '0' : '') + s;
        }

        // 更新播放/暂停图标
        function updatePlayIcon(isPlaying) {
            if (ctrlPlayBtn) {
                ctrlPlayBtn.innerHTML = isPlaying
                    ? '<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>'
                    : '<svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>';
            }
        }

        // 播放/暂停
        function togglePlay() {
            if (video.paused) {
                video.play();
                player.classList.add('is-playing');
                playBtn && playBtn.classList.add('playing');
                updatePlayIcon(true);
            } else {
                video.pause();
                player.classList.remove('is-playing');
                playBtn && playBtn.classList.remove('playing');
                updatePlayIcon(false);
            }
        }

        // 大播放按钮点击
        if (playBtn) {
            playBtn.addEventListener('click', togglePlay);
        }

        // 控制条播放按钮
        if (ctrlPlayBtn) {
            ctrlPlayBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                togglePlay();
            });
        }

        // 点击视频区域播放/暂停
        player.addEventListener('click', (e) => {
            if (e.target.closest('.ctrl-play-btn') || e.target.closest('.ctrl-progress') || e.target.closest('.ctrl-fullscreen')) return;
            togglePlay();
        });

        // 进度条更新
        video.addEventListener('timeupdate', () => {
            if (progressBar && video.duration) {
                const pct = (video.currentTime / video.duration) * 100;
                progressBar.style.width = pct + '%';
            }
            if (timeDisplay) {
                timeDisplay.textContent = formatTime(video.currentTime) + ' / ' + formatTime(video.duration);
            }
        });

        // 进度条点击跳转
        if (progressWrap) {
            progressWrap.addEventListener('click', (e) => {
                e.stopPropagation();
                const rect = progressWrap.getBoundingClientRect();
                const pct = (e.clientX - rect.left) / rect.width;
                if (video.duration) {
                    video.currentTime = pct * video.duration;
                }
            });
        }

        // 视频结束
        video.addEventListener('ended', () => {
            player.classList.remove('is-playing');
            playBtn && playBtn.classList.remove('playing');
            updatePlayIcon(false);
            video.currentTime = 0;
            if (progressBar) progressBar.style.width = '0%';
            if (timeDisplay) timeDisplay.textContent = '0:00 / ' + formatTime(video.duration);
        });

        // 全屏
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (player.requestFullscreen) {
                    player.requestFullscreen();
                } else if (player.webkitRequestFullscreen) {
                    player.webkitRequestFullscreen();
                } else if (player.msRequestFullscreen) {
                    player.msRequestFullscreen();
                }
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initNavigation();
    initScrollReveal();
    initRippleEffect();
    initSmoothScroll();
    initNavbarScroll();
    initActiveNavLink();
    initDetailVideoPlayer();
});

/**
 * 导航栏功能
 * 处理移动端菜单切换和导航交互
 */
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!navToggle || !navMenu) return;
    
    // 移动端菜单切换
    navToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // 切换菜单时禁用/启用页面滚动
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // 点击导航链接后关闭移动端菜单
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // 点击页面其他区域关闭菜单
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * 滚动显示动画
 * 元素进入视口时触发动画
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    if (revealElements.length === 0) return;
    
    // 创建 Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // 添加延迟以实现错开动画效果
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index * 100);
                
                // 动画完成后停止观察
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    revealElements.forEach(el => {
        observer.observe(el);
    });
    
    // 初始检查：页面加载时检查元素是否在视口内
    setTimeout(() => {
        revealElements.forEach((el, index) => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                setTimeout(() => {
                    el.classList.add('revealed');
                }, index * 100);
            }
        });
    }, 100);
}

/**
 * 点击波纹效果
 * 为可点击元素添加波纹动画
 */
function initRippleEffect() {
    const rippleElements = document.querySelectorAll('.ripple-effect, .btn, .work-card, .nav-link');
    
    rippleElements.forEach(element => {
        element.addEventListener('click', function(e) {
            // 创建波纹元素
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            // 计算波纹位置和大小
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            // 设置波纹样式
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            // 添加波纹到元素
            this.appendChild(ripple);
            
            // 动画完成后移除波纹
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

/**
 * 平滑滚动
 * 为锚点链接添加平滑滚动效果
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // 跳过空链接
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // 计算目标位置（考虑导航栏高度）
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                // 执行平滑滚动
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * 导航栏滚动效果
 * 滚动时添加阴影和样式变化
 */
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    
    if (!navbar) return;
    
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateNavbar() {
        const currentScrollY = window.scrollY;
        
        // 滚动超过50px时添加scrolled类
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }, { passive: true });
    
    // 初始检查
    updateNavbar();
}

/**
 * 激活状态导航链接
 * 根据当前滚动位置高亮对应的导航链接
 */
function initActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    let ticking = false;
    
    function updateActiveLink() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
        
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateActiveLink);
            ticking = true;
        }
    }, { passive: true });
}

/**
 * 作品卡片点击效果增强
 * 添加额外的交互反馈
 */
document.querySelectorAll('.work-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

/**
 * 几何图形悬浮动画
 * 首页几何图形的交互效果
 */
const geometricComposition = document.querySelector('.geometric-composition');
if (geometricComposition) {
    geometricComposition.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        const geoRect = this.querySelector('.geo-rect');
        const geoSquare = this.querySelector('.geo-square');
        const geoLine = this.querySelector('.geo-line');
        
        if (geoRect) {
            geoRect.style.transform = `translate(calc(-50% + ${x * 10}px), calc(-50% + ${y * 10}px)) rotate(${x * 5}deg)`;
        }
        if (geoSquare) {
            geoSquare.style.transform = `translate(${x * 15}px, ${y * 15}px)`;
        }
        if (geoLine) {
            geoLine.style.transform = `translateX(${x * 20}px)`;
        }
    });
    
    geometricComposition.addEventListener('mouseleave', function() {
        const geoRect = this.querySelector('.geo-rect');
        const geoSquare = this.querySelector('.geo-square');
        const geoLine = this.querySelector('.geo-line');
        
        if (geoRect) {
            geoRect.style.transform = 'translate(-50%, -50%)';
        }
        if (geoSquare) {
            geoSquare.style.transform = 'translate(0, 0)';
        }
        if (geoLine) {
            geoLine.style.transform = 'translateX(0)';
        }
    });
}

/**
 * 按钮点击音效（可选）
 * 为按钮添加轻微的点击反馈
 */
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        // 添加按压效果
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
});

/**
 * 图片懒加载
 * 优化页面性能
 */
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

/**
 * 键盘导航支持
 * 提升可访问性
 */
document.addEventListener('keydown', function(e) {
    // ESC键关闭移动端菜单
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.getElementById('navToggle');
        
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

/**
 * 页面加载完成后的初始化
 */
window.addEventListener('load', function() {
    // 添加页面加载完成类
    document.body.classList.add('page-loaded');
    
    // 触发一次滚动检查
    setTimeout(() => {
        const event = new Event('scroll');
        window.dispatchEvent(event);
    }, 100);
});
