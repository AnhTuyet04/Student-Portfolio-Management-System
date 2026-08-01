-- ============================================================
-- SPMS — Student Portfolio Management System
-- Database Schema — SQL Server (T-SQL)
-- Tương thích: SQL Server 2016+ / Azure SQL
-- Không bao gồm module Thư Viện
-- ============================================================

-- Tạo database nếu chưa có
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'SPMS')
    CREATE DATABASE SPMS
    COLLATE Vietnamese_CI_AS;
GO

USE SPMS;
GO

-- ============================================================
-- NHÓM 1: NGƯỜI DÙNG & PHÂN QUYỀN
-- ============================================================

CREATE TABLE [roles] (
    [id]          INT             NOT NULL IDENTITY(1,1),
    [key_name]    NVARCHAR(50)    NOT NULL,
    [label]       NVARCHAR(100)   NOT NULL,
    [description] NVARCHAR(MAX),
    [created_at]  DATETIME2       NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_roles       PRIMARY KEY ([id]),
    CONSTRAINT UQ_roles_key   UNIQUE      ([key_name])
);
GO

CREATE TABLE [users] (
    [id]            INT             NOT NULL IDENTITY(1,1),
    [username]      NVARCHAR(100)   NOT NULL,
    [email]         NVARCHAR(255)   NOT NULL,
    [password_hash] NVARCHAR(255)   NOT NULL,
    [role_id]       INT             NOT NULL,
    [full_name]     NVARCHAR(255)   NOT NULL,
    [avatar_url]    NVARCHAR(500),
    [is_active]     BIT             NOT NULL DEFAULT 1,
    [last_login_at] DATETIME2,
    [created_at]    DATETIME2       NOT NULL DEFAULT GETDATE(),
    [updated_at]    DATETIME2       NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_users        PRIMARY KEY ([id]),
    CONSTRAINT UQ_users_uname  UNIQUE      ([username]),
    CONSTRAINT UQ_users_email  UNIQUE      ([email]),
    CONSTRAINT FK_users_role   FOREIGN KEY ([role_id]) REFERENCES [roles]([id])
);
GO

CREATE TABLE [permissions] (
    [id]        INT             NOT NULL IDENTITY(1,1),
    [role_id]   INT             NOT NULL,
    [resource]  NVARCHAR(100)   NOT NULL,
    [action]    NVARCHAR(50)    NOT NULL,
    CONSTRAINT PK_permissions       PRIMARY KEY ([id]),
    CONSTRAINT UQ_perm_role_res_act UNIQUE      ([role_id], [resource], [action]),
    CONSTRAINT FK_perm_role         FOREIGN KEY ([role_id]) REFERENCES [roles]([id]) ON DELETE CASCADE
);
GO

-- ============================================================
-- NHÓM 2: TỔ CHỨC TRƯỜNG HỌC
-- ============================================================

CREATE TABLE [school_years] (
    [id]         INT             NOT NULL IDENTITY(1,1),
    [label]      NVARCHAR(20)    NOT NULL,
    [start_date] DATE            NOT NULL,
    [end_date]   DATE            NOT NULL,
    [is_current] BIT             NOT NULL DEFAULT 0,
    [created_at] DATETIME2       NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_school_years    PRIMARY KEY ([id]),
    CONSTRAINT UQ_school_year_lbl UNIQUE      ([label])
);
GO

CREATE TABLE [semesters] (
    [id]             INT             NOT NULL IDENTITY(1,1),
    [school_year_id] INT             NOT NULL,
    [name]           NVARCHAR(10)    NOT NULL,
    [start_date]     DATE            NOT NULL,
    [end_date]       DATE            NOT NULL,
    CONSTRAINT PK_semesters        PRIMARY KEY ([id]),
    CONSTRAINT UQ_sem_year_name    UNIQUE      ([school_year_id], [name]),
    CONSTRAINT FK_sem_year         FOREIGN KEY ([school_year_id]) REFERENCES [school_years]([id]) ON DELETE CASCADE
);
GO

CREATE TABLE [subjects] (
    [id]          INT             NOT NULL IDENTITY(1,1),
    [name]        NVARCHAR(150)   NOT NULL,
    [code]        NVARCHAR(30)    NOT NULL,
    [grade_level] TINYINT,
    [description] NVARCHAR(MAX),
    CONSTRAINT PK_subjects      PRIMARY KEY ([id]),
    CONSTRAINT UQ_subject_code  UNIQUE      ([code])
);
GO

