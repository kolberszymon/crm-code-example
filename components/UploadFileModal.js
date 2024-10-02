import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from 'xlsx';

import { ButtonGray } from "./Buttons/ButtonGray";
import { ButtonGreen } from "./Buttons/ButtonGreen";
import { SelectDropdown } from "./Inputs/SelectDropdown";
import { SelectDropdownLabelValue } from "./Inputs/SelectDropdownLabelValue";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { groupBy } from 'lodash';
import { ButtonMustard } from "./Buttons/ButtonMustard";
import Link from "next/link";

// Add these helper functions at the top of your file or in a separate utilities file
function parseDate(value) {
  // First, try parsing as an Excel date
  const excelDate = parseFloat(value);
  if (!isNaN(excelDate)) {
    return excelDateToJSDate(excelDate);
  }
  
  // If not an Excel date, try parsing as a string
  const date = new Date(value);
  if (!isNaN(date.getTime())) {
    return date;
  }
  
  // If both fail, return null
  return null;
}

function excelDateToJSDate(excelDate) {
  return new Date((excelDate - 25569) * 86400 * 1000);
}

export const UploadFileModal = ({ isOpen, closeModal }) => {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [file, setFile] = useState(null);
  const [uploadStep, setUploadStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState({errors: [], message: '', type: ''});
  const [validatedFileData, setValidatedFileData] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles: 1,
  });

  const validateFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: 'array'});
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1});
        
        const requiredColumns = [
          'merchant_name',
          'merchant_email',
          'employee_last_name',
          'employee_first_name',
          'employee_phone',
          'amount_netto',
          'amount_pit4',
          'transaction_date'
        ];
        
        const headers = jsonData[0];
        const missingColumns = requiredColumns.filter(col => !headers.includes(col));
        
        // It makes sense to throw an error here, because we can't validate data without properly assigned columns
        if (missingColumns.length > 0) {
          reject({
            type: 'missing_columns',
            message: `Brakujące wymagane kolumny:`,
            errors: missingColumns
          });
          return;
        }
  
        const errors = [];
        const formattedData = [];
        let totalTokenAmount = 0;
        const uniqueMerchants = new Set();

        const amountNettoIndex = headers.indexOf('amount_netto');
        const amountPit4Index = headers.indexOf('amount_pit4');

        const selectedMonth = parseInt(month); // Assuming month is 1-12
        const selectedYear = parseInt(year);

        const employeeMerchantMap = new Map();

        jsonData.slice(1).forEach((row, index) => {
          const rowNumber = index + 2; // +2 because we start from second row and Excel is 1-indexed
          
          // Check if the entire row is empty
          if (row.every(cell => cell === undefined || cell === '')) {
            return; // Skip this row if it's entirely empty
          }

          const amountNetto = row[amountNettoIndex];
          const amountPit4 = row[amountPit4Index];

          const employeePhone = row[headers.indexOf('employee_phone')];
          const merchantEmail = row[headers.indexOf('merchant_email')];
          const employeeFirstName = row[headers.indexOf('employee_first_name')];
          const employeeLastName = row[headers.indexOf('employee_last_name')];

          // Check if both amount_netto and amount_pit4 are empty or both are numbers
          const bothAmountsEmpty = (amountNetto === undefined || amountNetto === '') && 
                                  (amountPit4 === undefined || amountPit4 === '');
          const bothAmountsValid = !isNaN(parseFloat(amountNetto)) && parseFloat(amountNetto) > 0 &&
                                  !isNaN(parseFloat(amountPit4)) && parseFloat(amountPit4) >= 0;

          if (employeePhone && merchantEmail) {
            if (employeeMerchantMap.has(employeePhone)) {
              const existingMerchant = employeeMerchantMap.get(employeePhone);
              if (existingMerchant !== merchantEmail) {
                errors.push(`Wiersz ${rowNumber}: Pracownik ${employeeFirstName} ${employeeLastName} (nr tel. ${employeePhone}) jest przypisany do dwóch róznych merchantów: ${existingMerchant} i ${merchantEmail}`);
              }
            } else {
              employeeMerchantMap.set(employeePhone, merchantEmail);
            }
          }

          if (!bothAmountsEmpty && !bothAmountsValid) {
            errors.push(`Wiersz ${rowNumber}: Wartości 'amount_netto' i 'amount_pit4' muszą być obie puste lub obie liczbami nieujemnymi`);
          }

          if (!isNaN(amountNetto)) {
            totalTokenAmount += amountNetto;
          }

          // Collect unique merchant emails          
          if (merchantEmail) {
            uniqueMerchants.add(merchantEmail);
          }

          const formattedRow = {            
            merchantName: row[headers.indexOf('merchant_name')],
            merchantEmail: row[headers.indexOf('merchant_email')],
            employeeLastName: row[headers.indexOf('employee_last_name')],
            employeeFirstName: row[headers.indexOf('employee_first_name')],
            employeePhone: String(row[headers.indexOf('employee_phone')]),
            amountNetto: Number((parseFloat(row[headers.indexOf('amount_netto')]) || 0).toFixed(2)),
            amountPit4: Number((parseFloat(row[headers.indexOf('amount_pit4')]) || 0).toFixed(2)),          
          };

          console.log(formattedRow)

          formattedData.push(formattedRow);

          requiredColumns.forEach((col, colIndex) => {
            const value = row[headers.indexOf(col)];
            if (col !== 'amount_netto' && col !== 'amount_pit4') {
              if (value === undefined || value === '') {
                errors.push(`Wiersz ${rowNumber}, kolumna "${col}": Brak wartości`);
              } else {
                // Add specific validations for each column type
                switch(col) {
                  case 'merchant_email':
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                      errors.push(`Wiersz ${rowNumber}, kolumna "${col}": Nieprawidłowy format email`);
                    }
                    break;
                  case 'employee_phone':
                    if (!/^\+?[\d\s-]{9,}$/.test(value)) {
                      errors.push(`Wiersz ${rowNumber}, kolumna "${col}": Nieprawidłowy format numeru telefonu`);
                    }
                    break;
                  case 'transaction_date':
                    const date = parseDate(value);
                    if (date === null) {
                      errors.push(`Wiersz ${rowNumber}, kolumna "${col}": Nieprawidłowy format daty`);
                    } else {
                      const transactionMonth = date.getMonth() + 1; // getMonth() returns 0-11
                      const transactionYear = date.getFullYear();
                      if (transactionMonth !== selectedMonth || transactionYear !== selectedYear) {
                        errors.push(`Wiersz ${rowNumber}, kolumna "${col}": Data transakcji (${date.toLocaleDateString('pl-PL')}) nie jest z wybranego miesiąca i roku (${selectedMonth}/${selectedYear})`);
                      }
                    }
                    break;
                }
              }
            }
          });
        });
  
        if (errors.length > 0) {
          reject({
            type: 'validation_errors',
            message: 'Znaleziono błędy w pliku:',
            errors: errors
          });
        } else {
          resolve({
            totalTokenAmount,
            uniqueMerchants: Array.from(uniqueMerchants),
            fileData: formattedData
          });
        }
      };
      reader.onerror = (error) => reject({type: 'file_error', message: 'Błąd odczytu pliku'});
      reader.readAsArrayBuffer(file);
    });
  };

  const reset = () => {
    setUploadStep(0)
    setFile(null)
    setMonth(null)
    setYear(null)
    setValidationErrors([])
    setValidatedFileData(null)
  }

  useEffect(() => {
    console.log(validationErrors)
  }, [validationErrors])

  if (!isOpen) return null;

  // Upload file step 0
  if (uploadStep === 0) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
        <div className="rounded-md shadow-md max-w-lg w-full">
          {/* Top part */}
          <div className="flex items-center justify-between p-[16px] bg-zinc-100 rounded-t-md">
            <p className="text-zinc-950 text-base font-semibold">Prześlij plik</p>
            <Link href="/monlib_przykladowy_plik.csv" download className="text-gray-400 text-xs underline">
              pobierz przykładowy plik
            </Link>
          </div>

          {/* Middle part */}
          <div className="p-[16px] bg-white min-h-[250px] flex flex-col gap-[16px]">
            {/* File upload */}
            <div
              {...getRootProps()}
              className={`flex flex-col gap-[8px] items-center justify-center min-h-[150px] border border-zinc-200 border-dashed border-2 cursor-pointer transition-colors ${
                isDragActive ? "bg-zinc-100" : "bg-white"
              }`}
            >
              <input {...getInputProps()} />
              {file ? (
                <p className="text-zinc-950 text-sm">{file.name}</p>
              ) : (
                <>
                  <Image src="/icons/cloud-upload.svg" width={24} height={24} alt="cloud-upload" />
                  <p className="text-zinc-950 text-sm font-semibold">Przesuń i upuść lub <span className="text-[#015640]">Kliknij i wgraj plik</span></p>
                  <p className="text-zinc-500 text-xs">Obsługiwane formaty: .csv, .xlsx, .xls</p>
                </>
              )}
            </div>

            {/* File details to validate */}
            <p className="text-zinc-950 text-sm">Szczegóły pliku:</p>
            <div className="flex flex-row gap-[16px]">
              <div className="flex flex-row gap-[8px] items-center">
                <p className="text-zinc-950 text-sm">Miesiąc:</p>
                <SelectDropdownLabelValue value={month} setValue={setMonth} options={["", {label: "Styczeń", value: 1}, {label: "Luty", value: 2}, {label: "Marzec", value: 3}, {label: "Kwiecień", value: 4}, {label: "Maj", value: 5}, {label: "Czerwiec", value: 6}, {label: "Lipiec", value: 7}, {label: "Sierpień", value: 8}, {label: "Wrzesień", value: 9}, {label: "Październik", value: 10}, {label: "Listopad", value: 11}, {label: "Grudzień", value: 12}]} />
              </div>

              <div className="flex flex-row gap-[8px] items-center">
                <p className="text-zinc-950 text-sm">Rok:</p>
                <SelectDropdown value={year} setValue={setYear} options={["", "2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"]} />
              </div>
            </div>
            

          </div>

          {/* Botton part */}
          <div className="bg-white p-[16px] rounded-b-md border-t border-zinc-200 flex flex-row gap-[8px] items-center justify-end">
            <ButtonGray title="Anuluj" onPress={() => {
              closeModal()
              reset()
            }} />
            <ButtonGreen title="Prześlij" onPress={() => {
              setUploadStep(1) // Move to loading state immediately
              validateFile(file)
              .then((validationResult) => {
                setValidatedFileData(validationResult)

                return fetch('/api/file/validate', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    totalTokenAmount: validationResult.totalTokenAmount,
                    uniqueMerchants: validationResult.uniqueMerchants,
                    month,
                    year
                  }),
                });
              })
              .then(async (response) => {
                const data = await response.json();                
                
                if (data.success) {                  
                  setUploadStep(3) // Success state
                } else {
                  console.log("data")
                  console.log(data)
                  setValidationErrors({
                    type: 'backend_validation_error',
                    message: data.message,
                    errors: data.errors
                  });
                  setUploadStep(2) // Error state
                }
              })
              .catch((error) => {
                console.log("error")
                console.log(error)
                setValidatedFileData(null);
                setValidationErrors({
                  type: 'backend_validation_error',
                  message: error.message,
                  errors: error.errors
                });
                setUploadStep(2) // Go back to the initial step if validation fails
              })
            }} disabled={!file || !month || !year} />
          </div>
        </div>
      </div>
    );
  };

  // Upload file step 1 - Loading indicator
  if (uploadStep === 1) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
        <div className="rounded-md shadow-md max-w-lg w-full">
          {/* Top part */}
          <div className="flex items-center justify-start p-[16px] bg-zinc-100 rounded-t-md">
            <p className="text-zinc-950 text-base font-semibold">Prześlij plik</p>
          </div>

          {/* Middle part */}
          <div className="p-[16px] bg-white min-h-[200px] flex flex-col gap-[16px] items-center justify-center">                        
              <Loader2 className="w-10 h-10 text-zinc-950 animate-spin" />
              <p className="text-zinc-950 text-sm">Przetwarzanie pliku, nie wyłączaj strony</p>
              <p className="text-zinc-400 text-xs font-normal">Jeśli przetwarzanie zajmuje więcej niż parę minut, anuluj i wgraj plik ponownie</p>                     
          </div>

          {/* Botton part */}
          <div className="bg-white p-[16px] rounded-b-md border-t border-zinc-200 flex flex-row gap-[8px] items-center justify-end">
            <ButtonGray title="Anuluj" onPress={() => {
              closeModal()
              reset()
            }} />            
          </div>
        </div>
      </div>
    );
  }

  // Upload file step 2 - there was an error parsing the file
  if (uploadStep === 2) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
        <div className="rounded-md shadow-md max-w-lg w-full">
          {/* Top part */}
          <div className="flex items-center justify-start p-[16px] bg-zinc-100 rounded-t-md">
            <p className="text-zinc-950 text-base font-semibold">Prześlij plik</p>
          </div>

          {/* Middle part */}
          <div className="p-[16px] bg-white min-h-[200px] max-h-[400px] overflow-y-auto flex flex-col gap-[16px] items-start justify-start">                                      
              <p className="text-zinc-950 text-sm font-semibold">Przesyłanie nieudane, plik zawiera następujące błędy:</p>
                            
              {validationErrors && (
                <ul className="text-red-500 text-xs list-disc list-inside">
                  {Array.isArray(validationErrors.errors) 
                    ? validationErrors.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))
                    : <li>{validationErrors.message}</li>
                  }
                </ul>
              )}
          </div>

          {/* Botton part */}
          <div className="bg-white p-[16px] rounded-b-md border-t border-zinc-200 flex flex-row gap-[8px] items-center justify-end">
            <ButtonGray title="Anuluj" onPress={() => {
              closeModal()
              reset()
            }} />

            <ButtonGreen title="Prześlij ponownie" onPress={reset} />
          </div>
        </div>
      </div>
    );
  }

  // Upload file step 3 - validation success
  if (uploadStep === 3) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
        <div className="rounded-md shadow-md max-w-lg w-full">
          {/* Top part */}
          <div className="flex items-center justify-start p-[16px] bg-zinc-100 rounded-t-md">
            <p className="text-zinc-950 text-base font-semibold">Prześlij plik</p>
          </div>

          {/* Middle part */}
          <div className="p-[16px] bg-white min-h-[160px] flex flex-col gap-[8px] items-center justify-center">     
            <Image src="/icons/check-circle.svg" width={30} height={30} alt="check-circle" />
            <p className="font-semibold text-[#015640]">Sukces!</p>
            <p className="text-zinc-950 text-xs text-center">Plik został zwalidowany pod względem formatu i zgodnością z bazą danych. Można rozpocząć wykonywanie transakcji.</p>              
          </div>

          {/* Botton part */}
          <div className="bg-white p-[16px] rounded-b-md border-t border-zinc-200 flex flex-row gap-[8px] items-center justify-end">
            <ButtonGray title="Anuluj" onPress={() => {
              closeModal()
              reset()
            }} />

            <ButtonGreen title="Dalej" onPress={() => {
              setUploadStep(4)
            }} />
          </div>
        </div>
      </div>
    );
  }

   // Upload file step 3 - validation success
   if (uploadStep === 4) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
        <div className="rounded-md shadow-md max-w-lg w-full">
          {/* Top part */}
          <div className="flex items-center justify-start p-[16px] bg-zinc-100 rounded-t-md">
            <p className="text-zinc-950 text-base font-semibold">Prześlij plik</p>
          </div>

          {/* Middle top part */}
          <div className="p-[16px] bg-white min-h-[160px] flex flex-col gap-[8px] items-center justify-center">     
            <Image src="/icons/exclamation-triangle.svg" width={30} height={30} alt="exclamation-triangle" />
            <p className="font-semibold text-[#E59148]">Sprawdź!</p>
            <p className="text-zinc-950 text-xs text-center">Po kliknięciu “Rozpocznij” transakcje zaczną się wykonywać. Nie ma możliwości prostego cofnięcia wykonanych transakcji, więc sprawdź jeszcze raz dane pliku, który wybrałeś.</p>              
          </div>

          {/* Middle bottom part */}
          <div className="p-[16px] bg-white min-h-[50px] flex flex-col gap-[8px] items-start justify-start">              
            <p className="text-zinc-950 text-xs"><span className="font-semibold">Nazwa pliku:</span> {file.name}</p>
            <p className="text-zinc-950 text-xs"><span className="font-semibold">Wybrany okres:</span> {month}/{year}</p>              
          </div>

          {/* Botton part */}
          <div className="bg-white p-[16px] rounded-b-md border-t border-zinc-200 flex flex-row gap-[8px] items-center justify-end">
            <ButtonGray title="Anuluj" onPress={() => {
              closeModal()
              reset()
            }} />

            <ButtonMustard title="Zgadza się, rozpocznij" onPress={() => {
              setUploadStep(5)

              console.log({
                fileData: validatedFileData.fileData,
                month,
                year
              })

              fetch('/api/file/process-transactions', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  fileData: validatedFileData.fileData,
                  month,
                  year
                }),
              })
              .then(async (response) => {
                const data = await response.json();
                console.log(data)
                if (data.success) {
                  setUploadStep(6)
                } else {
                  console.log(data)
                  setUploadStep(4);
                }
              })
              .catch((error) => {
                console.log("error", error)
                setUploadStep(4);
                
              })
            }} />
          </div>
        </div>
      </div>
    );
  }

    // Upload file step 1 - Loading indicator
    if (uploadStep === 5) {
      return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="rounded-md shadow-md max-w-lg w-full">
            {/* Top part */}
            <div className="flex items-center justify-start p-[16px] bg-zinc-100 rounded-t-md">
              <p className="text-zinc-950 text-base font-semibold">Prześlij plik</p>
            </div>
  
            {/* Middle part */}
            <div className="p-[16px] bg-white min-h-[200px] flex flex-col gap-[16px] items-center justify-center rounded-b-md">                        
                <Loader2 className="w-10 h-10 text-zinc-950 animate-spin" />
                <p className="text-zinc-950 text-sm">Wykonywanie transakcji, nie wyłączaj strony</p>              
            </div>          
          </div>
        </div>
      );
    }

      // Upload file step 3 - validation success
  if (uploadStep === 6) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
        <div className="rounded-md shadow-md max-w-lg w-full">
          {/* Top part */}
          <div className="flex items-center justify-start p-[16px] bg-zinc-100 rounded-t-md">
            <p className="text-zinc-950 text-base font-semibold">Prześlij plik</p>
          </div>

          {/* Middle part */}
          <div className="p-[16px] bg-white min-h-[160px] flex flex-col gap-[8px] items-center justify-center">     
            <Image src="/icons/check-circle.svg" width={30} height={30} alt="check-circle" />
            <p className="font-semibold text-[#015640]">Sukces!</p>
            <p className="text-zinc-950 text-xs text-center">Transkacje zostały wykonane pomyślnie</p>              
          </div>

          {/* Botton part */}
          <div className="bg-white p-[16px] rounded-b-md border-t border-zinc-200 flex flex-row gap-[8px] items-center justify-end">
            <ButtonGreen title="Zamknij" onPress={() => {
              closeModal()
              reset()
            }} />
          </div>
        </div>
      </div>
    );
  }

};
