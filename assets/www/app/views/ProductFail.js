appCart.views.ProductFail = Ext.extend(Ext.Panel, {
    
    layout: 'fit',
    dockedItems: [{
        xtype: 'toolbar',
        title: 'Producto',
        items: [
         	{
                text: 'Escanear',
                ui: 'back',
                listeners: {
                    'tap': function () {
                        Ext.dispatch({
                           controller: appCart.controllers.shoppingCart,
                           action: 'scanProduct'
                        });
                    }
                }
            },
            {xtype:'spacer'},
            {
                id: 'view_shopping_cart',
                text: 'Ver Carrito',
                ui: 'action',
                listeners: {
                    'tap': function () {
                        Ext.dispatch({
                           controller: appCart.controllers.shoppingCart,
                           action: 'viewItems'
                        });
                    }
                }
            }
        ]
    }],
    items: [],
    html: '<br /><br /><h1>The product couldn\'t be scanned</h1>',
    initComponent: function() {
        appCart.views.ProductFail.superclass.initComponent.apply(this, arguments);
    }
});