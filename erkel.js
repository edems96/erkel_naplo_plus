function getColor(mark) {
	switch( mark ) {
		case 5: return "green";
		case 4: return "greenyellow";
		case 3: return "yellow";
		case 2: return "orange";
		case 1: return "red";
		case 0: return "gray";
	}
	
	return "gray";
}

function getMarkFromRatio(ratio) {
	
	if( ratio == "NaN" )
		return 0;
		
	if( ratio >= 4.5 )
		return 5;
		
	if( ratio >= 3.5 )
		return 4;
		
	if( ratio >= 2.5 )
		return 3;
		
	if( ratio >= 1.5 )
		return 2;
		
	return 1;
}

var $tables = $("table");
var $table = $tables.eq(3);

var $rows = $table.find("tr");

var fullYear_all = 0, fullYear_count = 0, fullYear_marks = 0;

$('<td align="center"><b>átlag</b></td>').appendTo($rows.eq(0));
$('<td align="center"><b>osztályzat</b></td>').appendTo($rows.eq(0));
		
for(var i = 1; i < $rows.length; i++) {
	$row = $rows.eq(i);
	$cols = $row.find("td");

	$fCol = $cols.eq(1); // first column
	
	$divs = $fCol.find("div.jel");
	$marks = $fCol.find("b");

	var course_1_all = 0, course_1_count = 0;
	var course_2_all = 0, course_2_count = 0;
	var halfYear = false;
	
	for(var j = 0; j < $marks.length; j++) {
		var mark = parseInt($marks.eq(j).text());
		
		if( $divs.eq(j).text() == "FZ" ) {
			halfYear = true;
			
			// magatartás, szorgalom...
			continue;
		}
		
		if( halfYear ) {
			course_2_all += ($divs.eq(j).text() == "tz" ? (mark*2) : mark);
			course_2_count += ($divs.eq(j).text() == "tz" ? 2 : 1);
		} else {
			course_1_all += ($divs.eq(j).text() == "tz" ? (mark*2) : mark);
			course_1_count += ($divs.eq(j).text() == "tz" ? 2 : 1);
		}
	}
	
	var course_1_ratio = (course_1_all / course_1_count).toFixed(2);
	var course_2_ratio = (course_2_all / course_2_count).toFixed(2);
	
	var course_mark = getMarkFromRatio(halfYear ? course_2_ratio : course_1_ratio);
	var course_ratio = ((course_1_all + course_2_all) / (course_1_count + course_2_count)).toFixed(2);
	
	fullYear_all += (course_1_all + course_2_all);
	fullYear_count += (course_1_count + course_2_count);
	fullYear_marks += course_mark;
	
	if( course_1_ratio == "NaN" || course_1_ratio == "undefined" )
		course_1_ratio = "?";
		
	if( course_2_ratio == "NaN" || course_2_ratio == "undefined" )
		course_2_ratio = "?";

	if( course_ratio == "NaN" || course_ratio == "undefined" )
		course_ratio = "?";
		
	$('<td align="center">'+
		'<table>'+
			'<tr>'+
				'<td>'+ course_1_ratio +'</td>'+
				'<td rowspan="3">'+ course_ratio +'</td>'+
			'</tr>'+
			'<tr><td><hr></td></tr>'+
			'<tr>'+
				'<td>'+ course_2_ratio +'</td>'+
			'</tr>'+
		'</table></td>').appendTo($row);
		
	$('<td align="center" bgColor="'+ getColor(course_mark) +'">'+ course_mark +'</td>').appendTo($row);
}

var fullYear_ratio = (fullYear_all / fullYear_count).toFixed(2);
var fullYear_marks_ratio = (fullYear_marks / ($rows.length-1)).toFixed(2);

$('<tr bgcolor="#FFFFFF">'+
	'<td>Átlag:</td>'+
	'<td>-</td>'+
	'<td align="center">'+ fullYear_ratio +'</td>'+
	'<td align="center">'+ fullYear_marks_ratio +'</td>' +
  '</tr>').appendTo($table);