document.addEventListener('DOMContentLoaded', function() {
    const mainNav = document.getElementById('main-nav');
    const menuToggleBtn = document.getElementById('menu-toggle-btn');

    // Hàm hiển thị thời gian hiện tại
    function updateDateTime() {
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false // Sử dụng định dạng 24 giờ
        };
        const dateTimeString = now.toLocaleDateString('vi-VN', options) + ' | ' + now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
        document.getElementById('current-datetime').textContent = dateTimeString.charAt(0).toUpperCase() + dateTimeString.slice(1);
    }

    // Cập nhật thời gian ngay lập tức và sau mỗi phút
    updateDateTime();
    setInterval(updateDateTime, 60000); // Cập nhật mỗi phút


    // Xử lý menu responsive
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


    // Hàm quản lý hiển thị các tab và sub-tab
    function showTab(tabId) {
        console.log('showTab called with ID:', tabId);

        // Ẩn tất cả các phần tab chính và loại bỏ 'active'
        document.querySelectorAll('.tab-section').forEach(content => {
            content.classList.add('hidden');
            content.classList.remove('active');
        });

        // Bỏ kích hoạt tất cả các link điều hướng chính và submenu links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelectorAll('.submenu-link').forEach(link => {
            link.classList.remove('active');
        });

        // Ẩn tất cả nội dung sub-tab của nhóm 'home-sub-tabs' và bỏ kích hoạt link của chúng
        document.querySelectorAll('[data-tab-group="home-sub-tabs"]').forEach(content => {
            content.classList.add('hidden');
            content.classList.remove('active');
        });
        document.querySelectorAll('.sub-tab-link').forEach(link => {
            link.classList.remove('active');
        });

        // Đảm bảo sub-tab navigation (chứa "Tin tức hoạt động" và "Hướng dẫn thăm gặp") bị ẩn ban đầu
        // Nó sẽ được hiển thị lại nếu tabId là 'home' hoặc thuộc về nhóm 'home'
        document.querySelector('#home .sub-tab-navigation')?.classList.add('hidden');


        let targetTabElement = document.getElementById(tabId);
        if (!targetTabElement) {
            console.error('Target tab element not found for ID:', tabId);
            return;
        }

        // Logic hiển thị tab/sub-tab/news-detail
        if (tabId.startsWith('news-')) { // Ví dụ: news-huan-luyen, news-dich-benh, news-an-ninh
            document.getElementById('home')?.classList.remove('hidden');
            document.getElementById('home')?.classList.add('active');

            // Ẩn tab 'home-news' (danh sách tin tức) để chỉ hiển thị bài viết chi tiết
            document.getElementById('home-news')?.classList.add('hidden');
            document.getElementById('home-news')?.classList.remove('active');

            // Hiển thị bài viết chi tiết cụ thể
            targetTabElement.classList.remove('hidden');
            targetTabElement.classList.add('active');

            // Kích hoạt link "Home" trên thanh điều hướng chính
            document.querySelector('.nav-link[data-tab-id="home"]')?.classList.add('active');
            // Kích hoạt link "Tin tức hoạt động" trong sub-tab navigation (vì đây là nguồn chi tiết)
            document.querySelector('.sub-tab-link[data-tab-id="home-news"]')?.classList.add('active');

        } else if (targetTabElement.dataset.tabGroup === 'home-sub-tabs') {
            // Nếu là sub-tab của nhóm 'home' (VD: home-news, huong-dan-tham-gap)
            document.getElementById('home')?.classList.remove('hidden');
            document.getElementById('home')?.classList.add('active');

            // Hiển thị sub-tab navigation
            document.querySelector('#home .sub-tab-navigation')?.classList.remove('hidden');

            targetTabElement.classList.remove('hidden');
            targetTabElement.classList.add('active');

            // Kích hoạt link "Home" trên thanh điều hướng chính
            document.querySelector('.nav-link[data-tab-id="home"]')?.classList.add('active');
            // Kích hoạt link sub-tab cụ thể
            document.querySelector(`.sub-tab-link[data-tab-id="${tabId}"]`)?.classList.add('active');

        } else {
            // Nếu là một tab chính hoặc submenu link (VD: home, about, mission, history, etc.)
            targetTabElement.classList.remove('hidden');
            targetTabElement.classList.add('active');

            // Kích hoạt link điều hướng chính hoặc submenu tương ứng
            const activeLink = document.querySelector(`.nav-link[data-tab-id="${tabId}"], .submenu-link[data-tab-id="${tabId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
                // Nếu là submenu-link, cũng kích hoạt parent-link của nó
                const parentNavListItem = activeLink.closest('.nav-item.has-submenu');
                if (parentNavListItem) {
                    parentNavListItem.querySelector('.parent-link')?.classList.add('active');
                }
            }

            // ĐẶC BIỆT XỬ LÝ KHI CHỌN TAB 'HOME'
            if (tabId === 'home') {
                // Đảm bảo sub-tab navigation (chứa "Tin tức hoạt động" và "Hướng dẫn thăm gặp") hiển thị
                document.querySelector('#home .sub-tab-navigation')?.classList.remove('hidden');

                // Mặc định hiển thị 'home-news' sub-tab
                document.getElementById('home-news')?.classList.remove('hidden');
                document.getElementById('home-news')?.classList.add('active');
                document.querySelector('.sub-tab-link[data-tab-id="home-news"]')?.classList.add('active');
            }
        }

        // Đóng menu di động nếu đang mở
        if (mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            menuToggleBtn.querySelector('i').classList.remove('fa-times');
            menuToggleBtn.querySelector('i').classList.add('fa-bars');
        }

        // Đóng bất kỳ submenu nào đang mở (đối với dropdown desktop)
        document.querySelectorAll('.nav-item.has-submenu.open').forEach(item => {
            item.classList.remove('open');
        });
    }


    // GÁN SỰ KIỆN CLICK CHO TẤT CẢ CÁC LOẠI LINK CHUYỂN TAB

    // 1. Gán sự kiện click cho các link điều hướng chính KHÔNG CÓ SUBMENU (Home, Liên hệ)
    document.querySelectorAll('.nav-link:not(.parent-link)').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.dataset.tabId;
            showTab(tabId);
        });
    });

    // 2. Gán sự kiện click cho các link trong SUBMENU (Giới thiệu chung, Chức năng - Nhiệm vụ, Lãnh đạo qua các thời kỳ, Lãnh đạo hiện nay, Các Đội công tác con)
    document.querySelectorAll('.submenu-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.dataset.tabId;
            showTab(tabId);
        });
    });

    // 3. Gán sự kiện click cho các sub-tab (Tin tức hoạt động, Hướng dẫn thăm gặp)
    document.querySelectorAll('.sub-tab-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.dataset.tabId;
            showTab(tabId);
        });
    });

    // 4. Gán sự kiện click cho các link "Đọc thêm" và tiêu đề tin tức trong news-card
    document.querySelectorAll('.news-card .read-more, .news-card .news-title a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.dataset.tabId;
            showTab(tabId);
        });
    });


    // Xử lý submenu dropdown trên desktop (links có class parent-link)
    document.querySelectorAll('.nav-item.has-submenu > .parent-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Ngăn chặn hành vi mặc định của link cha
            const parentItem = this.closest('.has-submenu');

            // Đóng tất cả các submenu khác
            document.querySelectorAll('.nav-item.has-submenu.open').forEach(item => {
                if (item !== parentItem) {
                    item.classList.remove('open');
                }
            });
            // Mở/đóng submenu hiện tại
            parentItem.classList.toggle('open');
        });
    });

    // Đóng submenu khi click ra ngoài
    document.addEventListener('click', function(e) {
        // Đảm bảo click không phải là trên nav-item.has-submenu hoặc nút menu-toggle
        if (!e.target.closest('.nav-item.has-submenu') && !e.target.closest('#menu-toggle-btn')) {
            document.querySelectorAll('.nav-item.has-submenu.open').forEach(item => {
                item.classList.remove('open');
            });
        }
    });

    // Xử lý khi trang được tải lần đầu
    // Kiểm tra hash trong URL để hiển thị tab tương ứng
    const initialHash = window.location.hash.substring(1); // Lấy ID từ hash (bỏ dấu #)
    if (initialHash) {
        showTab(initialHash);
    } else {
        // Mặc định hiển thị tab home và sub-tab home-news
        showTab('home');
    }
});