'use client';

/**
 *exports a DOM element to a PDF file.
 * Uses as const to satisfy strict TypeScript literal types for html2pdf.
 */
export const exportToPdf = async (elementId: string, fileName: string): Promise<boolean> => {
  try {
    const element = document.getElementById(elementId);
    
    if (!element) {
      console.error(`Element with id "${elementId}" not found`);
      return false;
    }

    //DYNAMIC IMPORT: Prevents "self is not defined" error in Next.js SSR
    // @ts-ignore
    const html2pdf = (await import('html2pdf.js')).default;

    const opt = {
      margin: 0.5,
      filename: `${fileName}.pdf`,
      image: { 
        type: 'jpeg' as const, //fixed literal type assertion
        quality: 0.98 
      },
      html2canvas: { 
        scale: 2,
        useCORS: true, 
        logging: false 
      },
      //fixed literal type assertions
      jsPDF: { 
        unit: 'in' as const,         
        format: 'letter' as const,   
        orientation: 'portrait' as const
      }
    };

    await html2pdf().set(opt).from(element).save();
    
    return true;
  } catch (error) {
    console.error('PDF export failed:', error);
    return false;
  }
};