import React from 'react';
import { Item, Input, Text, Label } from 'native-base';

const RFInput = ({
  input,
  type,
  label,
  meta: { touched, error, warning },
  inputProps = {}
}) => {
  var hasError = false;
  if (error !== undefined) {
    hasError = true;
  }
  return (
    <Item error={hasError} floatingLabel>
      <Label>{label}</Label>
      <Input {...inputProps} {...input} />

      {hasError ? <Text>{error}</Text> : <Text />}
    </Item>
  );
};

export default RFInput;