CREATE TABLE [classes] (
    [id]                  INT             NOT NULL IDENTITY(1,1),
    [name]                NVARCHAR(20)    NOT NULL,
    [grade_level]         TINYINT         NOT NULL,
    [school_year_id]      INT             NOT NULL,
    [homeroom_teacher_id] INT,
    [max_students]        TINYINT         NOT NULL DEFAULT 40,
    [created_at]          DATETIME2       NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_classes          PRIMARY KEY ([id]),
    CONSTRAINT UQ_class_year       UNIQUE      ([name], [school_year_id]),
    CONSTRAINT FK_class_year       FOREIGN KEY ([school_year_id])      REFERENCES [school_years]([id]),
    CONSTRAINT FK_class_teacher    FOREIGN KEY ([homeroom_teacher_id]) REFERENCES [users]([id]) ON DELETE SET NULL
);
GO

CREATE TABLE [class_subjects] (
    [id]          INT     NOT NULL IDENTITY(1,1),
    [class_id]    INT     NOT NULL,
    [subject_id]  INT     NOT NULL,
    [teacher_id]  INT     NOT NULL,
    [semester_id] INT     NOT NULL,
    CONSTRAINT PK_class_subjects         PRIMARY KEY ([id]),
    CONSTRAINT UQ_class_subject_semester UNIQUE      ([class_id], [subject_id], [semester_id]),
    CONSTRAINT FK_cs_class               FOREIGN KEY ([class_id])   REFERENCES [classes]  ([id]) ON DELETE CASCADE,
    CONSTRAINT FK_cs_subject             FOREIGN KEY ([subject_id]) REFERENCES [subjects] ([id]),
    CONSTRAINT FK_cs_teacher             FOREIGN KEY ([teacher_id]) REFERENCES [users]    ([id]),
    CONSTRAINT FK_cs_semester            FOREIGN KEY ([semester_id]) REFERENCES [semesters]([id])
);
GO

-- ============================================================
-- NHÓM 3: HỌC SINH
-- ============================================================

CREATE TABLE [students] (
    [id]              INT             NOT NULL IDENTITY(1,1),
    [user_id]         INT             NOT NULL,
    [student_code]    NVARCHAR(30)    NOT NULL,
    [full_name]       NVARCHAR(255)   NOT NULL,
    [birthday]        DATE            NOT NULL,
    [gender]          NVARCHAR(10)    NOT NULL,
    [ethnicity]       NVARCHAR(50)    DEFAULT N'Kinh',
    [religion]        NVARCHAR(50)    DEFAULT N'Không',
    [birthplace]      NVARCHAR(255),
    [hometown]        NVARCHAR(255),
    [party_member]    BIT             NOT NULL DEFAULT 0,
    [party_date]      DATE,
    [policy_type]     NVARCHAR(100),
    [address]         NVARCHAR(MAX),
    [class_id]        INT,
    [enrollment_date] DATE,
    [status]          NVARCHAR(20)    NOT NULL DEFAULT N'active',
    [created_at]      DATETIME2       NOT NULL DEFAULT GETDATE(),
    [updated_at]      DATETIME2       NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_students          PRIMARY KEY ([id]),
    CONSTRAINT UQ_students_user     UNIQUE      ([user_id]),
    CONSTRAINT UQ_students_code     UNIQUE      ([student_code]),
    CONSTRAINT CK_students_gender   CHECK       ([gender]  IN (N'male', N'female', N'other')),
    CONSTRAINT CK_students_status   CHECK       ([status]  IN (N'active', N'inactive', N'transferred', N'graduated')),
    CONSTRAINT FK_stu_user          FOREIGN KEY ([user_id])  REFERENCES [users]  ([id]) ON DELETE CASCADE,
    CONSTRAINT FK_stu_class         FOREIGN KEY ([class_id]) REFERENCES [classes]([id]) ON DELETE SET NULL
);
GO

CREATE TABLE [student_parents] (
    [id]                   INT             NOT NULL IDENTITY(1,1),
    [student_id]           INT             NOT NULL,
    [relationship]         NVARCHAR(20)    NOT NULL,
    [full_name]            NVARCHAR(255)   NOT NULL,
    [phone]                NVARCHAR(20),
    [job]                  NVARCHAR(150),
    [email]                NVARCHAR(255),
    [is_emergency_contact] BIT             NOT NULL DEFAULT 0,
    CONSTRAINT PK_student_parents      PRIMARY KEY ([id]),
    CONSTRAINT CK_sp_relationship      CHECK       ([relationship] IN (N'father', N'mother', N'guardian')),
    CONSTRAINT FK_sp_student           FOREIGN KEY ([student_id])  REFERENCES [students]([id]) ON DELETE CASCADE
);
GO

-- ============================================================
-- NHÓM 4: KẾT QUẢ HỌC TẬP
-- ============================================================

