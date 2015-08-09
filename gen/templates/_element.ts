
interface <%=className%> 
{
<% if (publicProperties) { publicProperties.forEach(function (p) { %>
	/*
	<%=p.desc%>
	*/
	<%= p.name%>:<%=p.type.toLowerCase()%>;
<% });} %>
      
}

