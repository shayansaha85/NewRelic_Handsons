# Create a Table
__Difficulty Level:__ Intermediate
__Products:__ N/A

## Getting Started
For this how-to example, we are going to build a table using various components in the `nr1` library to create a table in a New Relic One application.

To get started, clone the example applications from our how-to [GitHub](https://github.com/newrelic/nr1-how-to) repo:

Next,  use the NR1 CLI to update the application UUID and run our app locally. In the terminal, change into the `./nr1-howto/create-a-table` directory.

```bash
cd /nr1-howto/create-a-table
```

Before moving forward, let's make sure we are getting data from the right New Relic account.  If you open the sample code in your preferred text editor, open the `/create-a-table/nerdlets/create-a-table-nerdlet/index.js`.

In your text editor, you want to update the line below to include your account id.

```js
this.accountId = REPLACE ME;
```

Now, we want install needed dependencies and update the UUID and serve our application.

```bash
npm install
nr1 nerdpack:uuid -gf
nr1 nerdpack:serve
```

Once your app is successfully served, in the terminal, you'll be provided with a URL to access New Relic One and see your running application.

New Relic One link: https://one.newrelic.com/?nerdpacks=local

Now on the New Relic homepage, you should have a new launcher to the how-to example.

![How to launcher image](https://github.com/newrelic/nr1-how-to/blob/master/create-a-table/screenshots/app-launcher.png)

## Why build a custom table?

Displaying data in a table is one of the most common ways of displaying small or large amounts of information in an organized and legible manner. If displaying data directly from NRDB, passing an `NRQL` query to `TableChart` is an easy way to show your telemetry data as a table.

But, when you want to have full control over your table structure, control data structures, or you are adding third-party data to your application, building your custom table becomes a great choice.

On the homepage of New Relic One, click the _How to_ launcher and take a look at the _How to: create a table_ application.

![Application Overview](https://github.com/newrelic/nr1-how-to/blob/master/create-a-table/screenshots/app-overview.png)

The starting point for the application provides a transaction overview in a `TableChart` and `AreaChart`. But, to add additional data to this application, we're going to use the `Table` components to build another table.

In the text editor of your choice open `./nr1-howto/create-a-table/nerdlets/create-a-table/index.js`. Reviewing the content of the file, find the method called `_getItems()` that looks similar to below.

```js
_getItems() {
    return [
        {
            team: 'Backend',
            company: 'Comtest',
            name: 'Web Portal',
            alertSeverity: 'CRITICAL',
            reporting: true,
            value: 0.9202394,
            commit: '0f58ef',
        },
        {
            team: 'Frontend',
            company: 'Comtest',
            name: 'Promo Service',
            alertSeverity: 'CRITICAL',
            reporting: true,
            value: 0.9123988,
            commit: 'e10fb3',
        },
        {
            team: 'DB',
            company: 'Comtest',
            name: 'Tower Portland',
            alertSeverity: 'CRITICAL',
            reporting: true,
            value: 0.82331,
            commit: 'ff8b07a',
        },
    ];
}
```

The data returned from this method serves as the third-party data that we've constructed form combining data from NRDB and an external source.

## Starting with the Table components

To start building the`Table`, we'll use the `Table` components from the nr1 library. Details about the `Table` components can are on the [New Relic developer website](https://developer.newrelic.com/client-side-sdk/index.html#components/Table).

To start building the table, in the index.js file, import the `Table` component.

```js
import { Table } from 'nr1';
```

In the empty `GridItem` with the index.js file, we're going to start building the table by adding the code below.

```js
<Table items={this._getItems()}>

</Table>
```

Looking at the `Table` component added in the last step, we are using its `item` prop to provide the data that is used when rendering the table. The `Table` component renders a fixed number of headers and rows, as its children adding the `TableHeader` components and a function that returns `TableRows` are required.

## Adding the TableHeader and TableRows

Add the `TableHeader` and `TableHeaderCell` to the import statement at the top of your file with the other components imported from `nr1`.

```js
import { TableHeader, TableHeaderCell } from 'nr1';
```

Inside of the `Table` component, add the `TableHeader` and then a `TableHeaderCell` child for each heading to be displayed.  Update your file with the code below.

```js
<TableHeader>
    <TableHeaderCell>Application</TableHeaderCell>
    <TableHeaderCell>Size</TableHeaderCell>
    <TableHeaderCell>Company</TableHeaderCell>
    <TableHeaderCell>Team</TableHeaderCell>
    <TableHeaderCell>Commit</TableHeaderCell>
</TableHeader>
```

After building the table header, the `Table` needs to a function as its second child. As the data from the `Table` component `items` prop is mapped, this function is called and returns the `TableRows` needed to display the table data.

```js
import { TableRow, TableRowCell } from 'nr1';
```

Add the code below under the `TableHeader` in the index.js file.

```js
{({ item }) => (
 <TableRow>
    <TableRowCell>{item.name}</TableRowCell>
    <TableRowCell>{item.value}</TableRowCell>
    <TableRowCell>{item.company}</TableRowCell>
    <TableRowCell>{item.team}</TableRowCell>
    <TableRowCell>{item.commit}</TableRowCell>
</TableRow>
)}
```

Take a look at the application running in New Relic One; you should have a screen similar to below.

![Added Table](https://github.com/newrelic/nr1-how-to/blob/master/create-a-table/screenshots/added-table.png)

## Using pre-defined cells

For common cell patterns like users, metrics, or entity names, the nr1 library comes with pre-defined cells that can be in a `TableRow`.  Based on the data displayed in the table, an `EntityTableRowCell` and `MetricTableRowCell` are better options than the standard row used currently.  Add in the `EntityTableRowCell` and `MetricTableRowCell` to your import statement.

```js
import { EntityTitleTableRowCell, MetricTableRowCell } from 'nr1';
```

Update the application table rows by replacing the function with the code below.

```js
{({ item }) => (
    <TableRow>
        <EntityTitleTableRowCell value={item}/>
        <TableRowCell>{item.company}</TableRowCell>
        <TableRowCell>{item.team}</TableRowCell>
        <TableRowCell>{item.commit}</TableRowCell>
        <MetricTableRowCell type={MetricTableRowCell.TYPE.APDEX} value={item.value} />
    </TableRow>
)}
```

Now that the table rows are updated. Looking at the application in New Relic One looks similar to below, taking advantage of the pre-defined cells styling and additional detail.


![predefined](https://github.com/newrelic/nr1-how-to/blob/master/create-a-table/screenshots/predefined.png)


## Adding action to your table

Building action into your New Relic One application is a critical part of going beyond what's possible with charts and dashboards. We are going to update our app to allow users to act on each row of data displayed in the table.  Add the following helper method to your index.js file just below the `_getItems()` method.

```js
_getActions() {
    return [
        {
            label: 'Alert Team',
            iconType: TableRow.ACTIONS_ICON_TYPE.INTERFACE__OPERATIONS__ALERT,
            onClick: (evt, { item, index }) => {
                alert(`Alert Team: ${item.team}`);
            },
        },
        {
            label: 'Rollback Version',
            iconType: TableRow.ACTIONS_ICON_TYPE.INTERFACE__OPERATIONS__UNDO,
            onClick: (evt, { item, index }) => {
                alert(`Rollback from: ${item.commit}`);
            },
        },
    ];
}
```

Find the `TableRow` component in your return statement and add the `actions` prop passing in the `_getActions` method. Your `TableRow` should look similar to below.

```js
<TableRow actions={this._getActions()}>
```

The `TableRow` actions prop defines a set of actions that appear when the user hovers a table row. Actions have a mandatory text and onClick callback, but can also display an icon or be disabled if needed. Passing the `_getActions` method provides the table row an array of actions to display on hover.

Now when using the app, if a user hovers a`TableRow`, the actions available appear. When clicked, the appropriate function triggers with the selected table row data as an argument. Your application should look similar to below.

![hovered](https://github.com/newrelic/nr1-how-to/blob/master/create-a-table/screenshots/hovered.png)

When an action is selected based on the provided callback function, an alert displays in your browser.

![clicked](https://github.com/newrelic/nr1-how-to/blob/master/create-a-table/screenshots/clicked.png)

## How to create a table recap

Wrapping up this how-to example, you've successfully created a `Table` using various table components from the nr1 library. Then using the `items` and `actions` props on the table elements added a custom data set to display as a set of actions a user can trigger on each `TableRow`.


More detail about all of the New Relic `Table` components, available props, and how to use them can be found on the [developer website](https://developer.newrelic.com/client-side-sdk/index.html#components/Table).

To continue your learning, take a look at our [self-paced workshop on Github](https://github.com/newrelic/nr1-workshop).
