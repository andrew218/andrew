function getContractAmount(){
	var val1= getValue(document.getElementById('addOrderInfo_guid_report1_wxcol_contract_amount'));
	var val2= getValue(document.getElementById('addOrderInfo_guid_report1_wxcol_fee_rate'));
	
	getexpect_comm(val1,val2,'addOrderInfo_guid_report1_wxcol_expect_comm');
	return val1;
}

function getContractAmountOther(){
	var val1= getValue(document.getElementById('addOrderInfo_guid_report2_wxcol_contract_amount'));
	var val2= getValue(document.getElementById('addOrderInfo_guid_report2_wxcol_fee_rate'));
	
	getexpect_comm(val1,val2,'addOrderInfo_guid_report2_wxcol_expect_comm');
	return val1;
}

function getFeeRate(){
	var val1= getValue(document.getElementById('addOrderInfo_guid_report1_wxcol_contract_amount'));
	var val2= getValue(document.getElementById('addOrderInfo_guid_report1_wxcol_fee_rate'));
	
	getexpect_comm(val1,val2,'addOrderInfo_guid_report1_wxcol_expect_comm');
	return val2;
}

function getFeeRateOther(){
	var val1= getValue(document.getElementById('addOrderInfo_guid_report2_wxcol_contract_amount'));
	var val2= getValue(document.getElementById('addOrderInfo_guid_report2_wxcol_fee_rate'));
	
	getexpect_comm(val1,val2,'addOrderInfo_guid_report2_wxcol_expect_comm');
	return val2;
}

function getexpect_comm(val1,val2,id){
	var feeRate = val1*val2/100;
	feeRate = feeRate.toFixed(2);
	document.getElementById(id).value = feeRate;
}

function getastimate_money(value){
	var obj = value.firstChild;
	getFeeCount();
	return getValue(obj);
}

function getFORE_MONEY(value){
	var obj = value.firstChild;
	getFeeCount();
	return getValue(obj);
}
function getNOTARY_MONEY(value){
	var obj = value.firstChild;
	getFeeCount();
	return getValue(obj);
}
function getENTRYEAY_MONEY(value){
	var obj = value.firstChild;
	getFeeCount();
	return getValue(obj);
}
function getMATERIAL_MONEY(value){
	var obj = value.firstChild;
	getFeeCount();
	return getValue(obj);
}
function getBRUSH_CARD_MONEY(value){
	var obj = value.firstChild;
	getFeeCount();
	return getValue(obj);
}
function getPLEDGE_MONEY(value){
	var obj = value.firstChild;
	getFeeCount();
	return getValue(obj);
}
function getOTHER_MONEY(value){
	var obj = value.firstChild;
	getFeeCount();
	return getValue(obj);
}

function getFeeCount(){
	var astimate_money= getValue(document.getElementById('showOrderList_guid_report2_wxcol_ASTIMATE_MONEY'));
	var FORE_MONEY= getValue(document.getElementById('showOrderList_guid_report2_wxcol_FORE_MONEY'));
	var NOTARY_MONEY= getValue(document.getElementById('showOrderList_guid_report2_wxcol_NOTARY_MONEY'));
	var ENTRYEAY_MONEY= getValue(document.getElementById('showOrderList_guid_report2_wxcol_ENTRYEAY_MONEY'));
	var MATERIAL_MONEY= getValue(document.getElementById('showOrderList_guid_report2_wxcol_MATERIAL_MONEY'));
	var BRUSH_CARD_MONEY= getValue(document.getElementById('showOrderList_guid_report2_wxcol_BRUSH_CARD_MONEY'));
	var PLEDGE_MONEY= getValue(document.getElementById('showOrderList_guid_report2_wxcol_PLEDGE_MONEY'));
	var OTHER_MONEY= getValue(document.getElementById('showOrderList_guid_report2_wxcol_OTHER_MONEY'));
	var feeCount = Number(astimate_money)+Number(FORE_MONEY)+Number(ENTRYEAY_MONEY)+Number(MATERIAL_MONEY)+Number(BRUSH_CARD_MONEY)+Number(PLEDGE_MONEY)+Number(OTHER_MONEY)+Number(NOTARY_MONEY);
	var feeObj = document.getElementById('showOrderList_guid_report2_wxcol_fee_count');
	if(feeObj != null){
		feeObj.value = feeCount;
	}
}

function getValue(obj){
	if(obj == null){
		return 0;
	}else{
		return obj.value;
	}
}