CREATE TABLE [grade_records] (
    [id]          INT             NOT NULL IDENTITY(1,1),
    [student_id]  INT             NOT NULL,
    [subject_id]  INT             NOT NULL,
    [semester_id] INT             NOT NULL,
    [oral_1]      DECIMAL(4,2),
    [oral_2]      DECIMAL(4,2),
    [oral_3]      DECIMAL(4,2),
    [q15_1]       DECIMAL(4,2),
    [q15_2]       DECIMAL(4,2),
    [q45_1]       DECIMAL(4,2),
    [q45_2]       DECIMAL(4,2),
    [midterm]     DECIMAL(4,2),
    [final]       DECIMAL(4,2),
    [avg]         DECIMAL(4,2),
    [created_by]  INT,
    [updated_at]  DATETIME2       NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_grade_records         PRIMARY KEY ([id]),
    CONSTRAINT UQ_grade_stu_subj_sem    UNIQUE      ([student_id], [subject_id], [semester_id]),
    CONSTRAINT FK_gr_student            FOREIGN KEY ([student_id])  REFERENCES [students] ([id]) ON DELETE CASCADE,
    CONSTRAINT FK_gr_subject            FOREIGN KEY ([subject_id])  REFERENCES [subjects] ([id]),
    CONSTRAINT FK_gr_semester           FOREIGN KEY ([semester_id]) REFERENCES [semesters]([id]),
    CONSTRAINT FK_gr_creator            FOREIGN KEY ([created_by])  REFERENCES [users]    ([id]) ON DELETE SET NULL
);
GO

CREATE TABLE [semester_results] (
    [id]            INT             NOT NULL IDENTITY(1,1),
    [student_id]    INT             NOT NULL,
    [semester_id]   INT             NOT NULL,
    [avg_score]     DECIMAL(4,2),
    [conduct]       NVARCHAR(20),
    [academic_rank] NVARCHAR(20),
    [class_rank]    TINYINT,
    [teacher_comment] NVARCHAR(MAX),
    CONSTRAINT PK_semester_results      PRIMARY KEY ([id]),
    CONSTRAINT UQ_sem_result            UNIQUE      ([student_id], [semester_id]),
    CONSTRAINT CK_sr_conduct            CHECK       ([conduct]       IN (N'excellent', N'good', N'fair', N'poor')),
    CONSTRAINT CK_sr_academic_rank      CHECK       ([academic_rank] IN (N'excellent', N'good', N'average', N'weak')),
    CONSTRAINT FK_sr_student            FOREIGN KEY ([student_id])  REFERENCES [students] ([id]) ON DELETE CASCADE,
    CONSTRAINT FK_sr_semester           FOREIGN KEY ([semester_id]) REFERENCES [semesters]([id])
);
GO

CREATE TABLE [year_results] (
    [id]               INT             NOT NULL IDENTITY(1,1),
    [student_id]       INT             NOT NULL,
    [school_year_id]   INT             NOT NULL,
    [avg_score]        DECIMAL(4,2),
    [conduct]          NVARCHAR(20),
    [academic_rank]    NVARCHAR(20),
    [class_rank]       TINYINT,
    [is_promoted]      BIT             NOT NULL DEFAULT 1,
    [principal_comment] NVARCHAR(MAX),
    CONSTRAINT PK_year_results          PRIMARY KEY ([id]),
    CONSTRAINT UQ_year_result           UNIQUE      ([student_id], [school_year_id]),
    CONSTRAINT CK_yr_conduct            CHECK       ([conduct]       IN (N'excellent', N'good', N'fair', N'poor')),
    CONSTRAINT CK_yr_academic_rank      CHECK       ([academic_rank] IN (N'excellent', N'good', N'average', N'weak')),
    CONSTRAINT FK_yr_student            FOREIGN KEY ([student_id])     REFERENCES [students]   ([id]) ON DELETE CASCADE,
    CONSTRAINT FK_yr_year               FOREIGN KEY ([school_year_id]) REFERENCES [school_years]([id])
);
GO

-- ============================================================
-- NHÓM 5: CHUYÊN CẦN
-- ============================================================

CREATE TABLE [attendance_records] (
    [id]            INT             NOT NULL IDENTITY(1,1),
    [student_id]    INT             NOT NULL,
    [date]          DATE            NOT NULL,
    [session]       NVARCHAR(20)    NOT NULL DEFAULT N'full_day',
    [status]        NVARCHAR(30)    NOT NULL,
    [reason]        NVARCHAR(500),
    [confirmed_by]  INT,
    [confirmed_at]  DATETIME2,
    [created_at]    DATETIME2       NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_attendance            PRIMARY KEY ([id]),
    CONSTRAINT UQ_att_stu_date_session  UNIQUE      ([student_id], [date], [session]),
    CONSTRAINT CK_att_session           CHECK       ([session] IN (N'morning', N'afternoon', N'full_day')),
    CONSTRAINT CK_att_status            CHECK       ([status]  IN (N'present', N'absent_excused', N'absent_unexcused', N'late')),
    CONSTRAINT FK_att_student           FOREIGN KEY ([student_id])   REFERENCES [students]([id]) ON DELETE CASCADE,
    CONSTRAINT FK_att_confirmer         FOREIGN KEY ([confirmed_by]) REFERENCES [users]   ([id]) ON DELETE SET NULL
);
GO

