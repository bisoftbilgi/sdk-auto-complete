/**
 * @overview AutoComplete SearchBar for Lumira Designer
 * @version 1.00
 * @author İzzet Emre Arı
 */

define(["sap/designstudio/sdk/component", "css!../css/component.css"], function(Component, css) {
    Component.subclass("com.bisoft.customsearchbar.customSearchBar", function() {

        var that = this;
        
        var DATA_DIM = "data-dim-";
		var that = this;
		var data1 = null;
		var firstLoad = true;
		var headers = [];
		var iNumColTupleElements = 0;
		var iNumRowTupleElements = 0;
		var iNumDataCols = 0;
		var iNumDataRows = 0;
		var iNumGridCols = 0;
		var iNumGridRows = 0;
		var iNumGridColTupleElements = 0;
		var iNumGridRowTupleElements = 0;
		var aGridColspan = [];
		var aGridRowspan = [];
		var aGridText = [];
		var aGridType = [];
		var aGridDataAttributes = [];
		
		var dataList = [];
        this._placeholder = "Arama";
        this._searchText = "Getir";
        this._width = "300";
        this._searchValue;
		var myDiv;
		

        this.init = function() {
        	//this.$().addClass("customSearchBox");
        	myDiv = this.$()[0];
        	htmlSection();
        };
        
        

        this.afterUpdate = function() {
				getDatas(function(){
					/*initiate the autocomplete function on the "searchInput" element, and pass along the data array as possible autocomplete values:*/
			      	autocomplete(document.getElementById(myDiv.id + "searchInput"), dataList);
				});
				
			if(firstLoad){
	        	firstLoad = false;
				if(document.getElementById(myDiv.id + "autocompleteContainer").style.width != that._width + "px")
					document.getElementById(myDiv.id + "autocompleteContainer").style.width = that._width + "px";
	    		if(document.getElementById(myDiv.id + "searchInput").placeholder != that._placeholder)
	    			document.getElementById(myDiv.id + "searchInput").placeholder = that._placeholder;
	    		if(document.getElementById(myDiv.id + "sendButton").value != that._searchText)
	    			document.getElementById(myDiv.id + "sendButton").value = that._searchText;
        	}
		};
		
		function getDatas(callback){
			if (data1 && data1.formattedData && data1.formattedData.length > 0) {
				resetVariables();
				computeTableLayout1();
				
				aGridColspan = newArray(iNumGridCols, iNumGridRows);
				aGridRowspan = newArray(iNumGridCols, iNumGridRows);
				aGridText = newArray(iNumGridCols, iNumGridRows);
				aGridType = newArray(iNumGridCols, iNumGridRows);
				aGridDataAttributes = newArray(iNumGridCols, iNumGridRows);
				
				applyTopLeftCorner1();
				applyColumnHeaders1();
				applyRowHeaders1();
				applyData1();
				
				appendColumnHeader();
				appendCell1();

			}
			if(callback) callback();
		}
		
		function resetVariables(){
			headers = [];
			dataList = [];
			iNumColTupleElements = 0;
			iNumRowTupleElements = 0;
			iNumDataCols = 0;
			iNumDataRows = 0;
			iNumGridCols = 0;
			iNumGridRows = 0;
			iNumGridColTupleElements = 0;
			iNumGridRowTupleElements = 0;
			aGridColspan = [];
			aGridRowspan = [];
			aGridText = [];
			aGridType = [];
			aGridDataAttributes = [];
		}
		
		
		function computeTableLayout1() {
			iNumDataCols = data1.columnCount;
			iNumDataRows = data1.rowCount;

			iNumColTupleElements = 0;
			iNumRowTupleElements = 0;

			for (var i = 0; i < data1.dimensions.length; i++) {
				var oDim = data1.dimensions[i];
				var sDimAxis = oDim.axis;
				if (sDimAxis === "COLUMNS") {
					iNumColTupleElements++;
				} else if (sDimAxis === "ROWS") {
					iNumRowTupleElements++;
				}
			}

			iNumGridColTupleElements = 0;
			for (var i = 0; i < iNumColTupleElements; i++) {
				var oColDim = data1.dimensions[i];
				iNumGridColTupleElements += 1 + countAttributes(oColDim);
			}

			var DIM_OFFSET = iNumColTupleElements;
			iNumGridRowTupleElements = 0;
			for (var i = 0; i < iNumRowTupleElements; i++) {
				var oRowDim = data1.dimensions[DIM_OFFSET + i];
				iNumGridRowTupleElements += 1 + countAttributes(oRowDim);
			}

			iNumGridCols = iNumGridRowTupleElements + iNumDataCols + ((iNumDataRows == 0) ? 1 : 0);
			iNumGridRows = iNumGridColTupleElements + iNumDataRows + ((iNumDataCols == 0) ? 1 : 0);
		}

		function newArray(iWidth, iHeight) {
			var array = new Array(iWidth);
			for (var i = 0; i < iWidth; i++) {
				array[i] = new Array(iHeight);
			}
			return array;
		}

		function applyTopLeftCorner1() {
			// empty cell at top-left of top-left corner cell
			var iEmptyGridRows = iNumGridRowTupleElements - 1;
			var iEmptyGridCols = iNumGridColTupleElements - 1;
			if ((iEmptyGridRows > 0) && (iEmptyGridCols > 0)) {
				spanCell(0, 0, iEmptyGridRows, iEmptyGridCols, "", "topleft");
			}

			// row header cells at bottom row of top-left corner cell
			var iRowHeadersGridRow = iNumGridColTupleElements - 1;
			if (iRowHeadersGridRow < 0) {
				iRowHeadersGridRow = 0;
			}

			var DIM_OFFSET = iNumColTupleElements;

			var iRowHeadersGridCol = 0;
			for (var iRowTupleElementIndex = 0; iRowTupleElementIndex < iNumRowTupleElements; iRowTupleElementIndex++) {
				var oColDim = data1.dimensions[DIM_OFFSET + iRowTupleElementIndex];
				var sGridText = oColDim.containsMeasures ? "" : oColDim.text;
				spanCell(iRowHeadersGridCol, iRowHeadersGridRow, 1, 1, sGridText, "header");
				var iNumColAttributes = countAttributes(oColDim);
				if (iNumColAttributes > 0) {
					for (var i = 0; i < iNumColAttributes; i++) {
						sGridText = oColDim.attributes[i].text;
						var iRowHeadersGridColFull = iRowHeadersGridCol + (1 + i);
						spanCell(iRowHeadersGridColFull, iRowHeadersGridRow, 1, 1, sGridText, "header");
					}
				}
				iRowHeadersGridCol += 1 + iNumColAttributes;
			}

			// column header cells at right row of top-left corner cell
			var iColHeadersGridCol = iNumGridRowTupleElements - 1;
			if (iColHeadersGridCol < 0) {
				iColHeadersGridCol = 0;
			}

			var OFFSET_COLS = iNumGridRowTupleElements;

			var iColHeadersGridRow = 0;
			for (var iColTupleElementIndex = 0; iColTupleElementIndex < iNumColTupleElements; iColTupleElementIndex++) {
				var oRowDim = data1.dimensions[iColTupleElementIndex];
				var sGridText = oRowDim.containsMeasures ? "" : oRowDim.text;
				spanCell(iColHeadersGridCol, iColHeadersGridRow, 1, 1, sGridText, "header");
				var iNumRowAttributes = countAttributes(oRowDim); 
				if (iNumRowAttributes > 0) {
					for (var i = 0; i < iNumRowAttributes; i++) {
						sGridText = oRowDim.attributes[i].text;
						var iColHeadersGridRowFull = iColHeadersGridRow + (1 + i);
						spanCell(iColHeadersGridCol, iColHeadersGridRowFull, 1, 1, sGridText, "header");
					}
				}
				iColHeadersGridRow += 1 + iNumRowAttributes;				
			}

			// magic cell at bottom-right of top-left corner cell
			var iMagicCellGridCol = iNumGridRowTupleElements - 1;
			var iMagicCellGridRow = iNumGridColTupleElements - 1;

			if ((iMagicCellGridCol > -1) && (iMagicCellGridRow > -1)) {		
				var DIM_OFFSET = iNumColTupleElements;

				var oLastColDim = data1.dimensions[DIM_OFFSET - 1];
				var oLastRowDim = data1.dimensions[data1.dimensions.length - 1];

				var bLastColDimContainsMeasures = (oLastColDim.containsMeasures === true);
				var sLastColText = oLastColDim.text;
				var iNumColDimAttributes = countAttributes(oLastColDim);
				if (iNumColDimAttributes > 0) {
					sLastColText = oLastColDim.attributes[iNumColDimAttributes - 1].text;
				}

				var bLastRowDimContainsMeasures = (oLastRowDim.containsMeasures === true);
				var sLastRowText = oLastRowDim.text;
				var iNumRowDimAttributes = countAttributes(oLastRowDim);
				if (iNumRowDimAttributes > 0) {
					sLastRowText = oLastRowDim.attributes[iNumRowDimAttributes - 1].text;
				}

				var sGridText = "";
				if ((bLastColDimContainsMeasures === false) && (bLastRowDimContainsMeasures === false)) {
					sGridText = sLastRowText + " | " + sLastColText;
				} else if ((bLastColDimContainsMeasures === false) && bLastRowDimContainsMeasures) {
					sGridText = sLastColText;
				} else if (bLastColDimContainsMeasures && (bLastRowDimContainsMeasures === false)) {
					sGridText = sLastRowText;
				}

				spanCell(iMagicCellGridCol, iMagicCellGridRow, 1, 1, sGridText, "header");
			}
		}

		function spanCell(iGridCol, iGridRow, iGridColspan, iGridRowspan, sGridText, sGridType, sGridDataAttributes) {
			for (var i = iGridRow; i < iGridRow + iGridRowspan; i++) {
				for (var j = iGridCol; j < iGridCol + iGridColspan; j++) {
					aGridColspan[j][i] = -1;
					aGridRowspan[j][i] = -1;
				}
			}

			aGridColspan[iGridCol][iGridRow] = iGridColspan;
			aGridRowspan[iGridCol][iGridRow] = iGridRowspan;
			aGridText[iGridCol][iGridRow] = sGridText;
			aGridType[iGridCol][iGridRow] = sGridType;
			aGridDataAttributes[iGridCol][iGridRow] = sGridDataAttributes;
		}

		function isCellHiddenBySpan(iGridCol, iGridRow) {
			var iGridColspan = aGridColspan[iGridCol][iGridRow];
			if (iGridColspan === -1) {
				return true;
			}
			var iGridRowspan = aGridRowspan[iGridCol][iGridRow];
			if (iGridRowspan === -1) {
				return true;
			}
			return false;
		}

		function getHeaderText(oMember) {
			var sGridText = "";
			var iLevel = oMember.level;
			if (iLevel) {
				var NBSP = "&nbsp;";

				for (var i = 0; i < iLevel; i++) {
					sGridText += NBSP + NBSP;
				}
				
				var sNodeState = oMember.nodeState;

				sGridText += NBSP;
			} 
			return sGridText + oMember.text;
		}

		function applyColumnHeaders1() {
			var OFFSET_COLS = (iNumGridRowTupleElements > 0) ? iNumGridRowTupleElements : 1;

			var iGridRow = 0;
			for (var iColTupleElementIndex = 0; iColTupleElementIndex < iNumColTupleElements; iColTupleElementIndex++) {
				var iDimIndex = iColTupleElementIndex;
				var oRowDim = data1.dimensions[iDimIndex];
				for (var iCol = 0; iCol < iNumDataCols; iCol++) {
					var iGridCol = OFFSET_COLS + iCol;
					if (isCellHiddenBySpan(iGridCol, iGridRow) === false) {
						var iGridColspan = computeColHeaderColspan1(iCol, iColTupleElementIndex);
						var iGridRowspan = computeColHeaderRowspan1(iCol, iColTupleElementIndex);  // includes
																									// attribute
																									// count

						var iMemberIndex = data1.axis_columns[iCol][iDimIndex];
						var oColMember = oRowDim.members[iMemberIndex];
						var sGridText = getHeaderText(oColMember);
						var sGridType = (oColMember.type === "RESULT") ? "header-bold" : "header";
						var sGridDataAttribs = DATA_DIM + iDimIndex + "=" + iMemberIndex;

						spanCell(iGridCol, iGridRow, iGridColspan, iGridRowspan, sGridText, sGridType, sGridDataAttribs);

						if (oColMember.type !== "RESULT") {
							var iNumColAttributeMembers = countAttributeMembers(oColMember);
							if (iNumColAttributeMembers > 0) {
								for (var i = 0; i < iNumColAttributeMembers; i++) {
									sGridText = oColMember.attributeMembers[i].text;
									var iGridRowFull = iGridRow + (1 + i);
									spanCell(iGridCol, iGridRowFull, iGridColspan, iGridRowspan, sGridText, "header", sGridDataAttribs);
								}
							}
						}
						iCol += iGridColspan - 1; // grid colspan is
													// equivalent to model
													// colspan
					}
				}
				iGridRow += 1 + countAttributes(oRowDim);			
			}
		}

		function computeColHeaderColspan1(iCol, iColTupleElementIndex) {
			var iGridColspan = 1;

			var iDimIndex = iColTupleElementIndex;
			var iIndex = data1.axis_columns[iCol][iDimIndex];
			for (var i = iCol + 1; i < data1.axis_columns.length; i++) { 		
				var iNextIndex = data1.axis_columns[i][iDimIndex];
				if (iIndex === iNextIndex) {
					// end colspan if "parent" tuples of next column are not
					// the same
					for (var j = 0; j < iColTupleElementIndex; j++) {
						var iNextDimIndex = j; 
						var iParentIndex = data1.axis_columns[iCol][iNextDimIndex];
						var iParentIndexToCompare = data1.axis_columns[i][iNextDimIndex];
						if (iParentIndex !== iParentIndexToCompare) {
							return iGridColspan;
						}
					}
					iGridColspan++;
				} else {
					break;
				}
			}
			return iGridColspan;
		}

		function computeColHeaderRowspan1(iCol, iColTupleElementIndex) {
			var iGridRowspan = 1;

			var iDimIndex = iColTupleElementIndex;
			var oColDim = data1.dimensions[iDimIndex];
			var oColMember = oColDim.members[data1.axis_columns[iCol][iDimIndex]];

			if (oColMember.type === "RESULT") {
				iGridRowspan += countAttributes(oColDim);

				for (var i = iColTupleElementIndex + 1; i < iNumColTupleElements; i++) {
					var iNextDimIndex = i;
					var oNextColDim = data1.dimensions[iNextDimIndex];
					var oColMemberToCompare = oNextColDim.members[data1.axis_columns[iCol][iNextDimIndex]];
					if (oColMemberToCompare.type === "RESULT") {
						iGridRowspan += 1 + countAttributes(oNextColDim);
					} else {
						break;
					}
				}
			}
			return iGridRowspan;
		}

		function applyRowHeaders1() {
			var DIM_OFFSET = iNumColTupleElements;
			var OFFSET_ROWS = (iNumGridColTupleElements > 0) ? iNumGridColTupleElements : 1;

			var iGridCol = 0;
			for (var iRowTupleElementIndex = 0; iRowTupleElementIndex < iNumRowTupleElements; iRowTupleElementIndex++) {
				var iDimIndex = DIM_OFFSET + iRowTupleElementIndex;
				var oColDim = data1.dimensions[iDimIndex];			
				for (var iRow = 0; iRow < iNumDataRows; iRow++) {
					var iGridRow = OFFSET_ROWS + iRow;
					if (isCellHiddenBySpan(iGridCol, iGridRow) === false) {
						var iGridColspan = computeRowHeaderColspan1(iRowTupleElementIndex, iRow);  // includes
																									// attribute
																									// count
						var iGridRowspan = computeRowHeaderRowspan1(iRowTupleElementIndex, iRow);

						var iMemberIndex = data1.axis_rows[iRow][iDimIndex];
						var oRowMember = oColDim.members[iMemberIndex];
						// var sGridText = getHeaderText(oRowMember);
						var sGridText = oRowMember.key;
						var sGridType = (oRowMember.type === "RESULT") ? "header-bold" : "header";
						var sGridDataAttribs = DATA_DIM + iDimIndex + "=" + iMemberIndex;

						spanCell(iGridCol, iGridRow, iGridColspan, iGridRowspan, sGridText, sGridType, sGridDataAttribs);

						if (oRowMember.type !== "RESULT") {
							var iNumRowAttributeMembers = countAttributeMembers(oRowMember); 
							if (iNumRowAttributeMembers > 0) {
								for (var i = 0; i < iNumRowAttributeMembers; i++) {
									sGridText = oRowMember.attributeMembers[i].text;
									var iGridColFull = iGridCol + (1 + i);
									spanCell(iGridColFull, iGridRow, iGridColspan, iGridRowspan, sGridText, "header", sGridDataAttribs);
								}
							}
						}
						iRow += iGridRowspan - 1;  // grid rowspan is
													// equivalent to data1
													// model rowspan
					}
				}
				iGridCol += 1 + countAttributes(oColDim);
			}
		}	

		function computeRowHeaderColspan1(iRowTupleElementIndex, iRow) {
			var DIM_OFFSET = iNumColTupleElements;

			var iGridColspan = 1;

			var iDimIndex = DIM_OFFSET + iRowTupleElementIndex;
			var oRowDim = data1.dimensions[iDimIndex];
			var oRowMember = oRowDim.members[data1.axis_rows[iRow][iDimIndex]];

			if (oRowMember.type === "RESULT") {
				iGridColspan += countAttributes(oRowDim);

				for (var i = iRowTupleElementIndex + 1; i < iNumRowTupleElements; i++) {
					var iNextDimIndex = DIM_OFFSET + i;
					var oNextRowDim = data1.dimensions[iNextDimIndex];
					var oRowMemberToCompare = oNextRowDim.members[data1.axis_rows[iRow][iNextDimIndex]];
					if (oRowMemberToCompare.type === "RESULT") {
						iGridColspan += 1 + countAttributes(oNextRowDim);
					} else {
						break;
					}
				}
			}
			return iGridColspan;
		}

		function computeRowHeaderRowspan1(iRowTupleElementIndex, iRow) {
			var DIM_OFFSET = iNumColTupleElements;

			var iGridRowspan = 1;

			var iDimIndex = DIM_OFFSET + iRowTupleElementIndex;
			var iIndex = data1.axis_rows[iRow][iDimIndex];
			for (var i = iRow + 1; i < data1.axis_rows.length; i++) {
				var iNextIndex = data1.axis_rows[i][iDimIndex];
				if (iIndex == iNextIndex) {
					// end rowspan if "parent" tuples of next row are not
					// the same
					for (var j = 0; j < iRowTupleElementIndex; j++) {
						var iNextDimIndex = DIM_OFFSET + j;
						var iParentIndex = data1.axis_rows[iRow][iNextDimIndex];
						var iNextParentIndex = data1.axis_rows[i][iNextDimIndex];
						if (iParentIndex !== iNextParentIndex) {
							return iGridRowspan;
						}
					}
					iGridRowspan++;
				} else {
					break;
				}
			}
			return iGridRowspan;
		}

		function applyData1() {
			var OFFSET_COLS = iNumGridRowTupleElements;
			var OFFSET_ROWS = iNumGridColTupleElements;

			var iDataIndex = 0;
			for (var iRow = 0; iRow < iNumDataRows; iRow++) {
				for (var iCol = 0; iCol < iNumDataCols; iCol++) {
					var iGridCol = OFFSET_COLS + iCol;
					var iGridRow = OFFSET_ROWS + iRow;
					var sGridText = data1.formattedData[iDataIndex];
//					var sGridTextTemp = data1.formattedData[iDataIndex];
//					var sGridText = sGridTextTemp.toString().replace(",","");
//					sGridText = sGridText.toString().replace(".","");
//					if(isNaN(sGridText)){
//						sGridText = data1.formattedData[iDataIndex];
//					}
					//var sGridText = data1.dimensions[1].members[iDataIndex].key;
					var sGridType = computeTypeOfData1(iCol, iRow, iDataIndex);
					var sGridDataAttribs = computeDataAttributes1(data1.tuples[iDataIndex]);

					spanCell(iGridCol, iGridRow, 1, 1, sGridText, sGridType, sGridDataAttribs);
					iDataIndex++;
				}
			}
		}

		function computeTypeOfData1(iCol, iRow, iDataIndex) {
			var iExceptionLevel = getExceptionLevel1(iDataIndex);

			if (isResultData1(iCol, iRow)) {
				if (iExceptionLevel > 0) {
					return "data-bold-exception" + iExceptionLevel;
				}
				return (iRow % 2 === 0) ? "data-bold-even" : "data-bold-odd";
			}
			if (iExceptionLevel > 0) {
				return "data-exception" + iExceptionLevel;
			}
			return (iRow % 2 === 0) ? "data-even" : "data-odd";
		}

		function getExceptionLevel1(iDataIndex) {
			if (data1.conditionalFormatValues) {
				var oCondFormat = data1.conditionalFormatValues[iDataIndex];
				if (oCondFormat) {
					var iMaxExceptionLevel = -1;
					for (var sProp in oCondFormat) {
						if (oCondFormat.hasOwnProperty(sProp)) {
							var iExceptionLevel = oCondFormat[sProp];
							if (iExceptionLevel > iMaxExceptionLevel) {
								iMaxExceptionLevel = iExceptionLevel;
							}
						}
					}
					return iMaxExceptionLevel;
				}
			}
			return -1;
		}	

		function computeDataAttributes1(oTuple) {
			var sResult = "";
			for (var i = 0; i < oTuple.length; i++) {
				if (i > 0) {
					sResult += " ";
				}
				// sResult += DATA_DIM + i + "=" + oTuple[i];
				sResult += DATA_DIM + i + "=" + oTuple[i];
			}
			return sResult;
		}

		function isResultData1(iCol, iRow) {
			var oColTuple = data1.axis_columns[iCol];
			for (var i = 0; i < iNumColTupleElements; i++) {
				var oColMember = data1.dimensions[i].members[oColTuple[i]];
				if (oColMember.type === "RESULT") {
					return true;
				}
			}
			var DIM_OFFSET = iNumColTupleElements;
			var oRowTuple = data1.axis_rows[iRow];
			for (var i = 0; i < iNumRowTupleElements; i++) {
				var oRowMember = data1.dimensions[DIM_OFFSET + i].members[oRowTuple[DIM_OFFSET + i]];
				if (oRowMember.type === "RESULT") {
					return true;
				}
			}
			return false;
		}

		function countAttributes(oDimension) {
			if (oDimension.attributes) { 
				return oDimension.attributes.length; 
			}
			return 0;
		}

		function countAttributeMembers(oMember) {
			if (oMember.attributeMembers) { 
				return oMember.attributeMembers.length; 
			}
			return 0;
		}
		

		// property setter/getter functions

		this.data1 = function(value) {
			if (value === undefined) {
				return data1;
			} else {
				data1 = value;
				return this;
			}
		};

    	function appendColumnHeader() {

    		for (var iGridCol = 0; iGridCol < iNumGridCols; iGridCol++) {
    					
    					headers.push(aGridText[iGridCol][0]);
    			}    		
    	}
    	
    	
    	function appendCell1() {
    		var i = 0;
    	    	for(var iGridRow = 1; iGridRow < iNumGridRows; iGridRow++){
    	    		var obj = {};
    	    		for(var h=0; h<headers.length; h++){
    	    			header = headers[h];
    	    			obj[header] = aGridText[h][iGridRow];
    	    			i = i+1;
    	    		}
    	    		dataList.push(obj);
    	    	}
	    		console.log(dataList);
	    		console.log(i);
    	}
    	

		
        function htmlSection(){
        	
            //$(myDiv).html("");
            
            var container = document.createElement('span');
            container.className = "nobr";
            
            var autocomplete = document.createElement('div');
            autocomplete.id = myDiv.id + "autocompleteContainer";
            autocomplete.className = "autocomplete";
            autocomplete.style.width= that._width + "px";
            
            var searchInput = document.createElement('input');
            searchInput.id = myDiv.id + "searchInput";
            searchInput.type = "text";
            searchInput.name = "customSearchBox";
            searchInput.placeholder = that._placeholder;
            
            autocomplete.appendChild(searchInput);
            
            var sendButton = document.createElement('input');
            sendButton.id = myDiv.id + "sendButton";
            sendButton.type = "submit";
            sendButton.value = that._searchText;
            
            container.appendChild(autocomplete);
            container.appendChild(sendButton);
            
//            document.activeElement.append(container);
            myDiv.append(container);
//            document.body.innetHTML = 
//            var pageHtml =  "<div class='autocomplete' style='width:'" + that._width + "px'>" +
//            		"<input id='searchInput' type='text' name='customSearchBox' placeholder='" + that._placeholder + "'>" +
//            		"</div>" +
//            		"<input id='sendButton' type='submit' value='" + that._searchText + "'>" ;
//            $(myDiv).html(pageHtml);
            
            //pageHtml += document.body.innerHTML;
//            document.body.innerHTML = pageHtml;
            console.log("html added");
            document.getElementById (myDiv.id + "sendButton").addEventListener ("click", sendSearchValue, false);
        }

        function sendSearchValue(){
        	that._searchValue = document.getElementById(myDiv.id + "searchInput").value;
        	console.log(that._searchValue);
        	that.firePropertiesChangedAndEvent(["searchValue"], "onClick");
        }
        
        function autocomplete(inp, arr) {
      	  /*the autocomplete function takes two arguments,
      	  the text field element and an array of possible autocompleted values:*/
      	  var currentFocus;
      	  /*execute a function when someone writes in the text field:*/
      	  inp.addEventListener("input", function(e) {
      	      var a, b, i, val = this.value;
      	      /*close any already open lists of autocompleted values*/
      	      closeAllLists();
      	      if (!val) { return false;}
      	      currentFocus = -1;
      	      /*create a DIV element that will contain the items (values):*/
      	      a = document.createElement("DIV");
      	      a.setAttribute("id", this.id + "autocomplete-list");
      	      a.setAttribute("class", "autocomplete-items");
      	      /*append the DIV element as a child of the autocomplete container:*/
      	      this.parentNode.appendChild(a);
      	      /*for each item in the array...*/
      	      for (i = 0; i < arr.length; i++) {
      	    	  for(var k in arr[i]){
	      	        /*check if the item starts with the same letters as the text field value:*/
	      	        if (arr[i][k].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
	      	          /*create a DIV element for each matching element:*/
	      	          b = document.createElement("DIV");
	      	          /*make the matching letters bold:*/
	      	          b.innerHTML = "<strong>" + arr[i][k].substr(0, val.length) + "</strong>";
	      	          b.innerHTML += arr[i][k].substr(val.length);
	      	          /*insert a input field that will hold the current array item's value:*/
	      	          b.innerHTML += "<input type='hidden' value='" + arr[i][k] + "'>";
	      	          /*execute a function when someone clicks on the item value (DIV element):*/
	      	          b.addEventListener("click", function(e) {
	      	              /*insert the value for the autocomplete text field:*/
	      	              inp.value = this.getElementsByTagName("input")[0].value;
	      	              /*close the list of autocompleted values,
	      	              (or any other open lists of autocompleted values:*/
	      	              closeAllLists();
	      	          });
	      	          a.appendChild(b);
	      	        }
      	    	 }
      	      }
      	  });
      	  /*execute a function presses a key on the keyboard:*/
      	  inp.addEventListener("keydown", function(e) {
      	      var x = document.getElementById(this.id + "autocomplete-list");
      	      if (x) x = x.getElementsByTagName("div");
      	      if (e.keyCode == 40) {
      	        /*If the arrow DOWN key is pressed,
      	        increase the currentFocus variable:*/
      	        currentFocus++;
      	        /*and and make the current item more visible:*/
      	        addActive(x);
      	      } else if (e.keyCode == 38) { //up
      	        /*If the arrow UP key is pressed,
      	        decrease the currentFocus variable:*/
      	        currentFocus--;
      	        /*and and make the current item more visible:*/
      	        addActive(x);
      	      } else if (e.keyCode == 13) {
      	        /*If the ENTER key is pressed, prevent the form from being submitted,*/
      	        e.preventDefault();
      	        if (currentFocus > -1) {
      	          /*and simulate a click on the "active" item:*/
      	          if (x) x[currentFocus].click();
      	        }
      	      }
      	  });
      	  function addActive(x) {
      	    /*a function to classify an item as "active":*/
      	    if (!x) return false;
      	    /*start by removing the "active" class on all items:*/
      	    removeActive(x);
      	    if (currentFocus >= x.length) currentFocus = 0;
      	    if (currentFocus < 0) currentFocus = (x.length - 1);
      	    /*add class "autocomplete-active":*/
      	    x[currentFocus].classList.add("autocomplete-active");
      	  }
      	  function removeActive(x) {
      	    /*a function to remove the "active" class from all autocomplete items:*/
      	    for (var i = 0; i < x.length; i++) {
      	      x[i].classList.remove("autocomplete-active");
      	    }
      	  }
      	  function closeAllLists(elmnt) {
      	    /*close all autocomplete lists in the document,
      	    except the one passed as an argument:*/
      	    var x = document.getElementsByClassName("autocomplete-items");
      	    for (var i = 0; i < x.length; i++) {
      	      if (elmnt != x[i] && elmnt != inp) {
      	        x[i].parentNode.removeChild(x[i]);
      	      }
      	    }
      	  }
      	  /*execute a function when someone clicks in the document:*/
      	  document.addEventListener("click", function (e) {
      	      closeAllLists(e.target);
      	  });
      	}
        
        this.searchValue = function(value) {
            if (value === undefined || value == null || value == "") {
                return that._searchValue;
            } else {
            	that._searchValue = value;
                return this;
            }
        };
        
        this.placeholder = function(value) {
            if (value === undefined || value == null || value == "") {
                return that._placeholder;
            } else {
            	that._placeholder = value;
                return this;
            }
        };
        
        this.searchText = function(value) {
            if (value === undefined || value == null || value == "") {
                return that._searchText;
            } else {
            	that._searchText = value;
                return this;
            }
        };
        
        this.width = function(value) {
            if (value === undefined || value == null || value == "") {
                return that._width;
            } else {
            	that._width = value;
                return this;
            }
        };
      	
    });
});
