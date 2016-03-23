define(['coreui'], function(core) {
	return {
		showGeneralError: function() {
			this.showError(Localizer.get('PROJECT.COMMON.ERRORS.DEFAULT'));
		},
		showError: function(message) {
			var text = message.replace(/\[title:[^\]]+\]/g, ''),
                title = message.replace(/\[title:([^\]]+)\].*/g, '$1');
			core.services.MessageService.error(text, title);
		}
	};
});