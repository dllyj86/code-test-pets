import { GenderEnum } from './gender';
import { Pet } from './Pet';

export interface GroupedPetsInterface {

  groupKey: string;
  groupValues: Array<Pet>
}