-- ============================================================
-- NHÓM 6: THỜI KHÓA BIỂU & LỊCH THI
-- ============================================================

CREATE TABLE [timetable_slots] (
    [id]           INT             NOT NULL IDENTITY(1,1),
    [class_id]     INT             NOT NULL,
    [subject_id]   INT             NOT NULL,
    [teacher_id]   INT             NOT NULL,
    [semester_id]  INT             NOT NULL,
    [day_of_week]  TINYINT         NOT NULL,
    [period_start] TINYINT         NOT NULL,
    [period_end]   TINYINT         NOT NULL,
    [room]         NVARCHAR(100),
    CONSTRAINT PK_timetable_slots   PRIMARY KEY ([id]),
    CONSTRAINT CK_tt_day            CHECK       ([day_of_week]  BETWEEN 2 AND 7),
    CONSTRAINT CK_tt_period_start   CHECK       ([period_start] BETWEEN 1 AND 9),
    CONSTRAINT CK_tt_period_end     CHECK       ([period_end]   BETWEEN 1 AND 9),
    CONSTRAINT FK_tt_class          FOREIGN KEY ([class_id])   REFERENCES [classes]  ([id]) ON DELETE CASCADE,
    CONSTRAINT FK_tt_subject        FOREIGN KEY ([subject_id]) REFERENCES [subjects] ([id]),
    CONSTRAINT FK_tt_teacher        FOREIGN KEY ([teacher_id]) REFERENCES [users]    ([id]),
    CONSTRAINT FK_tt_semester       FOREIGN KEY ([semester_id]) REFERENCES [semesters]([id])
);
GO

CREATE TABLE [exam_schedules] (
    [id]          INT             NOT NULL IDENTITY(1,1),
    [class_id]    INT             NOT NULL,
    [subject_id]  INT             NOT NULL,
    [semester_id] INT             NOT NULL,
    [exam_date]   DATE            NOT NULL,
    [start_time]  TIME            NOT NULL,
    [end_time]    TIME            NOT NULL,
    [room]        NVARCHAR(100),
    [exam_type]   NVARCHAR(20)    NOT NULL DEFAULT N'written',
    [notes]       NVARCHAR(500),
    CONSTRAINT PK_exam_schedules    PRIMARY KEY ([id]),
    CONSTRAINT CK_es_exam_type      CHECK       ([exam_type] IN (N'written', N'oral', N'practical')),
    CONSTRAINT FK_es_class          FOREIGN KEY ([class_id])   REFERENCES [classes]  ([id]) ON DELETE CASCADE,
    CONSTRAINT FK_es_subject        FOREIGN KEY ([subject_id]) REFERENCES [subjects] ([id]),
    CONSTRAINT FK_es_semester       FOREIGN KEY ([semester_id]) REFERENCES [semesters]([id])
);
GO

CREATE TABLE [exam_seats] (
    [id]               INT             NOT NULL IDENTITY(1,1),
    [exam_schedule_id] INT             NOT NULL,
    [student_id]       INT             NOT NULL,
    [seat_number]      NVARCHAR(20),
    CONSTRAINT PK_exam_seats            PRIMARY KEY ([id]),
    CONSTRAINT UQ_exam_seat             UNIQUE      ([exam_schedule_id], [student_id]),
    CONSTRAINT FK_seat_exam             FOREIGN KEY ([exam_schedule_id]) REFERENCES [exam_schedules]([id]) ON DELETE CASCADE,
    CONSTRAINT FK_seat_student          FOREIGN KEY ([student_id])       REFERENCES [students]      ([id])
);
GO

-- ============================================================
-- NHÓM 7: HỒ SƠ NĂNG LỰC (PORTFOLIO)
-- ============================================================

CREATE TABLE [portfolios] (
    [id]               INT             NOT NULL IDENTITY(1,1),
    [student_id]       INT             NOT NULL,
    [is_public]        BIT             NOT NULL DEFAULT 0,
    [share_token]      NVARCHAR(64),
    [share_expires_at] DATETIME2,
    [created_at]       DATETIME2       NOT NULL DEFAULT GETDATE(),
    [updated_at]       DATETIME2       NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_portfolios        PRIMARY KEY ([id]),
    CONSTRAINT UQ_portfolio_student UNIQUE      ([student_id]),
    CONSTRAINT UQ_portfolio_token   UNIQUE      ([share_token]),
    CONSTRAINT FK_pf_student        FOREIGN KEY ([student_id]) REFERENCES [students]([id]) ON DELETE CASCADE
);
GO

