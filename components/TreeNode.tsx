import React from 'react';
import { FamilyMember } from '../types';

interface TreeNodeProps {
  member: FamilyMember;
  onSelect: (member: FamilyMember, index: string) => void;
  selectedId: string | null;
  index: string;
  searchTerm: string;
}

const TreeNode: React.FC<TreeNodeProps> = ({ member, onSelect, selectedId, index, searchTerm }) => {
  const hasChildren = member.children && member.children.length > 0;
  const isSelected = selectedId === member.id;
  const isDeceased = !!member.deathDate;

  // Age Calculation
  const birthYear = parseInt(member.birthDate);
  const endYear = member.deathDate ? parseInt(member.deathDate) : new Date().getFullYear();
  const age = isNaN(birthYear) ? '' : endYear - birthYear;

  // Search Logic
  const normalizeText = (text: string) => 
    text.toLowerCase()
        .replace(/[أإآ]/g, 'ا')
        .replace(/ة/g, 'ه')
        .replace(/ى/g, 'ي');

  const isMatch = React.useMemo(() => {
    if (!searchTerm.trim()) return false;
    
    const term = normalizeText(searchTerm);
    const content = normalizeText([
      member.name,
      member.occupation,
      member.location,
      member.bio,
      member.birthDate,
      member.deathDate,
      member.fatherName || '',
      member.grandfatherName || ''
    ].join(' '));

    return content.includes(term);
  }, [searchTerm, member]);

  return (
    <div className="flex flex-col items-center">
      {/* Node Container - acting as the click target */}
      <div 
        id={`node-${member.id}`}
        onClick={() => onSelect(member, index)}
        className="flex flex-col items-center cursor-pointer group z-10 relative"
      >
        {/* The Colored Box with Name and Info */}
        <div className={`
          flex flex-col items-center justify-center text-center 
          px-3 py-2 min-w-[5.5rem] max-w-[12rem]
          rounded-xl shadow-sm transition-all duration-300 border-2 
          ${member.gender === 'male' 
            ? 'bg-blue-500 border-blue-600 hover:bg-blue-600' 
            : 'bg-pink-500 border-pink-600 hover:bg-pink-600'}
          ${isDeceased ? 'grayscale opacity-90' : ''}
          ${isSelected 
            ? 'ring-4 ring-blue-200 scale-110 shadow-xl z-20' 
            : isMatch
              ? 'ring-4 ring-yellow-300 scale-110 z-20'
              : 'hover:shadow-md hover:scale-105'
          }
        `}>
          <span className="text-white font-bold text-base leading-tight select-none break-words w-full mb-0.5">
            {member.name}
          </span>

          {/* Father Name Only (Grandfather and Mother hidden) */}
          {member.fatherName && (
             <span className="text-[10px] text-white/90 leading-none mb-1 block">
               الأب: {member.fatherName}
             </span>
          )}

          {/* Dates & Age Section */}
          <div className="flex flex-col items-center text-white/90 border-t border-white/20 pt-1 mt-0.5 w-full">
             <span dir="ltr" className="text-[10px] font-medium tracking-wide leading-none">
               {member.birthDate} - {member.deathDate || 'الآن'}
             </span>
             {age !== '' && (
               <span className="text-[10px] mt-0.5 leading-none opacity-85 font-mono">
                 ({age} سنة)
               </span>
             )}
          </div>
        </div>
      </div>

      {/* Children Rendering */}
      {hasChildren && (
        <div className="flex flex-col items-center mt-10 relative">
          {/* Vertical Line from Parent to Connector Level */}
          {/* Height 12 (3rem/48px) - MT 10 (2.5rem/40px) = 8px overlap into parent */}
          <div className="absolute -top-12 w-[2px] h-12 bg-gray-400"></div>

          {/* Children Container with Horizontal Spacing */}
          {/* PT 10 (2.5rem/40px) provides space for the vertical lines to children */}
          <div className="flex flex-row gap-8 pt-10 relative">
            {member.children!.map((child, i) => (
              <div key={child.id} className="relative flex flex-col items-center">
                 {/* Vertical line from Connector Level down to Child */}
                 {/* Height 12 (48px) - PT 10 (40px) = 8px overlap into child */}
                 {/* Top -10 (2.5rem/40px) aligns exactly with the container top (Connector Level) */}
                 <div className="absolute -top-10 w-[2px] h-12 bg-gray-400"></div>
                 
                 {/* Horizontal Connector Lines */}
                 {/* These sit exactly at -top-10 (Connector Level) */}
                 {member.children!.length > 1 && (
                   <>
                     {/* RTL Correction: Swap Left/Right logic */}
                     
                     {/* Line to Previous Sibling (Visually Right in RTL) */}
                     {i > 0 && (
                       <div className="absolute -top-10 left-1/2 h-[2px] bg-gray-400 w-[calc(50%+1rem)]"></div>
                     )}
                     
                     {/* Line to Next Sibling (Visually Left in RTL) */}
                     {i < member.children!.length - 1 && (
                       <div className="absolute -top-10 right-1/2 h-[2px] bg-gray-400 w-[calc(50%+1rem)]"></div>
                     )}
                   </>
                 )}
                 
                 {/* Recursive Call */}
                <TreeNode 
                  member={child} 
                  onSelect={onSelect} 
                  selectedId={selectedId}
                  index={`${index}.${i + 1}`}
                  searchTerm={searchTerm}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TreeNode;