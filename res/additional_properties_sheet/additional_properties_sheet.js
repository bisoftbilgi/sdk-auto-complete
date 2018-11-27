sap.designstudio.sdk.PropertyPage.subclass("com.bisoft.customsearchbar.customSearchBarPropertyPage",  function() {

	var that = this;

	this.init = function() {
		$("#form").submit(function() {
			that.firePropertiesChanged(["color"]);
			return false;
		});
	};

	this.color = function(value) {
		if (value === undefined) {
			return $("#aps_color").val();
		}
		else {
			$("#aps_color").val(value);
			return this;
		}
	};
});