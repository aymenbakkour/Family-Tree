import { FamilyMember } from './types';

export const FAMILY_DATA: FamilyMember = {
  id: '1',
  name: 'الجد صالح',
  birthDate: '1940',
  gender: 'male',
  occupation: 'كبير العائلة',
  location: 'المجلس الكبير',
  bio: 'مؤسس العائلة والعمود الفقري لها. عرف بالحكمة وحل النزاعات بين أهالي القرية.',
  fatherName: 'عبدالله',
  grandfatherName: 'إبراهيم',
  motherName: 'حصة',
  children: [
    // --- 4 Sons (أربعة أبناء) ---
    {
      id: '2',
      name: 'سعيد',
      birthDate: '1965',
      gender: 'male',
      occupation: 'تاجر',
      location: 'الرياض',
      bio: 'الابن الأكبر، يمسك زمام تجارة والده.',
      fatherName: 'صالح',
      grandfatherName: 'عبدالله',
      motherName: 'نورة',
      children: [
        {
          id: '2-1',
          name: 'عمر',
          birthDate: '1990',
          gender: 'male',
          occupation: 'مهندس',
          bio: 'حفيد الجد صالح، يعمل في شركة بترول.',
          fatherName: 'سعيد',
          grandfatherName: 'صالح',
          motherName: 'منيرة',
          children: []
        },
        {
          id: '2-2',
          name: 'علي',
          birthDate: '1995',
          gender: 'male',
          occupation: 'ضابط',
          bio: 'تخرج حديثاً من الكلية العسكرية.',
          fatherName: 'سعيد',
          grandfatherName: 'صالح',
          motherName: 'منيرة',
          children: []
        }
      ]
    },
    {
      id: '3',
      name: 'ناصر',
      birthDate: '1970',
      gender: 'male',
      occupation: 'مدير مدرسة',
      bio: 'محب للعلم والأدب، يجمع الأحفاد لتعليمهم.',
      fatherName: 'صالح',
      grandfatherName: 'عبدالله',
      motherName: 'نورة',
      children: [
        {
          id: '3-1',
          name: 'حمد',
          birthDate: '2000',
          gender: 'male',
          occupation: 'طالب جامعي',
          bio: 'يدرس الطب البشري.',
          fatherName: 'ناصر',
          grandfatherName: 'صالح',
          motherName: 'لطيفة',
          children: []
        }
      ]
    },
    {
      id: '4',
      name: 'محمد',
      birthDate: '1975',
      gender: 'male',
      occupation: 'مبرمج',
      bio: 'الابن الأوسط، مهتم بالتكنولوجيا.',
      fatherName: 'صالح',
      grandfatherName: 'عبدالله',
      motherName: 'نورة',
      children: [
        {
          id: '4-1',
          name: 'فهد',
          birthDate: '2005',
          gender: 'male',
          occupation: 'طالب',
          bio: 'موهوب في الرياضيات.',
          fatherName: 'محمد',
          grandfatherName: 'صالح',
          motherName: 'ريم',
          children: []
        },
        {
          id: '4-2',
          name: 'سعد',
          birthDate: '2008',
          gender: 'male',
          occupation: 'طالب',
          bio: 'يحب كرة القدم.',
          fatherName: 'محمد',
          grandfatherName: 'صالح',
          motherName: 'ريم',
          children: []
        },
        {
          id: '4-3',
          name: 'نوف',
          birthDate: '2012',
          gender: 'female',
          occupation: 'طالبة',
          bio: 'أصغر حفيدات محمد.',
          fatherName: 'محمد',
          grandfatherName: 'صالح',
          motherName: 'ريم',
          children: []
        }
      ]
    },
    {
      id: '5',
      name: 'خالد',
      birthDate: '1982',
      gender: 'male',
      occupation: 'طبيب',
      bio: 'أصغر الأبناء الذكور، يعمل في المستشفى المركزي.',
      fatherName: 'صالح',
      grandfatherName: 'عبدالله',
      motherName: 'نورة',
      children: [
        {
          id: '5-1',
          name: 'إبراهيم',
          birthDate: '2015',
          gender: 'male',
          occupation: 'طفل',
          bio: 'الحفيد الأصغر المدلل.',
          fatherName: 'خالد',
          grandfatherName: 'صالح',
          motherName: 'أمل',
          children: []
        }
      ]
    },

    // --- 5 Daughters (خمس بنات) ---
    {
      id: '6',
      name: 'مريم',
      birthDate: '1968',
      gender: 'female',
      occupation: 'ربة منزل',
      bio: 'الكبرى بين البنات، حكيمة مثل والدها.',
      fatherName: 'صالح',
      grandfatherName: 'عبدالله',
      motherName: 'نورة',
      children: [
        {
          id: '6-1',
          name: 'هدى',
          birthDate: '1992',
          gender: 'female',
          occupation: 'معلمة',
          bio: 'تعمل في روضة أطفال.',
          fatherName: 'عبدالرحمن',
          grandfatherName: 'غير معروف',
          motherName: 'مريم',
          children: []
        }
      ]
    },
    {
      id: '7',
      name: 'فاطمة',
      birthDate: '1972',
      gender: 'female',
      occupation: 'مصممة أزياء',
      bio: 'لديها بوتيك خاص للعبايات.',
      fatherName: 'صالح',
      grandfatherName: 'عبدالله',
      motherName: 'نورة',
      children: [] // ليس لديها أطفال في هذه البيانات
    },
    {
      id: '8',
      name: 'عائشة',
      birthDate: '1978',
      gender: 'female',
      occupation: 'طبيبة أسنان',
      bio: 'متفوقة في مجالها ومحبوبة من العائلة.',
      fatherName: 'صالح',
      grandfatherName: 'عبدالله',
      motherName: 'نورة',
      children: [
        {
          id: '8-1',
          name: 'سلطان',
          birthDate: '2002',
          gender: 'male',
          occupation: 'جامعي',
          bio: 'يدرس الهندسة المعمارية.',
          fatherName: 'يوسف',
          grandfatherName: 'غير معروف',
          motherName: 'عائشة',
          children: []
        },
        {
          id: '8-2',
          name: 'ريم',
          birthDate: '2006',
          gender: 'female',
          occupation: 'طالبة',
          bio: 'رسامة موهوبة.',
          fatherName: 'يوسف',
          grandfatherName: 'غير معروف',
          motherName: 'عائشة',
          children: []
        }
      ]
    },
    {
      id: '9',
      name: 'هند',
      birthDate: '1980',
      gender: 'female',
      occupation: 'موظفة بنك',
      bio: 'دقيقة ومنظمة جداً في حياتها.',
      fatherName: 'صالح',
      grandfatherName: 'عبدالله',
      motherName: 'نورة',
      children: [] // لم تتزوج بعد
    },
    {
      id: '10',
      name: 'نورة',
      birthDate: '1985',
      gender: 'female',
      occupation: 'أخصائية تغذية',
      bio: 'سميت على اسم والدتها، تهتم بصحة العائلة.',
      fatherName: 'صالح',
      grandfatherName: 'عبدالله',
      motherName: 'نورة',
      children: [
        {
          id: '10-1',
          name: 'ياسر',
          birthDate: '2011',
          gender: 'male',
          occupation: 'طالب',
          bio: 'ذكي جداً في الحساب.',
          fatherName: 'فيصل',
          grandfatherName: 'غير معروف',
          motherName: 'نورة',
          children: []
        }
      ]
    }
  ]
};