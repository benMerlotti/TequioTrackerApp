// strings longer than 30 characters will be truncated and appended with '...'
export const truncateText = (text, container, fontSize = 16) => {
    const containerWidth = container.getBoundingClientRect().width;
    
    // Estimate the maximum characters that can fit based on font size (this is just an approximation)
    const charWidth = fontSize * 0.6; // Assume each character is 0.6 times the font size in width
    const maxLength = Math.floor(containerWidth / charWidth);
  
    return text.length <= maxLength ? text : `${text.slice(0, maxLength)}...`;
  };

  // convert to csv

  export const convertToCSV = (data) => {
    // Define the CSV header
    const header = ['Id', 'Buyer', 'Price', 'Date'];
  
    // Map through the purchase data to get the values for each row
    const rows = data.map((purchase) => [
      purchase.id,
      purchase.customer?.name || 'N/A', // handle case if customer is not available
      `$${purchase.totalPrice.toFixed(2)}`,
      new Date(purchase.purchaseDate).toLocaleDateString(),
    ]);
  
    // Combine header and rows into one array
    const csvData = [header, ...rows];
  
    // Convert the data to CSV string
    return csvData.map(row => row.join(',')).join('\n');
  };

  export const downloadCSV = (data) => {
    const csvData = convertToCSV(data);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    // Create a download link and trigger the click event to download the CSV
    link.href = URL.createObjectURL(blob);
    link.download = 'Tequio_AllAmbassadorSales.csv'; // Set the download file name
    link.click();
  };
  
  
  