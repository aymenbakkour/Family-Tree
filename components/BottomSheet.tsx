import React, { useState } from 'react';
import { FamilyMember } from '../types';
import { User, Calendar, Briefcase, MapPin, Heart, Info, X, Hash, Users } from 'lucide-react';

interface BottomSheetProps {
  member: FamilyMember | null;
  index: string;
  onClose: () => void;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ member, index, onClose }) => {
  const [activeTab, setActiveTab] = useState<'bio' | 'details'>('details');

  if (!member) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 text-center pb-8">
        <p className="text-gray-400 text-lg font-medium animate-pulse">
          اضغط على اسم من الشجرة لإظهار التفاصيل
        </p>
      </div>
    );
  }

  // Calculate Age
  const birthYear = parseInt(member.birthDate);
  const endYear = member.deathDate ? parseInt(member.deathDate) : new Date().getFullYear();
  const age = isNaN(birthYear) ? '' : endYear - birthYear;
  const isDeceased = !!member.deathDate;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1)] z-50 rounded-t-3xl transition-transform duration-300 ease-in-out max-h-[60vh] flex flex-col">
      
      {/* Header */}
      <div className={`flex items-center justify-between px-6 py-4 border-b border-gray-100 ${isDeceased ? 'bg-gray-50 rounded-t-3xl' : ''}`}>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold ${member.gender === 'male' ? (isDeceased ? 'bg-blue-400 grayscale' : 'bg-blue-500') : (isDeceased ? 'bg-pink-400 grayscale' : 'bg-pink-500')}`}>
            {member.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{member.name}</h2>
            <p className="text-xs text-gray-500">{member.occupation || 'غير محدد'}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 px-2">
        <button 
          onClick={() => setActiveTab('details')}
          className={`flex-1 py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${activeTab === 'details' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          <Info className="w-4 h-4" />
          معلومات أساسية
        </button>
        <button 
          onClick={() => setActiveTab('bio')}
          className={`flex-1 py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${activeTab === 'bio' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          <User className="w-4 h-4" />
          السيرة الشخصية
        </button>
      </div>

      {/* Content */}
      <div className="p-6 overflow-y-auto pb-10">
        {activeTab === 'details' ? (
          <div className="space-y-4">
             {/* Lineage Card */}
             {(member.fatherName || member.motherName) && (
               <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-2">
                 <div className="flex items-center gap-2 mb-2 text-blue-700 font-semibold text-sm">
                   <Users className="w-4 h-4" />
                   النسب والعائلة
                 </div>
                 <div className="grid grid-cols-2 gap-2 text-sm">
                    {member.fatherName && (
                      <div className="bg-white p-2 rounded shadow-sm">
                        <span className="text-gray-400 text-xs block">الأب</span>
                        <span className="text-gray-800 font-medium">{member.fatherName}</span>
                      </div>
                    )}
                    {member.grandfatherName && (
                      <div className="bg-white p-2 rounded shadow-sm">
                        <span className="text-gray-400 text-xs block">الجد</span>
                        <span className="text-gray-800 font-medium">{member.grandfatherName}</span>
                      </div>
                    )}
                    {member.motherName && (
                      <div className="bg-white p-2 rounded shadow-sm col-span-2">
                        <span className="text-gray-400 text-xs block">الأم</span>
                        <span className="text-gray-800 font-medium">{member.motherName}</span>
                      </div>
                    )}
                 </div>
               </div>
             )}

             <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg col-span-2">
                    <Hash className="w-5 h-5 text-gray-400" />
                    <div>
                    <p className="text-xs text-gray-500">الرقم التسلسلي</p>
                    <p className="font-medium text-gray-700 font-mono tracking-wider">{index}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg col-span-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                    <p className="text-xs text-gray-500">الميلاد</p>
                    <p className="font-medium text-gray-700">
                        <span dir="ltr">{member.birthDate} - {member.deathDate || 'الآن'}</span>
                        {age !== '' && <span className="mr-2 text-gray-500 text-sm">({age} سنة)</span>}
                    </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Briefcase className="w-5 h-5 text-gray-400" />
                    <div>
                    <p className="text-xs text-gray-500">المهنة</p>
                    <p className="font-medium text-gray-700 truncate max-w-[100px]">{member.occupation || 'غير متوفر'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                    <p className="text-xs text-gray-500">المكان</p>
                    <p className="font-medium text-gray-700 truncate max-w-[100px]">{member.location || 'غير معروف'}</p>
                    </div>
                </div>
             </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <p className="text-gray-700 leading-relaxed text-sm">
                {member.bio}
              </p>
            </div>
            {member.children && member.children.length > 0 && (
              <div className="mt-4">
                <h4 className="font-bold text-gray-800 mb-2 text-sm">الأبناء ({member.children.length}):</h4>
                <div className="flex flex-wrap gap-2">
                  {member.children.map(child => (
                    <span key={child.id} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md border border-gray-200">
                      {child.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BottomSheet;