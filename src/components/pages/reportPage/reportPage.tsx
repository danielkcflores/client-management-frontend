import React from "react";
import './reportPage.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faHome, faPrint } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import ClientReport from "../../reportComponents/reportTable/reportTable";

export const ReportPage: React.FC = () => {
    const navigate = useNavigate();

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="app-container">
            <div className='dependent-menu no-print'>
                <button onClick={() => navigate(-2)} className="back-dependent-button">
                    <FontAwesomeIcon icon={faHome} />
                </button>
                <button onClick={() => navigate(-1)} className="back-dependent-button">
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
            </div>
            <header className="header">
                <h1 className="header-text">RELATÓRIO DE CLIENTES</h1>
            </header>
            <div>
                <ClientReport />
            </div>
            <button onClick={handlePrint} className="print-button no-print">
              <FontAwesomeIcon icon={faPrint} />
            </button>
        </div>
    );
};