CREATE TABLE [portfolio_sections] (
    [id]           INT             NOT NULL IDENTITY(1,1),
    [portfolio_id] INT             NOT NULL,
    [section_key]  NVARCHAR(50)    NOT NULL,
    [content_text] NVARCHAR(MAX),
    [updated_at]   DATETIME2       NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_portfolio_sections    PRIMARY KEY ([id]),
    CONSTRAINT UQ_pf_section            UNIQUE      ([portfolio_id], [section_key]),
    CONSTRAINT FK_pfs_portfolio         FOREIGN KEY ([portfolio_id]) REFERENCES [portfolios]([id]) ON DELETE CASCADE
);
GO

CREATE TABLE [proof_files] (
    [id]           INT             NOT NULL IDENTITY(1,1),
    [portfolio_id] INT             NOT NULL,
    [section_key]  NVARCHAR(50)    NOT NULL,
    [file_name]    NVARCHAR(255)   NOT NULL,
    [file_url]     NVARCHAR(1000)  NOT NULL,
    [file_type]    NVARCHAR(20)    NOT NULL DEFAULT N'pdf',
    [file_size]    INT,
    [uploaded_by]  INT             NOT NULL,
    [uploaded_at]  DATETIME2       NOT NULL DEFAULT GETDATE(),
    [status]       NVARCHAR(20)    NOT NULL DEFAULT N'pending',
    [reviewed_by]  INT,
    [reviewed_at]  DATETIME2,
    [review_note]  NVARCHAR(500),
    CONSTRAINT PK_proof_files           PRIMARY KEY ([id]),
    CONSTRAINT CK_pfile_type            CHECK       ([file_type] IN (N'pdf', N'image', N'other')),
    CONSTRAINT CK_pfile_status          CHECK       ([status]    IN (N'pending', N'approved', N'rejected')),
    CONSTRAINT FK_pfile_portfolio       FOREIGN KEY ([portfolio_id]) REFERENCES [portfolios]([id]) ON DELETE CASCADE,
    CONSTRAINT FK_pfile_uploader        FOREIGN KEY ([uploaded_by])  REFERENCES [users]     ([id]),
    CONSTRAINT FK_pfile_reviewer        FOREIGN KEY ([reviewed_by])  REFERENCES [users]     ([id]) ON DELETE SET NULL
);
GO

CREATE TABLE [portfolio_history] (
    [id]             INT             NOT NULL IDENTITY(1,1),
    [portfolio_id]   INT             NOT NULL,
    [action]         NVARCHAR(20)    NOT NULL DEFAULT N'save',
    [changed_fields] NVARCHAR(MAX),   -- JSON array
    [proof_changes]  NVARCHAR(MAX),   -- JSON array
    [snapshot]       NVARCHAR(MAX),   -- JSON object
    [performed_by]   INT             NOT NULL,
    [created_at]     DATETIME2       NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_portfolio_history     PRIMARY KEY ([id]),
    CONSTRAINT CK_ph_action             CHECK       ([action] IN (N'save', N'reset')),
    CONSTRAINT FK_ph_portfolio          FOREIGN KEY ([portfolio_id]) REFERENCES [portfolios]([id]) ON DELETE CASCADE,
    CONSTRAINT FK_ph_user               FOREIGN KEY ([performed_by]) REFERENCES [users]     ([id])
);
GO

-- ============================================================
-- NHÓM 8: THÀNH TÍCH & KHEN THƯỞNG
-- ============================================================

CREATE TABLE [achievements] (
    [id]               INT             NOT NULL IDENTITY(1,1),
    [student_id]       INT             NOT NULL,
    [title]            NVARCHAR(500)   NOT NULL,
    [type]             NVARCHAR(30)    NOT NULL DEFAULT N'school',
    [issuer]           NVARCHAR(255),
    [issued_date]      DATE,
    [decision_number]  NVARCHAR(100),
    [status]           NVARCHAR(20)    NOT NULL DEFAULT N'pending',
    [submitted_by]     INT,
    [approved_by]      INT,
    [approved_at]      DATETIME2,
    [notes]            NVARCHAR(MAX),
    [created_at]       DATETIME2       NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_achievements      PRIMARY KEY ([id]),
    CONSTRAINT CK_ach_type          CHECK       ([type]   IN (N'school', N'district', N'city', N'national', N'international', N'other')),
    CONSTRAINT CK_ach_status        CHECK       ([status] IN (N'pending', N'approved', N'rejected')),
    CONSTRAINT FK_ach_student       FOREIGN KEY ([student_id])   REFERENCES [students]([id]) ON DELETE CASCADE,
    CONSTRAINT FK_ach_submitter     FOREIGN KEY ([submitted_by]) REFERENCES [users]   ([id]) ON DELETE SET NULL,
    CONSTRAINT FK_ach_approver      FOREIGN KEY ([approved_by])  REFERENCES [users]   ([id]) ON DELETE SET NULL
);
GO

