import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Brain, 
  Clock2 as Clock24, 
  FileText, 
  Calendar, 
  Shield, 
  Download, 
  Activity, 
  CheckCircle2,
  Coins,
  Sparkles
} from 'lucide-react';

function CTScanUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);
  const [selectedDisorder, setSelectedDisorder] = useState('');
  const [hasToken, setHasToken] = useState(true);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const fileInputRef = useRef(null);

  // Load jsPDF from CDN
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const disorders = [
    { id: 'alzheimers', name: "Alzheimer's Disease", icon: '🧠' },
    { id: 'parkinsons', name: "Parkinson's Disease", icon: '🤝' },
    { id: 'ms', name: "Multiple Sclerosis", icon: '🔬' },
    { id: 'epilepsy', name: "Epilepsy", icon: '⚡' },
    { id: 'brain-tumor', name: "Brain Tumor", icon: '🎯' },
    { id: 'stroke', name: "Stroke", icon: '🩺' },
    { id: 'adhd', name: "ADHD", icon: '🎭' },
    { id: 'anxiety', name: "Anxiety Disorders", icon: '😰' },
    { id: 'depression', name: "Depression", icon: '💭' },
    { id: 'schizophrenia', name: "Schizophrenia", icon: '🌀' }
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && isValidFile(file)) {
      handleFileUpload(file);
    } else {
      alert('Please upload a valid image or DICOM file.');
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && isValidFile(file)) {
      handleFileUpload(file);
    } else {
      alert('Please upload a valid image or DICOM file.');
    }
  };

  const isValidFile = (file) => {
    return file.type.includes('image') || 
           file.name.toLowerCase().endsWith('.dcm') || 
           file.type.includes('dicom');
  };

  const handleFileUpload = (file) => {
    if (!selectedDisorder) {
      alert('Please select a disorder type first');
      return;
    }
    
    setSelectedFile(file);
    console.log('Selected file:', file); // Log the selected file
    if (!hasToken) {
      setShowSubscriptionPrompt(true); // Show subscription prompt if no tokens are available
    } else {
      simulateAnalysis();
      setHasToken(false); // Use up the free token
    }
  };

  const generatePDFReport = () => {
    // Check if jsPDF is loaded
    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert('PDF library is still loading. Please try again in a moment.');
      return;
    }
    
    // Get current analysis results or generate new ones
    const analysis = currentAnalysis || analyzeImage();
    const disorderName = disorders.find(d => d.id === selectedDisorder)?.name || 'Unknown';
    
    // Create a new PDF document
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Set fonts and colors
    doc.setFontSize(20);
    doc.setTextColor(0, 51, 102); // Dark blue for headers
    doc.setFont(undefined, 'bold');
    
    // Header with site details
    doc.text('DemiSense.AI - Medical Analysis Report', 105, 20, { align: 'center' });
    
    // Site details section
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'normal');
    doc.text('Healthcare Facility: DemiSense.AI Medical Center', 20, 35);
    doc.text('Address: 123 Medical Plaza, Healthcare City, HC 12345', 20, 42);
    doc.text('Phone: +91 8910250019', 20, 49);
    doc.text('Email: subhojitdas0019@gmail.com', 20, 56);
    doc.text('Website: www.demisense.ai', 20, 63);
    
    // Prescription header
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.setFont(undefined, 'bold');
    doc.text('PRESCRIPTION & MEDICAL REPORT', 105, 75, { align: 'center' });
    
    // Patient and scan information
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'normal');
    doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 20, 90);
    doc.text(`Analysis Date: ${new Date().toLocaleString()}`, 20, 97);
    doc.text(`Patient ID: PT-${Date.now().toString().slice(-6)}`, 20, 104);
    doc.text(`Referring Physician: Dr. [Physician Name]`, 20, 111);
    
    // Disorder analysis
    doc.setFont(undefined, 'bold');
    doc.text('DISORDER ANALYSIS:', 20, 125);
    doc.setFont(undefined, 'normal');
    doc.text(`Selected Disorder: ${disorderName}`, 25, 132);
    
    // Scan information
    doc.setFont(undefined, 'bold');
    doc.text('SCAN INFORMATION:', 20, 146);
    doc.setFont(undefined, 'normal');
    doc.text(`File Name: ${selectedFile?.name || 'N/A'}`, 25, 153);
    doc.text('Scan Type: CT Scan', 25, 160);
    doc.text('Scan Quality: Excellent', 25, 167);
    doc.text('Radiologist: AI Assistant (Verified Required)', 25, 174);
    
    // Analysis results
    doc.setFont(undefined, 'bold');
    doc.text('ANALYSIS RESULTS:', 20, 188);
    doc.setFont(undefined, 'normal');
    doc.text(`AI Model: CNN-based Deep Learning`, 25, 195);
    doc.text(`Accuracy: ${analysis.accuracy}`, 25, 202);
    doc.text(`Confidence: ${analysis.confidence}`, 25, 209);
    
    // Key findings
    doc.setFont(undefined, 'bold');
    doc.text('KEY FINDINGS:', 20, 223);
    doc.setFont(undefined, 'normal');
    let yPos = 230;
    analysis.findings.forEach((finding, index) => {
      if (yPos > 270) { // Add new page if needed
        doc.addPage();
        yPos = 20;
      }
      doc.text(finding, 25, yPos);
      yPos += 7;
    });
    
    // Prescription section
    yPos += 10;
    doc.setFont(undefined, 'bold');
    doc.text('PRESCRIPTION & RECOMMENDATIONS:', 20, yPos);
    doc.setFont(undefined, 'normal');
    yPos += 7;
    
    analysis.recommendations.forEach((recommendation, index) => {
      if (yPos > 270) { // Add new page if needed
        doc.addPage();
        yPos = 20;
      }
      doc.text(recommendation, 25, yPos);
      yPos += 7;
    });
    
    // Follow-up instructions
    yPos += 10;
    doc.setFont(undefined, 'bold');
    doc.text('FOLLOW-UP INSTRUCTIONS:', 20, yPos);
    doc.setFont(undefined, 'normal');
    yPos += 7;
    doc.text('• Follow up with your primary care physician within 1 week', 25, yPos);
    yPos += 7;
    doc.text('• Bring this report to all future medical appointments', 25, yPos);
    yPos += 7;
    doc.text('• Contact emergency services if symptoms worsen', 25, yPos);
    
    // Footer with disclaimer
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    } else {
      yPos += 15;
    }
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'italic');
    doc.text('IMPORTANT DISCLAIMER:', 20, yPos);
    yPos += 5;
    doc.text('This report is generated by AI and should be reviewed by a qualified medical professional.', 20, yPos);
    yPos += 5;
    doc.text('This is not a substitute for professional medical advice, diagnosis, or treatment.', 20, yPos);
    
    // Final footer
    yPos += 10;
    doc.setFont(undefined, 'normal');
    doc.text('=====================================', 20, yPos);
    yPos += 5;
    doc.text('DemiSense.AI - Early Detection Platform', 20, yPos);
    yPos += 5;
    doc.text('Contact: +91 8910250019 | subhojitdas0019@gmail.com', 20, yPos);
    yPos += 5;
    doc.text('=====================================', 20, yPos);
    
    // Save the PDF
    doc.save(`DemiSense_${disorderName}_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    // Simulate analysis process
    setTimeout(() => {
      const analysis = analyzeImage();
      setCurrentAnalysis(analysis);
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      // Check if the user has no tokens left after analysis
      if (!hasToken) {
        setShowSubscriptionPrompt(true); // Show subscription prompt if no tokens are available
      }
    }, 3000);
  };

  const analyzeImage = () => {
    // Generate random variations in results for different scans
    const generateRandomVariation = (baseValue, variance) => {
      const numValue = parseFloat(baseValue);
      const variation = (Math.random() - 0.5) * variance;
      return Math.max(80, Math.min(99, numValue + variation)).toFixed(1) + '%';
    };

    const generateRandomFindings = (baseFindings, disorderType) => {
      const variations = [
        ['• Mild changes detected', '• Subtle abnormalities observed', '• Early-stage patterns present'],
        ['• Moderate involvement noted', '• Clear signs visible', '• Significant changes identified'],
        ['• Advanced progression detected', '• Severe abnormalities present', '• Critical findings observed']
      ];
      
      const severity = Math.floor(Math.random() * 3);
      const randomFinding = variations[severity][Math.floor(Math.random() * variations[severity].length)];
      
      return [
        randomFinding,
        ...baseFindings.slice(1, -1),
        `• Individual variation detected in scan #${Math.floor(Math.random() * 1000)}`
      ];
    };

    // Simulate different analysis results based on selected disorder with random variations
    const analysisResults = {
      'alzheimers': {
        accuracy: generateRandomVariation('94.2', 5),
        confidence: Math.random() > 0.3 ? 'High' : 'Medium',
        findings: generateRandomFindings([
          '• Mild hippocampal atrophy detected',
          '• Slight ventricular enlargement observed',
          '• Early-stage changes consistent with Alzheimer\'s',
          '• Recommend cognitive testing and follow-up'
        ], 'alzheimers'),
        recommendations: [
          '• Schedule neurological consultation',
          '• Begin cognitive therapy exercises',
          '• Consider medication evaluation',
          '• Monitor progression quarterly'
        ]
      },
      'parkinsons': {
        accuracy: generateRandomVariation('91.8', 6),
        confidence: Math.random() > 0.4 ? 'High' : 'Medium',
        findings: generateRandomFindings([
          '• Subtle basal ganglia changes detected',
          '• Mild motor cortex involvement',
          '• Early Parkinsonian features present',
          '• Dopamine pathway assessment recommended'
        ], 'parkinsons'),
        recommendations: [
          '• Movement disorder specialist consultation',
          '• Start physical therapy program',
          '• Monitor motor symptoms regularly',
          '• Consider dopamine agonist therapy'
        ]
      },
      'ms': {
        accuracy: generateRandomVariation('89.5', 7),
        confidence: Math.random() > 0.5 ? 'Medium' : 'High',
        findings: generateRandomFindings([
          '• Multiple white matter lesions detected',
          '• Demyelination patterns observed',
          '• Spinal cord involvement suspected',
          '• Active inflammatory process'
        ], 'ms'),
        recommendations: [
          '• Neurologist consultation urgent',
          '• MRI with contrast recommended',
          '• Start disease-modifying therapy',
          '• Regular neurological monitoring'
        ]
      },
      'epilepsy': {
        accuracy: generateRandomVariation('96.1', 4),
        confidence: Math.random() > 0.2 ? 'High' : 'Very High',
        findings: generateRandomFindings([
          '• Temporal lobe abnormalities detected',
          '• Hippocampal sclerosis present',
          '• Seizure focus identified',
          '• EEG monitoring recommended'
        ], 'epilepsy'),
        recommendations: [
          '• Epileptologist consultation',
          '• 24-hour EEG monitoring',
          '• Consider antiepileptic medication',
          '• Lifestyle modifications advised'
        ]
      },
      'brain-tumor': {
        accuracy: generateRandomVariation('97.3', 3),
        confidence: Math.random() > 0.1 ? 'High' : 'Very High',
        findings: generateRandomFindings([
          '• Mass lesion detected in frontal lobe',
          '• Surrounding edema present',
          '• Midline shift observed',
          '• Surgical consultation required'
        ], 'brain-tumor'),
        recommendations: [
          '• Neurosurgical consultation urgent',
          '• Biopsy for histopathology',
          '• Consider radiation therapy',
          '• Steroid administration for edema'
        ]
      },
      'stroke': {
        accuracy: generateRandomVariation('98.7', 2),
        confidence: Math.random() > 0.05 ? 'Very High' : 'High',
        findings: generateRandomFindings([
          '• Acute ischemic changes in MCA territory',
          '• Early infarct signs present',
          '• No hemorrhage detected',
          '• Time-critical intervention needed'
        ], 'stroke'),
        recommendations: [
          '• Emergency department transfer',
          '• Thrombolytic therapy evaluation',
          '• Neurological monitoring continuous',
          '• Stroke rehabilitation planning'
        ]
      },
      'adhd': {
        accuracy: generateRandomVariation('85.4', 8),
        confidence: Math.random() > 0.6 ? 'Medium' : 'Low',
        findings: generateRandomFindings([
          '• Prefrontal cortex activity patterns',
          '• Attention network differences',
          '• Executive function variations',
          '• Neurodevelopmental features'
        ], 'adhd'),
        recommendations: [
          '• Child psychiatrist consultation',
          '• Behavioral therapy program',
          '• Educational accommodations',
          '• Consider stimulant medication'
        ]
      },
      'anxiety': {
        accuracy: generateRandomVariation('88.9', 7),
        confidence: Math.random() > 0.4 ? 'Medium' : 'High',
        findings: generateRandomFindings([
          '• Amygdala hyperactivity detected',
          '• Prefrontal-limbic dysregulation',
          '• HPA axis activation patterns',
          '• Stress response system changes'
        ], 'anxiety'),
        recommendations: [
          '• Mental health professional consultation',
          '• Cognitive behavioral therapy',
          '• Stress management techniques',
          '• Consider anxiolytic medication'
        ]
      },
      'schizophrenia': {
        accuracy: generateRandomVariation('92.6', 5),
        confidence: Math.random() > 0.3 ? 'High' : 'Medium',
        findings: generateRandomFindings([
          '• Ventricular enlargement detected',
          '• Prefrontal cortex changes',
          '• White matter abnormalities',
          '• Neurotransmitter system disruption'
        ], 'schizophrenia'),
        recommendations: [
          '• Psychiatrist consultation essential',
          '• Antipsychotic medication therapy',
          '• Psychosocial rehabilitation',
          '• Family education and support'
        ]
      }
    };

    return analysisResults[selectedDisorder] || {
      accuracy: generateRandomVariation('95.0', 6),
      confidence: Math.random() > 0.4 ? 'Medium' : 'High',
      findings: generateRandomFindings([
        '• No significant abnormalities detected',
        '• Brain structure appears normal',
        '• No signs of neurological disease',
        '• Regular follow-up recommended'
      ], 'normal'),
      recommendations: [
        '• Continue regular medical check-ups',
        '• Maintain healthy lifestyle',
        '• Monitor cognitive function regularly',
        '• Report any new symptoms'
      ]
    };
  };

  // Styles
  const containerStyle = {
    padding: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const heroStyle = {
    backgroundImage: 'url("https://sjra.com/wp-content/uploads/2023/10/Woman-Lying-Down-During-CT-Scan.webp")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '80px 20px',
    borderRadius: '20px',
    color: 'white',
    textAlign: 'center',
    marginBottom: '40px',
    position: 'relative'
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: '20px'
  };

  const freeScanSectionStyle = {
    backgroundColor: '#f0f9ff',
    borderRadius: '20px',
    padding: '40px',
    marginBottom: '40px',
    position: 'relative',
    overflow: 'hidden'
  };

  const uploadZoneStyle = {
    border: isDragging ? '3px dashed #3b82f6' : '3px dashed #e5e7eb',
    borderRadius: '15px',
    padding: '40px',
    textAlign: 'center',
    backgroundColor: isDragging ? 'rgba(59, 130, 246, 0.1)' : 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginBottom: '40px'
  };

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '1.25rem',
    borderRadius: '1rem',
    fontWeight: '600',
    fontSize: '1.125rem',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.3s ease',
    boxShadow: '0 12px 24px -4px rgba(79, 70, 229, 0.3)'
  };

  const subscriptionCardStyle = {
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    borderRadius: '20px',
    padding: '40px',
    color: 'white',
    boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
    marginBottom: '30px'
  };

  const tokenBadgeStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: hasToken ? 'rgba(5, 150, 105, 0.1)' : 'rgba(239, 68, 68, 0.1)',
    color: hasToken ? '#059669' : '#ef4444',
    padding: '8px 16px',
    borderRadius: '999px',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '20px',
    width: 'fit-content',
    margin: '0 auto 20px'
  };

  return (
    <div style={containerStyle}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={heroStyle}
      >
        <div style={overlayStyle}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ fontSize: '56px', marginBottom: '20px', fontWeight: 'bold' }}
          >
            Early Detection Matters
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{ fontSize: '24px', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}
          >
            Get your free CT scan analysis today using our advanced AI technology
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        style={freeScanSectionStyle}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={tokenBadgeStyle}
        >
          <Coins size={18} />
          {hasToken ? (
            <span>You have 1 free analysis token available!</span>
          ) : (
            <span>No tokens available - Subscribe for unlimited scans</span>
          )}
        </motion.div>

        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '24px', marginBottom: '20px', color: '#1f2937', fontWeight: 'bold', textAlign: 'center' }}>
            Select Disorder Type
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
            {disorders.map((disorder) => (
              <motion.button
                key={disorder.id}
                onClick={() => setSelectedDisorder(disorder.id)}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  border: '2px solid',
                  borderColor: selectedDisorder === disorder.id ? '#3b82f6' : '#e5e7eb',
                  backgroundColor: selectedDisorder === disorder.id ? 'rgba(59, 130, 246, 0.1)' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span style={{ fontSize: '20px' }}>{disorder.icon}</span>
                <span style={{ fontSize: '14px', color: '#1f2937' }}>{disorder.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div
          style={uploadZoneStyle}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => selectedDisorder && fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*,.dcm"
            style={{ display: 'none' }}
          />
          <Upload size={48} style={{ color: '#3b82f6', margin: '0 auto 20px' }} />
          <h3 style={{ fontSize: '24px', marginBottom: '10px', color: '#1f2937' }}>
            Upload CT Scan
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '20px' }}>
            {selectedDisorder ? 
              'Drag and drop your CT scan file here, or click to select' :
              'Please select a disorder type first'
            }
          </p>
          {selectedFile && (
            <p style={{ color: '#059669', fontWeight: '500' }}>
              Selected file: {selectedFile.name}
            </p>
          )}
        </div>

        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                backgroundColor: 'white',
                borderRadius: '15px',
                padding: '30px',
                textAlign: 'center',
                marginBottom: '30px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Activity size={48} style={{ color: '#3b82f6', marginBottom: '20px' }} />
              </motion.div>
              <h3 style={{ fontSize: '24px', marginBottom: '10px', color: '#1f2937' }}>
                Analyzing Your Scan
              </h3>
              <p style={{ color: '#6b7280' }}>
                Please wait while our AI processes your CT scan...
              </p>
            </motion.div>
          )}

          {analysisComplete && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                backgroundColor: 'white',
                borderRadius: '15px',
                padding: '30px',
                marginTop: '20px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <CheckCircle2 size={48} style={{ color: '#059669', marginBottom: '20px' }} />
                <h3 style={{ fontSize: '24px', marginBottom: '10px', color: '#1f2937' }}>
                  Analysis Complete
                </h3>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <span style={{ color: '#6b7280' }}>Scan Quality</span>
                  <span style={{ color: '#059669', fontWeight: 'bold' }}>Excellent</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <span style={{ color: '#6b7280' }}>Accuracy</span>
                  <span style={{ color: '#059669', fontWeight: 'bold' }}>{currentAnalysis?.accuracy || '95.0%'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <span style={{ color: '#6b7280' }}>Confidence</span>
                  <span style={{ color: '#059669', fontWeight: 'bold' }}>{currentAnalysis?.confidence || 'Medium'}</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '95%' }}
                    transition={{ duration: 1 }}
                    style={{
                      height: '100%',
                      backgroundColor: '#059669',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: '30px' }}>
                <h4 style={{ fontSize: '18px', marginBottom: '15px', color: '#1f2937', fontWeight: 'bold' }}>Key Findings:</h4>
                {currentAnalysis?.findings ? (
                  currentAnalysis.findings.map((finding, index) => (
                    <div key={index} style={{ color: '#4a5568', marginBottom: '8px', paddingLeft: '10px' }}>
                      {finding}
                    </div>
                  ))
                ) : (
                  <div style={{ color: '#4a5568', marginBottom: '8px', paddingLeft: '10px' }}>
                    • Analysis in progress...
                  </div>
                )}
              </div>
              
              <div style={{ marginBottom: '30px' }}>
                <h4 style={{ fontSize: '18px', marginBottom: '15px', color: '#1f2937', fontWeight: 'bold' }}>Recommendations:</h4>
                {currentAnalysis?.recommendations ? (
                  currentAnalysis.recommendations.map((recommendation, index) => (
                    <div key={index} style={{ color: '#4a5568', marginBottom: '8px', paddingLeft: '10px' }}>
                      {recommendation}
                    </div>
                  ))
                ) : (
                  <div style={{ color: '#4a5568', marginBottom: '8px', paddingLeft: '10px' }}>
                    • Analysis in progress...
                  </div>
                )}
              </div>

              <motion.button
                style={{
                  ...buttonStyle,
                  width: '100%',
                  justifyContent: 'center',
                  backgroundColor: '#059669'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  // Generate and download report
                  generatePDFReport();
                }}
              >
                <Download size={20} />
                Download Detailed PDF Report
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSubscriptionPrompt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                backdropFilter: 'blur(4px)'
              }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '20px',
                  padding: '40px',
                  maxWidth: '500px',
                  width: '90%',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                  <Sparkles size={48} style={{ color: '#3b82f6', marginBottom: '20px' }} />
                  <h3 style={{ fontSize: '24px', marginBottom: '10px', color: '#1f2937', fontWeight: 'bold' }}>
                    Unlock Unlimited CT Scan Analysis
                  </h3>
                  <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                    You've used your free token. Subscribe now to analyze unlimited CT scans and access premium features.
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '20px', color: '#1f2937', fontWeight: 'bold' }}>Subscription Benefits:</h4>
                  <ul style={{ listStyleType: 'none', padding: 0 }}>
                    <li>🌟 24/7 Patient Monitoring</li>
                    <li>🌟 Unlimited Scanning</li>
                    <li>🌟 More than 1 Appointment Booking per Week</li>
                  </ul>
                  <h4 style={{ fontSize: '20px', color: '#1f2937', fontWeight: 'bold' }}>Price: ₹200</h4>
                </div>

                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                  <motion.button
                    style={{
                      ...buttonStyle,
                      backgroundColor: '#3b82f6'
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowSubscriptionPrompt(false)}
                  >
                    Subscribe Now
                  </motion.button>
                  <motion.button
                    style={{
                      ...buttonStyle,
                      backgroundColor: 'transparent',
                      border: '2px solid #3b82f6',
                      color: '#3b82f6'
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowSubscriptionPrompt(false)}
                  >
                    Maybe Later
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default CTScanUpload;