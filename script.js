document.addEventListener('DOMContentLoaded', function() {
    const mainNav = document.getElementById('main-nav');
    const menuToggleBtn = document.getElementById('menu-toggle-btn');

   // Hàm hiển thị thời gian hiện tại
function updateDateTime() {
    const now = new Date();
    const options = {
        weekday: 'long', // Hiển thị tên ngày trong tuần (ví dụ: Thứ Ba)
        day: 'numeric',   // Ngày (ví dụ: 24)
        month: 'numeric', // Tháng (ví dụ: 6)
        year: 'numeric',  // Năm (ví dụ: 2025)
        hour: '2-digit',  // Giờ (2 chữ số)
        minute: '2-digit',// Phút (2 chữ số)
        hour12: false     // Dùng định dạng 24 giờ
    };

    // Định dạng chuỗi ngày giờ đầy đủ
    let dateTimeString = now.toLocaleDateString('vi-VN', options);

    // Chuyển đổi ký tự đầu tiên của ngày trong tuần thành chữ hoa nếu cần
    // Ví dụ: "thứ ba, 24/6/2025, 15:37" -> "Thứ ba, 24/6/2025, 15:37"
    if (dateTimeString.length > 0) {
        dateTimeString = dateTimeString.charAt(0).toUpperCase() + dateTimeString.slice(1);
    }
    
    // Tìm phần tử hiển thị và cập nhật nội dung
    const currentDateTimeElement = document.getElementById('current-datetime');
    if (currentDateTimeElement) {
        currentDateTimeElement.textContent = dateTimeString;
    }
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
// ... (các hàm hiện có của bạn, ví dụ: updateDateTime, showSubTab) ...

// Hàm chính để hiển thị tab
function showTab(tabId) {
    // Ẩn tất cả các tab
    document.querySelectorAll('.tab-section').forEach(section => {
        section.classList.add('hidden');
    });

    // Hiển thị tab được chọn
    const activeTab = document.getElementById(tabId);
    if (activeTab) {
        activeTab.classList.remove('hidden');
    }

    // Cập nhật trạng thái active cho menu link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelectorAll('.submenu-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelectorAll('.sidebar-link').forEach(link => { // Thêm sidebar links
        link.classList.remove('active');
    });

    // Thêm class 'active' cho link được nhấp
    const clickedNavLink = document.querySelector(`.nav-link[data-tab-id="${tabId}"]`);
    if (clickedNavLink) {
        clickedNavLink.classList.add('active');
    }
    const clickedSubmenuLink = document.querySelector(`.submenu-link[data-tab-id="${tabId}"]`);
    if (clickedSubmenuLink) {
        clickedSubmenuLink.classList.add('active');
        // Kích hoạt luôn parent link nếu là sub-tab
        const parentLink = clickedSubmenuLink.closest('.nav-item.has-submenu')?.querySelector('.parent-link');
        if (parentLink) {
            parentLink.classList.add('active');
        }
    }
    const clickedSidebarLink = document.querySelector(`.sidebar-link[data-tab-id="${tabId}"]`); // Kích hoạt sidebar link
    if (clickedSidebarLink) {
        clickedSidebarLink.classList.add('active');
    }

    // Nếu là trang chủ, đảm bảo sub-tab Tin tức hoạt động được hiển thị
    if (tabId === 'home') {
        showSubTab('home-news', 'home-sub-tabs');
    }
}

// Xử lý sự kiện click cho các liên kết trong sidebar
document.querySelectorAll('.sidebar-link, .view-all-announcements, .service-highlight .btn').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const tabId = this.dataset.tabId;
        if (tabId) {
            showTab(tabId);
            // Cuộn lên đầu trang khi chuyển tab từ sidebar
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        // Đóng menu di động nếu đang mở
        const mainNav = document.getElementById('main-nav');
        if (mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
        }
        // Đóng submenu nếu có
        document.querySelectorAll('.nav-item.has-submenu').forEach(item => {
            item.classList.remove('active-submenu');
            if (window.innerWidth > 768) { // Đảm bảo ẩn submenu desktop
                item.querySelector('.submenu').style.display = 'none';
            }
        });
    });
});

