import { GenderEnum } from './gender';
import { Pet } from './Pet';

export interface GroupedPetsInterface {

  gender: GenderEnum;
  pets: Array<Pet>;
}
