import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Search, Image as ImageIcon, Video, FileText as File, Trash, Link as LinkIcon, Download, X, Copy, Check, Filter } from "lucide-react";
import { collection, query, orderBy, getDocs, doc, deleteDoc, addDoc, serverTimestamp, updateDoc, onSnapshot } from "firebase/firestore";
import { db, auth, handleFirestoreError, OperationType } from "../../lib/firebase";
import { motion, AnimatePresence } from "framer-motion";

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default function MediaManager() {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [uploads, setUploads] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "media"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const mediaData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      setMedia(mediaData);
      setLoading(false);
    }, (error) => {
      try { handleFirestoreError(error, OperationType.GET, "media"); } catch (e) {}
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const processedUploads = acceptedFiles.map(file => {
      const ext = file.name.split('.').pop()?.toLowerCase() || "";
      const isExe = ['exe', 'bat', 'sh', 'php', 'js'].includes(ext);
      
      let errorMsg = "";
      if (isExe) errorMsg = "Unsupported format";
      else if (file.type.startsWith('image/') && file.size > 10 * 1024 * 1024) errorMsg = "Exceeds 10MB";
      else if (file.type.startsWith('video/') && file.size > 100 * 1024 * 1024) errorMsg = "Exceeds 100MB";
      else if (!file.type.startsWith('image/') && !file.type.startsWith('video/') && file.size > 20 * 1024 * 1024) errorMsg = "Exceeds 20MB";

      return {
        file,
        id: Math.random().toString(36).substr(2, 9),
        progress: errorMsg ? 100 : 0,
        status: errorMsg ? 'error' : 'uploading',
        errorMsg
      };
    });

    if (processedUploads.length === 0) return;

    setUploads(prev => [...prev, ...processedUploads]);

    const validUploads = processedUploads.filter(u => u.status !== 'error');

    validUploads.forEach(async upload => {
      if(!auth.currentUser) {
         setUploads(prev => prev.map(u => u.id === upload.id ? { ...u, status: 'error', errorMsg: 'Not authenticated' } : u));
         return;
      }
      
      try {
        const formData = new FormData();
        formData.append("file", upload.file);
        formData.append("folder", "portfolio/media");

        // Optional: show some progress initially
        setUploads(prev => prev.map(u => u.id === upload.id ? { ...u, progress: 30 } : u));

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setUploads(prev => prev.map(u => u.id === upload.id ? { ...u, progress: 90 } : u));
          try {
            await addDoc(collection(db, "media"), {
              filename: upload.file.name,
              url: data.secure_url || data.url,
              public_id: data.public_id, // Ensure public_id matches what we destroy
              type: upload.file.type || data.resource_type || "unknown",
              size: data.bytes || upload.file.size || 0,
              folder: 'portfolio/media',
              tags: [],
              uploader: auth.currentUser?.uid || "unknown",
              isFavorite: false,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
            setUploads(prev => prev.map(u => u.id === upload.id ? { ...u, status: 'completed', progress: 100 } : u));
            setTimeout(() => {
              setUploads(prev => prev.filter(u => u.id !== upload.id));
            }, 3000);
          } catch(err) {
             console.error("Error adding doc to Firestore:", err);
             setUploads(prev => prev.map(u => u.id === upload.id ? { ...u, status: 'error', errorMsg: 'Failed to save to database' } : u));
          }
        } else {
           console.error("Cloudinary upload error:", data);
           const errorMsg = data.error || `HTTP ${response.status} Error`;
           setUploads(prev => prev.map(u => u.id === upload.id ? { ...u, status: 'error', errorMsg } : u));
        }
      } catch (err) {
        console.error("Upload preparation or network error:", err);
        setUploads(prev => prev.map(u => u.id === upload.id ? { ...u, status: 'error', errorMsg: 'Network error or CORS issue' } : u));
      }
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop } as any);

  const deleteMedia = async (item: any, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if(!confirm(`Are you sure you want to delete ${item.filename}?`)) return;
    try {
      if (item.publicId || item.public_id) {
         try {
             await fetch("/api/delete", {
                 method: "POST",
                 headers: { "Content-Type": "application/json" },
                 body: JSON.stringify({
                     public_id: item.publicId || item.public_id,
                     resource_type: item.type.startsWith('video/') ? 'video' : 'image'
                 })
             });
         } catch(e) {
             console.error("Failed to delete from Cloudinary:", e);
         }
      }
      await deleteDoc(doc(db, "media", item.id));
      if(selectedItem?.id === item.id) setSelectedItem(null);
      // Optimistic update
      setMedia(prev => prev.filter(m => m.id !== item.id));
    } catch(err) {
      console.error(err);
      handleFirestoreError(err, OperationType.DELETE, `media/${item.id}`);
    }
  };

  const copyToClipboard = (url: string, id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredMedia = media.filter(item => {
    if (activeTab === "images" && !item.type.startsWith("image/")) return false;
    if (activeTab === "videos" && !item.type.startsWith("video/")) return false;
    if (activeTab === "documents" && (item.type.startsWith("image/") || item.type.startsWith("video/"))) return false;
    
    if (search && !item.filename.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex flex-col md:flex-row h-full gap-6 animate-in fade-in duration-500">
      <div className="flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Media Library</h1>
            <p className="text-[#A8AFBD] mt-1">Manage your images, videos, and documents.</p>
          </div>
          <div {...getRootProps()} className="relative cursor-pointer">
            <input {...getInputProps()} />
            <button className="bg-[#2984FF] hover:bg-[#2984FF]/90 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors whitespace-nowrap">
              <Upload className="w-5 h-5" />
              Upload Files
            </button>
          </div>
        </div>

        {uploads.length > 0 && (
          <div className="bg-[#1B1B1B] border border-white/5 p-4 rounded-2xl flex flex-col gap-3">
             <h3 className="text-sm font-semibold text-white">Uploading {uploads.length} files...</h3>
             <div className="space-y-2 max-h-40 overflow-y-auto">
                {uploads.map(up => (
                  <div key={up.id} className="flex items-center gap-3 bg-[#101010] p-2 rounded-xl">
                     <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                           <span className={`text-xs truncate w-48 ${up.status === 'error' ? 'text-red-400' : 'text-[#A8AFBD]'}`}>{up.file.name}</span>
                           <span className={`text-xs font-medium ${up.status === 'error' ? 'text-red-400' : 'text-white'}`}>{up.status === 'error' ? up.errorMsg || 'Failed' : `${Math.round(up.progress)}%`}</span>
                        </div>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                           <div className={`h-full transition-all duration-300 ${up.status === 'error' ? 'bg-red-500' : 'bg-[#2984FF]'}`} style={{ width: `${up.progress}%` }}></div>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        <div className="bg-[#1B1B1B] border border-white/5 rounded-2xl p-6">
           <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
              <div className="flex gap-2 bg-[#101010] p-1 rounded-xl border border-white/5 overflow-x-auto scrollbar-hide">
                 {["all", "images", "videos", "documents"].map(tab => (
                   <button 
                     key={tab}
                     onClick={() => setActiveTab(tab)}
                     className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                       activeTab === tab ? "bg-white/10 text-white" : "text-[#A8AFBD] hover:text-white"
                     }`}
                   >
                     <span className="capitalize">{tab}</span>
                   </button>
                 ))}
              </div>
              <div className="relative w-full lg:w-64">
                 <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8AFBD]" />
                 <input 
                   type="text" 
                   placeholder="Search media..." 
                   className="w-full bg-[#101010] border border-white/10 rounded-xl pl-9 pr-4 py-1.5 text-sm text-white focus:outline-none focus:border-[#2984FF] transition-colors"
                   value={search}
                   onChange={e => setSearch(e.target.value)}
                 />
              </div>
           </div>

           <div 
             {...getRootProps()} 
             className={`min-h-[400px] border-2 border-dashed rounded-2xl transition-all ${isDragActive ? 'border-[#2984FF] bg-[#2984FF]/5' : 'border-transparent'}`}
           >
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-2">
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="aspect-square bg-[#101010] animate-pulse rounded-xl"></div>
                  ))}
                </div>
              ) : filteredMedia.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-10 cursor-pointer">
                   <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 text-[#A8AFBD]">
                     <Upload className="w-8 h-8" />
                   </div>
                   <h3 className="text-xl font-bold text-white mb-2">Drag & Drop files here</h3>
                   <p className="text-[#A8AFBD] text-sm max-w-sm mb-6">Upload images, videos or documents. This media library connects directly to your cloud storage.</p>
                   <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl transition-colors text-sm font-medium">Browse Files</button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-2">
                   {filteredMedia.map(item => (
                     <div 
                        key={item.id} 
                        onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}
                        className={`group flex flex-col bg-[#101010] border rounded-xl overflow-hidden transition-all cursor-pointer ${selectedItem?.id === item.id ? 'border-[#2984FF] ring-1 ring-[#2984FF]' : 'border-white/5 hover:border-white/20'}`}
                     >
                        <div className="aspect-square relative overflow-hidden bg-white/5 flex items-center justify-center">
                           {item.type.startsWith('image/') ? (
                              <img src={item.url} alt={item.filename} className="w-full h-full object-cover" />
                           ) : item.type.startsWith('video/') ? (
                              <Video className="w-10 h-10 text-[#A8AFBD]" />
                           ) : (
                              <File className="w-10 h-10 text-[#A8AFBD]" />
                           )}
                           <div className={`absolute inset-0 bg-black/60 transition-opacity flex flex-col items-center justify-center gap-2 ${selectedItem?.id === item.id ? 'opacity-100 sm:opacity-0 sm:group-hover:opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                              <div className="flex gap-2">
                                 <button onClick={(e) => copyToClipboard(item.url, item.id, e)} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white" title="Copy Link">
                                    {copiedId === item.id ? <Check className="w-4 h-4 text-green-400" /> : <LinkIcon className="w-4 h-4"/>}
                                 </button>
                                 <a href={item.url} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white" title="Download"><Download className="w-4 h-4"/></a>
                              </div>
                              <button onClick={(e) => deleteMedia(item, e)} className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-400" title="Delete"><Trash className="w-4 h-4"/></button>
                           </div>
                        </div>
                        <div className="p-3">
                           <p className="text-sm font-medium text-white truncate" title={item.filename}>{item.filename}</p>
                           <div className="flex justify-between items-center mt-1">
                             <p className="text-[10px] text-[#A8AFBD] tracking-wider">{formatBytes(item.size)}</p>
                             <p className="text-[10px] text-[#A8AFBD] uppercase border border-white/10 px-1.5 py-0.5 rounded">{item.type.split('/')[0]}</p>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Right Preview Sidebar */}
      <AnimatePresence>
         {selectedItem && (
            <motion.div 
               initial={{ opacity: 0, x: 20, width: 0 }}
               animate={{ opacity: 1, x: 0, width: '100%', maxWidth: '320px' }}
               exit={{ opacity: 0, x: 20, width: 0 }}
               className="bg-[#1B1B1B] border border-white/5 rounded-2xl flex flex-col h-auto sm:h-[calc(100vh-120px)] sticky top-24 shrink-0 overflow-hidden"
            >
               <div className="p-4 border-b border-white/5 flex justify-between items-center">
                  <h3 className="font-bold text-white">File Details</h3>
                  <button onClick={() => setSelectedItem(null)} className="p-1 hover:bg-white/10 rounded-lg text-[#A8AFBD] hover:text-white transition-colors"><X className="w-4 h-4" /></button>
               </div>
               <div className="p-4 overflow-y-auto flex-1 scrollbar-hide">
                  <div className="aspect-video bg-[#101010] rounded-xl overflow-hidden flex items-center justify-center mb-4 border border-white/5 relative group">
                     {selectedItem.type.startsWith('image/') ? (
                        <img src={selectedItem.url} alt={selectedItem.filename} className="w-full h-full object-contain" />
                     ) : selectedItem.type.startsWith('video/') ? (
                        <video src={selectedItem.url} controls className="w-full h-full" />
                     ) : (
                        <File className="w-12 h-12 text-[#A8AFBD]" />
                     )}
                  </div>
                  
                  <div className="space-y-4">
                     <div>
                        <label className="text-[10px] font-bold text-[#A8AFBD] uppercase tracking-wider mb-1 block">File Name</label>
                        <p className="text-sm text-white break-all">{selectedItem.filename}</p>
                     </div>
                     <div>
                        <label className="text-[10px] font-bold text-[#A8AFBD] uppercase tracking-wider mb-1 block">Type</label>
                        <p className="text-sm text-white">{selectedItem.type}</p>
                     </div>
                     <div>
                        <label className="text-[10px] font-bold text-[#A8AFBD] uppercase tracking-wider mb-1 block">Size</label>
                        <p className="text-sm text-white">{formatBytes(selectedItem.size)}</p>
                     </div>
                     <div>
                        <label className="text-[10px] font-bold text-[#A8AFBD] uppercase tracking-wider mb-1 block">Uploaded On</label>
                        <p className="text-sm text-white">{selectedItem.createdAt ? selectedItem.createdAt.toLocaleDateString() : 'Unknown'}</p>
                     </div>
                     <div>
                        <label className="text-[10px] font-bold text-[#A8AFBD] uppercase tracking-wider mb-1 block">File URL</label>
                        <div className="flex gap-2">
                           <input type="text" readOnly value={selectedItem.url} className="w-full bg-[#101010] border border-white/5 rounded-lg px-3 py-2 text-xs text-[#A8AFBD] focus:outline-none" />
                           <button 
                             onClick={(e) => copyToClipboard(selectedItem.url, selectedItem.id, e)}
                             className="p-2 bg-[#2984FF]/10 text-[#2984FF] hover:bg-[#2984FF]/20 rounded-lg transition-colors shrink-0"
                             title="Copy URL"
                           >
                              {copiedId === selectedItem.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                           </button>
                        </div>
                     </div>
                  </div>
                  
                  <div className="mt-8 space-y-2">
                     <a href={selectedItem.url} target="_blank" rel="noreferrer" className="w-full text-center block bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                        Open in new tab
                     </a>
                     <button onClick={(e) => deleteMedia(selectedItem, e)} className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                        Delete File
                     </button>
                  </div>
               </div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}
