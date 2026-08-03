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
        datasetVersion: '2026.08.04',
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
            { id: 'USR_ADMIN_001', roleId: 'ROLE_ADMIN', username: 'admin', displayName: 'Quản Trị Viên', email: 'admin@spms.edu.vn', status: 'active' },
            { id: 'USR_TEACHER_001', roleId: 'ROLE_TEACHER', username: 'gv001', displayName: 'Nguyễn Thị Xuân Hiền', email: 'gv001@spms.edu.vn', status: 'active' },
            { id: 'USR_PARENT_001', roleId: 'ROLE_PARENT', username: 'ph001', displayName: 'Nguyễn Văn Hùng', email: 'ph001@spms.edu.vn', status: 'active' },
            { id: 'USR_STUDENT_001', roleId: 'ROLE_STUDENT', username: 'hs101001', displayName: 'Nguyễn Văn Hoàng Anh', email: 'hs101001@spms.edu.vn', status: 'active' },
            { id: 'USR_STUDENT_002', roleId: 'ROLE_STUDENT', username: 'hs103112', displayName: 'Đặng Mai Phương Thảo', email: 'hs103112@spms.edu.vn', status: 'active' },
            { id: 'USR_STUDENT_003', roleId: 'ROLE_STUDENT', username: 'hs101002', displayName: 'Trần Thị Bảo Châu', email: 'hs101002@spms.edu.vn', status: 'active' },
            { id: 'USR_STUDENT_004', roleId: 'ROLE_STUDENT', username: 'hs102012', displayName: 'Phạm Hoàng Phương Nghi', email: 'hs102012@spms.edu.vn', status: 'active' },
            { id: 'USR_STUDENT_005', roleId: 'ROLE_STUDENT', username: 'hs102003', displayName: 'Phan Văn Khoa', email: 'hs102003@spms.edu.vn', status: 'active' },
            { id: 'USR_STUDENT_006', roleId: 'ROLE_STUDENT', username: 'hs113001', displayName: 'Cao Thị Mỹ Linh', email: 'hs113001@spms.edu.vn', status: 'active' },
            { id: 'USR_STUDENT_007', roleId: 'ROLE_STUDENT', username: 'hs113002', displayName: 'Đinh Quốc Hùng', email: 'hs113002@spms.edu.vn', status: 'active' },
            { id: 'USR_STUDENT_008', roleId: 'ROLE_STUDENT', username: 'hs113003', displayName: 'Lý Thị Thanh Trúc', email: 'hs113003@spms.edu.vn', status: 'active' },
            { id: 'USR_STUDENT_009', roleId: 'ROLE_STUDENT', username: 'hs111009', displayName: 'Vũ Hoàng Bảo Lâm', email: 'hs111009@spms.edu.vn', status: 'active' },
            { id: 'USR_STUDENT_010', roleId: 'ROLE_STUDENT', username: 'hs114002', displayName: 'Hà Thị Ngọc Trinh', email: 'hs114002@spms.edu.vn', status: 'active' }
        ],

        authCredentials: [
            { id: 'CRED_ADMIN_001', userId: 'USR_ADMIN_001', password: 'admin123' },
            { id: 'CRED_TEACHER_001', userId: 'USR_TEACHER_001', password: '123456' },
            { id: 'CRED_PARENT_001', userId: 'USR_PARENT_001', password: '123456' },
            { id: 'CRED_STUDENT_001', userId: 'USR_STUDENT_001', password: '123456' },
            { id: 'CRED_STUDENT_002', userId: 'USR_STUDENT_002', password: '123456' },
            { id: 'CRED_STUDENT_003', userId: 'USR_STUDENT_003', password: '123456' },
            { id: 'CRED_STUDENT_004', userId: 'USR_STUDENT_004', password: '123456' },
            { id: 'CRED_STUDENT_005', userId: 'USR_STUDENT_005', password: '123456' },
            { id: 'CRED_STUDENT_006', userId: 'USR_STUDENT_006', password: '123456' },
            { id: 'CRED_STUDENT_007', userId: 'USR_STUDENT_007', password: '123456' },
            { id: 'CRED_STUDENT_008', userId: 'USR_STUDENT_008', password: '123456' },
            { id: 'CRED_STUDENT_009', userId: 'USR_STUDENT_009', password: '123456' },
            { id: 'CRED_STUDENT_010', userId: 'USR_STUDENT_010', password: '123456' }
        ],

        schoolYears: [
            { id: 'SY_2026_2027', name: '2026 - 2027', startDate: '2026-08-15', endDate: '2027-05-31', isCurrent: true }
        ],

        semesters: [
            { id: 'SEM_2026_1', schoolYearId: 'SY_2026_2027', name: 'Học kỳ I', number: 1, startDate: '2026-08-15', endDate: '2026-12-31' },
            { id: 'SEM_2026_2', schoolYearId: 'SY_2026_2027', name: 'Học kỳ II', number: 2, startDate: '2027-01-01', endDate: '2027-05-31' }
        ],

        teachers: [
            { id: 'TEA_001', userId: 'USR_TEACHER_001', code: 'GV001', fullName: 'Nguyễn Thị Xuân Hiền', phone: '0905123456', subjectIds: ['SUB_MATH'] }
        ],

        subjects: [
            { id: 'SUB_MATH', code: 'TOAN', name: 'Toán học' },
            { id: 'SUB_LIT', code: 'VAN', name: 'Ngữ văn' },
            { id: 'SUB_ENG', code: 'ANH', name: 'Tiếng Anh' },
            { id: 'SUB_SCI', code: 'KHTN', name: 'Khoa học tự nhiên' },
            { id: 'SUB_IT', code: 'TIN', name: 'Tin học' }
        ],

        classes: [
            { id: 'CLS_7A1', schoolYearId: 'SY_2026_2027', code: '7A1', grade: 7, level: 'THCS', homeroomTeacherId: 'TEA_001' },
            { id: 'CLS_7A2', schoolYearId: 'SY_2026_2027', code: '7A2', grade: 7, level: 'THCS', homeroomTeacherId: 'TEA_001' },
            { id: 'CLS_8A1', schoolYearId: 'SY_2026_2027', code: '8A1', grade: 8, level: 'THCS', homeroomTeacherId: 'TEA_001' },
            { id: 'CLS_8A2', schoolYearId: 'SY_2026_2027', code: '8A2', grade: 8, level: 'THCS', homeroomTeacherId: 'TEA_001' }
        ],

        classSubjects: [
            { id: 'CS_7A1_MATH', classId: 'CLS_7A1', subjectId: 'SUB_MATH', teacherId: 'TEA_001' },
            { id: 'CS_7A2_MATH', classId: 'CLS_7A2', subjectId: 'SUB_MATH', teacherId: 'TEA_001' },
            { id: 'CS_8A1_MATH', classId: 'CLS_8A1', subjectId: 'SUB_MATH', teacherId: 'TEA_001' },
            { id: 'CS_8A2_MATH', classId: 'CLS_8A2', subjectId: 'SUB_MATH', teacherId: 'TEA_001' }
        ],

        students: [
            { id: 'STU_001', userId: 'USR_STUDENT_001', code: 'HS101001', fullName: 'Nguyễn Văn Hoàng Anh', dateOfBirth: '2010-05-14', gender: 'male', ethnicity: 'Kinh', religion: 'Không', hometown: 'Đà Nẵng, Việt Nam', address: '123 Lê Lợi, Phường Hải Châu I, Quận Hải Châu, Thành phố Đà Nẵng', policy: 'Con thương binh (Ưu đãi A)', youthUnionJoinedAt: '2026-03-26', classId: 'CLS_7A1', status: 'studying' },
            { id: 'STU_002', userId: 'USR_STUDENT_002', code: 'HS103112', fullName: 'Đặng Mai Phương Thảo', dateOfBirth: '2012-07-08', gender: 'female', classId: 'CLS_7A1', status: 'studying' },
            { id: 'STU_003', userId: 'USR_STUDENT_003', code: 'HS101002', fullName: 'Trần Thị Bảo Châu', dateOfBirth: '2012-03-22', gender: 'female', classId: 'CLS_7A1', status: 'studying' },
            { id: 'STU_004', userId: 'USR_STUDENT_004', code: 'HS102012', fullName: 'Phạm Hoàng Phương Nghi', dateOfBirth: '2012-08-19', gender: 'female', classId: 'CLS_7A2', status: 'studying' },
            { id: 'STU_005', userId: 'USR_STUDENT_005', code: 'HS102003', fullName: 'Phan Văn Khoa', dateOfBirth: '2012-06-11', gender: 'male', classId: 'CLS_7A2', status: 'studying' },
            { id: 'STU_006', userId: 'USR_STUDENT_006', code: 'HS113001', fullName: 'Cao Thị Mỹ Linh', dateOfBirth: '2011-09-05', gender: 'female', classId: 'CLS_8A1', status: 'studying' },
            { id: 'STU_007', userId: 'USR_STUDENT_007', code: 'HS113002', fullName: 'Đinh Quốc Hùng', dateOfBirth: '2011-01-30', gender: 'male', classId: 'CLS_8A1', status: 'studying' },
            { id: 'STU_008', userId: 'USR_STUDENT_008', code: 'HS113003', fullName: 'Lý Thị Thanh Trúc', dateOfBirth: '2011-04-18', gender: 'female', classId: 'CLS_8A1', status: 'studying' },
            { id: 'STU_009', userId: 'USR_STUDENT_009', code: 'HS111009', fullName: 'Vũ Hoàng Bảo Lâm', dateOfBirth: '2011-01-30', gender: 'male', classId: 'CLS_8A2', status: 'studying' },
            { id: 'STU_010', userId: 'USR_STUDENT_010', code: 'HS114002', fullName: 'Hà Thị Ngọc Trinh', dateOfBirth: '2011-10-12', gender: 'female', classId: 'CLS_8A2', status: 'studying' }
        ],

        parentStudentLinks: [
            { id: 'PAR_001', parentUserId: 'USR_PARENT_001', studentId: 'STU_001', relationship: 'Cha', isPrimaryGuardian: true }
        ],

        gradeRecords: [
            { id: 'GRADE_001', studentId: 'STU_001', semesterId: 'SEM_2026_1', subjectId: 'SUB_MATH', oral: 8.5, fifteenMinutes: 9.0, onePeriod: 8.0, midterm: 8.8, final: 9.2, average: 8.8 },
            { id: 'GRADE_002', studentId: 'STU_001', semesterId: 'SEM_2026_1', subjectId: 'SUB_LIT', oral: 7.5, fifteenMinutes: 8.0, onePeriod: 7.8, midterm: 8.0, final: 8.2, average: 8.0 },
            { id: 'GRADE_003', studentId: 'STU_001', semesterId: 'SEM_2026_1', subjectId: 'SUB_ENG', oral: 9.0, fifteenMinutes: 9.2, onePeriod: 8.8, midterm: 9.0, final: 9.4, average: 9.1 }
        ],

        semesterResults: [
            { id: 'RESULT_SEM_001', studentId: 'STU_001', semesterId: 'SEM_2026_1', average: 8.63, academicRank: 'Tốt', conductRank: 'Tốt', autoGenerated: true }
        ],

        yearResults: [
            { id: 'RESULT_YEAR_001', studentId: 'STU_001', schoolYearId: 'SY_2026_2027', average: 8.63, academicRank: 'Tốt', conductRank: 'Tốt', autoGenerated: true }
        ],

        attendanceRecords: [
            { id: 'ATT_001', studentId: 'STU_001', date: '2026-05-12', session: 'morning', type: 'excused_absence', reason: 'Khám bệnh định kỳ', confirmedBy: 'TEA_001' },
            { id: 'ATT_002', studentId: 'STU_001', date: '2026-03-05', session: 'afternoon', type: 'late', reason: 'Kẹt xe, trễ 15 phút', confirmedBy: 'TEA_001' }
        ],

        timetableEntries: [
            { id:'TTB_001', classId:'CLS_7A1', semesterId:'SEM_2026_1', weekday:2, period:1, subjectId:'SUB_MATH', teacherId:'TEA_001', room:'7A1' },
            { id:'TTB_002', classId:'CLS_7A1', semesterId:'SEM_2026_1', weekday:2, period:2, subjectId:'SUB_LIT', teacherId:'TEA_001', room:'7A1' },
            { id:'TTB_003', classId:'CLS_7A1', semesterId:'SEM_2026_1', weekday:3, period:1, subjectId:'SUB_ENG', teacherId:'TEA_001', room:'7A1' },
            { id:'TTB_004', classId:'CLS_7A1', semesterId:'SEM_2026_1', weekday:4, period:1, subjectId:'SUB_SCI', teacherId:'TEA_001', room:'P. KHTN' },
            { id:'TTB_005', classId:'CLS_7A1', semesterId:'SEM_2026_1', weekday:5, period:1, subjectId:'SUB_IT', teacherId:'TEA_001', room:'P. Tin học' }
        ],

        examSchedules: [
            { id:'EXAM_001', classId:'CLS_7A1', semesterId:'SEM_2026_1', subjectId:'SUB_MATH', date:'2026-12-21', startTime:'07:30', durationMinutes:90, room:'P.201', format:'Tự luận' },
            { id:'EXAM_002', classId:'CLS_7A1', semesterId:'SEM_2026_1', subjectId:'SUB_LIT', date:'2026-12-22', startTime:'07:30', durationMinutes:90, room:'P.201', format:'Tự luận' },
            { id:'EXAM_003', classId:'CLS_7A1', semesterId:'SEM_2026_1', subjectId:'SUB_ENG', date:'2026-12-23', startTime:'07:30', durationMinutes:60, room:'P.201', format:'Trắc nghiệm' }
        ],

        achievements: [
            { id: 'ACH_001', code: 'TT001', studentId: 'STU_001', title: 'Học sinh Giỏi xuất sắc khối 7', category: 'academic', level: 'school', organizer: 'Trường THCS Nguyễn Văn Cừ', issuedDate: '2026-08-03', description: 'Danh hiệu học sinh giỏi xuất sắc khối 7.', status: 'pending', submittedBy: 'USR_STUDENT_001', approvedBy: null, approvedAt: null },
            { id: 'ACH_002', code: 'TT002', studentId: 'STU_002', title: 'Giải Nhì văn nghị luận cấp trường', category: 'arts', level: 'school', organizer: 'Trường THCS Nguyễn Văn Cừ', issuedDate: '2026-04-15', description: 'Giải Nhì cuộc thi văn nghị luận.', status: 'request_more', submittedBy: 'USR_STUDENT_002', approvedBy: null, approvedAt: null },
            { id: 'ACH_003', code: 'TT003', studentId: 'STU_009', title: 'Học sinh xuất sắc toàn diện', category: 'academic', level: 'school', organizer: 'Trường THCS Nguyễn Văn Cừ', issuedDate: '2026-05-25', description: 'Danh hiệu học sinh xuất sắc toàn diện.', status: 'approved', submittedBy: 'USR_STUDENT_009', approvedBy: 'USR_TEACHER_001', approvedAt: '2026-05-27T09:00:00+07:00' },
            { id: 'ACH_004', code: 'TT004', studentId: 'STU_005', title: 'Cán bộ Đoàn xuất sắc năm học 2026', category: 'movement', level: 'school', organizer: 'Đoàn trường', issuedDate: '2026-05-20', description: 'Hoàn thành xuất sắc công tác phong trào.', status: 'approved', submittedBy: 'USR_STUDENT_005', approvedBy: 'USR_TEACHER_001', approvedAt: '2026-05-22T10:00:00+07:00' },
            { id: 'ACH_005', code: 'TT005', studentId: 'STU_007', title: 'Giải Nhì HSG Tỉnh môn Vật lý', category: 'academic', level: 'city', organizer: 'Sở Giáo dục và Đào tạo', issuedDate: '2026-03-18', description: 'Giải Nhì kỳ thi học sinh giỏi môn Vật lý.', status: 'approved', submittedBy: 'USR_STUDENT_007', approvedBy: 'USR_ADMIN_001', approvedAt: '2026-03-20T08:30:00+07:00' },
            { id: 'ACH_006', code: 'TT006', studentId: 'STU_003', title: 'Học sinh Tiên Tiến học kỳ I', category: 'academic', level: 'school', organizer: 'Trường THCS Nguyễn Văn Cừ', issuedDate: '2026-12-28', description: 'Danh hiệu học sinh tiên tiến học kỳ I.', status: 'approved', submittedBy: 'USR_STUDENT_003', approvedBy: 'USR_TEACHER_001', approvedAt: '2026-12-29T08:00:00+07:00' },
            { id: 'ACH_007', code: 'TT007', studentId: 'STU_004', title: 'Giải Nhì Olympic Toán cấp quận', category: 'academic', level: 'district', organizer: 'Phòng Giáo dục và Đào tạo', issuedDate: '2026-04-02', description: 'Giải Nhì Olympic Toán cấp quận.', status: 'pending', submittedBy: 'USR_STUDENT_004', approvedBy: null, approvedAt: null },
            { id: 'ACH_008', code: 'TT008', studentId: 'STU_008', title: 'Giải Ba cuộc thi Khoa học kỹ thuật', category: 'science_technology', level: 'city', organizer: 'Sở Giáo dục và Đào tạo', issuedDate: '2026-02-21', description: 'Giải Ba cuộc thi Khoa học kỹ thuật.', status: 'approved', submittedBy: 'USR_STUDENT_008', approvedBy: 'USR_ADMIN_001', approvedAt: '2026-02-23T14:00:00+07:00' },
            { id: 'ACH_009', code: 'TT009', studentId: 'STU_010', title: 'Huy chương Đồng bơi lội', category: 'sports', level: 'district', organizer: 'Trung tâm Văn hóa - Thể thao Quận', issuedDate: '2026-03-10', description: 'Huy chương Đồng nội dung bơi tự do.', status: 'approved', submittedBy: 'USR_STUDENT_010', approvedBy: 'USR_TEACHER_001', approvedAt: '2026-03-12T09:15:00+07:00' },
            { id: 'ACH_010', code: 'TT010', studentId: 'STU_006', title: 'Giải Nhất cuộc thi Khoa học kỹ thuật', category: 'science_technology', level: 'school', organizer: 'Trường THCS Nguyễn Văn Cừ', issuedDate: '2026-01-20', description: 'Sản phẩm sáng tạo hỗ trợ học tập.', status: 'approved', submittedBy: 'USR_STUDENT_006', approvedBy: 'USR_TEACHER_001', approvedAt: '2026-01-22T13:00:00+07:00' }
        ],

        achievementFiles: [
            { id: 'ACH_FILE_001', achievementId: 'ACH_001', name: 'Bang_Khen_Hoc_Sinh_Gioi_Xuat_Sac_Khoi_7.pdf', type: 'application/pdf', size: 245760, url: 'assets/demo/Bang_Khen_Hoc_Sinh_Gioi_Xuat_Sac_Khoi_7.pdf' },
            { id: 'ACH_FILE_002', achievementId: 'ACH_002', name: 'Minh_Chung_Giai_Nhi_Van_Nghi_Luan.pdf', type: 'application/pdf', size: 198000, url: 'assets/demo/Minh_Chung_Giai_Nhi_Van_Nghi_Luan.pdf' },
            { id: 'ACH_FILE_003', achievementId: 'ACH_005', name: 'Giay_Chung_Nhan_Giai_Nhi_Vat_Ly.pdf', type: 'application/pdf', size: 310000, url: 'assets/demo/Giay_Chung_Nhan_Giai_Nhi_Vat_Ly.pdf' }
        ],

        achievementReviews: [
            { id: 'ACH_REVIEW_001', achievementId: 'ACH_002', reviewerId: 'USR_TEACHER_001', action: 'request_more', note: 'Vui lòng bổ sung ảnh hoặc giấy chứng nhận rõ thông tin đơn vị tổ chức.', reviewedAt: '2026-04-17T08:30:00+07:00' }
        ],

        portfolios: [
            { id: 'PORT_001', studentId: 'STU_001', status: 'saved', title: 'Hồ sơ năng lực cá nhân - Nguyễn Văn Hoàng Anh', updatedAt: '2026-08-03T16:00:00+07:00' }
        ],

        portfolioSections: [
            { id: 'PORT_SEC_001', portfolioId: 'PORT_001', type: 'activities', title: 'Hoạt động ngoại khóa & sự kiện', content: ['Trưởng ban Nội dung Câu lạc bộ STEM trường Nguyễn Văn Cừ', 'Tình nguyện viên chương trình Áo ấm cho em 2025'], editable: true },
            { id: 'PORT_SEC_002', portfolioId: 'PORT_001', type: 'certificates', title: 'Chứng chỉ học thuật & kỹ năng', content: ['Chứng chỉ Cambridge KET / B1 Preliminary (Merit)', 'Khóa học Lập trình Python cơ bản - EduPortal'], editable: true },
            { id: 'PORT_SEC_003', portfolioId: 'PORT_001', type: 'learning_results', title: 'Học tập & kết quả năm học', content: { yearResultId: 'RESULT_YEAR_001' }, editable: false, autoGenerated: true },
            { id: 'PORT_SEC_004', portfolioId: 'PORT_001', type: 'achievements', title: 'Thành tích & giải thưởng', content: { achievementIds: [] }, editable: false, autoGenerated: true }
            ,{ id:'PORT_SEC_005', portfolioId:'PORT_001', type:'skills', title:'Kỹ năng', content:[{name:'Tư duy logic',level:5},{name:'Làm việc nhóm',level:4},{name:'Thuyết trình',level:4}], editable:true }
            ,{ id:'PORT_SEC_006', portfolioId:'PORT_001', type:'products', title:'Sản phẩm học tập', content:['Mô hình Robot dọn rác mini tự động','Website sơ đồ tư duy Lịch sử địa phương'], editable:true }
            ,{ id:'PORT_SEC_007', portfolioId:'PORT_001', type:'roadmap', title:'Lộ trình phát triển', content:['2024: Gia nhập CLB Tin học & STEM','2025 - 2026: Tham gia đội tuyển HSG cấp Quận'], editable:true }
            ,{ id:'PORT_SEC_008', portfolioId:'PORT_001', type:'goals', title:'Mục tiêu phát triển', content:{short:'Hoàn thành tốt học kỳ II với điểm trên 9.0',medium:'Đạt danh hiệu Học sinh Xuất sắc cuối năm',long:'Thi đậu lớp chuyên Tin/Toán'}, editable:true }
            ,{ id:'PORT_SEC_009', portfolioId:'PORT_001', type:'personality', title:'Cá tính và phương pháp học', content:{hobbies:'Đọc sách khoa học, chơi bóng đá',favoriteSubject:'Toán, Tiếng Anh, Tin học',studyMethod:'Học qua ví dụ thực tế và dự án nhóm',motto:'Học để biết và để làm'}, editable:true }
        ],

        portfolioHistory: [
            { id: 'PORT_HIST_001', portfolioId: 'PORT_001', action: 'saved', actorId: 'USR_STUDENT_001', occurredAt: '2026-08-03T16:00:00+07:00' }
        ],

        selfAssessments: [
            { id: 'SELF_001', studentId: 'STU_001', schoolYearId: 'SY_2026_2027', strengths: 'Chủ động học tập, yêu thích Tin học và làm việc nhóm.', improvements: 'Cần cải thiện kỹ năng thuyết trình trước đám đông.', updatedAt: '2026-08-01T10:00:00+07:00' }
        ],

        notifications: [
            { id: 'NOTI_001', userId: 'USR_TEACHER_001', type: 'achievement_pending', title: 'Có thành tích mới chờ phê duyệt', message: 'Nguyễn Văn Hoàng Anh đã gửi thành tích Học sinh Giỏi xuất sắc khối 7.', read: false, createdAt: '2026-08-03T16:05:00+07:00' },
            { id: 'NOTI_002', userId: 'USR_STUDENT_002', type: 'achievement_request_more', title: 'Yêu cầu bổ sung minh chứng', message: 'Giải Nhì văn nghị luận cấp trường cần bổ sung minh chứng.', read: false, createdAt: '2026-04-17T08:31:00+07:00' }
        ],

        systemSettings: [
            { id: 'SETTING_001', key: 'currentSchoolYearId', value: 'SY_2026_2027' },
            { id: 'SETTING_002', key: 'achievementEditableStatuses', value: ['pending', 'request_more'] },
            { id: 'SETTING_003', key: 'toastPosition', value: 'bottom-left' }
        ]
    };

    global.SPMSSeedData = SPMS_SEED_DATA;
})(typeof window !== 'undefined' ? window : globalThis);
