import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import NamePrompt from '../components/NamePrompt';
import * as hookModule from '../hooks/useNamePrompt';

// Mock useNamePrompt hook
jest.mock('../hooks/useNamePrompt');

describe('NamePrompt', () => {
  const mockHook = hookModule as jest.Mocked<typeof hookModule>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render if name exists', () => {
    mockHook.useNamePrompt.mockReturnValue({
      name: 'John',
      input: '',
      setInput: jest.fn(),
      loading: false,
      error: '',
      onSubmit: jest.fn(),
    });

    const { queryByText } = render(<NamePrompt />);
    expect(queryByText('Please enter your name')).toBeNull();
  });

  it('renders modal when no name is set', () => {
    mockHook.useNamePrompt.mockReturnValue({
      name: '',
      input: '',
      setInput: jest.fn(),
      loading: false,
      error: '',
      onSubmit: jest.fn(),
    });

    const { getByText, getByPlaceholderText } = render(<NamePrompt />);

    expect(getByText('Please enter your name')).toBeTruthy();
    expect(getByPlaceholderText('Your name')).toBeTruthy();
  });

  it('displays error message if present', () => {
    mockHook.useNamePrompt.mockReturnValue({
      name: '',
      input: '',
      setInput: jest.fn(),
      loading: false,
      error: 'Name is required',
      onSubmit: jest.fn(),
    });

    const { getByText } = render(<NamePrompt />);
    expect(getByText('Name is required')).toBeTruthy();
  });

  it('disables submit button when input is empty', () => {
    mockHook.useNamePrompt.mockReturnValue({
      name: '',
      input: '',
      setInput: jest.fn(),
      loading: false,
      error: '',
      onSubmit: jest.fn(),
    });

    const { getByTestId } = render(<NamePrompt />);
    const button = getByTestId('submit-button');

    expect(button.props.accessibilityState?.disabled).toBe(true);
  });

  it('calls onSubmit when OK is pressed', async () => {
    const onSubmitMock = jest.fn();
    mockHook.useNamePrompt.mockReturnValue({
      name: '',
      input: 'Jane',
      setInput: jest.fn(),
      loading: false,
      error: '',
      onSubmit: onSubmitMock,
    });

    const { getByText } = render(<NamePrompt />);
    fireEvent.press(getByText('OK'));

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalled();
    });
  });
});
