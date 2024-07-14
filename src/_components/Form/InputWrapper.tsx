import { Input } from '@mantine/core';
import { FormikErrors } from 'formik';

interface InputWrapperProps {
  name: string;
  label: string;
  onBlur?: (e: React.FocusEvent<any>) => void
  description?: string;
  error?: FormikErrors<string | false | undefined>;
  placeholder?: string;
  withAsterisk?: boolean
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputWrapper({ name, label, onBlur, description, error, placeholder, withAsterisk, value, onChange }: InputWrapperProps) {
  return (
    <Input.Wrapper
      label={label}
      description={description}
      error={error}
      withAsterisk={withAsterisk}
      onBlur={onBlur}
      mb={15}
    >
      <Input
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </Input.Wrapper>
  );
};