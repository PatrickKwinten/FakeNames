/*	functions:				initTools			initBrowserSniffer			checkOpener			openDialog						lyrCreate			lyrCreateAbsFromRel			lyrGetById			lyrGetPosAbs			lyrSetBgColor			lyrSetPos			lyrShow			lyrWriteLabel			cboxGetCheckedValues			cboxSetCheckedFromArray			lboxCreateFromArray			lboxDeselectAll			lboxGetAllItems			lboxGetAllItemsText			lboxGetIndexByValue			lboxGetSelectedItem			lboxGetSelectedItems			lboxGetSelectedValue			lboxSelectByValue			lboxRemoveAll			lboxRemoveAllSelected			lboxRemoveSelectedEntry			arrJoin			arrMakeUnique			arrRemoveEntryByIndex							sort2DArrayNoCaseOn0			sort2DArrayNoCaseOn1			strUrlParam			strEscapeParam			strPrintf			strEscapeFT			class: cDlgListbox						syncFields*/var sMsgParentIsClosed	= 'The parent window is no longer available, the current dialog will close.'var sMsgParentHasChanged	= 'The content in the parent window has changed, the current dialog will close.'var sMsgOtherDlgIsOpen	= 'Another dialogbox is still open.'// global object handles, mainly used for callbacksvar aObj	= []var iObj	= 0// ------------------------------------------ BROWSER SNIFFER  -------------------------------------var isLoaded = nullfunction initTools() {	// this function should be called, when the tools are being used	// Netscape <= 4 does not fire the onload event of the body if there are applets in the	// form which are not in the visible view to the user when a web page is loaded (like action bar)		if (window.isLoaded) return		initBrowserSniffer()		window.isLoaded = true}function initBrowserSniffer() {	var sAgent	= navigator.userAgent.toLowerCase()	var iMajor 	= parseInt(navigator.appVersion)		window.isX	= (sAgent.indexOf('x11') >= 0)	window.isMAC	= (sAgent.indexOf('mac') >= 0)	window.isWIN	= (sAgent.indexOf('win') >= 0)	window.isSUSE	= (sAgent.indexOf('suse') >= 0)	window.isUnknownLinuxPlatform = !isMAC & !isWIN & !isSUSE & isX	window.isNN	= ((sAgent.indexOf('mozilla')!=-1)		&& (sAgent.indexOf('spoofer')==-1)				&& (sAgent.indexOf('compatible') == -1) && (sAgent.indexOf('opera')==-1)				&& (sAgent.indexOf('webtv')==-1)		&& (sAgent.indexOf('hotjava')==-1));	window.isNN4	= (isNN && (iMajor == 4))	window.isNN4X	= isNN4 && isX	window.isNN4W	= isNN4 && isWIN	window.isIE	= document.all				? true : false	window.isDOM	= document.getElementById	? true : false		window.isNN6X  = isNN && !isNN4 && isX}initTools()// ------------------------------------ DIALOGBOX ----------------------------------------------// facility to close dialogboxes automatically and to check if opener is still availablevar iWinRef		= (new Date()).getTime()var iWinRefOpener	= window.opener ? window.opener.iWinRef : nullvar hWinDlg		= null// register in opener window if (window.opener) {	window.opener.hWinDlg = window}function dlgAutoClose() {	// normally called in the onunload event in an opener window 	// to close dialog boxes if they are still open		if (hWinDlg) {		if (!hWinDlg.closed) {			hWinDlg.close()		}	}}function dlgIsOpen() {	// this function is called to check if a dialogbox is still open		if (window.hWinDlg) {			if (!window.hWinDlg.closed) {			alert(sMsgOtherDlgIsOpen)			window.hWinDlg.focus()			return true		}	}		return false}function dlgCheckOpener() {	// this function is called within a dialogbox to check if the opener window is still available		if (window.opener) {		// check if opener is still available		if (window.opener.closed) {			alert(window.sMsgParentIsClosed)			window.close()			return		}				// check if opener has the original content		if (window.opener.iWinRef != iWinRefOpener) {			alert(window.sMsgParentHasChanged)			window.close()		}	}	}function dlgOpen(sUrl, iWidth, iHeight, optIsScroll) {	// opens a dialog window, centered in the screen	// returns the handle to the window			var iXOffset = screen.width - screen.availWidth	var iYOffset = screen.height - screen.availHeight		var iTop	= (screen.availHeight - iHeight) / 2 - iYOffset	var iLeft	= iXOffset + (screen.availWidth - iWidth) / 2	var sScroll	= ',scrollbars=' + (optIsScroll == true ? '1' : '0')	var sWinSize = (isIE) ?				',top='		+ iTop +		',left='		+ iLeft +		',width='		+ iWidth +		',height='	+ iHeight	:		',screenY='	+ iTop +		',screenX='	+ iLeft +		',width='		+ iWidth +		',height='	+ iHeight	return window.open(sUrl, (new Date()).getTime(), 'status=no' + sScroll + sWinSize)}// ----------------------------------------------- LAYER --------------------------------------------/*  this a hack for NN4 to create a new layer at the same position as the original layer  this is a workaround for a crash in NS when layers are in a table and a open/write/close is done*//*  create a layer*/function lyrCreate(hParent, hDocument) {	// hDocument is required for DOM		if (isDOM) {		var hLyr = hParent.appendChild(hDocument.createElement('span'))		hLyr.style.position 	= 'absolute'		hLyr.style.top			= '0px'		hLyr.style.left		= '0px'				return hLyr	} else {		return new Layer(0, hParent)	}}function lyrCreateAbsFromRel(hFromLayer) {	// NN4 only		hNewLayer =  new Layer(0, hFromLayer.window)		hNewLayer.top	= hFromLayer.pageY	hNewLayer.left	= hFromLayer.pageX	return hNewLayer}/*	returns the handle to a layer which is identified by its id*/function lyrGetById(hDocument, sLayerName) {	if (hDocument == null) {		alert('Internal error in lyrGetById: hDocument is null, id="' + sLayerName + '"')	}		var hLyr	if (isDOM) {		hLyr = hDocument.getElementById(sLayerName)	} else {		hLyr = hDocument.layers[sLayerName]	}	if (hLyr == null) {		alert('Internal error in lyrGetById: Layer not found, id="' + sLayerName + '"')	}		return hLyr}/*	set the position of one layer from the position of another layer*/function lyrGetPosAbs(hLayer) {	if (isDOM) {		return {			top:		domOffsetAbs(hLayer).top,			left:	domOffsetAbs(hLayer).left		}	} else {		return {			top:		hLayer.pageY, 			left:	hLayer.pageX		}	}}/*	set background color of a layer*/function lyrSetBgColor(hLyr, sColor) {	if (isDOM) {		hLyr.style.backgroundColor = sColor	} else {		if (sColor == '') sColor = null		hLyr.bgColor = sColor	}}/*	set the position of a layer*/function lyrSetPos(hLyr, iTop, iLeft) {	if (isDOM) {		hLyr.style.top		= iTop		hLyr.style.left	= iLeft	} else {		hLyr.top	= iTop		hLyr.left	= iLeft	}}/*	show/hide a layer*/function lyrShow(hLayer, isVisible) {	if (isDOM) {		hLayer.style.visibility	= isVisible ? 'inherit' : 'hidden'	} else {		hLayer.visibility		= isVisible ? 'inherit' : 'hidden'	}}function lyrWriteLabel(hLayer, sLabel, sWidth) {	// Netscape 4.x: hLayer MUST NOT be in a table cell, it would CRASH the browser	if (isDOM) {		hLayer.innerHTML = sLabel			} else {			var tagwidth = ""		if(sWidth == "" ? tagwidth = "" : tagwidth = "width='" + sWidth + "'")		var hDoc = hLayer.document				hDoc.close()		hDoc.open("text/html","replace")		hDoc.write("<span><table " + tagwidth + " cellspacing=0 cellpadding=0 border=0><tr><td>" + sLabel + "</td></tr></table></span>")		hDoc.close()		hLayer.visibility = 'inherit'	}}// ----------------------------------------------- CHECKBOX  --------------------------------------function cboxGetCheckedValues(hChkBox) {	// return an array with the values of all checked checkboxes		var aReturn = []		if (hChkBox.length) {			// loop: all checkbox elements		for (var iChkIdx = 0; iChkIdx < hChkBox.length; iChkIdx++) {			if (hChkBox[iChkIdx].checked) {				aReturn[aReturn.length] = hChkBox[iChkIdx].value			}		}	} else {		// TBD if needed	}		return aReturn}function cboxSetCheckedFromArray(hChkBox, aValues) {	// set all checkboxes to checked, if their value is in aValues	if (hChkBox.length) {		// multiple checkboxes are available				// loop: all checkbox elements		for (var iChkIdx = 0; iChkIdx < hChkBox.length; iChkIdx++) {					var hChk = hChkBox[iChkIdx]					hChk.checked = false						for (var iValIdx = 0; iValIdx < aValues.length; iValIdx++) {							if (aValues[iValIdx] == hChk.value) {					hChk.checked = true				}			}					}			} else {		// TBD if needed		}}// ----------------------------------------------- LISTBOX  --------------------------------------/*	create a listbox from a one or two dimensional array*/function lboxCreateFromArray(hListbox, hArray, isDelEntries, sDefaultSelected) {	if (isDelEntries) {		hListbox.options.length = 0			// delete old entries	}	var iLBoxOffset = hListbox.options.length		if (hArray) {			// create the listbox		// check if this a one or two dimensional array		var is2D = (typeof hArray[0] == 'object')				for (var iIdx = 0; iIdx < hArray.length; iIdx++) {			var isSelected = (hArray[iIdx][1] == sDefaultSelected)			var hOption	= new Option(is2D ? hArray[iIdx][0] : hArray[iIdx], 								   is2D ? hArray[iIdx][1] : hArray[iIdx], 								   isSelected)						hListbox.options[iIdx + iLBoxOffset] = hOption						}				// select the first entry in the listbox		if (hArray.length > 0 && sDefaultSelected == 0) {			hListbox.options[0].selected = true		}	}}/*  deselects all entries in a listbox*/function lboxDeselectAll(hListbox) {	for (var iX = 0; iX < hListbox.length; iX++) {		hListbox[iX].selected = false	}}/*  return all items in a listbox in a two dimensional array*/function lboxGetAllItems(hListbox) {	var aReturn = []		for (var iX = 0; iX < hListbox.length; iX++) {		aReturn[aReturn.length] = [hListbox.options[iX].text, hListbox.options[iX].value]	}		return aReturn}function lboxGetAllItemsText(hListbox) {	// return text of all items in a listbox		var aReturn = []		for (var iX = 0; iX < hListbox.length; iX++) {		aReturn[aReturn.length] = hListbox.options[iX].text	}		return aReturn}function lboxGetAllItemsValue(hListbox) {	// return value of all items in a listbox	var aReturn = []		for (var iX = 0; iX < hListbox.length; iX++) {		aReturn[aReturn.length] = hListbox.options[iX].value	}		return aReturn}/*	lookup the text value in a listbox and return the index*/function lboxGetIndexByText(hListbox, sEntryValue) {	// return 	index of sEntryValue in the hListbox 	// 			-1 if not found		// loop: all entries in the listbox	for (var iIdx=0; iIdx < hListbox.options.length; iIdx++) {		if (hListbox.options[iIdx].text == sEntryValue) {			return iIdx		}	}		return -1}/*	lookup a value in a listbox and return the index*/function lboxGetIndexByValue(hListbox, sEntryValue) {	// return 	index of sEntryValue in the hListbox 	// 			-1 if not found		// loop: all entries in the listbox	for (var iIdx=0; iIdx < hListbox.options.length; iIdx++) {		if (hListbox.options[iIdx].value == sEntryValue) {			return iIdx		}	}		return -1}/*	return the selected item in a listbox*/function lboxGetSelectedItem(hListbox) {	return hListbox.options[hListbox.selectedIndex]}/*  returns an array of all selected items in a listbox*/function lboxGetSelectedItems(hListbox) {	// add all selected to the return array		var aReturn = []		for (var iX = 0; iX < hListbox.length; iX++) {			if (hListbox.options[iX].selected) {			aReturn[aReturn.length] = [hListbox.options[iX].text, hListbox.options[iX].value]		}	}		return aReturn}/*  returns an array with only the text of all selected items in a listbox*/function lboxGetSelectedItemsText(hListbox) {		var aReturn = []		for (var iX = 0; iX < hListbox.length; iX++) {			if (hListbox.options[iX].selected) {			aReturn[aReturn.length] = hListbox.options[iX].text		}	}		return aReturn}/*  returns an array with only the text of all selected items in a listbox*/function lboxGetSelectedItemsValue(hListbox) {		var aReturn = []		for (var iX = 0; iX < hListbox.length; iX++) {			if (hListbox.options[iX].selected) {			aReturn[aReturn.length] = hListbox.options[iX].value		}	}		return aReturn}/*	return the selected entry value from a listbox*/function lboxGetSelectedText(hListbox) {	if (hListbox.selectedIndex == -1) {		return null	} else {		return hListbox.options[hListbox.selectedIndex].text	}}/*	return the selected entry value in a listbox*/function lboxGetSelectedValue(hListbox) {	if (hListbox.selectedIndex == -1) {		return null	} else {		return hListbox.options[hListbox.selectedIndex].value	}}/*	select a listbox entry by text, add the item if it was not found in the list*/function lboxSelectByText(hListbox, sText, sAddItemValue) {	var iIdx = lboxGetIndexByText(hListbox, sText)		if (iIdx > -1) {			hListbox.options[iIdx].selected = true			} else {		// entry was not found, add it to the list if it was provided and select it		if (sAddItemValue) {					hListbox.options[hListbox.options.length] = new Option(sText, sAddItemValue)			hListbox.options[hListbox.options.length -1].selected = true		}	}		return iIdx}/*	select a listbox entry by value, add the item sAddItemText if it was not found in the list		return index of the selected entry, -1 if sValue was not in the listbox*/function lboxSelectByValue(hListbox, sValue, sAddItemText) {	var iIdx = lboxGetIndexByValue(hListbox, sValue)		if (iIdx > -1) {		hListbox.options[iIdx].selected = true	} else {		// entry was not found, add it to the list if it was provided and select it		if (sAddItemText) {					hListbox.options[hListbox.options.length] = new Option(sAddItemText, sValue)			hListbox.options[hListbox.options.length -1].selected = true		}	}		return iIdx}	/*	removes all entries in a listbox*/function lboxRemoveAll(hListbox) {	hListbox.options.length = 0}/*	removes the selected entries in a listbox*/function lboxRemoveAllSelected(hListbox) {	var iLength = hListbox.length		for (var iX = (iLength - 1); iX > -1; iX--) {		if (hListbox.options[iX].selected) {			hListbox.options[iX] = null		}	}}/*	remove currently selected entry*/function lboxRemoveSelectedEntry(hListbox, isSelectNext) {	var iLastIdx = hListbox.selectedIndex		// do nothing if nothing is selected	if (iLastIdx == -1) {		return -1	}	hListbox[iLastIdx] = null		// select next entry if flag is set	if (isSelectNext) {			// do nothing if listbox is empty		if (hListbox.options.length == 0) {			return -1		}				var iIdxNext = (iLastIdx == hListbox.options.length ? iLastIdx - 1 : iLastIdx)				hListbox[iIdxNext].selected = true		return iIdxNext	}		return -1}// ----------------------------------------- ARRAY ----------------------------------------function arrJoin(hArray, sSeparator, iDimension) {	// join array but only one dimension	var sReturn = ''		for (var iIdx = 0; iIdx < hArray.length; iIdx++) {			sReturn += (iIdx == 0 ? '' : sSeparator) + hArray[iIdx][iDimension]	}		return sReturn}/*  removes all duplicate elements from an array, key is the first element in an array  returns the new array*/function arrMakeUnique(aFirst, aSecond, isSort) {	var aTemp		= []	var aReturn	= []	// check if this a one or two dimensional array	var is2D = (typeof aFirst[0] == 'object')		for (var iX = 0; iX < aFirst.length; iX++) {		var hEntry = aFirst[iX]				if (is2D) {			aTemp[hEntry[0]] = hEntry		} else {			aTemp[hEntry] = hEntry				}	}	for (var iX = 0; iX < aSecond.length; iX++) {		var hEntry = aSecond[iX]		if (is2D) {			aTemp[hEntry[0]] = hEntry		} else {			aTemp[hEntry] = hEntry				}	}			for (var sKey in aTemp) {		aReturn[aReturn.length] = aTemp[sKey]	}		if (isSort == false) {		return aReturn	} else if (is2D) {		return aReturn.sort(sort2DArrayNoCaseOn0)	} else {		return aReturn.sort(sortArrayNoCase)	}		}function arrRemoveEntryByIndex(hArray, iPos) {	// removes one entry from an array	var aNew = hArray.slice(0, iPos);		for (var iOld = iPos + 1; iOld < hArray.length; iOld++) {			aNew[aNew.length] = hArray[iOld];	}		return aNew;}		// ------------------------------------------- SORTING ---------------------------------------function sortArrayNoCase(a, b) {	// sort callback which ignores case		var aUp = a.toUpperCase()	var bUp = b.toUpperCase()		if (aUp < bUp) return -1	if (aUp > bUp) return 1	return 0}/*  sort callback function for a 2 dimensional array, sorts on the first dimension*/function sort2DArrayNoCaseOn0(a, b) {	var aUp = a[0].toUpperCase()	var bUp = b[0].toUpperCase()		if (aUp < bUp) return -1	if (aUp > bUp) return 1	return 0}/*  sort callback function for a 2 dimensional array, sorts on the second dimension*/function sort2DArrayNoCaseOn1(a, b) {	var aUp = a[1].toUpperCase()	var bUp = b[1].toUpperCase()		if (aUp < bUp) return -1	if (aUp > bUp) return 1	return 0}// ------------------------------------------ STRING -----------------------------function strUrlParam(sUrl, sParam) {	// extract a url parameter from an href		var sParam	= sParam.toUpperCase()	var aUrl		= sUrl.split('&')		for (var iIdx = 0; iIdx < aUrl.length; iIdx++) {			if ((aUrl[iIdx].toUpperCase()).indexOf(sParam) > -1) {			var aParam = aUrl[iIdx].split('=')			return aParam[1] == null ? '' : aParam[1]		}	}		return ''}function strEscapeParam(sParam) {	return(escape(strEscapePassthrough(sParam)))}function strEscapePassthrough(sParam) {	// $n are reserved words in regular expressions, so we do a roundtrip with ~~	sParam = sParam.replace(/&/,	'~~1')	sParam = sParam.replace(/~~/,	'$')	sParam = sParam.replace(/=/,	'~~2')	sParam = sParam.replace(/~~/,	'$')		return(sParam)}function strEscapeFT(sQuery) {	var aResWords	= ['field', 'contain', 'topic', 'not', 'sentence', 'near', 'paragraph', 'accrue']	var aEscWords	= ['f?eld', 'c?ntain', 't?pic', 'n?t', 's?ntence', 'n?ar', 'p?ragraph', 'a?crue']				for(var iWord = 0; iWord < aResWords.length; iWord++) {		var re = new RegExp(aResWords[iWord] + '\\b', 'i')		sQuery = sQuery.replace(re, aEscWords[iWord])	}		return escape(sQuery)}function strPrintf() {	// usage:		strPrintf("Trust in %s2, but lock your %s1.", "car", "god")	// output:	"Trust in god, but lock your car."	var insert	= ''	var source	= strPrintf.arguments[0]	for (i = 1; i < strPrintf.arguments.length; i++) {		insert	= strPrintf.arguments[i]		source	= source.replace('%s' + i, insert)	}	return source}function strTrim(sSource) {	// remove leading and trailing blanks from a string		var sSubStr		// remove leading blanks	for (var iIdx = 0; iIdx < sSource.length; iIdx++) {		if (sSource.substr(iIdx, 1) != ' ') break	}		sSubStr = sSource.substring(iIdx, sSource.length)			// remove trailing blanks	for (iIdx = sSubStr.length; iIdx > 0; iIdx--) {		if (sSubStr.substr(iIdx-1, 1) != ' ') break	}		return (sSubStr.substring(0, iIdx))}// --------------------------------------- LISTBOX DIALOG ---------------------------function cDlgListbox(sType) {	this.sUID				= 'sObjUID' + (window.iObj++)	this.sObject 			= 'window.aObj.' + this.sUID	window.aObj[this.sUID]	= this	this.sType			= sType	this.sWinCaption		= null		this.iDestMinEntries	= 0		// minimum entries for destination	this.isDestSort		= true	this.isCommaDelimiter	= false	this.sCommaDelimiter	= ', '	this.sSrcListRows		= '15'		this.hDlgOpened		= null	// set from opened dialog object		if (this.sType == 'Single') {			this.iWidth		= 250		this.iHeight		= (window.isNN4X ? 390 : 290)		this.sUrl			= sWebDbName + 'WebDlgListboxSingle?OpenForm'		this.isDestInput	= true	} else if (this.sType == 'Multi') {			this.iWidth		= 620		this.iHeight		= (window.isNN4X ? 390 : 320)		this.sUrl			= sWebDbName + 'WebDlgListboxMulti?OpenForm'		this.isDestTxArea	= true		} else if (this.sType == 'AddressSingle') {			this.iWidth		= 345		this.iHeight		= (window.isNN4X ? 480 : window.isMAC ? 400 : 410)		this.sUrl			= sWebDbName + 'WebDlgAddressSingle?OpenForm'		this.isDestInput	= true			} else if (this.sType == 'AddressMulti') {			this.iWidth		= 640		this.iHeight		= (window.isNN4X ? 480 : window.isMAC ? 420 : 400)		this.sUrl			= sWebDbName + 'WebDlgAddressMulti?OpenForm'		this.isDestTxArea	= true	} else {		alert('internal error: unknown dialogbox type')	}}cDlgListbox.prototype.dlOpen = function() {	// open dialog box window		if (dlgIsOpen()) return		this.sUrl += '&DlgOpenerRef=' + this.sObject +			   (this.sWinCaption ? '&WindowCaption=' + escape(this.sWinCaption) : '') +			   '&SrcListRows=' + this.sSrcListRows		dlgOpen(this.sUrl, this.iWidth, this.iHeight)}cDlgListbox.prototype.dlSaveDestination = function(hNewDest) {	// save new data into destination field		if (this.isDestTxArea) {		var sDelimiter	= this.isCommaDelimiter ? this.sCommaDelimiter : '\n'		this.hDestField.value = hNewDest.join(sDelimiter)					} else if (this.isDestInput) {		this.hDestField.value = hNewDest == null ? '' : hNewDest	}}// --------------------------------------- MISC ----------------------------------------------function syncFields(hForm, sFieldName) {	// sync textarea field with text field, both have the same name	var hField = hForm.elements[sFieldName]	if (hField && hField.length) {		hField[1].value = hField[0].value;	}		return true}/*	return absolute x,y coordinates of an element*/function domOffsetAbs(hElement) {	var top	= 0	var left	= 0		do {		top	+= hElement.offsetTop		left	+= hElement.offsetLeft	}	while ((hElement = hElement.offsetParent))		return {top: top, left: left}}// -------------------------------------- COMMON in all Forms -------------------------------var hDlgAddrSingle		= new cDlgListbox('AddressSingle')var hDlgAddrMulti		= new cDlgListbox('AddressMulti')// automatically close all open dialogboxesonunload = dlgAutoClose