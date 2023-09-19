import React from 'react';
import { BillboardChart, Grid, GridItem } from 'nr1';

export default class BillboardNerdlet extends React.Component {
  render() {
    return (
      <Grid>
        <GridItem columnSpan={12}>
          <BillboardChart
            fullWidth
            accountId="2781667"
            query="SELECT count(*) FROM Transaction SINCE 1 second ago"
          />
        </GridItem>
      </Grid>
    );
  }
}
