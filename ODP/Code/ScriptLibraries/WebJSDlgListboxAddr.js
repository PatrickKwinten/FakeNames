/*	application logic for address dialog (single/multi)*/var sMsgOneDestIsReq	= 'You must choose at least one %s1'var sMsgNotSelected		= 'A %s1 is not selected'var hDlg		= null					// dialogbox object// reference to opener dialog box objectvar sDlgCtx	= strUrlParam(window.location.href, 'DlgOpenerRef')var hDlgCtx	= eval('window.opener.' + sDlgCtx)	function onLoadBody(sMode) {	// called in the onload event of the dialogbox	initTools()		hDlg = new cListbox(sMode)}function cListbox(sMode) {	this.sUID		= 'sObjUID' + (window.iObj++)	this.sObject 	= 'window.aObj.' + this.sUID	window.aObj[this.sUID] = this		this.isMulti				= sMode == 'multi'	this.aImgIcon				= []	this.sDefaultIcon			= 'vwIconTransparent.gif?OpenImageresource'		// search parameter	this.sSearchKey			= ''	this.isSearch				= false	this.iMaxResult			= isNN4X ? 18: 21		// these vars are set in the agent wReadAddressData	this.iSearchKeyFound		= 0		// 1 if search by key was successful	this.sFirstEntryPos			= ''		// view navigation position 	this.sLastEntryPos			= ''		// get dialog elements	var hForm = document.forms[0]		this.hLboxSrc		= hForm['selListSrc']	this.hInpNewEntry	= hForm['inpNewEntry']	this.hInpSearch	= hForm['inpSearch']	// get browser specific handles	if (isNN4) {		this.hLyrInfo	= lyrCreateAbsFromRel(lyrGetById(document, 'lyrNameInfo'));	} else {		this.hLyrInfo	= lyrGetById(document, 'lyrNameInfo')	}		// setup destination listbox	if (this.isMulti) {		this.hLboxDest		= hForm['selListDest']				var aDest = []		if (window.hDlgCtx.isDestLbox) {			// destination in opener is a listbox			aDest = lboxGetAllItemsText(window.hDlgCtx.hDestField)					} else if (window.hDlgCtx.isDestTxArea) {			// destination in opener is a textarea			var sDest = window.hDlgCtx.hDestField.value			if (sDest == '') {				aDest	= []			} else {				var reDelimiter	= window.hDlgCtx.isCommaDelimiter ? 										window.hDlgCtx.sCommaDelimiter :										/\r\n|\r|\n/g				aDest	= sDest.split(reDelimiter)			}		}		lboxCreateFromArray(this.hLboxDest, aDest, true)	}		this.initIcons()		// load initial address data	this.hTransfer = new cTransfer(window, 'get')	this.hTransfer.transEventOnLoad = this.sObject + '.onDataLoaded'			var sUrl = sWebDbName +	"wReadAddressData?OpenAgent"	+							"&NaviType=Pos"		+							"&Count=" 			+ this.iMaxResult.toString()	this.hTransfer.transGetData(sUrl)}cListbox.prototype.onDataLoaded = function(hWinData) {	dlgCheckOpener()		// attach loaded data - this.aDirList will be set	this.getData = hWinData.getData	this.getData()			// show source listbox and icons	lboxCreateFromArray(this.hLboxSrc, this.aDirList, true)	this.showIcons()		// set focus to search field	this.hInpSearch.focus()	this.hInpSearch.select()}cListbox.prototype.initIcons = function() {	var iIconCount	= isNN4X ? 19 : 21		// number of listbox entries		var aLyrIcon	= []			var hLyrIconBegin	= lyrGetById(document, 'lyrIconBegin')		var iTop 		= lyrGetPosAbs(hLyrIconBegin).top + (isNN4X ? 6 : 0)+ (isNN6X ? 2 : 0) + (isUnknownLinuxPlatform ? 3 : 0)	var iDiffY	= (isNN4X || isNN6X) && isSUSE ? 17 : (isUnknownLinuxPlatform ? 20 : 13)		// create and position layer for every icon	for (var iIcon = 0; iIcon < iIconCount; iIcon++) {		var hLyr = lyrCreate(isDOM ? window.document.body : window, document)		lyrSetPos(hLyr, iTop + 3 + iIcon * iDiffY, 11)				var sIcon = 'imgIcon' + iIcon.toString()				var sHTML = ''				sHTML += '<table width=15 cellspacing=0 cellpadding=0 border=0>\n'		sHTML += '<tr><td>'		sHTML += '<img id="' + sIcon + '" src="' + this.sDefaultIcon + '" border="0" height="11" width="13" alt="">'		sHTML += '</td></tr>'		sHTML += '</table>'				if (isDOM) {			hLyr.innerHTML = sHTML			var hImg = document.getElementById(sIcon)		} else {			var hDoc = hLyr.document						hDoc.open('text/html', 'replace')			hDoc.write(sHTML)			hDoc.close()				hLyr.visibility = 'inherit'						var hImg = hLyr.document.images[0]			}				this.aImgIcon[this.aImgIcon.length] = hImg	}}cListbox.prototype.showIcons = function() {	this.aIconList	// show icons for all available list entries	for (var iIcon = 0; iIcon < this.aIconList.length; iIcon++) {			var sIcon = '000' + this.aIconList[iIcon].toString()		sIcon = sIcon.substr(sIcon.length -3 , 3)				this.aImgIcon[iIcon].src = '/icons/vwicn' + sIcon + '.gif'	}		// set default icon for empty list entries	for (; iIcon < this.aImgIcon.length; iIcon++) {		this.aImgIcon[iIcon].src = this.sDefaultIcon	}}// ------------------------------------------ EVENTS ----------------------------------cListbox.prototype.onClickAdd = function() {	// called when clicked on the add button (multi mode)		dlgCheckOpener()	if (this.hInpNewEntry.value != '') {		// get entry from new entry field		var aSelected = []		aSelected[0] = this.hInpNewEntry.value				this.hInpNewEntry.value = ''			} else {		// get entry from source listbox		var aSelected	= lboxGetSelectedItemsValue(this.hLboxSrc)			if (aSelected.length == 0) {			alert(strPrintf(sMsgNotSelected, window.hDlgCtx.sMsgOneEntry))			return		}	}			// put new entries into destination listbox	var aNewDest	= arrMakeUnique(lboxGetAllItemsText(this.hLboxDest), aSelected,							 window.hDlgCtx.isDestSort)							 	lboxCreateFromArray(this.hLboxDest, aNewDest, true)		// deselect source	lboxDeselectAll(this.hLboxSrc)}cListbox.prototype.onClickRemove = function() {	// called when clicked on the remove button (multi mode)		dlgCheckOpener()	var aDest = lboxGetSelectedItems(this.hLboxDest)		if (aDest.length == 0) {		alert(strPrintf(sMsgNotSelected, window.hDlgCtx.sMsgOneEntry))		return	}		lboxRemoveAllSelected(this.hLboxDest)}cListbox.prototype.onClickRemoveAll = function() {	// called when clicked on the remove all button (multi mode)			dlgCheckOpener()	lboxRemoveAll(this.hLboxDest)}cListbox.prototype.onClickOK = function() {	// called when clicked on the OK button			dlgCheckOpener()	if (this.isMulti) {			var aDest = lboxGetAllItemsText(this.hLboxDest)			// check if required entries are set		if (aDest.length < window.hDlgCtx.iDestMinEntries) {			alert(strPrintf(sMsgOneDestIsReq, window.hDlgCtx.sMsgOneEntry))			return		}	} else {		var aDest = lboxGetSelectedValue(this.hLboxSrc)	}	// write data back into field in opener window	window.hDlgCtx.dlSaveDestination(aDest)		window.close()}cListbox.prototype.onClickNavigate = function(sDirection) {	// called when clicked on up/down button		this.isSearch = false		var sPos = sDirection == 'Begin' ? this.sFirstEntryPos : this.sLastEntryPos		var sUrl = sWebDbName +	"wReadAddressData?OpenAgent"	+							"&NaviType=Pos"		+							"&NaviDirection="		+ sDirection +							"&NaviPos="			+ sPos +							"&Count=" 			+ this.iMaxResult.toString()	this.hTransfer.transGetData(sUrl)}cListbox.prototype.onClickSearch = function() {	// called when clicked on the search button		this.isSearch		= true	this.sSearchKey	= this.hInpSearch.value		var sUrl = sWebDbName +	"wReadAddressData?OpenAgent"	+							"&NaviType=Key"		+							"&NaviKey="			+ this.sSearchKey +							"&Count=" 			+ this.iMaxResult.toString()	this.hTransfer.transGetData(sUrl)}cListbox.prototype.onChangeName = function() {	var sLabel = lboxGetSelectedValue(this.hLboxSrc)		lyrWriteLabel(this.hLyrInfo, sLabel || '', 300)}