import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

interface ReportOptions {
  filename: string;
  sheetName?: string;
  format: 'xlsx' | 'csv';
}

export const generateReport = (data: any[], options: ReportOptions) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, options.sheetName || 'Report');

  const fileExtension = options.format === 'csv' ? 'csv' : 'xlsx';
  const fileType = options.format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  
  const excelBuffer = XLSX.write(workbook, { bookType: options.format, type: 'array' });
  const dataBlob = new Blob([excelBuffer], { type: fileType });
  
  saveAs(dataBlob, `${options.filename}.${fileExtension}`);
};

export const formatReportData = {
  orders: (orders: any[]) => orders.map(order => ({
    'Order ID': order._id,
    'Customer Name': order.user.name,
    'Customer Email': order.user.email,
    'Total Amount': order.totalPrice,
    'Status': order.isDelivered ? 'Delivered' : order.isPaid ? 'Paid' : 'Pending',
    'Type': order.isReservation ? 'Reservation' : 'Delivery',
    'Date': new Date(order.createdAt).toLocaleDateString()
  })),

  products: (products: any[]) => products.map(product => ({
    'Name': product.name,
    'Category': product.category,
    'Price': product.price,
    'Status': product.isAvailable ? 'Available' : 'Out of Stock',
    'Featured': product.featured ? 'Yes' : 'No'
  })),

  payments: (payments: any[]) => payments.map(payment => ({
    'Transaction ID': payment.transactionId,
    'Customer': payment.user.name,
    'Amount': payment.amount,
    'Status': payment.status,
    'Date': new Date(payment.createdAt).toLocaleDateString()
  })),

  users: (users: any[]) => users.map(user => ({
    'Name': user.name,
    'Email': user.email,
    'Role': user.isAdmin ? 'Admin' : 'User',
    'Joined': new Date(user.createdAt).toLocaleDateString()
  })),

  customCakes: (cakes: any[]) => cakes.map(cake => ({
    'Customer': cake.user.name,
    'Size': cake.size,
    'Flavor': cake.flavor,
    'Price': cake.price,
    'Reservation Date': cake.reservationDate ? new Date(cake.reservationDate).toLocaleDateString() : 'N/A',
    'Created': new Date(cake.createdAt).toLocaleDateString()
  }))
};