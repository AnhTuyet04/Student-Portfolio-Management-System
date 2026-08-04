(function createSPMSSelectors(global) {
  'use strict';
  const db = () => global.SPMSDatabase;
  const list = name => db()?.list(name) || [];
  const date = value => value ? String(value).split('-').reverse().join(' / ') : '—';
  const categoryLabels = { academic:'Học tập', movement:'Phong trào', arts:'Văn nghệ', sports:'Thể thao', science_technology:'Khoa học - Kỹ thuật', certificate:'Chứng chỉ' };
  const levelLabels = { school:'Trường', district:'Quận/Huyện', city:'Thành phố', province:'Tỉnh', national:'Quốc gia' };
  const statusLabels = { studying:'Đang học', active:'Đang học', pending:'Chờ phê duyệt', request_more:'Yêu cầu bổ sung', approved:'Đã phê duyệt', rejected:'Đã từ chối' };

  function student(value) {
    const students = list('students');
    const direct = students.find(item => [item.id,item.code,item.userId].some(key => String(key).toLowerCase() === String(value).toLowerCase()));
    if (direct) return direct;
    const user = list('users').find(item => String(item.username).toLowerCase() === String(value).toLowerCase());
    return students.find(item => item.userId === user?.id) || null;
  }
  function studentProfile(value) {
    const s = student(value);
    if (!s) return null;
    const cls = list('classes').find(item => item.id === s?.classId) || {};
    const teacher = list('teachers').find(item => item.id === cls.homeroomTeacherId) || {};
    const user = list('users').find(item => item.id === s?.userId) || {};
    return { fullName:s?.fullName||user.displayName||'', studentCode:s?.code||'', studentId:s?.id||'', className:cls.code||'', classId:cls.id||'', birthday:date(s?.dateOfBirth), gender:s?.gender==='female'?'Nữ':'Nam', ethnicity:[s?.ethnicity,s?.religion].filter(Boolean).join(' / '), origin:s?.hometown||'—', party:s?.youthUnionJoinedAt?`Đã kết nạp (${date(s.youthUnionJoinedAt).replace(/ \/ /g,'/')})`:'Chưa kết nạp', policy:s?.policy||'Không', address:s?.address||'—', schoolYear:(list('schoolYears').find(x=>x.isCurrent)?.name||'').replace(' - ',' – '), educationSystem:'Chính quy THCS', homeroomTeacher:teacher.fullName?`Cô ${teacher.fullName}`:'—', username:user.username||'', email:user.email||'', role:'Học sinh', status:statusLabels[s?.status]||s?.status };
  }
  function achievements(value, statuses) {
    const s=student(value); if(!s)return [];
    const allowed=statuses?new Set(statuses):null; const files=list('achievementFiles');
    return list('achievements').filter(x=>x.studentId===s.id&&(!allowed||allowed.has(x.status))).map(x=>({...x,studentCode:s.code,studentName:s.fullName,categoryLabel:categoryLabels[x.category]||x.category,levelLabel:levelLabels[x.level]||x.level,statusLabel:statusLabels[x.status]||x.status,evidence:files.filter(f=>f.achievementId===x.id)}));
  }
  function grades(value, semesterId) { const s=student(value); return s?list('gradeRecords').filter(x=>x.studentId===s.id&&(!semesterId||x.semesterId===semesterId)).map(x=>({...x,subject:list('subjects').find(y=>y.id===x.subjectId)||{}})):[]; }
  function attendance(value){const s=student(value);return s?list('attendanceRecords').filter(x=>x.studentId===s.id):[];}
  function portfolio(value){const s=student(value);if(!s)return null;const p=list('portfolios').find(x=>x.studentId===s.id);if(!p)return null;return {...p,student:studentProfile(s.id),sections:list('portfolioSections').filter(x=>x.portfolioId===p.id),achievements:achievements(s.id,['approved']),grades:grades(s.id)};}
  function classStudents(classValue){const cls=list('classes').find(x=>x.id===classValue||x.code===classValue);return cls?list('students').filter(x=>x.classId===cls.id).map(x=>studentProfile(x.id)):[];}
  function timetable(value){const s=student(value), cls=s&&list('classes').find(x=>x.id===s.classId);if(!cls)return[];return list('timetableEntries').filter(x=>x.classId===cls.id).map(x=>({...x,subject:list('subjects').find(y=>y.id===x.subjectId)||{},teacher:list('teachers').find(y=>y.id===x.teacherId)||{}}));}
  function exams(value){const s=student(value);if(!s)return[];return list('examSchedules').filter(x=>x.classId===s.classId).map(x=>({...x,subject:list('subjects').find(y=>y.id===x.subjectId)||{}}));}
  global.SPMSSelectors={list,student,studentProfile,achievements,grades,attendance,portfolio,classStudents,timetable,exams,labels:{category:categoryLabels,level:levelLabels,status:statusLabels},date};
})(window);