-- ============================================================
-- NHÓM 9: TỰ ĐÁNH GIÁ
-- ============================================================

CREATE TABLE [self_assessments] (
    [id]              INT             NOT NULL IDENTITY(1,1),
    [student_id]      INT             NOT NULL,
    [semester_id]     INT             NOT NULL,
    [study_rating]    TINYINT,
    [conduct_rating]  TINYINT,
    [strong_subject]  NVARCHAR(200),
    [weak_subject]    NVARCHAR(200),
    [study_note]      NVARCHAR(MAX),
    [conduct_note]    NVARCHAR(MAX),
    [activity_note]   NVARCHAR(MAX),
    [growth_note]     NVARCHAR(MAX),
    [goal_next]       NVARCHAR(MAX),
    [overall]         NVARCHAR(20),
    [overall_note]    NVARCHAR(MAX),
    [created_at]      DATETIME2       NOT NULL DEFAULT GETDATE(),
    [updated_at]      DATETIME2       NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_self_assessments      PRIMARY KEY ([id]),
    CONSTRAINT UQ_sa_student_semester   UNIQUE      ([student_id], [semester_id]),
    CONSTRAINT CK_sa_study_rating       CHECK       ([study_rating]   BETWEEN 1 AND 5),
    CONSTRAINT CK_sa_conduct_rating     CHECK       ([conduct_rating] BETWEEN 1 AND 5),
    CONSTRAINT CK_sa_overall            CHECK       ([overall] IN (N'excellent', N'good', N'ok', N'poor')),
    CONSTRAINT FK_sa_student            FOREIGN KEY ([student_id])  REFERENCES [students] ([id]) ON DELETE CASCADE,
    CONSTRAINT FK_sa_semester           FOREIGN KEY ([semester_id]) REFERENCES [semesters]([id])
);
GO

-- ============================================================
-- NHÓM 10: THÔNG BÁO
-- ============================================================

CREATE TABLE [notifications] (
    [id]                  INT             NOT NULL IDENTITY(1,1),
    [recipient_id]        INT             NOT NULL,
    [sender_id]           INT,
    [type]                NVARCHAR(80)    NOT NULL,
    [title]               NVARCHAR(255)   NOT NULL,
    [body]                NVARCHAR(MAX),
    [is_read]             BIT             NOT NULL DEFAULT 0,
    [related_entity_type] NVARCHAR(80),
    [related_entity_id]   INT,
    [created_at]          DATETIME2       NOT NULL DEFAULT GETDATE(),
    [read_at]             DATETIME2,
    CONSTRAINT PK_notifications     PRIMARY KEY ([id]),
    CONSTRAINT FK_notif_recipient   FOREIGN KEY ([recipient_id]) REFERENCES [users]([id]) ON DELETE CASCADE,
    CONSTRAINT FK_notif_sender      FOREIGN KEY ([sender_id])    REFERENCES [users]([id]) ON DELETE SET NULL
);
GO

CREATE INDEX IX_notif_recipient ON [notifications]([recipient_id], [is_read]);
GO

-- ============================================================
-- NHÓM 11: TIN TỨC / THÔNG BÁO TRƯỜNG
-- ============================================================

CREATE TABLE [news_posts] (
    [id]            INT             NOT NULL IDENTITY(1,1),
    [title]         NVARCHAR(500)   NOT NULL,
    [slug]          NVARCHAR(500)   NOT NULL,
    [content]       NVARCHAR(MAX),
    [category]      NVARCHAR(100),
    [author_id]     INT             NOT NULL,
    [thumbnail_url] NVARCHAR(1000),
    [is_published]  BIT             NOT NULL DEFAULT 0,
    [is_pinned]     BIT             NOT NULL DEFAULT 0,
    [view_count]    INT             NOT NULL DEFAULT 0,
    [published_at]  DATETIME2,
    [created_at]    DATETIME2       NOT NULL DEFAULT GETDATE(),
    [updated_at]    DATETIME2       NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_news_posts        PRIMARY KEY ([id]),
    CONSTRAINT UQ_news_slug         UNIQUE      ([slug]),
    CONSTRAINT FK_news_author       FOREIGN KEY ([author_id]) REFERENCES [users]([id])
);
GO

