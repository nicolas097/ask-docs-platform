import React from 'react';

const PDFViewer = ({url}: {url: string}) => {
  return (
    <div className="h-full w-full bg-gray-100">
      <object 
       data={`${url}#toolbar=0`} 
        type="application/pdf" 
        // 2. Aseguramos que el objeto ocupe el 100% de ESTE div
        className="h-full w-full block"
        width="100%" 
        height="100%"
      >
        <p>
          Tu navegador no soporta PDFs. 
          <a href="">Descárgalo aquí</a>.
        </p>
      </object>
    </div>
  );
};
export default PDFViewer;