'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import { setUserData, updateUserData, markOnboardingCompleted } from '../../lib/userState';
import FaceAnalysisWidget from '../../components/FaceAnalysisWidget';
import SkinToneAnalysisWidget from '../../components/SkinToneAnalysisWidget';
import BodyAnalysisWidget from '../../components/BodyAnalysisWidget';
import PersonalityAnalysisWidget from '../../components/PersonalityAnalysisWidget';
import Galaxy from './components/Galaxy';
import Image from 'next/image';
import FacePhoto from '@/app/assets/onboarding/face.png'
import BodyPhoto from '@/app/assets/onboarding/body.png'

// Onboarding steps
const STEPS = {
  LOGIN: 'login',
  BASIC_INFO: 'basic_info',
  SKIN_FACE_ANALYSIS: 'skin_face_analysis',
  BODY_ANALYSIS: 'body_analysis',
  PERSONALITY_ANALYSIS: 'personality_analysis',
  COMPLETE: 'complete'
} as const;

type StepType = (typeof STEPS)[keyof typeof STEPS];
const STEP_ORDER: StepType[] = [
  STEPS.LOGIN,
  STEPS.BASIC_INFO,
  STEPS.SKIN_FACE_ANALYSIS,
  STEPS.BODY_ANALYSIS,
  STEPS.PERSONALITY_ANALYSIS,
  STEPS.COMPLETE
];

interface UserData {
  email: string;
  name: string;
  gender: 'male' | 'female' | '';
  location: string;
  skin_tone: string;
  face_shape: string | null;
  body_shape: string | null;
  personality: string | null;
  onboarding_completed: boolean;
}

interface Product {
  title: string;
  price: string;
  image: string;
  link: string;
}

