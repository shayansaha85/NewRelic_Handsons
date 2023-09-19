import React, { Component } from 'react';
import { NerdGraphQuery, Spinner, TableChart, TableChartBuilder } from 'nr1';

export default class MyNerdpackNerdlet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: null,
      data: [],
    };
  }

  async componentDidMount() {
    const accountId = 2781667; // Hardcoded account ID

    const nrqlQuery = `SELECT * FROM NrAiIncident WHERE entity.name LIKE '210135-Partner Ready Portal (PRP)-Production' LIMIT 10 SINCE 7 DAYS AGO`;

    try {
      const response = await NerdGraphQuery.query({
        query: `
          query($accountId: Int!, $nrqlQuery: String!) {
            account(id: $accountId) {
              nrql(query: $nrqlQuery) {
                results
              }
            }
          }
        `,
        variables: {
          accountId,
          nrqlQuery,
        },
      });

      const { data } = response.data || {}; // Use object destructuring with a default empty object
  const { account } = data || {};
  const { nrql } = account || {};
  const resultArray = nrql?.results || [];

      this.setState({
        loading: false,
        data: resultArray,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      this.setState({
        loading: false,
        error,
      });
    }
  }

  render() {
    const { loading, error, data } = this.state;

    if (loading) {
      return <Spinner fillContainer />;
    }

    if (error) {
      return <div>Error fetching data: {error.message}</div>;
    }

    if (data.length === 0) {
      return <div>No data available</div>;
    }

    // Create table columns based on the data structure
    const columns = Object.keys(data[0]).map((key) => ({
      Header: key,
      accessor: key,
    }));

    return (
      <TableChartBuilder
        accountId={2781667} // Hardcoded account ID
        data={data}
        columns={columns}
      >
        {(props) => <TableChart {...props} />}
      </TableChartBuilder>
    );
  }
}