CREATE INDEX IX_news_published ON [news_posts]([is_published], [published_at]);
GO

-- ============================================================
-- NHÓM 12: AUDIT LOG
-- ============================================================

CREATE TABLE [audit_logs] (
    [id]          INT             NOT NULL IDENTITY(1,1),
    [user_id]     INT,
    [action]      NVARCHAR(80)    NOT NULL,
    [resource]    NVARCHAR(80)    NOT NULL,
    [resource_id] INT,
    [old_value]   NVARCHAR(MAX),   -- JSON
    [new_value]   NVARCHAR(MAX),   -- JSON
    [description] NVARCHAR(500),
    [ip_address]  NVARCHAR(45),
    [user_agent]  NVARCHAR(500),
    [created_at]  DATETIME2       NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_audit_logs    PRIMARY KEY ([id]),
    CONSTRAINT FK_audit_user    FOREIGN KEY ([user_id]) REFERENCES [users]([id]) ON DELETE SET NULL
);
GO

CREATE INDEX IX_audit_user     ON [audit_logs]([user_id]);
CREATE INDEX IX_audit_resource ON [audit_logs]([resource], [resource_id]);
CREATE INDEX IX_audit_time     ON [audit_logs]([created_at]);
GO

-- ============================================================
-- NHÓM 13: CÀI ĐẶT HỆ THỐNG
-- ============================================================

CREATE TABLE [system_settings] (
    [id]          INT             NOT NULL IDENTITY(1,1),
    [key_name]    NVARCHAR(150)   NOT NULL,
    [value]       NVARCHAR(MAX)   NOT NULL,
    [value_type]  NVARCHAR(20)    NOT NULL DEFAULT N'string',
    [description] NVARCHAR(300),
    [updated_by]  INT,
    [updated_at]  DATETIME2       NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_system_settings       PRIMARY KEY ([id]),
    CONSTRAINT UQ_settings_key          UNIQUE      ([key_name]),
    CONSTRAINT CK_settings_value_type   CHECK       ([value_type] IN (N'string', N'number', N'boolean', N'json')),
    CONSTRAINT FK_settings_user         FOREIGN KEY ([updated_by]) REFERENCES [users]([id]) ON DELETE SET NULL
);
GO

-- ============================================================
-- TRIGGER: tự cập nhật [updated_at] khi UPDATE
-- (SQL Server không có ON UPDATE CURRENT_TIMESTAMP)
-- ============================================================

CREATE TRIGGER TR_users_updated_at
ON [users] AFTER UPDATE AS
    UPDATE [users] SET [updated_at] = GETDATE()
    WHERE [id] IN (SELECT [id] FROM inserted);
GO

CREATE TRIGGER TR_students_updated_at
ON [students] AFTER UPDATE AS
    UPDATE [students] SET [updated_at] = GETDATE()
    WHERE [id] IN (SELECT [id] FROM inserted);
GO

CREATE TRIGGER TR_portfolio_sections_updated_at
ON [portfolio_sections] AFTER UPDATE AS
    UPDATE [portfolio_sections] SET [updated_at] = GETDATE()
    WHERE [id] IN (SELECT [id] FROM inserted);
GO

CREATE TRIGGER TR_portfolios_updated_at
ON [portfolios] AFTER UPDATE AS
    UPDATE [portfolios] SET [updated_at] = GETDATE()
    WHERE [id] IN (SELECT [id] FROM inserted);
GO

CREATE TRIGGER TR_self_assessments_updated_at
ON [self_assessments] AFTER UPDATE AS
    UPDATE [self_assessments] SET [updated_at] = GETDATE()
    WHERE [id] IN (SELECT [id] FROM inserted);
GO

CREATE TRIGGER TR_news_posts_updated_at
ON [news_posts] AFTER UPDATE AS
    UPDATE [news_posts] SET [updated_at] = GETDATE()
    WHERE [id] IN (SELECT [id] FROM inserted);
GO

-- ============================================================
-- SEED DATA
-- ============================================================

-- Roles
INSERT INTO [roles] ([key_name], [label], [description]) VALUES
    (N'administrator',    N'Quản Trị Viên',       N'Toàn quyền hệ thống'),
    (N'school',           N'Nhà Trường',           N'Quản lý cấp trường'),
    (N'principal',        N'Hiệu Trưởng',          N'Hiệu trưởng nhà trường'),
    (N'teacher',          N'Giáo Viên',            N'Giáo viên bộ môn và chủ nhiệm'),
    (N'student',          N'Học Sinh',             N'Học sinh THCS'),
    (N'parent',           N'Phụ Huynh',            N'Phụ huynh học sinh'),
    (N'admission',        N'Phòng Tuyển Sinh',     N'Nhân viên tuyển sinh'),
    (N'enterprise',       N'Doanh Nghiệp',         N'Đối tác doanh nghiệp'),
    (N'edu_organization', N'Tổ Chức Giáo Dục',     N'Tổ chức giáo dục đối tác');
