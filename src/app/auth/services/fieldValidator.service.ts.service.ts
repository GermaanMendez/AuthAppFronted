import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FieldValidatorServiceTsService {
  public firstNameAndLastnamePattern: string = '([a-zA-Z]+) ([a-zA-Z]+)';
  public emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

  constructor() { }


  public isNotValidField(form: FormGroup,field: string): boolean | null{
    return form.controls[field].errors && form.controls[field].touched;
  }

  public isFieldOneEqualToFieldTwo(field1: string, field2: string) {
    return (formGroup: FormGroup): ValidationErrors | null => {
      const fieldValue1 = formGroup.get(field1)?.value;
      const fieldValue2 = formGroup.get(field2)?.value;
      console.log(fieldValue1)
      console.log(fieldValue2)
      if (fieldValue1 != fieldValue2) {
        formGroup.get(field2)?.setErrors({notEqual:true})
        return {notEqual:true}
      }
      //Si son iguales elimino el error seteado y retorno null
      formGroup.get(field2)?.setErrors(null)
      return null;
    }
  }
}
