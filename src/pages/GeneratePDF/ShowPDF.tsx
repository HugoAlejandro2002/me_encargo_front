import React from 'react';
import ReactDOM from 'react-dom';
import { PDFViewer } from '@react-pdf/renderer';
import MyDocument from './GeneratePDF';

const ShowPDF = () => (
    <PDFViewer height={"100%"}>
        <MyDocument />
  </PDFViewer>
)
export default ShowPDF