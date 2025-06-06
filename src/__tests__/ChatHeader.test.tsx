import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { ChatHeader } from '../components/ChatHeader';

// Mock expo-router's useRouter
const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: mockBack,
  }),
}));

describe('ChatHeader', () => {
  it('renders the title', () => {
    const { getByText } = render(<ChatHeader title="Alice" />);
    expect(getByText('Alice')).toBeTruthy();
  });

  it('calls router.back when back button is pressed', () => {
    const { getByTestId } = render(<ChatHeader title="Chat" />);
    const button = getByTestId('back-button');
    fireEvent.press(button);
    expect(mockBack).toHaveBeenCalled();
  });
});
