import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button, Modal } from "react-bootstrap";
import { FileText, Eye, X, Upload, File, AlertCircle } from 'lucide-react';
import MultiPDFViewer from './MultiPDFViewer';

function MultiPDFUpload(props) {
    const [pdfFiles, setPdfFiles] = useState([]);
    const [processedPDFs, setProcessedPDFs] = useState([]);
    const [isHovered, setIsHovered] = useState(false);
    const [showViewer, setShowViewer] = useState(false);
    const [selectedPDF, setSelectedPDF] = useState(null);
    const [uploadError, setUploadError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Only process files if there are new ones
        if (pdfFiles.length > 0) {
            processFiles();
        }
    }, [pdfFiles]);

    useEffect(() => {
        // Only send processed PDFs to parent when they're ready
        if (processedPDFs.length > 0) {
            props.multiHandle(processedPDFs);
        }
    }, [processedPDFs]);

    const processFiles = async () => {
        setIsLoading(true);
        setUploadError(null);
        const processed = [];
        
        try {
            for (const file of pdfFiles) {
                if (file.type === 'application/pdf') {
                    try {
                        const base64 = await fileToBase64Promise(file);
                        processed.push({
                            file: file,
                            base64: base64,
                            preview: base64, // For PDFs, we'll use the base64 directly
                            name: file.name,
                            size: Math.round(file.size/1024) // Size in KB
                        });
                    } catch (error) {
                        console.error("Error processing PDF:", error);
                        setUploadError(`Error processing ${file.name}: ${error.message}`);
                    }
                }
            }
            
            setProcessedPDFs(processed);
        } catch (error) {
            console.error("Error in file processing:", error);
            setUploadError(`Error processing files: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const fileToBase64Promise = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const onDrop = (acceptedFiles) => {
        // Filter for PDF files only
        const pdfOnly = acceptedFiles.filter(file => file.type === 'application/pdf');
        if (pdfOnly.length === 0 && acceptedFiles.length > 0) {
            setUploadError("Only PDF files are allowed");
            return;
        }
        setPdfFiles((prevState) => [...prevState, ...pdfOnly]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf']
        },
        multiple: true,
    });

    const removePDF = (index) => {
        const newPDFs = pdfFiles.filter((_, i) => i !== index);
        const newProcessedPDFs = processedPDFs.filter((_, i) => i !== index);
        setPdfFiles(newPDFs);
        setProcessedPDFs(newProcessedPDFs);
    };

    const handleViewPDF = (pdf) => {
        setSelectedPDF(pdf);
        setShowViewer(true);
    };
    
    const clearError = () => {
        setUploadError(null);
    };

    return (
        <div className="pdf-upload-container">
            {uploadError && (
                <div className="upload-error">
                    <AlertCircle size={18} />
                    <span>{uploadError}</span>
                    <button className="clear-error" onClick={clearError}>
                        <X size={16} />
                    </button>
                </div>
            )}
            
            <div 
                {...getRootProps()} 
                className={`dropzone ${isDragActive ? 'active' : ''} ${isHovered ? 'hovered' : ''}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <div className="dropzone-content active">
                        <div className="dropzone-icon">
                            <Upload size={32} />
                        </div>
                        <p>Drop your PDF files here...</p>
                    </div>
                ) : (
                    <div className="dropzone-content">
                        <div className="dropzone-icon">
                            <File size={32} />
                        </div>
                        <p>Drag & drop PDF files here, or click to select</p>
                        <button className="upload-btn">
                            <Upload size={16} />
                            <span>Select PDF Files</span>
                        </button>
                    </div>
                )}
            </div>

            {isLoading && (
                <div className="processing-indicator">
                    <div className="spinner"></div>
                    <span>Processing files...</span>
                </div>
            )}

            {processedPDFs.length > 0 && (
                <div className="pdf-list">
                    <h4>Uploaded Files</h4>
                    {processedPDFs.map((item, index) => (
                        <div key={index} className="pdf-item">
                            <div className="pdf-info">
                                <div className="pdf-icon">
                                    <FileText size={20} />
                                </div>
                                <div className="pdf-details">
                                    <div className="pdf-name">{item.name}</div>
                                    <div className="pdf-size">{item.size} KB</div>
                                </div>
                            </div>
                            <div className="pdf-actions">
                                <Button 
                                    variant="primary" 
                                    size="sm" 
                                    className="view-pdf-btn"
                                    onClick={() => handleViewPDF(item)}
                                >
                                    <Eye size={16} /> View
                                </Button>
                                <Button 
                                    variant="danger" 
                                    size="sm" 
                                    className="remove-pdf-btn"
                                    onClick={() => removePDF(index)}
                                >
                                    <X size={16} /> Remove
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal show={showViewer} onHide={() => setShowViewer(false)} size="lg" centered className="pdf-preview-modal">
                <Modal.Header closeButton>
                    <Modal.Title>{selectedPDF?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedPDF && <MultiPDFViewer pdfs={[selectedPDF.base64]} />}
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default MultiPDFUpload;