import { helloType } from "./types";

export function sayHello({firstName , lastName, age} :  helloType ) {
  try {

    if(firstName && lastName && age) {
      console.log(`Hallo ${firstName} ${lastName}, Guten Morgan !`)
    }
    
    if(firstName || lastName || age) {
      console.log(`Hallo ${firstName}, Guten Morgan !`)
    }

  } catch(error : any){
    console.log({ error : error, _error : error });
  }
}