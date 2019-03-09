import React, { Fragment } from 'react';
import { ScrollView, Text, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import { Field, reduxForm, FormSection } from 'redux-form';
// import styles from './Styles/ConnectionEditorFormStyle';
import RFInput from '../Components/RFInput';
import { compose } from 'recompose';
import { Form, Button, Item, Header, Right, Container } from 'native-base';
import { saveConnections } from '../Services/ConnectionStorage';

const ConnectionEditorForm = ({ connectionId, handleSubmit }) => {
  return (
    <Container>
      <FormSection component={Fragment} name={connectionId}>
        <Header>
          <Right>
            <Button success onPress={handleSubmit}>
              <Text>Save</Text>
            </Button>
          </Right>
        </Header>
        <KeyboardAvoidingView behavior="position">
          <Form>
            <Field name="hostname" label="Host Name" component={RFInput} />
            <Field
              name="port"
              label="Port"
              component={RFInput}
              inputProps={{ keyboardType: 'numeric' }}
              format={value => (value === undefined ? '' : `${value}`)}
            />
            <Field name="username" label="User Name" component={RFInput} />
            <Field
              name="password"
              label="Password"
              component={RFInput}
              inputProps={{ secureTextEntry: true }}
            />
            <Field name="deviceId" label="Device ID" component={RFInput} />
          </Form>
        </KeyboardAvoidingView>
      </FormSection>
    </Container>
  );
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  reduxForm({
    form: 'ConnectionEditorForm',
    async onSubmit(data, dispatch, props) {
      const output = {};

      for (const uid of Object.keys(data)) {
        const item = data[uid];
        if (typeof item !== 'object') {
          continue;
        }
        output[uid] = { ...item, port: parseInt(item.port, 10) || 1884 };
      }

      await saveConnections(output);
      props.load();
    }
  })
)(ConnectionEditorForm);
