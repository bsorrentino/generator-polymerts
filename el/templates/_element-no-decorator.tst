/// <reference path="../<%= pathToBower %>/polymer-ts/polymer-ts.d.ts"/>

class <%=className%> extends polymer.Base
{
    is = '<%=elementName%>';
    
    properties = {
        greetAll: {
            type: String,
            computed: '_computeGreetAll(greet)'
        },
        greet: {
            type:String,
            value: 'Hello', 
            observer: "_greetChanged"
        }
    }

    behaviors = [];
    
    listeners = {
        'greet-event':'_onButtonWasClicked' 
    } 
   
   _greetChanged(newValue:string, oldValue:string)
   {
      console.log(`greet has changed from ${oldValue} to ${newValue}`);
   }

   _computeGreetAll(test:string):string
   {
      return test+" to all";
   }

   // event handler 
   handleClick(e:Event)
   {
      this.greet = "Hello";      
      this.fire("greet-event");
   }

   _onButtonWasClicked(e:Event)
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
