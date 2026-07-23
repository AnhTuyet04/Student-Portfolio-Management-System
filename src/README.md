# Frontend structure

Tai lieu chu thich tong quan cho toan bo src.

## 1) Kien truc tong the

- core/: lop nen tang cua ung dung
: api (request/response/token/error), store, config.
- shared/: thanh phan dung chung
: components, constants, layouts, permissions, helpers.
- modules/: logic theo tung domain nghiep vu
: auth, home, dashboard, error, student.
- router/: hash-based SPA router va route registry.
- utils/: tien ich dung chung (event bus, debounce).

## 2) Quy uoc shim/bridge

Mot so file trong src chi lam nhiem vu re-export de tuong thich duong dan import cu.
Vi du:

- src/api/* -> re-export tu core/api/*
- src/config/* -> re-export tu core/config/*
- src/store/* -> re-export tu core/store/*
- src/components|constants|helpers|layouts|permissions -> bridge sang shared/*

Muc tieu:

- Khong lam vo import cu trong code da ton tai.
- Cho phep tai cau truc code theo core/shared/modules ma van an toan.

## 3) Noi nen dat logic moi

- API/Auth/Store/Config: dat trong core.
- UI dung chung: dat trong shared/components.
- Permission/Role/Menu: dat trong shared/constants va shared/permissions.
- Tinh nang nghiep vu: dat trong modules/<feature>.

## 4) Ghi chu cho nguoi maintain

- Neu tao file moi, uu tien import truc tiep tu core/shared thay vi tao them shim.
- Chi giu shim khi can giu backward compatibility.
- Khi xoa shim, can grep toan du an de dam bao khong con import cu.
