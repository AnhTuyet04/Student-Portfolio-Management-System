/**
 * SPMS sample data fixture.
 *
 * This file is intentionally data-only. It does not write to localStorage and
 * does not modify the DOM. A storage layer can import/copy this object later.
 */
(function exposeSPMSSeedData(global) {
    'use strict';

    const SPMS_SEED_DATA = {
        schemaVersion: 1,
        datasetVersion: '2026.08.05',
        generatedAt: '2026-08-04T00:00:00+07:00',

        lookups: {
            userStatuses: ['active', 'locked'],
            achievementStatuses: ['pending', 'approved', 'request_more', 'rejected'],
            achievementCategories: ['academic', 'science_technology', 'arts', 'sports', 'movement'],
            achievementLevels: ['school', 'district', 'city', 'national', 'international'],
            attendanceTypes: ['excused_absence', 'unexcused_absence', 'late'],
            portfolioStatuses: ['draft', 'saved', 'shared']
        },

        roles: [
            { id: 'ROLE_ADMIN', code: 'admin', name: 'Phòng Đào tạo' },
            { id: 'ROLE_TEACHER', code: 'teacher', name: 'Giáo viên' },
            { id: 'ROLE_STUDENT', code: 'student', name: 'Học sinh' },
            { id: 'ROLE_PARENT', code: 'parent', name: 'Phụ huynh' }
        ],

        users: [
            { id: 'USR_ADMIN_001', roleId: 'ROLE_ADMIN', username: 'admin', displayName: 'Quản Trị Viên', email: 'admin@spms.edu.vn', phone: '0236-100-0001', status: 'active' },
            { id: 'USR_ADMIN_002', roleId: 'ROLE_ADMIN', username: 'bghlhieu', displayName: 'Nguyễn Văn Minh', email: 'nvm@spms.edu.vn', phone: '0236-100-0002', status: 'active' },
            { id: 'USR_TEACHER_001', roleId: 'ROLE_TEACHER', username: 'gv001', displayName: 'Nguyễn Thị Xuân Hiền', email: 'gv001@spms.edu.vn', phone: '0905123456', status: 'active' },
            { id: 'USR_TEACHER_002', roleId: 'ROLE_TEACHER', username: 'gv002', displayName: 'Trần Văn Phong', email: 'gv002@spms.edu.vn', phone: '0912345600', status: 'active' },
            { id: 'USR_TEACHER_003', roleId: 'ROLE_TEACHER', username: 'gv003', displayName: 'Lê Thị Bích Hà', email: 'gv003@spms.edu.vn', phone: '0934567800', status: 'active' },
            { id: 'USR_TEACHER_004', roleId: 'ROLE_TEACHER', username: 'gv004', displayName: 'Phạm Quốc Bảo', email: 'gv004@spms.edu.vn', phone: '0945678900', status: 'active' },
            { id: 'USR_PARENT_001', roleId: 'ROLE_PARENT', username: 'ph001', displayName: 'Nguyễn Văn Hùng', email: 'ph001@spms.edu.vn', phone: '0905123456', status: 'active' },
            { id: 'USR_PARENT_002', roleId: 'ROLE_PARENT', username: 'ph002', displayName: 'Đặng Văn Long', email: 'ph002@spms.edu.vn', phone: '0967890124', status: 'active' },
            { id: 'USR_PARENT_003', roleId: 'ROLE_PARENT', username: 'ph003', displayName: 'Trần Văn Hùng', email: 'ph003@spms.edu.vn', phone: '0901234570', status: 'active' },
            { id: 'USR_PARENT_004', roleId: 'ROLE_PARENT', username: 'ph004', displayName: 'Vũ Văn Minh', email: 'ph004@spms.edu.vn', phone: '0945678902', status: 'active' },
            { id: 'USR_PARENT_005', roleId: 'ROLE_PARENT', username: 'ph005', displayName: 'Cao Văn Bảo', email: 'ph005@spms.edu.vn', phone: '0923456700', status: 'active' },
            { id: 'USR_PARENT_006', roleId: 'ROLE_PARENT', username: 'ph006', displayName: 'Đinh Văn Kiên', email: 'ph006@spms.edu.vn', phone: '0923456702', status: 'active' },
            { id: 'USR_PARENT_007', roleId: 'ROLE_PARENT', username: 'ph007', displayName: 'Lý Văn Phong', email: 'ph007@spms.edu.vn', phone: '0923456704', status: 'active' },
            { id: 'USR_PARENT_008', roleId: 'ROLE_PARENT', username: 'ph008', displayName: 'Hà Văn Tài', email: 'ph008@spms.edu.vn', phone: '0934567902', status: 'active' },
            { id: 'USR_PARENT_009', roleId: 'ROLE_PARENT', username: 'ph009', displayName: 'Phan Văn Tín', email: 'ph009@spms.edu.vn', phone: '0912345604', status: 'active' },
            { id: 'USR_PARENT_010', roleId: 'ROLE_PARENT', username: 'ph010', displayName: 'Trương Văn Lực', email: 'ph010@spms.edu.vn', phone: '0934567900', status: 'active' },
            { id: 'USR_STUDENT_001', roleId: 'ROLE_STUDENT', username: 'hs101001', displayName: 'Nguyễn Văn Hoàng Anh', email: 'hs101001@spms.edu.vn', status: 'active' },
            { id: 'USR_STUDENT_002', roleId: 'ROLE_STUDENT', username: 'hs103112', displayName: 'Đặng Mai Phương Thảo', email: 'hs103112@spms.edu.vn', status: 'active' },
            { id: 'USR_STUDENT_003', roleId: 'ROLE_STUDENT', username: 'hs101002', displayName: 'Trần Thị Bảo Châu', email: 'hs101002@spms.edu.vn', status: 'active' },
            { id: 'USR_STUDENT_004', roleId: 'ROLE_STUDENT', username: 'hs102012', displayName: 'Phạm Hoàng Phương Nghi', email: 'hs102012@spms.edu.vn', status: 'active' },
            { id: 'USR_STUDENT_005', roleId: 'ROLE_STUDENT', username: 'hs102003', displayName: 'Phan Văn Khoa', email: 'hs102003@spms.edu.vn', status: 'active' },
            { id: 'USR_STUDENT_006', roleId: 'ROLE_STUDENT', username: 'hs113001', displayName: 'Cao Thị Mỹ Linh', email: 'hs113001@spms.edu.vn', status: 'active' },
            { id: 'USR_STUDENT_007', roleId: 'ROLE_STUDENT', username: 'hs113002', displayName: 'Đinh Quốc Hùng', email: 'hs113002@spms.edu.vn', status: 'active' },
            { id: 'USR_STUDENT_008', roleId: 'ROLE_STUDENT', username: 'hs113003', displayName: 'Lý Thị Thanh Trúc', email: 'hs113003@spms.edu.vn', status: 'active' },
            { id: 'USR_STUDENT_009', roleId: 'ROLE_STUDENT', username: 'hs111009', displayName: 'Vũ Hoàng Bảo Lâm', email: 'hs111009@spms.edu.vn', status: 'active' },
            { id: 'USR_STUDENT_010', roleId: 'ROLE_STUDENT', username: 'hs114002', displayName: 'Hà Thị Ngọc Trinh', email: 'hs114002@spms.edu.vn', status: 'active' },
            { id: 'USR_STUDENT_011', roleId: 'ROLE_STUDENT', username: 'hs101003', displayName: 'Lê Minh Tuấn', email: 'hs101003@spms.edu.vn', status: 'active' },
            { id: 'USR_STUDENT_012', roleId: 'ROLE_STUDENT', username: 'hs101004', displayName: 'Phạm Ngọc Diệp', email: 'hs101004@spms.edu.vn', status: 'active' },
            { id: 'USR_STUDENT_013', roleId: 'ROLE_STUDENT', username: 'hs102001', displayName: 'Ngô Hoàng Nam', email: 'hs102001@spms.edu.vn', status: 'active' },
            { id: 'USR_STUDENT_014', roleId: 'ROLE_STUDENT', username: 'hs102002', displayName: 'Bùi Thị Khánh Vân', email: 'hs102002@spms.edu.vn', status: 'active' },
            { id: 'USR_STUDENT_015', roleId: 'ROLE_STUDENT', username: 'hs113004', displayName: 'Mai Hoàng Phúc', email: 'hs113004@spms.edu.vn', status: 'active' },
            { id: 'USR_STUDENT_016', roleId: 'ROLE_STUDENT', username: 'hs114001', displayName: 'Trương Văn Đạt', email: 'hs114001@spms.edu.vn', status: 'active' },
            { id: 'USR_STUDENT_017', roleId: 'ROLE_STUDENT', username: 'hs114003', displayName: 'Nguyễn Hữu Toàn', email: 'hs114003@spms.edu.vn', status: 'active' },
            { id: 'USR_STUDENT_018', roleId: 'ROLE_STUDENT', username: 'hs114004', displayName: 'Lưu Thị Kim Ngân', email: 'hs114004@spms.edu.vn', status: 'active' },
            { id: 'USR_STUDENT_019', roleId: 'ROLE_STUDENT', username: 'hs115023', displayName: 'Ngô Thị Thanh Tâm', email: 'hs115023@spms.edu.vn', status: 'active' },
            { id: 'USR_STUDENT_020', roleId: 'ROLE_STUDENT', username: 'hs111001', displayName: 'Bùi Thị Minh Thư', email: 'hs111001@spms.edu.vn', status: 'active' }
        ],

        authCredentials: [
            { id: 'CRED_ADMIN_001', userId: 'USR_ADMIN_001', password: 'admin123' },
            { id: 'CRED_ADMIN_002', userId: 'USR_ADMIN_002', password: 'admin123' },
            { id: 'CRED_TEACHER_001', userId: 'USR_TEACHER_001', password: '123456' },
            { id: 'CRED_TEACHER_002', userId: 'USR_TEACHER_002', password: '123456' },
            { id: 'CRED_TEACHER_003', userId: 'USR_TEACHER_003', password: '123456' },
            { id: 'CRED_TEACHER_004', userId: 'USR_TEACHER_004', password: '123456' },
            { id: 'CRED_PARENT_001', userId: 'USR_PARENT_001', password: '123456' },
            { id: 'CRED_PARENT_002', userId: 'USR_PARENT_002', password: '123456' },
            { id: 'CRED_PARENT_003', userId: 'USR_PARENT_003', password: '123456' },
            { id: 'CRED_PARENT_004', userId: 'USR_PARENT_004', password: '123456' },
            { id: 'CRED_PARENT_005', userId: 'USR_PARENT_005', password: '123456' },
            { id: 'CRED_PARENT_006', userId: 'USR_PARENT_006', password: '123456' },
            { id: 'CRED_PARENT_007', userId: 'USR_PARENT_007', password: '123456' },
            { id: 'CRED_PARENT_008', userId: 'USR_PARENT_008', password: '123456' },
            { id: 'CRED_PARENT_009', userId: 'USR_PARENT_009', password: '123456' },
            { id: 'CRED_PARENT_010', userId: 'USR_PARENT_010', password: '123456' },
            { id: 'CRED_STUDENT_001', userId: 'USR_STUDENT_001', password: '123456' },
            { id: 'CRED_STUDENT_002', userId: 'USR_STUDENT_002', password: '123456' },
            { id: 'CRED_STUDENT_003', userId: 'USR_STUDENT_003', password: '123456' },
            { id: 'CRED_STUDENT_004', userId: 'USR_STUDENT_004', password: '123456' },
            { id: 'CRED_STUDENT_005', userId: 'USR_STUDENT_005', password: '123456' },
            { id: 'CRED_STUDENT_006', userId: 'USR_STUDENT_006', password: '123456' },
            { id: 'CRED_STUDENT_007', userId: 'USR_STUDENT_007', password: '123456' },
            { id: 'CRED_STUDENT_008', userId: 'USR_STUDENT_008', password: '123456' },
            { id: 'CRED_STUDENT_009', userId: 'USR_STUDENT_009', password: '123456' },
            { id: 'CRED_STUDENT_010', userId: 'USR_STUDENT_010', password: '123456' },
            { id: 'CRED_STUDENT_011', userId: 'USR_STUDENT_011', password: '123456' },
            { id: 'CRED_STUDENT_012', userId: 'USR_STUDENT_012', password: '123456' },
            { id: 'CRED_STUDENT_013', userId: 'USR_STUDENT_013', password: '123456' },
            { id: 'CRED_STUDENT_014', userId: 'USR_STUDENT_014', password: '123456' },
            { id: 'CRED_STUDENT_015', userId: 'USR_STUDENT_015', password: '123456' },
            { id: 'CRED_STUDENT_016', userId: 'USR_STUDENT_016', password: '123456' },
            { id: 'CRED_STUDENT_017', userId: 'USR_STUDENT_017', password: '123456' },
            { id: 'CRED_STUDENT_018', userId: 'USR_STUDENT_018', password: '123456' },
            { id: 'CRED_STUDENT_019', userId: 'USR_STUDENT_019', password: '123456' },
            { id: 'CRED_STUDENT_020', userId: 'USR_STUDENT_020', password: '123456' }
        ],

        schoolYears: [
            { id: 'SY_2026_2027', name: '2026 - 2027', startDate: '2026-08-15', endDate: '2027-05-31', isCurrent: true },
            { id: 'SY_2025_2026', name: '2025 - 2026', startDate: '2025-08-15', endDate: '2026-05-31', isCurrent: false },
            { id: 'SY_2024_2025', name: '2024 - 2025', startDate: '2024-08-15', endDate: '2025-05-31', isCurrent: false },
            { id: 'SY_2023_2024', name: '2023 - 2024', startDate: '2023-08-15', endDate: '2024-05-31', isCurrent: false },
            { id: 'SY_2022_2023', name: '2022 - 2023', startDate: '2022-08-15', endDate: '2023-05-31', isCurrent: false }
        ],

        semesters: [
            { id: 'SEM_2026_1', schoolYearId: 'SY_2026_2027', name: 'Học kỳ I', number: 1, startDate: '2026-08-15', endDate: '2026-12-31' },
            { id: 'SEM_2026_2', schoolYearId: 'SY_2026_2027', name: 'Học kỳ II', number: 2, startDate: '2027-01-01', endDate: '2027-05-31' },
            { id: 'SEM_2025_1', schoolYearId: 'SY_2025_2026', name: 'Học kỳ I', number: 1, startDate: '2025-08-15', endDate: '2025-12-31' },
            { id: 'SEM_2025_2', schoolYearId: 'SY_2025_2026', name: 'Học kỳ II', number: 2, startDate: '2026-01-01', endDate: '2026-05-31' }
        ],

        teachers: [
            { id: 'TEA_001', userId: 'USR_TEACHER_001', code: 'GV001', fullName: 'Nguyễn Thị Xuân Hiền', phone: '0905123456', subjectIds: ['SUB_MATH'] },
            { id: 'TEA_002', userId: 'USR_TEACHER_002', code: 'GV002', fullName: 'Trần Văn Phong', phone: '0912345600', subjectIds: ['SUB_LIT'] },
            { id: 'TEA_003', userId: 'USR_TEACHER_003', code: 'GV003', fullName: 'Lê Thị Bích Hà', phone: '0934567800', subjectIds: ['SUB_ENG'] },
            { id: 'TEA_004', userId: 'USR_TEACHER_004', code: 'GV004', fullName: 'Phạm Quốc Bảo', phone: '0945678900', subjectIds: ['SUB_SCI', 'SUB_PHY', 'SUB_CHEM'] }
        ],

        subjects: [
            { id: 'SUB_MATH',   code: 'TOAN',  name: 'Toán học' },
            { id: 'SUB_LIT',    code: 'VAN',   name: 'Ngữ văn' },
            { id: 'SUB_ENG',    code: 'ANH',   name: 'Tiếng Anh' },
            { id: 'SUB_SCI',    code: 'KHTN',  name: 'Khoa học tự nhiên' },
            { id: 'SUB_IT',     code: 'TIN',   name: 'Tin học' },
            { id: 'SUB_PHY',    code: 'LY',    name: 'Vật lý' },
            { id: 'SUB_CHEM',   code: 'HOA',   name: 'Hóa học' },
            { id: 'SUB_BIO',    code: 'SINH',  name: 'Sinh học' },
            { id: 'SUB_HIS',    code: 'SU',    name: 'Lịch sử' },
            { id: 'SUB_GEO',    code: 'DIA',   name: 'Địa lý' },
            { id: 'SUB_CIVIC',  code: 'GDCD',  name: 'Giáo dục công dân' },
            { id: 'SUB_TECH',   code: 'CN',    name: 'Công nghệ' },
            { id: 'SUB_PE',     code: 'TDTT',  name: 'Giáo dục thể chất' },
            { id: 'SUB_MUSIC',  code: 'AM',    name: 'Âm nhạc' },
            { id: 'SUB_ART',    code: 'MT',    name: 'Mỹ thuật' }
        ],

        classes: [
            { id: 'CLS_6A1', schoolYearId: 'SY_2026_2027', code: '6A1', grade: 6, level: 'THCS', homeroomTeacherId: 'TEA_002' },
            { id: 'CLS_6A2', schoolYearId: 'SY_2026_2027', code: '6A2', grade: 6, level: 'THCS', homeroomTeacherId: 'TEA_003' },
            { id: 'CLS_7A1', schoolYearId: 'SY_2026_2027', code: '7A1', grade: 7, level: 'THCS', homeroomTeacherId: 'TEA_001' },
            { id: 'CLS_7A2', schoolYearId: 'SY_2026_2027', code: '7A2', grade: 7, level: 'THCS', homeroomTeacherId: 'TEA_002' },
            { id: 'CLS_8A1', schoolYearId: 'SY_2026_2027', code: '8A1', grade: 8, level: 'THCS', homeroomTeacherId: 'TEA_003' },
            { id: 'CLS_8A2', schoolYearId: 'SY_2026_2027', code: '8A2', grade: 8, level: 'THCS', homeroomTeacherId: 'TEA_004' },
            { id: 'CLS_8A3', schoolYearId: 'SY_2026_2027', code: '8A3', grade: 8, level: 'THCS', homeroomTeacherId: 'TEA_001' },
            { id: 'CLS_9A1', schoolYearId: 'SY_2026_2027', code: '9A1', grade: 9, level: 'THCS', homeroomTeacherId: 'TEA_002' },
            { id: 'CLS_9A2', schoolYearId: 'SY_2026_2027', code: '9A2', grade: 9, level: 'THCS', homeroomTeacherId: 'TEA_003' }
        ],

        classSubjects: [
            { id: 'CS_7A1_MATH', classId: 'CLS_7A1', subjectId: 'SUB_MATH', teacherId: 'TEA_001' },
            { id: 'CS_7A1_LIT',  classId: 'CLS_7A1', subjectId: 'SUB_LIT',  teacherId: 'TEA_002' },
            { id: 'CS_7A1_ENG',  classId: 'CLS_7A1', subjectId: 'SUB_ENG',  teacherId: 'TEA_003' },
            { id: 'CS_7A1_SCI',  classId: 'CLS_7A1', subjectId: 'SUB_SCI',  teacherId: 'TEA_004' },
            { id: 'CS_7A2_MATH', classId: 'CLS_7A2', subjectId: 'SUB_MATH', teacherId: 'TEA_001' },
            { id: 'CS_7A2_LIT',  classId: 'CLS_7A2', subjectId: 'SUB_LIT',  teacherId: 'TEA_002' },
            { id: 'CS_8A1_MATH', classId: 'CLS_8A1', subjectId: 'SUB_MATH', teacherId: 'TEA_001' },
            { id: 'CS_8A1_PHY',  classId: 'CLS_8A1', subjectId: 'SUB_PHY',  teacherId: 'TEA_004' },
            { id: 'CS_8A2_MATH', classId: 'CLS_8A2', subjectId: 'SUB_MATH', teacherId: 'TEA_001' },
            { id: 'CS_9A1_MATH', classId: 'CLS_9A1', subjectId: 'SUB_MATH', teacherId: 'TEA_001' },
            { id: 'CS_9A2_MATH', classId: 'CLS_9A2', subjectId: 'SUB_MATH', teacherId: 'TEA_001' }
        ],

        students: [
            { id: 'STU_001', userId: 'USR_STUDENT_001', code: 'HS101001', fullName: 'Nguyễn Văn Hoàng Anh', dateOfBirth: '2010-05-14', gender: 'male', ethnicity: 'Kinh', religion: 'Không', hometown: 'Đà Nẵng, Việt Nam', address: '123 Lê Lợi, P. Hải Châu I, Q. Hải Châu, Đà Nẵng', policy: 'Con thương binh (Ưu đãi A)', youthUnionJoinedAt: '2026-03-26', classId: 'CLS_7A1', status: 'studying' },
            { id: 'STU_002', userId: 'USR_STUDENT_002', code: 'HS103112', fullName: 'Đặng Mai Phương Thảo', dateOfBirth: '2012-07-08', gender: 'female', ethnicity: 'Kinh', religion: 'Không', hometown: 'Đà Nẵng', address: '78 Nguyễn Đình Chiểu, Q. Cẩm Lệ, Đà Nẵng', classId: 'CLS_7A1', status: 'studying' },
            { id: 'STU_003', userId: 'USR_STUDENT_003', code: 'HS101002', fullName: 'Trần Thị Bảo Châu', dateOfBirth: '2012-03-22', gender: 'female', ethnicity: 'Kinh', religion: 'Không', hometown: 'Đà Nẵng', address: '45 Nguyễn Trãi, Q. Sơn Trà, Đà Nẵng', classId: 'CLS_7A1', status: 'studying' },
            { id: 'STU_004', userId: 'USR_STUDENT_004', code: 'HS102012', fullName: 'Phạm Hoàng Phương Nghi', dateOfBirth: '2012-08-19', gender: 'female', ethnicity: 'Kinh', religion: 'Không', hometown: 'Đà Nẵng', address: '12 Đinh Tiên Hoàng, Q. Ngũ Hành Sơn, Đà Nẵng', classId: 'CLS_7A2', status: 'studying' },
            { id: 'STU_005', userId: 'USR_STUDENT_005', code: 'HS102003', fullName: 'Phan Văn Khoa', dateOfBirth: '2012-06-11', gender: 'male', ethnicity: 'Kinh', religion: 'Không', hometown: 'Đà Nẵng', address: '22 Phan Đình Phùng, Q. Thanh Khê, Đà Nẵng', classId: 'CLS_7A2', status: 'studying' },
            { id: 'STU_006', userId: 'USR_STUDENT_006', code: 'HS113001', fullName: 'Cao Thị Mỹ Linh', dateOfBirth: '2011-09-05', gender: 'female', ethnicity: 'Kinh', religion: 'Không', hometown: 'Đà Nẵng', address: '67 Lê Văn Sỹ, Q. Hải Châu, Đà Nẵng', classId: 'CLS_8A1', status: 'studying' },
            { id: 'STU_007', userId: 'USR_STUDENT_007', code: 'HS113002', fullName: 'Đinh Quốc Hùng', dateOfBirth: '2011-01-30', gender: 'male', ethnicity: 'Kinh', religion: 'Không', hometown: 'Đà Nẵng', address: '102 Trường Chinh, Q. Thanh Khê, Đà Nẵng', classId: 'CLS_8A1', status: 'studying' },
            { id: 'STU_008', userId: 'USR_STUDENT_008', code: 'HS113003', fullName: 'Lý Thị Thanh Trúc', dateOfBirth: '2011-04-18', gender: 'female', ethnicity: 'Kinh', religion: 'Không', hometown: 'Đà Nẵng', address: '38 Bà Huyện Thanh Quan, Q. Hải Châu, Đà Nẵng', classId: 'CLS_8A1', status: 'studying' },
            { id: 'STU_009', userId: 'USR_STUDENT_009', code: 'HS111009', fullName: 'Vũ Hoàng Bảo Lâm', dateOfBirth: '2011-01-30', gender: 'male', ethnicity: 'Kinh', religion: 'Không', hometown: 'Đà Nẵng', address: '34 Lý Tự Trọng, Q. Hải Châu, Đà Nẵng', classId: 'CLS_8A2', status: 'studying' },
            { id: 'STU_010', userId: 'USR_STUDENT_010', code: 'HS114002', fullName: 'Hà Thị Ngọc Trinh', dateOfBirth: '2011-10-12', gender: 'female', ethnicity: 'Kinh', religion: 'Không', hometown: 'Đà Nẵng', address: '29 Nguyễn Thái Học, Q. Hải Châu, Đà Nẵng', classId: 'CLS_8A2', status: 'studying' },
            { id: 'STU_011', userId: 'USR_STUDENT_011', code: 'HS101003', fullName: 'Lê Minh Tuấn', dateOfBirth: '2012-07-09', gender: 'male', ethnicity: 'Kinh', religion: 'Không', hometown: 'Đà Nẵng', address: '78 Hai Bà Trưng, Q. Hải Châu, Đà Nẵng', classId: 'CLS_7A1', status: 'studying' },
            { id: 'STU_012', userId: 'USR_STUDENT_012', code: 'HS101004', fullName: 'Phạm Ngọc Diệp', dateOfBirth: '2012-11-15', gender: 'female', ethnicity: 'Kinh', religion: 'Không', hometown: 'Đà Nẵng', address: '90 Đinh Tiên Hoàng, Q. Liên Chiểu, Đà Nẵng', classId: 'CLS_7A1', status: 'studying' },
            { id: 'STU_013', userId: 'USR_STUDENT_013', code: 'HS102001', fullName: 'Ngô Hoàng Nam', dateOfBirth: '2012-04-17', gender: 'male', ethnicity: 'Kinh', religion: 'Không', hometown: 'Đà Nẵng', address: '56 Cách Mạng Tháng 8, Q. Hải Châu, Đà Nẵng', classId: 'CLS_7A2', status: 'studying' },
            { id: 'STU_014', userId: 'USR_STUDENT_014', code: 'HS102002', fullName: 'Bùi Thị Khánh Vân', dateOfBirth: '2012-06-23', gender: 'female', ethnicity: 'Kinh', religion: 'Không', hometown: 'Đà Nẵng', address: '88 Võ Thị Sáu, Q. Ngũ Hành Sơn, Đà Nẵng', classId: 'CLS_7A2', status: 'studying' },
            { id: 'STU_015', userId: 'USR_STUDENT_015', code: 'HS113004', fullName: 'Mai Hoàng Phúc', dateOfBirth: '2011-05-26', gender: 'male', ethnicity: 'Kinh', religion: 'Không', hometown: 'Đà Nẵng', address: '77 Pasteur, Q. Hải Châu, Đà Nẵng', classId: 'CLS_8A1', status: 'studying' },
            { id: 'STU_016', userId: 'USR_STUDENT_016', code: 'HS114001', fullName: 'Trương Văn Đạt', dateOfBirth: '2011-02-08', gender: 'male', ethnicity: 'Kinh', religion: 'Không', hometown: 'Đà Nẵng', address: '55 Hoàng Văn Thụ, Q. Thanh Khê, Đà Nẵng', classId: 'CLS_8A2', status: 'studying' },
            { id: 'STU_017', userId: 'USR_STUDENT_017', code: 'HS114003', fullName: 'Nguyễn Hữu Toàn', dateOfBirth: '2011-10-22', gender: 'male', ethnicity: 'Kinh', religion: 'Không', hometown: 'Đà Nẵng', address: '18 Đinh Công Tráng, Q. Hải Châu, Đà Nẵng', classId: 'CLS_8A2', status: 'studying' },
            { id: 'STU_018', userId: 'USR_STUDENT_018', code: 'HS114004', fullName: 'Lưu Thị Kim Ngân', dateOfBirth: '2011-04-03', gender: 'female', ethnicity: 'Kinh', religion: 'Không', hometown: 'Đà Nẵng', address: '63 Tôn Đức Thắng, Q. Hải Châu, Đà Nẵng', classId: 'CLS_8A2', status: 'studying' },
            { id: 'STU_019', userId: 'USR_STUDENT_019', code: 'HS115023', fullName: 'Ngô Thị Thanh Tâm', dateOfBirth: '2011-06-14', gender: 'female', ethnicity: 'Tày', religion: 'Không', hometown: 'Quảng Nam', address: '44 Hùng Vương, Q. Hải Châu, Đà Nẵng', classId: 'CLS_8A3', status: 'studying', youthUnionJoinedAt: '2026-02-15' },
            { id: 'STU_020', userId: 'USR_STUDENT_020', code: 'HS111001', fullName: 'Bùi Thị Minh Thư', dateOfBirth: '2010-06-30', gender: 'female', ethnicity: 'Kinh', religion: 'Không', hometown: 'Đà Nẵng', address: '12 Lý Thường Kiệt, Q. Thanh Khê, Đà Nẵng', classId: 'CLS_9A1', status: 'studying', youthUnionJoinedAt: '2025-03-20' }
        ],

        parentStudentLinks: [
            { id: 'PAR_001', parentUserId: 'USR_PARENT_001', studentId: 'STU_001', relationship: 'Cha', isPrimaryGuardian: true },
            { id: 'PAR_002', parentUserId: 'USR_PARENT_002', studentId: 'STU_002', relationship: 'Cha', isPrimaryGuardian: true },
            { id: 'PAR_003', parentUserId: 'USR_PARENT_003', studentId: 'STU_003', relationship: 'Cha', isPrimaryGuardian: true },
            { id: 'PAR_004', parentUserId: 'USR_PARENT_004', studentId: 'STU_009', relationship: 'Cha', isPrimaryGuardian: true },
            { id: 'PAR_005', parentUserId: 'USR_PARENT_005', studentId: 'STU_006', relationship: 'Cha', isPrimaryGuardian: true },
            { id: 'PAR_006', parentUserId: 'USR_PARENT_006', studentId: 'STU_007', relationship: 'Cha', isPrimaryGuardian: true },
            { id: 'PAR_007', parentUserId: 'USR_PARENT_007', studentId: 'STU_008', relationship: 'Cha', isPrimaryGuardian: true },
            { id: 'PAR_008', parentUserId: 'USR_PARENT_008', studentId: 'STU_010', relationship: 'Cha', isPrimaryGuardian: true },
            { id: 'PAR_009', parentUserId: 'USR_PARENT_009', studentId: 'STU_005', relationship: 'Cha', isPrimaryGuardian: true },
            { id: 'PAR_010', parentUserId: 'USR_PARENT_010', studentId: 'STU_016', relationship: 'Cha', isPrimaryGuardian: true }
        ],

        gradeRecords: [
            { id: 'GRADE_001', studentId: 'STU_001', semesterId: 'SEM_2026_1', subjectId: 'SUB_MATH', oral: 8.5, fifteenMinutes: 9.0, onePeriod: 8.0, midterm: 8.8, final: 9.2, average: 8.8 },
            { id: 'GRADE_002', studentId: 'STU_001', semesterId: 'SEM_2026_1', subjectId: 'SUB_LIT',  oral: 7.5, fifteenMinutes: 8.0, onePeriod: 7.8, midterm: 8.0, final: 8.2, average: 8.0 },
            { id: 'GRADE_003', studentId: 'STU_001', semesterId: 'SEM_2026_1', subjectId: 'SUB_ENG',  oral: 9.0, fifteenMinutes: 9.2, onePeriod: 8.8, midterm: 9.0, final: 9.4, average: 9.1 },
            { id: 'GRADE_004', studentId: 'STU_001', semesterId: 'SEM_2026_1', subjectId: 'SUB_SCI',  oral: 8.0, fifteenMinutes: 8.5, onePeriod: 8.2, midterm: 8.5, final: 8.8, average: 8.5 },
            { id: 'GRADE_005', studentId: 'STU_001', semesterId: 'SEM_2026_1', subjectId: 'SUB_IT',   oral: 9.5, fifteenMinutes: 9.5, onePeriod: 9.0, midterm: 9.2, final: 9.5, average: 9.3 },
            { id: 'GRADE_006', studentId: 'STU_002', semesterId: 'SEM_2026_1', subjectId: 'SUB_MATH', oral: 7.5, fifteenMinutes: 7.8, onePeriod: 7.5, midterm: 7.8, final: 8.0, average: 7.7 },
            { id: 'GRADE_007', studentId: 'STU_002', semesterId: 'SEM_2026_1', subjectId: 'SUB_LIT',  oral: 8.5, fifteenMinutes: 8.5, onePeriod: 8.2, midterm: 8.5, final: 8.8, average: 8.5 },
            { id: 'GRADE_008', studentId: 'STU_003', semesterId: 'SEM_2026_1', subjectId: 'SUB_MATH', oral: 7.0, fifteenMinutes: 7.5, onePeriod: 7.2, midterm: 7.5, final: 7.8, average: 7.4 },
            { id: 'GRADE_009', studentId: 'STU_004', semesterId: 'SEM_2026_1', subjectId: 'SUB_MATH', oral: 8.0, fifteenMinutes: 8.5, onePeriod: 8.2, midterm: 8.5, final: 8.8, average: 8.4 },
            { id: 'GRADE_010', studentId: 'STU_005', semesterId: 'SEM_2026_1', subjectId: 'SUB_MATH', oral: 7.5, fifteenMinutes: 8.0, onePeriod: 7.8, midterm: 8.0, final: 8.2, average: 7.9 },
            { id: 'GRADE_011', studentId: 'STU_006', semesterId: 'SEM_2026_1', subjectId: 'SUB_MATH', oral: 8.5, fifteenMinutes: 9.0, onePeriod: 8.5, midterm: 8.8, final: 9.0, average: 8.8 },
            { id: 'GRADE_012', studentId: 'STU_007', semesterId: 'SEM_2026_1', subjectId: 'SUB_MATH', oral: 8.0, fifteenMinutes: 8.5, onePeriod: 8.0, midterm: 8.2, final: 8.5, average: 8.2 },
            { id: 'GRADE_013', studentId: 'STU_007', semesterId: 'SEM_2026_1', subjectId: 'SUB_PHY',  oral: 8.5, fifteenMinutes: 9.0, onePeriod: 8.8, midterm: 8.8, final: 9.2, average: 8.9 },
            { id: 'GRADE_014', studentId: 'STU_008', semesterId: 'SEM_2026_1', subjectId: 'SUB_MATH', oral: 7.5, fifteenMinutes: 8.0, onePeriod: 7.5, midterm: 7.8, final: 8.0, average: 7.7 },
            { id: 'GRADE_015', studentId: 'STU_009', semesterId: 'SEM_2026_1', subjectId: 'SUB_MATH', oral: 9.0, fifteenMinutes: 9.2, onePeriod: 9.0, midterm: 9.2, final: 9.5, average: 9.2 },
            { id: 'GRADE_016', studentId: 'STU_010', semesterId: 'SEM_2026_1', subjectId: 'SUB_MATH', oral: 8.0, fifteenMinutes: 8.5, onePeriod: 8.2, midterm: 8.5, final: 8.8, average: 8.4 },
            { id: 'GRADE_017', studentId: 'STU_001', semesterId: 'SEM_2026_2', subjectId: 'SUB_MATH', oral: 9.0, fifteenMinutes: 9.5, onePeriod: 9.0, midterm: 9.0, final: 9.5, average: 9.2 },
            { id: 'GRADE_018', studentId: 'STU_001', semesterId: 'SEM_2026_2', subjectId: 'SUB_LIT',  oral: 8.0, fifteenMinutes: 8.5, onePeriod: 8.5, midterm: 8.5, final: 9.0, average: 8.7 },
            { id: 'GRADE_019', studentId: 'STU_001', semesterId: 'SEM_2026_2', subjectId: 'SUB_ENG',  oral: 9.0, fifteenMinutes: 9.0, onePeriod: 9.0, midterm: 9.5, final: 9.2, average: 9.2 }
        ],

        semesterResults: [
            { id: 'RESULT_SEM_001', studentId: 'STU_001', semesterId: 'SEM_2026_1', average: 8.74, academicRank: 'Giỏi', conductRank: 'Tốt', autoGenerated: true },
            { id: 'RESULT_SEM_002', studentId: 'STU_002', semesterId: 'SEM_2026_1', average: 7.90, academicRank: 'Khá',  conductRank: 'Tốt', autoGenerated: true },
            { id: 'RESULT_SEM_003', studentId: 'STU_003', semesterId: 'SEM_2026_1', average: 7.50, academicRank: 'Khá',  conductRank: 'Khá', autoGenerated: true },
            { id: 'RESULT_SEM_004', studentId: 'STU_004', semesterId: 'SEM_2026_1', average: 8.20, academicRank: 'Giỏi', conductRank: 'Tốt', autoGenerated: true },
            { id: 'RESULT_SEM_005', studentId: 'STU_005', semesterId: 'SEM_2026_1', average: 7.80, academicRank: 'Khá',  conductRank: 'Tốt', autoGenerated: true },
            { id: 'RESULT_SEM_006', studentId: 'STU_006', semesterId: 'SEM_2026_1', average: 8.50, academicRank: 'Giỏi', conductRank: 'Tốt', autoGenerated: true },
            { id: 'RESULT_SEM_007', studentId: 'STU_007', semesterId: 'SEM_2026_1', average: 8.60, academicRank: 'Giỏi', conductRank: 'Tốt', autoGenerated: true },
            { id: 'RESULT_SEM_008', studentId: 'STU_008', semesterId: 'SEM_2026_1', average: 7.70, academicRank: 'Khá',  conductRank: 'Tốt', autoGenerated: true },
            { id: 'RESULT_SEM_009', studentId: 'STU_009', semesterId: 'SEM_2026_1', average: 9.10, academicRank: 'Giỏi', conductRank: 'Tốt', autoGenerated: true },
            { id: 'RESULT_SEM_010', studentId: 'STU_010', semesterId: 'SEM_2026_1', average: 8.20, academicRank: 'Giỏi', conductRank: 'Tốt', autoGenerated: true },
            { id: 'RESULT_SEM_011', studentId: 'STU_001', semesterId: 'SEM_2026_2', average: 9.03, academicRank: 'Giỏi', conductRank: 'Tốt', autoGenerated: true }
        ],

        yearResults: [
            { id: 'RESULT_YEAR_001', studentId: 'STU_001', schoolYearId: 'SY_2026_2027', average: 8.88, academicRank: 'Giỏi', conductRank: 'Tốt', autoGenerated: true },
            { id: 'RESULT_YEAR_002', studentId: 'STU_002', schoolYearId: 'SY_2026_2027', average: 7.90, academicRank: 'Khá',  conductRank: 'Tốt', autoGenerated: true },
            { id: 'RESULT_YEAR_003', studentId: 'STU_003', schoolYearId: 'SY_2026_2027', average: 7.50, academicRank: 'Khá',  conductRank: 'Khá', autoGenerated: true },
            { id: 'RESULT_YEAR_004', studentId: 'STU_004', schoolYearId: 'SY_2026_2027', average: 8.20, academicRank: 'Giỏi', conductRank: 'Tốt', autoGenerated: true },
            { id: 'RESULT_YEAR_005', studentId: 'STU_005', schoolYearId: 'SY_2026_2027', average: 7.80, academicRank: 'Khá',  conductRank: 'Tốt', autoGenerated: true },
            { id: 'RESULT_YEAR_006', studentId: 'STU_006', schoolYearId: 'SY_2026_2027', average: 8.50, academicRank: 'Giỏi', conductRank: 'Tốt', autoGenerated: true },
            { id: 'RESULT_YEAR_007', studentId: 'STU_007', schoolYearId: 'SY_2026_2027', average: 8.60, academicRank: 'Giỏi', conductRank: 'Tốt', autoGenerated: true },
            { id: 'RESULT_YEAR_008', studentId: 'STU_008', schoolYearId: 'SY_2026_2027', average: 7.70, academicRank: 'Khá',  conductRank: 'Tốt', autoGenerated: true },
            { id: 'RESULT_YEAR_009', studentId: 'STU_009', schoolYearId: 'SY_2026_2027', average: 9.10, academicRank: 'Giỏi', conductRank: 'Tốt', autoGenerated: true },
            { id: 'RESULT_YEAR_010', studentId: 'STU_010', schoolYearId: 'SY_2026_2027', average: 8.20, academicRank: 'Giỏi', conductRank: 'Tốt', autoGenerated: true },
            { id: 'RESULT_YEAR_011', studentId: 'STU_011', schoolYearId: 'SY_2026_2027', average: 7.60, academicRank: 'Khá',  conductRank: 'Tốt', autoGenerated: true },
            { id: 'RESULT_YEAR_012', studentId: 'STU_012', schoolYearId: 'SY_2026_2027', average: 8.10, academicRank: 'Giỏi', conductRank: 'Tốt', autoGenerated: true },
            { id: 'RESULT_YEAR_013', studentId: 'STU_013', schoolYearId: 'SY_2026_2027', average: 7.40, academicRank: 'Khá',  conductRank: 'Khá', autoGenerated: true },
            { id: 'RESULT_YEAR_014', studentId: 'STU_014', schoolYearId: 'SY_2026_2027', average: 7.80, academicRank: 'Khá',  conductRank: 'Tốt', autoGenerated: true },
            { id: 'RESULT_YEAR_015', studentId: 'STU_015', schoolYearId: 'SY_2026_2027', average: 6.90, academicRank: 'Khá',  conductRank: 'Khá', autoGenerated: true },
            { id: 'RESULT_YEAR_016', studentId: 'STU_016', schoolYearId: 'SY_2026_2027', average: 8.30, academicRank: 'Giỏi', conductRank: 'Tốt', autoGenerated: true },
            { id: 'RESULT_YEAR_017', studentId: 'STU_017', schoolYearId: 'SY_2026_2027', average: 7.90, academicRank: 'Khá',  conductRank: 'Tốt', autoGenerated: true },
            { id: 'RESULT_YEAR_018', studentId: 'STU_018', schoolYearId: 'SY_2026_2027', average: 8.00, academicRank: 'Giỏi', conductRank: 'Tốt', autoGenerated: true },
            { id: 'RESULT_YEAR_019', studentId: 'STU_019', schoolYearId: 'SY_2026_2027', average: 7.50, academicRank: 'Khá',  conductRank: 'Tốt', autoGenerated: true },
            { id: 'RESULT_YEAR_020', studentId: 'STU_020', schoolYearId: 'SY_2026_2027', average: 8.70, academicRank: 'Giỏi', conductRank: 'Tốt', autoGenerated: true }
        ],

        attendanceRecords: [
            { id: 'ATT_001', studentId: 'STU_001', date: '2026-05-12', session: 'morning',   type: 'excused_absence',   reason: 'Khám bệnh định kỳ',      confirmedBy: 'TEA_001' },
            { id: 'ATT_002', studentId: 'STU_001', date: '2026-03-05', session: 'afternoon',  type: 'late',               reason: 'Kẹt xe, trễ 15 phút',    confirmedBy: 'TEA_001' },
            { id: 'ATT_003', studentId: 'STU_002', date: '2026-04-10', session: 'morning',    type: 'excused_absence',   reason: 'Ốm, có đơn bác sĩ',      confirmedBy: 'TEA_001' },
            { id: 'ATT_004', studentId: 'STU_003', date: '2026-05-20', session: 'full_day',   type: 'excused_absence',   reason: 'Việc gia đình',           confirmedBy: 'TEA_001' },
            { id: 'ATT_005', studentId: 'STU_004', date: '2026-06-01', session: 'morning',    type: 'unexcused_absence', reason: '',                        confirmedBy: 'TEA_002' },
            { id: 'ATT_006', studentId: 'STU_005', date: '2026-04-15', session: 'afternoon',  type: 'late',               reason: 'Trễ xe buýt',             confirmedBy: 'TEA_002' },
            { id: 'ATT_007', studentId: 'STU_006', date: '2026-05-08', session: 'morning',    type: 'excused_absence',   reason: 'Dự cuộc thi tỉnh',        confirmedBy: 'TEA_003' },
            { id: 'ATT_008', studentId: 'STU_007', date: '2026-03-22', session: 'morning',    type: 'excused_absence',   reason: 'Khám sức khỏe',           confirmedBy: 'TEA_003' },
            { id: 'ATT_009', studentId: 'STU_009', date: '2026-06-10', session: 'afternoon',  type: 'late',               reason: 'Kẹt đường',               confirmedBy: 'TEA_004' },
            { id: 'ATT_010', studentId: 'STU_010', date: '2026-05-25', session: 'morning',    type: 'excused_absence',   reason: 'Ốm sốt, xin phép',       confirmedBy: 'TEA_004' }
        ],

        timetableEntries: [
            { id:'TTB_001', classId:'CLS_7A1', semesterId:'SEM_2026_1', weekday:2, period:1, subjectId:'SUB_MATH', teacherId:'TEA_001', room:'P.201' },
            { id:'TTB_002', classId:'CLS_7A1', semesterId:'SEM_2026_1', weekday:2, period:2, subjectId:'SUB_LIT',  teacherId:'TEA_002', room:'P.201' },
            { id:'TTB_003', classId:'CLS_7A1', semesterId:'SEM_2026_1', weekday:2, period:6, subjectId:'SUB_IT',   teacherId:'TEA_004', room:'P.Tin học' },
            { id:'TTB_004', classId:'CLS_7A1', semesterId:'SEM_2026_1', weekday:3, period:1, subjectId:'SUB_ENG',  teacherId:'TEA_003', room:'P.201' },
            { id:'TTB_005', classId:'CLS_7A1', semesterId:'SEM_2026_1', weekday:3, period:6, subjectId:'SUB_PE',   teacherId:'TEA_004', room:'Nhà đa năng' },
            { id:'TTB_006', classId:'CLS_7A1', semesterId:'SEM_2026_1', weekday:4, period:1, subjectId:'SUB_SCI',  teacherId:'TEA_004', room:'P.KHTN' },
            { id:'TTB_007', classId:'CLS_7A1', semesterId:'SEM_2026_1', weekday:4, period:3, subjectId:'SUB_MATH', teacherId:'TEA_001', room:'P.201' },
            { id:'TTB_008', classId:'CLS_7A1', semesterId:'SEM_2026_1', weekday:5, period:1, subjectId:'SUB_HIS',  teacherId:'TEA_002', room:'P.201' },
            { id:'TTB_009', classId:'CLS_7A1', semesterId:'SEM_2026_1', weekday:5, period:3, subjectId:'SUB_ENG',  teacherId:'TEA_003', room:'P.201' },
            { id:'TTB_010', classId:'CLS_7A1', semesterId:'SEM_2026_1', weekday:6, period:1, subjectId:'SUB_LIT',  teacherId:'TEA_002', room:'P.201' },
            { id:'TTB_011', classId:'CLS_7A1', semesterId:'SEM_2026_1', weekday:6, period:3, subjectId:'SUB_GEO',  teacherId:'TEA_002', room:'P.201' },
            { id:'TTB_012', classId:'CLS_7A1', semesterId:'SEM_2026_1', weekday:7, period:1, subjectId:'SUB_CIVIC',teacherId:'TEA_002', room:'P.201' },
            { id:'TTB_013', classId:'CLS_7A1', semesterId:'SEM_2026_1', weekday:7, period:3, subjectId:'SUB_MUSIC',teacherId:'TEA_003', room:'P.Âm nhạc' },
            { id:'TTB_014', classId:'CLS_8A1', semesterId:'SEM_2026_1', weekday:2, period:1, subjectId:'SUB_MATH', teacherId:'TEA_001', room:'P.202' },
            { id:'TTB_015', classId:'CLS_8A1', semesterId:'SEM_2026_1', weekday:2, period:3, subjectId:'SUB_PHY',  teacherId:'TEA_004', room:'P.Thí nghiệm' },
            { id:'TTB_016', classId:'CLS_8A1', semesterId:'SEM_2026_1', weekday:3, period:1, subjectId:'SUB_CHEM', teacherId:'TEA_004', room:'P.Thí nghiệm' },
            { id:'TTB_017', classId:'CLS_8A1', semesterId:'SEM_2026_1', weekday:4, period:1, subjectId:'SUB_ENG',  teacherId:'TEA_003', room:'P.202' },
            { id:'TTB_018', classId:'CLS_8A2', semesterId:'SEM_2026_1', weekday:2, period:1, subjectId:'SUB_MATH', teacherId:'TEA_001', room:'P.203' },
            { id:'TTB_019', classId:'CLS_8A2', semesterId:'SEM_2026_1', weekday:3, period:1, subjectId:'SUB_LIT',  teacherId:'TEA_002', room:'P.203' },
            { id:'TTB_020', classId:'CLS_9A1', semesterId:'SEM_2026_1', weekday:2, period:1, subjectId:'SUB_MATH', teacherId:'TEA_001', room:'P.301' }
        ],

        examSchedules: [
            { id:'EXAM_001', classId:'CLS_7A1', semesterId:'SEM_2026_1', subjectId:'SUB_MATH', date:'2026-12-21', startTime:'07:30', durationMinutes:90, room:'P.201', format:'Tự luận' },
            { id:'EXAM_002', classId:'CLS_7A1', semesterId:'SEM_2026_1', subjectId:'SUB_LIT',  date:'2026-12-22', startTime:'07:30', durationMinutes:90, room:'P.201', format:'Tự luận' },
            { id:'EXAM_003', classId:'CLS_7A1', semesterId:'SEM_2026_1', subjectId:'SUB_ENG',  date:'2026-12-23', startTime:'07:30', durationMinutes:60, room:'P.201', format:'Trắc nghiệm' },
            { id:'EXAM_004', classId:'CLS_7A1', semesterId:'SEM_2026_1', subjectId:'SUB_SCI',  date:'2026-12-24', startTime:'07:30', durationMinutes:60, room:'P.201', format:'Trắc nghiệm' },
            { id:'EXAM_005', classId:'CLS_8A1', semesterId:'SEM_2026_1', subjectId:'SUB_MATH', date:'2026-12-21', startTime:'09:30', durationMinutes:90, room:'P.202', format:'Tự luận' },
            { id:'EXAM_006', classId:'CLS_8A1', semesterId:'SEM_2026_1', subjectId:'SUB_PHY',  date:'2026-12-22', startTime:'09:30', durationMinutes:60, room:'P.202', format:'Tự luận' },
            { id:'EXAM_007', classId:'CLS_8A2', semesterId:'SEM_2026_1', subjectId:'SUB_MATH', date:'2026-12-21', startTime:'13:30', durationMinutes:90, room:'P.203', format:'Tự luận' },
            { id:'EXAM_008', classId:'CLS_9A1', semesterId:'SEM_2026_1', subjectId:'SUB_MATH', date:'2026-12-20', startTime:'07:30', durationMinutes:120,room:'P.301', format:'Tự luận' }
        ],

        achievements: [
            { id:'ACH_001', code:'TT001', studentId:'STU_001', title:'Học sinh Giỏi xuất sắc khối 7',           category:'academic',           level:'school',   organizer:'Trường THCS Nguyễn Văn Cừ',     issuedDate:'2026-08-03', description:'Danh hiệu HS giỏi xuất sắc khối 7.',                  status:'pending',      submittedBy:'USR_STUDENT_001', approvedBy:null,           approvedAt:null },
            { id:'ACH_002', code:'TT002', studentId:'STU_002', title:'Giải Nhì văn nghị luận cấp trường',       category:'arts',               level:'school',   organizer:'Trường THCS Nguyễn Văn Cừ',     issuedDate:'2026-04-15', description:'Giải Nhì cuộc thi văn nghị luận.',                    status:'request_more', submittedBy:'USR_STUDENT_002', approvedBy:null,           approvedAt:null },
            { id:'ACH_003', code:'TT003', studentId:'STU_009', title:'Học sinh xuất sắc toàn diện 8A2',         category:'academic',           level:'school',   organizer:'Trường THCS Nguyễn Văn Cừ',     issuedDate:'2026-05-25', description:'Danh hiệu HS xuất sắc toàn diện lớp 8A2.',            status:'approved',     submittedBy:'USR_STUDENT_009', approvedBy:'USR_TEACHER_001', approvedAt:'2026-05-27T09:00:00+07:00' },
            { id:'ACH_004', code:'TT004', studentId:'STU_005', title:'Cán bộ Đoàn xuất sắc 2026',               category:'movement',           level:'school',   organizer:'Đoàn trường',                   issuedDate:'2026-05-20', description:'Hoàn thành xuất sắc công tác phong trào.',            status:'approved',     submittedBy:'USR_STUDENT_005', approvedBy:'USR_TEACHER_001', approvedAt:'2026-05-22T10:00:00+07:00' },
            { id:'ACH_005', code:'TT005', studentId:'STU_007', title:'Giải Nhì HSG Thành phố môn Vật lý',       category:'academic',           level:'city',     organizer:'Sở Giáo dục và Đào tạo Đà Nẵng', issuedDate:'2026-03-18', description:'Giải Nhì kỳ thi HS giỏi môn Vật lý cấp thành phố.', status:'approved',     submittedBy:'USR_STUDENT_007', approvedBy:'USR_ADMIN_001',  approvedAt:'2026-03-20T08:30:00+07:00' },
            { id:'ACH_006', code:'TT006', studentId:'STU_003', title:'Học sinh Tiên Tiến học kỳ I',              category:'academic',           level:'school',   organizer:'Trường THCS Nguyễn Văn Cừ',     issuedDate:'2026-12-28', description:'Danh hiệu HS tiên tiến học kỳ I.',                    status:'approved',     submittedBy:'USR_STUDENT_003', approvedBy:'USR_TEACHER_001', approvedAt:'2026-12-29T08:00:00+07:00' },
            { id:'ACH_007', code:'TT007', studentId:'STU_004', title:'Giải Nhì Olympic Toán cấp quận',           category:'academic',           level:'district', organizer:'Phòng GD&ĐT Quận Hải Châu',     issuedDate:'2026-04-02', description:'Giải Nhì Olympic Toán cấp quận.',                     status:'pending',      submittedBy:'USR_STUDENT_004', approvedBy:null,           approvedAt:null },
            { id:'ACH_008', code:'TT008', studentId:'STU_008', title:'Giải Ba cuộc thi Khoa học kỹ thuật',       category:'science_technology', level:'city',     organizer:'Sở Giáo dục và Đào tạo Đà Nẵng', issuedDate:'2026-02-21', description:'Giải Ba cuộc thi KHKT cấp thành phố.',                status:'approved',     submittedBy:'USR_STUDENT_008', approvedBy:'USR_ADMIN_001',  approvedAt:'2026-02-23T14:00:00+07:00' },
            { id:'ACH_009', code:'TT009', studentId:'STU_010', title:'Huy chương Đồng bơi lội cấp quận',         category:'sports',             level:'district', organizer:'Trung tâm VHTT Quận Hải Châu',   issuedDate:'2026-03-10', description:'Huy chương Đồng nội dung bơi tự do 100m.',            status:'approved',     submittedBy:'USR_STUDENT_010', approvedBy:'USR_TEACHER_001', approvedAt:'2026-03-12T09:15:00+07:00' },
            { id:'ACH_010', code:'TT010', studentId:'STU_006', title:'Giải Nhất cuộc thi KHKT cấp trường',       category:'science_technology', level:'school',   organizer:'Trường THCS Nguyễn Văn Cừ',     issuedDate:'2026-01-20', description:'Sản phẩm sáng tạo hỗ trợ học tập.',                  status:'approved',     submittedBy:'USR_STUDENT_006', approvedBy:'USR_TEACHER_001', approvedAt:'2026-01-22T13:00:00+07:00' },
            { id:'ACH_011', code:'TT011', studentId:'STU_011', title:'Học sinh Giỏi học kỳ I lớp 7A1',           category:'academic',           level:'school',   organizer:'Trường THCS Nguyễn Văn Cừ',     issuedDate:'2026-12-30', description:'Danh hiệu HS giỏi học kỳ I.',                         status:'approved',     submittedBy:'USR_STUDENT_011', approvedBy:'USR_TEACHER_001', approvedAt:'2026-12-31T08:00:00+07:00' },
            { id:'ACH_012', code:'TT012', studentId:'STU_012', title:'Giải Nhất văn nghệ liên trường 2026',       category:'arts',               level:'district', organizer:'Phòng GD&ĐT Quận Hải Châu',     issuedDate:'2026-05-05', description:'Giải Nhất tiết mục múa liên trường THCS.',            status:'approved',     submittedBy:'USR_STUDENT_012', approvedBy:'USR_ADMIN_001',  approvedAt:'2026-05-07T10:00:00+07:00' },
            { id:'ACH_013', code:'TT013', studentId:'STU_013', title:'Học sinh Tiên Tiến học kỳ I lớp 7A2',      category:'academic',           level:'school',   organizer:'Trường THCS Nguyễn Văn Cừ',     issuedDate:'2026-12-30', description:'Danh hiệu HS tiên tiến HK I lớp 7A2.',               status:'pending',      submittedBy:'USR_STUDENT_013', approvedBy:null,           approvedAt:null },
            { id:'ACH_014', code:'TT014', studentId:'STU_014', title:'Giải Nhì cờ vua nữ cấp trường',            category:'sports',             level:'school',   organizer:'Trường THCS Nguyễn Văn Cừ',     issuedDate:'2026-04-20', description:'Giải Nhì cuộc thi cờ vua nội trường.',               status:'approved',     submittedBy:'USR_STUDENT_014', approvedBy:'USR_TEACHER_001', approvedAt:'2026-04-22T08:00:00+07:00' },
            { id:'ACH_015', code:'TT015', studentId:'STU_015', title:'Học sinh xuất sắc lớp 8A1',                 category:'academic',           level:'school',   organizer:'Trường THCS Nguyễn Văn Cừ',     issuedDate:'2026-05-25', description:'Danh hiệu HS xuất sắc tiêu biểu lớp 8A1.',           status:'approved',     submittedBy:'USR_STUDENT_015', approvedBy:'USR_TEACHER_001', approvedAt:'2026-05-26T09:00:00+07:00' },
            { id:'ACH_016', code:'TT016', studentId:'STU_016', title:'Giải Ba điền kinh cấp quận',                category:'sports',             level:'district', organizer:'Trung tâm VHTT Quận Thanh Khê',  issuedDate:'2026-04-08', description:'Giải Ba nội dung chạy 200m.',                         status:'approved',     submittedBy:'USR_STUDENT_016', approvedBy:'USR_ADMIN_001',  approvedAt:'2026-04-10T14:00:00+07:00' },
            { id:'ACH_017', code:'TT017', studentId:'STU_017', title:'Giải Khuyến khích lập trình trẻ',          category:'science_technology', level:'city',     organizer:'Sở TTTT Đà Nẵng',              issuedDate:'2026-03-25', description:'Giải Khuyến khích cuộc thi Lập trình trẻ thành phố.',status:'request_more', submittedBy:'USR_STUDENT_017', approvedBy:null,           approvedAt:null },
            { id:'ACH_018', code:'TT018', studentId:'STU_018', title:'Học sinh Giỏi toàn diện năm học 2026',     category:'academic',           level:'school',   organizer:'Trường THCS Nguyễn Văn Cừ',     issuedDate:'2026-05-30', description:'Danh hiệu HS giỏi toàn diện cuối năm.',               status:'approved',     submittedBy:'USR_STUDENT_018', approvedBy:'USR_TEACHER_001', approvedAt:'2026-06-01T08:00:00+07:00' },
            { id:'ACH_019', code:'TT019', studentId:'STU_019', title:'Giải Nhì nghiên cứu khoa học',              category:'science_technology', level:'school',   organizer:'Trường THCS Nguyễn Văn Cừ',     issuedDate:'2026-01-15', description:'Giải Nhì cuộc thi NCKH học sinh toàn trường.',        status:'approved',     submittedBy:'USR_STUDENT_019', approvedBy:'USR_ADMIN_001',  approvedAt:'2026-01-17T10:00:00+07:00' },
            { id:'ACH_020', code:'TT020', studentId:'STU_020', title:'Học sinh Giỏi xuất sắc khối 9',            category:'academic',           level:'school',   organizer:'Trường THCS Nguyễn Văn Cừ',     issuedDate:'2026-05-28', description:'Danh hiệu HS giỏi xuất sắc tiêu biểu khối 9.',       status:'approved',     submittedBy:'USR_STUDENT_020', approvedBy:'USR_TEACHER_001', approvedAt:'2026-05-29T09:00:00+07:00' }
        ],

        achievementFiles: [
            { id:'ACH_FILE_001', achievementId:'ACH_001', name:'Bang_Khen_HS_Gioi_Xuat_Sac_Khoi7.pdf',        type:'application/pdf', size:245760, url:'assets/demo/ACH_001.pdf' },
            { id:'ACH_FILE_002', achievementId:'ACH_002', name:'Minh_Chung_Giai_Nhi_Van_Nghi_Luan.pdf',       type:'application/pdf', size:198000, url:'assets/demo/ACH_002.pdf' },
            { id:'ACH_FILE_003', achievementId:'ACH_005', name:'Giay_CN_Giai_Nhi_Vat_Ly_TP.pdf',             type:'application/pdf', size:310000, url:'assets/demo/ACH_005.pdf' },
            { id:'ACH_FILE_004', achievementId:'ACH_008', name:'Giay_CN_Giai_Ba_KHKT_TP.pdf',                type:'application/pdf', size:280000, url:'assets/demo/ACH_008.pdf' },
            { id:'ACH_FILE_005', achievementId:'ACH_009', name:'Huy_Chuong_Dong_Boi_Loi.jpg',               type:'image/jpeg',      size:152000, url:'assets/demo/ACH_009.jpg' },
            { id:'ACH_FILE_006', achievementId:'ACH_010', name:'Giay_CN_Giai_Nhat_KHKT_Truong.pdf',         type:'application/pdf', size:220000, url:'assets/demo/ACH_010.pdf' },
            { id:'ACH_FILE_007', achievementId:'ACH_012', name:'Giay_CN_Giai_Nhat_Van_Nghe_Lien_Truong.pdf',type:'application/pdf', size:195000, url:'assets/demo/ACH_012.pdf' },
            { id:'ACH_FILE_008', achievementId:'ACH_016', name:'Giay_CN_Giai_Ba_Dien_Kinh.pdf',             type:'application/pdf', size:175000, url:'assets/demo/ACH_016.pdf' },
            { id:'ACH_FILE_009', achievementId:'ACH_019', name:'Giay_CN_Giai_Nhi_NCKH.pdf',                 type:'application/pdf', size:230000, url:'assets/demo/ACH_019.pdf' },
            { id:'ACH_FILE_010', achievementId:'ACH_020', name:'Bang_Khen_HS_Gioi_Xuat_Sac_Khoi9.pdf',      type:'application/pdf', size:260000, url:'assets/demo/ACH_020.pdf' }
        ],

        achievementReviews: [
            { id:'ACH_REVIEW_001', achievementId:'ACH_002', reviewerId:'USR_TEACHER_001', action:'request_more', note:'Vui lòng bổ sung ảnh hoặc giấy chứng nhận rõ thông tin đơn vị tổ chức.',   reviewedAt:'2026-04-17T08:30:00+07:00' },
            { id:'ACH_REVIEW_002', achievementId:'ACH_017', reviewerId:'USR_ADMIN_001',   action:'request_more', note:'Minh chứng chưa rõ ràng, vui lòng đính kèm quyết định khen thưởng chính thức.', reviewedAt:'2026-03-27T10:00:00+07:00' }
        ],

        portfolios: [
            { id:'PORT_001', studentId:'STU_001', status:'saved',  title:'Hồ sơ năng lực - Nguyễn Văn Hoàng Anh',   updatedAt:'2026-08-03T16:00:00+07:00' },
            { id:'PORT_002', studentId:'STU_002', status:'draft',  title:'Hồ sơ năng lực - Đặng Mai Phương Thảo',   updatedAt:'2026-07-20T10:00:00+07:00' },
            { id:'PORT_003', studentId:'STU_006', status:'saved',  title:'Hồ sơ năng lực - Cao Thị Mỹ Linh',        updatedAt:'2026-08-01T09:00:00+07:00' },
            { id:'PORT_004', studentId:'STU_007', status:'shared', title:'Hồ sơ năng lực - Đinh Quốc Hùng',         updatedAt:'2026-07-30T14:00:00+07:00' },
            { id:'PORT_005', studentId:'STU_009', status:'saved',  title:'Hồ sơ năng lực - Vũ Hoàng Bảo Lâm',       updatedAt:'2026-08-02T11:00:00+07:00' },
            { id:'PORT_006', studentId:'STU_020', status:'saved',  title:'Hồ sơ năng lực - Bùi Thị Minh Thư',       updatedAt:'2026-08-03T08:00:00+07:00' }
        ],

        portfolioSections: [
            { id:'PORT_SEC_001', portfolioId:'PORT_001', type:'activities',      title:'Hoạt động ngoại khóa',  content:['Trưởng ban Nội dung CLB STEM trường Nguyễn Văn Cừ','Tình nguyện viên chương trình Áo ấm cho em 2025'], editable:true },
            { id:'PORT_SEC_002', portfolioId:'PORT_001', type:'certificates',    title:'Chứng chỉ & kỹ năng',   content:['Chứng chỉ Cambridge KET / B1 Preliminary (Merit)','Lập trình Python cơ bản - EduPortal'], editable:true },
            { id:'PORT_SEC_003', portfolioId:'PORT_001', type:'learning_results',title:'Kết quả học tập',        content:{ yearResultId:'RESULT_YEAR_001' }, editable:false, autoGenerated:true },
            { id:'PORT_SEC_004', portfolioId:'PORT_001', type:'achievements',    title:'Thành tích',             content:{ achievementIds:['ACH_003','ACH_010'] }, editable:false, autoGenerated:true },
            { id:'PORT_SEC_005', portfolioId:'PORT_001', type:'skills',          title:'Kỹ năng',               content:[{name:'Tư duy logic',level:5},{name:'Làm việc nhóm',level:4},{name:'Thuyết trình',level:4}], editable:true },
            { id:'PORT_SEC_006', portfolioId:'PORT_001', type:'products',        title:'Sản phẩm học tập',      content:['Mô hình Robot dọn rác mini tự động','Website sơ đồ tư duy Lịch sử địa phương'], editable:true },
            { id:'PORT_SEC_007', portfolioId:'PORT_001', type:'roadmap',         title:'Lộ trình phát triển',   content:['2024: Gia nhập CLB Tin học & STEM','2025–2026: Tham gia đội tuyển HSG cấp Quận'], editable:true },
            { id:'PORT_SEC_008', portfolioId:'PORT_001', type:'goals',           title:'Mục tiêu phát triển',   content:{short:'Hoàn thành tốt HK II với điểm trên 9.0',medium:'Đạt danh hiệu HS Xuất sắc cuối năm',long:'Thi đậu lớp chuyên Tin/Toán'}, editable:true },
            { id:'PORT_SEC_009', portfolioId:'PORT_001', type:'personality',     title:'Cá tính & phương pháp', content:{hobbies:'Đọc sách khoa học, chơi bóng đá',favoriteSubject:'Toán, Tiếng Anh, Tin học',studyMethod:'Học qua ví dụ thực tế và dự án nhóm',motto:'Học để biết và để làm'}, editable:true },
            { id:'PORT_SEC_010', portfolioId:'PORT_003', type:'activities',      title:'Hoạt động ngoại khóa',  content:['Thành viên CLB Nghiên cứu Khoa học','Tham gia đội tuyển KHKT cấp trường'], editable:true },
            { id:'PORT_SEC_011', portfolioId:'PORT_003', type:'achievements',    title:'Thành tích',             content:{ achievementIds:['ACH_010','ACH_015'] }, editable:false, autoGenerated:true },
            { id:'PORT_SEC_012', portfolioId:'PORT_004', type:'achievements',    title:'Thành tích',             content:{ achievementIds:['ACH_005','ACH_007'] }, editable:false, autoGenerated:true },
            { id:'PORT_SEC_013', portfolioId:'PORT_004', type:'skills',          title:'Kỹ năng',               content:[{name:'Vật lý thực nghiệm',level:5},{name:'Tư duy phân tích',level:5},{name:'Làm việc nhóm',level:4}], editable:true },
            { id:'PORT_SEC_014', portfolioId:'PORT_005', type:'activities',      title:'Hoạt động ngoại khóa',  content:['Đội trưởng đội bóng đá 8A2','Tham gia CLB Thể thao trường'], editable:true },
            { id:'PORT_SEC_015', portfolioId:'PORT_005', type:'achievements',    title:'Thành tích',             content:{ achievementIds:['ACH_003','ACH_009'] }, editable:false, autoGenerated:true },
            { id:'PORT_SEC_016', portfolioId:'PORT_006', type:'achievements',    title:'Thành tích',             content:{ achievementIds:['ACH_020'] }, editable:false, autoGenerated:true },
            { id:'PORT_SEC_017', portfolioId:'PORT_006', type:'certificates',    title:'Chứng chỉ & kỹ năng',   content:['IELTS 6.5 (2026)','Chứng chỉ Tin học nâng cao'], editable:true }
        ],

        portfolioHistory: [
            { id:'PORT_HIST_001', portfolioId:'PORT_001', action:'saved',  actorId:'USR_STUDENT_001', occurredAt:'2026-08-03T16:00:00+07:00' },
            { id:'PORT_HIST_002', portfolioId:'PORT_001', action:'saved',  actorId:'USR_STUDENT_001', occurredAt:'2026-07-15T09:30:00+07:00' },
            { id:'PORT_HIST_003', portfolioId:'PORT_003', action:'saved',  actorId:'USR_STUDENT_006', occurredAt:'2026-08-01T09:00:00+07:00' },
            { id:'PORT_HIST_004', portfolioId:'PORT_004', action:'shared', actorId:'USR_STUDENT_007', occurredAt:'2026-07-30T14:00:00+07:00' },
            { id:'PORT_HIST_005', portfolioId:'PORT_005', action:'saved',  actorId:'USR_STUDENT_009', occurredAt:'2026-08-02T11:00:00+07:00' }
        ],

        selfAssessments: [
            { id:'SELF_001', studentId:'STU_001', schoolYearId:'SY_2026_2027', strengths:'Chủ động học tập, yêu thích Tin học và làm việc nhóm.', improvements:'Cần cải thiện kỹ năng thuyết trình trước đám đông.', updatedAt:'2026-08-01T10:00:00+07:00' },
            { id:'SELF_002', studentId:'STU_006', schoolYearId:'SY_2026_2027', strengths:'Đam mê nghiên cứu khoa học, tư duy sáng tạo tốt.', improvements:'Cần cải thiện kỹ năng quản lý thời gian.', updatedAt:'2026-07-28T09:00:00+07:00' },
            { id:'SELF_003', studentId:'STU_007', schoolYearId:'SY_2026_2027', strengths:'Giỏi Vật lý, có tư duy logic tốt, tích cực trong giờ học.', improvements:'Cần cải thiện điểm Ngữ văn và Tiếng Anh.', updatedAt:'2026-07-30T14:00:00+07:00' },
            { id:'SELF_004', studentId:'STU_009', schoolYearId:'SY_2026_2027', strengths:'Kỹ năng thể thao xuất sắc, tinh thần đồng đội cao.', improvements:'Cần dành thêm thời gian cho các môn lý thuyết.', updatedAt:'2026-08-02T11:00:00+07:00' },
            { id:'SELF_005', studentId:'STU_020', schoolYearId:'SY_2026_2027', strengths:'Học lực giỏi toàn diện, có định hướng nghề nghiệp rõ ràng.', improvements:'Cần phát triển thêm kỹ năng lãnh đạo và giao tiếp.', updatedAt:'2026-08-03T08:00:00+07:00' }
        ],

        notifications: [
            { id:'NOTI_001', userId:'USR_TEACHER_001', type:'achievement_pending',      title:'Thành tích mới chờ phê duyệt',           message:'Nguyễn Văn Hoàng Anh gửi: Học sinh Giỏi xuất sắc khối 7.',        read:false, createdAt:'2026-08-03T16:05:00+07:00' },
            { id:'NOTI_002', userId:'USR_STUDENT_002', type:'achievement_request_more', title:'Yêu cầu bổ sung minh chứng',              message:'Giải Nhì văn nghị luận cần bổ sung giấy chứng nhận.',              read:false, createdAt:'2026-04-17T08:31:00+07:00' },
            { id:'NOTI_003', userId:'USR_TEACHER_001', type:'achievement_pending',      title:'Thành tích mới chờ phê duyệt',           message:'Phạm Hoàng Phương Nghi gửi: Giải Nhì Olympic Toán cấp quận.',     read:false, createdAt:'2026-04-02T09:00:00+07:00' },
            { id:'NOTI_004', userId:'USR_ADMIN_001',   type:'achievement_pending',      title:'Thành tích mới chờ phê duyệt',           message:'Lê Minh Tuấn gửi: Học sinh Tiên Tiến HK I.',                      read:true,  createdAt:'2026-12-30T08:00:00+07:00' },
            { id:'NOTI_005', userId:'USR_STUDENT_007', type:'achievement_approved',     title:'Thành tích đã được phê duyệt',           message:'Giải Nhì HSG Thành phố môn Vật lý đã được xác nhận.',             read:false, createdAt:'2026-03-20T08:30:00+07:00' },
            { id:'NOTI_006', userId:'USR_STUDENT_017', type:'achievement_request_more', title:'Yêu cầu bổ sung minh chứng',              message:'Giải KK lập trình trẻ cần bổ sung quyết định khen thưởng.',       read:false, createdAt:'2026-03-27T10:00:00+07:00' },
            { id:'NOTI_007', userId:'USR_TEACHER_001', type:'grade_updated',            title:'Kết quả học tập đã được cập nhật',       message:'Điểm HK I lớp 7A1 đã được nhập đầy đủ.',                         read:true,  createdAt:'2026-12-31T17:00:00+07:00' },
            { id:'NOTI_008', userId:'USR_ADMIN_001',   type:'portfolio_updated',        title:'Hồ sơ năng lực được cập nhật',           message:'Đinh Quốc Hùng vừa chia sẻ hồ sơ năng lực.',                     read:true,  createdAt:'2026-07-30T14:00:00+07:00' }
        ],
        ],

        systemSettings: [
            { id:'SETTING_001', key:'currentSchoolYearId',          value:'SY_2026_2027' },
            { id:'SETTING_002', key:'achievementEditableStatuses',  value:['pending', 'request_more'] },
            { id:'SETTING_003', key:'toastPosition',                value:'bottom-left' },
            { id:'SETTING_004', key:'schoolName',                   value:'Trường THCS Nguyễn Văn Cừ' },
            { id:'SETTING_005', key:'schoolAddress',                value:'123 Lê Lợi, Phường Hải Châu I, Quận Hải Châu, Thành phố Đà Nẵng' },
            { id:'SETTING_006', key:'schoolPhone',                  value:'0236 123 4567' },
            { id:'SETTING_007', key:'schoolEmail',                  value:'contact@thcsnvc.edu.vn' },
            { id:'SETTING_008', key:'gradingScale',                 value:10 },
            { id:'SETTING_009', key:'passingScore',                 value:5.0 },
            { id:'SETTING_010', key:'excellentScore',               value:8.0 },
            { id:'SETTING_011', key:'maxAbsentDays',                value:3 }
        ],

        newsItems: [
            { id:'NEWS_001', title:'Khai giảng năm học 2026-2027',                       category:'Sự kiện',    publishedAt:'2026-08-15', author:'USR_ADMIN_001', content:'Trường THCS Nguyễn Văn Cừ long trọng tổ chức lễ khai giảng năm học 2026-2027 với sự tham dự của toàn thể cán bộ, giáo viên và học sinh.', status:'published' },
            { id:'NEWS_002', title:'Thông báo lịch thi học kỳ I năm học 2026-2027',      category:'Thông báo',  publishedAt:'2026-12-01', author:'USR_ADMIN_001', content:'Phòng Khảo thí thông báo lịch thi chính thức học kỳ I từ ngày 20/12/2026. Học sinh cần chuẩn bị đầy đủ dụng cụ và có mặt đúng giờ.', status:'published' },
            { id:'NEWS_003', title:'Kết quả cuộc thi Khoa học kỹ thuật cấp thành phố',  category:'Thành tích', publishedAt:'2026-02-24', author:'USR_TEACHER_001', content:'Học sinh Đinh Quốc Hùng và Cao Thị Mỹ Linh đã xuất sắc đoạt giải tại cuộc thi KHKT cấp thành phố.', status:'published' },
            { id:'NEWS_004', title:'Chương trình tình nguyện "Áo ấm cho em 2025"',       category:'Hoạt động',  publishedAt:'2025-12-10', author:'USR_TEACHER_001', content:'Đoàn trường tổ chức thành công chương trình tình nguyện Áo ấm cho em, quyên góp được hơn 200 áo ấm cho học sinh vùng khó khăn.', status:'published' },
            { id:'NEWS_005', title:'Hội thao truyền thống năm học 2026',                 category:'Sự kiện',    publishedAt:'2026-04-25', author:'USR_ADMIN_002', content:'Ngày hội thao thường niên của trường diễn ra sôi nổi với sự tham gia của toàn thể học sinh. Lớp 8A2 đoạt chức vô địch bóng đá.', status:'published' },
            { id:'NEWS_006', title:'Thông báo tuyển sinh lớp 6 năm học 2027-2028',       category:'Tuyển sinh', publishedAt:'2026-11-01', author:'USR_ADMIN_001', content:'Trường THCS Nguyễn Văn Cừ thông báo kế hoạch tuyển sinh lớp 6 năm học 2027-2028. Hồ sơ nhận từ ngày 01/01/2027.', status:'published' }
        ]
    };

    global.SPMSSeedData = SPMS_SEED_DATA;
})(typeof window !== 'undefined' ? window : globalThis);
