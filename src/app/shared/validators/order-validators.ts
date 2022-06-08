import { AbstractControl } from "@angular/forms";
import * as moment from 'moment';

export class OrderValidators{
    static data_realizacji(control : AbstractControl){

        const data_realizacji = moment(control.value)
        const max_data_realizacji = moment().add(2, 'day');

        if(data_realizacji <= max_data_realizacji){
            return {
                data_realizacji : true
            }
        }

        return null
    }
}