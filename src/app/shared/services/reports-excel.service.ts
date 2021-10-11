import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import jsPDF, { jsPDFOptions } from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';
import { CategoryResponse } from '../interfaces/category/category-response';
import { OrderResponse } from '../interfaces/order/order-response';
import { ProductResponse } from '../interfaces/product/product-response';
import { UserResponse } from '../interfaces/user/user-response';

@Injectable({
  providedIn: 'root'
})
export class ReportsExcelService {
  fname = "TRANSACCIONES" + '-' + new Date().valueOf();
  constructor() { }

  downloadTransactionExcel(data: Array<OrderResponse>) {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Transacciones");

    let header = ["FECHA EMISION", "# TRANSACCION", "TIPO", "ESTADO", "PERSONA", "SUBTOTAL", "IVA", "TOTAL"];
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, colNumber) => {
      cell.font = {
        name: 'Arial',
        family: 2,
        bold: true,
        size: 12,
      };
      cell.alignment = {
        vertical: 'middle', horizontal: 'center'
      };
    });

    data.forEach((order) => {
      let temp = [];
      temp.push(
        order.date,
        order.sequential,
        order.type.toUpperCase(),
        order.state.toUpperCase(),
        order.person.name.toUpperCase(),
        order.subtotal,
        order.tax,
        order.total
      );
      worksheet.addRow(temp);
    });
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, this.fname + '.xlsx');
    });
  }

  downloadTransactionPdf(data: Array<OrderResponse>) {
    const PDFConfig: jsPDFOptions = { putOnlyUsedFonts: true, orientation: 'landscape' };
    const doc = new jsPDF(PDFConfig);
    doc.setFontSize(14);
    const headerTitle = "TRANSACCIONES"
    doc.text(headerTitle, 14, 14);
    doc.setFontSize(11);
    const headers = [
      { header: 'FECHA EMISION', dataKey: 'fecha' },
      { header: '# TRANSACCION', dataKey: 'numero' },
      { header: 'TIPO', dataKey: 'tipo' },
      { header: 'ESTADO', dataKey: 'estado' },
      { header: 'PERSONA', dataKey: 'persona' },
      { header: 'SUBTOTAL', dataKey: 'subtotal' },
      { header: 'IVA', dataKey: 'iva' },
      { header: 'TOTAL', dataKey: 'total' },
    ];
    const objColumns = {};
    for (const header of headers) {
      objColumns[header.dataKey] = { columnWidth: 'auto' }
    }
    let dataMapped = [];
    data.forEach((order) => {
      dataMapped.push({
        fecha: order.date,
        numero: order.sequential,
        tipo: order.type,
        estado: order.state,
        persona: order.person.name,
        subtotal: order.subtotal,
        iva: order.tax,
        total: order.total
      });
    });
    autoTable(doc, {
      columns: headers,
      body: dataMapped,
      startY: 20,
      columnStyles: objColumns,
      theme: 'striped',
      tableWidth: 'auto',
      cellWidth: 'wrap',
      showHead: 'firstPage',
      headStyles: {
        fillColor: [52, 152, 219],
      },
      styles: {
        overflow: 'linebreak',
        cellWidth: 'wrap',
        fontSize: 8,
        cellPadding: 2,
        overflowColumns: 'linebreak'
      },
    } as UserOptions);

    const pageNumber = doc.getNumberOfPages();
    const pageSize = doc.internal.pageSize;
    const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();

    function addFooters() {
      for (let i = 0; i < pageNumber; i++) {
        doc.text(`Pagina ${i + 1} de ·${pageNumber}`, 14, pageHeight - 10);
      }
    }
    addFooters();
    doc.setPage(pageNumber);
    doc.save(this.fname);
  }

  downloadProfitUtilityExcel(data) {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("MARGEN DE UTILIDAD");

    let header = ["PRODUCTO", "CATEGORIA", "STOCK", "P. COSTO", "P. VENTA", "COSTO DE COMPRA", "BENEFICIO DE VENTA", "MARGEN DE GANANCIA", "% GANANCIA"];
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, colNumber) => {
      cell.font = {
        name: 'Arial',
        family: 2,
        bold: true,
        size: 12,
      };
      cell.alignment = {
        vertical: 'middle', horizontal: 'center'
      };
    });
    worksheet.columns.forEach(function (column, i) {
      var maxLength = 0;
      column["eachCell"]({ includeEmpty: true }, function (cell) {
        var columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength;
    });

    data.forEach((prod) => {
      let temp = [];
      const buyingCost = (parseFloat(prod.cost) * prod.stock).toFixed(2);
      const profitSelling = (parseFloat(prod.price) * prod.stock).toFixed(2);
      const profitMargin = (parseFloat(profitSelling) - parseFloat(buyingCost)).toFixed(2);
      const profitPercentage = ((parseFloat(profitSelling) - parseFloat(buyingCost)) / parseFloat(buyingCost)).toFixed(2);
      temp.push(
        prod.name,
        prod.category.name,
        prod.stock,
        prod.cost,
        prod.price,
        buyingCost,
        profitSelling,
        profitMargin,
        profitPercentage
      );
      worksheet.addRow(temp);
    });
    workbook.xlsx.writeBuffer().then((data) => {
      this.fname = "PRODUCTOS" + '-' + new Date().valueOf();
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, this.fname + '.xlsx');
    });
  }

  downloadMostSellingExcel(data) {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("MAS VENDIDOS");

    let header = ["PRODUCTO", "STOCK", "P. COSTO", "P. VENTA", "TOTAL GENERADO"];
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, colNumber) => {
      cell.font = {
        name: 'Arial',
        family: 2,
        bold: true,
        size: 12,
      };
      cell.alignment = {
        vertical: 'middle', horizontal: 'center'
      };
    });
    worksheet.columns.forEach(function (column, i) {
      var maxLength = 0;
      column["eachCell"]({ includeEmpty: true }, function (cell) {
        var columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength;
    });

    data.forEach((prod) => {
      let temp = [];
      temp.push(
        prod.product_name,
        prod.product_stock,
        prod.product_cost,
        prod.product_price,
        prod.total,
      );
      worksheet.addRow(temp);
    });
    workbook.xlsx.writeBuffer().then((data) => {
      this.fname = "PRODUCTOS" + '-' + new Date().valueOf();
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, this.fname + '.xlsx');
    });
  }

  downloadProfitUtilityPdf(data) {
    const PDFConfig: jsPDFOptions = { putOnlyUsedFonts: true, orientation: 'landscape' };
    const doc = new jsPDF(PDFConfig);
    doc.setFontSize(14);
    const headerTitle = "PRODUCTOS"
    doc.text(headerTitle, 14, 14);
    doc.setFontSize(11);
    const headers = [
      { header: 'PRODUCTO', dataKey: 'producto' },
      { header: 'CATEGORIA', dataKey: 'categoria' },
      { header: 'STOCK', dataKey: 'stock' },
      { header: 'P. COSTO', dataKey: 'costo' },
      { header: 'P. VENTA', dataKey: 'venta' },
      { header: 'COSTO DE COMPRA', dataKey: 'compra' },
      { header: 'BENEFICIO DE VENTA', dataKey: 'beneficio' },
      { header: 'MARGEN DE GANANCIA', dataKey: 'margen' },
      { header: '% DE GANANCIA', dataKey: 'porcentaje' },
    ];
    const objColumns = {};
    for (const header of headers) {
      objColumns[header.dataKey] = { columnWidth: 'auto' }
    }
    let dataMapped = [];
    data.forEach((prod) => {
      const buyingCost = (parseFloat(prod.cost) * prod.stock).toFixed(2);
      const profitSelling = (parseFloat(prod.price) * prod.stock).toFixed(2);
      const profitMargin = (parseFloat(profitSelling) - parseFloat(buyingCost)).toFixed(2);
      const profitPercentage = ((parseFloat(profitSelling) - parseFloat(buyingCost)) / parseFloat(buyingCost)).toFixed(2);
      dataMapped.push({
        producto: prod.name,
        categoria: prod.category.name,
        stock: prod.stock,
        costo: prod.cost,
        venta: prod.price,
        compra: buyingCost,
        beneficio: profitSelling,
        margen: profitMargin,
        porcentaje: profitPercentage
      });
    });
    autoTable(doc, {
      columns: headers,
      body: dataMapped,
      startY: 20,
      columnStyles: objColumns,
      theme: 'striped',
      tableWidth: 'auto',
      cellWidth: 'wrap',
      showHead: 'firstPage',
      headStyles: {
        fillColor: [52, 152, 219],
      },
      styles: {
        overflow: 'linebreak',
        cellWidth: 'wrap',
        fontSize: 8,
        cellPadding: 2,
        overflowColumns: 'linebreak'
      },
    } as UserOptions);

    const pageNumber = doc.getNumberOfPages();
    const pageSize = doc.internal.pageSize;
    const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();

    function addFooters() {
      for (let i = 0; i < pageNumber; i++) {
        doc.text(`Pagina ${i + 1} de ·${pageNumber}`, 14, pageHeight - 10);
      }
    }
    addFooters();
    doc.setPage(pageNumber);
    doc.save(this.fname);
  }

  downloadMostSellingPdf(data) {
    const PDFConfig: jsPDFOptions = { putOnlyUsedFonts: true, orientation: 'landscape' };
    const doc = new jsPDF(PDFConfig);
    doc.setFontSize(14);
    const headerTitle = "PRODUCTOS"
    doc.text(headerTitle, 14, 14);
    doc.setFontSize(11);
    const headers = [
      { header: 'PRODUCTO', dataKey: 'producto' },
      { header: 'STOCK', dataKey: 'stock' },
      { header: 'P. COSTO', dataKey: 'costo' },
      { header: 'P. VENTA', dataKey: 'venta' },
      { header: 'TOTAL DE GANANCIA', dataKey: 'total' },
    ];
    const objColumns = {};
    for (const header of headers) {
      objColumns[header.dataKey] = { columnWidth: 'auto' }
    }
    let dataMapped = [];
    data.forEach((prod) => {
      dataMapped.push({
        producto: prod.product_name,
        stock: prod.product_stock,
        costo: prod.product_cost,
        venta: prod.product_price,
        total: prod.total,
      });
    });
    autoTable(doc, {
      columns: headers,
      body: dataMapped,
      startY: 20,
      columnStyles: objColumns,
      theme: 'striped',
      tableWidth: 'auto',
      cellWidth: 'wrap',
      showHead: 'firstPage',
      headStyles: {
        fillColor: [52, 152, 219],
      },
      styles: {
        overflow: 'linebreak',
        cellWidth: 'wrap',
        fontSize: 8,
        cellPadding: 2,
        overflowColumns: 'linebreak'
      },
    } as UserOptions);

    const pageNumber = doc.getNumberOfPages();
    const pageSize = doc.internal.pageSize;
    const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();

    function addFooters() {
      for (let i = 0; i < pageNumber; i++) {
        doc.text(`Pagina ${i + 1} de ·${pageNumber}`, 14, pageHeight - 10);
      }
    }
    addFooters();
    doc.setPage(pageNumber);
    doc.save(this.fname);
  }

  downloadOrdersExcel(data: Array<OrderResponse>) {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("TRANSACCIONES");

    let header = ["SECUENCIAL", "FECHA", "CLIENTE", "TIPO", "FORMA DE PAGO", "ESTADO", "TOTAL"];
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, colNumber) => {
      cell.font = {
        name: 'Arial',
        family: 2,
        bold: true,
        size: 12,
      };
      cell.alignment = {
        vertical: 'middle', horizontal: 'center'
      };
    });
    worksheet.columns.forEach(function (column, i) {
      var maxLength = 0;
      column["eachCell"]({ includeEmpty: true }, function (cell) {
        var columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength;
    });

    data.forEach((order) => {
      let temp = [];
      temp.push(
        order.sequential,
        order.date,
        order.person.name,
        order.type,
        order.payment,
        order.state,
        order.total,
      );
      worksheet.addRow(temp);
    });
    workbook.xlsx.writeBuffer().then((data) => {
      this.fname = "TRANSACCIONES" + '-' + new Date().valueOf();
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, this.fname + '.xlsx');
    });
  }

  downloadOrdersPdf(data: Array<OrderResponse>) {
    const PDFConfig: jsPDFOptions = { putOnlyUsedFonts: true, orientation: 'landscape' };
    const doc = new jsPDF(PDFConfig);
    doc.setFontSize(14);
    const headerTitle = "TRANSACCIONES"
    doc.text(headerTitle, 14, 14);
    doc.setFontSize(11);
    const headers = [
      { header: 'SECUENCIAL', dataKey: 'secuencial' },
      { header: 'FECHA', dataKey: 'fecha' },
      { header: 'CLIENTE', dataKey: 'cliente' },
      { header: 'TIPO', dataKey: 'tipo' },
      { header: 'FORMA DE PAGO', dataKey: 'forma' },
      { header: 'ESTADO', dataKey: 'estado' },
      { header: 'TOTAL', dataKey: 'total' },
    ];
    const objColumns = {};
    for (const header of headers) {
      objColumns[header.dataKey] = { columnWidth: 'auto' }
    }
    let dataMapped = [];
    data.forEach((prod) => {
      dataMapped.push({
        secuencial: prod.sequential,
        fecha: prod.date,
        cliente: prod.person.name,
        tipo: prod.type,
        forma: prod.payment,
        estado: prod.state,
        total: prod.total,
      });
    });
    autoTable(doc, {
      columns: headers,
      body: dataMapped,
      startY: 20,
      columnStyles: objColumns,
      theme: 'striped',
      tableWidth: 'auto',
      cellWidth: 'wrap',
      showHead: 'firstPage',
      headStyles: {
        fillColor: [52, 152, 219],
      },
      styles: {
        overflow: 'linebreak',
        cellWidth: 'wrap',
        fontSize: 8,
        cellPadding: 2,
        overflowColumns: 'linebreak'
      },
    } as UserOptions);

    const pageNumber = doc.getNumberOfPages();
    const pageSize = doc.internal.pageSize;
    const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();

    function addFooters() {
      for (let i = 0; i < pageNumber; i++) {
        doc.text(`Pagina ${i + 1} de ·${pageNumber}`, 14, pageHeight - 10);
      }
    }
    addFooters();
    doc.setPage(pageNumber);
    doc.save(this.fname);
  }

  downloadPeopleExcel(data: Array<UserResponse>, type: string) {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(type == "client" ? "CLIENTES" : "PROVEEDORES");

    let header = ["IDENTIFICACION", "NOMBRES", "CORREO", "TELEFONO", "DIRECCION"];
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, colNumber) => {
      cell.font = {
        name: 'Arial',
        family: 2,
        bold: true,
        size: 12,
      };
      cell.alignment = {
        vertical: 'middle', horizontal: 'center'
      };
    });
    worksheet.columns.forEach(function (column, i) {
      var maxLength = 0;
      column["eachCell"]({ includeEmpty: true }, function (cell) {
        var columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength;
    });

    data.forEach((person) => {
      let temp = [];
      temp.push(
        person.identification,
        person.name,
        person.email,
        person.phone,
        person.address,
      );
      worksheet.addRow(temp);
    });
    workbook.xlsx.writeBuffer().then((data) => {
      this.fname = (type == "client" ? "CLIENTES" : "PROVEEDORES") + '-' + new Date().valueOf();
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, this.fname + '.xlsx');
    });
  }

  downloadPeoplePdf(data: Array<UserResponse>, type: string) {
    const PDFConfig: jsPDFOptions = { putOnlyUsedFonts: true, orientation: 'landscape' };
    const doc = new jsPDF(PDFConfig);
    doc.setFontSize(14);
    const headerTitle = type == "client" ? "CLIENTES" : "PROVEEDORES"
    doc.text(headerTitle, 14, 14);
    doc.setFontSize(11);
    const headers = [
      { header: 'IDENTIFICACION', dataKey: 'identificacion' },
      { header: 'NOMBRES', dataKey: 'nombres' },
      { header: 'CORREO', dataKey: 'correo' },
      { header: 'TELEFONO', dataKey: 'telefono' },
      { header: 'DIRECCION', dataKey: 'direccion' },
    ];
    const objColumns = {};
    for (const header of headers) {
      objColumns[header.dataKey] = { columnWidth: 'auto' }
    }
    let dataMapped = [];
    data.forEach((prod) => {
      dataMapped.push({
        identificacion: prod.identification,
        nombres: prod.name,
        correo: prod.email,
        telefono: prod.phone,
        direccion: prod.address,
      });
    });
    autoTable(doc, {
      columns: headers,
      body: dataMapped,
      startY: 20,
      columnStyles: objColumns,
      theme: 'striped',
      tableWidth: 'auto',
      cellWidth: 'wrap',
      showHead: 'firstPage',
      headStyles: {
        fillColor: [52, 152, 219],
      },
      styles: {
        overflow: 'linebreak',
        cellWidth: 'wrap',
        fontSize: 8,
        cellPadding: 2,
        overflowColumns: 'linebreak'
      },
    } as UserOptions);

    const pageNumber = doc.getNumberOfPages();
    const pageSize = doc.internal.pageSize;
    const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();

    function addFooters() {
      for (let i = 0; i < pageNumber; i++) {
        doc.text(`Pagina ${i + 1} de ·${pageNumber}`, 14, pageHeight - 10);
      }
    }
    addFooters();
    doc.setPage(pageNumber);
    this.fname = (type == "client" ? "CLIENTES" : "PROVEEDORES") + '-' + new Date().valueOf();
    doc.save(this.fname);
  }

  downloadProductsExcel(data: Array<ProductResponse>) {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("PRODUCTOS");

    let header = ["PRODUCTO", "COSTO", "PRECIO", "STOCK", "CATEGORIA"];
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, colNumber) => {
      cell.font = {
        name: 'Arial',
        family: 2,
        bold: true,
        size: 12,
      };
      cell.alignment = {
        vertical: 'middle', horizontal: 'center'
      };
    });
    worksheet.columns.forEach(function (column, i) {
      var maxLength = 0;
      column["eachCell"]({ includeEmpty: true }, function (cell) {
        var columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength;
    });

    data.forEach((product) => {
      let temp = [];
      temp.push(
        product.name,
        product.cost,
        product.price,
        product.stock,
        product.category.name,
      );
      worksheet.addRow(temp);
    });
    workbook.xlsx.writeBuffer().then((data) => {
      this.fname = "PRODUCTOS" + '-' + new Date().valueOf();
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, this.fname + '.xlsx');
    });
  }

  downloadProductsPdf(data: Array<ProductResponse>) {
    const PDFConfig: jsPDFOptions = { putOnlyUsedFonts: true, orientation: 'landscape' };
    const doc = new jsPDF(PDFConfig);
    doc.setFontSize(14);
    const headerTitle = "PRODUCTOS"
    doc.text(headerTitle, 14, 14);
    doc.setFontSize(11);
    const headers = [
      { header: 'PRODUCTO', dataKey: 'producto' },
      { header: 'COSTO', dataKey: 'costo' },
      { header: 'PRECIO', dataKey: 'precio' },
      { header: 'STOCK', dataKey: 'stock' },
      { header: 'CATEGORIA', dataKey: 'categoria' },
    ];
    const objColumns = {};
    for (const header of headers) {
      objColumns[header.dataKey] = { columnWidth: 'auto' }
    }
    let dataMapped = [];
    data.forEach((prod) => {
      dataMapped.push({
        producto: prod.name,
        costo: prod.cost,
        precio: prod.price,
        stock: prod.stock,
        categoria: prod.category.name,
      });
    });
    autoTable(doc, {
      columns: headers,
      body: dataMapped,
      startY: 20,
      columnStyles: objColumns,
      theme: 'striped',
      tableWidth: 'auto',
      cellWidth: 'wrap',
      showHead: 'firstPage',
      headStyles: {
        fillColor: [52, 152, 219],
      },
      styles: {
        overflow: 'linebreak',
        cellWidth: 'wrap',
        fontSize: 8,
        cellPadding: 2,
        overflowColumns: 'linebreak'
      },
    } as UserOptions);

    const pageNumber = doc.getNumberOfPages();
    const pageSize = doc.internal.pageSize;
    const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();

    function addFooters() {
      for (let i = 0; i < pageNumber; i++) {
        doc.text(`Pagina ${i + 1} de ·${pageNumber}`, 14, pageHeight - 10);
      }
    }
    addFooters();
    doc.setPage(pageNumber);
    this.fname = "PRODUCTOS" + '-' + new Date().valueOf();
    doc.save(this.fname);
  }

  downloadCategoriesExcel(data: Array<CategoryResponse>) {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("CATEGORIAS");

    let header = ["CATEGORIA"];
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, colNumber) => {
      cell.font = {
        name: 'Arial',
        family: 2,
        bold: true,
        size: 12,
      };
      cell.alignment = {
        vertical: 'middle', horizontal: 'center'
      };
    });
    worksheet.columns.forEach(function (column, i) {
      var maxLength = 0;
      column["eachCell"]({ includeEmpty: true }, function (cell) {
        var columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength;
    });

    data.forEach((category) => {
      let temp = [];
      temp.push(
        category.name,
      );
      worksheet.addRow(temp);
    });
    workbook.xlsx.writeBuffer().then((data) => {
      this.fname = "CATEGORIAS" + '-' + new Date().valueOf();
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, this.fname + '.xlsx');
    });
  }

  downloadCategoriesPdf(data: Array<CategoryResponse>) {
    const PDFConfig: jsPDFOptions = { putOnlyUsedFonts: true, orientation: 'landscape' };
    const doc = new jsPDF(PDFConfig);
    doc.setFontSize(14);
    const headerTitle = "CATEGORIAS"
    doc.text(headerTitle, 14, 14);
    doc.setFontSize(11);
    const headers = [
      { header: 'CATEGORIA', dataKey: 'producto' },
    ];
    const objColumns = {};
    for (const header of headers) {
      objColumns[header.dataKey] = { columnWidth: 'auto' }
    }
    let dataMapped = [];
    data.forEach((prod) => {
      dataMapped.push({
        producto: prod.name,
      });
    });
    autoTable(doc, {
      columns: headers,
      body: dataMapped,
      startY: 20,
      columnStyles: objColumns,
      theme: 'striped',
      tableWidth: 'auto',
      cellWidth: 'wrap',
      showHead: 'firstPage',
      headStyles: {
        fillColor: [52, 152, 219],
      },
      styles: {
        overflow: 'linebreak',
        cellWidth: 'wrap',
        fontSize: 8,
        cellPadding: 2,
        overflowColumns: 'linebreak'
      },
    } as UserOptions);

    const pageNumber = doc.getNumberOfPages();
    const pageSize = doc.internal.pageSize;
    const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();

    function addFooters() {
      for (let i = 0; i < pageNumber; i++) {
        doc.text(`Pagina ${i + 1} de ·${pageNumber}`, 14, pageHeight - 10);
      }
    }
    addFooters();
    doc.setPage(pageNumber);
    this.fname = "CATEGORIAS" + '-' + new Date().valueOf();
    doc.save(this.fname);
  }

  downloadUsersExcel(data: Array<UserResponse>) {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("USUARIOS");

    let header = ["IDENTIFICACION", "NOMBRES", "CORREO", "ROL", "TELEFONO", "DIRECCION"];
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, colNumber) => {
      cell.font = {
        name: 'Arial',
        family: 2,
        bold: true,
        size: 12,
      };
      cell.alignment = {
        vertical: 'middle', horizontal: 'center'
      };
    });
    worksheet.columns.forEach(function (column, i) {
      var maxLength = 0;
      column["eachCell"]({ includeEmpty: true }, function (cell) {
        var columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength;
    });

    data.forEach((person) => {
      let temp = [];
      temp.push(
        person.identification,
        person.name,
        person.email,
        person.rol,
        person.phone,
        person.address,
      );
      worksheet.addRow(temp);
    });
    workbook.xlsx.writeBuffer().then((data) => {
      this.fname = "USUARIOS" + '-' + new Date().valueOf();
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, this.fname + '.xlsx');
    });
  }

  downloadUsersPdf(data: Array<UserResponse>) {
    const PDFConfig: jsPDFOptions = { putOnlyUsedFonts: true, orientation: 'landscape' };
    const doc = new jsPDF(PDFConfig);
    doc.setFontSize(14);
    const headerTitle = "USUARIOS"
    doc.text(headerTitle, 14, 14);
    doc.setFontSize(11);
    const headers = [
      { header: 'IDENTIFICACION', dataKey: 'identificacion' },
      { header: 'NOMBRES', dataKey: 'nombres' },
      { header: 'CORREO', dataKey: 'correo' },
      { header: 'ROL', dataKey: 'rol' },
      { header: 'TELEFONO', dataKey: 'telefono' },
      { header: 'DIRECCION', dataKey: 'direccion' },
    ];
    const objColumns = {};
    for (const header of headers) {
      objColumns[header.dataKey] = { columnWidth: 'auto' }
    }
    let dataMapped = [];
    data.forEach((prod) => {
      dataMapped.push({
        identificacion: prod.identification,
        nombres: prod.name,
        correo: prod.email,
        rol: prod.rol,
        telefono: prod.phone,
        direccion: prod.address,
      });
    });
    autoTable(doc, {
      columns: headers,
      body: dataMapped,
      startY: 20,
      columnStyles: objColumns,
      theme: 'striped',
      tableWidth: 'auto',
      cellWidth: 'wrap',
      showHead: 'firstPage',
      headStyles: {
        fillColor: [52, 152, 219],
      },
      styles: {
        overflow: 'linebreak',
        cellWidth: 'wrap',
        fontSize: 8,
        cellPadding: 2,
        overflowColumns: 'linebreak'
      },
    } as UserOptions);

    const pageNumber = doc.getNumberOfPages();
    const pageSize = doc.internal.pageSize;
    const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();

    function addFooters() {
      for (let i = 0; i < pageNumber; i++) {
        doc.text(`Pagina ${i + 1} de ·${pageNumber}`, 14, pageHeight - 10);
      }
    }
    addFooters();
    doc.setPage(pageNumber);
    this.fname = "USUARIOS" + '-' + new Date().valueOf();
    doc.save(this.fname);
  }
}
