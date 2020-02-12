import { Owner } from './Owner';

/**
 * Model of pet
 */
export class Pet {

  name: string;

  type: string;

  owner: Owner;

  constructor(name: string, type: string, owner: Owner){
    this.name = name;
    this.type = type;
    this.owner = owner;
  };


}
