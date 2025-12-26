'use client';

export const exportToPdf = async (elementId: string, fileName: string): Promise<boolean> => {
  try {
    const element = document.getElementById(elementId);
    
    if (!element) {
      console.error(`Element with id "${elementId}" not found`);
      return false;
    }

    //DYNAMIC IMPORT: This prevents the "self is not defined" error because it only loads the library when the button is clicked.
    //@ts-ignore
    const html2pdf = (await import('html2pdf.js')).default;

    const opt = {
      margin: 0.5,
      filename: `${fileName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true, 
        logging: false 
      },
      jsPDF: { 
        unit: 'in', 
        format: 'letter', 
        orientation: 'portrait' 
      }
    };

    await html2pdf().set(opt).from(element).save();
    
    return true;
  } catch (error) {
    console.error('PDF export failed:', error);
    return false;
  }
};