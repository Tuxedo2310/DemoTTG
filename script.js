document.addEventListener('DOMContentLoaded', function() {
    // Cập nhật ngày giờ
    function updateDateTime() {
        const now = new Date();
        const options = {
            weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: false
        };
        let dateTimeString = now.toLocaleDateString('vi-VN', options);
        if (dateTimeString.length > 0)
            dateTimeString = dateTimeString.charAt(0).toUpperCase() + dateTimeString.slice(1);
        const currentDateTimeElement = document.getElementById('current-datetime');
        if (currentDateTimeElement) currentDateTimeElement.textContent = dateTimeString;
    }
    updateDateTime(); setInterval(updateDateTime, 60000);

    // Responsive menu toggle
    const mainNav = document.getElementById('main-nav');
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    if (menuToggleBtn) {
        menuToggleBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            const icon = this.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Hàm showTab (hỗ trợ mở lại menu cha khi cần)
    function showTab(tabId) {
        // 1. Ẩn tất cả tab-section
        document.querySelectorAll('.tab-section').forEach(section => {
            section.classList.add('hidden');
            section.classList.remove('active');
        });

        // 2. Xóa trạng thái active của tất cả nav-link, submenu-link, sub-tab-link, sidebar-link
        document.querySelectorAll('.nav-link, .submenu-link, .sub-tab-link, .sidebar-link, .sub-submenu-link').forEach(link => {
            link.classList.remove('active');
        });

        // 3. Đóng mọi submenu menu cha
        document.querySelectorAll('.nav-item.has-submenu').forEach(item => item.classList.remove('open'));
        // Đóng sub-submenu nếu có
        document.querySelectorAll('.submenu-item.has-submenu-level2').forEach(item => item.classList.remove('open'));

        // 4. Xử lý sub-tab trong trang home (KHÔNG xử lý cho huong-dan-tham-gap là section riêng)
        if (tabId === 'home' || tabId === 'home-news' || tabId === 'noi-quy-co-so-giam-giu') {
    document.getElementById('home').classList.remove('hidden');
    document.getElementById('home').classList.add('active');
    document.querySelector('#home .sub-tab-navigation')?.classList.remove('hidden');
    // Hiện đúng sub-tab
    let subTabId = tabId === 'home' ? 'home-news' : tabId;
    document.querySelectorAll('#home .sub-tab-content').forEach(subContent => {
        subContent.classList.add('hidden');
        subContent.classList.remove('active');
    });
    document.getElementById(subTabId)?.classList.remove('hidden');
    document.getElementById(subTabId)?.classList.add('active');
    document.querySelector(`.sub-tab-link[data-tab-id="${subTabId}"]`)?.classList.add('active');
    document.querySelector('.nav-link[data-tab-id="home"]')?.classList.add('active');
    document.querySelector(`.sidebar-link[data-tab-id="${tabId}"]`)?.classList.add('active');
}
        // 5. Nếu là bài news chi tiết
        else if (tabId.startsWith('news-')) {
            document.getElementById('home').classList.remove('hidden');
            document.getElementById('home').classList.add('active');
            document.getElementById('home-news')?.classList.add('hidden');
            document.getElementById('home-news')?.classList.remove('active');
            document.getElementById(tabId)?.classList.remove('hidden');
            document.getElementById(tabId)?.classList.add('active');
            document.querySelector('.nav-link[data-tab-id="home"]')?.classList.add('active');
            document.querySelector('.sub-tab-link[data-tab-id="home-news"]')?.classList.add('active');
        }
        // 6. Các tab thông thường khác (bao gồm huong-dan-tham-gap, mission, history, ...)
        else {
            document.getElementById(tabId)?.classList.remove('hidden');
            document.getElementById(tabId)?.classList.add('active');
            let activeLink =
                document.querySelector(`.nav-link[data-tab-id="${tabId}"]`) ||
                document.querySelector(`.submenu-link[data-tab-id="${tabId}"]`) ||
                document.querySelector(`.sub-submenu-link[data-tab-id="${tabId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
                if (activeLink.classList.contains('submenu-link')) {
                    const parentNav = activeLink.closest('.nav-item.has-submenu');
                    if (parentNav) {
                        parentNav.classList.add('open');
                        parentNav.querySelector('.parent-link')?.classList.add('active');
                    }
                }
                if (activeLink.classList.contains('sub-submenu-link')) {
                    const sub2 = activeLink.closest('.submenu-item.has-submenu-level2');
                    if (sub2) {
                        sub2.classList.add('open');
                        sub2.querySelector('.parent-link-level2')?.classList.add('active');
                        const parentNav = sub2.closest('.nav-item.has-submenu');
                        if (parentNav) {
                            parentNav.classList.add('open');
                            parentNav.querySelector('.parent-link')?.classList.add('active');
                        }
                    }
                }
            }
            document.querySelector(`.sidebar-link[data-tab-id="${tabId}"]`)?.classList.add('active');
        }
        

        // Đóng menu mobile khi chuyển tab
        if (mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            menuToggleBtn.querySelector('i').classList.remove('fa-times');
            menuToggleBtn.querySelector('i').classList.add('fa-bars');
        }
    }

    // Gán click cho nav-link, submenu-link, sub-tab-link, sidebar-link, news-card .read-more, sub-submenu-link
    document.querySelectorAll(
        '.nav-link:not(.parent-link), .submenu-link, .sub-tab-link, .sidebar-link, .news-card .read-more, .news-card .news-title a, .sub-submenu-link'
    ).forEach(link => {
        link.addEventListener('click', function(e) {
            const tabId = this.dataset.tabId;
            // Chỉ preventDefault và showTab nếu tabId là section nội bộ
            if (tabId && document.getElementById(tabId)) {
                e.preventDefault();
                showTab(tabId);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            // Nếu là link ngoài (vd: Xem bản đồ) thì để mặc định cho trình duyệt xử lý
        });
    });

    // Xử lý menu dropdown cha cấp 1 (.parent-link)
    document.querySelectorAll('.nav-item.has-submenu > .parent-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const parentItem = this.closest('.has-submenu');
            document.querySelectorAll('.nav-item.has-submenu.open').forEach(item => {
                if (item !== parentItem) item.classList.remove('open');
            });
            parentItem.classList.toggle('open');
        });
    });

    // Xử lý menu dropdown cấp 2 nếu có (.parent-link-level2)
    document.querySelectorAll('.submenu-item.has-submenu-level2 > .parent-link-level2').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const parentItem = this.closest('.submenu-item.has-submenu-level2');
            document.querySelectorAll('.submenu-item.has-submenu-level2.open').forEach(item => {
                if (item !== parentItem) item.classList.remove('open');
            });
            parentItem.classList.toggle('open');
        });
    });

    // Đóng submenu nếu click ra ngoài
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-item.has-submenu') && !e.target.closest('#menu-toggle-btn')) {
            document.querySelectorAll('.nav-item.has-submenu.open').forEach(item => {
                item.classList.remove('open');
            });
        }
    });

    // Xử lý tab mặc định khi vào trang hoặc theo hash trên URL
    const initialHash = window.location.hash.substring(1);
    if (initialHash) {
        showTab(initialHash);
    } else {
        showTab('home');
    }
});

// Mở/đóng submenu cấp 1 (menu cha) trên mobile
document.querySelectorAll('.has-submenu > .nav-link').forEach(function(link){
    link.addEventListener('click', function(e){
        if(window.innerWidth <= 768) {
            e.preventDefault();
            this.parentElement.classList.toggle('open');
        }
    });
});

// Mở/đóng submenu cấp 2 trên mobile
document.querySelectorAll('.has-submenu-level2 > a').forEach(function(link){
    link.addEventListener('click', function(e){
        if(window.innerWidth <= 768) {
            e.preventDefault();
            this.parentElement.classList.toggle('open');
        }
    });
});
// Tự động đóng submenu khi di chuột ra khỏi menu cha trên desktop
document.querySelectorAll('.nav-item.has-submenu').forEach(function(item) {
    item.addEventListener('mouseleave', function() {
        if (window.innerWidth > 768) {
            item.classList.remove('open');
        }
    });
});
// Nếu có submenu cấp 2
document.querySelectorAll('.submenu-item.has-submenu-level2').forEach(function(item) {
    item.addEventListener('mouseleave', function() {
        if (window.innerWidth > 768) {
            item.classList.remove('open');
        }
    });
});
document.querySelectorAll('.back-to-news').forEach(function(btn) {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelectorAll('.tab-section').forEach(function(sec) {
      sec.classList.add('hidden');
      sec.classList.remove('active');
    });
    document.getElementById('home').classList.remove('hidden');
    document.getElementById('home').classList.add('active');
    document.getElementById('home-news').classList.remove('hidden');
    document.getElementById('home-news').classList.add('active');
    document.querySelectorAll('.sub-tab-link').forEach(function(link) {
      link.classList.remove('active');
      if (link.getAttribute('data-tab-id') === 'home-news') link.classList.add('active');
    });
    window.location.hash = "#home-news";
    document.getElementById('home-news').scrollIntoView({behavior: 'smooth'});
  });
});
