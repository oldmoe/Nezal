<table>
	<tbody>
		<tr>
			<td>Health Points</td>
			<td>${unit.hp}/${unit.maxHp}</td>
		</tr>
		{for attr in Unit.attributes}
		<tr>
			<td>${attr[0]}</td>
			<td>${unit[attr[1]]}</td>
		</tr>
		{/for}
		</tr>
	</tbody>	
</table>