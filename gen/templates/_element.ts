

module <%=element.is.split('-')[0]%> {
	
	/* <%= element.desc.replace('*/', '') %>
	*/
	interface <%=className%> <% if( element.behaviors ) { %> implements <%=element.behaviors.join(',')%><% } %>
	{	

	<% if( element.events && element.events.length>0 ) { %>/* 
	== EVENTS ==
	
	<%	element.events.forEach( function(e) { %>Event: '<%=e.name%>'  
	<%if( e.params && e.params.length>0 ) {%>Params: <%=templateParams( e.params )%><%}%><%=e.desc%> <% });%>
	*/<%}%>
	
	<% if (publicProps) { publicProps.forEach(function (p) { %>
		/*<%=p.desc%> 
		*/
		<%= p.name%>:<%=templateType(p)%>;
	<% });} %>
	
	<% if (publicMethods) { publicMethods.forEach(function (m) { %>
		/*<%=m.desc%> 
		*/
		<%= m.name%>(<%=templateParams( m.params )%>);
	<% });} %>
	
	      
	}

}