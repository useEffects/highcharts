/* *
 *
 *  (c) 2009-2024 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sophie Bremer
 *  - Gøran Slettemark
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */


import type DataEvent from './DataEvent.js';
import type DataTable from './DataTable.js';
import type DataTableOptions from './DataTableOptions.js';

import U from '../Core/Utilities.js';
const {
    fireEvent,
    isArray,
    objectEach,
    uniqueKey
} = U;


/* *
 *
 *  Class
 *
 * */


/**
 * Class to manage columns and rows in a table structure. It provides methods
 * to add, remove, and manipulate columns and rows, as well as to retrieve data
 * from specific cells.
 *
 * @class
 * @name Highcharts.DataTable
 *
 * @param {Highcharts.DataTableOptions} [options]
 * Options to initialize the new DataTable instance.
 */
class DataTableCore {

    /**
     * Constructs an instance of the DataTable class.
     *
     * @param {Highcharts.DataTableOptions} [options]
     * Options to initialize the new DataTable instance.
     */
    public constructor(
        options: DataTableOptions = {}
    ) {
        this.columns = {};

        /**
         * Whether the ID was automatic generated or given in the constructor.
         *
         * @name Highcharts.DataTable#autoId
         * @type {boolean}
         */
        this.autoId = !options.id;
        this.columns = {};

        /**
         * ID of the table for indentification purposes.
         *
         * @name Highcharts.DataTable#id
         * @type {string}
         */
        this.id = (options.id || uniqueKey());
        this.modified = this;
        this.rowCount = 0;
        this.versionTag = uniqueKey();

        let rowCount = 0;

        objectEach(options.columns || {}, (column, columnName): void => {
            this.columns[columnName] = column.slice();
            rowCount = Math.max(rowCount, column.length);
        });

        this.applyRowCount(rowCount);

    }

    /* *
     *
     *  Properties
     *
     * */

    public readonly autoId: boolean;

    protected columns: Record<string, DataTable.Column>;

    public readonly id: string;

    public modified: DataTableCore;

    // @note Made this public because we're using it for quick checks in
    // Highcharts
    public rowCount: number;

    protected versionTag: string;

    /* *
     *
     *  Functions
     *
     * */


    /**
     * Applies a row count to the table by setting the `rowCount` property and
     * adjusting the length of all columns.
     * @param {number} rowCount The new row count.
     */
    protected applyRowCount(
        rowCount: number
    ): void {
        this.rowCount = rowCount;
        objectEach(this.columns, (column): void => {
            if (isArray(column)) { // Not on typed array
                column.length = rowCount;
            }
        });
    }

    /**
     * Simplified version of the full `getRow` method, not supporting aliases,
     * and always returning by reference.
     *
     * @param {string} columnName
     * Name of the column to get, alias takes precedence.
     *
     * @return {Highcharts.DataTableColumn|undefined}
     * A copy of the column, or `undefined` if not found.
     */
    public getColumn(
        columnName: string,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        asReference?: true
    ): (DataTable.Column|undefined) {
        return this.columns[columnName];
    }

    /**
     * Simplified version of the full `getColumns` method, not supporting
     * aliases, and always returning by reference.
     *
     * @param {Array<string>} [columnNames]
     * Column names to retrieve.
     *
     * @return {Highcharts.DataTableColumnCollection}
     * Collection of columns. If a requested column was not found, it is
     * `undefined`.
     */
    public getColumns(
        columnNames?: Array<string>,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        asReference?: true
    ): DataTable.ColumnCollection {
        return (columnNames || Object.keys(this.columns)).reduce(
            (columns, columnName): DataTable.ColumnCollection => {
                columns[columnName] = this.columns[columnName];
                return columns;
            },
            {} as DataTable.ColumnCollection
        );
    }

    /**
     * Simplified version of the full `getRow` method, not supporting aliases.
     *
     * @param {number} rowIndex
     * Row index to retrieve. First row has index 0.
     *
     * @param {Array<string>} [columnNames]
     * Column names or aliases in order to retrieve.
     *
     * @return {Highcharts.DataTableRow}
     * Returns the row values, or `undefined` if not found.
     */
    public getRow(
        rowIndex: number,
        columnNames?: Array<string>
    ): (DataTable.Row|undefined) {
        return (columnNames || Object.keys(this.columns)).map(
            (key): DataTableCore.CellType => this.columns[key]?.[rowIndex]
        );
    }

