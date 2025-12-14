import React, { useState, useMemo } from 'react';
import { FAMILY_DATA } from './constants';
import { FamilyMember } from './types';
import TreeNode from './components/TreeNode';
import BottomSheet from './components/BottomSheet';
import { Share2, ZoomIn, ZoomOut, RotateCcw, Search, ChevronRight, X, Settings, Download, BarChart, Users } from 'lucide-react';
import * as XLSX from 'xlsx';

const App: React.FC = () => {
  // Store both member and their hierarchical index
  const [selectedNode, setSelectedNode] = useState<{ member: FamilyMember; index: string } | null>(null);
  // Initial scale set to 0.6 to show full tree by default
  const [scale, setScale] = useState(0.6);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  
  // State for the floating controls menu
  const [areControlsOpen, setAreControlsOpen] = useState(false);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.3));
  const handleResetZoom = () => setScale(0.6);

  const handleSelectMember = (member: FamilyMember, index: string) => {
    setSelectedNode({ member, index });
    
    // Auto scroll to element
    setTimeout(() => {
        const element = document.getElementById(`node-${member.id}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        }
    }, 100);
  };

  // --- Statistics Logic ---
  const familyStats = useMemo(() => {
    let count = 0;
    let males = 0;
    let females = 0;
    let totalAge = 0;
    let youngest = { name: '', age: 999 };
    let oldest = { name: '', age: -1 };
    const currentYear = new Date().getFullYear();

    const traverse = (node: FamilyMember) => {
        count++;
        if (node.gender === 'male') males++; else females++;

        const birth = parseInt(node.birthDate);
        if (!isNaN(birth)) {
            const end = node.deathDate ? parseInt(node.deathDate) : currentYear;
            const age = end - birth;
            totalAge += age;

            if (age < youngest.age) youngest = { name: node.name, age };
            if (age > oldest.age) oldest = { name: node.name, age };
        }

        node.children?.forEach(traverse);
    };

    traverse(FAMILY_DATA);

    return {
        count,
        males,
        females,
        avgAge: count > 0 ? Math.round(totalAge / count) : 0,
        youngest,
        oldest
    };
  }, []);

  // --- Excel Export Logic ---
  const handleExportExcel = () => {
    const rows: any[] = [];

    const traverse = (member: FamilyMember, level: number) => {
      const birthYear = parseInt(member.birthDate);
      const endYear = member.deathDate ? parseInt(member.deathDate) : new Date().getFullYear();
      const age = isNaN(birthYear) ? '' : endYear - birthYear;

      rows.push({
        'الاسم': member.name,
        'الأب': member.fatherName || '-',
        'الجد': member.grandfatherName || '-',
        'الأم': member.motherName || '-',
        'الجنس': member.gender === 'male' ? 'ذكر' : 'أنثى',
        'تاريخ الميلاد': member.birthDate,
        'تاريخ الوفاة': member.deathDate || 'على قيد الحياة',
        'العمر (سنة)': age,
        'المهنة': member.occupation || '-',
        'المكان': member.location || '-',
        'السيرة الذاتية': member.bio || '-',
        'الجيل': level
      });

      if (member.children) {
        member.children.forEach(child => traverse(child, level + 1));
      }
    };

    // Start traversal
    traverse(FAMILY_DATA, 1);

    // Create Worksheet
    const worksheet = XLSX.utils.json_to_sheet(rows);
    
    // Auto-width for columns (rough estimate)
    const wscols = [
        { wch: 20 }, // Name
        { wch: 15 }, // Father
        { wch: 15 }, // Grandfather
        { wch: 15 }, // Mother
        { wch: 10 }, // Gender
        { wch: 12 }, // Birth
        { wch: 15 }, // Death
        { wch: 10 }, // Age
        { wch: 20 }, // Job
        { wch: 15 }, // Location
        { wch: 50 }, // Bio
        { wch: 8 },  // Generation
    ];
    worksheet['!cols'] = wscols;

    // Create Workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "شجرة العائلة");

    // Write file
    XLSX.writeFile(workbook, "Family_Tree_Data.xlsx");
    
    // Close menu after click
    setAreControlsOpen(false);
  };

  // --- Search Logic ---
  const normalizeText = (text: string) => 
    text.toLowerCase()
        .replace(/[أإآ]/g, 'ا')
        .replace(/ة/g, 'ه')
        .replace(/ى/g, 'ي');

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    const results: { member: FamilyMember; index: string }[] = [];
    const term = normalizeText(searchTerm);

    const traverse = (node: FamilyMember, idx: string) => {
        const content = normalizeText([
          node.name,
          node.occupation,
          node.location,
          node.bio
        ].join(' '));

        if (content.includes(term)) {
            results.push({ member: node, index: idx });
        }

        if (node.children) {
            node.children.forEach((child, i) => traverse(child, `${idx}.${i + 1}`));
        }
    };

    traverse(FAMILY_DATA, '1');
    return results;
  }, [searchTerm]);

  const handleSearchResultClick = (result: { member: FamilyMember; index: string }) => {
    handleSelectMember(result.member, result.index);
    setSearchTerm('');
    setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    // Optionally close the controls menu when search opens
    // setAreControlsOpen(false); 
  };

  return (
    <div className="h-screen w-screen bg-slate-50 flex flex-col overflow-hidden relative">
      
      {/* Header / Title Bar */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 shrink-0">
           <Share2 className="text-blue-600 w-6 h-6" />
           <h1 className="text-lg font-bold text-gray-800">شجرة العائلة</h1>
        </div>
        <div className="text-xs text-gray-400 shrink-0">الإصدار 1.0</div>
      </header>

      {/* Main Canvas Area */}
      <main className="flex-1 mt-16 mb-24 overflow-hidden relative cursor-grab active:cursor-grabbing">
        
        {/* Floating Controls (Top Left) */}
        <div className="absolute top-4 left-4 z-40 flex flex-col items-center gap-2">
          
          {/* Main Toggle Button */}
          <button 
            onClick={() => setAreControlsOpen(!areControlsOpen)}
            className={`
              w-10 h-10 rounded-full shadow-md border border-gray-200 flex items-center justify-center
              transition-all duration-300 active:scale-95
              ${areControlsOpen ? 'bg-blue-600 text-white border-blue-600 rotate-180' : 'bg-white text-gray-700 hover:bg-gray-50'}
            `}
            title="الإعدادات"
          >
             <Settings className="w-5 h-5" />
          </button>

          {/* Collapsible Icon Menu */}
          <div className={`
             flex flex-col gap-2 p-2
             bg-white/90 backdrop-blur rounded-full shadow-xl border border-gray-100
             transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-top
             ${areControlsOpen 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 -translate-y-4 scale-75 pointer-events-none h-0 overflow-hidden py-0'}
          `}>
            
            {/* Search Toggle */}
            <button 
               onClick={toggleSearch} 
               title="بحث"
               className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${isSearchOpen ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Statistics Button */}
            <button 
               onClick={() => { setIsStatsOpen(true); setAreControlsOpen(false); }}
               title="الإحصائيات"
               className="w-9 h-9 flex items-center justify-center hover:bg-purple-50 rounded-full text-purple-600 transition-colors"
            >
              <BarChart className="w-4 h-4" />
            </button>

            {/* Excel Export Button */}
            <button 
               onClick={handleExportExcel} 
               title="تصدير إكسل"
               className="w-9 h-9 flex items-center justify-center hover:bg-green-50 rounded-full text-green-600 transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>

            <div className="w-6 h-px bg-gray-200 mx-auto"></div>

            {/* Zoom Controls */}
            <button onClick={handleZoomIn} title="تكبير" className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-700 transition-colors">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button onClick={handleZoomOut} title="تصغير" className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-700 transition-colors">
              <ZoomOut className="w-4 h-4" />
            </button>
            <button onClick={handleResetZoom} title="إعادة تعيين" className="w-9 h-9 flex items-center justify-center hover:bg-red-50 rounded-full text-red-500 transition-colors">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Bar Overlay */}
        {isSearchOpen && (
            <div className="absolute top-4 right-4 left-16 sm:left-auto sm:w-80 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  autoFocus
                  type="text"
                  className="block w-full pr-10 pl-10 py-2.5 bg-white border border-gray-200 shadow-lg rounded-full text-[16px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="بحث..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                    <button 
                        onClick={() => setSearchTerm('')}
                        className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {searchTerm && (
                <div className="mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-[60vh] overflow-y-auto">
                    {searchResults.length > 0 ? (
                        searchResults.map((result) => (
                            <div 
                            key={result.member.id}
                            onClick={() => handleSearchResultClick(result)}
                            className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0 flex items-center justify-between group transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${result.member.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'}`}>
                                        {result.member.name.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-gray-800 truncate">{result.member.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{result.member.occupation || 'عضو'}</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 shrink-0" />
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-center text-gray-400 text-sm">
                            لا توجد نتائج
                        </div>
                    )}
                </div>
              )}
            </div>
        )}

        {/* Statistics Modal */}
        {isStatsOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100">
                    <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
                        <div className="flex items-center gap-2">
                           <div className="p-1.5 bg-purple-100 rounded-lg text-purple-600">
                             <BarChart className="w-5 h-5" />
                           </div>
                           <h3 className="font-bold text-gray-800">إحصائيات العائلة</h3>
                        </div>
                        <button 
                            onClick={() => setIsStatsOpen(false)}
                            className="p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div className="p-6 grid grid-cols-2 gap-4">
                        {/* Total Members */}
                        <div className="bg-blue-50 p-4 rounded-xl col-span-2 flex items-center justify-between border border-blue-100">
                            <div>
                                <p className="text-sm text-blue-600 font-medium mb-1">إجمالي الأفراد</p>
                                <p className="text-3xl font-bold text-blue-900">{familyStats.count}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-700">
                                <Users className="w-6 h-6" />
                            </div>
                        </div>

                        {/* Gender Split */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-center text-center">
                            <p className="text-xs text-gray-500 mb-2">الذكور</p>
                            <p className="text-2xl font-bold text-blue-600">{familyStats.males}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-center text-center">
                            <p className="text-xs text-gray-500 mb-2">الإناث</p>
                            <p className="text-2xl font-bold text-pink-500">{familyStats.females}</p>
                        </div>

                        {/* Age Stats */}
                        <div className="col-span-2 grid grid-cols-3 gap-2 mt-2">
                             <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 text-center">
                                 <p className="text-[10px] text-orange-600 font-medium mb-1">متوسط الأعمار</p>
                                 <p className="text-lg font-bold text-orange-800">{familyStats.avgAge}</p>
                             </div>
                             <div className="bg-green-50 p-3 rounded-lg border border-green-100 text-center">
                                 <p className="text-[10px] text-green-600 font-medium mb-1">أصغر فرد</p>
                                 <p className="text-lg font-bold text-green-800">{familyStats.youngest.age}</p>
                                 <p className="text-[9px] text-green-600 truncate px-1">{familyStats.youngest.name}</p>
                             </div>
                             <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 text-center">
                                 <p className="text-[10px] text-indigo-600 font-medium mb-1">أكبر فرد</p>
                                 <p className="text-lg font-bold text-indigo-800">{familyStats.oldest.age}</p>
                                 <p className="text-[9px] text-indigo-600 truncate px-1">{familyStats.oldest.name}</p>
                             </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-3 text-center border-t border-gray-100">
                        <p className="text-xs text-gray-400">تستند الإحصائيات إلى البيانات المسجلة</p>
                    </div>
                </div>
            </div>
        )}

        {/* Tree Container (Scrollable) */}
        <div className="w-full h-full overflow-auto flex items-start justify-center p-10 pt-16 no-scrollbar">
            {/* Click backdrop to close search if clicking on canvas */}
            {(isSearchOpen || areControlsOpen) && (
                <div className="fixed inset-0 z-[35]" onClick={() => {
                   if (isSearchOpen) setIsSearchOpen(false);
                   if (areControlsOpen) setAreControlsOpen(false);
                }}></div>
            )}

           <div 
             style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
             className="transition-transform duration-200 ease-out min-w-max"
           >
              <TreeNode 
                member={FAMILY_DATA} 
                onSelect={handleSelectMember} 
                selectedId={selectedNode?.member.id || null}
                index="1"
                searchTerm={searchTerm}
              />
           </div>
        </div>
      </main>

      {/* Bottom Detail Pane */}
      <BottomSheet 
        member={selectedNode?.member || null}
        index={selectedNode?.index || ''}
        onClose={() => setSelectedNode(null)} 
      />
    </div>
  );
};

export default App;