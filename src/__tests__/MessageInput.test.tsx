import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { MessageInput } from '../components/MessageInput';

describe('MessageInput', () => {
  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <MessageInput onSend={jest.fn()} />,
    );

    expect(getByPlaceholderText('Message')).toBeTruthy();
    expect(getByText('Send')).toBeTruthy();
  });

  it('does not call onSend when input is empty', () => {
    const mockOnSend = jest.fn();

    const { getByText } = render(<MessageInput onSend={mockOnSend} />);

    fireEvent.press(getByText('Send'));

    expect(mockOnSend).not.toHaveBeenCalled();
  });

  it('calls onSend with trimmed input text and clears input', () => {
    const mockOnSend = jest.fn();

    const { getByPlaceholderText, getByText } = render(
      <MessageInput onSend={mockOnSend} />,
    );

    const input = getByPlaceholderText('Message');

    fireEvent.changeText(input, '  Hello world!  ');
    fireEvent.press(getByText('Send'));

    expect(mockOnSend).toHaveBeenCalledWith('Hello world!');
    expect(input.props.value).toBe('');
  });

  it('sends message when submitting via keyboard return key', () => {
    const mockOnSend = jest.fn();

    const { getByPlaceholderText } = render(
      <MessageInput onSend={mockOnSend} />,
    );

    const input = getByPlaceholderText('Message');

    fireEvent.changeText(input, 'Keyboard test');
    fireEvent(input, 'submitEditing');

    expect(mockOnSend).toHaveBeenCalledWith('Keyboard test');
  });
});
