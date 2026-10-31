import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Mic,
  MicOff,
  Image as ImageIcon,
  Video,
  Music,
  Send,
  Sparkles,
  MapPin,
  Globe,
  Upload,
  Play,
  Pause,
  Download,
  Loader2,
  RefreshCw,
  User,
  CheckCircle2,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export const GeminiAISuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'transcribe' | 'image' | 'video' | 'music'>('chat');

  // --- 1. CHATBOT STATE ---
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      role: 'model',
      text: 'Muraho! I am the EAV Kivumu Academic & Admissions AI Counselor. Ask me anything about our Software Development (SWD L3-L5), Veterinary Medicine, Agriculture trades, or boarding school life in Ngororero.',
      timestamp: '10:00 AM',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState<'gemini-3.8-flash' | 'gemini-4-argon' | 'gemini-3.1-flash-lite'>('gemini-3.8-flash');
  const [useSearch, setUseSearch] = useState(false);
  const [useMaps, setUseMaps] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // --- 2. AUDIO TRANSCRIBE STATE ---
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState<string | null>(null);
  const [transcribeLoading, setTranscribeLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // --- 3. IMAGE GENERATOR / EDITOR STATE ---
  const [imagePrompt, setImagePrompt] = useState('Modern smart greenhouse at EAV Kivumu in Ngororero overlooking Lake Kivu with solar panels');
  const [imageAspectRatio, setImageAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3'>('1:1');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  // --- 4. VIDEO & OMNI ANIMATOR STATE ---
  const [videoPrompt, setVideoPrompt] = useState('Animate the Rwandan flag gently fluttering above EAV Kivumu campus in morning sunlight');
  const [videoAspectRatio, setVideoAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [uploadedPhotoForVideo, setUploadedPhotoForVideo] = useState<string | null>(null);

  // --- 5. LYRIA MUSIC STATE ---
  const [musicPrompt, setMusicPrompt] = useState('Inspirational graduation anthem for EAV Kivumu Software Engineers with African percussion and upbeat marimba');
  const [generatedMusic, setGeneratedMusic] = useState<{ audioUrl: string; lyrics: string } | null>(null);
  const [musicLoading, setMusicLoading] = useState(false);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send Chat message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isChatLoading) return;

    const userText = inputMessage.trim();
    const newMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          model: selectedModel,
          useSearch,
          useMaps,
          history: messages.slice(-6).map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: data.reply || 'Thank you for your message.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'model',
          text: 'EAV Kivumu admissions hotline is reachable directly via call or WhatsApp on 0795547233 (Remmy | L5 SWD).',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Audio recording handlers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Data = reader.result as string;
          sendAudioForTranscription(base64Data);
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert('Microphone access is required for live recording. Alternatively, you can use the sample test voice.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioForTranscription = async (audioData: string) => {
    setTranscribeLoading(true);
    try {
      const res = await fetch('/api/gemini/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioData, mimeType: 'audio/webm' }),
      });
      const data = await res.json();
      setTranscriptionResult(data.transcription);
    } catch (err) {
      setTranscriptionResult('Transcription failed. Please try again.');
    } finally {
      setTranscribeLoading(false);
    }
  };

  // Generate Image
  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    setImageLoading(true);
    try {
      const res = await fetch('/api/gemini/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt, aspectRatio: imageAspectRatio }),
      });
      const data = await res.json();
      setGeneratedImage(data.imageUrl);
    } catch (err) {
      alert('Could not complete image generation.');
    } finally {
      setImageLoading(false);
    }
  };

  // Generate / Animate Video
  const handleGenerateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setVideoLoading(true);
    try {
      const res = await fetch('/api/gemini/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: videoPrompt,
          aspectRatio: videoAspectRatio,
          imageBytes: uploadedPhotoForVideo,
        }),
      });
      const data = await res.json();
      setGeneratedVideo(data.videoUrl);
    } catch (err) {
      alert('Could not complete video animation.');
    } finally {
      setVideoLoading(false);
    }
  };

  // Generate Music with Lyria
  const handleGenerateMusic = async (e: React.FormEvent) => {
    e.preventDefault();
    setMusicLoading(true);
    try {
      const res = await fetch('/api/gemini/music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: musicPrompt }),
      });
      const data = await res.json();
      setGeneratedMusic({ audioUrl: data.audioUrl, lyrics: data.lyrics });
    } catch (err) {
      alert('Could not generate audio track.');
    } finally {
      setMusicLoading(false);
    }
  };

  return (
    <section id="ai-suite" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Gemini Multimodal Innovation Hub
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            AI Assistant, Voice, Video & Creative Suite
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Experience next-generation multimodal intelligence powered by Google Gemini: Chatbot with Google Search & Maps, Audio Transcriber, Image Studio, Omni Video Animator, and Lyria Music.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-100 p-1.5 rounded-2xl max-w-4xl mx-auto mb-10 grid grid-cols-2 sm:grid-cols-5 gap-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('chat')}
            className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeTab === 'chat'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bot className="w-4 h-4 text-emerald-600" />
            <span>Chatbot</span>
          </button>

          <button
            onClick={() => setActiveTab('transcribe')}
            className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeTab === 'transcribe'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mic className="w-4 h-4 text-teal-600" />
            <span>Voice & Audio</span>
          </button>

          <button
            onClick={() => setActiveTab('image')}
            className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeTab === 'image'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-purple-600" />
            <span>Create Images</span>
          </button>

          <button
            onClick={() => setActiveTab('video')}
            className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeTab === 'video'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Video className="w-4 h-4 text-blue-600" />
            <span>Omni Video</span>
          </button>

          <button
            onClick={() => setActiveTab('music')}
            className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeTab === 'music'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Music className="w-4 h-4 text-amber-600" />
            <span>Lyria Music</span>
          </button>
        </div>

        {/* Tab Panels */}
        <div className="max-w-4xl mx-auto bg-slate-50 rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-6 sm:p-8">
          {/* TAB 1: GEMINI CHATBOT */}
          {activeTab === 'chat' && (
            <div className="space-y-4">
              {/* Controls bar: Model selection & Grounding switches */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700">Model:</span>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value as any)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-mono text-xs focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="gemini-3.8-flash">gemini-3.8-flash (General & TVET)</option>
                    <option value="gemini-4-argon">gemini-4-argon (Complex Science & STEM)</option>
                    <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fast)</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={useSearch}
                      onChange={(e) => setUseSearch(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    <span>Google Search</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={useMaps}
                      onChange={(e) => setUseMaps(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Google Maps</span>
                  </label>
                </div>
              </div>

              {/* Scrollable Chat History Thread */}
              <div className="h-80 overflow-y-auto space-y-3 p-3 bg-white rounded-2xl border border-slate-200">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {m.role === 'model' && (
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-1">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-slate-900 text-white rounded-br-xs'
                          : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{m.text}</p>
                      <span className="block text-[10px] opacity-60 text-right mt-1 font-mono">
                        {m.timestamp}
                      </span>
                    </div>
                    {m.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 mt-1">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex gap-2 items-center text-xs text-slate-500 pl-2">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                    <span>Gemini is formulating response...</span>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Quick suggestions */}
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                {[
                  'What are the entry requirements for L5 SWD?',
                  'How does the Veterinary clinic operate?',
                  'Where is EAV Kivumu located in Ngororero?',
                  'Can I contact Remmy on 0795547233?',
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => setInputMessage(s)}
                    className="px-2.5 py-1 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 transition"
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask a question about admissions, syllabus, or campus life..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
                <button
                  type="submit"
                  disabled={isChatLoading || !inputMessage.trim()}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-700/20 transition disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: AUDIO TRANSCRIPTION */}
          {activeTab === 'transcribe' && (
            <div className="space-y-6 text-center">
              <div>
                <h4 className="text-xl font-bold text-slate-900">Live Voice & Audio Transcription</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Transcribe spoken voice using <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">gemini-3.5-transcribe</code>.
                </p>
              </div>

              {/* Record Button */}
              <div className="py-6 flex flex-col items-center gap-4">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition shadow-lg ${
                    isRecording
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-teal-600 text-white hover:bg-teal-700'
                  }`}
                  aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
                >
                  {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </button>
                <span className="text-xs font-bold text-slate-700">
                  {isRecording ? 'Listening... Click to Finish' : 'Click Microphone to Speak'}
                </span>
              </div>

              {transcribeLoading && (
                <div className="flex items-center justify-center gap-2 text-xs text-teal-700 font-medium">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Transcribing with gemini-3.5-transcribe...</span>
                </div>
              )}

              {transcriptionResult && (
                <div className="p-5 rounded-2xl bg-white border border-slate-200 text-left space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 block">
                    Transcription Output:
                  </span>
                  <p className="text-sm text-slate-800 leading-relaxed font-sans">{transcriptionResult}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: IMAGE GENERATOR / EDITOR */}
          {activeTab === 'image' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-bold text-slate-900">AI Image Studio</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Generate and edit high-resolution campus visuals with <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">gemini-nano-banana-2.1</code>.
                </p>
              </div>

              <form onSubmit={handleGenerateImage} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Creative Text Prompt</label>
                  <textarea
                    rows={3}
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">Aspect Ratio:</span>
                    {(['1:1', '16:9', '9:16', '4:3'] as const).map((ratio) => (
                      <button
                        key={ratio}
                        type="button"
                        onClick={() => setImageAspectRatio(ratio)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                          imageAspectRatio === ratio
                            ? 'bg-purple-600 text-white'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={imageLoading}
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/20 flex items-center gap-2 transition disabled:opacity-50"
                  >
                    {imageLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>{imageLoading ? 'Rendering Image...' : 'Generate with nano-banana-2.1'}</span>
                  </button>
                </div>
              </form>

              {generatedImage && (
                <div className="mt-4 rounded-2xl overflow-hidden border border-slate-200 bg-white p-3 text-center">
                  <img
                    src={generatedImage}
                    alt="Generated Visual"
                    className="mx-auto rounded-xl max-h-96 object-cover shadow-sm"
                  />
                  <div className="mt-3 flex justify-end">
                    <a
                      href={generatedImage}
                      download="eav-kivumu-generated.png"
                      className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Save Image</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: OMNI VIDEO ANIMATOR */}
          {activeTab === 'video' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-bold text-slate-900">Omni Flash Video Animator</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Animate photos and text into dynamic video clips via Interactions API with <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">gemini-omni-1.1-flash</code>.
                </p>
              </div>

              <form onSubmit={handleGenerateVideo} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Motion Prompt</label>
                  <textarea
                    rows={2}
                    value={videoPrompt}
                    onChange={(e) => setVideoPrompt(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Optional Photo to Animate</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setUploadedPhotoForVideo(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-100 file:text-blue-800 hover:file:bg-blue-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Aspect Ratio</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setVideoAspectRatio('16:9')}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold transition ${
                          videoAspectRatio === '16:9'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-slate-200 text-slate-700'
                        }`}
                      >
                        16:9 (Landscape)
                      </button>
                      <button
                        type="button"
                        onClick={() => setVideoAspectRatio('9:16')}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold transition ${
                          videoAspectRatio === '9:16'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-slate-200 text-slate-700'
                        }`}
                      >
                        9:16 (Portrait)
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={videoLoading}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center gap-2 transition disabled:opacity-50"
                  >
                    {videoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
                    <span>{videoLoading ? 'Generating with Omni Flash...' : 'Generate / Animate Video'}</span>
                  </button>
                </div>
              </form>

              {generatedVideo && (
                <div className="mt-4 rounded-2xl overflow-hidden border border-slate-200 bg-black p-2 text-center">
                  <video
                    controls
                    autoPlay
                    loop
                    className="w-full max-h-80 mx-auto rounded-lg"
                    src={generatedVideo}
                  />
                  <div className="p-2 flex justify-between items-center text-xs text-slate-400">
                    <span>Generated by gemini-omni-1.1-flash ({videoAspectRatio})</span>
                    <a
                      href={generatedVideo}
                      download="eav-kivumu-clip.mp4"
                      className="px-3 py-1 rounded bg-slate-800 text-white font-mono"
                    >
                      Download MP4
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: LYRIA MUSIC GENERATOR */}
          {activeTab === 'music' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-bold text-slate-900">Lyria AI Music & Anthem Generator</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Compose custom 30-second school anthems, study tracks, and melodies with <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">lyria-3-clip-preview</code>.
                </p>
              </div>

              <form onSubmit={handleGenerateMusic} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Musical Theme & Lyrics Direction</label>
                  <textarea
                    rows={2}
                    value={musicPrompt}
                    onChange={(e) => setMusicPrompt(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={musicLoading}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 flex items-center gap-2 transition disabled:opacity-50"
                  >
                    {musicLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Music className="w-4 h-4" />}
                    <span>{musicLoading ? 'Synthesizing Audio...' : 'Generate with Lyria Clip'}</span>
                  </button>
                </div>
              </form>

              {generatedMusic && (
                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                      <Music className="w-4 h-4 text-amber-700" />
                      Lyria Audio Preview
                    </span>
                    <span className="text-xs font-mono text-amber-800">30s Clip</span>
                  </div>

                  <audio controls className="w-full" src={generatedMusic.audioUrl} />

                  <div className="p-3 bg-white rounded-xl border border-amber-200/80 text-xs text-slate-700 leading-relaxed font-serif italic">
                    "{generatedMusic.lyrics}"
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
