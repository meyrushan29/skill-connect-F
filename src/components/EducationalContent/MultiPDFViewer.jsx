import React, { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import { FileText, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import './pdfViewer.css';

function MultiPDFViewer(props) {
    const [pdfItems, setPdfItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        if (props && props.pdfs && props.pdfs.length > 0) {
            setLoading(true);
            setPdfItems(props.pdfs);
            setTimeout(() => {
                setLoading(false);
            }, 800); // Give time for PDF to load
        }
    }, [props]);
    
    const isPDF = (url) => {
        if (url && typeof url === 'string') {
            return url.includes('data:application/pdf') || 
                   url.startsWith('data:application/octet-stream;base64,') ||
                   url.includes('pdf');
        }
        return false;
    };
    
    const handleSlideChange = (selectedIndex) => {
        setCurrentIndex(selectedIndex);
    };
    
    return (
        <div className="multi-pdf-viewer">
            {pdfItems && pdfItems.length > 0 ? (
                <div className="pdf-carousel-container">
                    <Carousel 
                        interval={null}
                        indicators={pdfItems.length > 1}
                        prevIcon={<ChevronLeft size={24} className="carousel-arrow" />}
                        nextIcon={<ChevronRight size={24} className="carousel-arrow" />}
                        activeIndex={currentIndex}
                        onSelect={handleSlideChange}
                    >
                        {pdfItems.map((pdfItem, index) => (
                            <Carousel.Item key={index}>
                                {isPDF(pdfItem) ? (
                                    <div className="pdf-container">
                                        {loading && (
                                            <div className="pdf-loading">
                                                <Loader size={32} className="loading-spinner" />
                                                <span>Loading PDF...</span>
                                            </div>
                                        )}
                                        <iframe
                                            className="pdf-frame"
                                            src={pdfItem}
                                            title={`pdf-document-${index}`}
                                            onLoad={() => setLoading(false)}
                                            onError={() => {
                                                setLoading(false);
                                                setError(`Failed to load PDF document ${index + 1}`);
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="invalid-pdf">
                                        <FileText size={32} />
                                        <p>Invalid PDF format</p>
                                    </div>
                                )}
                            </Carousel.Item>
                        ))}
                    </Carousel>
                    
                    {pdfItems.length > 1 && (
                        <div className="pdf-navigator">
                            <span>Page {currentIndex + 1} of {pdfItems.length}</span>
                        </div>
                    )}
                </div>
            ) : error ? (
                <div className="pdf-error">
                    <p>{error}</p>
                </div>
            ) : (
                <div className="pdf-loading">
                    <Loader size={32} className="loading-spinner" />
                    <span>Loading PDF viewer...</span>
                </div>
            )}
        </div>
    );
}

export default MultiPDFViewer;