import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
export class Validaciones {
  
 
  static numbersOnlyValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      
      const onlyNumbers = /^[0-9]+$/;
      return onlyNumbers.test(value) ? null : { numbersOnly: true };
    };
  }

  static noLeadingSpaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      return value.startsWith(' ') ? { leadingSpace: true } : null;
    };
  }


  static uppercaseValidator(): ValidatorFn {//si
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      
      const upperValue = value.toUpperCase();
      if (value !== upperValue) {
        control.setValue(upperValue, { emitEvent: false });
      }
      return null;
    };
  }

  static validateUniqueData(listRows: any[], currentData?: any, field: string = 'numeroDocumento'): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {//si
      const value = control.value;
      if (currentData && currentData[field] === value) {
        return null;
      }
      const exists = listRows.some(row => row[field] === value);
      return exists ? { dataExist: true } : null;
    };
  }

  // formato del nuermo de documento según el tipo documento
  static validateDocumentNumber(tipoDocumento: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      if (tipoDocumento === 'CI') {
        const onlyNumbers = /^[0-9]+$/;
        if (!onlyNumbers.test(value)) {
          return { onlyNumbers: true };
        }
      } else if (tipoDocumento === 'CE') {
        const lettersNumbersAndHyphen = /^[a-zA-Z0-9\-]+$/;
        if (!lettersNumbersAndHyphen.test(value)) {
          return { lettersAndNumbers: true };
        }
      } else {
        const generalPattern = /^[a-zA-Z0-9]+$/;
        if (!generalPattern.test(value)) {
          return { invalidFormat: true };
        }
      }
      return null;
    };
  }

  static restrictToNumbers(event: any): void {//si
    const input = event.target as HTMLInputElement;
    const initialValue = input.value || '';

    const numericValue = initialValue.replace(/[^0-9]/g, '');
    if (initialValue !== numericValue) {
      input.value = numericValue;
      input.dispatchEvent(new Event('input'));
    }
  }


  static forceUppercase(event: any): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    
    if (value) {
      const upperValue = value.toUpperCase();
      if (input.value !== upperValue) {
        input.value = upperValue;
        input.dispatchEvent(new Event('input'));
        input.dispatchEvent(new Event('change'));
      }
    }
  }


  static forceFirstUppercase(event: any): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    
    if (value.length > 0) {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }
    
    if (input.value !== value) {
      input.value = value;
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new Event('change'));
    }
  }

  static formatProperName(event: any): void {//si
    const input = event.target as HTMLInputElement;
    let value = input.value;
    value = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    value = value.replace(/\s{2,}/g, ' ');
    if (value.startsWith(' ')) {
      value = value.substring(1);
    }
    if (value.length > 0) {
      value = value.toLowerCase();
      value = value.replace(/(?:^|\s)\S/g, (match: string) => {
        return match.toUpperCase();
      });
    }
    if (input.value !== value) {
      input.value = value;
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new Event('change'));
    }
  }

   static restrictToDecimal(event: any): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    
    const cleanValue = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    
    if (input.value !== cleanValue) {
      input.value = cleanValue;
      input.dispatchEvent(new Event('input'));
    }
  }















  
  static placaValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || control.value.trim() === '') return null;
      
      const value = control.value.toUpperCase().trim();
      const regex = /^([A-Z]{2,3}-?\d{3,4}|\d{3,4}-?[A-Z]{2,3})$/;
      const cleanValue = value.replace(/-/g, '');
      if (cleanValue.length < 5 || cleanValue.length > 7) {
        return { invalidPlaca: true };
      }
      return regex.test(value) ? null : { invalidPlaca: true };
    };
  }

    static polizaValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const regex = /^[A-Z0-9-]+$/;
      return regex.test(control.value) ? null : { invalidPoliza: true };
    };
  }

   static chasisValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const regex = /^[A-HJ-NPR-Z0-9]{17}$/i;
      return regex.test(control.value.toUpperCase()) ? null : { invalidChasis: true };
    };
  }

    static pinValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const regex = /^[A-Z0-9]+$/;
      return regex.test(control.value) ? null : { invalidPin: true };
    };
  }


static vinValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
  
    const vinRegex = /^[A-HJ-NPR-Z0-9]{10,17}$/;
    if (!vinRegex.test(value)) {
      return { 
        invalidVin: true,
        message: 'El VIN debe contener entre 10 y 17 caracteres alfanuméricos (sin I, O, Q)'
      };
    }
    
    return null;
  };
}

}