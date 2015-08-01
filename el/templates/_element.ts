/// <reference path="../../bower_components/polymer-ts/polymer-ts.d.ts"/>

@component('<%=elementName%>')
class <%=className%> extends polymer.Base
{
   @property({ type: String, value: "1024" })
   test: string = "4096";

   @observe("test")
   testChanged(newValue:string,oldValue:string)
   {
      console.log(`test has changed from ${oldValue} to ${newValue}`);
   }

   @computed()
   fullname(test:string):string
   {
      return "Douglas Adams ["+test+"]";
   }

   // listener
   handleClick(e:Event)
   {
      console.log('handle click', e );
      
      this.test = this.test + "x";
      this.fire("behave");
   }

   // lifecycle method
   ready()
   {
     console.log( this['is'], "ready!")
   }


}

<%=className%>.register();
