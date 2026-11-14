export function fileFormat(file,fallback='PDF'){
 if(/^data:application\/pdf;/i.test(file||'')||/\.pdf(?:[?#]|$)/i.test(file||''))return 'PDF';
 if(/^data:application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet;/i.test(file||'')||/\.xlsx(?:[?#]|$)/i.test(file||''))return 'XLSX';
 return fallback;
}
