import { AbstractControl } from '@angular/forms';
import Swal from 'sweetalert2';

export class MyValidations {
  static sameVal(id) {
    return (control: AbstractControl) => {
      const value = control.value;
      id.on('keyup', function() {
        if( value != ''){
          control.updateValueAndValidity()
        }
        return {sameVal: true};
      })
      if (value != id.val()) {
        return {sameVal: true};
      }
      return null;
    };
  }
}

export class MyAlert{
  static alert(text, error?){
    Swal.fire({
      position: 'top-right',
      title: error ? 'Error!' : 'Hecho!',
      text: text,
      showConfirmButton: false,
      backdrop: false,
      width: 300,
      timer: 1500,
      customClass: {
        title: error ? 'title-alert' : 'title-done',
        htmlContainer:'content-alert'
      }
    })
  }
}

export class CreateFile{
  static async createFile(url){
    let response = await fetch(url);
    let data = await response.blob();;
    return new File([data], "placeholder.jpg");
  }
}