    /**
     * Sets cell values for a column. Will insert a new column, if not found.
     *
     * @function Highcharts.DataTable#setColumn
     *
     * @param {string} columnNameOrAlias
     * Column name or alias to set.
     *
     * @param {Highcharts.DataTableColumn} [column]
     * Values to set in the column.
     *
     * @param {number} [rowIndex=0]
     * Index of the first row to change. (Default: 0)
     *
     * @param {Highcharts.DataTableEventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @emits #setColumns
     * @emits #afterSetColumns
     */
    public setColumn(
        columnNameOrAlias: string,
        column: DataTable.Column = [],
        rowIndex: number = 0,
        eventDetail?: DataEvent.Detail
    ): void {
        this.setColumns({ [columnNameOrAlias]: column }, rowIndex, eventDetail);
    }

    /**
     * The simplified version of the full `setColumns`, limited to full
     * replacement of the columns (undefined `rowIndex`)
     *
     * @function Highcharts.DataTable#setColumns
     *
     * @param {Highcharts.DataTableColumnCollection} columns
     * Columns as a collection, where the keys are the column names or aliases.
     *
     * @param {number} [rowIndex]
     * Index of the first row to change. Keep undefined to reset.
     *
     * @param {Highcharts.DataTableEventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @emits #setColumns
     * @emits #afterSetColumns
     */
    public setColumns(
        columns: DataTable.ColumnCollection,
        rowIndex?: number,
        eventDetail?: DataEvent.Detail
    ): void {
        let rowCount = this.rowCount;

        objectEach(columns, (column, columnName): void => {
            this.columns[columnName] = column.slice();
            rowCount = column.length;
        });

        this.applyRowCount(rowCount);

        if (!eventDetail?.silent) {
            fireEvent(this, 'afterSetColumns');
            this.versionTag = uniqueKey();
        }
    }

    /**
     * A smaller version of the full DateTable.setRow, limited to objects
     */
    public setRow(
        row: DataTable.RowObject,
        rowIndex: number = this.rowCount,
        insert?: boolean,
        eventDetail?: DataEvent.Detail
    ): void {
        const { columns } = this,
            indexRowCount = insert ? this.rowCount + 1 : rowIndex + 1;

        objectEach(row, (cellValue, columnName): void => {
            const column = columns[columnName] || new Array(indexRowCount);
            if (insert) {
                column.splice(rowIndex, 0, cellValue);
            } else {
                column[rowIndex] = cellValue;
            }
            columns[columnName] = column;
        });

        if (indexRowCount > this.rowCount) {
            this.applyRowCount(indexRowCount);
        }

        if (!eventDetail?.silent) {
            fireEvent(this, 'afterSetRows');
            this.versionTag = uniqueKey();
        }
    }
}

/* *
 *
 *  Class Namespace
 *
 * */

/**
 * Additionally it provides necessary types for events.
 */
namespace DataTableCore {

    /* *
     *
     *  Declarations
     *
     * */

    /**
     * Possible value types for a table cell.
     */
    export type CellType = (boolean|number|null|string|undefined);

    /**
     * Array of table cells in vertical expansion.
     */
    export interface Column extends Array<DataTable.CellType> {
        [index: number]: CellType;
    }

    /**
     * Collection of columns, where the key is the column name (or alias) and
     * the value is an array of column values.
     */
    export interface ColumnCollection {
        [columnNameOrAlias: string]: Column;
    }

    /**
     * Event object for column-related events.
     */
    export interface ColumnEvent extends DataEvent {
        readonly type: (
            'deleteColumns'|'afterDeleteColumns'|
            'setColumns'|'afterSetColumns'
        );
        readonly columns?: ColumnCollection;
        readonly columnNames: Array<string>;
        readonly rowIndex?: number;
    }

    /**
     * All information objects of DataTable events.
     */
    export type Event = (
        ColumnEvent|
        RowEvent
    );

    /**
     * Array of table cells in horizontal expansion. Index of the array is the
     * index of the column names.
     */
    export interface Row extends Array<CellType> {
        [index: number]: CellType;
    }

    /**
     * Event object for row-related events.
     */
    export interface RowEvent extends DataEvent {
        readonly type: (
            'deleteRows'|'afterDeleteRows'|
            'setRows'|'afterSetRows'
        );
        readonly rowCount: number;
        readonly rowIndex: number;
        readonly rows?: Array<(Row|RowObject)>;
    }

    /**
     * Object of row values, where the keys are the column names.
     */
    export interface RowObject extends Record<string, CellType> {
        [column: string]: CellType;
    }
}


/* *
 *
 *  Default Export
 *
 * */


export default DataTableCore;
