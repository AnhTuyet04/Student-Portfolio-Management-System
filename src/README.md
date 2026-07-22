# Frontend structure

Project đã được chuẩn hóa theo cấu trúc sau:

- core/: các thành phần nền tảng của app như API, store, config.
- shared/: các module dùng chung như components, constants, layouts, permissions, helpers.
- modules/: các feature module theo domain (auth, dashboard, home, error, ...).

Các file cũ vẫn được giữ lại như shim để đảm bảo import cũ không bị vỡ.