export default function Onboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<StepType>(STEPS.LOGIN);
  const [userData, setUserDataState] = useState<UserData>({
    email: '',
    name: '',
    gender: '',
    location: '',
    skin_tone: '',
    face_shape: null,
    body_shape: null,
    personality: null,
    onboarding_completed: false
  });


  // Step 1: Login Component
  const LoginStep = () => {
    const handleGoogleLogin = () => {
      // Simulate Google login - in real app, integrate with Google OAuth
      const mockUserData: UserData = {
        email: 'user@gmail.com',
        name: '',
        gender: '',
        location: 'Mumbai',
        skin_tone: '',
        face_shape: null,
        body_shape: null,
        personality: null,
        onboarding_completed: false
      };

      setUserData(mockUserData);
      setUserDataState(mockUserData);
      setCurrentStep(STEPS.BASIC_INFO);
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black"
      >
        <div className="text-center text-white p-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to AuraSync</h1>
          <p className="text-xl mb-8 text-gray-300">Let&apos;s personalize your fashion journey</p>

          <button
            onClick={handleGoogleLogin}
            className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center mx-auto gap-3"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <div className="mt-8">
            <button
              onClick={() => {
                // For testing - skip to next step
                const mockUserData: UserData = {
                  email: 'test@gmail.com',
                  name: '',
                  gender: '',
                  location: 'Mumbai',
                  skin_tone: '',
                  face_shape: null,
                  body_shape: null,
                  personality: null,
                  onboarding_completed: false
                };
                setUserData(mockUserData);
                setUserDataState(mockUserData);
                setCurrentStep(STEPS.BASIC_INFO);
              }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Skip for testing →
            </button>
          </div>
        </div>
      </motion.div>
    );
  };
  const ProgressBar = ({ currentStep }: { currentStep: StepType }) => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    const progress = ((currentIndex + 1) / STEP_ORDER.length) * 100;
    return (
      <div>
        <div className="hidden md:block w-[50vw] absolute top-10 left-1/2 transform -translate-x-1/2 bg-white/20 rounded-full h-3 mb-8">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const MobileStepper = ({ currentStep }: { currentStep: StepType }) => {
    const stepsForMobile: StepType[] = [
      STEPS.SKIN_FACE_ANALYSIS,
      STEPS.BODY_ANALYSIS,
      STEPS.PERSONALITY_ANALYSIS,
    ];
    const labels = ['Face structure', 'Body Type', 'Personality'];
    const activeIndex = Math.max(0, stepsForMobile.indexOf(currentStep));

    return (
      <div className="md:hidden w-full max-w-sm mx-auto pt-6 pb-4">
        <div className="flex items-center justify-between">
          {stepsForMobile.map((_, index) => (
            <div key={index} className="flex-1 flex items-center">
              <div className="flex flex-col items-center justify-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border ${
                    index <= activeIndex
                      ? 'bg-white text-gray-900 border-white'
                      : 'bg-transparent text-white border-white/40'
                  }`}
                >
                  {index + 1}
                </div>
                <span className="mt-1 text-[10px] text-white/80 whitespace-nowrap">
                  {labels[index]}
                </span>
              </div>
              {index < stepsForMobile.length - 1 && (
                <div className={`h-[2px] flex-1 mx-2 ${index < activeIndex ? 'bg-white' : 'bg-white/30'}`}></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };
  // Step 2: Basic Info Component
  const BasicInfoStep = ({
    userData,
    updateUserData,
    setUserDataState,
    setCurrentStep,
    STEPS,
  }: any) => {
    const [localName, setLocalName] = useState(userData.name || "");
    const [localGender, setLocalGender] = useState(userData.gender || "");

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (localName && localGender) {
        const updatedData = { ...userData, name: localName, gender: localGender };
        updateUserData(updatedData);
        setUserDataState(updatedData); // sync only once here
        setCurrentStep(STEPS.SKIN_FACE_ANALYSIS);
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="min-h-screen flex items-center justify-center"
      >
        {/* Background Galaxy */}
        <div style={{ width: "100%", height: "100vh", position: "relative" }}>
          <Galaxy
            mouseRepulsion={true}
            mouseInteraction={true}
            density={0.5}
            glowIntensity={0.5}
            saturation={0}
            hueShift={0}
          />
        </div>

        <div className="w-full h-[100vh]  absolute top-0 left-0 bg-black/50 pointer-events-none"></div>
        <ProgressBar currentStep={STEPS.BASIC_INFO} />

        {/* Form */}
        <div className="bg-[#353333] absolute backdrop-blur-lg rounded-2xl p-8 w-full max-w-md text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Tell us about yourself
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                What is your full name
              </label>
              <input
                type="text"
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
                className="w-full px-4 py-3 rounded-tr-3xl rounded-bl-3xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:border-white/50"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium mb-2">Gender</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setLocalGender("male")}
                  className={`p-4 rounded-lg border-2 transition-colors ${localGender === "male"
                      ? "border-blue-400 bg-blue-400/20"
                      : "border-white/30 bg-white/10 hover:border-white/50"
                    }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">👨</div>
                    <div className="font-medium">Male</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setLocalGender("female")}
                  className={`p-4 rounded-lg border-2 transition-colors ${localGender === "female"
                      ? "border-pink-400 bg-pink-400/20"
                      : "border-white/30 bg-white/10 hover:border-white/50"
                    }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">👩</div>
                    <div className="font-medium">Female</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!localName || !localGender}
              className="w-full rounded-full bg-[#4F4D4D] py-3 transition-all"
            >
              Proceed
            </button>
          </form>
        </div>
      </motion.div>
    );
  };


  // Step 3: Skin & Face Analysis Component
  const SkinFaceAnalysisStep = ({ userData, setUserDataState, setCurrentStep, STEPS }: any) => {
    const [analysisData, setAnalysisData] = useState({
      skin_tone: '',
      face_shape: ''
    });

    const [currentAnalysis, setCurrentAnalysis] = useState<'skin_tone' | 'face_shape' | null>(null);
    const [progress, setProgress] = useState(0);
    const [capturedImages, setCapturedImages] = useState<string[]>([]);
    const [analysisResults, setAnalysisResults] = useState<string[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showManualInput, setShowManualInput] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [isAutoCapturing, setIsAutoCapturing] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [showUpload, setShowUpload] = useState(false);
    const [faceLocked, setFaceLocked] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const webcamRef = useRef<Webcam>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleNext = () => {
      if (analysisData.skin_tone) {
        const updatedData = { ...userData, ...analysisData };
        updateUserData(updatedData);
        setUserDataState(updatedData);
        setCurrentStep(STEPS.BODY_ANALYSIS);
      }
    };

    const startAnalysis = async (type: 'skin_tone' | 'face_shape', method: 'camera' | 'upload' = 'camera') => {
      if (type === 'face_shape' && faceLocked) return;
      setCurrentAnalysis(type);
      setProgress(0);
      setCapturedImages([]);
      setAnalysisResults([]);
      setIsAnalyzing(false);
      setShowManualInput(false);
      setUploadedImage(null);

      if (method === 'upload') {
        setShowUpload(true);
        setShowCamera(false);
        setIsAutoCapturing(false);
        // Trigger file input
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
      } else {
        setShowCamera(true);
        setIsAutoCapturing(true);
        setShowUpload(false);
        // Start automatic capture process
        startAutoCapture();
      }
    };

    const startAutoCapture = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }

        // Start automatic capture sequence
        for (let i = 0; i < 3; i++) {
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
          await captureImage();
          setProgress((i + 1) * 25);
        }

        // Stop camera after capturing
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach((track) => track.stop());
          videoRef.current.srcObject = null;
        }
        setShowCamera(false);
        setIsAutoCapturing(false);

      } catch (err) {
        console.error('Camera access error:', err);
        setShowCamera(false);
        setIsAutoCapturing(false);
        // Fallback to manual input
        handleManualInput(currentAnalysis!);
      }
    };

    const captureImage = async () => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(async (blob) => {
            if (blob) {
              const imageUrl = URL.createObjectURL(blob);
              setCapturedImages(prev => [...prev, imageUrl]);

              // Analyze the captured image
              await analyzeImage(blob);
            }
          }, 'image/jpeg');
        }
      }
    };

    const analyzeImage = async (blob: Blob) => {
      setIsAnalyzing(true);
      try {
        const formData = new FormData();
        formData.append('file', new File([blob], 'captured.jpg', { type: 'image/jpeg' }));

        const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const endpoint = currentAnalysis === 'skin_tone'
          ? `${API}/analyze/skin-tone`
          : `${API}/analyze/face`;

        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Analysis failed');
        }

        const data = await response.json();
        let result = '';

        if (currentAnalysis === 'skin_tone') {
          result = data.skin_tone || 'Unknown';
        } else {
          result = data.face_shape || 'Unknown';
        }

        setAnalysisResults(prev => [...prev, result]);

        // If we have 3 results, determine final result
        if (analysisResults.length + 1 >= 3) {
          const finalResults = [...analysisResults, result];
          const mostCommon = finalResults.reduce((acc, val) => {
            acc[val] = (acc[val] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          const finalResult = Object.entries(mostCommon).reduce((a, b) =>
            mostCommon[a[0]] > mostCommon[b[0]] ? a : b
          )[0];

          setAnalysisData(prev => ({ ...prev, [currentAnalysis!]: finalResult }));
          setCurrentAnalysis(null);
          setProgress(100);
        }

      } catch (error) {
        console.error('Analysis error:', error);
        // Add a default result if analysis fails
        const defaultResult = currentAnalysis === 'skin_tone' ? 'Warm' : 'Oval';
        setAnalysisResults(prev => [...prev, defaultResult]);
      } finally {
        setIsAnalyzing(false);
      }
    };

    const handleManualInput = (type: 'skin_tone' | 'face_shape') => {
      setCurrentAnalysis(type);
      setShowManualInput(true);
      setShowCamera(false);
      setIsAutoCapturing(false);
      setShowUpload(false);
      if (type === 'skin_tone') {
        setFaceLocked(true);
        setAnalysisData(prev => ({ ...prev, face_shape: '' }));
      }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Create preview
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      setProgress(50);

      // Analyze the uploaded image
      try {
        setIsAnalyzing(true);
        const formData = new FormData();
        formData.append('file', file);

        const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const endpoint = currentAnalysis === 'skin_tone'
          ? `${API}/analyze/skin-tone`
          : `${API}/analyze/face`;

        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Analysis failed');
        }

        const data = await response.json();
        let result = '';

        if (currentAnalysis === 'skin_tone') {
          result = data.skin_tone || 'Unknown';
        } else {
          result = data.face_shape || 'Unknown';
        }

        setAnalysisResults([result]);
        setAnalysisData(prev => ({ ...prev, [currentAnalysis!]: result }));
        setCurrentAnalysis(null);
        setProgress(100);
        setShowUpload(false);

      } catch (error) {
        console.error('Analysis error:', error);
        alert('Analysis failed. Please try again or use manual selection.');
        setShowUpload(false);
        setCurrentAnalysis(null);
      } finally {
        setIsAnalyzing(false);
      }
    };

    const handleManualSelection = (value: string) => {
      setAnalysisData(prev => ({ ...prev, [currentAnalysis!]: value }));
      setCurrentAnalysis(null);
      setShowManualInput(false);
    };

    // Upload Analysis Component
    const UploadAnalysis = () => (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">
          {currentAnalysis === 'skin_tone' ? 'Skin Tone Analysis' : 'Face Shape Analysis'}
          <span className="ml-2 text-sm px-2 py-1 rounded bg-green-500/20 text-green-300">
            Upload Analysis
          </span>
        </h3>

        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-2 mb-4">
          <div
            className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <p className="text-sm text-gray-300 mb-4">
          Progress: {progress}% - {isAnalyzing ? 'Analyzing...' : 'Ready'}
        </p>

        {isAnalyzing && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p>Analyzing uploaded image...</p>
          </div>
        )}

        {/* Uploaded Image Preview */}
        {uploadedImage && (
          <div className="mb-6 flex flex-col items-center">
            <img
              src={uploadedImage}
              alt="Uploaded image"
              className="w-full max-w-md rounded-lg border-2 border-gray-700 mb-2 shadow-lg"
            />
            <p className="text-sm text-gray-300">Uploaded image preview</p>
          </div>
        )}

        {analysisResults.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Analysis Result:</h4>
            <div className="bg-green-500/20 rounded-lg p-3">
              <p className="text-green-300 font-medium">
                {currentAnalysis === 'skin_tone' ? 'Skin Tone' : 'Face Shape'}: {analysisResults[0]}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() => handleManualInput(currentAnalysis!)}
          className="mt-4 w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Manual Input Instead
        </button>
      </div>
    );

    // Manual Input Components
    // const SkinToneManualInput = () => (
    //   <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
    //     <h3 className="text-xl font-semibold mb-4">Select Your Skin Tone</h3>
    //     <div className="space-y-3">
    //       {['Warm', 'Cool', 'Neutral'].map((tone) => (
    //         <button
    //           key={tone}
    //           onClick={() => handleManualSelection(tone)}
    //           className="w-full p-3 rounded-lg border-2 border-white/30 bg-white/10 hover:border-white/50 transition-colors"
    //         >
    //           {tone}
    //         </button>
    //       ))}
    //     </div>
    //   </div>
    // );

    const SkinToneManualInput = () => {
      const [currentQuestion, setCurrentQuestion] = useState(0);
      const [answers, setAnswers] = useState<string[]>([]);
      
      const questions = [
        {
          question: "What color are the veins on your wrist?",
          options: ["Bluish or Purple", "Greenish", "Hard to tell / Mix of both"]
        },
        {
          question: "How does your skin react to sunlight?",
          options: ["Tans easily, rarely burns", "Burns or turns pink easily", "Sometimes tans, sometimes burns"]
        },
        {
          question: "What undertone does your bare skin have in natural light?",
          options: ["Yellow, peachy, or golden", "Pink, red, or bluish", "Olive or hard to tell"]
        }
      ];

      const handleAnswer = (answer: string) => {
        const newAnswers = [...answers, answer];
        setAnswers(newAnswers);
        
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
        } else {
          // Determine skin tone based on answers
          let skinTone = 'Warm';
          if (newAnswers[0] === 'Bluish or Purple' && newAnswers[1] === 'Burns or turns pink easily' && newAnswers[2] === 'Pink, red, or bluish') {
            skinTone = 'Cool';
          } else if (newAnswers[0] === 'Hard to tell / Mix of both' || newAnswers[1] === 'Sometimes tans, sometimes burns' || newAnswers[2] === 'Olive or hard to tell') {
            skinTone = 'Neutral';
          }
          
          setAnalysisData(prev => ({ ...prev, skin_tone: skinTone }));
          setCurrentAnalysis(null);
          setShowManualInput(false);
        }
      };

      const resetQuestionnaire = () => {
        setCurrentQuestion(0);
        setAnswers([]);
      };

      return (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Skin Tone Analysis</h3>
          
          {currentQuestion < questions.length ? (
            <div>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-300">Question {currentQuestion + 1} of {questions.length}</span>
                  <div className="flex space-x-1">
                    {questions.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index <= currentQuestion ? 'bg-white' : 'bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <h4 className="text-lg font-medium mb-6">{questions[currentQuestion].question}</h4>
              
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="w-full p-4 rounded-lg border-2 border-white/30 bg-white/10 hover:border-white/50 transition-colors text-left"
                  >
                    {option}
                  </button>
                ))}
              </div>

              {currentQuestion > 0 && (
                <button
                  onClick={() => {
                    setCurrentQuestion(currentQuestion - 1);
                    setAnswers(answers.slice(0, -1));
                  }}
                  className="mt-4 w-full text-gray-300 underline text-sm"
                >
                  ← Back to previous question
                </button>
              )}
            </div>
          ) : (
            <div className="text-center">
              <div className="text-4xl mb-4">✨</div>
              <h4 className="text-lg font-medium mb-2">Analysis Complete!</h4>
              <p className="text-gray-300 mb-4">Your skin tone has been determined based on your answers.</p>
              <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                <p className="text-green-300 font-medium">
                  Skin Tone: {analysisData.skin_tone}
                </p>
              </div>
              <button
                onClick={resetQuestionnaire}
                className="text-gray-300 underline text-sm"
              >
                Retake questionnaire
              </button>
            </div>
          )}
        </div>
      );
    };

    const FaceShapeManualInput = () => (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Select Your Face Shape</h3>
        <div className="space-y-3">
          {['Oval', 'Round', 'Square', 'Heart', 'Diamond', 'Rectangle'].map((shape) => (
            <button
              key={shape}
              onClick={() => handleManualSelection(shape)}
              className="w-full p-3 rounded-lg border-2 border-white/30 bg-white/10 hover:border-white/50 transition-colors"
            >
              {shape}
            </button>
          ))}
        </div>
      </div>
    );

    // Camera Analysis Component
    const CameraAnalysis = () => (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">
          {currentAnalysis === 'skin_tone' ? 'Skin Tone Analysis' : 'Face Shape Analysis'}
        </h3>

        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-2 mb-4">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <p className="text-sm text-gray-300 mb-4">
          Progress: {progress}% - {capturedImages.length}/3 images captured
        </p>

        {isAutoCapturing && (
          <div className="text-center py-4">
            <div className="text-2xl font-bold text-yellow-400 mb-2">
              Auto-capturing in progress...
            </div>
            <p className="text-sm text-gray-300">Please stay still while we capture 3 images</p>
          </div>
        )}

        {isAnalyzing && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p>Analyzing image...</p>
          </div>
        )}

        {/* Camera Feed */}
        {showCamera && (
          <div className="mb-6 flex flex-col items-center">
            <video
              ref={videoRef}
              className="w-full max-w-md rounded-lg border-2 border-gray-700 mb-2 shadow-lg"
              autoPlay
              playsInline
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
        )}

        {capturedImages.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Captured Images:</h4>
            <div className="grid grid-cols-3 gap-2">
              {capturedImages.map((img, index) => (
                <div key={index} className="bg-white/20 rounded p-2 text-center text-sm">
                  <img src={img} alt={`Image ${index + 1}`} className="w-full h-20 object-cover rounded mb-1" />
                  Image {index + 1}
                </div>
              ))}
            </div>
          </div>
        )}

        {analysisResults.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Analysis Results:</h4>
            <div className="space-y-1">
              {analysisResults.map((result, index) => (
                <div key={index} className="text-sm text-gray-300">
                  Image {index + 1}: {result}
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => handleManualInput(currentAnalysis!)}
          className="mt-4 w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Manual Input Instead
        </button>
      </div>
    );

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="min-h-screen bg-[#251F1E] flex items-center justify-center  text-white p-4 md:p-8"
      >
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className='w-full'>
            <ProgressBar currentStep={STEPS.SKIN_FACE_ANALYSIS} />
            <MobileStepper currentStep={STEPS.SKIN_FACE_ANALYSIS} />
          </div>

          {/* Show upload analysis if active */}
          {showUpload && currentAnalysis === 'face_shape' && (
            <div className="mb-8">
              <UploadAnalysis />
            </div>
          )}

          {/* Show camera analysis if active */}
          {currentAnalysis === 'face_shape' && !showManualInput && !showUpload && (
            <div className="mb-8">
              <CameraAnalysis />
            </div>
          )}

          {/* Show manual input if active */}
          {showManualInput && currentAnalysis === 'skin_tone' && (
            <SkinToneManualInput />
          )}
          {showManualInput && currentAnalysis === 'face_shape' && (
            <FaceShapeManualInput />
          )}

          {/* Show analysis options if no analysis is active */}
          {!currentAnalysis && !showManualInput && (
            <div className="w-full md:w-[100vw] md:h-[80vh] gap-8">
              {/* Face Analysis */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">

                {/* <p className="text-sm text-gray-300 mb-4">
              {analysisData.face_shape
                ? `Selected: ${analysisData.face_shape}`
                : 'Not completed'}
            </p> */}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {/* Image Section */}
                  <div className="md:w-3/4 w-full h-[32vh] md:h-[80vh]  relative rounded-lg overflow-hidden">
                    <Image
                      src={FacePhoto}
                      alt="Face Photo"
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="md:w-1/4 w-full flex flex-col space-y-4">
                    {/* Analysis Status */}
                    <div className="w-full h-auto bg-[#444141] p-4 rounded-3xl backdrop-blur-lg text-white">
                      <h3 className="text-lg font-bold mb-3">Analysis Status</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Skin Tone:</span>
                          <span className={`text-sm px-2 py-1 rounded ${analysisData.skin_tone ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}`}>
                            {analysisData.skin_tone || 'Pending'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Face Shape:</span>
                          <span className={`text-sm px-2 py-1 rounded ${analysisData.face_shape ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                            {analysisData.face_shape || 'Optional'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full h-auto bg-[#444141] p-6 rounded-3xl backdrop-blur-lg text-white">
                      <h1 className="text-xl font-bold mb-4">📸 Face & Skin Analysis Instructions</h1>
                      <p className="text-sm mb-3">
                        To get the best results, please follow these steps:
                      </p>
                      <ul className="list-disc list-inside text-sm space-y-1 mb-3">
                        <li>Sit in a well-lit area (avoid shadows or backlight).</li>
                        <li>Keep your head straight and look directly into the camera.</li>
                        <li>Remove glasses, masks, or anything covering your face.</li>
                        <li>Stay still for a few seconds while we scan.</li>
                      </ul>
                      <p className="text-sm">
                        ✨ <span className="font-semibold">Tip:</span> Natural daylight works best for accurate skin tone detection.
                      </p>
                    </div>

                    <div className='flex bg-[#444141] p-6 rounded-3xl justify-center items-center flex-col'>
                      <h1 className='text-xl font-bold mb-4 text-center'>Upload picture from your device </h1>
                      <button
                        onClick={() => startAnalysis('face_shape', 'upload')}
                        className=" border-2 border-white px-16 text-white py-3 rounded-full font-semibold hover:border-white hover:from-green-600 hover:to-emerald-700 transition-all"
                      >
                        Upload +
                      </button>
                    </div>
                    <button
                      onClick={() => startAnalysis('face_shape', 'camera')}
                      className="w-full bg-[#444141] text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
                    >
                      Capture from Web Camera
                    </button>
                    <button
                      onClick={() => handleManualInput('skin_tone')}
                      className="w-full  text-white py-3 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <span className='underline'> Or Insert Manually</span>
                    </button>
                    <button
                      onClick={() => {
                        // Skip face analysis, only do skin tone
                        if (!analysisData.skin_tone) {
                          setAnalysisData(prev => ({ ...prev, skin_tone: 'Warm' })); // Default skin tone
                        }
                      }}
                      className="w-full text-gray-400 py-2 text-sm underline hover:text-white transition-colors"
                    >
                      Skip Face Analysis
                    </button>
                    <div className="flex justify-center gap-4 mt-8">
                      <button
                        onClick={() => setCurrentStep(STEPS.BASIC_INFO)}
                        className="px-8 py-3 rounded-lg border-2 border-white/30 bg-white/10 text-white hover:border-white/50 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleNext}
                        disabled={!analysisData.skin_tone}
                        className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-purple-700 transition-all"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />


        </div>
      </motion.div>
    );

  };

  // Step 4: Body Analysis Component
  const BodyAnalysisStep = ({ userData, setUserDataState, setCurrentStep, STEPS }: any) => {
    const [analysisData, setAnalysisData] = useState({
      body_shape: ''
    });

    const [currentAnalysis, setCurrentAnalysis] = useState<'body_shape' | null>(null);
    const [progress, setProgress] = useState(0);
    const [capturedImages, setCapturedImages] = useState<string[]>([]);
    const [analysisResults, setAnalysisResults] = useState<string[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showManualInput, setShowManualInput] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [isAutoCapturing, setIsAutoCapturing] = useState(false);

    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [showUpload, setShowUpload] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const webcamRef = useRef<Webcam>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleNext = () => {
      const updatedData = { ...userData, body_shape: analysisData.body_shape };
      updateUserData(updatedData);
      setUserDataState(updatedData);
      setCurrentStep(STEPS.PERSONALITY_ANALYSIS);
    };

    const startAnalysis = async (type: 'body_shape', method: 'camera' | 'upload' = 'camera') => {
      setCurrentAnalysis(type);
      setProgress(0);
      setCapturedImages([]);
      setAnalysisResults([]);
      setIsAnalyzing(false);
      setShowManualInput(false);
      setUploadedImage(null);



      if (method === 'upload') {
        setShowUpload(true);
        setShowCamera(false);
        setIsAutoCapturing(false);
        // Trigger file input
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
      } else {
        setShowCamera(true);
        setIsAutoCapturing(true);
        setShowUpload(false);
        // Start automatic capture process
        startAutoCapture();
      }
    };

    const startAutoCapture = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }

        // Start automatic capture sequence
        for (let i = 0; i < 3; i++) {
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
          await captureImage();
          setProgress((i + 1) * 25);
        }

        // Stop camera after capturing
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach((track) => track.stop());
          videoRef.current.srcObject = null;
        }
        setShowCamera(false);
        setIsAutoCapturing(false);

      } catch (err) {
        console.error('Camera access error:', err);
        setShowCamera(false);
        setIsAutoCapturing(false);
        // Fallback to manual input
        handleManualInput('body_shape');
      }
    };

    const captureImage = async () => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(async (blob) => {
            if (blob) {
              const imageUrl = URL.createObjectURL(blob);
              setCapturedImages(prev => [...prev, imageUrl]);

              // Analyze the captured image
              await analyzeImage(blob);
            }
          }, 'image/jpeg');
        }
      }
    };

    const analyzeImage = async (blob: Blob) => {
      setIsAnalyzing(true);
      try {
        const formData = new FormData();
        formData.append('file', new File([blob], 'captured.jpg', { type: 'image/jpeg' }));

        // Use basic body analysis endpoint
        const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const endpoint = `${API}/analyze/body`;

        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Analysis failed');
        }

        const data = await response.json();
        const result = data.body_shape || 'Unknown';

        // Log analysis details for debugging
        console.log('Body analysis result:', {
          body_shape: data.body_shape,
          confidence: data.confidence,
          analysis_type: data.analysis_type,
          probabilities: data.probabilities
        });

        setAnalysisResults(prev => [...prev, result]);

        // If we have 3 results, determine final result
        if (analysisResults.length + 1 >= 3) {
          const finalResults = [...analysisResults, result];
          const mostCommon = finalResults.reduce((acc, val) => {
            acc[val] = (acc[val] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          const finalResult = Object.entries(mostCommon).reduce((a, b) =>
            mostCommon[a[0]] > mostCommon[b[0]] ? a : b
          )[0];

          setAnalysisData(prev => ({ ...prev, [currentAnalysis!]: finalResult }));
          setCurrentAnalysis(null);
          setProgress(100);
        }

      } catch (error) {
        console.error('Analysis error:', error);
        // Add a default result if analysis fails
        const defaultResult = userData.gender === 'female' ? 'Hourglass' : 'Mesomorph';
        setAnalysisResults(prev => [...prev, defaultResult]);
      } finally {
        setIsAnalyzing(false);
      }
    };

    const handleManualInput = (type: 'body_shape') => {
      setCurrentAnalysis(type);
      setShowManualInput(true);
      setShowCamera(false);
      setIsAutoCapturing(false);
      setShowUpload(false);
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Create preview
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      setProgress(50);

      // Analyze the uploaded image
      try {
        setIsAnalyzing(true);
        const formData = new FormData();
        formData.append('file', file);

        // Use basic body analysis endpoint
        const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const endpoint = `${API}/analyze/body`;

        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Analysis failed');
        }

        const data = await response.json();
        const result = data.body_shape || 'Unknown';

        // Log analysis details for debugging
        console.log('Body analysis result:', {
          body_shape: data.body_shape,
          confidence: data.confidence,
          analysis_type: data.analysis_type,
          probabilities: data.probabilities
        });

        setAnalysisResults([result]);
        setAnalysisData(prev => ({ ...prev, [currentAnalysis!]: result }));
        setCurrentAnalysis(null);
        setProgress(100);
        setShowUpload(false);

      } catch (error) {
        console.error('Analysis error:', error);
        alert('Analysis failed. Please try again or use manual selection.');
        setShowUpload(false);
        setCurrentAnalysis(null);
      } finally {
        setIsAnalyzing(false);
      }
    };

    const handleManualSelection = (value: string) => {
      setAnalysisData(prev => ({ ...prev, [currentAnalysis!]: value }));
      setCurrentAnalysis(null);
      setShowManualInput(false);
    };

    // Upload Analysis Component
    const UploadAnalysis = () => (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">
          Body Shape Analysis
          <span className="ml-2 text-sm px-2 py-1 rounded bg-blue-500/20 text-blue-300">
            Upload
          </span>
        </h3>

        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-2 mb-4">
          <div
            className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <p className="text-sm text-gray-300 mb-4">
          Progress: {progress}% - {isAnalyzing ? 'Analyzing...' : 'Ready'}
        </p>

        {isAnalyzing && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p>Analyzing uploaded image...</p>
          </div>
        )}

        {/* Uploaded Image Preview */}
        {uploadedImage && (
          <div className="mb-6 flex flex-col items-center">
            <img
              src={uploadedImage}
              alt="Uploaded image"
              className="w-full max-w-md rounded-lg border-2 border-gray-700 mb-2 shadow-lg"
            />
            <p className="text-sm text-gray-300">Uploaded image preview</p>
          </div>
        )}

        {analysisResults.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Analysis Result:</h4>
            <div className="bg-green-500/20 rounded-lg p-3">
              <p className="text-green-300 font-medium">
                Body Shape: {analysisResults[0]}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() => handleManualInput('body_shape')}
          className="mt-4 w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Manual Input Instead
        </button>
      </div>
    );

    // Manual Input Component
    const BodyShapeManualInput = () => (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Select Your Body Shape</h3>
        <div className="space-y-3">
          {userData.gender === 'female'
            ? ['Hourglass', 'Rectangle', 'Inverted Triangle', 'Apple', 'Pear'].map((shape) => (
              <button
                key={shape}
                onClick={() => handleManualSelection(shape)}
                className="w-full p-3 rounded-lg border-2 border-white/30 bg-white/10 hover:border-white/50 transition-colors"
              >
                {shape}
              </button>
            ))
            : ['Mesomorph', 'Ectomorph', 'Trapezoid', 'Endomorph'].map((shape) => (
              <button
                key={shape}
                onClick={() => handleManualSelection(shape)}
                className="w-full p-3 rounded-lg border-2 border-white/30 bg-white/10 hover:border-white/50 transition-colors"
              >
                {shape}
              </button>
            ))
          }
        </div>
      </div>
    );

    // Camera Analysis Component
    const CameraAnalysis = () => (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">
          Body Shape Analysis
          <span className="ml-2 text-sm px-2 py-1 rounded bg-blue-500/20 text-blue-300">
            Camera
          </span>
        </h3>

        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-2 mb-4">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <p className="text-sm text-gray-300 mb-4">
          Progress: {progress}% - {capturedImages.length}/3 images captured
        </p>

        {isAutoCapturing && (
          <div className="text-center py-4">
            <div className="text-2xl font-bold text-yellow-400 mb-2">
              Auto-capturing in progress...
            </div>
            <p className="text-sm text-gray-300">Please stay still while we capture 3 images</p>
          </div>
        )}

        {isAnalyzing && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p>Analyzing image...</p>
          </div>
        )}

        {/* Camera Feed */}
        {showCamera && (
          <div className="mb-6 flex flex-col items-center">
            <video
              ref={videoRef}
              className="w-full max-w-md rounded-lg border-2 border-gray-700 mb-2 shadow-lg"
              autoPlay
              playsInline
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
        )}

        {capturedImages.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Captured Images:</h4>
            <div className="grid grid-cols-3 gap-2">
              {capturedImages.map((img, index) => (
                <div key={index} className="bg-white/20 rounded p-2 text-center text-sm">
                  <img src={img} alt={`Image ${index + 1}`} className="w-full h-20 object-cover rounded mb-1" />
                  Image {index + 1}
                </div>
              ))}
            </div>
          </div>
        )}

        {analysisResults.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Analysis Results:</h4>
            <div className="space-y-1">
              {analysisResults.map((result, index) => (
                <div key={index} className="text-sm text-gray-300">
                  Image {index + 1}: {result}
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => handleManualInput('body_shape')}
          className="mt-4 w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Manual Input Instead
        </button>
      </div>
    );

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="min-h-screen bg-[#251F1E] text-white p-4 md:p-8"
      >
        <div className=" mx-auto">
          <ProgressBar currentStep={STEPS.BODY_ANALYSIS} />
          <MobileStepper currentStep={STEPS.BODY_ANALYSIS} />
          <h2 className="text-3xl font-bold mb-8 text-center">Body Shape Analysis</h2>
          <p className="text-center text-gray-300 mb-8">Let&apos;s analyze your body shape</p>

          {/* Two-column layout (like Face Analysis) */}
          <div className="flex flex-col md:flex-row gap-6 items-start">

            {/* Image Section */}
            <div className="md:w-3/4 w-full h-[40vh] md:h-[80vh] relative rounded-lg overflow-hidden  flex items-center justify-center">
              {showUpload && currentAnalysis && <UploadAnalysis />}

              {currentAnalysis && !showManualInput && !showUpload && <CameraAnalysis />}

              {showManualInput && currentAnalysis === 'body_shape' && <BodyShapeManualInput />}

              {!currentAnalysis && (
                <Image
                  src={BodyPhoto} // your default image path
                  alt="Default Body Shape"
                  fill
                  className="object-contain "
                />
              )}
            </div>


            {/* Action Buttons & Instructions */}
            <div className="md:w-1/4 w-full flex flex-col space-y-4">
              <div className="w-full h-auto bg-[#444141] p-6 rounded-3xl backdrop-blur-lg text-white">
                <h1 className="text-xl font-bold mb-4">👕 Body Shape Analysis Instructions</h1>
                <p className="text-sm mb-3">Follow these steps for best accuracy:</p>
                <ul className="list-disc list-inside text-sm space-y-1 mb-3">
                  <li>Wear fitted or light clothing (avoid bulky outfits).</li>
                  <li>Stand straight in front of the camera.</li>
                  <li>Keep the background clear (avoid clutter).</li>
                  <li>Ensure full body is visible in frame.</li>
                </ul>
                <p className="text-sm">
                  ✨ <span className="font-semibold">Tip:</span> Stand about 2–3 meters away for better results.
                </p>
              </div>

              {/* Upload Photo */}
              <div className="flex bg-[#444141] p-6 rounded-3xl justify-center items-center flex-col">
                <h1 className="text-xl font-bold mb-4 text-center">Upload picture from your device</h1>
                <button
                  onClick={() => startAnalysis('body_shape', 'upload')}
                  className="border-2 border-white px-16 text-white py-3 rounded-full font-semibold hover:border-white hover:from-green-600 hover:to-emerald-700 transition-all"
                >
                  Upload Photo +
                </button>
              </div>

              {/* Camera */}
              <button
                onClick={() => startAnalysis('body_shape', 'camera')}
                className="w-full bg-[#444141] text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                📷 Capture from Web Camera
              </button>

              {/* Manual Selection */}
              <button
                onClick={() => handleManualInput('body_shape')}
                className="w-full text-white py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <span className="underline">✏️ Manual Selection</span>
              </button>

              {/* Navigation */}
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={() => setCurrentStep(STEPS.BASIC_INFO)}
                  className="px-8 py-3 rounded-lg border-2 border-white/30 bg-white/10 text-white hover:border-white/50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>
      </motion.div>
    );

  };

  // Step 5: Personality Analysis Component (16 Questions)
  const PersonalityAnalysisStep = ({ userData, setUserDataState, setCurrentStep, STEPS }: any) => {
    const [hasStarted, setHasStarted] = useState(false);

    const handleNext = (personalityType: string) => {
      const updatedData = { ...userData, personality: personalityType };
      updateUserData(updatedData);
      setUserDataState(updatedData);
      setCurrentStep(STEPS.COMPLETE);
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white p-4 md:p-8"
      >
        <div className="max-w-6xl mx-auto">
          <ProgressBar currentStep={STEPS.PERSONALITY_ANALYSIS} />
          <MobileStepper currentStep={STEPS.PERSONALITY_ANALYSIS} />
          <h2 className="text-3xl font-bold mb-8 text-center">Personality Analysis</h2>

          {!hasStarted ? (
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Image + badge */}
              <div className="md:w-3/4 w-full relative rounded-lg overflow-hidden border border-white/10">
                <div className="relative w-full h-[40vh] md:h-[60vh]">
                  <Image src={FacePhoto} alt="Personality" fill className="object-cover" />
                </div>
                <div className="absolute top-4 left-4 bg-white text-gray-900 text-xs md:text-sm font-semibold rounded-full px-3 py-1 shadow">
                  FACE & SKIN TONE ANALYSIS
                </div>
                <div className="absolute bottom-6 left-6 bg-black/50 backdrop-blur px-4 py-3 rounded-lg border border-white/10">
                  <div className="text-sm md:text-base text-gray-200">
                    <span className="font-semibold">Personality:</span> ENFP
                  </div>
                  <div className="text-xs md:text-sm text-gray-300">- Outgoing, Energetic</div>
                </div>
                <div className="absolute bottom-6 right-6 text-white text-xl md:text-2xl font-semibold">
                  Get you face type and skin
                  <br />
                  tone analyzed
                </div>
              </div>

              {/* Instructions + CTA */}
              <div className="md:w-1/4 w-full">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-4">Instructions:</h3>
                  <p className="text-sm text-gray-300 mb-3">
                    Welcome to the Personality Analysis Test! ✨
                  </p>
                  <p className="text-sm text-gray-300 mb-3">
                    This test helps us understand your personality type (MBTI) to tailor fashion suggestions.
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mb-6">
                    <li>There are 16–20 questions in total.</li>
                    <li>Answer honestly — no right or wrong answers.</li>
                    <li>Go with your first instinct.</li>
                    <li>Be consistent with how you usually feel or act.</li>
                    <li>The test usually takes 5–7 minutes.</li>
                  </ul>
                  <button
                    onClick={() => setHasStarted(true)}
                    className="w-full rounded-full bg-white text-gray-900 font-semibold py-3 hover:bg-gray-100 transition"
                  >
                    Start the test
                  </button>
                  <button
                    onClick={() => setCurrentStep(STEPS.COMPLETE)}
                    className="mt-4 w-full text-gray-300 underline text-sm"
                  >
                    i’ll do it later
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <p className="text-center text-gray-300 mb-8">Discover your style personality with our 16-question assessment</p>
              <PersonalityAnalysisWidget onComplete={handleNext} />
            </>
          )}
        </div>
      </motion.div>
    );
  };



  // Step 6: Complete Component
  const CompleteStep = ({ userData }: any) => {
    const handleComplete = () => {
      markOnboardingCompleted();
      // Redirect to gender-specific homepage
      router.push(userData.gender === 'male' ? '/male' : '/female');
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black"
      >
        <div className="text-center text-white p-8">
          <ProgressBar currentStep={STEPS.COMPLETE} />
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to AuraSync!</h1>
          <p className="text-xl mb-8 text-gray-300">
            Your personalized fashion journey is ready to begin
          </p>

          <button
            onClick={handleComplete}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            Start Exploring
          </button>
        </div>
      </motion.div>
    );
  };

  // Render current step
  return (
    <AnimatePresence mode="wait">
      {currentStep === STEPS.LOGIN && (
        <LoginStep key="login" />
      )}

      {currentStep === STEPS.BASIC_INFO && (
        <BasicInfoStep
          key="basic_info"
          userData={userData}
          updateUserData={updateUserData}
          setUserDataState={setUserDataState}
          setCurrentStep={setCurrentStep}
          STEPS={STEPS}
        />
      )}

      {currentStep === STEPS.SKIN_FACE_ANALYSIS && (
        <SkinFaceAnalysisStep
          key="skin_analysis"
          userData={userData}
          setUserDataState={setUserDataState}
          setCurrentStep={setCurrentStep}
          STEPS={STEPS}
        />
      )}

      {currentStep === STEPS.BODY_ANALYSIS && (
        <BodyAnalysisStep
          key="body_analysis"
          userData={userData}
          setUserDataState={setUserDataState}
          setCurrentStep={setCurrentStep}
          STEPS={STEPS}
        />
      )}

      {currentStep === STEPS.PERSONALITY_ANALYSIS && (
        <PersonalityAnalysisStep
          key="personality_analysis"
          userData={userData}
          setUserDataState={setUserDataState}
          setCurrentStep={setCurrentStep}
          STEPS={STEPS}
        />
      )}

      {currentStep === STEPS.COMPLETE && (
        <CompleteStep
          key="complete"
          userData={userData}
        />
      )}
    </AnimatePresence>
  );

}
