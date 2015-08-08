
interface <%=className%> 
{
<% if (properties) { properties.forEach(function (property) { %><%= property.name%>:any;
<% });} %>
      
}

