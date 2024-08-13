Column options in the Datagrid
===
The DataGrid provides flexible configuration options to meet your specific needs.

## Including columns in DataGrid
By default, all columns from the DataTable are imported into the DataGrid in the order they are declared.
This can be modified using one of the following options:

- The optional [`settings.columns.included`](https://api.highcharts.com/dashboards/#interfaces/DataGrid_Options.ColumnsSettings#included) array of column IDs specifies which DataTable columns to import into the DataGrid and their order. It allows for excluding or reordering columns. If  not set all columns are shown in their original order.

  ```js
  dataTable: new DataTable({
    columns: {
      a: [...],
      b: [...],
      c: [...]
    }
  }),
  settings: {
    columns: {
      included: ['c', 'a']
    }
  }
  ```

- The optional [`columns`](https://api.highcharts.com/dashboards/#interfaces/DataGrid_Options.IndividualColumnOptions) root option can further configure these included columns, and [`columns[columnId].enabled`](https://api.highcharts.com/dashboards/#interfaces/DataGrid_Options.IndividualColumnOptions#enabled) can exclude specific columns.

Note: If `settings.columns.included` is not set, the `columns` root option can configure all DataTable columns.

  ```js
  dataTable: new DataTable({
    columns: {
      a: [...],
      b: [...],
      c: [...]
    }
  }),
  columns: {
    a: {
      enabled: false
    }
  }
  ```

## Defaults
By default, the options from the [defaults](https://api.highcharts.com/dashboards/#interfaces/DataGrid_DataGridDefaults) property are applied to all columns.
For instance, you can allow editing of cells in all columns in `default.columns` instead of applying an option to each column separately.

```js
defaults: {
  columns: {
    editable: true
  }
}
```

## Column header
In columns options, use [headerFormat](https://api.highcharts.com/dashboards/#interfaces/DataGrid_DataGridOptions.ColumnOptions#headerFormat) to customize the header content for that column.

```js
columns: {
  column1: {
    headerFormat: 'Custom header text'
  }
}
```

## How to format cells
The [cellFormat](https://api.highcharts.com/dashboards/#interfaces/DataGrid_DataGridOptions.ColumnOptions#cellFormat) or [cellFormatter](https://api.highcharts.com/dashboards/#interfaces/DataGrid_DataGridOptions.ColumnOptions#cellFormatter) option allow you to customize the cells content and format in that column.


```js
columns: {
  column1: {
    cellFormatter: function () {
        return 'V: ' + this.value;
    }
  },
  column2: {
    cellFormat: '{value}$'
  }
```

### How to edit cells
Every cell in a column can be edited on the fly by the end user. Set the [editable](https://api.highcharts.com/dashboards/typedoc/interfaces/DataGrid_DataGridOptions.IndividualColumnOptions.html#editable) option to true.

```js
columns {
  column1: {
    editable: true
  }
}
```

You can also use the [defaults.columns.editable](https://api.highcharts.com/dashboards/#interfaces/DataGrid_DataGridDefaults) property to enable editing of all cells in the DataGrid. This default setting can then be overridden by one or more columns if needed.

## Events
The DataGrid supports event listeners that can be added to the column [events](https://api.highcharts.com/dashboards/#interfaces/DataGrid_DataGridOptions.IndividualColumnOptions.html#events) object which will call functions when editing the cell or column.

The available events are:

 - `cell`
    - `click` - called after click on a cell,
    - `mouseOver` - called after mouse over a cell,
    - `mouseOut` - called after mouse out a cell
    - `afterEdit` - called after a cell was edited
 - `column`
    - `afterSorting` - called after sorting a column
    - `afterResize` - called after resizing a column
 - `header`
    - `click` - called after a click on a column header

Example:
```js
events: {
  cell: {
    afterEdit: function () {
      // your action
    }
  },
  column: {
    afterResize: function () {
      // your action
    }
  },
  header: {
    click: function () {
      // your action
    }
  }
}
```

## Sorting

The optional `sorting` object consists of two configuration options:
- **`sortable`**: A boolean that determines whether a column can be sorted by the end user clicking on the column header.

- **`order`**: Specifies the initial sorting order for a column. It can be set to `'asc'` (ascending) or `'desc'` (descending). If `order` is defined in multiple columns only the last one will be considered.

See the [API reference](https://api.highcharts.com/dashboards/#interfaces/DataGrid_DataGridOptions.IndividualColumnOptions.html#sorting).

When the `sortable` option is enabled, clicking on the header will toggle the sorting order.

The sorting options are available for the individual `columns`.

```js
columns: {
  column1: {
    sorting: {
      sortable: true,
      order: 'desc'
    }
  }
}
```

But you can also turn off `sortable` for all columns using the [`defaults`](https://api.highcharts.com/dashboards/#interfaces/DataGrid_Options.DataGridDefaults) option as described in the first point.

```js
defaults {
  columns: {
    sorting: {
      sortable: false
    }
  }
}
```

Additionally, you can programmatically sort a column using the [`column.sorting.setOrder`](http://localhost:9005/dashboards/#classes/DataGrid_Actions_ColumnSorting.ColumnSorting#setOrder) method, even if the sortable option is turned off.