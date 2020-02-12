import { GenderEnum } from './gender';
import * as _ from 'lodash';


/**
 * Model of owner
 */
export class Owner {

  name: string;

  gender: GenderEnum;

  age: number;

  constructor(name: string, gender: string, age: number) {
    this.name = name;
    this.age = age;

    if (gender && gender === GenderEnum.MALE) {
      this.gender = GenderEnum.MALE;
    } else if (gender && gender === GenderEnum.FEMALE) {
      this.gender = GenderEnum.FEMALE;
    }
  };

}
