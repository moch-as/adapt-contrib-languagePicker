define([
        'core/js/adapt',
        'backbone'
], function (Adapt, Backbone) {
    
    var LanguagePickerModel = Backbone.Model.extend({
        
        defaults: {
            "_isEnabled": false,
            "displayTitle": "",
            "body": "",
            "_languages": []
        },
        
        initialize: function () {
            this.listenTo(Adapt.config, 'change:_activeLanguage', this.onConfigChange);
        },

        getLanguageDetails: function (language) {
            var languageid = language.split('_').pop();
            var _languages = this.get('_languages');
            return _.find(_languages, function (item) {
                return (item._language == languageid);
            });
        },

        setLanguage: function (language) {
            Adapt.config.set({
                '_activeLanguage': language,
                '_defaultDirection': this.getLanguageDetails(language)._direction
            });
        },
        
        onConfigChange: function (model, value, options) {
            this.markRoleAsSelected(value);
            this.markLanguageAsSelected(value);
        },
        
        markLanguageAsSelected: function(language) {
            var languages = this.get('_languages');

            for (var i = 0; i < languages.length; i++)
            {
                if (languages[i]._language === language.split('_').pop())
                {
                    languages[i]._isSelected = true;
                }
                else
                {
                    languages[i]._isSelected = false;
                }
            }

            this.set('_languages', languages);
        },
        
        markRoleAsSelected: function(language) {
            var roles = this.get('_roles');

            for (var i = 0; i < roles.length; i++)
            {
                if (roles[i]._role === language.split('_').shift())
                {
                    roles[i]._isSelected = true;
                }
                else
                {
                    roles[i]._isSelected = false;
                }
            }

            this.set('_roles', roles);
        },
        
        getSelectedLanguageId: function() {
            var roles = this.get('_roles');
            var languages = this.get('_languages');
            var selectedrole = _.find(roles, function (role) {
                return role._isSelected;
            });
            var selectedlanguage = _.find(languages, function (language) {
                return language._isSelected;
            });
            return (selectedrole && selectedlanguage) ? selectedrole._role + '_' + selectedlanguage._language : '';
        }
    });
    
    return LanguagePickerModel;
});