GO

-- Năm học
INSERT INTO [school_years] ([label], [start_date], [end_date], [is_current]) VALUES
    (N'2026-2027', '2026-09-01', '2027-05-31', 1),
    (N'2025-2026', '2025-09-01', '2026-05-31', 0),
    (N'2024-2025', '2024-09-01', '2025-05-31', 0),
    (N'2023-2024', '2023-09-01', '2024-05-31', 0);
GO

-- Học kỳ
INSERT INTO [semesters] ([school_year_id], [name], [start_date], [end_date])
SELECT [id], N'HK1', '2026-09-01', '2027-01-15' FROM [school_years] WHERE [label] = N'2026-2027' UNION ALL
SELECT [id], N'HK2', '2027-01-20', '2027-05-31' FROM [school_years] WHERE [label] = N'2026-2027' UNION ALL
SELECT [id], N'HK1', '2025-09-01', '2026-01-15' FROM [school_years] WHERE [label] = N'2025-2026' UNION ALL
SELECT [id], N'HK2', '2026-01-20', '2026-05-31' FROM [school_years] WHERE [label] = N'2025-2026' UNION ALL
SELECT [id], N'HK1', '2024-09-01', '2025-01-15' FROM [school_years] WHERE [label] = N'2024-2025' UNION ALL
SELECT [id], N'HK2', '2025-01-20', '2025-05-31' FROM [school_years] WHERE [label] = N'2024-2025';
GO

-- Môn học
INSERT INTO [subjects] ([name], [code], [grade_level]) VALUES
    (N'Toán Học',              N'TOAN', NULL),
    (N'Ngữ Văn',               N'VAN',  NULL),
    (N'Tiếng Anh',             N'ANH',  NULL),
    (N'Vật Lý',                N'LY',   NULL),
    (N'Hóa Học',               N'HOA',  NULL),
    (N'Sinh Học',              N'SINH', NULL),
    (N'Lịch Sử',               N'SU',   NULL),
    (N'Địa Lý',                N'DIA',  NULL),
    (N'Giáo Dục Công Dân',     N'GDCD', NULL),
    (N'Tin Học',               N'TIN',  NULL),
    (N'Công Nghệ',             N'CN',   NULL),
    (N'Âm Nhạc',               N'AM',   NULL),
    (N'Mỹ Thuật',              N'MT',   NULL),
    (N'Giáo Dục Thể Chất',     N'TDTT', NULL),
    (N'Quốc Phòng An Ninh',    N'QPAN', NULL),
    (N'Khoa Học Tự Nhiên',     N'KHTN', NULL),
    (N'Lịch Sử & Địa Lý',      N'LSDL', NULL),
    (N'Hoạt Động Trải Nghiệm', N'HDTN', NULL);
GO

-- Cài đặt hệ thống
INSERT INTO [system_settings] ([key_name], [value], [value_type], [description]) VALUES
    (N'school_name',                    N'Trường THCS Nguyễn Văn Cừ',         N'string',  N'Tên trường'),
    (N'school_address',                 N'Đà Nẵng, Việt Nam',                 N'string',  N'Địa chỉ trường'),
    (N'school_phone',                   N'0236-123-4567',                      N'string',  N'Số điện thoại'),
    (N'school_email',                   N'contact@nguyenvancuschool.edu.vn',   N'string',  N'Email liên hệ'),
    (N'current_school_year',            N'2026-2027',                          N'string',  N'Năm học hiện tại'),
    (N'grading_scale',                  N'10',                                 N'number',  N'Thang điểm'),
    (N'passing_score',                  N'5.0',                                N'number',  N'Điểm đạt tối thiểu'),
    (N'excellent_score',                N'8.0',                                N'number',  N'Điểm học lực Giỏi'),
    (N'good_score',                     N'6.5',                                N'number',  N'Điểm học lực Khá'),
    (N'max_absent_days',                N'3',                                  N'number',  N'Số ngày nghỉ tối đa/kỳ'),
    (N'allow_student_portfolio_edit',   N'true',                               N'boolean', N'Học sinh tự sửa hồ sơ'),
    (N'proof_file_max_mb',              N'10',                                 N'number',  N'Dung lượng tối đa file minh chứng (MB)'),
    (N'proof_file_types',               N'["pdf","jpg","jpeg","png"]',         N'json',    N'Định dạng file minh chứng cho phép');
GO

-- ============================================================
-- END OF SCHEMA
-- 24 bảng | SQL Server T-SQL | SPMS v1.0
-- ============================================================
