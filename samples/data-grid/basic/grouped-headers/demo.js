DataGrid.dataGrid('container', {
    table: {
        columns: {
            id: ['1', '2', '3', '4'],
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5],
            url: ['http://path1.to', 'http://path2.to', 'http://path2.to', 'http://path3.to'],
            icon: ['Apples URL', 'Pears URL', 'Plums URL', 'Bananas URL']
        }
    },
    settings: {
        header: [
            {
                // headerFormat: 'Custom 1 group format',
                // useHTML: true,
                // className: 'my-first-column',
                columnId: 'id'
            },
            {
                headerFormat: 'Product',
                columns: [{
                    headerFormat: 'Product name',
                    columnId: 'product'
                }, {
                    headerFormat: 'Units',
                    columns: [{
                        columnId: 'weight'
                    }, {
                        columnId: 'price'
                    }]
                }]
            },
            {
                headerFormat: 'Product info',
                columns: [{
                    headerFormat: 'Meta',
                    columns: [{
                        columnId: 'icon'
                    }, {
                        columnId: 'url'
                    }]
                }]
            }
        ]
    },
    // defaults: {
    //     columns: {
    //         editable: true,
    //         sorting: true
    //     }
    // },
    // columns: {
    //     weight: {
    //         className: 'custom-column-class-name',
    //         cellFormatter: function () {
    //             return 'V: ' + this.value;
    //         }
    //     },
    //     metaData: {
    //         enabled: false
    //     }
    // }
});