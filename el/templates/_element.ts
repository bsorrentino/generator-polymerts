/// <reference path="<%= pathToBower %>/polymer-ts/polymer-ts.d.ts"/>

@component('<%=elementName%>')
class <%=className%> extends polymer.Base
{
   @property({ type: String })
   greet: string = "Hello";

   @observe("greet")
   greetChanged(newValue:string, oldValue:string)
   {
      console.log(`greet has changed from ${oldValue} to ${newValue}`);
   }

   @computed()
   greetAll(test:string):string
   {
      return this.test+" to all";
   }

   // event handler 
   handleClick(e:Event)
   {
      this.greet = "Holà";      
      this.fire("greet-event");
   }

   @listen("greet-event")
   onButtonWasClicked(e:Event)
   {
      console.log('event "greet-event" received');                  
   }


   // lifecycle methods
   ready()
   {
     console.log( this['is'], "ready!")
   }
   
   created() { }
   attached() { }
   detached() { }



}

<%=className%>.register();
