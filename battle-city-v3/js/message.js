atom.declare('BattleCity.Message', App.Element, {

    configure: function () {
        this.messageApearedTime = Date.now();
    },

    renderTo : function(ctx, resources) {
        ctx.text({
            to   : this.shape,
            text : this.settings.get('value'),
            size: 12,
            family : 'prstart',
            color : '#fff'
        });
    },

    onUpdate : function(time) {
        var timeOut = 500;
        var now = Date.now();
        if (now > this.messageApearedTime + timeOut) {
            this.destroy();
        }
    }

});