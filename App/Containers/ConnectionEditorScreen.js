import React, { Component } from 'react';
import ConnectionEditorForm from '../Components/ConnectionEditorForm';
import { lifecycle, compose } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ConnectionsRedux from '../Redux/ConnectionsRedux';
import { ConnectionsSelectors } from '../Redux/ConnectionsRedux';

export default compose(
  connect(
    state => ({
      initialValues: ConnectionsSelectors.getConnections(state)
    }),
    dispatch =>
      bindActionCreators(
        {
          load: ConnectionsRedux.connectionsRequest
        },
        dispatch
      )
  ),
  lifecycle({
    componentDidMount() {
      this.props.load();
    }
  })
)(({ handleSubmit, initialValues, load }) => {
  return (
    <ConnectionEditorForm
      initialValues={initialValues}
      load={load}
      connectionId="default"
    />
  );
});