// ... (các sự kiện click cho nav-link, sub-tab-link, news-card, menu toggle giữ nguyên hoặc đã được sửa ở câu trả lời trước) ...

// Hiển thị tab "Trang chủ" và "Tin tức hoạt động" khi tải trang lần đầu
document.addEventListener('DOMContentLoaded', () => {
    showTab('home');
    showSubTab('home-news', 'home-sub-tabs'); // Đảm bảo sub-tab "Tin tức hoạt động" hiển thị mặc định
    
    // ... (logic updateDateTime và menuToggleBtn hiện có của bạn) ...
});
// Đảm bảo rằng hàm này nằm ở phạm vi toàn cục hoặc được gọi sau khi DOM đã tải hoàn chỉnh.
// Cách tốt nhất là đặt nó trong một hàm khởi tạo hoặc lắng nghe sự kiện DOMContentLoaded.

document.addEventListener('DOMContentLoaded', function() {
    // Định nghĩa hàm showSubTab
    function showSubTab(tabId, tabGroup) {
        // Ẩn tất cả các tab content trong cùng một nhóm
        document.querySelectorAll(`.sub-tab-content[data-tab-group="${tabGroup}"]`).forEach(content => {
            content.classList.remove('active');
            content.classList.add('hidden');
        });

        // Xóa lớp 'active' khỏi tất cả các tab link trong cùng một nhóm
        document.querySelectorAll(`.sub-tab-link[data-tab-group="${tabGroup}"]`).forEach(link => {
            link.classList.remove('active');
        });

        // Hiển thị tab content được chọn
        const activeContent = document.getElementById(tabId);
        if (activeContent) {
            activeContent.classList.add('active');
            activeContent.classList.remove('hidden');
        }

        // Đánh dấu tab link được chọn là 'active'
        const activeLink = document.querySelector(`.sub-tab-link[data-tab-id="${tabId}"][data-tab-group="${tabGroup}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Ghi log để kiểm tra (có thể xóa sau khi sửa lỗi)
        console.log("showSubTab called with ID:", tabId);
    }

    // Lắng nghe sự kiện click cho các tab con
    document.querySelectorAll('.sub-tab-link').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ 'a'
            const tabId = this.getAttribute('data-tab-id');
            const tabGroup = this.getAttribute('data-tab-group');
            showSubTab(tabId, tabGroup);
        });
    });

    // Lắng nghe sự kiện click cho các tab chính (nếu có)
    document.querySelectorAll('.tab-link').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const tabId = this.getAttribute('data-tab-id');
            showTab(tabId); // Giả định bạn đã có hàm showTab cho các tab chính
        });
    });

    // Định nghĩa hàm showTab cho các tab chính (nếu chưa có)
    function showTab(tabId) {
        // Ẩn tất cả các section chính
        document.querySelectorAll('.tab-section').forEach(section => {
            section.classList.remove('active');
            section.classList.add('hidden');
        });

        // Xóa lớp 'active' khỏi tất cả các tab link chính
        document.querySelectorAll('.tab-navigation .nav-item .nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Hiển thị section được chọn
        const activeSection = document.getElementById(tabId);
        if (activeSection) {
            activeSection.classList.add('active');
            activeSection.classList.remove('hidden');
        }

        // Đánh dấu tab link chính được chọn là 'active'
        const activeLink = document.querySelector(`.tab-navigation .nav-item .nav-link[data-tab-id="${tabId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        console.log("showTab called with ID:", tabId);
    }

    // Xử lý khi tải trang lần đầu để hiển thị tab mặc định
    // Kiểm tra hash trong URL để hiển thị tab chính xác
    const initialHash = window.location.hash.substring(1);
    if (initialHash) {
        // Cố gắng hiển thị như một sub-tab trước
        let foundSubTab = false;
        document.querySelectorAll('.sub-tab-content').forEach(subTab => {
            if (subTab.id === initialHash) {
                const tabGroup = subTab.getAttribute('data-tab-group');
                showSubTab(initialHash, tabGroup);
                foundSubTab = true;
            }
        });

        // Nếu không phải sub-tab, thử hiển thị như một tab chính
        if (!foundSubTab) {
            document.querySelectorAll('.tab-section').forEach(mainTab => {
                if (mainTab.id === initialHash) {
                    showTab(initialHash);
                }
            });
        }
    } else {
        // Mặc định hiển thị tab home và sub-tab home-news
        showTab('home');
        showSubTab('home-news', 'home-sub-tabs');
    }
});
document.addEventListener('DOMContentLoaded', function() {
    // Định nghĩa hàm showTab cho các tab chính
    function showTab(tabId) {
        // Xóa lớp 'active' khỏi tất cả các tab content chính và ẩn chúng
        document.querySelectorAll('.main-content-container section').forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none'; // Hoặc thêm lớp 'hidden' tùy vào CSS của bạn
        });

        // Xóa lớp 'active' khỏi tất cả các tab link chính
        document.querySelectorAll('.main-nav .nav-item .nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Hiển thị tab content được chọn và thêm lớp 'active' cho nó
        const activeSection = document.getElementById(tabId);
        if (activeSection) {
            activeSection.classList.add('active');
            activeSection.style.display = 'block'; // Hoặc xóa lớp 'hidden'
        }

        // Đánh dấu tab link chính được chọn là 'active'
        const activeLink = document.querySelector(`.main-nav .nav-item .nav-link[data-tab-id="${tabId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        console.log("showTab called with ID:", tabId);
    }

    // Định nghĩa hàm showSubTab cho các tab con (sidebar links)
    function showSubTab(tabId) {
        // Ẩn tất cả các sub-tab content trong cùng section home
        document.querySelectorAll('#home .sub-tab-content').forEach(content => {
            content.classList.remove('active');
            content.style.display = 'none';
        });

        // Xóa lớp 'active' khỏi tất cả các sidebar link
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.classList.remove('active');
        });

        // Hiển thị sub-tab content được chọn
        const activeContent = document.getElementById(tabId);
        if (activeContent) {
            activeContent.classList.add('active');
            activeContent.style.display = 'block';
        }

        // Đánh dấu sub-tab link được chọn là 'active'
        const activeLink = document.querySelector(`.sidebar-link[data-tab-id="${tabId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        console.log("showSubTab called with ID:", tabId);
    }

    // Lắng nghe sự kiện click cho các tab chính
    document.querySelectorAll('.main-nav .nav-item .nav-link').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ 'a'
            const tabId = this.getAttribute('data-tab-id');
            showTab(tabId);
        });
    });

    // Lắng nghe sự kiện click cho các tab con trong sidebar
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ 'a'
            const tabId = this.getAttribute('data-tab-id');
            showSubTab(tabId);
        });
    });

    // Xử lý khi tải trang lần đầu để hiển thị tab mặc định
    const initialHash = window.location.hash.substring(1);
    if (initialHash) {
        // Kiểm tra xem đây có phải là một sub-tab (sidebar link) hay không
        const isSubTab = document.querySelector(`.sidebar-link[data-tab-id="${initialHash}"]`);
        if (isSubTab) {
            showSubTab(initialHash);
            // Đảm bảo tab chính chứa sub-tab này cũng được hiển thị (nếu cần)
            const mainTabId = isSubTab.closest('section[id]').id; // Lấy ID của section cha
            if (mainTabId) {
                showTab(mainTabId);
            }
        } else {
            // Nếu không phải sub-tab, thử hiển thị như một tab chính
            showTab(initialHash);
        }
    } else {
        // Mặc định hiển thị tab 'home' và sub-tab 'home-news' (hoặc 'tin-tuc' tùy theo ID thực tế)
        showTab('home');
        showSubTab('home-news'); // Đảm bảo ID này khớp với data-tab-id trong HTML của bạn
    }
});
